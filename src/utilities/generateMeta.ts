import type { Metadata } from 'next'

import type { Page, Product } from '../payload-types'

import { imagenDe } from './imagenDe'
import { mergeOpenGraph } from './mergeOpenGraph'

export const generateMeta = async (args: { doc: Page | Product }): Promise<Metadata> => {
  const { doc } = args || {}

  const ogImage = imagenDe(doc?.meta?.image, 'redes')

  const ruta = Array.isArray(doc?.slug) ? doc?.slug.join('/') : doc?.slug
  const camino = !ruta || ruta === 'home' ? '/' : `/${ruta}`

  return {
    alternates: { canonical: camino },
    description: doc?.meta?.description,
    openGraph: mergeOpenGraph({
      ...(doc?.meta?.description
        ? {
            description: doc?.meta?.description,
          }
        : {}),
      images: ogImage
        ? [
            {
              url: ogImage,
            },
          ]
        : undefined,
      title: doc?.meta?.title || doc?.title || undefined,
      url: Array.isArray(doc?.slug) ? doc?.slug.join('/') : '/',
    }),
    // El título de SEO se escribe completo en el panel; el de la página lleva "· Negocio" detrás.
    title: doc?.meta?.title ? { absolute: doc.meta.title } : doc?.title || undefined,
  }
}
