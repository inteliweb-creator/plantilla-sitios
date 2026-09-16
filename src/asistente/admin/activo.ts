'use client'

import { useEffect, useState } from 'react'

/**
 * ¿Está encendido el asistente? Lo consultan la burbuja y los botones ✨ para
 * no aparecer en sitios que no lo usan. Se pide una sola vez por pantalla.
 */
let promesa: Promise<any> | null = null

export function leerEstadoAsistente(refrescar = false): Promise<any> {
  if (!promesa || refrescar) {
    promesa = fetch('/next/asistente', { credentials: 'include' })
      .then((r) => (r.ok ? r.json() : null))
      .catch(() => null)
  }
  return promesa
}

export function useEstadoAsistente(clave?: string) {
  const [estado, setEstado] = useState<any>(null)
  useEffect(() => {
    let vivo = true
    leerEstadoAsistente(clave !== undefined).then((e) => vivo && setEstado(e))
    return () => {
      vivo = false
    }
  }, [clave])
  return estado
}
