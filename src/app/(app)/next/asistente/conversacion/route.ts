import { borrarConversacion, leerConversacion } from '@/asistente/conversaciones'
import { exigirAdmin } from '@/asistente/permiso'

/** Una conversación del historial (solo las propias). La burbuja la consulta mientras se trabaja. */
export async function GET(req: Request): Promise<Response> {
  const { payload, user, rechazo } = await exigirAdmin(1500, 'consultas')
  if (rechazo) return rechazo
  const id = new URL(req.url).searchParams.get('id')
  const doc = id ? await leerConversacion(payload, user, id) : null
  if (!doc) return Response.json({ error: 'No encontrada.' }, { status: 404 })
  return Response.json({ conversacion: doc })
}

/** Borra una conversación propia del historial. */
export async function DELETE(req: Request): Promise<Response> {
  const { payload, user, rechazo } = await exigirAdmin()
  if (rechazo) return rechazo
  const id = new URL(req.url).searchParams.get('id')
  const ok = id ? await borrarConversacion(payload, user, id) : false
  return Response.json({ ok }, { status: ok ? 200 : 404 })
}
