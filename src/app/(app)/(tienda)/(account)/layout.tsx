import type { ReactNode } from 'react'
import EncabezadoTienda from '@/bloques/sitio/tienda/EncabezadoTienda.jsx'

import { headers as getHeaders } from 'next/headers.js'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { RenderParams } from '@/components/RenderParams'
import { AccountNav } from '@/components/AccountNav'

export default async function RootLayout({ children }: { children: ReactNode }) {
  const headers = await getHeaders()
  const payload = await getPayload({ config: configPromise })
  const { user } = await payload.auth({ headers })

  return (
    <div className="diseno-propio">
      <EncabezadoTienda compacto ruta={[{ texto: 'Mi cuenta' }]} etiqueta="Tu cuenta" titulo="Hola," enfasis={user?.name || user?.email || 'bienvenido'} />
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12 pl-rail pb-24">
        <RenderParams className="mb-6" />
        <div className="flex flex-col md:flex-row gap-8">
          {user && <AccountNav className="md:w-56 flex-none flex-row md:flex-col items-start gap-2 flex flex-wrap" />}
          <div className="flex flex-col gap-8 grow min-w-0">{children}</div>
        </div>
      </div>
    </div>
  )
}
