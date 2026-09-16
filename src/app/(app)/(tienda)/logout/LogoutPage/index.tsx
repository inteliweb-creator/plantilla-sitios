'use client'

import { useAuth } from '@/providers/Auth'
import Link from 'next/link'
import React, { Fragment, useEffect, useState } from 'react'

export const LogoutPage: React.FC = (props) => {
  const { logout } = useAuth()
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    const performLogout = async () => {
      try {
        await logout()
        setSuccess('Cerraste sesión correctamente.')
      } catch (_) {
        setError('Ya habías cerrado sesión.')
      }
    }

    void performLogout()
  }, [logout])

  return (
    <Fragment>
      {(error || success) && (
        <div className="prose dark:prose-invert">
          <h1>{error || success}</h1>
          <p>
            ¿Qué quieres hacer ahora?
            <Fragment>
              {' '}
              <Link href="/shop">Haz clic aquí</Link>
              {` to shop.`}
            </Fragment>
            {` Para volver a entrar, `}
            <Link href="/login">haz clic aquí</Link>.
          </p>
        </div>
      )}
    </Fragment>
  )
}
