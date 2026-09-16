import type { CollectionConfig } from 'payload'
import { revalidateTag } from 'next/cache'

import { adminOnly } from '@/access/adminOnly'

/**
 * Preguntas frecuentes. El "grupo" permite mostrar preguntas distintas en
 * cada página (ej. "inicio", "diseno-web").
 */
export const Preguntas: CollectionConfig = {
  slug: 'preguntas',
  labels: { singular: 'Pregunta', plural: 'Preguntas frecuentes' },
  admin: {
    group: 'Contenido',
    useAsTitle: 'pregunta',
    defaultColumns: ['pregunta', 'grupo', 'orden'],
  },
  access: {
    read: () => true,
    create: adminOnly,
    update: adminOnly,
    delete: adminOnly,
  },
  defaultSort: 'orden',
  hooks: {
    afterChange: [
      ({ doc, req }) => {
        if (!req.context?.disableRevalidate) revalidateTag('preguntas', 'max')
        return doc
      },
    ],
  },
  fields: [
    { name: 'pregunta', type: 'text', label: 'Pregunta', required: true },
    { name: 'respuesta', type: 'textarea', label: 'Respuesta', required: true },
    {
      type: 'row',
      fields: [
        { name: 'grupo', type: 'text', label: 'Grupo (ej. inicio)', defaultValue: 'inicio', index: true },
        { name: 'orden', type: 'number', label: 'Orden', defaultValue: 0 },
      ],
    },
  ],
}
