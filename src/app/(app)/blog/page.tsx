import type { Metadata } from 'next'
import React from 'react'

import Encabezado from '@/bloques/sitio/componentes/Encabezado.jsx'
import TarjetaArticulo from '@/bloques/sitio/blog/TarjetaArticulo.jsx'
import { CierreBlog, RecuadroBoletin } from '@/bloques/sitio/blog/Piezas.jsx'
import { articulosPublicados } from '@/bloques/sitio/blog/datos'
import { getCachedGlobal } from '@/utilities/getGlobals'

export default async function BlogPage() {
  const [articulos, blog, negocio]: any[] = await Promise.all([
    articulosPublicados(),
    getCachedGlobal('blog', 0)(),
    getCachedGlobal('tienda', 1)(),
  ])

  return (
    <div className="diseno-propio">
      <Encabezado
        datos={{
          eyebrow: blog?.eyebrow,
          titulo: blog?.titulo,
          enfasis: blog?.enfasis,
          lead: blog?.lead,
          destacado: blog?.cita,
          destacadoMeta: blog?.meta ? `${articulos.length} ${blog.meta}` : undefined,
        }}
      />

      <section className="py-16 sm:py-24">
        <div className="max-w-6xl mx-auto px-5 sm:px-6 lg:px-8 pl-rail">
          {articulos.length ? (
            <ul className="space-y-8 sm:space-y-12">
              {articulos.map((a: any, i: number) => (
                <li key={a.id}>
                  <TarjetaArticulo articulo={a} indice={i} negocio={negocio} />
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-slate text-lg">{blog?.sinArticulos}</p>
          )}
        </div>
      </section>

      <RecuadroBoletin blog={blog} />
      <CierreBlog blog={blog} negocio={negocio} />
    </div>
  )
}

export async function generateMetadata(): Promise<Metadata> {
  const [blog, negocio]: any[] = await Promise.all([getCachedGlobal('blog', 0)(), getCachedGlobal('tienda', 0)()])
  const titulo = blog?.seo?.titulo || `Blog${negocio?.nombre ? ` — ${negocio.nombre}` : ''}`
  return {
    title: blog?.seo?.titulo ? { absolute: titulo } : titulo,
    description: blog?.seo?.descripcion || blog?.lead,
    alternates: { canonical: '/blog' },
    openGraph: { title: titulo, description: blog?.seo?.descripcion || blog?.lead, url: '/blog', type: 'website', images: [{ url: '/og-sitio.jpg' }] },
  }
}
