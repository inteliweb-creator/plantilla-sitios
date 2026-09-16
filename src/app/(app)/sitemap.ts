import type { MetadataRoute } from 'next'
import configPromise from '@payload-config'
import { getPayload } from 'payload'

import { modulosActivos } from '@/modulos'

/** Mapa del sitio para Google: páginas, artículos del blog y productos publicados. */
export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = (process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000').replace(/\/$/, '')
  const payload = await getPayload({ config: configPromise })
  const m = await modulosActivos()
  const vacio = { docs: [] as any[] }
  const publicado = { _status: { equals: 'published' } } as const
  const [paginas, articulos, productos, legales, recursos] = await Promise.all([
    payload.find({ collection: 'pages', where: publicado, limit: 1000, pagination: false, select: { slug: true, updatedAt: true } }),
    m.blog ? payload.find({ collection: 'articulos', where: publicado, limit: 1000, pagination: false, select: { slug: true, updatedAt: true } }) : vacio,
    m.tienda ? payload.find({ collection: 'products', where: publicado, limit: 1000, pagination: false, select: { slug: true, updatedAt: true } }) : vacio,
    payload.find({ collection: 'legales', limit: 100, pagination: false, select: { slug: true, updatedAt: true } }),
    m.recursos ? payload.find({ collection: 'recursos', where: { publicado: { equals: true } }, limit: 200, pagination: false, select: { slug: true, updatedAt: true } }) : vacio,
  ])

  return [
    ...paginas.docs.map((p: any) => ({ url: `${base}${p.slug === 'home' ? '/' : `/${p.slug}`}`, lastModified: p.updatedAt })),
    ...(articulos.docs.length ? [{ url: `${base}/blog` }] : []),
    ...articulos.docs.map((a: any) => ({ url: `${base}/blog/${a.slug}`, lastModified: a.updatedAt })),
    ...productos.docs.map((p: any) => ({ url: `${base}/products/${p.slug}`, lastModified: p.updatedAt })),
    ...(recursos.docs.length ? [{ url: `${base}/recursos` }] : []),
    ...recursos.docs.map((r: any) => ({ url: `${base}/recursos/${r.slug}`, lastModified: r.updatedAt })),
    ...legales.docs.map((l: any) => ({ url: `${base}/${l.slug}`, lastModified: l.updatedAt })),
  ]
}
