import type { Metadata } from 'next'

import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import React from 'react'
import EncabezadoTienda from '@/bloques/sitio/tienda/EncabezadoTienda.jsx'
import { FindOrderForm } from '@/components/forms/FindOrderForm'
import { getPayload } from 'payload'
import { headers as getHeaders } from 'next/headers.js'
import configPromise from '@payload-config'

export default async function FindOrderPage() {
  const headers = await getHeaders()
  const payload = await getPayload({ config: configPromise })
  const { user } = await payload.auth({ headers })

  return (
    <div className="diseno-propio">
      <EncabezadoTienda compacto ruta={[{ texto: 'Buscar pedido' }]} etiqueta="Pedidos" titulo="Busca tu" enfasis="pedido" lead="Escribe tu correo y el número de pedido y te enviamos un enlace para verlo." />
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12 pl-rail pb-24">
        <div className="max-w-xl rounded-[30px] bg-white border border-line p-6 sm:p-9 shadow-[var(--shadow-lift)]">
      <FindOrderForm initialEmail={user?.email} />
        </div>
      </div>
    </div>
  )
}

export const metadata: Metadata = {
  description: 'Encuentra tu pedido con tu correo y el número de pedido.',
  openGraph: mergeOpenGraph({
    title: 'Buscar pedido',
    url: '/find-order',
  }),
  title: 'Buscar pedido',
}
