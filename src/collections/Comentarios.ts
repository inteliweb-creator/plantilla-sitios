import type { Access, CollectionConfig } from 'payload'
import { revalidatePath, revalidateTag } from 'next/cache'

import { adminOnly } from '@/access/adminOnly'
import { adminOnlyFieldAccess } from '@/access/adminOnlyFieldAccess'
import { checkRole } from '@/access/utilities'

/** El público solo ve los comentarios aprobados; el administrador, todos. */
const leer: Access = ({ req: { user } }) => (user && checkRole(['admin'], user as any) ? true : { estado: { equals: 'aprobado' } })

/**
 * Comentarios de los artículos. Llegan "pendientes" desde el formulario del
 * artículo y no se publican hasta que el negocio los aprueba. El correo de
 * quien comenta nunca se muestra en el sitio ni en la API pública.
 */
export const Comentarios: CollectionConfig = {
  slug: 'comentarios',
  labels: { singular: 'Comentario', plural: 'Comentarios' },
  admin: {
    group: 'Blog y boletín',
    useAsTitle: 'nombre',
    defaultColumns: ['nombre', 'texto', 'articulo', 'estado', 'createdAt'],
    listSearchableFields: ['nombre', 'texto'],
    description: 'Cambia el estado a "Publicado" para que se vea en el artículo. Puedes responder desde aquí: tu respuesta sale debajo del comentario.',
  },
  access: {
    read: leer,
    create: () => false,
    update: adminOnly,
    delete: adminOnly,
  },
  defaultSort: '-createdAt',
  hooks: {
    beforeChange: [
      ({ data, originalDoc }) => {
        if (data?.respuesta && data.respuesta !== originalDoc?.respuesta) data.fechaRespuesta = new Date().toISOString()
        return data
      },
    ],
    afterChange: [
      async ({ doc, req }) => {
        if (req.context?.disableRevalidate) return doc
        revalidateTag('comentarios', 'max')
        const id = typeof doc.articulo === 'object' ? doc.articulo?.id : doc.articulo
        const art: any = id ? await req.payload.findByID({ collection: 'articulos', id, depth: 0, req, draft: false }).catch(() => null) : null
        if (art?.slug) revalidatePath(`/blog/${art.slug}`)
        return doc
      },
    ],
  },
  fields: [
    {
      name: 'estado',
      type: 'select',
      label: 'Estado',
      required: true,
      defaultValue: 'pendiente',
      index: true,
      options: [
        { label: '🕓 Pendiente de revisar', value: 'pendiente' },
        { label: '✅ Publicado', value: 'aprobado' },
        { label: '🚫 Rechazado', value: 'rechazado' },
      ],
      admin: { position: 'sidebar' },
    },
    { name: 'articulo', type: 'relationship', relationTo: 'articulos', label: 'Artículo', required: true, index: true, admin: { position: 'sidebar', readOnly: true } },
    {
      type: 'row',
      fields: [
        { name: 'nombre', type: 'text', label: 'Nombre', required: true, maxLength: 80, admin: { readOnly: true } },
        { name: 'correo', type: 'email', label: 'Correo (no se publica)', access: { read: adminOnlyFieldAccess }, admin: { readOnly: true } },
      ],
    },
    { name: 'texto', type: 'textarea', label: 'Comentario', required: true, maxLength: 2000, admin: { readOnly: true } },
    { name: 'respuesta', type: 'textarea', label: 'Tu respuesta (opcional, se publica debajo)', maxLength: 2000 },
    { name: 'fechaRespuesta', type: 'date', admin: { hidden: true } },
  ],
}
