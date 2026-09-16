import type { CollectionConfig } from 'payload'
import { slugField } from 'payload'
import { FixedToolbarFeature, HeadingFeature, lexicalEditor } from '@payloadcms/richtext-lexical'
import { revalidatePath, revalidateTag } from 'next/cache'

import { adminOnly } from '@/access/adminOnly'
import { adminOrPublishedStatus } from '@/access/adminOrPublishedStatus'
import { slugEnEspanol } from '@/utilities/slug'

/** Cuenta las palabras de un texto enriquecido para estimar la lectura. */
function contarPalabras(nodo: any): number {
  if (!nodo) return 0
  if (typeof nodo.text === 'string') return nodo.text.trim().split(/\s+/).filter(Boolean).length
  return (nodo.children || nodo.root?.children || []).reduce((n: number, h: any) => n + contarPalabras(h), 0)
}

/**
 * Artículos del blog.
 *
 * Los campos de SEO son obligatorios a propósito (descripción y búsqueda que
 * se quiere captar): un artículo sin ellos es una página que Google no sabe
 * cómo mostrar. Los minutos de lectura se calculan solos al guardar.
 */
export const Articulos: CollectionConfig = {
  slug: 'articulos',
  labels: { singular: 'Artículo', plural: 'Artículos' },
  admin: {
    group: 'Blog y boletín',
    useAsTitle: 'title',
    defaultColumns: ['title', 'fechaPublicacion', '_status', 'etiquetas'],
    description: 'Escribe, programa y publica los artículos del blog.',
    livePreview: { url: ({ data }) => `/blog/${data?.slug ?? ''}` },
    preview: (data) => `/blog/${data?.slug ?? ''}`,
  },
  access: {
    read: adminOrPublishedStatus,
    create: adminOnly,
    update: adminOnly,
    delete: adminOnly,
  },
  // Sin guardado automático: al abrir "Crear" creaba un borrador vacío cada vez.
  versions: { drafts: { schedulePublish: true }, maxPerDoc: 30 },
  defaultSort: '-fechaPublicacion',
  hooks: {
    beforeChange: [
      ({ data }) => {
        const palabras = contarPalabras(data?.contenido)
        if (palabras) data.minutosLectura = Math.max(1, Math.round(palabras / 220))
        if (!data.fechaPublicacion && data._status === 'published') data.fechaPublicacion = new Date().toISOString()
        return data
      },
    ],
    afterChange: [
      ({ doc, previousDoc, req }) => {
        if (req.context?.disableRevalidate) return doc
        revalidateTag('articulos', 'max')
        revalidatePath('/blog')
        revalidatePath(`/blog/${doc.slug}`)
        if (previousDoc?.slug && previousDoc.slug !== doc.slug) revalidatePath(`/blog/${previousDoc.slug}`)
        return doc
      },
    ],
    afterDelete: [
      ({ doc, req }) => {
        if (req.context?.disableRevalidate) return doc
        revalidateTag('articulos', 'max')
        revalidatePath('/blog')
        return doc
      },
    ],
  },
  fields: [
    { name: 'title', type: 'text', label: 'Título del artículo', required: true },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Contenido',
          fields: [
            {
              name: 'descripcion',
              type: 'textarea',
              label: 'Resumen',
              required: true,
              maxLength: 160,
              admin: { description: 'Una o dos frases. Sale en la tarjeta del blog y en Google (máx. 160 caracteres).' },
            },
            {
              name: 'portada',
              type: 'upload',
              relationTo: 'media',
              label: 'Imagen de portada',
              admin: { description: 'Horizontal, idealmente 1600 × 900. Si no pones una, se usa un fondo de color de la marca.' },
            },
            {
              name: 'contenido',
              type: 'richText',
              label: 'Texto del artículo',
              required: true,
              editor: lexicalEditor({
                features: ({ defaultFeatures }) => [
                  ...defaultFeatures.filter((f) => f.key !== 'heading'),
                  HeadingFeature({ enabledHeadingSizes: ['h2', 'h3'] }),
                  FixedToolbarFeature(),
                ],
              }),
              admin: { description: 'Usa "Título 2" para las partes principales: con ellas se arma el índice "En este artículo".' },
            },
          ],
        },
        {
          label: 'Google (SEO)',
          fields: [
            {
              name: 'palabraClave',
              type: 'text',
              label: 'Búsqueda que quieres captar',
              required: true,
              admin: { description: 'Lo que escribiría alguien en Google. Ej: "cómo aparecer primero en Google". Evita repetirla en dos artículos.' },
            },
            {
              name: 'tituloSeo',
              type: 'text',
              label: 'Título para Google (opcional)',
              maxLength: 60,
              admin: { description: 'Si lo dejas vacío se usa el título del artículo. Máx. 60 caracteres.' },
            },
            {
              name: 'imagenRedes',
              type: 'upload',
              relationTo: 'media',
              label: 'Imagen para compartir en redes (opcional)',
              admin: { description: '1200 × 630. Si falta, se usa la portada.' },
            },
          ],
        },
        {
          label: 'Al final del artículo',
          description: 'Qué le propones al lector cuando termina de leer. Es el mejor momento para pedirle algo.',
          fields: [
            {
              name: 'llamado',
              type: 'group',
              label: 'Llamado a la acción',
              fields: [
                {
                  name: 'tipo',
                  type: 'select',
                  label: 'Qué ofrecer',
                  defaultValue: 'ninguno',
                  options: [
                    { label: 'Nada (solo el cierre general del blog)', value: 'ninguno' },
                    { label: 'Un recurso gratis (guía, plantilla…)', value: 'recurso' },
                    { label: 'Escribir por WhatsApp', value: 'whatsapp' },
                    { label: 'Ir a una página (un servicio, contacto…)', value: 'enlace' },
                  ],
                },
                {
                  name: 'recurso',
                  type: 'relationship',
                  relationTo: 'recursos',
                  label: 'Recurso',
                  admin: { condition: (_, s) => s?.tipo === 'recurso', description: 'El lector deja su correo y lo recibe al instante.' },
                },
                {
                  name: 'titulo',
                  type: 'text',
                  label: 'Título',
                  admin: { condition: (_, s) => s?.tipo && s.tipo !== 'ninguno', description: 'Si lo dejas vacío en un recurso, se usa el título del recurso.' },
                },
                { name: 'texto', type: 'textarea', label: 'Texto', admin: { condition: (_, s) => s?.tipo && s.tipo !== 'ninguno' } },
                { name: 'textoBoton', type: 'text', label: 'Texto del botón', admin: { condition: (_, s) => s?.tipo === 'whatsapp' || s?.tipo === 'enlace' } },
                { name: 'mensajeWhatsapp', type: 'text', label: 'Mensaje de WhatsApp', admin: { condition: (_, s) => s?.tipo === 'whatsapp' } },
                { name: 'enlace', type: 'text', label: 'Dirección', admin: { condition: (_, s) => s?.tipo === 'enlace', placeholder: '/diseno-web' } },
              ],
            },
          ],
        },
      ],
    },
    {
      name: 'fechaPublicacion',
      type: 'date',
      label: 'Fecha de publicación',
      admin: { position: 'sidebar', date: { pickerAppearance: 'dayOnly', displayFormat: 'd MMM yyyy' } },
    },
    {
      name: 'fechaActualizacion',
      type: 'date',
      label: 'Actualizado el (opcional)',
      admin: { position: 'sidebar', date: { pickerAppearance: 'dayOnly', displayFormat: 'd MMM yyyy' } },
    },
    { name: 'comentariosCerrados', type: 'checkbox', label: 'Cerrar los comentarios de este artículo', admin: { position: 'sidebar' } },
    { name: 'autor', type: 'text', label: 'Autor', admin: { position: 'sidebar', description: 'Vacío = nombre del negocio.' } },
    {
      name: 'etiquetas',
      type: 'text',
      hasMany: true,
      label: 'Temas',
      admin: { position: 'sidebar', description: 'Ej: SEO local. El primero sale destacado.' },
    },
    {
      name: 'minutosLectura',
      type: 'number',
      label: 'Minutos de lectura',
      admin: { position: 'sidebar', readOnly: true, description: 'Se calcula solo al guardar.' },
    },
    slugField({ position: 'sidebar', slugify: slugEnEspanol } as any),
  ],
}
