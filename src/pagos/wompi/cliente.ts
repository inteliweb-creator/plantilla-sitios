import type { PaymentAdapterClient } from '@payloadcms/plugin-ecommerce/types'

/** Lado del navegador de Wompi: solo declara que existe el método. */
export const wompiAdapterClient = (): PaymentAdapterClient => ({
  name: 'wompi',
  label: 'Wompi',
  initiatePayment: true,
  confirmOrder: true,
})
