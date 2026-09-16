import React from 'react'
import { RichText } from '@payloadcms/richtext-lexical/react'

import EncabezadoTienda from '@/bloques/sitio/tienda/EncabezadoTienda.jsx'
import { getCachedGlobal } from '@/utilities/getGlobals'
import { getServerSideURL } from '@/utilities/getURL'

import { expandirBloques } from './automaticos'

import { conDatosDelNegocio, sustituir, todosLosLegales, valoresNegocio } from './datos'

// Fecha en UTC: el día guardado es el que se publica, sin importar la zona del servidor.
const fecha = (iso: string) =>
  new Date(iso).toLocaleDateString('es-CO', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' })

/**
 * Página de un documento legal: composición sobria de una sola columna.
 * Aquí no hay nada que vender, solo texto que tiene que poder leerse y citarse.
 */
export default async function DocumentoLegal({ doc }: { doc: any }) {
  const [valores, otros, medicion, modulos, blog, ventanas, asistente] = await Promise.all([
    valoresNegocio(),
    todosLosLegales(),
    getCachedGlobal('medicion', 0)(),
    getCachedGlobal('modulos', 0)(),
    getCachedGlobal('blog', 0)(),
    getCachedGlobal('ventanas' as any, 0)(),
    getCachedGlobal('asistente' as any, 0)().catch(() => null),
  ])
  const titulo = sustituir(doc.titulo, valores)
  const sitio = getServerSideURL().replace(/\/$/, '')
  const actualizado = doc.fechaActualizacion || doc.updatedAt

  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'WebPage', url: `${sitio}/${doc.slug}`, name: titulo, dateModified: new Date(actualizado).toISOString() },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Inicio', item: sitio },
          { '@type': 'ListItem', position: 2, name: titulo, item: `${sitio}/${doc.slug}` },
        ],
      },
    ],
  }

  return (
    <article className="diseno-propio">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <EncabezadoTienda compacto ruta={[{ texto: doc.etiqueta || titulo }]} etiqueta="Legal" titulo={titulo} lead={`Última actualización: ${fecha(actualizado)}`} />

      <div className="pt-6 pb-14 sm:pt-10 sm:pb-20">
        <div className="max-w-3xl mx-auto px-5 sm:px-6 lg:px-8 prose-sitio">
          <RichText data={conDatosDelNegocio(expandirBloques(doc.contenido, { medicion: medicion as any, modulos: modulos as any, blog: blog as any, ventanas: ventanas as any, asistente: { activo: Boolean((asistente as any)?.activo) } }), valores)} disableContainer />
        </div>
      </div>

      {otros.length > 1 && (
        <nav className="pb-20" aria-label="Otros documentos legales">
          <div className="max-w-3xl mx-auto px-5 sm:px-6 lg:px-8 flex flex-wrap gap-3">
            {otros.map((o: any) => (
              <a
                key={o.slug}
                href={`/${o.slug}`}
                aria-current={o.slug === doc.slug ? 'page' : undefined}
                className={`rounded-full px-4 py-2 text-sm whitespace-nowrap border transition-colors ${
                  o.slug === doc.slug ? 'bg-graphite text-white border-graphite' : 'bg-white text-graphite border-line hover:border-graphite/40'
                }`}
              >
                {o.etiqueta || o.titulo}
              </a>
            ))}
          </div>
        </nav>
      )}
    </article>
  )
}
