import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { unstable_cache } from 'next/cache'

/** Artículos publicados, del más nuevo al más antiguo (en caché hasta que se edite uno). */
export const articulosPublicados = unstable_cache(
  async () => {
    const payload = await getPayload({ config: configPromise })
    const r = await payload.find({
      collection: 'articulos',
      where: { _status: { equals: 'published' } },
      // Mismo día: primero el que se creó antes.
      sort: ['-fechaPublicacion', 'createdAt'],
      limit: 200,
      depth: 1,
      overrideAccess: false,
      select: { title: true, slug: true, descripcion: true, portada: true, etiquetas: true, fechaPublicacion: true, minutosLectura: true },
    })
    return r.docs as any[]
  },
  ['articulos-lista'],
  { tags: ['articulos'] },
)

export async function articuloPorSlug(slug: string, borrador = false) {
  const payload = await getPayload({ config: configPromise })
  const r = await payload.find({
    collection: 'articulos',
    where: borrador ? { slug: { equals: slug } } : { and: [{ slug: { equals: slug } }, { _status: { equals: 'published' } }] },
    draft: borrador,
    limit: 1,
    depth: 1,
    overrideAccess: borrador,
  })
  return (r.docs[0] as any) ?? null
}

/** Texto plano de un nodo de Lexical. */
export const textoDe = (n: any): string => (typeof n?.text === 'string' ? n.text : (n?.children || []).map(textoDe).join(''))

/** "Cómo aparecer en Google" → "como-aparecer-en-google", para los anclajes del índice. */
export const anclaDe = (t: string) =>
  t
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

export const fechaLarga = (d?: string) =>
  d ? new Date(d).toLocaleDateString('es-CO', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }) : ''
