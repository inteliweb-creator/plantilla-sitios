'use client'

import { ShoppingBag } from 'lucide-react'
import React from 'react'

/** Botón del carrito en la cabecera: bolsa y cantidad de artículos. */
export const OpenCartButton = React.forwardRef<
  HTMLButtonElement,
  { className?: string; quantity?: number } & React.ComponentProps<'button'>
>(function OpenCartButton({ className, quantity, ...rest }, ref) {
  return (
    <button
      ref={ref}
      type="button"
      aria-label={quantity ? `Abrir carrito, ${quantity} artículos` : 'Abrir carrito'}
      className="relative inline-flex h-12 items-center gap-2 rounded-full bg-white/90 border border-white px-4 text-[13px] font-semibold text-graphite shadow-[var(--shadow-soft)] hover:bg-white transition-colors"
      {...rest}
    >
      <ShoppingBag className="w-4 h-4" />
      <span className="hidden sm:inline">Carrito</span>
      {quantity ? (
        <span className="min-w-5 h-5 px-1.5 rounded-full bg-accent text-white text-[11px] leading-5 text-center">{quantity}</span>
      ) : null}
    </button>
  )
})
