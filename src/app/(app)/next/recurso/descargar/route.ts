import crypto from 'crypto'
import configPromise from '@payload-config'
import { getPayload } from 'payload'

import { firmar } from '@/recursos/firma'

/** Abre el enlace firmado del correo: comprueba la firma y la fecha, cuenta la descarga y lleva al archivo. */
export async function GET(req: Request) {
  const u = new URL(req.url)
  const id = u.searchParams.get('s') || ''
  const vence = Number(u.searchParams.get('v') || 0)
  const firma = u.searchParams.get('f') || ''
  const base = (process.env.NEXT_PUBLIC_SERVER_URL || u.origin).replace(/\/$/, '')

  const esperada = firmar(id, vence)
  const valida = firma.length === esperada.length && crypto.timingSafeEqual(Buffer.from(firma), Buffer.from(esperada))
  if (!id || !valida) return new Response('Este enlace no es válido.', { status: 403, headers: { 'Content-Type': 'text/plain; charset=utf-8' } })

  const payload = await getPayload({ config: configPromise })
  const solicitud: any = await payload.findByID({ collection: 'solicitudesRecurso', id, depth: 0 }).catch(() => null)
  if (!solicitud) return new Response('Este enlace no es válido.', { status: 404, headers: { 'Content-Type': 'text/plain; charset=utf-8' } })

  const recurso: any = await payload.findByID({ collection: 'recursos', id: solicitud.recurso, depth: 1 }).catch(() => null)
  if (Date.now() > vence) {
    // Vencido: a la página del recurso para pedirlo otra vez.
    return Response.redirect(`${base}/recursos/${recurso?.slug || ''}?vencido=1`, 302)
  }
  if (!recurso) return new Response('Este recurso ya no está disponible.', { status: 404, headers: { 'Content-Type': 'text/plain; charset=utf-8' } })

  const destino =
    recurso.tipoEntrega === 'enlace'
      ? recurso.enlace
      : typeof recurso.archivo === 'object' && recurso.archivo?.url
        ? /^https?:\/\//.test(recurso.archivo.url)
          ? recurso.archivo.url
          : `${base}${recurso.archivo.url}`
        : null
  if (!destino) return new Response('Este recurso aún no tiene archivo.', { status: 404, headers: { 'Content-Type': 'text/plain; charset=utf-8' } })

  try {
    if (!solicitud.descargo) {
      await payload.update({ collection: 'solicitudesRecurso', id, data: { descargo: true }, depth: 0 })
      await payload.update({ collection: 'recursos', id: recurso.id, data: { descargas: (recurso.descargas || 0) + 1 }, depth: 0, context: { disableRevalidate: true } })
    }
  } catch (e: any) {
    payload.logger.warn(`No se pudo contar la descarga: ${e?.message}`)
  }
  return Response.redirect(destino, 302)
}
