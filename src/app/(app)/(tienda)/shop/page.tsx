import { Grid } from '@/components/Grid'
import { ProductGridItem } from '@/components/ProductGridItem'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'
import { getCachedGlobal } from '@/utilities/getGlobals'

export const metadata = {
  description: 'Busca productos en la tienda.',
  title: 'Tienda',
}

type SearchParams = { [key: string]: string | string[] | undefined }

type Props = {
  searchParams: Promise<SearchParams>
}

export default async function ShopPage({ searchParams }: Props) {
  const { q: searchValue, sort, category } = await searchParams
  const payload = await getPayload({ config: configPromise })

  const products = await payload.find({
    collection: 'products',
    draft: false,
    overrideAccess: false,
    depth: 1,
    select: {
      title: true,
      slug: true,
      gallery: true,
      categories: true,
      priceInCOP: true,
    },
    ...(sort ? { sort } : { sort: 'title' }),
    ...(searchValue || category
      ? {
          where: {
            and: [
              {
                _status: {
                  equals: 'published',
                },
              },
              ...(searchValue
                ? [
                    {
                      or: [
                        {
                          title: {
                            like: searchValue,
                          },
                        },
                        {
                          description: {
                            like: searchValue,
                          },
                        },
                      ],
                    },
                  ]
                : []),
              ...(category
                ? [
                    {
                      categories: {
                        contains: category,
                      },
                    },
                  ]
                : []),
            ],
          },
        }
      : {}),
  })

  const t: any = await getCachedGlobal('tiendaTextos', 0)()
  const n = products.docs.length

  return (
    <div>
      {searchValue ? (
        <p className="mb-6 text-slate">
          {n === 0 ? 'No hay productos que coincidan con ' : `${n} ${n === 1 ? 'resultado' : 'resultados'} para `}
          <span className="font-semibold text-graphite">&quot;{searchValue}&quot;</span>
        </p>
      ) : null}

      {!searchValue && n === 0 && <p className="mb-6 text-slate">{t?.sinResultados}</p>}

      {products?.docs.length > 0 ? (
        <Grid className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {products.docs.map((product) => {
            return <ProductGridItem key={product.id} product={product} />
          })}
        </Grid>
      ) : null}
    </div>
  )
}
