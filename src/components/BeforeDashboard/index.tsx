import React from 'react'

import configPromise from '@payload-config'
import { getPayload } from 'payload'

import { modulosActivos } from '@/modulos'

import './index.scss'

const baseClass = 'before-dashboard'

type Acceso = { titulo: string; texto: string; enlace: string; externo?: boolean }

/**
 * Guía rápida del panel: dónde está cada cosa, en palabras simples.
 * Solo muestra lo que este sitio tiene encendido en "Módulos del sitio".
 */
export const BeforeDashboard = async () => {
  const m = await modulosActivos()
  const asistente: any = await (await getPayload({ config: configPromise })).findGlobal({ slug: 'asistente', depth: 0, overrideAccess: true }).catch(() => null)

  const grupos: { titulo: string; accesos: Acceso[] }[] = [
    {
      titulo: 'Tu sitio',
      accesos: [
        { titulo: 'Páginas', texto: 'Textos, imágenes y orden de las secciones.', enlace: '/admin/collections/pages' },
        { titulo: 'Imágenes y archivos', texto: 'Se optimizan solas al subirlas.', enlace: '/admin/collections/media' },
        { titulo: 'Menú y pie de página', texto: 'Enlaces de arriba y de abajo.', enlace: '/admin/globals/navegacion' },
        { titulo: 'Documentos legales', texto: 'Privacidad, cookies y términos.', enlace: '/admin/collections/legales' },
        { titulo: 'Ver el sitio', texto: 'Abre tu página en otra pestaña.', enlace: '/', externo: true },
      ],
    },
    {
      titulo: 'Clientes y ventas',
      accesos: [
        { titulo: 'Buzón de mensajes', texto: 'Lo que escriben en el formulario.', enlace: '/admin/collections/mensajes' },
        ...(m.blog
          ? [
              { titulo: 'Artículos del blog', texto: 'Escribe, programa y publica.', enlace: '/admin/collections/articulos' },
              { titulo: 'Comentarios', texto: 'Aprueba o responde lo que comentan.', enlace: '/admin/collections/comentarios' },
            ]
          : []),
        ...(m.recursos
          ? [
              { titulo: 'Recursos gratis', texto: 'Guías que se entregan a cambio del correo.', enlace: '/admin/collections/recursos' },
              { titulo: 'Interesados', texto: 'Quién pidió cada recurso.', enlace: '/admin/collections/solicitudesRecurso' },
            ]
          : []),
        ...(m.boletin
          ? [
              { titulo: 'Suscriptores', texto: 'Quiénes reciben tu boletín. Importa o descarga en CSV.', enlace: '/admin/collections/suscriptores' },
              { titulo: 'Envíos del boletín', texto: 'Escribe y envía correos.', enlace: '/admin/collections/boletines' },
            ]
          : []),
        ...(m.tienda
          ? [
              { titulo: 'Productos', texto: 'Precios, fotos y existencias.', enlace: '/admin/collections/products' },
              { titulo: 'Pedidos', texto: 'Compras y su estado de envío.', enlace: '/admin/collections/orders' },
            ]
          : []),
      ],
    },
    {
      titulo: 'Configuración',
      accesos: [
        ...(asistente?.activo
          ? [{ titulo: `Asistente ${asistente.nombre || ''}`.trim(), texto: 'También en la burbuja de abajo a la derecha. Escríbele o díctale.', enlace: '/admin/asistente' }]
          : []),
        { titulo: 'Revisión del sitio', texto: 'Comprueba correos, imágenes y conexiones.', enlace: '/admin/revision' },
        { titulo: 'Cambiar mi contraseña', texto: 'Pulsa "Cambiar contraseña"; te pedirá la actual.', enlace: '/admin/account' },
        { titulo: 'Datos del negocio', texto: 'Nombre, logo, WhatsApp, dirección.', enlace: '/admin/globals/tienda' },
        { titulo: 'Correos y avisos', texto: 'A dónde te llegan los mensajes.', enlace: '/admin/globals/avisos' },
        { titulo: 'Analítica y píxeles', texto: 'Google Analytics, Meta, TikTok, Clarity.', enlace: '/admin/globals/medicion' },
        { titulo: 'Ventanas de conversión', texto: 'Aviso al salir y burbuja de WhatsApp.', enlace: '/admin/globals/ventanas' },
        { titulo: 'Usuarios', texto: 'Quién puede entrar al panel.', enlace: '/admin/collections/users' },
        { titulo: 'Módulos del sitio', texto: 'Enciende o apaga blog, boletín y tienda.', enlace: '/admin/globals/modulos' },
      ],
    },
  ]

  return (
    <div className={baseClass}>
      <h2 className={`${baseClass}__titulo`}>Accesos rápidos</h2>
      {grupos.map((g) => (
        <div key={g.titulo} className={`${baseClass}__grupo`}>
          <h3>{g.titulo}</h3>
          <div className={`${baseClass}__accesos`}>
            {g.accesos.map((a) => (
              <a key={a.titulo} href={a.enlace} className={`${baseClass}__acceso`} {...(a.externo ? { target: '_blank', rel: 'noreferrer' } : {})}>
                <strong>{a.titulo}</strong>
                <span>{a.texto}</span>
              </a>
            ))}
          </div>
        </div>
      ))}
      <p className={`${baseClass}__nota`}>¿Olvidaste tu contraseña? En la pantalla de inicio de sesión pulsa “¿Olvidaste tu contraseña?” y te llegará un correo.</p>
    </div>
  )
}
