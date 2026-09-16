import type { GlobalConfig } from 'payload'
import { revalidatePath, revalidateTag } from 'next/cache'

import { adminOnly } from '@/access/adminOnly'
import { moverFechasLegales } from '@/bloques/sitio/legal/fechas'

/** Textos fijos de las páginas del blog y del recuadro del boletín. */
export const Blog: GlobalConfig = {
  slug: 'blog',
  label: 'Blog: textos de la página',
  admin: {
    group: 'Blog y boletín',
    description: 'Encabezado del blog, recuadro de suscripción y cierre. Los artículos se escriben en "Artículos".',
  },
  access: { read: () => true, update: adminOnly },
  hooks: {
    afterChange: [
      async ({ doc, previousDoc, req }) => {
        await moverFechasLegales(req, { blog: previousDoc }, { blog: doc })
        if (req.context?.disableRevalidate) return doc
        revalidateTag('global_blog', 'max')
        revalidatePath('/blog', 'layout')
        return doc
      },
    ],
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Página del blog',
          fields: [
            { name: 'eyebrow', type: 'text', label: 'Etiqueta pequeña', defaultValue: 'Blog' },
            {
              type: 'row',
              fields: [
                { name: 'titulo', type: 'text', label: 'Titular — parte en negro', defaultValue: 'Lo que hay que saber,' },
                { name: 'enfasis', type: 'text', label: 'Titular — parte destacada' },
              ],
            },
            { name: 'lead', type: 'textarea', label: 'Entradilla' },
            {
              type: 'row',
              fields: [
                { name: 'cita', type: 'textarea', label: 'Tarjeta a la derecha — frase' },
                { name: 'meta', type: 'text', label: 'Tarjeta — texto pequeño', admin: { description: 'Delante se pone solo el número de artículos.' } },
              ],
            },
            { name: 'sinArticulos', type: 'text', label: 'Mensaje si aún no hay artículos', defaultValue: 'Muy pronto publicaremos el primer artículo.' },
            {
              type: 'group',
              name: 'seo',
              label: 'Google (SEO) de la página del blog',
              fields: [
                { name: 'titulo', type: 'text', label: 'Título para Google', maxLength: 70 },
                { name: 'descripcion', type: 'textarea', label: 'Descripción para Google', maxLength: 160 },
              ],
            },
          ],
        },
        {
          label: 'Recuadro del boletín',
          description: 'Sale en el blog y al final de cada artículo.',
          fields: [
            { name: 'mostrarBoletin', type: 'checkbox', label: 'Mostrar el recuadro de suscripción', defaultValue: true },
            { name: 'boletinEtiqueta', type: 'text', label: 'Etiqueta', defaultValue: 'Boletín' },
            {
              type: 'row',
              fields: [
                { name: 'boletinTitulo', type: 'text', label: 'Título — parte en negro', defaultValue: 'Recibe los artículos' },
                { name: 'boletinEnfasis', type: 'text', label: 'Título — parte destacada', defaultValue: 'cuando salgan' },
              ],
            },
            { name: 'boletinTexto', type: 'textarea', label: 'Texto' },
            {
              type: 'row',
              fields: [
                { name: 'boletinBoton', type: 'text', label: 'Botón', defaultValue: 'Suscribirme' },
                { name: 'boletinNota', type: 'text', label: 'Nota bajo el campo', defaultValue: 'Sin spam. Te puedes dar de baja en un clic.' },
              ],
            },
            { name: 'boletinExito', type: 'textarea', label: 'Mensaje al suscribirse', defaultValue: 'Escribimos poco y solo cuando hay algo que de verdad sirve. Puedes salirte cuando quieras desde cualquier correo.' },
            { name: 'bienvenida', type: 'textarea', label: 'Correo de bienvenida al suscriptor', defaultValue: 'Gracias por suscribirte. Te escribiremos solo cuando publiquemos algo que de verdad te sirva.' },
            { name: 'avisarSuscripcion', type: 'checkbox', label: 'Avisarme por correo cuando alguien se suscriba', defaultValue: true, admin: { description: 'Llega al correo de "Correos y avisos".' } },
          ],
        },
        {
          label: 'Dentro de cada artículo',
          fields: [
            { name: 'textoIndice', type: 'text', label: 'Título del índice', defaultValue: 'En este artículo' },
            { name: 'textoSigueLeyendo', type: 'text', label: 'Título de "otros artículos"', defaultValue: 'Sigue leyendo' },
            { name: 'mostrarCompartir', type: 'checkbox', label: 'Mostrar botones para compartir (WhatsApp, Facebook, LinkedIn, X)', defaultValue: true },
            { name: 'textoCompartir', type: 'text', label: 'Texto junto a los botones', defaultValue: '¿Le sirve a alguien? Compártelo' },
          ],
        },
        {
          label: 'Comentarios',
          description: 'Los lectores pueden comentar los artículos. Nada se publica hasta que lo apruebes en "Comentarios".',
          fields: [
            { name: 'permitirComentarios', type: 'checkbox', label: 'Permitir comentarios en los artículos', defaultValue: true },
            {
              type: 'row',
              fields: [
                { name: 'tituloComentarios', type: 'text', label: 'Título de la sección', defaultValue: 'Comentarios' },
                { name: 'botonComentario', type: 'text', label: 'Botón', defaultValue: 'Enviar comentario' },
              ],
            },
            { name: 'invitacionComentarios', type: 'text', label: 'Texto cuando aún no hay comentarios', defaultValue: 'Sé la primera persona en comentar. ¿Qué te quedó dando vueltas?' },
            { name: 'avisoModeracion', type: 'text', label: 'Mensaje al enviar', defaultValue: 'Gracias. Tu comentario aparecerá cuando lo revisemos.' },
            { name: 'avisarComentario', type: 'checkbox', label: 'Avisarme por correo cuando llegue un comentario', defaultValue: true, admin: { description: 'Llega al correo de "Correos y avisos".' } },
          ],
        },
        {
          label: 'Cierre',
          description: 'Recuadro final del blog y de cada artículo, con botón a WhatsApp.',
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'cierreTitulo', type: 'text', label: 'Titular — parte en negro' },
                { name: 'cierreEnfasis', type: 'text', label: 'Titular — parte destacada' },
              ],
            },
            { name: 'cierreLead', type: 'textarea', label: 'Texto' },
            {
              type: 'row',
              fields: [
                { name: 'cierreBoton', type: 'text', label: 'Botón', defaultValue: 'Cuéntanos tu caso' },
                { name: 'cierreMensajeWhatsapp', type: 'text', label: 'Mensaje de WhatsApp' },
              ],
            },
          ],
        },
      ],
    },
  ],
}
