import configPromise from '@payload-config'
import { headers } from 'next/headers'
import { getPayload } from 'payload'

import { checkRole } from '@/access/utilities'

/**
 * Descarga la lista de suscriptores en CSV. Separado por punto y coma y con
 * marca UTF-8: así Excel en español lo abre con columnas y tildes bien.
 */
const celda = (v: unknown) => {
  const t = String(v ?? '')
  // Evita que Excel ejecute fórmulas escondidas en un nombre (=, +, -, @).
  const seguro = /^[=+\-@]/.test(t) ? `'${t}` : t
  return /[";\n\r]/.test(seguro) ? `"${seguro.replace(/"/g, '""')}"` : seguro
}
const fecha = (d?: string | null) => (d ? new Date(d).toLocaleDateString('es-CO', { timeZone: 'America/Bogota' }) : '')

export async function GET(req: Request) {
  const payload = await getPayload({ config: configPromise })
  const { user } = await payload.auth({ headers: await headers() })
  if (!user || !checkRole(['admin'], user as any)) return new Response('No autorizado.', { status: 403 })

  const soloActivos = new URL(req.url).searchParams.get('activos') === '1'
  const { docs } = await payload.find({
    collection: 'suscriptores',
    where: soloActivos ? { estado: { equals: 'activo' } } : undefined,
    sort: 'createdAt',
    limit: 0,
    pagination: false,
    depth: 0,
  })

  const lineas = [
    ['correo', 'nombre', 'estado', 'origen', 'fecha de alta', 'fecha de baja'].join(';'),
    ...docs.map((s: any) =>
      [s.correo, s.nombre, s.estado === 'activo' ? 'activo' : 'dado de baja', s.origen, fecha(s.createdAt), fecha(s.fechaBaja)].map(celda).join(';'),
    ),
  ]
  const hoy = new Date().toISOString().slice(0, 10)
  return new Response('﻿' + lineas.join('\r\n'), {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="suscriptores-${hoy}.csv"`,
      'Cache-Control': 'no-store',
    },
  })
}
