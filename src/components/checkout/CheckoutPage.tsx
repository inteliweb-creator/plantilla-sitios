'use client'

import { Media } from '@/components/Media'
import { Message } from '@/components/Message'
import { Price } from '@/components/Price'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/providers/Auth'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useCallback, useEffect, useState } from 'react'

import { useAddresses, useCart, usePayments } from '@payloadcms/plugin-ecommerce/client/react'
import { CheckoutAddresses } from '@/components/checkout/CheckoutAddresses'
import { CreateAddressModal } from '@/components/addresses/CreateAddressModal'
import { Address } from '@/payload-types'
import { Checkbox } from '@/components/ui/checkbox'
import { AddressItem } from '@/components/addresses/AddressItem'
import { FormItem } from '@/components/forms/FormItem'
import { toast } from 'sonner'
import { LoadingSpinner } from '@/components/LoadingSpinner'

export const CheckoutPage: React.FC = () => {
  const { user } = useAuth()
  const router = useRouter()
  const { cart } = useCart()
  const [error, setError] = useState<null | string>(null)
  /**
   * State to manage the email input for guest checkout.
   */
  const [email, setEmail] = useState('')
  const [emailEditable, setEmailEditable] = useState(true)
  const [paymentData, setPaymentData] = useState<null | Record<string, unknown>>(null)
  const { initiatePayment } = usePayments()
  const { addresses } = useAddresses()
  const [shippingAddress, setShippingAddress] = useState<Partial<Address>>()
  const [billingAddress, setBillingAddress] = useState<Partial<Address>>()
  const [billingAddressSameAsShipping, setBillingAddressSameAsShipping] = useState(true)
  const [isProcessingPayment, setProcessingPayment] = useState(false)

  const cartIsEmpty = !cart || !cart.items || !cart.items.length

  const canGoToPayment = Boolean(
    (email || user) && billingAddress && (billingAddressSameAsShipping || shippingAddress),
  )

  // On initial load wait for addresses to be loaded and check to see if we can prefill a default one
  useEffect(() => {
    if (!shippingAddress) {
      if (addresses && addresses.length > 0) {
        const defaultAddress = addresses[0]
        if (defaultAddress) {
          setBillingAddress(defaultAddress)
        }
      }
    }
  }, [addresses])

  useEffect(() => {
    return () => {
      setShippingAddress(undefined)
      setBillingAddress(undefined)
      setBillingAddressSameAsShipping(true)
      setEmail('')
      setEmailEditable(true)
    }
  }, [])

  const initiatePaymentIntent = useCallback(
    async (paymentID: string) => {
      try {
        const paymentData = (await initiatePayment(paymentID, {
          additionalData: {
            ...(email ? { customerEmail: email } : {}),
            billingAddress,
            shippingAddress: billingAddressSameAsShipping ? billingAddress : shippingAddress,
          },
        })) as Record<string, unknown>

        // Wompi cobra en su propia página: se va allí y vuelve a
        // /checkout/confirm-order con el ID de la transacción.
        if (paymentData?.checkoutUrl) {
          setProcessingPayment(true)
          setPaymentData(paymentData)
          window.location.assign(paymentData.checkoutUrl as string)
        }
      } catch (error) {
        const errorData = error instanceof Error ? JSON.parse(error.message) : {}
        let errorMessage = 'No pudimos iniciar el pago. Inténtalo de nuevo.'

        if (errorData?.cause?.code === 'OutOfStock') {
          errorMessage = 'Uno o más productos del carrito ya no tienen existencias.'
        }

        setError(errorMessage)
        toast.error(errorMessage)
      }
    },
    [billingAddress, billingAddressSameAsShipping, shippingAddress],
  )

  if (cartIsEmpty && isProcessingPayment) {
    return (
      <div className="py-12 w-full items-center justify-center">
        <div className="prose dark:prose-invert text-center max-w-none self-center mb-8">
          <p>Te estamos llevando al pago seguro de Wompi…</p>
        </div>
        <LoadingSpinner />
      </div>
    )
  }

  if (cartIsEmpty) {
    return (
      <div className="max-w-xl rounded-[30px] bg-white border border-line p-8 sm:p-10 shadow-[var(--shadow-soft)]">
        <p className="text-graphite text-2xl tracking-[-0.03em] mb-2">Tu carrito está vacío.</p>
        <p className="text-slate mb-6">Agrega productos para finalizar tu compra.</p>
        <Link href="/shop" className="pill-negra text-sm">
          <span>Ver productos</span>
        </Link>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-stretch lg:flex-row gap-8 lg:gap-10">
      <div className="basis-full lg:basis-3/5 flex flex-col gap-6 rounded-[30px] bg-white border border-line p-6 sm:p-9 shadow-[var(--shadow-soft)]">
        <h2 className="text-graphite text-[1.7rem] leading-none tracking-[-0.04em]"><span className="text-slate text-base mr-2">01</span>Contacto</h2>
        {!user && (
          <div className="bg-[#F4F4F5] rounded-2xl p-4 w-full flex items-center">
            <div className="flex flex-wrap items-center gap-2 text-sm text-slate [&_a]:underline">
              <Button asChild className="no-underline text-inherit" variant="outline">
                <Link href="/login">Iniciar sesión</Link>
              </Button>
              <p>
                <span className="mx-2">o</span>
                <Link href="/create-account">crear una cuenta</Link>
              </p>
            </div>
          </div>
        )}
        {user ? (
          <div className="bg-[#F4F4F5] rounded-2xl p-4 text-sm text-graphite">
            <div>
              <p>{user.email}</p>{' '}
              <p>
                ¿No eres tú?{' '}
                <Link className="underline" href="/logout">
                  Cerrar sesión
                </Link>
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-[#F4F4F5] rounded-2xl p-5">
            <div>
              <p className="mb-4 text-sm text-slate">Escribe tu correo para comprar sin crear cuenta.</p>

              <FormItem className="mb-6">
                <Label htmlFor="email">Correo electrónico</Label>
                <Input
                  disabled={!emailEditable}
                  id="email"
                  name="email"
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  type="email"
                />
              </FormItem>

              <Button
                disabled={!email || !emailEditable}
                onClick={(e) => {
                  e.preventDefault()
                  setEmailEditable(false)
                }}
                variant="default"
              >
                Continuar sin cuenta
              </Button>
            </div>
          </div>
        )}

        <h2 className="text-graphite text-[1.7rem] leading-none tracking-[-0.04em] pt-6 border-t border-line"><span className="text-slate text-base mr-2">02</span>Dirección</h2>

        {billingAddress ? (
          <div>
            <AddressItem
              actions={
                <Button
                  variant={'outline'}
                  disabled={Boolean(paymentData)}
                  onClick={(e) => {
                    e.preventDefault()
                    setBillingAddress(undefined)
                  }}
                >
                  Quitar
                </Button>
              }
              address={billingAddress}
            />
          </div>
        ) : user ? (
          <CheckoutAddresses heading="Dirección de facturación" setAddress={setBillingAddress} />
        ) : (
          <CreateAddressModal
            disabled={!email || Boolean(emailEditable)}
            callback={(address) => {
              setBillingAddress(address)
            }}
            skipSubmission={true}
          />
        )}

        <div className="flex gap-4 items-center">
          <Checkbox
            id="shippingTheSameAsBilling"
            checked={billingAddressSameAsShipping}
            disabled={Boolean(paymentData || (!user && (!email || Boolean(emailEditable))))}
            onCheckedChange={(state) => {
              setBillingAddressSameAsShipping(state as boolean)
            }}
          />
          <Label htmlFor="shippingTheSameAsBilling">Enviar a la misma dirección</Label>
        </div>

        {!billingAddressSameAsShipping && (
          <>
            {shippingAddress ? (
              <div>
                <AddressItem
                  actions={
                    <Button
                      variant={'outline'}
                      disabled={Boolean(paymentData)}
                      onClick={(e) => {
                        e.preventDefault()
                        setShippingAddress(undefined)
                      }}
                    >
                      Quitar
                    </Button>
                  }
                  address={shippingAddress}
                />
              </div>
            ) : user ? (
              <CheckoutAddresses
                heading="Dirección de envío"
                description="Elige a dónde enviamos tu pedido."
                setAddress={setShippingAddress}
              />
            ) : (
              <CreateAddressModal
                callback={(address) => {
                  setShippingAddress(address)
                }}
                disabled={!email || Boolean(emailEditable)}
                skipSubmission={true}
              />
            )}
          </>
        )}

        {!paymentData && (
          <Button
            className="self-start mt-2"
            size="lg"
            disabled={!canGoToPayment}
            onClick={(e) => {
              e.preventDefault()
              void initiatePaymentIntent('wompi')
            }}
          >
            Pagar con Wompi
          </Button>
        )}

        {!paymentData?.['checkoutUrl'] && error && (
          <div className="my-8">
            <Message error={error} />

            <Button
              onClick={(e) => {
                e.preventDefault()
                router.refresh()
              }}
              variant="default"
            >
              Intentar de nuevo
            </Button>
          </div>
        )}

        <p className="text-[13px] text-slate -mt-2">
          Pago seguro con Wompi: tarjeta, PSE, Nequi o Bancolombia.
        </p>
      </div>

      {!cartIsEmpty && (
        <div className="basis-full lg:basis-2/5 self-start lg:sticky lg:top-28 p-6 sm:p-8 bg-[#F4F4F5] flex flex-col gap-6 rounded-[30px]">
          <h2 className="text-graphite text-[1.7rem] leading-none tracking-[-0.04em]">Tu pedido</h2>
          {cart?.items?.map((item, index) => {
            if (typeof item.product === 'object' && item.product) {
              const {
                product,
                product: { id, meta, title, gallery },
                quantity,
                variant,
              } = item

              if (!quantity) return null

              let image = gallery?.[0]?.image || meta?.image
              let price = product?.priceInCOP

              const isVariant = Boolean(variant) && typeof variant === 'object'

              if (isVariant) {
                price = variant?.priceInCOP

                const imageVariant = product.gallery?.find((item: any) => {
                  if (!item.variantOption) return false
                  const variantOptionID =
                    typeof item.variantOption === 'object'
                      ? item.variantOption.id
                      : item.variantOption

                  const hasMatch = variant?.options?.some((option: any) => {
                    if (typeof option === 'object') return option.id === variantOptionID
                    else return option === variantOptionID
                  })

                  return hasMatch
                })

                if (imageVariant && typeof imageVariant.image !== 'string') {
                  image = imageVariant.image
                }
              }

              return (
                <div className="flex items-start gap-4" key={index}>
                  <div className="flex items-stretch justify-stretch h-20 w-20 rounded-2xl bg-white overflow-hidden">
                    <div className="relative w-full h-full">
                      {image && typeof image !== 'string' && (
                        <Media className="" fill imgClassName="object-cover" resource={image} />
                      )}
                    </div>
                  </div>
                  <div className="flex grow justify-between items-center">
                    <div className="flex flex-col gap-1">
                      <p className="font-medium text-graphite">{title}</p>
                      {variant && typeof variant === 'object' && (
                        <p className="text-sm text-slate">
                          {variant.options
                            ?.map((option: any) => {
                              if (typeof option === 'object') return option.label
                              return null
                            })
                            .join(', ')}
                        </p>
                      )}
                      <div className="text-sm text-slate">Cantidad: {quantity}</div>
                    </div>

                    {typeof price === 'number' && <Price amount={price} />}
                  </div>
                </div>
              )
            }
            return null
          })}
          <hr className="border-line" />
          <div className="flex justify-between items-center gap-2">
            <span className="text-slate">Total</span>{' '}
            <Price className="text-[1.8rem] tracking-[-0.04em] font-medium text-graphite" amount={cart.subtotal || 0} />
          </div>
        </div>
      )}
    </div>
  )
}
