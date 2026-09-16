import type { Metadata } from 'next'

import { RenderParams } from '@/components/RenderParams'
import EncabezadoTienda from '@/bloques/sitio/tienda/EncabezadoTienda.jsx'
import React from 'react'

import { headers as getHeaders } from 'next/headers'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { LoginForm } from '@/components/forms/LoginForm'
import { redirect } from 'next/navigation'

export default async function Login() {
  const headers = await getHeaders()
  const payload = await getPayload({ config: configPromise })
  const { user } = await payload.auth({ headers })

  if (user) {
    redirect(`/account?warning=${encodeURIComponent('Ya iniciaste sesión.')}`)
  }

  return (
    <div className="diseno-propio">
      <EncabezadoTienda compacto ruta={[{ texto: 'Iniciar sesión' }]} etiqueta="Tu cuenta" titulo="Entra a" enfasis="tu cuenta" lead="Aquí ves tus pedidos y guardas tus direcciones para comprar más rápido." />
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12 pl-rail pb-24">
        <div className="max-w-xl rounded-[30px] bg-white border border-line p-6 sm:p-9 shadow-[var(--shadow-lift)]">
          <RenderParams />
          <LoginForm />
        </div>
      </div>
    </div>
  )
}

export const metadata: Metadata = {
  description: 'Inicia sesión o crea una cuenta.',
  openGraph: {
    title: 'Iniciar sesión',
    url: '/login',
  },
  title: 'Iniciar sesión',
}
