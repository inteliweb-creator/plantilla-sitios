import { esBloqueDelSitio } from '@/bloques/sitio/RenderBloques'
import type { Metadata } from 'next'

import { RenderBlocks } from '@/blocks/RenderBlocks'
import { RenderHero } from '@/heros/RenderHero'
import { generateMeta } from '@/utilities/generateMeta'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { draftMode } from 'next/headers'
import { homeStaticData } from '@/endpoints/seed/home-static'
import React from 'react'

import type { Page } from '@/payload-types'
import { notFound } from 'next/navigation'
import DocumentoLegal from '@/bloques/sitio/legal/DocumentoLegal'
import { legalPorSlug, sustituir, valoresNegocio } from '@/bloques/sitio/legal/datos'

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const pages = await payload.find({
    collection: 'pages',
    draft: false,
    limit: 1000,
    overrideAccess: false,
    pagination: false,
    select: {
      slug: true,
    },
  })

  const legales = await payload.find({ collection: 'legales', limit: 100, pagination: false, depth: 0, select: { slug: true } })

  const params = pages.docs
    ?.filter((doc) => {
      return doc.slug !== 'home'
    })
    .map(({ slug }) => {
      return { slug }
    })
    .concat(legales.docs.map(({ slug }) => ({ slug })))

  return params
}

type Args = {
  params: Promise<{
    slug?: string
  }>
}

export default async function Page({ params }: Args) {
  const { slug = 'home' } = await params
  const url = '/' + slug

  let page = await queryPageBySlug({
    slug,
  })

  // Remove this code once your website is seeded
  if (!page && slug === 'home') {
    page = homeStaticData() as Page
  }

  if (!page) {
    // Sin página con esa dirección: puede ser un documento legal (/privacidad, /cookies…).
    const legal = slug !== 'home' ? await legalPorSlug(slug) : null
    if (legal) return <DocumentoLegal doc={legal} />
    return notFound()
  }

  const { hero, layout } = page

  // Las páginas armadas con los bloques del diseño del sitio van a sangre, sin el
  // espaciado de la plantilla: la portada con montañas empieza arriba del todo.
  const disenoPropio = esBloqueDelSitio(layout?.[0]?.blockType)

  return (
    <article className={disenoPropio ? 'diseno-propio' : 'pt-16 pb-24'}>
      {!disenoPropio && <RenderHero {...hero} />}
      <RenderBlocks blocks={layout} />
    </article>
  )
}

export async function generateMetadata({ params }: Args): Promise<Metadata> {
  const { slug = 'home' } = await params

  const page = await queryPageBySlug({
    slug,
  })

  if (!page && slug !== 'home') {
    const legal: any = await legalPorSlug(slug)
    if (legal) {
      const valores = await valoresNegocio()
      return {
        // Google corta los títulos largos: si el del documento lo es, se usa su nombre corto.
        title: sustituir(legal.titulo?.length > 50 && legal.etiqueta ? legal.etiqueta : legal.titulo, valores),
        description: legal.descripcion ? sustituir(legal.descripcion, valores) : undefined,
        alternates: { canonical: `/${legal.slug}` },
      }
    }
  }

  return generateMeta({ doc: page })
}

const queryPageBySlug = async ({ slug }: { slug: string }) => {
  const { isEnabled: draft } = await draftMode()

  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'pages',
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
  })

  return result.docs?.[0] || null
}
