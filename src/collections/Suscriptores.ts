import type { CollectionConfig } from 'payload'
import crypto from 'node:crypto'

import { adminOnly } from '@/access/adminOnly'

/**
 * Suscriptores del boletín.
 *
 * La lista vive en la base de datos del sitio, no en un servicio externo: el
 * negocio es dueño de sus contactos aunque mañana cambie de proveedor de
 * correo. Cada suscriptor tiene un código secreto para darse de baja con un
 * clic desde cualquier correo, sin iniciar sesión.
 */
export const Suscriptores: CollectionConfig = {
  slug: 'suscriptores',
  labels: { singular: 'Suscriptor', plural: 'Suscriptores' },
  admin: {
    group: 'Blog y boletín',
    useAsTitle: 'correo',
    defaultColumns: ['correo', 'nombre', 'estado', 'origen', 'createdAt'],
    listSearchableFields: ['correo', 'nombre'],
    description: 'Personas que se apuntaron al boletín. Puedes añadir personas a mano o importarlas desde un archivo si te dieron permiso.',
    components: { beforeListTable: ['@/components/SuscriptoresCSV#SuscriptoresCSV'] },
  },
  access: { read: adminOnly, create: adminOnly, update: adminOnly, delete: adminOnly },
  defaultSort: '-createdAt',
  hooks: {
    beforeValidate: [
      ({ data }) => {
        if (data?.correo) data.correo = String(data.correo).trim().toLowerCase()
        return data
      },
    ],
    beforeChange: [
      ({ data, operation }) => {
        if (operation === 'create' && !data.codigoBaja) data.codigoBaja = crypto.randomBytes(24).toString('hex')
        return data
      },
    ],
  },
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'correo', type: 'email', label: 'Correo', required: true, unique: true, index: true },
        { name: 'nombre', type: 'text', label: 'Nombre (opcional)' },
      ],
    },
    {
      name: 'estado',
      type: 'select',
      label: 'Estado',
      required: true,
      defaultValue: 'activo',
      options: [
        { label: '✅ Recibe el boletín', value: 'activo' },
        { label: 'Se dio de baja', value: 'baja' },
      ],
      admin: { position: 'sidebar' },
    },
    { name: 'origen', type: 'text', label: 'Dónde se apuntó', admin: { position: 'sidebar', readOnly: true } },
    { name: 'fechaBaja', type: 'date', label: 'Fecha de baja', admin: { position: 'sidebar', readOnly: true, condition: (d) => d?.estado === 'baja' } },
    { name: 'codigoBaja', type: 'text', index: true, admin: { hidden: true }, access: { read: () => false, update: () => false } },
  ],
}
