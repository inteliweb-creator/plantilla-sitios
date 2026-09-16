import type { Metadata } from 'next'

import { RenderParams } from '@/components/RenderParams'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import React from 'react'
import EncabezadoTienda from '@/bloques/sitio/tienda/EncabezadoTienda.jsx'
import { headers as getHeaders } from 'next/headers'
import configPromise from '@payload-config'
import { getPayload } from 'payload'

import { CreateAccountForm } from '@/components/forms/CreateAccountForm'
import { redirect } from 'next/navigation'

export default async function CreateAccount() {
  const headers = await getHeaders()
  const payload = await getPayload({ config: configPromise })
  const { user } = await payload.auth({ headers })

  if (user) {
    redirect(`/account?warning=${encodeURIComponent('Ya iniciaste sesión.')}`)
  }

  return (
    <div className="diseno-propio">
      <EncabezadoTienda compacto ruta={[{ texto: 'Crear cuenta' }]} etiqueta="Tu cuenta" titulo="Crea tu" enfasis="cuenta" lead="Compra más rápido, guarda tus direcciones y sigue tus pedidos." />
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12 pl-rail pb-24">
        <div className="max-w-xl rounded-[30px] bg-white border border-line p-6 sm:p-9 shadow-[var(--shadow-lift)]">
          <RenderParams />
          <CreateAccountForm />
        </div>
      </div>
    </div>
  )
}

export const metadata: Metadata = {
  description: 'Crea una cuenta o inicia sesión en la que ya tienes.',
  openGraph: mergeOpenGraph({
    title: 'Crear cuenta',
    url: '/create-account',
  }),
  title: 'Crear cuenta',
}
