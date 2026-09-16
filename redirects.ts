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

  // Direcciones del sitio anterior del cliente que ya no existen: llévalas a su
  // equivalente con redirección permanente para no perder visitas ni lo ganado en Google.
  // Ej: { source: '/servicios.html', destination: '/diseno-web', permanent: true },
  const sitioAnterior = [
    { source: '/index.html', destination: '/', permanent: true },
    { source: '/index.php', destination: '/', permanent: true },
    { source: '/sitemap-index.xml', destination: '/sitemap.xml', permanent: true },
    { source: '/sitemap_index.xml', destination: '/sitemap.xml', permanent: true },
  ]

  return [internetExplorerRedirect, ...sitioAnterior]
}
