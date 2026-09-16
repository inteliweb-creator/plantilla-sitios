import type { ReactNode } from 'react'

import { exigirModulo } from '@/modulos'

/** Las páginas de recursos gratis dependen del módulo Recursos. */
export default async function RecursosLayout({ children }: { children: ReactNode }) {
  await exigirModulo('recursos')
  return children
}
