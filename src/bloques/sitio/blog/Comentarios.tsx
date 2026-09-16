import configPromise from '@payload-config'
import { unstable_cache } from 'next/cache'
import { getPayload } from 'payload'
import React from 'react'

import FormularioComentario from './FormularioComentario.jsx'
import { fechaLarga } from './datos'

const comentariosDe = (articuloId: number | string) =>
  unstable_cache(
    async () => {
      const payload = await getPayload({ config: configPromise })
      const r = await payload.find({
        collection: 'comentarios',
        where: { and: [{ articulo: { equals: articuloId } }, { estado: { equals: 'aprobado' } }] },
        sort: 'createdAt',
        limit: 200,
        depth: 0,
        select: { nombre: true, texto: true, respuesta: true, createdAt: true },
      })
      return r.docs
    },
    ['comentarios', String(articuloId)],
    { tags: ['comentarios'] },
  )()

/** Comentarios aprobados del artículo y el formulario para dejar uno nuevo. */
export default async function Comentarios({ articulo, blog, negocio }: { articulo: any; blog: any; negocio: any }) {
  if (blog?.permitirComentarios === false) return null
  const lista: any[] = await comentariosDe(articulo.id)
  const cerrados = Boolean(articulo.comentariosCerrados)
  if (cerrados && !lista.length) return null

  return (
    <section id="comentarios" className="py-14 border-t border-line">
      <div className="max-w-2xl mx-auto px-5 sm:px-6 lg:px-8">
        <h2 className="text-2xl sm:text-3xl text-graphite mb-8">
          {blog?.tituloComentarios || 'Comentarios'}
          {lista.length > 0 && <span className="text-slate text-lg ml-2">({lista.length})</span>}
        </h2>

        {lista.length > 0 ? (
          <ol className="space-y-5 mb-12">
            {lista.map((c) => (
              <li key={c.id} className="rounded-[var(--radius-card)] border border-line bg-white p-5 sm:p-6">
                <p className="flex flex-wrap items-baseline gap-x-3 mb-2">
                  <strong className="text-graphite font-semibold">{c.nombre}</strong>
                  <time dateTime={c.createdAt} className="text-xs text-slate">
                    {fechaLarga(c.createdAt)}
                  </time>
                </p>
                <p className="text-sm text-ink-muted leading-relaxed whitespace-pre-line">{c.texto}</p>
                {c.respuesta && (
                  <div className="mt-4 ml-3 sm:ml-6 pl-4 border-l-2 border-accent/60">
                    <p className="text-xs font-semibold text-accent mb-1">Respuesta de {negocio?.nombre || 'nuestro equipo'}</p>
                    <p className="text-sm text-ink-muted leading-relaxed whitespace-pre-line">{c.respuesta}</p>
                  </div>
                )}
              </li>
            ))}
          </ol>
        ) : (
          <p className="text-sm text-slate mb-8">{blog?.invitacionComentarios || 'Sé la primera persona en comentar.'}</p>
        )}

        {cerrados ? (
          <p className="text-sm text-slate">Los comentarios de este artículo están cerrados.</p>
        ) : (
          <FormularioComentario articulo={articulo.slug} boton={blog?.botonComentario || 'Enviar comentario'} />
        )}
      </div>
    </section>
  )
}
