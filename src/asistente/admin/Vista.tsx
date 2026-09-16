import type { AdminViewServerProps } from 'payload'
import { DefaultTemplate } from '@payloadcms/next/templates'
import { Gutter } from '@payloadcms/ui'
import { redirect } from 'next/navigation'
import React from 'react'

import { checkRole } from '@/access/utilities'

import { IWe } from './IWe'

/** Pantalla /admin/asistente: el mismo asistente de la burbuja, en grande. Solo administradores. */
export default async function VistaAsistente({ initPageResult, params, searchParams }: AdminViewServerProps) {
  const { req } = initPageResult
  const { payload, user } = req
  if (!user || !checkRole(['admin'], user as any)) redirect('/admin/login')
  const ajustes: any = await payload.findGlobal({ slug: 'asistente', depth: 0, overrideAccess: true }).catch(() => null)
  const activo = Boolean(ajustes?.activo)

  return (
    <DefaultTemplate
      i18n={req.i18n}
      locale={initPageResult.locale}
      params={await params}
      payload={payload}
      permissions={initPageResult.permissions}
      searchParams={await searchParams}
      user={user}
      visibleEntities={initPageResult.visibleEntities}
    >
      <Gutter>
        {activo ? (
          <IWe modo="pagina" />
        ) : (
          <div style={{ maxWidth: '40rem', padding: '24px 0' }}>
            <h1>Asistente IA</h1>
            <p>
              El asistente está apagado. Es opcional: para usarlo, agrega una conexión (proveedor y clave) y enciéndelo en{' '}
              <a href="/admin/globals/asistente">Configuración → Asistente IA</a>.
            </p>
          </div>
        )}
      </Gutter>
    </DefaultTemplate>
  )
}
