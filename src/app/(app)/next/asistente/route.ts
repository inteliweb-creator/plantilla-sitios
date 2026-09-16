import { after } from 'next/server'

import { estadoAsistente, recibirPedido } from '@/asistente/conversaciones'
import { exigirAdmin } from '@/asistente/permiso'

// El trabajo sigue después de responder (con `after`): este es su tiempo máximo.
export const maxDuration = 300

/** Estado de la burbuja: nombre, si está lista, propuestas pendientes e historial. */
export async function GET(): Promise<Response> {
  const { payload, user, rechazo } = await exigirAdmin(600, 'consultas')
  if (rechazo) return rechazo
  return Response.json(await estadoAsistente(payload, user))
}

/** Recibe un pedido, lo guarda y deja el trabajo corriendo en el servidor. Solo administradores. */
export async function POST(req: Request): Promise<Response> {
  const { payload, user, rechazo } = await exigirAdmin()
  if (rechazo) return rechazo
  const cuerpo = await req.json().catch(() => null)
  const r = await recibirPedido(payload, user, cuerpo?.texto, cuerpo?.conversacion)
  if ('error' in r) return Response.json({ error: r.error }, { status: 400 })
  after(r.trabajo)
  return Response.json({ conversacion: r.conversacion })
}
