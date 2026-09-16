import type { CollectionConfig } from 'payload'
import { APIError } from 'payload'
import { FixedToolbarFeature, HeadingFeature, lexicalEditor } from '@payloadcms/richtext-lexical'
import { revalidatePath, revalidateTag } from 'next/cache'

import { adminOnly } from '@/access/adminOnly'

/**
 * Documentos legales: privacidad, cookies y términos (o los que haga falta).
 * Se publican en la raíz del sitio (/privacidad) y el pie los enlaza.
 *
 * Los datos del negocio se escriben como marcadores ({empresa}, {correo}…):
 * al cambiar el teléfono en "Datos del negocio", los documentos se
 * actualizan solos y nunca quedan diciendo algo viejo.
 */
export const Legales: CollectionConfig = {
  slug: 'legales',
  labels: { singular: 'Documento legal', plural: 'Documentos legales' },
  admin: {
    group: 'Contenido',
    useAsTitle: 'titulo',
    defaultColumns: ['titulo', 'slug', 'fechaActualizacion'],
    description:
      'Política de privacidad, cookies y términos. Puedes escribir {empresa}, {correo}, {telefono}, {ciudad}, {region}, {pais}, {sitio} o {dominio} y se reemplazan por los datos del negocio. Un párrafo que solo diga {bloque:datos}, {bloque:medicion}, {bloque:medicion-detalle}, {bloque:boletin}, {bloque:proveedores} o {bloque:navegador} se escribe solo según lo que el sitio usa (píxeles conectados, boletín, tienda). No borres esos párrafos.',
    preview: (data) => `/${data?.slug ?? ''}`,
  },
  access: {
    read: () => true,
    create: adminOnly,
    update: adminOnly,
    delete: adminOnly,
  },
  defaultSort: 'orden',
  hooks: {
    beforeChange: [
      async ({ data, originalDoc, req }) => {
        // Las páginas legales viven en la raíz: no pueden chocar con una página del sitio.
        if (data?.slug && data.slug !== originalDoc?.slug) {
          const choca = await req.payload.find({ collection: 'pages', where: { slug: { equals: data.slug } }, limit: 1, depth: 0, req })
          if (choca.docs[0]) throw new APIError(`Ya hay una página con la dirección /${data.slug}. Elige otra.`, 400, null, true)
        }
        // "Última actualización" se mueve sola cuando cambia el texto, salvo que la hayas cambiado a mano.
        const cambioTexto = JSON.stringify(data?.contenido) !== JSON.stringify(originalDoc?.contenido)
        const fechaAMano = data?.fechaActualizacion && data.fechaActualizacion !== originalDoc?.fechaActualizacion
        if (!data.fechaActualizacion || (originalDoc && cambioTexto && !fechaAMano)) {
          data.fechaActualizacion = new Date().toISOString()
        }
        return data
      },
    ],
    afterChange: [
      ({ doc, previousDoc, req }) => {
        if (req.context?.disableRevalidate) return doc
        revalidateTag('legales', 'max')
        revalidatePath(`/${doc.slug}`)
        if (previousDoc?.slug && previousDoc.slug !== doc.slug) revalidatePath(`/${previousDoc.slug}`)
        return doc
      },
    ],
    afterDelete: [
      ({ doc }) => {
        revalidateTag('legales', 'max')
        revalidatePath(`/${doc.slug}`)
      },
    ],
  },
  fields: [
    { name: 'titulo', type: 'text', label: 'Título', required: true, admin: { description: 'Ej: Política de privacidad y tratamiento de datos personales' } },
    {
      name: 'descripcion',
      type: 'textarea',
      label: 'Descripción para Google',
      maxLength: 160,
      admin: { description: 'Una o dos frases. Máximo 160 caracteres.' },
    },
    {
      name: 'contenido',
      type: 'richText',
      label: 'Texto',
      required: true,
      editor: lexicalEditor({
        features: ({ rootFeatures }) => [
          ...rootFeatures.filter((f) => f.key !== 'heading'),
          HeadingFeature({ enabledHeadingSizes: ['h2', 'h3'] }),
          FixedToolbarFeature(),
        ],
      }),
    },
    {
      name: 'slug',
      type: 'text',
      label: 'Dirección',
      required: true,
      unique: true,
      index: true,
      admin: { position: 'sidebar', description: 'Sin barras ni espacios. Ej: privacidad → tusitio.com/privacidad' },
      validate: (v: unknown) =>
        typeof v === 'string' && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(v) ? true : 'Solo minúsculas, números y guiones. Ej: politica-de-cookies',
    },
    { name: 'etiqueta', type: 'text', label: 'Nombre corto', admin: { position: 'sidebar', description: 'Para los enlaces entre documentos. Ej: Cookies' } },
    {
      name: 'fechaActualizacion',
      type: 'date',
      label: 'Última actualización',
      admin: { position: 'sidebar', date: { pickerAppearance: 'dayOnly', displayFormat: 'd MMM yyyy' }, description: 'Cambia sola al editar el texto.' },
    },
    { name: 'orden', type: 'number', label: 'Orden', defaultValue: 0, admin: { position: 'sidebar' } },
  ],
}
