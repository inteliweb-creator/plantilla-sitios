import type { CollectionConfig } from 'payload'

import { adminOnly } from '@/access/adminOnly'
import { adminOnlyFieldAccess } from '@/access/adminOnlyFieldAccess'
import { publicAccess } from '@/access/publicAccess'
import { adminOrSelf } from '@/access/adminOrSelf'
import { checkRole } from '@/access/utilities'

import { ensureFirstUserIsAdmin } from './hooks/ensureFirstUserIsAdmin'
import { reglasClave } from './hooks/reglasClave'
import { correoRecuperarClave, marcaCorreo } from '@/correo'

const MINUTOS_ENLACE = 60

export const Users: CollectionConfig = {
  slug: 'users',
  labels: { singular: 'Usuario', plural: 'Usuarios' },
  access: {
    admin: ({ req: { user } }) => checkRole(['admin'], user),
    create: publicAccess,
    delete: adminOnly,
    read: adminOrSelf,
    unlock: adminOnly,
    update: adminOrSelf,
  },
  admin: {
    group: 'Configuración',
    defaultColumns: ['name', 'email', 'roles'],
    useAsTitle: 'name',
  },
  auth: {
    tokenExpiration: 1209600,
    // Tras 5 intentos fallidos la cuenta se bloquea 15 minutos.
    maxLoginAttempts: 5,
    lockTime: 15 * 60 * 1000,
    forgotPassword: {
      expiration: MINUTOS_ENLACE * 60 * 1000,
      generateEmailSubject: () => 'Crea una nueva contraseña',
      generateEmailHTML: async (args) => {
        const { req, token, user } = args ?? ({} as any)
        const base = (process.env.NEXT_PUBLIC_SERVER_URL || '').replace(/\/$/, '')
        const esAdmin = checkRole(['admin'], user as any)
        const url = esAdmin ? `${base}/admin/reset/${token}` : `${base}/reset-password?token=${token}`
        const tienda = await req?.payload.findGlobal({ slug: 'tienda', depth: 1 })
        return correoRecuperarClave(marcaCorreo(tienda, base), (user as any)?.name, url, MINUTOS_ENLACE)
      },
    },
  },
  hooks: {
    beforeOperation: [reglasClave],
  },
  fields: [
    {
      // Solo se pide al cambiar la contraseña de tu propia cuenta; no se guarda.
      name: 'claveActual',
      type: 'text',
      label: 'Contraseña actual',
      virtual: true,
      admin: {
        components: { Field: '@/collections/Users/CampoClaveActual' },
      },
      // Nunca se devuelve: es solo para comprobar al guardar.
      hooks: { afterRead: [() => undefined] },
    },
    {
      name: 'name',
      type: 'text',
      label: 'Nombre',
    },
    {
      name: 'roles',
      type: 'select',
      access: {
        create: adminOnlyFieldAccess,
        read: adminOnlyFieldAccess,
        update: adminOnlyFieldAccess,
      },
      defaultValue: ['customer'],
      hasMany: true,
      hooks: {
        beforeChange: [ensureFirstUserIsAdmin],
      },
      options: [
        {
          label: 'admin',
          value: 'admin',
        },
        {
          label: 'customer',
          value: 'customer',
        },
      ],
    },
    {
      name: 'orders',
      type: 'join',
      collection: 'orders',
      on: 'customer',
      admin: {
        allowCreate: false,
        defaultColumns: ['id', 'createdAt', 'total', 'currency', 'items'],
      },
    },
    {
      name: 'cart',
      type: 'join',
      collection: 'carts',
      on: 'customer',
      admin: {
        allowCreate: false,
        defaultColumns: ['id', 'createdAt', 'total', 'currency', 'items'],
      },
    },
    {
      name: 'addresses',
      type: 'join',
      collection: 'addresses',
      on: 'customer',
      admin: {
        allowCreate: false,
        defaultColumns: ['id'],
      },
    },
  ],
}
