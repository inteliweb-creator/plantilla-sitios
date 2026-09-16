'use client'

import { PasswordField } from '@payloadcms/ui'
import type { TextFieldClientComponent } from 'payload'

/** Campo para pegar la clave del proveedor: oculto como una contraseña y sin autocompletar. */
export const CampoClaveApi: TextFieldClientComponent = ({ field, path }) => {
  return <PasswordField autoComplete="off" field={field as any} path={path} />
}

export default CampoClaveApi
