import type { CollectionConfig } from 'payload'

import { adminOnly } from '@/access/adminOnly'

/**
 * Historial de conversaciones con el asistente. Cada administrador ve solo
 * las suyas desde la burbuja del panel. El trabajo corre en el servidor, así
 * que la respuesta queda guardada aunque se cambie de pantalla o se cierre.
 */
export const ConversacionesAsistente: CollectionConfig = {
  slug: 'conversacionesAsistente',
  labels: { singular: 'Conversación con el asistente', plural: 'Conversaciones con el asistente' },
  admin: { hidden: true, useAsTitle: 'titulo' },
  access: { read: adminOnly, create: () => false, update: () => false, delete: adminOnly },
  defaultSort: '-updatedAt',
  fields: [
    { name: 'titulo', type: 'text' },
    { name: 'usuario', type: 'relationship', relationTo: 'users', index: true },
    { name: 'mensajes', type: 'json' },
    {
      name: 'estado',
      type: 'select',
      defaultValue: 'lista',
      options: [
        { label: 'Lista', value: 'lista' },
        { label: 'Trabajando', value: 'trabajando' },
      ],
    },
    { name: 'progreso', type: 'text' },
    { name: 'trabajandoDesde', type: 'date' },
  ],
}
