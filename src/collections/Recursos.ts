import type { Access, CollectionConfig } from 'payload'
import { slugField } from 'payload'
import { revalidatePath, revalidateTag } from 'next/cache'

import { adminOnly } from '@/access/adminOnly'
import { adminOnlyFieldAccess } from '@/access/adminOnlyFieldAccess'
import { checkRole } from '@/access/utilities'
import { slugEnEspanol } from '@/utilities/slug'

const leer: Access = ({ req: { user } }) => (user && checkRole(['admin'], user as any) ? true : { publicado: { equals: true } })

/**
 * Recursos gratis a cambio del correo: una guía en PDF, una plantilla, un
 * video… La persona deja su nombre y correo y recibe el enlace de descarga.
 * El archivo nunca se muestra en la página: solo se entrega con un enlace
 * firmado que vence.
 */
export const Recursos: CollectionConfig = {
  slug: 'recursos',
  labels: { singular: 'Recurso gratis', plural: 'Recursos gratis' },
  admin: {
    group: 'Blog y boletín',
    useAsTitle: 'titulo',
    defaultColumns: ['titulo', 'publicado', 'descargas', 'updatedAt'],
    description: 'Guías, plantillas o videos que la gente recibe a cambio de su correo. Cada uno tiene su propia página en /recursos/… y puedes ofrecerlo al final de un artículo.',
    preview: (data) => `/recursos/${data?.slug ?? ''}`,
  },
  access: { read: leer, create: adminOnly, update: adminOnly, delete: adminOnly },
  hooks: {
    afterChange: [
      ({ doc, previousDoc, req }) => {
        if (req.context?.disableRevalidate) return doc
        revalidateTag('recursos', 'max')
        revalidatePath('/recursos')
        revalidatePath(`/recursos/${doc.slug}`)
        if (previousDoc?.slug && previousDoc.slug !== doc.slug) revalidatePath(`/recursos/${previousDoc.slug}`)
        return doc
      },
    ],
    afterDelete: [
      ({ doc }) => {
        revalidateTag('recursos', 'max')
        revalidatePath('/recursos')
        revalidatePath(`/recursos/${doc.slug}`)
      },
    ],
  },
  fields: [
    { name: 'titulo', type: 'text', label: 'Título', required: true, admin: { description: 'Ej: Guía para aparecer en Google Maps' } },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Página del recurso',
          fields: [
            { name: 'descripcion', type: 'textarea', label: 'Resumen', required: true, maxLength: 160, admin: { description: 'Una o dos frases. Sale en Google y en las tarjetas.' } },
            { name: 'portada', type: 'upload', relationTo: 'media', label: 'Imagen (portada del recurso)' },
            {
              name: 'beneficios',
              type: 'array',
              label: 'Qué se lleva la persona',
              labels: { singular: 'Punto', plural: 'Puntos' },
              admin: { description: 'Tres a cinco puntos cortos. Ej: "Los 7 datos que Google revisa primero".' },
              fields: [{ name: 'texto', type: 'text', label: 'Texto', required: true }],
            },
            {
              type: 'row',
              fields: [
                { name: 'textoBoton', type: 'text', label: 'Botón', defaultValue: 'Quiero recibirlo' },
                { name: 'textoExito', type: 'text', label: 'Mensaje al enviar', defaultValue: '¡Listo! Revisa tu correo: ahí está tu enlace.' },
              ],
            },
          ],
        },
        {
          label: 'Qué se entrega',
          fields: [
            {
              name: 'tipoEntrega',
              type: 'select',
              label: 'Tipo',
              defaultValue: 'archivo',
              options: [
                { label: 'Un archivo que subo (PDF, plantilla…)', value: 'archivo' },
                { label: 'Un enlace (video, carpeta de Drive, curso…)', value: 'enlace' },
              ],
            },
            {
              name: 'archivo',
              type: 'upload',
              relationTo: 'media',
              label: 'Archivo',
              access: { read: adminOnlyFieldAccess },
              admin: { condition: (_, s) => s?.tipoEntrega !== 'enlace' },
            },
            {
              name: 'enlace',
              type: 'text',
              label: 'Enlace',
              access: { read: adminOnlyFieldAccess },
              admin: { condition: (_, s) => s?.tipoEntrega === 'enlace', placeholder: 'https://…' },
              validate: (v: unknown, { siblingData }: any) =>
                siblingData?.tipoEntrega !== 'enlace' || /^https:\/\//.test(String(v || '')) || 'Pega un enlace que empiece por https://',
            },
            {
              name: 'mostrarEnPantalla',
              type: 'checkbox',
              label: 'Mostrar también el botón de descarga en la página al enviar',
              defaultValue: true,
              admin: { description: 'Si lo apagas, solo llega por correo: así te aseguras de que el correo es real.' },
            },
            { name: 'asuntoCorreo', type: 'text', label: 'Asunto del correo', admin: { description: 'Vacío = "Aquí tienes: (título)".' } },
            { name: 'textoCorreo', type: 'textarea', label: 'Texto del correo', defaultValue: 'Gracias por tu interés. Pulsa el botón para descargarlo. Si tienes dudas, responde este correo.' },
          ],
        },
      ],
    },
    { name: 'publicado', type: 'checkbox', label: 'Publicado', defaultValue: true, admin: { position: 'sidebar' } },
    { name: 'descargas', type: 'number', label: 'Descargas', defaultValue: 0, admin: { position: 'sidebar', readOnly: true } },
    slugField({ position: 'sidebar', useAsSlug: 'titulo', slugify: slugEnEspanol } as any),
  ],
}
