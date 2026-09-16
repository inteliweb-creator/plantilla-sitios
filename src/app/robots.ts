import type { MetadataRoute } from 'next'

import { getServerSideURL } from '@/utilities/getURL'

/** Indica a Google qué rastrear: todo el sitio público, nunca el panel ni las rutas internas. */
export default function robots(): MetadataRoute.Robots {
  const base = getServerSideURL().replace(/\/$/, '')
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/api/', '/next/', '/account', '/checkout', '/login', '/create-account', '/forgot-password', '/reset-password', '/find-order', '/boletin/baja'],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  }
}
