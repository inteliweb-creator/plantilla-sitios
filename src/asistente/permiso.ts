import { getPayload } from 'payload'
import config from '@payload-config'
import { headers } from 'next/headers'

import { checkRole } from '@/access/utilities'

// Freno contra bucles o clics repetidos: peticiones por administrador por ventana de tiempo.
const VENTANA_MS = 10 * 60_000
const usos = new Map<string, number[]>()

/** Solo administradores con sesión iniciada. Devuelve payload y usuario, o la respuesta de rechazo. */
export async function exigirAdmin(limite = 40, grupo = 'pedidos') {
  const payload = await getPayload({ config })
  const { user } = await payload.auth({ headers: await headers() })
  if (!user || !checkRole(['admin'], user as any)) {
    return { rechazo: Response.json({ error: 'No autorizado.' }, { status: 403 }) }
  }
  const clave = `${grupo}:${user.id}`
  const ahora = Date.now()
  const recientes = (usos.get(clave) || []).filter((t) => ahora - t < VENTANA_MS)
  if (recientes.length >= limite) {
    return { rechazo: Response.json({ error: 'Demasiadas peticiones seguidas. Espera unos minutos.' }, { status: 429 }) }
  }
  recientes.push(ahora)
  usos.set(clave, recientes)
  return { payload, user }
}
