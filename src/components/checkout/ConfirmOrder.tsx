'use client'

import { LoadingSpinner } from '@/components/LoadingSpinner'
import { Button } from '@/components/ui/button'
import { useCart, usePayments } from '@payloadcms/plugin-ecommerce/client/react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * A donde vuelve la persona después de pagar en Wompi (?id=<transacción>).
 *
 * El servidor le pregunta a Wompi el estado real antes de crear el pedido. Si
 * el pago sigue en proceso (PSE puede tardar), se reintenta unos segundos
 * después; el webhook de Wompi también crea el pedido aunque se cierre la
 * pestaña.
 */
type Estado = 'confirmando' | 'pendiente' | 'rechazado' | 'error'

export const ConfirmOrder: React.FC = () => {
  const { confirmOrder } = usePayments()
  const { clearCart } = useCart()
  const searchParams = useSearchParams()
  const router = useRouter()
  const confirmando = useRef(false)
  const [estado, setEstado] = useState<Estado>('confirmando')
  const transactionID = searchParams.get('id')

  const confirmar = useCallback(async () => {
    if (!transactionID || confirmando.current) return
    confirmando.current = true
    setEstado('confirmando')
    try {
      const resultado: any = await confirmOrder('wompi', { additionalData: { transactionID } })
      if (resultado?.orderID) {
        clearCart()
        const q = new URLSearchParams()
        if (resultado.accessToken) q.set('accessToken', resultado.accessToken)
        router.push(`/orders/${resultado.orderID}${q.toString() ? `?${q}` : ''}`)
        return
      }
      setEstado('error')
    } catch (e) {
      const texto = e instanceof Error ? e.message : ''
      if (texto.includes('PENDING')) {
        setEstado('pendiente')
        setTimeout(() => {
          confirmando.current = false
          void confirmar()
        }, 5000)
        return
      }
      setEstado(texto.includes('NOT_APPROVED') ? 'rechazado' : 'error')
    }
    confirmando.current = false
  }, [transactionID, confirmOrder, clearCart, router])

  useEffect(() => {
    if (!transactionID) {
      router.push('/')
      return
    }
    void confirmar()
  }, [transactionID, confirmar, router])

  if (estado === 'rechazado' || estado === 'error') {
    return (
      <div className="text-center w-full flex flex-col items-center gap-4">
        <h1 className="text-2xl">
          {estado === 'rechazado' ? 'El pago no fue aprobado' : 'No pudimos confirmar tu pedido'}
        </h1>
        <p className="text-primary/70 max-w-md">
          {estado === 'rechazado'
            ? 'No se hizo ningún cobro. Puedes intentarlo con otro medio de pago.'
            : 'Si ya pagaste, tranquilo: tu pedido se registra automáticamente. Escríbenos si tienes dudas.'}
        </p>
        <Button asChild>
          <Link href="/checkout">Volver al pago</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="text-center w-full flex flex-col items-center justify-start gap-4">
      <h1 className="text-2xl">
        {estado === 'pendiente' ? 'Tu pago se está procesando…' : 'Confirmando tu pedido…'}
      </h1>
      {estado === 'pendiente' && (
        <p className="text-primary/70 max-w-md">
          Algunos medios, como PSE, tardan unos segundos. No cierres esta página.
        </p>
      )}
      <LoadingSpinner className="w-12 h-6" />
    </div>
  )
}
