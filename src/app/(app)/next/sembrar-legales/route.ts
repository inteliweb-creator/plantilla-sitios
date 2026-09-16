import { getPayload } from 'payload'
import config from '@payload-config'
import { headers } from 'next/headers'
import { revalidatePath, revalidateTag } from 'next/cache'

import { checkRole } from '@/access/utilities'
import { sembrarLegales } from '@/scripts/sembrar-legales'

export const maxDuration = 300

/** Carga los documentos legales de ejemplo. Solo administradores. */
export async function POST(): Promise<Response> {
  // Cargan o reemplazan contenido de ejemplo: en producción están cerradas salvo que se permita a propósito.
  if (process.env.NODE_ENV === 'production' && process.env.PERMITIR_SEMILLAS !== '1') {
    return new Response('No disponible en producción.', { status: 404 })
  }
  const payload = await getPayload({ config })
  const { user } = await payload.auth({ headers: await headers() })
  if (!user || !checkRole(['admin'], user)) {
    return new Response('No autorizado.', { status: 403 })
  }
  try {
    const resumen = await sembrarLegales(payload)
    // Se cargó con la revalidación apagada: se refresca todo de una vez.
    for (const tag of ['legales']) revalidateTag(tag, 'max')
    revalidatePath('/', 'layout')
    return Response.json({ ok: true, ...resumen })
  } catch (e) {
    payload.logger.error({ err: e, msg: 'Error cargando los documentos legales' })
    return Response.json({ ok: false, error: e instanceof Error ? e.message : String(e) }, { status: 500 })
  }
}
