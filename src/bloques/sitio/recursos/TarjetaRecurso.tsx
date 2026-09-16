import React from 'react'
import { Check } from 'lucide-react'

import { modulosActivos } from '@/modulos'
import { imagenDe } from '@/utilities/imagenDe'

import FormularioRecurso from './FormularioRecurso.jsx'

/**
 * Oferta de un recurso gratis en un recuadro oscuro: portada, título, qué se
 * lleva la persona y el formulario. Se usa al final de los artículos y como
 * sección en cualquier página.
 */
export default async function TarjetaRecurso({ recurso, titulo, texto, etiqueta = 'Gratis' }: { recurso: any; titulo?: string | null; texto?: string | null; etiqueta?: string }) {
  const m = await modulosActivos()
  if (!recurso || !m.recursos) return null
  const imagen = imagenDe(recurso.portada, 'mediana')
  const puntos: string[] = (recurso.beneficios || []).map((b: any) => b?.texto).filter(Boolean)

  return (
    <div className="tema-oscuro not-prose rounded-[var(--radius-panel)] bg-[#0E0F11] text-white overflow-hidden grid grid-cols-1 md:grid-cols-5" data-recurso={recurso.slug}>
      {imagen && (
        <div className="md:col-span-2 relative min-h-[200px] bg-white/5">
          <img src={imagen} alt={recurso.portada?.alt || ''} className="absolute inset-0 w-full h-full object-cover" />
        </div>
      )}
      <div className={`${imagen ? 'md:col-span-3' : 'md:col-span-5'} p-7 sm:p-10`}>
        <span className="inline-block text-[11px] font-semibold uppercase tracking-[0.14em] text-accent mb-4">{etiqueta}</span>
        <h2 className="text-2xl sm:text-3xl leading-tight text-white mb-3">{titulo || recurso.titulo}</h2>
        <p className="text-sm text-white/70 leading-relaxed mb-5">{texto || recurso.descripcion}</p>
        {puntos.length > 0 && (
          <ul className="space-y-2 mb-7">
            {puntos.map((p) => (
              <li key={p} className="flex items-start gap-2.5 text-sm text-white/85">
                <Check className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                {p}
              </li>
            ))}
          </ul>
        )}
        <FormularioRecurso recurso={recurso.slug} boton={recurso.textoBoton || 'Quiero recibirlo'} ofrecerBoletin={m.boletin} oscuro />
      </div>
    </div>
  )
}
