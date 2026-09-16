'use client'

import { FormError } from '@/components/forms/FormError'
import { FormItem } from '@/components/forms/FormItem'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/providers/Auth'
import React, { Fragment, useCallback, useState } from 'react'
import { useForm } from 'react-hook-form'
import { sendOrderAccessEmail } from './sendOrderAccessEmail'

type FormData = {
  email: string
  orderID: string
}

type Props = {
  initialEmail?: string
}

export const FindOrderForm: React.FC<Props> = ({ initialEmail }) => {
  const { user } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const {
    formState: { errors },
    handleSubmit,
    register,
  } = useForm<FormData>({
    defaultValues: {
      email: initialEmail || user?.email,
    },
  })

  const onSubmit = useCallback(async (data: FormData) => {
    setIsSubmitting(true)
    setSubmitError(null)

    try {
      const result = await sendOrderAccessEmail({
        email: data.email,
        orderID: data.orderID,
      })

      if (result.success) {
        setSuccess(true)
      } else {
        setSubmitError(result.error || 'Algo salió mal. Inténtalo de nuevo.')
      }
    } catch {
      setSubmitError('Algo salió mal. Inténtalo de nuevo.')
    } finally {
      setIsSubmitting(false)
    }
  }, [])

  if (success) {
    return (
      <Fragment>
        <h2 className="text-graphite text-2xl tracking-[-0.03em] mb-3">Revisa tu correo</h2>
        <div className="prose dark:prose-invert">
          <p>
            {`Si existe un pedido con ese correo y número, te enviamos un correo con el enlace para verlo details.`}
          </p>
        </div>
      </Fragment>
    )
  }

  return (
    <Fragment>
      <h2 className="sr-only">Buscar mi pedido</h2>
      <div className="prose dark:prose-invert mb-8">
        <p>{`Escribe tu correo y el número de pedido. Te enviaremos un enlace para verlo.`}</p>
      </div>
      <form className="max-w-lg flex flex-col gap-8" onSubmit={handleSubmit(onSubmit)}>
        <FormItem>
          <Label htmlFor="email" className="mb-2">
            Correo electrónico
          </Label>
          <Input
            id="email"
            {...register('email', { required: 'Escribe tu correo.' })}
            type="email"
          />
          {errors.email && <FormError message={errors.email.message} />}
        </FormItem>
        <FormItem>
          <Label htmlFor="orderID" className="mb-2">
            Número de pedido
          </Label>
          <Input
            id="orderID"
            {...register('orderID', {
              required: 'Escribe el número de pedido.',
            })}
            type="text"
          />
          {errors.orderID && <FormError message={errors.orderID.message} />}
        </FormItem>
        {submitError && <FormError message={submitError} />}
        <Button type="submit" className="self-start" variant="default" disabled={isSubmitting}>
          {isSubmitting ? 'Sending...' : 'Buscar pedido'}
        </Button>
      </form>
    </Fragment>
  )
}
