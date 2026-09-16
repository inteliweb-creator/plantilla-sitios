import type { GlobalConfig } from 'payload'
import { revalidatePath, revalidateTag } from 'next/cache'

import { adminOnly } from '@/access/adminOnly'

const textoConEnfasis = (prefijo: string, titulo: string, enfasis: string) => ({
  type: 'row' as const,
  fields: [
    { name: `${prefijo}Titulo`, type: 'text' as const, label: 'Titular — parte en negro', defaultValue: titulo },
    { name: `${prefijo}Enfasis`, type: 'text' as const, label: 'Titular — parte destacada', defaultValue: enfasis },
  ],
})

/** Textos fijos de la tienda: encabezado del catálogo, ficha de producto y pantallas de compra. */
export const TiendaTextos: GlobalConfig = {
  slug: 'tiendaTextos',
  label: 'Tienda: textos',
  admin: {
    group: 'Tienda',
    description: 'Encabezado del catálogo, textos de la ficha de producto, carrito y pago.',
  },
  access: { read: () => true, update: adminOnly },
  hooks: {
    afterChange: [
      ({ doc, req }) => {
        if (req.context?.disableRevalidate) return doc
        revalidateTag('global_tiendaTextos', 'max')
        revalidatePath('/shop', 'layout')
        revalidatePath('/products', 'layout')
        return doc
      },
    ],
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Catálogo',
          fields: [
            { name: 'eyebrow', type: 'text', label: 'Etiqueta pequeña', defaultValue: 'Tienda' },
            textoConEnfasis('catalogo', 'Todo lo que ofrecemos,', 'listo para pedir'),
            { name: 'lead', type: 'textarea', label: 'Entradilla', defaultValue: 'Elige, paga en línea con tarjeta, PSE o Nequi y te lo enviamos.' },
            { name: 'buscador', type: 'text', label: 'Texto dentro del buscador', defaultValue: 'Buscar productos…' },
            { name: 'sinResultados', type: 'text', label: 'Si no hay productos', defaultValue: 'No encontramos productos con esos filtros.' },
          ],
        },
        {
          label: 'Ficha de producto',
          fields: [
            { name: 'textoVolver', type: 'text', label: 'Enlace para volver', defaultValue: 'Volver a la tienda' },
            { name: 'textoAgregar', type: 'text', label: 'Botón de agregar', defaultValue: 'Agregar al carrito' },
            { name: 'textoElegir', type: 'text', label: 'Aviso si falta elegir opción', defaultValue: 'Elige una opción para continuar' },
            { name: 'textoPreguntar', type: 'text', label: 'Botón de preguntar por WhatsApp', defaultValue: 'Preguntar por WhatsApp' },
            {
              name: 'mensajePreguntar',
              type: 'text',
              label: 'Mensaje de WhatsApp',
              defaultValue: 'Hola, tengo una pregunta sobre {producto}.',
              admin: { description: '{producto} se reemplaza por el nombre del producto.' },
            },
            {
              name: 'garantias',
              type: 'array',
              label: 'Garantías bajo el botón',
              labels: { singular: 'Garantía', plural: 'Garantías' },
              fields: [{ name: 'texto', type: 'text', label: 'Texto', required: true }],
              defaultValue: [
                { texto: 'Pago seguro con Wompi: tarjeta, PSE, Nequi o Bancolombia' },
                { texto: 'Atención directa por WhatsApp' },
              ],
            },
            { name: 'textoRelacionados', type: 'text', label: 'Título de productos relacionados', defaultValue: 'También te puede gustar' },
          ],
        },
        {
          label: 'Carrito y pago',
          fields: [
            { name: 'carritoTitulo', type: 'text', label: 'Título del carrito', defaultValue: 'Tu carrito' },
            { name: 'carritoVacio', type: 'text', label: 'Carrito vacío', defaultValue: 'Tu carrito está vacío.' },
            { name: 'textoFinalizar', type: 'text', label: 'Botón para pagar', defaultValue: 'Finalizar compra' },
            textoConEnfasis('pago', 'Finaliza tu', 'compra'),
            { name: 'pagoLead', type: 'textarea', label: 'Texto bajo el título del pago', defaultValue: 'Déjanos tus datos de envío y paga de forma segura con Wompi.' },
          ],
        },
      ],
    },
  ],
}
