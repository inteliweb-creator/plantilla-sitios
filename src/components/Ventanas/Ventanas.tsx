'use client'

import { usePathname } from 'next/navigation'
import { useCallback, useEffect, useRef, useState } from 'react'

export type ConfigVentanas = {
  salida: null | { titulo: string; texto: string; boton: string; href: string; externo: boolean; dias: number; segundos: number; excluir: string[] }
  burbuja: null | { mensaje: string; href: string; segundos: number; dias: number; excluir: string[] }
}

const leer = (clave: string) => {
  try {
    return Number(localStorage.getItem(clave) || 0)
  } catch {
    return 0
  }
}
const guardarHasta = (clave: string, dias: number) => {
  try {
    localStorage.setItem(clave, String(Date.now() + dias * 86400000))
  } catch {}
}
const excluida = (ruta: string, lista: string[]) => lista.some((r) => r && (ruta === r || ruta.startsWith(`${r.replace(/\/$/, '')}/`)))
// No se pisan con el aviso de cookies.
const hayOtroAviso = () => Boolean(document.querySelector('[aria-label="Aviso de cookies"]'))

/**
 * Aviso al intentar salir y burbuja de WhatsApp. Aparecen una sola vez por
 * visita y, si la persona las cierra, se callan los días indicados.
 */
export function Ventanas({ config }: { config: ConfigVentanas }) {
  const ruta = usePathname() || '/'
  const [salidaVisible, setSalidaVisible] = useState(false)
  const [burbujaVisible, setBurbujaVisible] = useState(false)
  const inicio = useRef(Date.now())
  const yaSalio = useRef(false)
  const dialogo = useRef<HTMLDivElement>(null)

  const cerrarSalida = useCallback(() => {
    setSalidaVisible(false)
    if (config.salida) guardarHasta('ventana-salida', config.salida.dias)
  }, [config.salida])

  // ---- Al intentar salir
  useEffect(() => {
    const s = config.salida
    if (!s || excluida(ruta, s.excluir) || window.self !== window.top) return
    if (leer('ventana-salida') > Date.now()) return

    const mostrar = () => {
      if (yaSalio.current || Date.now() - inicio.current < s.segundos * 1000 || hayOtroAviso()) return
      yaSalio.current = true
      setSalidaVisible(true)
    }
    const alSalirRaton = (e: MouseEvent) => {
      if (!e.relatedTarget && e.clientY <= 5) mostrar()
    }
    // Celular: tras leer al menos un 40 % de la página, un desplazamiento rápido hacia arriba.
    let ultimaY = window.scrollY
    let ultimoT = Date.now()
    const alDesplazar = () => {
      const y = window.scrollY
      const t = Date.now()
      const recorrido = (y + window.innerHeight) / Math.max(document.body.scrollHeight, 1)
      if (window.matchMedia('(pointer: coarse)').matches && recorrido > 0.4 && ultimaY - y > 140 && t - ultimoT < 250) mostrar()
      ultimaY = y
      ultimoT = t
    }
    document.addEventListener('mouseout', alSalirRaton)
    window.addEventListener('scroll', alDesplazar, { passive: true })
    return () => {
      document.removeEventListener('mouseout', alSalirRaton)
      window.removeEventListener('scroll', alDesplazar)
    }
  }, [config.salida, ruta])

  useEffect(() => {
    if (!salidaVisible) return
    dialogo.current?.querySelector<HTMLElement>('a,button')?.focus()
    const alTecla = (e: KeyboardEvent) => e.key === 'Escape' && cerrarSalida()
    document.addEventListener('keydown', alTecla)
    return () => document.removeEventListener('keydown', alTecla)
  }, [salidaVisible, cerrarSalida])

  // ---- Burbuja de WhatsApp
  useEffect(() => {
    const b = config.burbuja
    setBurbujaVisible(false)
    if (!b || excluida(ruta, b.excluir) || window.self !== window.top) return
    if (leer('ventana-burbuja') > Date.now()) return
    const reloj = setTimeout(() => {
      if (!hayOtroAviso()) setBurbujaVisible(true)
    }, b.segundos * 1000)
    return () => clearTimeout(reloj)
  }, [config.burbuja, ruta])

  const cerrarBurbuja = () => {
    setBurbujaVisible(false)
    if (config.burbuja) guardarHasta('ventana-burbuja', config.burbuja.dias)
  }

  return (
    <>
      {salidaVisible && config.salida && (
        <div className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={cerrarSalida}>
          <div
            ref={dialogo}
            role="dialog"
            aria-modal="true"
            aria-labelledby="ventana-salida-titulo"
            className="relative w-full max-w-md rounded-[28px] bg-white p-7 sm:p-9 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button type="button" onClick={cerrarSalida} aria-label="Cerrar" className="absolute top-4 right-4 w-9 h-9 rounded-full text-slate hover:bg-surface-2 flex items-center justify-center text-xl leading-none">
              ×
            </button>
            <h2 id="ventana-salida-titulo" className="text-2xl sm:text-[1.8rem] text-graphite leading-tight mb-3 pr-8">
              {config.salida.titulo}
            </h2>
            {config.salida.texto && <p className="text-sm sm:text-base text-slate leading-relaxed mb-7">{config.salida.texto}</p>}
            <div className="flex flex-col sm:flex-row gap-2.5">
              <a
                href={config.salida.href}
                className="pill-negra text-sm justify-center"
                onClick={() => {
                  setSalidaVisible(false)
                  guardarHasta('ventana-salida', config.salida!.dias)
                }}
                {...(config.salida.externo ? { target: '_blank', rel: 'noreferrer' } : {})}
              >
                <span>{config.salida.boton}</span>
              </a>
              <button type="button" onClick={cerrarSalida} className="rounded-full px-5 py-3 text-sm text-slate hover:text-graphite">
                Ahora no
              </button>
            </div>
          </div>
        </div>
      )}

      {burbujaVisible && config.burbuja && (
        <div role="status" className="fixed z-[55] right-5 bottom-[5.5rem] max-w-[17rem] rounded-2xl rounded-br-md bg-white border border-line shadow-[var(--shadow-lift)] p-4 pr-9" data-burbuja>
          <button type="button" onClick={cerrarBurbuja} aria-label="Cerrar mensaje" className="absolute top-2 right-2 w-7 h-7 rounded-full text-slate hover:bg-surface-2 flex items-center justify-center leading-none">
            ×
          </button>
          <p className="text-sm text-graphite leading-snug mb-3">{config.burbuja.mensaje}</p>
          <a href={config.burbuja.href} target="_blank" rel="noreferrer" onClick={cerrarBurbuja} className="inline-flex items-center gap-1.5 rounded-full bg-[#25D366] text-white text-xs font-semibold px-3.5 py-2">
            Responder por WhatsApp
          </a>
        </div>
      )}
    </>
  )
}
