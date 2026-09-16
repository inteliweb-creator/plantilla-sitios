import type { Media, Product } from '@/payload-types'

import { RenderBlocks } from '@/blocks/RenderBlocks'
import { ProductGridItem } from '@/components/ProductGridItem'
import { getCachedGlobal } from '@/utilities/getGlobals'
import { Gallery } from '@/components/product/Gallery'
import { ProductDescription } from '@/components/product/ProductDescription'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { draftMode } from 'next/headers'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import React, { Suspense } from 'react'
import { ChevronLeftIcon } from 'lucide-react'
import { Metadata } from 'next'

type Args = {
  params: Promise<{
    slug: string
  }>
}

export async function generateMetadata({ params }: Args): Promise<Metadata> {
  const { slug } = await params
  const product = await queryProductBySlug({ slug })

  if (!product) return notFound()

  const gallery = product.gallery?.filter((item) => typeof item.image === 'object') || []

  const metaImage = typeof product.meta?.image === 'object' ? product.meta?.image : undefined
  const canIndex = product._status === 'published'

  const seoImage = metaImage || (gallery.length ? (gallery[0]?.image as Media) : undefined)

  return {
    description: product.meta?.description || '',
    openGraph: seoImage?.url
      ? {
          images: [
            {
              alt: seoImage?.alt,
              height: seoImage.height!,
              url: seoImage?.url,
              width: seoImage.width!,
            },
          ],
        }
      : null,
    robots: {
      follow: canIndex,
      googleBot: {
        follow: canIndex,
        index: canIndex,
      },
      index: canIndex,
    },
    title: product.meta?.title || product.title,
  }
}

export default async function ProductPage({ params }: Args) {
  const { slug } = await params
  const product = await queryProductBySlug({ slug })

  if (!product) return notFound()

  const gallery =
    product.gallery
      ?.filter((item) => typeof item.image === 'object')
      .map((item) => ({
        ...item,
        image: item.image as Media,
      })) || []

  const metaImage = typeof product.meta?.image === 'object' ? product.meta?.image : undefined
  const hasStock = product.enableVariants
    ? product?.variants?.docs?.some((variant) => {
        if (typeof variant !== 'object') return false
        return variant.inventory && variant?.inventory > 0
      })
    : product.inventory! > 0

  let price = product.priceInCOP

  if (product.enableVariants && product?.variants?.docs?.length) {
    price = product?.variants?.docs?.reduce((acc, variant) => {
      if (typeof variant === 'object' && variant?.priceInCOP && acc && variant?.priceInCOP > acc) {
        return variant.priceInCOP
      }
      return acc
    }, price)
  }

  const productJsonLd = {
    name: product.title,
    '@context': 'https://schema.org',
    '@type': 'Product',
    description: product.description,
    image: metaImage?.url,
    offers: {
      '@type': 'AggregateOffer',
      availability: hasStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      price: price,
      priceCurrency: 'COP',
    },
  }

  const relatedProducts =
    product.relatedProducts?.filter((relatedProduct) => typeof relatedProduct === 'object') ?? []

  const [textos, negocio]: any[] = await Promise.all([getCachedGlobal('tiendaTextos', 0)(), getCachedGlobal('tienda', 1)()])
  const categoria = product.categories?.find((c) => typeof c === 'object') as any

  return (
    <div className="diseno-propio">
      <script
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productJsonLd).replace(/</g, '\\u003c'),
        }}
        type="application/ld+json"
      />
      <section className="relative overflow-hidden pt-28 sm:pt-32 pb-16" style={{ background: 'linear-gradient(180deg, #E6E7EA 0%, #F2F2F3 30%, #FFFFFF 60%)' }}>
        <div aria-hidden="true" className="halo-bronce absolute w-[26rem] h-[26rem] -right-40 -top-24 opacity-40 pointer-events-none" />
        <div className="relative z-10 mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12 pl-rail">
          <nav aria-label="Ruta de navegación" className="mb-8 flex flex-wrap items-center gap-2 text-[12px] text-slate">
            <Link href="/shop" className="inline-flex items-center gap-1.5 rounded-full bg-white/80 border border-white px-3 py-1.5 text-graphite hover:bg-white transition-colors">
              <ChevronLeftIcon className="w-3.5 h-3.5" />
              {textos?.textoVolver || 'Volver a la tienda'}
            </Link>
            {categoria && (
              <>
                <span aria-hidden="true">/</span>
                <Link href={`/shop?category=${categoria.id}`} className="hover:text-graphite">{categoria.title}</Link>
              </>
            )}
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
            <div className="lg:col-span-7">
              <Suspense fallback={<div className="relative aspect-square w-full rounded-[30px] bg-[#F4F4F5]" />}>
                {Boolean(gallery?.length) && <Gallery gallery={gallery} />}
              </Suspense>
            </div>
            <div className="lg:col-span-5 lg:sticky lg:top-28">
              <ProductDescription product={product} textos={textos} negocio={negocio} />
            </div>
          </div>
        </div>
      </section>

      {product.layout?.length ? <RenderBlocks blocks={product.layout} /> : null}

      {relatedProducts.length ? (
        <section className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12 pl-rail pb-24">
          <RelatedProducts products={relatedProducts as Product[]} titulo={textos?.textoRelacionados} />
        </section>
      ) : null}
    </div>
  )
}

function RelatedProducts({ products, titulo }: { products: Product[]; titulo?: string }) {
  if (!products.length) return null
  return (
    <div className="border-t border-line pt-14">
      <h2 className="text-graphite text-[2rem] sm:text-[2.6rem] leading-[1] mb-8">{titulo || 'También te puede gustar'}</h2>
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {products.map((product) => (
          <li key={product.id}>
            <ProductGridItem product={product} />
          </li>
        ))}
      </ul>
    </div>
  )
}

const queryProductBySlug = async ({ slug }: { slug: string }) => {
  const { isEnabled: draft } = await draftMode()

  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'products',
    depth: 3,
    draft,
    limit: 1,
    overrideAccess: draft,
    pagination: false,
    where: {
      and: [
        {
          slug: {
            equals: slug,
          },
        },
        ...(draft ? [] : [{ _status: { equals: 'published' } }]),
      ],
    },
    populate: {
      variants: {
        title: true,
        priceInCOP: true,
        inventory: true,
        options: true,
      },
    },
  })

  return result.docs?.[0] || null
}
