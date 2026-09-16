import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'

/**
 * Logo e ícono del panel. Salen de "Datos del negocio", así cada cliente ve
 * su propia marca al entrar; si todavía no subió logo, se muestra uno neutro.
 */
async function marca() {
  try {
    const payload = await getPayload({ config: configPromise })
    const t: any = await payload.findGlobal({ slug: 'tienda', depth: 1 })
    return { logo: t?.logo?.url as string | undefined, isotipo: (t?.isotipo?.url || t?.favicon?.url) as string | undefined, nombre: t?.nombre as string }
  } catch {
    return { logo: undefined, isotipo: undefined, nombre: '' }
  }
}

export async function LogoPanel() {
  const { logo, nombre } = await marca()
  return (
    <img
      src={logo || '/marca/logo-negro.png'}
      alt={nombre || 'Mi negocio'}
      style={{ width: 'auto', maxWidth: 280, height: 52, objectFit: 'contain' }}
    />
  )
}

export async function IconoPanel() {
  const { isotipo, nombre } = await marca()
  return (
    <img
      src={isotipo || '/marca/icono-negro.png'}
      alt={nombre || 'Mi negocio'}
      style={{ width: 'auto', height: 22, objectFit: 'contain' }}
    />
  )
}
