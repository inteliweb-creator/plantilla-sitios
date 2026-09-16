import type { CollectionConfig } from 'payload'

import { adminOnly } from '@/access/adminOnly'

/** Quién pidió cada recurso gratis: son contactos interesados (leads). */
export const SolicitudesRecurso: CollectionConfig = {
  slug: 'solicitudesRecurso',
  labels: { singular: 'Persona interesada', plural: 'Interesados en recursos' },
  admin: {
    group: 'Blog y boletín',
    useAsTitle: 'correo',
    defaultColumns: ['nombre', 'correo', 'recurso', 'descargo', 'createdAt'],
    listSearchableFields: ['correo', 'nombre'],
    description: 'Personas que pidieron un recurso gratis. Solo reciben el boletín si marcaron la casilla al pedirlo.',
  },
  access: { read: adminOnly, create: () => false, update: adminOnly, delete: adminOnly },
  defaultSort: '-createdAt',
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'nombre', type: 'text', label: 'Nombre', admin: { readOnly: true } },
        { name: 'correo', type: 'email', label: 'Correo', required: true, index: true, admin: { readOnly: true } },
      ],
    },
    { name: 'recurso', type: 'relationship', relationTo: 'recursos', label: 'Recurso', required: true, admin: { readOnly: true } },
    { name: 'aceptoBoletin', type: 'checkbox', label: 'Quiso recibir el boletín', admin: { readOnly: true } },
    { name: 'descargo', type: 'checkbox', label: 'Abrió el enlace', admin: { readOnly: true } },
    { name: 'origen', type: 'text', label: 'Desde dónde lo pidió', admin: { readOnly: true, position: 'sidebar' } },
  ],
}
