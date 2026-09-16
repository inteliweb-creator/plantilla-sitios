import type { GlobalConfig } from 'payload'
import { revalidatePath, revalidateTag } from 'next/cache'

import { adminOnly } from '@/access/adminOnly'
import { moverFechasLegales } from '@/bloques/sitio/legal/fechas'

/**
 * Módulos del sitio: qué partes tiene este cliente.
 *
 * Apagar un módulo no borra nada: sus páginas dejan de publicarse (dan "no
 * encontrada"), salen del mapa del sitio y sus secciones desaparecen del menú
 * del panel. Al volver a encenderlo, todo reaparece como estaba.
 */
export const Modulos: GlobalConfig = {
  slug: 'modulos',
  label: 'Módulos del sitio',
  admin: {
    group: 'Configuración',
    description:
      'Enciende solo lo que este negocio usa. Apagar un módulo no borra su contenido: lo oculta del sitio y del panel. Después de guardar, recarga el panel para ver el menú actualizado.',
  },
  access: { read: () => true, update: adminOnly },
  hooks: {
    afterChange: [
      async ({ doc, previousDoc, req }) => {
        if (req.context?.disableRevalidate) return doc
        revalidateTag('global_modulos', 'max')
        revalidatePath('/', 'layout')
        await moverFechasLegales(req, { modulos: previousDoc }, { modulos: doc })
        return doc
      },
    ],
  },
  fields: [
    {
      name: 'blog',
      type: 'checkbox',
      label: 'Blog',
      defaultValue: true,
      admin: { description: 'Página /blog, artículos y su sección en el panel.' },
    },
    {
      name: 'boletin',
      type: 'checkbox',
      label: 'Boletín',
      defaultValue: true,
      admin: { description: 'Formulario de suscripción, lista de suscriptores y envíos por correo.' },
    },
    {
      name: 'recursos',
      type: 'checkbox',
      label: 'Recursos gratis',
      defaultValue: true,
      admin: { description: 'Guías o plantillas que la gente recibe a cambio de su correo, con su página en /recursos.' },
    },
    {
      name: 'tienda',
      type: 'checkbox',
      label: 'Tienda en línea',
      defaultValue: true,
      admin: {
        description: 'Catálogo, productos, carrito, pago con Wompi, cuentas de clientes y pedidos.',
      },
    },
  ],
}
