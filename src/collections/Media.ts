import type { CollectionConfig } from 'payload'

import {
  FixedToolbarFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import path from 'path'
import { fileURLToPath } from 'url'

import { adminOnly } from '@/access/adminOnly'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const WEBP = { format: 'webp' as const, options: { quality: 80, effort: 5 } }

export const Media: CollectionConfig = {
  admin: {
    group: 'Contenido',
  },
  slug: 'media',
  labels: { singular: 'Imagen', plural: 'Imágenes y archivos' },
  access: {
    create: adminOnly,
    delete: adminOnly,
    read: () => true,
    update: adminOnly,
  },
  fields: [
    {
      name: 'alt',
      label: 'Descripción de la imagen (para Google y lectores de pantalla)',
      type: 'text',
      required: true,
    },
    {
      name: 'optimizada',
      type: 'date',
      label: 'Optimizada el',
      admin: { readOnly: true, position: 'sidebar', description: 'Cuándo se generaron sus versiones ligeras.' },
    },
    {
      name: 'caption',
      label: 'Pie de foto',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [...rootFeatures, FixedToolbarFeature(), InlineToolbarFeature()]
        },
      }),
    },
  ],
  // Optimización automática al subir: la foto de 8 MB del celular queda en
  // WebP liviano, con tamaños listos para cada uso. Nadie tiene que preparar
  // las imágenes antes de subirlas.
  upload: {
    staticDir: path.resolve(dirname, '../../public/media'),
    mimeTypes: ['image/*', 'application/pdf'],
    focalPoint: true,
    // El original nunca pasa de 2400 px ni se agranda si es pequeño.
    resizeOptions: { width: 2400, height: 2400, fit: 'inside', withoutEnlargement: true },
    formatOptions: { format: 'webp', options: { quality: 82, effort: 5 } },
    imageSizes: [
      { name: 'miniatura', width: 480, withoutEnlargement: true, formatOptions: WEBP },
      { name: 'mediana', width: 960, withoutEnlargement: true, formatOptions: WEBP },
      { name: 'grande', width: 1600, withoutEnlargement: true, formatOptions: WEBP },
      // PNG pequeño para los correos: WebP no se ve en muchos gestores de correo.
      { name: 'correo', width: 520, height: 160, fit: 'inside', withoutEnlargement: true, formatOptions: { format: 'png' as const, options: { compressionLevel: 9 } } },
      // Tarjeta para WhatsApp, Facebook y LinkedIn: recorte exacto respetando el punto focal.
      { name: 'redes', width: 1200, height: 630, fit: 'cover', formatOptions: { format: 'jpeg', options: { quality: 84, mozjpeg: true } } },
    ],
    adminThumbnail: 'miniatura',
  },
}
