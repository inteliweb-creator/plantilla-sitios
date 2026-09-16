import type { GlobalConfig } from 'payload'
import { revalidateTag } from 'next/cache'

import { adminOnly } from '@/access/adminOnly'
import { moverFechasLegales } from '@/bloques/sitio/legal/fechas'

/**
 * Ventanas de conversión: un aviso cuando alguien está por irse y una
 * burbuja de WhatsApp tras unos segundos. Se muestran con mesura: si la
 * persona las cierra, no vuelven a aparecer durante los días indicados.
 */
export const Ventanas: GlobalConfig = {
  slug: 'ventanas',
  label: 'Ventanas de conversión',
  admin: {
    group: 'Configuración',
    description: 'Un aviso cuando alguien va a salir del sitio y una burbuja que invita a escribir por WhatsApp. Úsalas con moderación: molestar ahuyenta.',
  },
  access: { read: () => true, update: adminOnly },
  hooks: {
    afterChange: [
      async ({ doc, previousDoc, req }) => {
        if (req.context?.disableRevalidate) return doc
        revalidateTag('global_ventanas', 'max')
        await moverFechasLegales(req, { ventanas: previousDoc }, { ventanas: doc })
        return doc
      },
    ],
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Al intentar salir',
          description: 'En computador aparece cuando el ratón va a cerrar la pestaña; en celular, cuando la persona sube rápido después de leer un buen trozo.',
          fields: [
            { name: 'salidaActiva', type: 'checkbox', label: 'Activar', defaultValue: false },
            { name: 'salidaTitulo', type: 'text', label: 'Título', defaultValue: '¿Te vas sin resolver tu duda?' },
            { name: 'salidaTexto', type: 'textarea', label: 'Texto', defaultValue: 'Escríbenos por WhatsApp y te respondemos en minutos, sin compromiso.' },
            {
              name: 'salidaAccion',
              type: 'select',
              label: 'Qué hace el botón',
              defaultValue: 'whatsapp',
              options: [
                { label: 'Abrir WhatsApp', value: 'whatsapp' },
                { label: 'Ir a una página', value: 'enlace' },
                { label: 'Ofrecer un recurso gratis', value: 'recurso' },
              ],
            },
            {
              type: 'row',
              fields: [
                { name: 'salidaBoton', type: 'text', label: 'Texto del botón', defaultValue: 'Escribir por WhatsApp' },
                { name: 'salidaMensajeWhatsapp', type: 'text', label: 'Mensaje de WhatsApp', admin: { condition: (d) => d?.salidaAccion === 'whatsapp' } },
                { name: 'salidaEnlace', type: 'text', label: 'Dirección', admin: { condition: (d) => d?.salidaAccion === 'enlace', placeholder: '/contacto' } },
                { name: 'salidaRecurso', type: 'relationship', relationTo: 'recursos', label: 'Recurso', admin: { condition: (d) => d?.salidaAccion === 'recurso' } },
              ],
            },
            {
              type: 'row',
              fields: [
                { name: 'salidaDias', type: 'number', label: 'Días sin repetir tras cerrarla', defaultValue: 7, min: 1, max: 365 },
                { name: 'salidaSegundosMinimos', type: 'number', label: 'Segundos mínimos en el sitio', defaultValue: 10, min: 0, admin: { description: 'No aparece a quien acaba de llegar.' } },
              ],
            },
            {
              name: 'salidaExcluir',
              type: 'text',
              hasMany: true,
              label: 'No mostrar en estas direcciones',
              defaultValue: ['/contacto', '/checkout'],
              admin: { description: 'Empiezan por /. Ej: /contacto excluye también /contacto/gracias.' },
            },
          ],
        },
        {
          label: 'Burbuja de WhatsApp',
          description: 'Un mensaje junto al botón de WhatsApp, como si alguien del negocio saludara. Necesita el número en "Datos del negocio".',
          fields: [
            { name: 'burbujaActiva', type: 'checkbox', label: 'Activar', defaultValue: false },
            { name: 'burbujaMensaje', type: 'text', label: 'Mensaje', defaultValue: 'Hola 👋 ¿Tienes alguna pregunta? Te ayudamos por WhatsApp.' },
            {
              type: 'row',
              fields: [
                { name: 'burbujaSegundos', type: 'number', label: 'Aparece a los (segundos)', defaultValue: 25, min: 3, max: 600 },
                { name: 'burbujaDias', type: 'number', label: 'Días sin repetir tras cerrarla', defaultValue: 1, min: 1, max: 365 },
              ],
            },
            { name: 'burbujaExcluir', type: 'text', hasMany: true, label: 'No mostrar en estas direcciones', defaultValue: ['/checkout'] },
          ],
        },
      ],
    },
  ],
}
