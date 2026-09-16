import type { CollectionConfig } from 'payload'

import { adminOnly } from '@/access/adminOnly'

/**
 * Registro de visitas para las estadísticas del panel.
 *
 * Sin cookies y sin datos personales: no se guarda la IP. El "visitante" es
 * una huella que cambia cada día (IP + navegador + fecha, cifrados), así que
 * sirve para contar personas distintas en un día pero no para seguir a nadie.
 * Por eso no necesita el aviso de cookies.
 */
export const Visitas: CollectionConfig = {
  slug: 'visitas',
  labels: { singular: 'Visita', plural: 'Visitas' },
  admin: { hidden: true },
  access: {
    read: adminOnly,
    create: () => false,
    update: () => false,
    delete: adminOnly,
  },
  fields: [
    {
      name: 'tipo',
      label: 'Tipo',
      type: 'select',
      required: true,
      defaultValue: 'vista',
      index: true,
      options: [
        { label: 'Página vista', value: 'vista' },
        { label: 'Clic a WhatsApp', value: 'whatsapp' },
      ],
    },
    { name: 'ruta', label: 'Página', type: 'text', required: true, index: true },
    {
      name: 'fuente',
      label: 'De dónde llegó',
      type: 'select',
      index: true,
      options: [
        { label: 'Directo', value: 'directo' },
        { label: 'Buscadores', value: 'buscador' },
        { label: 'Redes sociales', value: 'redes' },
        { label: 'Asistentes de IA', value: 'ia' },
        { label: 'Correo', value: 'correo' },
        { label: 'Anuncios', value: 'anuncios' },
        { label: 'Otros sitios', value: 'otros' },
        { label: 'Dentro del sitio', value: 'interno' },
      ],
    },
    { name: 'referente', label: 'Sitio de origen', type: 'text' },
    {
      name: 'dispositivo',
      label: 'Dispositivo',
      type: 'select',
      options: [
        { label: 'Celular', value: 'movil' },
        { label: 'Tableta', value: 'tableta' },
        { label: 'Computador', value: 'escritorio' },
      ],
    },
    { name: 'pais', label: 'País', type: 'text' },
    { name: 'visitante', label: 'Huella diaria', type: 'text', index: true },
  ],
}
