import configPromise from '@payload-config'
import { unstable_cache } from 'next/cache'
import { getPayload } from 'payload'

/** Solo lo que se puede mostrar: el archivo y el enlace de entrega nunca salen de aquí. */
const PUBLICO = { titulo: true, slug: true, descripcion: true, portada: true, beneficios: true, textoBoton: true, textoExito: true, updatedAt: true } as const

export const recursosPublicados = unstable_cache(
  async () => {
    const payload = await getPayload({ config: configPromise })
    const r = await payload.find({ collection: 'recursos', where: { publicado: { equals: true } }, sort: '-createdAt', limit: 100, depth: 1, select: PUBLICO })
    return r.docs as any[]
  },
  ['recursos-publicados'],
  { tags: ['recursos'] },
)

export const recursoPorSlug = (slug: string) =>
  unstable_cache(
    async () => {
      const payload = await getPayload({ config: configPromise })
      const r = await payload.find({
        collection: 'recursos',
        where: { and: [{ slug: { equals: slug } }, { publicado: { equals: true } }] },
        limit: 1,
        depth: 1,
        select: PUBLICO,
      })
      return (r.docs[0] as any) || null
    },
    ['recurso', slug],
    { tags: ['recursos'] },
  )()

export const recursoPorId = (id: number | string) =>
  unstable_cache(
    async () => {
      const payload = await getPayload({ config: configPromise })
      const r = await payload.find({
        collection: 'recursos',
        where: { and: [{ id: { equals: id } }, { publicado: { equals: true } }] },
        limit: 1,
        depth: 1,
        select: PUBLICO,
      })
      return (r.docs[0] as any) || null
    },
    ['recurso-id', String(id)],
    { tags: ['recursos'] },
  )()
