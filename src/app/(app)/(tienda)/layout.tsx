import type { ReactNode } from 'react'

import { exigirModulo } from '@/modulos'

/** Todas las pantallas de la tienda (catálogo, producto, pago, cuentas) dependen del módulo Tienda. */
export default async function TiendaLayout({ children }: { children: ReactNode }) {
  await exigirModulo('tienda')
  return children
}
