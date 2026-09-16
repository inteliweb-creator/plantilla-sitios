import configPromise from '@payload-config'
import { getPayload } from 'payload'

import { suscribir } from '@/boletin/suscribir'
import { modulosActivos } from '@/modulos'

/**
 * Alta en el boletín.
 *
 * Se guarda en "Suscriptores" (la lista es del negocio). Si ya estaba y se
 * había dado de baja, vuelve a quedar activo. Luego, sin que un fallo del
 * correo afecte la respuesta: bienvenida al suscriptor y aviso privado al
 * negocio.
 */

const CORREO_VALIDO = /^[^@\s]+@[^@\s]+\.[^@\s]+$/
const LIMITE = 5
const VENTANA_MS = 10 * 60 * 1000
const intentos = new Map<string, number[]>()
const responder = (ok: boolean, mensaje: string, status = 200) => Response.json({ ok, mensaje }, { status })

export async function POST(req: Request) {
  if (!(await modulosActivos()).boletin) return responder(false, 'No encontrado.', 404)
  let f: Record<string, unknown>
  try {
    const tipo = req.headers.get('content-type') || ''
    f = tipo.includes('application/json') ? await req.json() : Object.fromEntries((await req.formData()).entries())
  } catch {
    return responder(false, 'No se pudo leer el formulario.', 400)
  }

  if (String(f.sitioWeb ?? '')) return responder(true, 'Listo, ya estás en la lista.')

  const ip = (req.headers.get('x-forwarded-for') || 'local').split(',')[0].trim()
  const ahora = Date.now()
  const recientes = (intentos.get(ip) || []).filter((t) => ahora - t < VENTANA_MS)
  if (recientes.length >= LIMITE) return responder(false, 'Demasiados intentos seguidos. Espera unos minutos.', 429)

  const correo = String(f.correo ?? f.email ?? '').trim().toLowerCase().slice(0, 160)
  const nombre = String(f.nombre ?? '').trim().slice(0, 120)
  const origen = String(f.origen ?? '').trim().slice(0, 200)
  if (!CORREO_VALIDO.test(correo)) return responder(false, 'Revisa el correo, parece que tiene una errata.', 400)

  recientes.push(ahora)
  intentos.set(ip, recientes)

  const payload = await getPayload({ config: configPromise })
  try {
    const base = (process.env.NEXT_PUBLIC_SERVER_URL || new URL(req.url).origin).replace(/\/$/, '')
    const { nuevo } = await suscribir(payload, { correo, nombre, origen, base })
    if (!nuevo) return responder(true, 'Ya estabas en la lista: seguirás recibiendo el boletín.')
  } catch (e: any) {
    payload.logger.error(`No se pudo guardar el suscriptor: ${e?.message}`)
    return responder(false, 'No pudimos registrarte. Inténtalo en un momento.', 500)
  }

  return responder(true, 'Listo, ya estás en la lista.')
}
