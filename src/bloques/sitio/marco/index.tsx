import React from 'react'

import { Cart } from '@/components/Cart'
import { getCachedGlobal } from '@/utilities/getGlobals'
import { modulosActivos } from '@/modulos'
import { recursosPublicados } from '@/bloques/sitio/recursos/datos'

import BarraProgreso from './BarraProgreso.jsx'
import Cabecera from './Cabecera.jsx'
import Pie from './Pie.jsx'
import Riel from './Riel.jsx'

/**
 * Marco del sitio: cabecera, riel lateral / menú de celular y pie de página.
 * Lee "Menú y pie de página" y "Datos del negocio" una vez y los reparte.
 */
async function leer() {
  const [nav, negocio, modulos] = await Promise.all([
    getCachedGlobal('navegacion', 1)(),
    getCachedGlobal('tienda', 1)(),
    modulosActivos(),
  ])
  const hayRecursos = modulos.recursos && (await recursosPublicados()).length > 0

  // Un enlace a una sección apagada (o sin nada que mostrar) llevaría a una
  // página de error: se esconde solo y reaparece al encender la sección.
  const apagada = (enlace?: string) => {
    const ruta = String(enlace || '').split(/[?#]/)[0]
    const en = (...prefijos: string[]) => prefijos.some((p) => ruta === p || ruta.startsWith(`${p}/`))
    if (!modulos.blog && en('/blog')) return true
    if (!hayRecursos && en('/recursos')) return true
    if (!modulos.tienda && en('/shop', '/products', '/checkout', '/account', '/orders', '/login', '/create-account', '/find-order')) return true
    return false
  }
  const filtrar = (lista?: any[]) => (Array.isArray(lista) ? lista.filter((e) => !apagada(e?.enlace)) : lista)
  const n: any = nav ? { ...nav, menu: filtrar((nav as any).menu), riel: filtrar((nav as any).riel), enlacesPie: filtrar((nav as any).enlacesPie), legales: filtrar((nav as any).legales) } : nav
  return { nav: n, negocio: negocio as any }
}

export async function MarcoSuperior() {
  const { nav, negocio } = await leer()
  return (
    <>
      <BarraProgreso />
      <Cabecera nav={nav} negocio={negocio} carrito={(nav?.mostrarCarrito && (await modulosActivos()).tienda ? <Cart /> : null) as any} />
      <Riel nav={nav} negocio={negocio} />
    </>
  )
}

export async function MarcoPie() {
  const { nav, negocio } = await leer()
  return <Pie nav={nav} negocio={negocio} />
}
