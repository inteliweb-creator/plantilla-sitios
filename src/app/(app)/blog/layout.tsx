import type { ReactNode } from 'react'

import { exigirModulo } from '@/modulos'

/** El blog y sus artículos dependen del módulo Blog. */
export default async function BlogLayout({ children }: { children: ReactNode }) {
  await exigirModulo('blog')
  return children
}
