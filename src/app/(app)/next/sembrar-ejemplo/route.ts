import { getPayload } from 'payload'
import config from '@payload-config'
import { headers } from 'next/headers'
import { revalidatePath } from 'next/cache'

import { checkRole } from '@/access/utilities'
import { sembrarEjemplo } from '@/scripts/sembrar-ejemplo'

export const maxDuration = 60

/**
 * Carga el contenido de ejemplo en un sitio vacío. Solo administradores, y
 * solo si no hay páginas: por eso también funciona en producción sin riesgo.
 * Vuelve a "Revisión del sitio" con el resultado.
 */
export async function POST(req: Request): Promise<Response> {
  const payload = await getPayload({ config })
  const { user } = await payload.auth({ headers: await headers() })
  if (!user || !checkRole(['admin'], user as any)) return new Response('No autorizado.', { status: 403 })

  const volver = (estado: string) => Response.redirect(new URL(`/admin/revision?ejemplo=${estado}`, req.url), 303)
  try {
    const r = await sembrarEjemplo(payload)
    if (!r.ok) return volver('ocupado')
    revalidatePath('/', 'layout')
    return volver('listo')
  } catch (e) {
    payload.logger.error({ err: e, msg: 'No se pudo cargar el contenido de ejemplo' })
    return volver('error')
  }
}
