import { AuthProvider } from '@/providers/Auth'
import { EcommerceProvider } from '@payloadcms/plugin-ecommerce/client/react'
import { wompiAdapterClient } from '@/pagos/wompi/cliente'
import { COP } from '@/pagos/monedas'
import React from 'react'

import { HeaderThemeProvider } from './HeaderTheme'
import { ThemeProvider } from './Theme'
import { SonnerProvider } from '@/providers/Sonner'

/**
 * `tienda`: el carrito, las direcciones y los pagos solo se cargan si el módulo
 * Tienda está encendido. Con la tienda apagada, pedirlos daría "sin permiso".
 */
export const Providers: React.FC<{
  children: React.ReactNode
  tienda?: boolean
}> = ({ children, tienda = true }) => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <HeaderThemeProvider>
          <SonnerProvider />
          {tienda ? (
          <EcommerceProvider
            enableVariants={true}
            api={{
              cartsFetchQuery: {
                depth: 2,
                populate: {
                  products: {
                    slug: true,
                    title: true,
                    gallery: true,
                    inventory: true,
                  },
                  variants: {
                    title: true,
                    inventory: true,
                  },
                },
              },
            }}
            currenciesConfig={{ supportedCurrencies: [COP], defaultCurrency: 'COP' }}
            paymentMethods={[wompiAdapterClient()]}
          >
            {children}
          </EcommerceProvider>
          ) : (
            children
          )}
        </HeaderThemeProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}
