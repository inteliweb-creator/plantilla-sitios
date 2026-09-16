import type { Metadata } from 'next'

import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import React, { Fragment } from 'react'
import EncabezadoTienda from '@/bloques/sitio/tienda/EncabezadoTienda.jsx'
import { ConfirmOrder } from '@/components/checkout/ConfirmOrder'

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>

export default async function ConfirmOrderPage({
  searchParams: searchParamsPromise,
}: {
  searchParams: SearchParams
}) {
  const searchParams = await searchParamsPromise

  const paymentIntent = searchParams.paymentId

  return (
    <div className="diseno-propio">
      <EncabezadoTienda compacto ruta={[{ texto: 'Tienda', href: '/shop' }, { texto: 'Confirmación' }]} etiqueta="Tu pedido" titulo="Confirmando" enfasis="tu pago" />
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12 pl-rail pb-24">
        <div className="max-w-2xl rounded-[30px] bg-white border border-line p-8 sm:p-12 shadow-[var(--shadow-lift)] flex">
          <ConfirmOrder />
        </div>
      </div>
    </div>
  )
}

export const metadata: Metadata = {
  description: 'Confirmar pedido.',
  openGraph: mergeOpenGraph({
    title: 'Confirmando pedido',
    url: '/checkout/confirm-order',
  }),
  title: 'Confirmando pedido',
}
