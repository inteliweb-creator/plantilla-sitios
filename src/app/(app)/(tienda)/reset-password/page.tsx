import type { Metadata } from 'next'
import React, { Suspense } from 'react'

import EncabezadoTienda from '@/bloques/sitio/tienda/EncabezadoTienda.jsx'
import { ResetPasswordForm } from '@/components/forms/ResetPasswordForm'

export default function ResetPasswordPage() {
  return (
    <div className="diseno-propio">
      <EncabezadoTienda compacto ruta={[{ texto: 'Nueva contraseña' }]} etiqueta="Tu cuenta" titulo="Crea tu nueva" enfasis="contraseña" lead="Usa al menos 12 caracteres." />
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12 pl-rail pb-24">
        <div className="max-w-xl rounded-[30px] bg-white border border-line p-6 sm:p-9 shadow-[var(--shadow-lift)]">
          <Suspense>
            <ResetPasswordForm />
          </Suspense>
        </div>
      </div>
    </div>
  )
}

export const metadata: Metadata = {
  title: 'Nueva contraseña',
  robots: { index: false },
}
