import type { Metadata } from 'next'

import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import React from 'react'
import EncabezadoTienda from '@/bloques/sitio/tienda/EncabezadoTienda.jsx'

import { ForgotPasswordForm } from '@/components/forms/ForgotPasswordForm'

export default async function ForgotPasswordPage() {
  return (
    <div className="diseno-propio">
      <EncabezadoTienda compacto ruta={[{ texto: 'Recuperar contraseña' }]} etiqueta="Tu cuenta" titulo="Recupera tu" enfasis="contraseña" lead="Te enviamos un enlace a tu correo para crear una nueva." />
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12 pl-rail pb-24">
        <div className="max-w-xl rounded-[30px] bg-white border border-line p-6 sm:p-9 shadow-[var(--shadow-lift)]">
      <ForgotPasswordForm />
        </div>
      </div>
    </div>
  )
}

export const metadata: Metadata = {
  description: 'Escribe tu correo para recuperar tu contraseña.',
  openGraph: mergeOpenGraph({
    title: 'Recuperar contraseña',
    url: '/forgot-password',
  }),
  title: 'Recuperar contraseña',
}
