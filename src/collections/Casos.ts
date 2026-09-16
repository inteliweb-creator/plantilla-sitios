import type { CollectionConfig } from 'payload'
import { revalidateTag } from 'next/cache'

import { adminOnly } from '@/access/adminOnly'

/**
 * Clientes y casos: los negocios que se muestran como prueba en el bloque
 * "Casos de clientes". Solo trabajos reales y publicados.
 */
export const Casos: CollectionConfig = {
  slug: 'casos',
  labels: { singular: 'Caso', plural: 'Clientes y casos' },
  admin: {
    group: 'Contenido',
    useAsTitle: 'nombre',
    defaultColumns: ['nombre', 'rubro', 'url', 'orden'],
    description: 'Negocios reales que aparecen como prueba en el sitio.',
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
        if (!req.context?.disableRevalidate) revalidateTag('casos', 'max')
        return doc
      },
    ],
  },
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'nombre', type: 'text', label: 'Nombre del negocio', required: true },
        { name: 'rubro', type: 'text', label: 'Sector (ej. Ferretería)' },
      ],
    },
    { name: 'url', type: 'text', label: 'Enlace al sitio publicado', required: true },
    { name: 'descripcion', type: 'textarea', label: 'Qué cambió para ese negocio' },
    {
      type: 'row',
      fields: [
        {
          name: 'icono',
          type: 'select',
          label: 'Icono',
          defaultValue: 'globe',
          options: [
            { label: 'Edificio', value: 'building2' },
            { label: 'Brújula', value: 'compass' },
            { label: 'Mundo', value: 'globe' },
            { label: 'Escudo', value: 'shield' },
            { label: 'Rayo', value: 'zap' },
            { label: 'Café', value: 'coffee' },
          ],
        },
        { name: 'orden', type: 'number', label: 'Orden', defaultValue: 0 },
      ],
    },
  ],
}
