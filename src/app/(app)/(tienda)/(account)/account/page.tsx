import type { Metadata } from 'next'

import { Button } from '@/components/ui/button'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import Link from 'next/link'
import { headers as getHeaders } from 'next/headers.js'
import configPromise from '@payload-config'
import { AccountForm } from '@/components/forms/AccountForm'
import { Order } from '@/payload-types'
import { OrderItem } from '@/components/OrderItem'
import { getPayload } from 'payload'
import { redirect } from 'next/navigation'

export default async function AccountPage() {
  const headers = await getHeaders()
  const payload = await getPayload({ config: configPromise })
  const { user } = await payload.auth({ headers })

  let orders: Order[] | null = null

  if (!user) {
    redirect(
      `/login?warning=${encodeURIComponent('Inicia sesión para ver los ajustes de tu cuenta.')}`,
    )
  }

  try {
    const ordersResult = await payload.find({
      collection: 'orders',
      limit: 5,
      user,
      overrideAccess: false,
      pagination: false,
      where: {
        customer: {
          equals: user?.id,
        },
      },
    })

    orders = ordersResult?.docs || []
  } catch (error) {
    // when deploying this template on Payload Cloud, this page needs to build before the APIs are live
    // so swallow the error here and simply render the page with fallback data where necessary
    // in production you may want to redirect to a 404  page or at least log the error somewhere
    // console.error(error)
  }

  return (
    <>
      <div className="rounded-[30px] bg-white border border-line p-6 sm:p-9 shadow-[var(--shadow-soft)]">
        <h1 className="text-graphite text-[1.8rem] sm:text-[2.2rem] leading-none tracking-[-0.04em] mb-6">Datos de tu cuenta</h1>
        <AccountForm />
      </div>

      <div className="rounded-[30px] bg-white border border-line p-6 sm:p-9 shadow-[var(--shadow-soft)]">
        <h2 className="text-graphite text-[1.8rem] sm:text-[2.2rem] leading-none tracking-[-0.04em] mb-6">Pedidos recientes</h2>

        <div className="prose dark:prose-invert mb-8">
          <p>
            Estos son tus pedidos más recientes. Cada pedido está asociado a un
            pago. A medida que compres, aparecerán en tu lista de pedidos.
          </p>
        </div>

        {(!orders || !Array.isArray(orders) || orders?.length === 0) && (
          <p className="mb-8">Todavía no tienes pedidos.</p>
        )}

        {orders && orders.length > 0 && (
          <ul className="flex flex-col gap-6 mb-8">
            {orders?.map((order, index) => (
              <li key={order.id}>
                <OrderItem order={order} />
              </li>
            ))}
          </ul>
        )}

        <Button asChild variant="default">
          <Link href="/orders">Ver todos los pedidos</Link>
        </Button>
      </div>
    </>
  )
}

export const metadata: Metadata = {
  description: 'Crea una cuenta o inicia sesión en la que ya tienes.',
  openGraph: mergeOpenGraph({
    title: 'Mi cuenta',
    url: '/account',
  }),
  title: 'Mi cuenta',
}
