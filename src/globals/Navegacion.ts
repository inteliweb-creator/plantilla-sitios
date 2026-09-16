import type { Field, GlobalConfig } from 'payload'
import { revalidateTag } from 'next/cache'

import { adminOnly } from '@/access/adminOnly'

/**
 * Navegación del sitio: menú de arriba, riel lateral de iconos, menú del
 * celular y pie de página. Un enlace es siempre "texto + dirección", sin
 * tecnicismos: la dirección puede ser una página (/contacto), una sección de
 * la misma página (#cotizador) o un sitio externo (https://…).
 */

export const ICONOS_MENU = [
  { label: 'Casa', value: 'home' },
  { label: 'Caja / productos', value: 'package' },
  { label: 'Descarga / recursos', value: 'download' },
  { label: 'Periódico / blog', value: 'newspaper' },
  { label: 'Mensaje / contacto', value: 'message' },
  { label: 'Plantilla / diseño', value: 'layout' },
  { label: 'Diana / objetivo', value: 'target' },
  { label: 'Bolsa / tienda', value: 'bag' },
  { label: 'Lupa / buscar', value: 'search' },
  { label: 'Pin / ubicación', value: 'pin' },
  { label: 'Estrella', value: 'star' },
  { label: 'Teléfono', value: 'phone' },
  { label: 'Usuario / cuenta', value: 'user' },
]

const enlace = (conIcono = false): Field[] => [
  {
    type: 'row',
    fields: [
      { name: 'etiqueta', type: 'text', label: 'Texto', required: true },
      { name: 'enlace', type: 'text', label: 'Dirección (ej. /contacto o #cotizador)', required: true },
      ...(conIcono
        ? [{ name: 'icono', type: 'select', label: 'Icono', defaultValue: 'home', options: ICONOS_MENU } as Field]
        : []),
    ],
  },
]

export const Navegacion: GlobalConfig = {
  slug: 'navegacion',
  label: 'Menú y pie de página',
  admin: {
    group: 'Configuración',
    description: 'Los enlaces del menú superior, el riel lateral, el menú del celular y el pie de página.',
  },
  access: { read: () => true, update: adminOnly },
  hooks: {
    afterChange: [
      ({ doc, req }) => {
        if (!req.context?.disableRevalidate) revalidateTag('global_navegacion', 'max')
        return doc
      },
    ],
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Menú superior',
          description: 'Aparece arriba al bajar por la página (escritorio) y en el menú del celular.',
          fields: [
            {
              name: 'menu',
              type: 'array',
              label: 'Enlaces',
              labels: { singular: 'Enlace', plural: 'Enlaces' },
              maxRows: 6,
              fields: enlace(true),
            },
            { name: 'botonCabecera', type: 'text', label: 'Botón negro de la cabecera (abre WhatsApp)', defaultValue: 'Hablemos' },
            { name: 'mostrarCarrito', type: 'checkbox', label: 'Mostrar el carrito de compras en la cabecera', defaultValue: false, admin: { description: 'Actívalo solo si el sitio vende productos.' } },
          ],
        },
        {
          label: 'Riel lateral',
          description: 'La columna de iconos a la izquierda en computador. El último botón siempre es WhatsApp.',
          fields: [
            {
              name: 'riel',
              type: 'array',
              label: 'Iconos',
              labels: { singular: 'Icono', plural: 'Iconos' },
              maxRows: 6,
              fields: enlace(true),
            },
            { name: 'mostrarRiel', type: 'checkbox', label: 'Mostrar el riel lateral', defaultValue: true },
          ],
        },
        {
          label: 'Pie de página',
          fields: [
            { name: 'descripcionPie', type: 'textarea', label: 'Frase bajo el logo' },
            { name: 'tituloEnlacesPie', type: 'text', label: 'Título de la columna de enlaces', defaultValue: 'Servicios' },
            {
              name: 'enlacesPie',
              type: 'array',
              label: 'Enlaces del pie',
              labels: { singular: 'Enlace', plural: 'Enlaces' },
              fields: enlace(),
            },
            { name: 'textoWhatsappPie', type: 'text', label: 'Texto sobre el botón de WhatsApp', defaultValue: 'Atención directa por WhatsApp' },
            {
              name: 'legales',
              type: 'array',
              label: 'Documentos legales (abajo del todo)',
              labels: { singular: 'Documento', plural: 'Documentos' },
              fields: enlace(),
            },
          ],
        },
      ],
    },
  ],
}
