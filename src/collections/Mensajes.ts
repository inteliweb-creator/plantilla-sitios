import type { CollectionConfig } from 'payload'

import { adminOnly } from '@/access/adminOnly'

/**
 * Buzón: cada mensaje que alguien envía desde el formulario de contacto.
 *
 * Se guarda SIEMPRE, antes de intentar mandar el aviso por correo. Así, si el
 * correo falla o todavía no está configurado, el mensaje no se pierde: queda
 * aquí para responderlo.
 *
 * Nadie puede crear mensajes desde fuera del servidor: el formulario los
 * guarda a través de /next/contacto, que valida y filtra robots.
 */
export const Mensajes: CollectionConfig = {
  slug: 'mensajes',
  labels: { singular: 'Mensaje', plural: 'Buzón de mensajes' },
  admin: {
    group: 'Contenido',
    useAsTitle: 'nombre',
    defaultColumns: ['nombre', 'telefono', 'necesita', 'estado', 'createdAt'],
    description: 'Lo que la gente escribe en el formulario de contacto. Marca cada uno cuando lo respondas.',
    listSearchableFields: ['nombre', 'correo', 'telefono', 'mensaje'],
  },
  access: {
    read: adminOnly,
    create: () => false,
    update: adminOnly,
    delete: adminOnly,
  },
  defaultSort: '-createdAt',
  fields: [
    {
      name: 'estado',
      type: 'select',
      label: 'Estado',
      defaultValue: 'nuevo',
      required: true,
      options: [
        { label: '🟠 Nuevo', value: 'nuevo' },
        { label: '✅ Respondido', value: 'respondido' },
        { label: 'Archivado', value: 'archivado' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      type: 'row',
      fields: [
        { name: 'nombre', type: 'text', label: 'Nombre', required: true, admin: { readOnly: true } },
        { name: 'telefono', type: 'text', label: 'Teléfono / WhatsApp', admin: { readOnly: true } },
        { name: 'correo', type: 'email', label: 'Correo', admin: { readOnly: true } },
      ],
    },
    { name: 'necesita', type: 'text', label: 'Qué necesita', admin: { readOnly: true } },
    { name: 'mensaje', type: 'textarea', label: 'Mensaje', admin: { readOnly: true } },
    {
      name: 'notas',
      type: 'textarea',
      label: 'Notas internas',
      admin: { description: 'Solo las ves tú. Ej: "Le envié cotización el martes".' },
    },
    { name: 'origen', type: 'text', label: 'Página desde donde escribió', admin: { readOnly: true, position: 'sidebar' } },
    {
      name: 'avisoEnviado',
      type: 'checkbox',
      label: 'Aviso por correo enviado',
      admin: { readOnly: true, position: 'sidebar', description: 'Si está apagado, el correo no está configurado o falló.' },
    },
  ],
}
