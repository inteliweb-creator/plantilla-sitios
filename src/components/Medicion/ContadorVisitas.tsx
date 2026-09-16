'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useRef } from 'react'

import { medir } from './eventos'

/**
 * Cuenta cada página vista para las estadísticas del panel. Sin cookies:
 * solo envía la dirección, de dónde llegó la persona y la campaña (utm).
 * También cuenta los clics a WhatsApp, estén donde estén en la página.
 */
function enviar(datos: Record<string, string | undefined>) {
  const cuerpo = JSON.stringify(datos)
  try {
    if (navigator.sendBeacon?.('/next/visita', new Blob([cuerpo], { type: 'text/plain' }))) return
  } catch {}
  fetch('/next/visita', { method: 'POST', body: cuerpo, keepalive: true }).catch(() => {})
}

// Evita contar dos veces la misma página (React puede ejecutar el efecto dos veces).
let ultima = { ruta: '', momento: 0 }

export function ContadorVisitas() {
  const ruta = usePathname()
  const primera = useRef(true)

  useEffect(() => {
    // Vista previa del editor dentro del panel: no cuenta.
    if (window.self !== window.top) return
    if (ultima.ruta === ruta && Date.now() - ultima.momento < 1500) return
    ultima = { ruta, momento: Date.now() }
    const params = new URLSearchParams(window.location.search)
    enviar({
      ruta,
      // La primera página trae el sitio de origen; las siguientes son navegación interna.
      referente: primera.current ? document.referrer : window.location.href,
      utmSource: primera.current ? params.get('utm_source') || undefined : undefined,
      utmMedium: primera.current ? params.get('utm_medium') || undefined : undefined,
    })
    primera.current = false
  }, [ruta])

  useEffect(() => {
    const alClic = (e: MouseEvent) => {
      const a = (e.target as HTMLElement | null)?.closest?.('a')
      if (!a || !/wa\.me|api\.whatsapp\.com|whatsapp:\/\//i.test(a.getAttribute('href') || '')) return
      enviar({ ruta: window.location.pathname, tipo: 'whatsapp' })
      medir('whatsapp')
    }
    document.addEventListener('click', alClic, true)
    return () => document.removeEventListener('click', alClic, true)
  }, [])

  return null
}
