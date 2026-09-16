import type { NextConfig } from 'next'

export const redirects: NextConfig['redirects'] = async () => {
  const internetExplorerRedirect = {
    destination: '/ie-incompatible.html',
    has: [
      {
        type: 'header' as const,
        key: 'user-agent',
        value: '(.*Trident.*)', // all ie browsers
      },
    ],
    permanent: false,
    source: '/:path((?!ie-incompatible.html$).*)', // all pages except the incompatibility page
  }

  // Direcciones del sitio anterior (Astro) que ya no existen: se llevan a su
  // equivalente para no perder visitas ni lo ganado en Google.
  const sitioAnterior = [
    { source: '/index.html', destination: '/', permanent: true },
    { source: '/oferta', destination: '/', permanent: true },
    { source: '/sitemap-index.xml', destination: '/sitemap.xml', permanent: true },
    { source: '/sitemap-0.xml', destination: '/sitemap.xml', permanent: true },
    { source: '/0716253443/:ruta*', destination: '/admin', permanent: true },
    // Los productos gratuitos del sitio anterior ahora son recursos.
    { source: '/productos', destination: '/recursos', permanent: true },
    { source: '/productos/:ruta*', destination: '/recursos', permanent: true },
    { source: '/pago/:ruta*', destination: '/', permanent: false },
  ]

  return [internetExplorerRedirect, ...sitioAnterior]
}
