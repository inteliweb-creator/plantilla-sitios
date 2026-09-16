'use client'

import { FormError } from '@/components/forms/FormError'
import { FormItem } from '@/components/forms/FormItem'
import { Message } from '@/components/Message'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import React, { useCallback, useState } from 'react'
import { useForm } from 'react-hook-form'

type FormData = { password: string; confirmar: string }

/** Nueva contraseña con el enlace que llegó al correo. */
export const ResetPasswordForm: React.FC = () => {
  const token = useSearchParams().get('token') || ''
  const [error, setError] = useState('')
  const [listo, setListo] = useState(false)
  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    watch,
  } = useForm<FormData>()

  const onSubmit = useCallback(
    async (data: FormData) => {
      const res = await fetch('/api/users/reset-password', {
        body: JSON.stringify({ token, password: data.password }),
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
      })
      if (res.ok) {
        setListo(true)
        setError('')
        return
      }
      const cuerpo = await res.json().catch(() => ({}))
      const detalle = cuerpo?.errors?.[0]?.data?.errors?.[0]?.message
      setError(detalle || 'El enlace ya no es válido o venció. Pide uno nuevo.')
    },
    [token],
  )

  if (!token) {
    return (
      <p>
        Este enlace está incompleto. <Link href="/forgot-password" className="underline">Pide uno nuevo</Link>.
      </p>
    )
  }

  if (listo) {
    return (
      <div>
        <h2 className="text-graphite text-2xl tracking-[-0.03em] mb-3">Contraseña actualizada</h2>
        <p className="mb-6">Ya puedes usar tu nueva contraseña.</p>
        <Button asChild>
          <Link href="/account">Ir a mi cuenta</Link>
        </Button>
      </div>
    )
  }

  return (
    <form className="max-w-lg" onSubmit={handleSubmit(onSubmit)}>
      <Message className="mb-8" error={error} />
      <FormItem className="mb-6">
        <Label htmlFor="password" className="mb-2">Nueva contraseña</Label>
        <Input
          id="password"
          type="password"
          autoComplete="new-password"
          {...register('password', {
            required: 'Escribe la nueva contraseña.',
            minLength: { value: 12, message: 'Usa al menos 12 caracteres.' },
          })}
        />
        {errors.password && <FormError message={errors.password.message} />}
      </FormItem>
      <FormItem className="mb-8">
        <Label htmlFor="confirmar" className="mb-2">Repítela</Label>
        <Input
          id="confirmar"
          type="password"
          autoComplete="new-password"
          {...register('confirmar', {
            validate: (v) => v === watch('password') || 'Las dos contraseñas no coinciden.',
          })}
        />
        {errors.confirmar && <FormError message={errors.confirmar.message} />}
      </FormItem>
      <Button type="submit" disabled={isSubmitting}>
        Guardar contraseña
      </Button>
    </form>
  )
}
