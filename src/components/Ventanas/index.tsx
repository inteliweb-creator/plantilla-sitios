import { getCachedGlobal } from '@/utilities/getGlobals'
import { modulosActivos } from '@/modulos'

import { Ventanas as VentanasCliente, type ConfigVentanas } from './Ventanas'

const wa = (numero?: string | null, mensaje?: string | null) => {
  const n = String(numero || '').replace(/\D/g, '')
  return n ? `https://wa.me/${n}${mensaje ? `?text=${encodeURIComponent(mensaje)}` : ''}` : ''
}

/** Prepara las ventanas de "Ventanas de conversión" con los datos del negocio. */
export async function Ventanas() {
  const [v, negocio, modulos]: any[] = await Promise.all([getCachedGlobal('ventanas' as any, 1)(), getCachedGlobal('tienda', 0)(), modulosActivos()])
  if (!v) return null
  const config: ConfigVentanas = { salida: null, burbuja: null }

  if (v.salidaActiva) {
    let href = ''
    if (v.salidaAccion === 'whatsapp') href = wa(negocio?.whatsapp, v.salidaMensajeWhatsapp || negocio?.mensajeWhatsapp)
    else if (v.salidaAccion === 'enlace') href = v.salidaEnlace || ''
    else if (v.salidaAccion === 'recurso' && modulos.recursos && typeof v.salidaRecurso === 'object' && v.salidaRecurso?.publicado) href = `/recursos/${v.salidaRecurso.slug}`
    if (href) {
      config.salida = {
        titulo: v.salidaTitulo || '¿Te vas?',
        texto: v.salidaTexto || '',
        boton: v.salidaBoton || 'Ver',
        href,
        externo: /^https?:\/\//.test(href),
        dias: v.salidaDias || 7,
        segundos: v.salidaSegundosMinimos ?? 10,
        excluir: v.salidaExcluir || [],
      }
    }
  }
  const href = wa(negocio?.whatsapp, negocio?.mensajeWhatsapp)
  if (v.burbujaActiva && href) {
    config.burbuja = { mensaje: v.burbujaMensaje || 'Hola 👋 ¿Te ayudamos?', href, segundos: v.burbujaSegundos || 25, dias: v.burbujaDias || 1, excluir: v.burbujaExcluir || [] }
  }
  if (!config.salida && !config.burbuja) return null
  return <VentanasCliente config={config} />
}
