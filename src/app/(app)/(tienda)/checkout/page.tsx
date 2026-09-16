import type { Metadata } from 'next'

import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import React from 'react'
import { getCachedGlobal } from '@/utilities/getGlobals'
import EncabezadoTienda from '@/bloques/sitio/tienda/EncabezadoTienda.jsx'

import { CheckoutPage } from '@/components/checkout/CheckoutPage'

export default async function Checkout() {
  const t: any = await getCachedGlobal('tiendaTextos', 0)()
  return (
    <div className="diseno-propio">
      <EncabezadoTienda compacto ruta={[{ texto: 'Tienda', href: '/shop' }, { texto: 'Finalizar compra' }]} etiqueta="Pago seguro" titulo={t?.pagoTitulo || 'Finaliza tu'} enfasis={t?.pagoEnfasis || 'compra'} lead={t?.pagoLead} />
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12 pl-rail pb-24">
        {!process.env.NEXT_PUBLIC_WOMPI_PUBLIC_KEY && (
          <div className="mb-6 rounded-2xl border border-amber-300 bg-amber-50 px-5 py-4 text-sm text-amber-900">
            Los pagos todavía no están activos: falta configurar las llaves de Wompi.
          </div>
        )}
        <CheckoutPage />
      </div>
    </div>
  )
}

export const metadata: Metadata = {
  description: 'Finalizar compra.',
  openGraph: mergeOpenGraph({
    title: 'Finalizar compra',
    url: '/checkout',
  }),
  title: 'Finalizar compra',
}
