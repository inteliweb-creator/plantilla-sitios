import type { Payload } from 'payload'

import { correoAvisoSuscripcion, correoBienvenida, enviarCorreo, marcaCorreo } from '@/correo'
import { modulosActivos } from '@/modulos'

/**
 * Alta en el boletín, compartida por el formulario del boletín y por los
 * recursos gratis (cuando la persona marca que quiere recibirlo).
 *
 * Si ya estaba y se había dado de baja, vuelve a quedar activo: lo está
 * pidiendo de nuevo. Solo quien queda activo por primera vez (o de nuevo)
 * recibe la bienvenida y genera el aviso al negocio.
 */
export async function suscribir(
  payload: Payload,
  { correo, nombre, origen, base }: { correo: string; nombre?: string; origen?: string; base: string },
): Promise<{ nuevo: boolean }> {
  let suscriptor: any
  let nuevo = false
  const existe = await payload.find({ collection: 'suscriptores', where: { correo: { equals: correo } }, limit: 1, overrideAccess: true, showHiddenFields: true })
  if (existe.docs[0]) {
    suscriptor = existe.docs[0]
    if (suscriptor.estado !== 'activo') {
      suscriptor = await payload.update({
        collection: 'suscriptores',
        id: suscriptor.id,
        data: { estado: 'activo', fechaBaja: null, ...(nombre && !suscriptor.nombre ? { nombre } : {}) },
        overrideAccess: true,
        showHiddenFields: true,
      })
      nuevo = true
    }
  } else {
    suscriptor = await payload.create({
      collection: 'suscriptores',
      data: { correo, nombre: nombre || undefined, estado: 'activo', origen },
      overrideAccess: true,
      showHiddenFields: true,
    })
    nuevo = true
  }

  if (nuevo) {
    try {
      const [avisos, negocio, blog]: any[] = await Promise.all([
        payload.findGlobal({ slug: 'avisos', overrideAccess: true }),
        payload.findGlobal({ slug: 'tienda', overrideAccess: true, depth: 1 }),
        payload.findGlobal({ slug: 'blog', overrideAccess: true }),
      ])
      const marca = marcaCorreo(negocio, base, await modulosActivos())
      const remitente = avisos?.remitente
      if (remitente) {
        const tareas = [
          enviarCorreo({
            para: correo,
            remitente,
            tipo: 'bienvenida',
            asunto: `¡Bienvenido al boletín de ${negocio?.nombre || 'nuestro sitio'}!`,
            html: correoBienvenida(marca, blog?.bienvenida || '', `${base}/boletin/baja?c=${suscriptor.codigoBaja}`),
          }),
        ]
        if (avisos.correoAvisos && blog?.avisarSuscripcion !== false) {
          tareas.push(
            enviarCorreo({
              para: avisos.correoAvisos,
              remitente,
              responderA: correo,
              tipo: 'aviso-suscripcion',
              asunto: `Nuevo suscriptor: ${nombre || correo}`,
              html: correoAvisoSuscripcion(marca, correo, nombre || '', origen || '', `${base}/admin/collections/suscriptores/${suscriptor.id}`),
            }),
          )
        }
        const r = await Promise.all(tareas)
        r.filter((x) => !x.ok).forEach((x) => payload.logger.warn(`Correo de suscripción no enviado: ${x.error}`))
      }
    } catch (e: any) {
      payload.logger.error(`Error en los correos de suscripción: ${e?.message}`)
    }
  }
  return { nuevo }
}
