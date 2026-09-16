import { completarCampo } from '@/asistente/completar'
import { exigirAdmin } from '@/asistente/permiso'

export const maxDuration = 120

/** "✨ Completar con el asistente": redacta el valor de un campo del panel. Solo administradores. */
export async function POST(req: Request): Promise<Response> {
  const { payload, rechazo } = await exigirAdmin(120, 'completar')
  if (rechazo) return rechazo
  const cuerpo = await req.json().catch(() => null)
  if (!cuerpo?.campo?.nombre || !cuerpo?.campo?.ruta) return Response.json({ error: 'Petición incompleta.' }, { status: 400 })
  const resultado = await completarCampo(payload, cuerpo)
  return Response.json(resultado, { status: resultado.error ? 422 : 200 })
}
