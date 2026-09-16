import { getCachedGlobal } from '@/utilities/getGlobals'
import { getServerSideURL } from '@/utilities/getURL'
import { imagenDe } from '@/utilities/imagenDe'

/**
 * Datos del negocio para Google en todas las páginas (schema.org): nombre,
 * logo, teléfono, dirección, horario, redes y zonas atendidas. Es lo que usa
 * Google para mostrar la ficha del negocio y unir el sitio con Maps.
 * Sale de "Datos del negocio"; los campos vacíos simplemente no se envían.
 */
const absoluta = (sitio: string, u?: string | null) => (!u ? undefined : /^https?:\/\//.test(u) ? u : `${sitio}${u}`)

function telefonoInternacional(t?: string | null) {
  const d = String(t || '').replace(/\D/g, '')
  if (!d) return undefined
  if (d.length === 10) return `+57${d}`
  return `+${d}`
}

const limpiar = (o: any): any => {
  if (Array.isArray(o)) {
    const a = o.map(limpiar).filter((x) => x !== undefined)
    return a.length ? a : undefined
  }
  if (o && typeof o === 'object') {
    const r: any = {}
    for (const [k, v] of Object.entries(o)) {
      const x = limpiar(v)
      if (x !== undefined && x !== '') r[k] = x
    }
    return Object.keys(r).length ? r : undefined
  }
  return o === null ? undefined : o
}

export function esquemaNegocio(n: any, sitio: string) {
  const tipo = n?.tipoNegocio || 'LocalBusiness'
  const esLocal = tipo !== 'Organization'
  const logo = absoluta(sitio, imagenDe(n?.logo) || undefined)
  const imagen = absoluta(sitio, imagenDe(n?.logo, 'redes') || undefined) || `${sitio}/og-sitio.jpg`
  const redes = [n?.instagram, n?.facebook, n?.tiktok, n?.linkedin, n?.youtube, n?.fichaGoogle].filter((x: any) => typeof x === 'string' && /^https?:\/\//.test(x))
  const telefono = telefonoInternacional(n?.telefono || n?.whatsapp)

  return limpiar({
    '@type': tipo,
    '@id': `${sitio}/#negocio`,
    name: n?.nombre,
    description: n?.eslogan,
    url: `${sitio}/`,
    logo: logo ? { '@type': 'ImageObject', url: logo } : undefined,
    image: imagen,
    telephone: telefono,
    email: n?.correo,
    sameAs: redes,
    address:
      n?.direccion || n?.ciudad
        ? {
            '@type': 'PostalAddress',
            streetAddress: esLocal ? n?.direccion : undefined,
            addressLocality: n?.ciudad,
            addressRegion: n?.departamento,
            postalCode: n?.codigoPostal,
            addressCountry: 'CO',
          }
        : undefined,
    ...(esLocal
      ? {
          geo:
            typeof n?.latitud === 'number' && typeof n?.longitud === 'number'
              ? { '@type': 'GeoCoordinates', latitude: n.latitud, longitude: n.longitud }
              : undefined,
          hasMap: n?.fichaGoogle,
          priceRange: n?.rangoPrecios,
          openingHoursSpecification: (n?.horarios || []).map((h: any) => ({
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: h.dias,
            opens: h.abre,
            closes: h.cierra,
          })),
        }
      : {}),
    areaServed: (n?.zonasAtendidas || []).map((name: string) => ({ '@type': 'City', name })),
    contactPoint: telefono
      ? { '@type': 'ContactPoint', telephone: telefono, contactType: 'customer service', availableLanguage: 'es' }
      : undefined,
  })
}

export async function DatosParaGoogle() {
  const n: any = await getCachedGlobal('tienda', 1)()
  if (!n?.nombre) return null
  const sitio = getServerSideURL().replace(/\/$/, '')
  const grafo = {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'WebSite', '@id': `${sitio}/#sitio`, url: `${sitio}/`, name: n.nombre, inLanguage: 'es-CO', publisher: { '@id': `${sitio}/#negocio` } },
      esquemaNegocio(n, sitio),
    ],
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(grafo).replace(/</g, '\\u003c') }} />
}
