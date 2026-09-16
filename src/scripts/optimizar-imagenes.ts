import fs from 'node:fs/promises'
import path from 'node:path'

import type { Payload } from 'payload'

/**
 * Pasa por la optimización las imágenes que se subieron antes de activarla:
 * vuelve a subir cada archivo para que quede en WebP y con todos sus tamaños
 * (incluido el PNG que usan los correos).
 *
 * Va por tandas: en un servidor cada petición tiene unos segundos de vida, y
 * procesar veinte fotos de golpe se corta a la mitad. Devuelve cuántas quedan
 * para poder repetir hasta terminar.
 */
export async function optimizarImagenes(payload: Payload, forzar = false, tanda = 3) {
  const { docs } = await payload.find({ collection: 'media', limit: 0, pagination: false, depth: 0 })
  const esImagen = (d: any) => String(d.mimeType || '').startsWith('image/') && d.mimeType !== 'image/svg+xml'
  const pendientes = (docs as any[]).filter((d) => esImagen(d) && (forzar ? !d.sizes?.correo?.url : !d.optimizada))

  // Primero el logo y los iconos del negocio: son los que se ven en los correos.
  const negocio: any = await payload.findGlobal({ slug: 'tienda', depth: 0 }).catch(() => null)
  const dela = (v: any) => (typeof v === 'object' ? v?.id : v)
  const marca = new Set([dela(negocio?.logoBlanco), dela(negocio?.logo), dela(negocio?.isotipo), dela(negocio?.favicon)].filter(Boolean).map(String))
  pendientes.sort((a, b) => Number(marca.has(String(b.id))) - Number(marca.has(String(a.id))))
  const resumen = { revisadas: docs.length, optimizadas: 0, pendientes: Math.max(0, pendientes.length - tanda), fallidas: [] as string[], ahorroKB: 0 }

  for (const doc of pendientes.slice(0, tanda)) {
    try {
      let data: Buffer
      const local = path.resolve(process.cwd(), 'public/media', doc.filename)
      try {
        data = await fs.readFile(local)
      } catch {
        const base = (process.env.NEXT_PUBLIC_SERVER_URL || '').replace(/\/$/, '')
        const res = await fetch(/^https?:/.test(doc.url) ? doc.url : `${base}${doc.url}`)
        if (!res.ok) throw new Error(`descarga ${res.status}`)
        data = Buffer.from(await res.arrayBuffer())
      }
      const antes = doc.filesize || data.length
      const nuevo: any = await payload.update({
        collection: 'media',
        id: doc.id,
        data: { optimizada: new Date().toISOString() },
        file: { data, mimetype: doc.mimeType, name: doc.filename, size: data.length },
        context: { disableRevalidate: true },
      })
      resumen.optimizadas++
      resumen.ahorroKB += Math.round((antes - (nuevo.filesize || antes)) / 1024)
    } catch (e) {
      resumen.fallidas.push(`${doc.filename}: ${e instanceof Error ? e.message : String(e)}`)
    }
  }
  resumen.pendientes = Math.max(0, pendientes.length - resumen.optimizadas - resumen.fallidas.length)
  return resumen
}
