import type { CollectionConfig } from 'payload'

import { adminOnly } from '@/access/adminOnly'

/**
 * Todo lo que hace el asistente queda anotado aquí: qué creó, qué propuso,
 * quién lo aprobó y cuál fue el resultado. Las acciones que publican o envían
 * quedan como "Esperando aprobación" hasta que un administrador las aprueba.
 */
export const RegistroAsistente: CollectionConfig = {
  slug: 'registroAsistente',
  labels: { singular: 'Acción del asistente', plural: 'Registro del asistente' },
  admin: {
    group: 'Configuración',
    useAsTitle: 'detalle',
    defaultColumns: ['detalle', 'estado', 'herramienta', 'createdAt'],
    description: 'Historial de lo que hizo o propuso el asistente de IA.',
  },
  access: { read: adminOnly, create: () => false, update: () => false, delete: adminOnly },
  defaultSort: '-createdAt',
  fields: [
    { name: 'detalle', type: 'text', label: 'Qué hizo o propuso', admin: { readOnly: true } },
    {
      name: 'estado',
      type: 'select',
      label: 'Estado',
      index: true,
      options: [
        { label: '✓ Hecho', value: 'ejecutada' },
        { label: '🕓 Esperando aprobación', value: 'propuesta' },
        { label: 'Cancelado', value: 'cancelada' },
        { label: '✗ Falló', value: 'fallida' },
      ],
      admin: { readOnly: true, position: 'sidebar' },
    },
    { name: 'herramienta', type: 'text', label: 'Herramienta', admin: { readOnly: true, position: 'sidebar' } },
    { name: 'datos', type: 'json', label: 'Datos', admin: { readOnly: true } },
    { name: 'resultado', type: 'textarea', label: 'Resultado', admin: { readOnly: true } },
    { name: 'usuario', type: 'relationship', relationTo: 'users', label: 'Pedido por', admin: { readOnly: true, position: 'sidebar' } },
    { name: 'aprobadoPor', type: 'relationship', relationTo: 'users', label: 'Aprobado por', admin: { readOnly: true, position: 'sidebar' } },
  ],
}
