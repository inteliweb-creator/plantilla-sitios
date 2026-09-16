import type { Access, CollectionConfig, Config, GlobalConfig, PayloadRequest, Plugin } from 'payload'
import { notFound } from 'next/navigation'

import { getCachedGlobal } from '@/utilities/getGlobals'

export type Modulo = 'blog' | 'boletin' | 'tienda' | 'recursos'
export type EstadoModulos = Record<Modulo, boolean>

const TODO_ENCENDIDO: EstadoModulos = { blog: true, boletin: true, tienda: true, recursos: true }

const normalizar = (g: any): EstadoModulos => ({
  blog: g?.blog !== false,
  boletin: g?.boletin !== false,
  tienda: g?.tienda !== false,
  recursos: g?.recursos !== false,
})

/** Para el sitio: qué módulos están encendidos (en caché hasta que se guarde la pantalla). */
export async function modulosActivos(): Promise<EstadoModulos> {
  try {
    return normalizar(await getCachedGlobal('modulos' as any, 0)())
  } catch {
    return TODO_ENCENDIDO
  }
}

/** En una página del sitio: si el módulo está apagado, responde "no encontrada". */
export async function exigirModulo(modulo: Modulo) {
  const m = await modulosActivos()
  if (!m[modulo]) notFound()
}

/** Para el panel: se lee una sola vez por petición. */
async function modulosDePeticion(req: PayloadRequest): Promise<EstadoModulos> {
  const ctx = req.context as any
  if (!ctx.__modulos) {
    ctx.__modulos = req.payload
      .findGlobal({ slug: 'modulos' as any, depth: 0, overrideAccess: true, req })
      .then(normalizar)
      .catch(() => TODO_ENCENDIDO)
  }
  return ctx.__modulos
}

/** Colecciones y pantallas de cada módulo. `modulos` con varios = visible si alguno está encendido. */
const COLECCIONES: Record<string, Modulo[]> = {
  articulos: ['blog'],
  comentarios: ['blog'],
  recursos: ['recursos'],
  solicitudesRecurso: ['recursos'],
  suscriptores: ['boletin'],
  boletines: ['boletin'],
  products: ['tienda'],
  variants: ['tienda'],
  variantTypes: ['tienda'],
  variantOptions: ['tienda'],
  categories: ['tienda'],
  carts: ['tienda'],
  orders: ['tienda'],
  transactions: ['tienda'],
  addresses: ['tienda'],
}
const GLOBALES: Record<string, Modulo[]> = {
  blog: ['blog', 'boletin'],
  tiendaTextos: ['tienda'],
}

/**
 * Envuelve el acceso: con el módulo apagado, nadie (ni el administrador)
 * puede leer ni editar esas secciones desde el panel o la API, y el panel las
 * saca del menú. Las operaciones internas del servidor (overrideAccess) no se
 * ven afectadas, así que nada se rompe por dentro.
 */
const envolver = (original: Access | undefined, modulos: Modulo[]): Access => async (args) => {
  const m = await modulosDePeticion(args.req)
  if (!modulos.some((x) => m[x])) return false
  return original ? original(args) : Boolean(args.req.user)
}

export const modulosPlugin: Plugin = (config: Config): Config => {
  for (const c of (config.collections || []) as CollectionConfig[]) {
    const mods = COLECCIONES[c.slug]
    if (!mods) continue
    const a = c.access || {}
    c.access = {
      ...a,
      read: envolver(a.read, mods),
      create: envolver(a.create, mods),
      update: envolver(a.update, mods),
      delete: envolver(a.delete, mods),
    }
  }
  for (const g of (config.globals || []) as GlobalConfig[]) {
    const mods = GLOBALES[g.slug]
    if (!mods) continue
    const a = g.access || {}
    g.access = { ...a, read: envolver(a.read as Access, mods), update: envolver(a.update as Access, mods) }
  }
  return config
}
