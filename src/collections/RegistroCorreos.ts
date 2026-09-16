import type { CollectionConfig } from 'payload'

import { adminOnly } from '@/access/adminOnly'

/**
 * Registro de los correos que salen del sitio (bienvenida, avisos, recursos,
 * recuperar contraseña, boletín). Sirve para responder "¿se envió o no?" sin
 * adivinar: guarda a quién, con qué asunto y, si falló, el motivo exacto que
 * devolvió el servicio de correo. No guarda el contenido del mensaje.
 */
export const RegistroCorreos: CollectionConfig = {
  slug: 'registroCorreos',
  labels: { singular: 'Correo enviado', plural: 'Registro de correos' },
  admin: {
    group: 'Configuración',
    useAsTitle: 'asunto',
    defaultColumns: ['asunto', 'para', 'ok', 'error', 'createdAt'],
    description: 'Últimos correos que intentó enviar el sitio. Si algo no llega, aquí se ve por qué.',
  },
  access: { read: adminOnly, create: () => false, update: () => false, delete: adminOnly },
  defaultSort: '-createdAt',
  fields: [
    { name: 'asunto', type: 'text', label: 'Asunto', admin: { readOnly: true } },
    { name: 'para', type: 'text', label: 'Para', admin: { readOnly: true } },
    { name: 'ok', type: 'checkbox', label: '¿Salió bien?', admin: { readOnly: true } },
    { name: 'error', type: 'text', label: 'Motivo del fallo', admin: { readOnly: true } },
    { name: 'tipo', type: 'text', label: 'Tipo', admin: { readOnly: true, position: 'sidebar' } },
  ],
}
