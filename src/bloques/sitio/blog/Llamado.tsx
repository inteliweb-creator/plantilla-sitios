import React from 'react'
import { ArrowUpRight } from 'lucide-react'

import TarjetaRecurso from '@/bloques/sitio/recursos/TarjetaRecurso'
import { recursoPorId } from '@/bloques/sitio/recursos/datos'

import { enlaceWhatsapp } from '../lib/negocio.js'

/** Lo que el artículo le propone al lector al terminar: un recurso gratis, WhatsApp o una página. */
export default async function Llamado({ llamado, negocio }: { llamado: any; negocio: any }) {
  const tipo = llamado?.tipo
  if (!tipo || tipo === 'ninguno') return null

  let contenido: React.ReactNode = null
  if (tipo === 'recurso') {
    const id = typeof llamado.recurso === 'object' ? llamado.recurso?.id : llamado.recurso
    const recurso = id ? await recursoPorId(id) : null
    if (!recurso) return null
    contenido = <TarjetaRecurso recurso={recurso} titulo={llamado.titulo} texto={llamado.texto} />
  } else {
    const href = tipo === 'whatsapp' ? enlaceWhatsapp(negocio, llamado.mensajeWhatsapp) : llamado.enlace
    if (!href || !llamado.titulo) return null
    const externo = /^https?:\/\//.test(href)
    contenido = (
      <div className="rounded-[var(--radius-panel)] bg-surface grain p-8 sm:p-12 flex flex-col md:flex-row md:items-center justify-between gap-6" data-llamado={tipo}>
        <div className="max-w-xl">
          <h2 className="text-2xl sm:text-3xl text-graphite leading-tight mb-2">{llamado.titulo}</h2>
          {llamado.texto && <p className="text-sm sm:text-base text-slate leading-relaxed">{llamado.texto}</p>}
        </div>
        <a href={href} className="pill-negra text-sm shrink-0" {...(externo ? { target: '_blank', rel: 'noreferrer' } : {})}>
          <span>{llamado.textoBoton || (tipo === 'whatsapp' ? 'Escríbenos por WhatsApp' : 'Ver más')}</span>
          <span className="disco" aria-hidden="true">
            <ArrowUpRight className="w-4 h-4" />
          </span>
        </a>
      </div>
    )
  }

  return (
    <section className="pb-14">
      <div className="max-w-4xl mx-auto px-5 sm:px-6 lg:px-8 pl-rail">{contenido}</div>
    </section>
  )
}
