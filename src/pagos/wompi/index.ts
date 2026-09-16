import crypto from 'node:crypto'

import type { PaymentAdapter } from '@payloadcms/plugin-ecommerce/types'
import type { Endpoint, GroupField, PayloadRequest } from 'payload'

/**
 * Pagos con Wompi (Colombia) — Checkout Web.
 *
 * Recorrido:
 *   1. `initiatePayment`: el servidor toma el total del carrito (nunca el que
 *      mande el navegador), crea una transacción `pending` y firma la orden con
 *      el secreto de integridad. Devuelve la URL del checkout de Wompi.
 *   2. La persona paga en Wompi (tarjeta, PSE, Nequi, Bancolombia…). Aquí no
 *      pasa ningún dato de tarjeta.
 *   3. Wompi redirige a /checkout/confirm-order?id=<transacción>. La página
 *      llama a `confirmOrder`, que PREGUNTA a la API de Wompi el estado real
 *      (los parámetros de la URL no se creen) y crea el pedido si está aprobado.
 *   4. En paralelo Wompi avisa por webhook (firmado con el secreto de eventos)
 *      a /api/payments/wompi/webhook. Crea el pedido si la persona cerró la
 *      pestaña antes de volver.
 *
 * Crear el pedido es idempotente: pase por donde pase, sale uno solo.
 */

export type WompiConfig = {
  /** pub_test_… o pub_prod_… */
  publicKey: string
  /** test_integrity_… o prod_integrity_… */
  integritySecret: string
  /** test_events_… o prod_events_… */
  eventsSecret: string
  label?: string
}

const esPrueba = (publicKey: string) => publicKey.startsWith('pub_test_')
const apiBase = (publicKey: string) =>
  esPrueba(publicKey) ? 'https://sandbox.wompi.co/v1' : 'https://production.wompi.co/v1'

const sha256 = (texto: string) => crypto.createHash('sha256').update(texto).digest('hex')

type ItemPlano = { product: string | number; variant?: string | number; quantity: number }

/** Deja el carrito como lista plana de IDs para guardarlo en la transacción. */
function aplanarCarrito(items: any[]): ItemPlano[] {
  return items.map((item) => {
    const product = typeof item.product === 'object' ? item.product.id : item.product
    const variant = item.variant ? (typeof item.variant === 'object' ? item.variant.id : item.variant) : undefined
    const { product: _p, variant: _v, ...resto } = item
    return { ...resto, product, quantity: item.quantity, ...(variant ? { variant } : {}) }
  })
}

/**
 * Crea el pedido a partir de una transacción aprobada. Si ya existe, lo
 * devuelve sin duplicar (Wompi reintenta avisos y la persona puede recargar).
 */
async function crearPedidoDesdeTransaccion({
  req,
  wompiTx,
  ordersSlug,
  transactionsSlug,
  cartsSlug,
}: {
  req: PayloadRequest
  wompiTx: any
  ordersSlug: string
  transactionsSlug: string
  cartsSlug: string
}) {
  const { payload } = req
  const encontradas = await payload.find({
    collection: transactionsSlug as any,
    where: { 'wompi.reference': { equals: wompiTx.reference } },
    limit: 1,
    overrideAccess: true,
    req,
  })
  const transaccion: any = encontradas.docs[0]
  if (!transaccion) throw new Error('No hay una transacción con esa referencia.')

  // El monto cobrado tiene que coincidir con el que se firmó.
  if (Number(wompiTx.amount_in_cents) !== Number(transaccion.amount) * 100) {
    throw new Error('El monto pagado no coincide con el pedido.')
  }

  if (transaccion.order) {
    const idPedido = typeof transaccion.order === 'object' ? transaccion.order.id : transaccion.order
    const pedido: any = await payload.findByID({ collection: ordersSlug as any, id: idPedido, overrideAccess: true, req })
    return { pedido, transaccion }
  }

  const pedido: any = await payload.create({
    collection: ordersSlug as any,
    data: {
      amount: transaccion.amount,
      currency: transaccion.currency,
      ...(transaccion.customer
        ? { customer: typeof transaccion.customer === 'object' ? transaccion.customer.id : transaccion.customer }
        : { customerEmail: transaccion.customerEmail }),
      items: transaccion.items,
      shippingAddress: transaccion.wompi?.shippingAddress,
      status: 'processing',
      transactions: [transaccion.id],
    },
    overrideAccess: true,
    req,
  })

  await payload.update({
    collection: transactionsSlug as any,
    id: transaccion.id,
    data: {
      order: pedido.id,
      status: 'succeeded',
      wompi: { ...transaccion.wompi, transactionID: wompiTx.id, paymentMethod: wompiTx.payment_method_type },
    },
    overrideAccess: true,
    req,
  })

  if (transaccion.cart) {
    const idCarrito = typeof transaccion.cart === 'object' ? transaccion.cart.id : transaccion.cart
    await payload.update({
      collection: cartsSlug as any,
      id: idCarrito,
      data: { purchasedAt: new Date().toISOString() },
      overrideAccess: true,
      req,
    })
  }

  return { pedido, transaccion }
}

async function consultarTransaccion(publicKey: string, id: string) {
  const res = await fetch(`${apiBase(publicKey)}/transactions/${encodeURIComponent(id)}`)
  if (!res.ok) throw new Error(`Wompi respondió ${res.status} al consultar la transacción.`)
  const { data } = await res.json()
  return data
}

export const wompiAdapter = (config: WompiConfig): PaymentAdapter => {
  const { publicKey, integritySecret, eventsSecret } = config

  const group: GroupField = {
    name: 'wompi',
    type: 'group',
    label: 'Wompi',
    admin: { condition: (data) => data?.paymentMethod === 'wompi' },
    fields: [
      { name: 'reference', type: 'text', label: 'Referencia', index: true, admin: { readOnly: true } },
      { name: 'transactionID', type: 'text', label: 'ID de transacción en Wompi', admin: { readOnly: true } },
      { name: 'paymentMethod', type: 'text', label: 'Medio de pago', admin: { readOnly: true } },
      { name: 'shippingAddress', type: 'json', label: 'Dirección de envío', admin: { readOnly: true } },
    ],
  }

  const webhook: Endpoint = {
    path: '/webhook',
    method: 'post',
    handler: async (req) => {
      const cuerpo = req.text ? await req.text() : ''
      let evento: any
      try {
        evento = JSON.parse(cuerpo)
      } catch {
        return Response.json({ ok: false }, { status: 400 })
      }

      // Firma: valores de signature.properties (rutas dentro de `data`), en
      // orden, + timestamp + secreto de eventos → SHA-256.
      const propiedades: string[] = evento?.signature?.properties ?? []
      const valores = propiedades
        .map((ruta) => ruta.split('.').reduce((o: any, k) => (o == null ? undefined : o[k]), evento.data))
        .join('')
      const esperado = sha256(`${valores}${evento?.timestamp}${eventsSecret}`)
      const recibido = String(evento?.signature?.checksum ?? '').toLowerCase()
      if (!eventsSecret || esperado.length !== recibido.length || !crypto.timingSafeEqual(Buffer.from(esperado), Buffer.from(recibido))) {
        req.payload.logger.warn('Webhook de Wompi con firma inválida')
        return Response.json({ ok: false }, { status: 401 })
      }

      const tx = evento?.data?.transaction
      if (evento?.event === 'transaction.updated' && tx?.status === 'APPROVED') {
        try {
          await crearPedidoDesdeTransaccion({
            req,
            wompiTx: tx,
            ordersSlug: 'orders',
            transactionsSlug: 'transactions',
            cartsSlug: 'carts',
          })
        } catch (e) {
          req.payload.logger.error({ err: e, msg: 'No se pudo crear el pedido desde el webhook de Wompi' })
          // 500 para que Wompi reintente.
          return Response.json({ ok: false }, { status: 500 })
        }
      } else if (tx?.reference && ['DECLINED', 'VOIDED', 'ERROR'].includes(tx?.status)) {
        const r = await req.payload.find({
          collection: 'transactions',
          where: { 'wompi.reference': { equals: tx.reference } },
          limit: 1,
          overrideAccess: true,
        })
        const t: any = r.docs[0]
        if (t && t.status === 'pending') {
          await req.payload.update({ collection: 'transactions', id: t.id, data: { status: 'failed' }, overrideAccess: true })
        }
      }

      return Response.json({ ok: true })
    },
  }

  return {
    name: 'wompi',
    label: config.label ?? 'Wompi',
    group,
    endpoints: [webhook],

    initiatePayment: async ({ data, req, transactionsSlug }) => {
      const { payload } = req
      const cart: any = data.cart
      const currency = String(data.currency ?? 'COP').toUpperCase()
      const customerEmail = data.customerEmail as string | undefined

      if (!publicKey || !integritySecret) throw new Error('Wompi no está configurado.')
      if (currency !== 'COP') throw new Error('Wompi solo cobra en pesos colombianos (COP).')
      if (!cart?.items?.length) throw new Error('El carrito está vacío.')
      if (!customerEmail && !req.user) throw new Error('Falta el correo del comprador.')

      const monto = Number(cart.subtotal)
      if (!monto || monto <= 0) throw new Error('El total del carrito no es válido.')

      const reference = `IW-${Date.now()}-${crypto.randomBytes(3).toString('hex')}`
      const amountInCents = Math.round(monto * 100)

      await payload.create({
        collection: transactionsSlug as any,
        data: {
          ...(req.user ? { customer: req.user.id } : { customerEmail }),
          amount: monto,
          billingAddress: data.billingAddress,
          cart: cart.id,
          currency,
          items: aplanarCarrito(cart.items),
          paymentMethod: 'wompi',
          status: 'pending',
          wompi: { reference, shippingAddress: data.shippingAddress ?? data.billingAddress },
        },
        req,
      })

      const redirectUrl = `${process.env.NEXT_PUBLIC_SERVER_URL}/checkout/confirm-order`
      const firma = sha256(`${reference}${amountInCents}${currency}${integritySecret}`)
      const email = customerEmail ?? (req.user as any)?.email
      const url = new URL('https://checkout.wompi.co/p/')
      url.searchParams.set('public-key', publicKey)
      url.searchParams.set('currency', currency)
      url.searchParams.set('amount-in-cents', String(amountInCents))
      url.searchParams.set('reference', reference)
      url.searchParams.set('signature:integrity', firma)
      url.searchParams.set('redirect-url', redirectUrl)
      if (email) url.searchParams.set('customer-data:email', email)

      return { message: 'Pago iniciado', reference, checkoutUrl: url.toString() }
    },

    confirmOrder: async ({ data, req, ordersSlug = 'orders', transactionsSlug = 'transactions', cartsSlug = 'carts' }) => {
      const id = data.transactionID as string
      if (!id) throw new Error('Falta el ID de la transacción de Wompi.')

      // Nunca se cree el estado que venga en la URL: se consulta a Wompi.
      const wompiTx = await consultarTransaccion(publicKey, id)
      if (wompiTx?.status !== 'APPROVED') {
        const error = new Error(wompiTx?.status === 'PENDING' ? 'PENDING' : 'NOT_APPROVED')
        throw error
      }

      const { pedido, transaccion } = await crearPedidoDesdeTransaccion({ req, wompiTx, ordersSlug, transactionsSlug, cartsSlug })
      return {
        message: 'Pedido confirmado',
        orderID: pedido.id,
        transactionID: transaccion.id,
        ...(pedido.accessToken ? { accessToken: pedido.accessToken } : {}),
      }
    },
  }
}
