import type { Metadata } from 'next'
import React from 'react'
import { ArrowUpRight } from 'lucide-react'

import EncabezadoTienda from '@/bloques/sitio/tienda/EncabezadoTienda.jsx'
import { recursosPublicados } from '@/bloques/sitio/recursos/datos'
import { imagenDe } from '@/utilities/imagenDe'

/** Lista de recursos gratis publicados. */
export default async function RecursosPage() {
  const lista = await recursosPublicados()
  return (
    <div className="diseno-propio">
      <EncabezadoTienda compacto ruta={[{ texto: 'Recursos' }]} etiqueta="Gratis" titulo="Recursos" enfasis="para llevarte" lead="Guías y plantillas que puedes descargar sin costo." />
      <section className="pb-24">
        <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12 pl-rail">
          {lista.length === 0 ? (
            <p className="text-slate">Muy pronto publicaremos el primero.</p>
          ) : (
            <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {lista.map((r) => {
                const imagen = imagenDe(r.portada, 'mediana')
                return (
                  <li key={r.id}>
                    <a href={`/recursos/${r.slug}`} className="group flex flex-col h-full rounded-[var(--radius-card)] border border-line bg-white overflow-hidden hover:border-accent/50 transition-colors">
                      <div className="relative aspect-[16/10] bg-surface-2">
                        {imagen && <img src={imagen} alt={r.portada?.alt || ''} className="absolute inset-0 w-full h-full object-cover" />}
                      </div>
                      <div className="p-6 flex flex-col gap-2 flex-1">
                        <h2 className="text-xl text-graphite leading-snug">{r.titulo}</h2>
                        <p className="text-sm text-slate leading-relaxed flex-1">{r.descripcion}</p>
                        <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-graphite mt-2">
                          Descargar gratis <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                        </span>
                      </div>
                    </a>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      </section>
    </div>
  )
}

export const metadata: Metadata = {
  title: 'Recursos gratis',
  description: 'Guías y plantillas gratis y prácticas para que más clientes encuentren tu negocio. Descárgalas sin costo y aplícalas hoy mismo.',
  alternates: { canonical: '/recursos' },
}
