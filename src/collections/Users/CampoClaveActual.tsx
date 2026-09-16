'use client'

import { PasswordField, useAuth, useDocumentInfo, useFormFields } from '@payloadcms/ui'
import type { TextFieldClientComponent } from 'payload'

/** "Contraseña actual": aparece solo cuando escribes una nueva contraseña para tu propia cuenta. */
export const CampoClaveActual: TextFieldClientComponent = ({ field, path }) => {
  const nueva = useFormFields(([campos]) => campos?.password?.value)
  const { user } = useAuth()
  const { id } = useDocumentInfo()
  if (!nueva || !user || String(user.id) !== String(id)) return null
  return <PasswordField autoComplete="current-password" field={field} path={path} />
}

export default CampoClaveActual
