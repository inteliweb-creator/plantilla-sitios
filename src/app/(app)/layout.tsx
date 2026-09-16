import type { ReactNode } from 'react'

import { AdminBar } from '@/components/AdminBar'
import { BotonWhatsapp } from '@/components/BotonWhatsapp'
import { Medicion } from '@/components/Medicion'
import { DatosParaGoogle } from '@/components/DatosParaGoogle'
import { Ventanas } from '@/components/Ventanas'
import { MarcoPie, MarcoSuperior } from '@/bloques/sitio/marco'
import { SmoothScroll } from '@/bloques/sitio/lib/parallax-scrolling'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import { getCachedGlobal } from '@/utilities/getGlobals'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import type { Metadata } from 'next'
import { Providers } from '@/providers'
import { modulosActivos } from '@/modulos'
import { InitTheme } from '@/providers/Theme/InitTheme'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import React from 'react'
import './globals.css'

/**
 * Datos generales para Google y redes: nombre del sitio, favicon e imagen al
 * compartir. Salen de "Datos del negocio"; si falta algo, se usan valores neutros.
 */
export async function generateMetadata(): Promise<Metadata> {
  const negocio: any = await getCachedGlobal('tienda', 1)()
  const nombre = negocio?.nombre || 'Mi negocio'
  const favicon = negocio?.favicon?.url
  const base = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'
  return {
    metadataBase: new URL(base),
    title: { default: nombre, template: `%s · ${nombre}` },
    description: negocio?.eslogan || undefined,
    icons: favicon
      ? { icon: [{ url: favicon }], apple: [{ url: favicon }] }
      : {
          icon: [
            { url: '/favicon.ico', sizes: '48x48' },
            { url: '/favicon.png', type: 'image/png', sizes: '512x512' },
          ],
          apple: [{ url: '/apple-touch-icon.png', sizes: '180x180' }],
        },
    openGraph: mergeOpenGraph({ siteName: nombre, title: nombre, description: negocio?.eslogan || undefined }),
  }
}

export default async function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      className={[GeistSans.variable, GeistMono.variable].filter(Boolean).join(' ')}
      lang="es"
      suppressHydrationWarning
    >
      <head>
        <InitTheme />
        {/* Tipografías del tema */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@1&family=JetBrains+Mono:wght@400;500&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body data-tema="zen">
        <DatosParaGoogle />
        <Providers tienda={(await modulosActivos()).tienda}>
          <AdminBar />
          <LivePreviewListener />
          <SmoothScroll />

          <MarcoSuperior />
          <main>{children}</main>
          <MarcoPie />
          <BotonWhatsapp />
          <Medicion />
          <Ventanas />
        </Providers>
      </body>
    </html>
  )
}
