import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import React, { Suspense } from 'react'
import { Check } from 'lucide-react'

import EncabezadoTienda from '@/bloques/sitio/tienda/EncabezadoTienda.jsx'
import AvisoVencido from '@/bloques/sitio/recursos/AvisoVencido.jsx'
import FormularioRecurso from '@/bloques/sitio/recursos/FormularioRecurso.jsx'
import { recursoPorSlug, recursosPublicados } from '@/bloques/sitio/recursos/datos'
import { modulosActivos } from '@/modulos'
import { imagenDe } from '@/utilities/imagenDe'

type Args = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  return (await recursosPublicados()).map((r) => ({ slug: r.slug }))
}

/** Página de un recurso gratis: qué es, qué se lleva la persona y el formulario para pedirlo. */
export default async function RecursoPage({ params }: Args) {
  const { slug } = await params
  const recurso = await recursoPorSlug(slug)
  if (!recurso) return notFound()
  const m = await modulosActivos()
  const imagen = imagenDe(recurso.portada, 'grande')
  const puntos: string[] = (recurso.beneficios || []).map((b: any) => b?.texto).filter(Boolean)

  return (
    <div className="diseno-propio">
      <EncabezadoTienda compacto ruta={[{ texto: 'Recursos', href: '/recursos' }, { texto: recurso.titulo }]} etiqueta="Recurso gratis" titulo={recurso.titulo} lead={recurso.descripcion} />
      <section className="pb-24">
        <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12 pl-rail grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
          <div>
            {imagen && (
              <div className="relative overflow-hidden rounded-[var(--radius-card)] aspect-[4/3] mb-8 bg-surface-2">
                <img src={imagen} alt={recurso.portada?.alt || ''} className="absolute inset-0 w-full h-full object-cover" />
              </div>
            )}
            {puntos.length > 0 && (
              <>
                <h2 className="text-xl text-graphite mb-4">Qué vas a encontrar</h2>
                <ul className="space-y-3">
                  {puntos.map((p) => (
                    <li key={p} className="flex items-start gap-3 text-base text-ink-muted">
                      <Check className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                      {p}
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
          <div className="lg:sticky lg:top-28 rounded-[30px] bg-white border border-line p-6 sm:p-9 shadow-[var(--shadow-lift)]">
            <Suspense>
              <AvisoVencido />
            </Suspense>
            <h2 className="text-2xl text-graphite mb-2">Recíbelo gratis</h2>
            <p className="text-sm text-slate mb-6">Te lo enviamos a tu correo en un momento.</p>
            <FormularioRecurso recurso={recurso.slug} boton={recurso.textoBoton || 'Quiero recibirlo'} ofrecerBoletin={m.boletin} />
          </div>
        </div>
      </section>
    </div>
  )
}

export async function generateMetadata({ params }: Args): Promise<Metadata> {
  const { slug } = await params
  const r = await recursoPorSlug(slug)
  if (!r) return {}
  const imagen = imagenDe(r.portada, 'redes')
  return {
    title: r.titulo,
    description: r.descripcion,
    alternates: { canonical: `/recursos/${slug}` },
    openGraph: { title: r.titulo, description: r.descripcion, url: `/recursos/${slug}`, ...(imagen ? { images: [{ url: imagen }] } : {}) },
  }
}
