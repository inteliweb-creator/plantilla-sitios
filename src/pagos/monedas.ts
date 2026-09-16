import type { Currency } from '@payloadcms/plugin-ecommerce/types'

/** Peso colombiano. Sin decimales: los precios se guardan en pesos enteros. */
export const COP: Currency = {
  code: 'COP',
  decimals: 0,
  label: 'Peso colombiano',
  symbol: '$',
}
