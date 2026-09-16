import type { CollectionBeforeChangeHook, CollectionConfig } from 'payload'
import { convertLexicalToHTML } from '@payloadcms/richtext-lexical/html'

import { adminOnly } from '@/access/adminOnly'
import { correoBoletin, enviarLote, enviarCorreo, hayCorreo, marcaCorreo } from '@/correo'

/**
 * Envíos del boletín: se redacta aquí y se manda a todos los suscriptores
 * activos.
 *
 * Para evitar envíos por accidente hay dos pasos: primero se puede mandar una
 * prueba a un correo, y el envío real exige marcar la casilla de confirmación
 * y guardar. Un envío ya hecho no se puede repetir.
 */

const urlSitio = () => (process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000').replace(/\/$/, '')

const enviar: CollectionBeforeChangeHook = async ({ data, originalDoc, req }) => {
  const quierePrueba = data.enviarPrueba && data.correoPrueba
  const quiereEnviar = data.confirmarEnvio && originalDoc?.estado !== 'enviado'
  data.enviarPrueba = false
  data.confirmarEnvio = false
  if (!quierePrueba && !quiereEnviar) return data

  if (!hayCorreo()) {
    data.resultado = 'No se envió: falta configurar la clave de Resend en el servidor.'
    return data
  }

  const [avisos, negocio]: any[] = await Promise.all([
    req.payload.findGlobal({ slug: 'avisos', overrideAccess: true, req }),
    req.payload.findGlobal({ slug: 'tienda', overrideAccess: true, depth: 1, req }),
  ])
  const remitente = avisos?.remitente
  if (!remitente) {
    data.resultado = 'No se envió: falta "Quién envía los correos" en Configuración → Correos y avisos.'
    return data
  }

  const cuerpo = data.contenido ? convertLexicalToHTML({ data: data.contenido, disableContainer: true }) : ''
  const html = (enlaceBaja: string) =>
    correoBoletin({ negocio: marcaCorreo(negocio, urlSitio()), asunto: data.asunto, cuerpo, enlaceBaja, urlSitio: urlSitio() })

  if (quierePrueba) {
    const r = await enviarCorreo({
      para: data.correoPrueba,
      remitente,
      asunto: `[Prueba] ${data.asunto}`,
      html: html(`${urlSitio()}/boletin/baja`),
    })
    data.resultado = r.ok ? `Prueba enviada a ${data.correoPrueba}.` : `La prueba falló: ${r.error}`
    if (!quiereEnviar) return data
  }

  const lista = await req.payload.find({
    collection: 'suscriptores',
    where: { estado: { equals: 'activo' } },
    limit: 10000,
    pagination: false,
    overrideAccess: true,
    showHiddenFields: true,
    req,
  })
  if (!lista.docs.length) {
    data.resultado = 'No se envió: todavía no hay suscriptores activos.'
    return data
  }

  const correos = lista.docs.map((s: any) => {
    const baja = `${urlSitio()}/boletin/baja?c=${s.codigoBaja}`
    return {
      para: s.correo,
      remitente,
      asunto: data.asunto,
      html: html(baja),
      // El botón "Cancelar suscripción" de Gmail hace POST a esta dirección.
      cabeceras: {
        'List-Unsubscribe': `<${urlSitio()}/next/boletin/baja?c=${s.codigoBaja}>`,
        'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
      },
    }
  })
  const r = await enviarLote(correos)
  data.estado = r.enviados > 0 ? 'enviado' : 'borrador'
  data.enviadoEl = new Date().toISOString()
  data.destinatarios = r.enviados
  data.resultado = r.fallidos
    ? `Enviado a ${r.enviados} de ${correos.length}. Fallaron ${r.fallidos}: ${r.error ?? ''}`
    : `Enviado a ${r.enviados} suscriptores.`
  return data
}

export const Boletines: CollectionConfig = {
  slug: 'boletines',
  labels: { singular: 'Envío del boletín', plural: 'Envíos del boletín' },
  admin: {
    group: 'Blog y boletín',
    useAsTitle: 'asunto',
    defaultColumns: ['asunto', 'estado', 'destinatarios', 'enviadoEl'],
    description: 'Redacta un correo y envíalo a todos tus suscriptores. Manda primero una prueba a tu correo.',
  },
  access: { read: adminOnly, create: adminOnly, update: adminOnly, delete: adminOnly },
  hooks: { beforeChange: [enviar] },
  fields: [
    { name: 'asunto', type: 'text', label: 'Asunto del correo', required: true },
    { name: 'contenido', type: 'richText', label: 'Texto del correo' },
    {
      name: 'estado',
      type: 'select',
      label: 'Estado',
      defaultValue: 'borrador',
      options: [
        { label: 'Borrador', value: 'borrador' },
        { label: '✅ Enviado', value: 'enviado' },
      ],
      admin: { position: 'sidebar', readOnly: true },
    },
    {
      name: 'resultado',
      type: 'textarea',
      label: 'Resultado del último intento',
      admin: { position: 'sidebar', readOnly: true, condition: (d) => Boolean(d?.resultado) },
    },
    { name: 'destinatarios', type: 'number', label: 'Enviado a', admin: { position: 'sidebar', readOnly: true, condition: (d) => d?.estado === 'enviado' } },
    { name: 'enviadoEl', type: 'date', label: 'Enviado el', admin: { position: 'sidebar', readOnly: true, condition: (d) => d?.estado === 'enviado', date: { pickerAppearance: 'dayAndTime' } } },
    {
      name: 'correoPrueba',
      type: 'email',
      label: '1. Correo para la prueba',
      admin: { position: 'sidebar', condition: (d) => d?.estado !== 'enviado' },
    },
    {
      name: 'enviarPrueba',
      type: 'checkbox',
      label: 'Enviar la prueba al guardar',
      admin: { position: 'sidebar', description: 'Marca y pulsa Guardar.', condition: (d) => d?.estado !== 'enviado' },
    },
    {
      name: 'confirmarEnvio',
      type: 'checkbox',
      label: '2. Sí, enviar ahora a todos los suscriptores activos',
      admin: { position: 'sidebar', description: 'Marca y pulsa Guardar. No se puede deshacer.', condition: (d) => d?.estado !== 'enviado' },
    },
  ],
}
