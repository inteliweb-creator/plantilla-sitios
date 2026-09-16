'use client'

import clsx from 'clsx'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

type Props = {
  className?: string
}

const ENLACES = [
  { href: '/account', texto: 'Mis datos', activo: (r: string) => r === '/account' },
  { href: '/account/addresses', texto: 'Direcciones', activo: (r: string) => r === '/account/addresses' },
  { href: '/orders', texto: 'Pedidos', activo: (r: string) => r.startsWith('/orders') },
]

/** Menú del área de cuenta, en píldoras como los filtros de la tienda. */
export const AccountNav: React.FC<Props> = ({ className }) => {
  const ruta = usePathname()

  return (
    <nav aria-label="Mi cuenta" className={clsx(className)}>
      {ENLACES.map((e) => (
        <Link
          key={e.href}
          href={e.href}
          aria-current={e.activo(ruta) ? 'page' : undefined}
          className={clsx('rounded-full px-4 py-2.5 text-sm transition-colors', {
            'bg-[#0E0F11] text-white': e.activo(ruta),
            'text-slate hover:text-graphite hover:bg-[#F4F4F5]': !e.activo(ruta),
          })}
        >
          {e.texto}
        </Link>
      ))}
      <Link href="/logout" className="rounded-full px-4 py-2.5 text-sm text-slate hover:text-graphite hover:bg-[#F4F4F5] md:mt-4">
        Cerrar sesión
      </Link>
    </nav>
  )
}
