import { getPayload } from 'payload'
import config from '@payload-config'
import { headers } from 'next/headers'
import { revalidatePath } from 'next/cache'

import { checkRole } from '@/access/utilities'
import { optimizarImagenes } from '@/scripts/optimizar-imagenes'

export const maxDuration = 60

/** Optimiza las imágenes subidas antes de activar la optimización. Solo administradores. */
export async function POST(req: Request): Promise<Response> {
  const payload = await getPayload({ config })
  const { user } = await payload.auth({ headers: await headers() })
  if (!user || !checkRole(['admin'], user)) {
    return new Response('No autorizado.', { status: 403 })
  }
  const resumen = await optimizarImagenes(payload, new URL(req.url).searchParams.get('forzar') === '1')
  revalidatePath('/', 'layout')
  return Response.json({ ok: resumen.fallidas.length === 0, ...resumen })
}
