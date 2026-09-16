import type { CountryType } from '@payloadcms/plugin-ecommerce/types'

/**
 * Países habilitados para direcciones de envío. Colombia primero; la lista
 * es corta a propósito para una tienda que despacha en la región. Se amplía
 * aquí si un cliente envía a más países.
 */
export const paises: CountryType[] = [
  { label: 'Colombia', value: 'CO' },
  { label: 'Ecuador', value: 'EC' },
  { label: 'Perú', value: 'PE' },
  { label: 'Panamá', value: 'PA' },
  { label: 'México', value: 'MX' },
  { label: 'Estados Unidos', value: 'US' },
  { label: 'España', value: 'ES' },
]
