import type { Metadata } from 'next'

/** Valores por defecto al compartir en redes. El sitio los completa con los datos del negocio. */
const defaultOpenGraph: Metadata['openGraph'] = {
  type: 'website',
  locale: 'es_CO',
  images: [{ url: '/og-sitio.jpg', width: 1200, height: 630 }],
}

export const mergeOpenGraph = (og?: Partial<Metadata['openGraph']>): Metadata['openGraph'] => {
  return {
    ...defaultOpenGraph,
    ...og,
    images: og?.images ? og.images : defaultOpenGraph.images,
  }
}
