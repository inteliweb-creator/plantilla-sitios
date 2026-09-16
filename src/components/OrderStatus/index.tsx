import { OrderStatus as StatusOptions } from '@/payload-types'
import { cn } from '@/utilities/cn'

type Props = {
  status: StatusOptions
  className?: string
}

/** Mismos nombres que ve el negocio en el panel. */
const ESTADOS: Record<string, { texto: string; clase: string }> = {
  processing: { texto: 'Pagado · por despachar', clase: 'bg-amber-100 text-amber-900' },
  shipped: { texto: 'Despachado', clase: 'bg-sky-100 text-sky-900' },
  completed: { texto: 'Entregado', clase: 'bg-emerald-100 text-emerald-900' },
  cancelled: { texto: 'Cancelado', clase: 'bg-neutral-200 text-neutral-700' },
  refunded: { texto: 'Reembolsado', clase: 'bg-neutral-200 text-neutral-700' },
}

export const OrderStatus: React.FC<Props> = ({ status, className }) => {
  const e = ESTADOS[status as string] || { texto: String(status), clase: 'bg-neutral-200 text-neutral-700' }
  return <span className={cn('inline-block text-[12px] px-2.5 py-1 rounded-full w-fit', e.clase, className)}>{e.texto}</span>
}
