'use client'

import { useAuth } from '@payloadcms/ui'
import { usePathname } from 'next/navigation'
import React from 'react'

import { useEstadoAsistente } from './activo'
import { IWe } from './IWe'

/**
 * Pone la burbuja del asistente en todas las pantallas del panel, solo para
 * administradores con sesión y solo si el asistente está encendido en
 * Configuración → Asistente IA. En /admin/asistente no hace falta: ya está en grande.
 */
export function ProveedorIWe({ children }: { children?: React.ReactNode }) {
  const { user } = useAuth()
  const ruta = usePathname() || ''
  const esAdmin = Boolean((user as any)?.roles?.includes?.('admin'))
  const pantallaValida = ruta.startsWith('/admin') && !ruta.startsWith('/admin/asistente') && !/\/admin\/(login|logout|forgot|reset|create-first-user)/.test(ruta)
  // Se vuelve a consultar al cambiar de pantalla (por si lo acaban de encender o apagar).
  const estado = useEstadoAsistente(esAdmin ? ruta : undefined)
  const mostrar = esAdmin && pantallaValida && Boolean(estado?.activo)
  return (
    <>
      {children}
      {mostrar ? <IWe modo="flotante" /> : null}
    </>
  )
}

export default ProveedorIWe
