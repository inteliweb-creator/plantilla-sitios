'use client'
import type { Product, Variant } from '@/payload-types'

import { RichText } from '@/components/RichText'
import { AddToCart } from '@/components/Cart/AddToCart'
import { Price } from '@/components/Price'
import React, { Suspense } from 'react'
import { MessageCircle, ShieldCheck } from 'lucide-react'

import { VariantSelector } from './VariantSelector'
import { useCurrency } from '@payloadcms/plugin-ecommerce/client/react'
import { StockIndicator } from '@/components/product/StockIndicator'

export function ProductDescription({ product, textos, negocio }: { product: Product; textos?: any; negocio?: any }) {
  const { currency } = useCurrency()
  let amount = 0,
    lowestAmount = 0,
    highestAmount = 0
  const priceField = `priceIn${currency.code}` as keyof Product
  const hasVariants = product.enableVariants && Boolean(product.variants?.docs?.length)

  if (hasVariants) {
    const priceField = `priceIn${currency.code}` as keyof Variant
    const variantsOrderedByPrice = product.variants?.docs
      ?.filter((variant) => variant && typeof variant === 'object')
      .sort((a, b) => {
        if (
          typeof a === 'object' &&
          typeof b === 'object' &&
          priceField in a &&
          priceField in b &&
          typeof a[priceField] === 'number' &&
          typeof b[priceField] === 'number'
        ) {
          return a[priceField] - b[priceField]
        }

        return 0
      }) as Variant[]

    const lowestVariant = variantsOrderedByPrice[0][priceField]
    const highestVariant = variantsOrderedByPrice[variantsOrderedByPrice.length - 1][priceField]
    if (
      variantsOrderedByPrice &&
      typeof lowestVariant === 'number' &&
      typeof highestVariant === 'number'
    ) {
      lowestAmount = lowestVariant
      highestAmount = highestVariant
    }
  } else if (product[priceField] && typeof product[priceField] === 'number') {
    amount = product[priceField]
  }

  const wa = String(negocio?.whatsapp || '').replace(/\D/g, '')
  const mensaje = String(textos?.mensajePreguntar || 'Hola, tengo una pregunta sobre {producto}.').replace('{producto}', product.title)
  const garantias: string[] = (textos?.garantias || []).map((g: any) => g?.texto).filter(Boolean)

  return (
    <div className="rounded-[30px] bg-white border border-line p-6 sm:p-8 shadow-[var(--shadow-lift)] flex flex-col gap-6">
      <div>
        <h1 className="text-graphite text-[2.2rem] sm:text-[2.8rem] leading-[1] tracking-[-0.04em] mb-4">{product.title}</h1>
        <div className="text-[1.6rem] tracking-[-0.03em] font-medium text-accent">
          {hasVariants ? (
            <Price highestAmount={highestAmount} lowestAmount={lowestAmount} />
          ) : (
            <Price amount={amount} />
          )}
        </div>
      </div>

      {product.description ? (
        <RichText className="prose-sitio !text-[15px] max-w-none" enableProse={false} data={product.description} enableGutter={false} />
      ) : null}

      {hasVariants && (
        <div className="border-t border-line pt-6 flex flex-col gap-5">
          <Suspense fallback={null}>
            <VariantSelector product={product} />
          </Suspense>
        </div>
      )}

      <div className="border-t border-line pt-6 flex flex-col gap-3">
        <Suspense fallback={null}>
          <StockIndicator product={product} />
        </Suspense>
        <Suspense fallback={null}>
          <AddToCart product={product} texto={textos?.textoAgregar} textoElegir={textos?.textoElegir} />
        </Suspense>
        {wa && (
          <a
            href={`https://wa.me/${wa}?text=${encodeURIComponent(mensaje)}`}
            target="_blank"
            rel="noreferrer"
            className="pill-gris w-full justify-center gap-2 text-sm"
          >
            <MessageCircle className="w-4 h-4" />
            <span>{textos?.textoPreguntar || 'Preguntar por WhatsApp'}</span>
          </a>
        )}
      </div>

      {garantias.length > 0 && (
        <ul className="flex flex-col gap-2.5 text-[13px] text-slate">
          {garantias.map((g) => (
            <li key={g} className="flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-accent shrink-0 mt-0.5" />
              {g}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
