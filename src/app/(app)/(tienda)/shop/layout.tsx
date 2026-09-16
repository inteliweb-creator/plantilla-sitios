import { Categories } from '@/components/layout/search/Categories'
import { FilterList } from '@/components/layout/search/filter'
import { sorting } from '@/lib/constants'
import { Search } from '@/components/Search'
import EncabezadoTienda from '@/bloques/sitio/tienda/EncabezadoTienda.jsx'
import { getCachedGlobal } from '@/utilities/getGlobals'
import React, { Suspense } from 'react'

export default async function ShopLayout({ children }: { children: React.ReactNode }) {
  const t: any = await getCachedGlobal('tiendaTextos', 0)()
  return (
    <div className="diseno-propio">
      <EncabezadoTienda
        ruta={[{ texto: t?.eyebrow || 'Tienda' }]}
        etiqueta={t?.eyebrow}
        titulo={t?.catalogoTitulo}
        enfasis={t?.catalogoEnfasis}
        lead={t?.lead}
      />
      <Suspense fallback={null}>
        <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12 pl-rail pb-24">
          <Search className="mb-10" placeholder={t?.buscador} />
          <div className="flex flex-col lg:flex-row items-start gap-10 lg:gap-12">
            <aside className="w-full lg:w-60 flex-none flex flex-col gap-8 lg:sticky lg:top-28">
              <Categories />
              <FilterList list={sorting} title="Ordenar por" />
            </aside>
            <div className="w-full min-h-[40vh]">{children}</div>
          </div>
        </div>
      </Suspense>
    </div>
  )
}
