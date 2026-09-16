import { decidir } from '@/asistente/agente'

import { exigirAdmin } from '@/asistente/permiso'

export const maxDuration = 300

/** Aprobar o cancelar una propuesta del asistente. Solo administradores, con su propio clic. */
export async function POST(req: Request): Promise<Response> {
  const { payload, user, rechazo } = await exigirAdmin(60, 'aprobaciones')
  if (rechazo) return rechazo
  const cuerpo = await req.json().catch(() => null)
  if (!cuerpo?.id || !['aprobar', 'cancelar'].includes(cuerpo?.decision)) {
    return Response.json({ ok: false, mensaje: 'Petición incompleta.' }, { status: 400 })
  }
  const resultado = await decidir(payload, user, cuerpo.id, cuerpo.decision === 'aprobar')
  return Response.json(resultado)
}
