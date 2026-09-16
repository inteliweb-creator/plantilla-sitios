import type { Product } from '@/payload-types'

import Link from 'next/link'
import React from 'react'
import { ArrowUpRight } from 'lucide-react'
import { Media } from '@/components/Media'
import { Price } from '@/components/Price'

type Props = {
  product: Partial<Product>
}

/**
 * Tarjeta de producto con el diseño base: anillo exterior, foto sobre
 * el gris claro, nombre, precio en píldora y el orbe con la flecha.
 */
export const ProductGridItem: React.FC<Props> = ({ product }) => {
  const { gallery, priceInCOP, title } = product

  let price = priceInCOP
  const variants = product.variants?.docs
  if (variants?.length) {
    const variant = variants[0]
    if (variant && typeof variant === 'object' && typeof variant.priceInCOP === 'number') price = variant.priceInCOP
  }

  const image = gallery?.[0]?.image && typeof gallery[0]?.image !== 'string' ? gallery[0]?.image : false
  const categoria = product.categories?.find((c) => typeof c === 'object')

  return (
    <Link className="group block h-full" href={`/products/${product.slug}`}>
      <article className="h-full rounded-[30px] bg-surface border border-line p-2 shadow-[var(--shadow-soft)] transition-transform duration-500 group-hover:-translate-y-1.5">
        <div className="relative overflow-hidden rounded-[24px] bg-[#F4F4F5] aspect-square">
          {image ? (
            <Media
              className="relative h-full w-full"
              height={80}
              imgClassName="h-full w-full object-cover transition duration-500 ease-out group-hover:scale-[1.04]"
              resource={image}
              width={80}
            />
          ) : null}
          {categoria && typeof categoria === 'object' && (
            <span className="absolute left-3 top-3 glass-pill px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-graphite">
              {categoria.title}
            </span>
          )}
        </div>
        <div className="flex items-end justify-between gap-3 px-3 pt-4 pb-3">
          <div className="min-w-0">
            <h3 className="text-[1.25rem] leading-tight tracking-[-0.03em] font-medium text-graphite truncate">{title}</h3>
            {typeof price === 'number' && <Price amount={price} className="text-[15px] text-slate mt-1" />}
          </div>
          <span className="w-10 h-10 rounded-full bg-[#F1F1F0] flex items-center justify-center shrink-0 text-graphite transition-all duration-300 group-hover:bg-[#0E0F11] group-hover:text-white group-hover:rotate-45">
            <ArrowUpRight className="w-4 h-4" />
          </span>
        </div>
      </article>
    </Link>
  )
}
