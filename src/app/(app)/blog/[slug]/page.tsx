import { imagenDe } from '@/utilities/imagenDe'
import type { Metadata } from 'next'
import { draftMode } from 'next/headers'
import { notFound } from 'next/navigation'
import React from 'react'
import { ArrowUpRight } from 'lucide-react'

import ContenidoArticulo from '@/bloques/sitio/blog/ContenidoArticulo'
import Compartir from '@/bloques/sitio/blog/Compartir.jsx'
import Comentarios from '@/bloques/sitio/blog/Comentarios'
import Llamado from '@/bloques/sitio/blog/Llamado'
import { CierreBlog, RecuadroBoletin } from '@/bloques/sitio/blog/Piezas.jsx'
import { anclaDe, articuloPorSlug, articulosPublicados, fechaLarga, textoDe } from '@/bloques/sitio/blog/datos'
import { getCachedGlobal } from '@/utilities/getGlobals'

type Args = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  const lista = await articulosPublicados()
  return lista.map((a: any) => ({ slug: a.slug }))
}

const MALLAS = ['mesh-sky', 'mesh-mist', 'mesh-periwinkle', 'mesh-dusk', 'mesh-ivory']
const url = (ruta: string) => `${(process.env.NEXT_PUBLIC_SERVER_URL || '').replace(/\/$/, '')}${ruta}`

export default async function ArticuloPage({ params }: Args) {
  const { slug } = await params
  const { isEnabled: borrador } = await draftMode()
  const articulo = await articuloPorSlug(slug, borrador)
  if (!articulo) return notFound()

  const [blog, negocio, todos]: any[] = await Promise.all([
    getCachedGlobal('blog', 0)(),
    getCachedGlobal('tienda', 1)(),
    articulosPublicados(),
  ])

  const temas: string[] = articulo.etiquetas || []
  const autor = articulo.autor || negocio?.nombre
  const portada = typeof articulo.portada === 'object' ? articulo.portada : null
  const indice = (articulo.contenido?.root?.children || [])
    .filter((n: any) => n.type === 'heading' && n.tag === 'h2')
    .map((n: any) => ({ texto: textoDe(n), ancla: anclaDe(textoDe(n)) }))
  const otros = todos.filter((a: any) => a.slug !== slug).slice(0, 2)

  const datosEstructurados = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BlogPosting',
        headline: articulo.title,
        description: articulo.descripcion,
        url: url(`/blog/${slug}`),
        inLanguage: 'es-CO',
        datePublished: articulo.fechaPublicacion,
        dateModified: articulo.fechaActualizacion || articulo.fechaPublicacion,
        author: { '@type': 'Organization', name: autor },
        publisher: { '@id': url('/#negocio') },
        ...(portada?.url ? { image: url(imagenDe(portada, 'redes') || portada.url) } : {}),
        keywords: temas.join(', '),
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Inicio', item: url('/') },
          { '@type': 'ListItem', position: 2, name: 'Blog', item: url('/blog') },
          { '@type': 'ListItem', position: 3, name: articulo.title, item: url(`/blog/${slug}`) },
        ],
      },
    ],
  }

  return (
    <div className="diseno-propio">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(datosEstructurados).replace(/</g, '\\u003c') }} />

      <section className="relative overflow-hidden pt-28 sm:pt-36 pb-10 sm:pb-14" style={{ background: 'linear-gradient(180deg, #E6E7EA 0%, #EEEFF1 55%, #FFFFFF 100%)' }}>
        <div className="relative z-10 mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12 pl-rail">
          <nav aria-label="Ruta de navegación" className="mb-8">
            <ol className="flex flex-wrap items-center gap-2 text-[12px] text-slate">
              <li><a href="/" className="hover:text-graphite transition-colors">Inicio</a></li>
              <li aria-hidden="true" className="w-px h-3 bg-graphite/30" />
              <li><a href="/blog" className="hover:text-graphite transition-colors">Blog</a></li>
            </ol>
          </nav>
          <div className="max-w-3xl">
            {temas.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 mb-6">
                {temas.map((t) => <span key={t} className="etiqueta-zen">{t}</span>)}
              </div>
            )}
            <h1 className="text-[2.4rem] sm:text-5xl lg:text-[3.8rem] text-graphite leading-[1] mb-8">{articulo.title}</h1>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-slate pt-6 border-t border-graphite/10">
              {autor && <span>Por <strong className="font-semibold text-graphite">{autor}</strong></span>}
              {articulo.fechaPublicacion && (
                <>
                  <span aria-hidden="true">·</span>
                  <time dateTime={articulo.fechaPublicacion}>{fechaLarga(articulo.fechaPublicacion)}</time>
                </>
              )}
              {articulo.fechaActualizacion && articulo.fechaActualizacion.slice(0, 10) !== articulo.fechaPublicacion?.slice(0, 10) && (
                <>
                  <span aria-hidden="true">·</span>
                  <span>Actualizado el {fechaLarga(articulo.fechaActualizacion)}</span>
                </>
              )}
              {articulo.minutosLectura ? (
                <>
                  <span aria-hidden="true">·</span>
                  <span>{articulo.minutosLectura} min de lectura</span>
                </>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12 pl-rail">
        <div className="relative overflow-hidden rounded-[var(--radius-card)] grain w-full aspect-[16/9] sm:aspect-[21/9]">
          {portada?.url ? (
            <img src={imagenDe(portada, 'grande') || portada.url} alt={portada.alt || ''} className="absolute inset-0 w-full h-full object-cover" />
          ) : (
            <div className={`mesh ${MALLAS[articulo.title.length % MALLAS.length]}`} />
          )}
        </div>
      </div>

      <section className="py-16 sm:py-24">
        <div className="max-w-6xl mx-auto px-5 sm:px-6 lg:px-8 pl-rail">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
            {indice.length > 1 && (
              <aside className="lg:col-span-3 order-2 lg:order-1">
                <nav className="lg:sticky lg:top-24" aria-label={blog?.textoIndice || 'En este artículo'}>
                  <p className="eyebrow text-slate/70 mb-4">{blog?.textoIndice || 'En este artículo'}</p>
                  <ul className="space-y-2.5 border-l border-line pl-4">
                    {indice.map((h: any) => (
                      <li key={h.ancla}>
                        <a href={`#${h.ancla}`} className="block text-sm text-slate hover:text-accent transition-colors leading-snug">{h.texto}</a>
                      </li>
                    ))}
                  </ul>
                </nav>
              </aside>
            )}
            <article className={`${indice.length > 1 ? 'lg:col-span-9 lg:order-2' : 'lg:col-span-12 mx-auto'} order-1 prose-sitio max-w-2xl`}>
              <ContenidoArticulo data={articulo.contenido} />
              {blog?.mostrarCompartir !== false && <Compartir url={url(`/blog/${slug}`)} titulo={articulo.title} texto={blog?.textoCompartir} />}
            </article>
          </div>
        </div>
      </section>

      <Llamado llamado={articulo.llamado} negocio={negocio} />

      <Comentarios articulo={articulo} blog={blog} negocio={negocio} />

      <RecuadroBoletin blog={blog} variante="franja" />

      {otros.length > 0 && (
        <section className="py-16 border-t border-line">
          <div className="max-w-6xl mx-auto px-5 sm:px-6 lg:px-8 pl-rail">
            <h2 className="text-2xl sm:text-3xl text-graphite mb-8">{blog?.textoSigueLeyendo || 'Sigue leyendo'}</h2>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {otros.map((o: any) => (
                <li key={o.id}>
                  <a href={`/blog/${o.slug}`} className="group flex items-start justify-between gap-4 rounded-[var(--radius-card)] border border-line bg-surface p-6 transition-colors hover:border-accent/50 h-full">
                    <span>
                      <span className="block font-display text-xl text-graphite mb-1.5 leading-snug">{o.title}</span>
                      <span className="block text-sm text-slate leading-relaxed">{o.descripcion}</span>
                    </span>
                    <span className="w-8 h-8 rounded-full bg-surface-2 flex items-center justify-center shrink-0 transition-colors group-hover:bg-graphite">
                      <ArrowUpRight className="w-4 h-4 text-graphite group-hover:text-white" />
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <CierreBlog blog={blog} negocio={negocio} />
    </div>
  )
}

export async function generateMetadata({ params }: Args): Promise<Metadata> {
  const { slug } = await params
  const a = await articuloPorSlug(slug)
  if (!a) return {}
  const imagen = imagenDe(a.imagenRedes, 'redes') || imagenDe(a.portada, 'redes')
  const titulo = a.tituloSeo || a.title
  return {
    title: titulo,
    description: a.descripcion,
    alternates: { canonical: `/blog/${slug}` },
    openGraph: {
      title: titulo,
      description: a.descripcion,
      type: 'article',
      url: `/blog/${slug}`,
      publishedTime: a.fechaPublicacion,
      images: [{ url: imagen ? url(imagen) : '/og-sitio.jpg' }],
    },
  }
}
