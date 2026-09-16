import React from 'react'

import TarjetaRecurso from './TarjetaRecurso'

/** Sección "Recurso gratis" para cualquier página. */
export default function BloqueRecurso({ recurso, datos }: { recurso: any; datos?: any }) {
  if (!recurso) return null
  return (
    <section className="py-14 sm:py-20">
      <div className="max-w-5xl mx-auto px-5 sm:px-6 lg:px-8 pl-rail">
        <TarjetaRecurso recurso={recurso} titulo={datos?.titulo} texto={datos?.texto} />
      </div>
    </section>
  )
}
