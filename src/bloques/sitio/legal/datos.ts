import configPromise from '@payload-config'
import { unstable_cache } from 'next/cache'
import { getPayload } from 'payload'

import { getCachedGlobal } from '@/utilities/getGlobals'
import { getServerSideURL } from '@/utilities/getURL'

export const legalPorSlug = (slug: string) =>
  unstable_cache(
    async () => {
      const payload = await getPayload({ config: configPromise })
      const r = await payload.find({ collection: 'legales', where: { slug: { equals: slug } }, limit: 1, depth: 0 })
      return r.docs[0] || null
    },
    ['legal', slug],
    { tags: ['legales'] },
  )()

export const todosLosLegales = unstable_cache(
  async () => {
    const payload = await getPayload({ config: configPromise })
    const r = await payload.find({
      collection: 'legales',
      sort: 'orden',
      limit: 50,
      pagination: false,
      depth: 0,
      select: { titulo: true, etiqueta: true, slug: true, updatedAt: true },
    })
    return r.docs
  },
  ['legales-lista'],
  { tags: ['legales'] },
)

/** Valores de los marcadores {empresa}, {correo}… sacados de "Datos del negocio". */
export async function valoresNegocio(): Promise<Record<string, string>> {
  const t: any = await getCachedGlobal('tienda', 0)()
  const sitio = getServerSideURL().replace(/\/$/, '')
  return {
    '{empresa}': t?.nombre || '',
    '{correo}': t?.correo || '',
    '{telefono}': t?.telefono || t?.whatsapp || '',
    '{ciudad}': t?.ciudad || '',
    '{region}': t?.departamento || '',
    '{pais}': 'Colombia',
    '{sitio}': sitio,
    '{dominio}': sitio.replace(/^https?:\/\//, ''),
  }
}

export function sustituir(texto: string, valores: Record<string, string>) {
  let salida = texto
  for (const [marcador, valor] of Object.entries(valores)) {
    if (salida.includes(marcador)) salida = salida.split(marcador).join(valor)
  }
  return salida
}

/** Copia del texto enriquecido con los marcadores ya reemplazados (en textos y enlaces). */
export function conDatosDelNegocio<T>(nodo: T, valores: Record<string, string>): T {
  if (Array.isArray(nodo)) return nodo.map((n) => conDatosDelNegocio(n, valores)) as T
  if (!nodo || typeof nodo !== 'object') return nodo
  const copia: any = {}
  for (const [k, v] of Object.entries(nodo as any)) {
    if (k === 'text' && typeof v === 'string') copia[k] = sustituir(v, valores)
    else if (k === 'url' && typeof v === 'string') copia[k] = sustituir(v, valores)
    else copia[k] = conDatosDelNegocio(v, valores)
  }
  return copia
}
