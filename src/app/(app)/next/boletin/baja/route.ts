import configPromise from '@payload-config'
import { getPayload } from 'payload'

/**
 * Baja del boletín con el código secreto de cada suscriptor.
 *
 * Solo por POST: los antivirus de correo abren los enlaces (GET) para
 * revisarlos, y si la baja fuera con GET darían de baja a gente sin querer.
 * La página /boletin/baja muestra un botón que hace este POST, y Gmail usa
 * esta misma dirección para su botón "Cancelar suscripción".
 */
export async function POST(req: Request) {
  const url = new URL(req.url)
  let codigo = url.searchParams.get('c') || ''
  if (!codigo) {
    try {
      const f = await req.formData()
      codigo = String(f.get('c') ?? '')
    } catch {}
  }
  if (!/^[a-f0-9]{48}$/.test(codigo)) return Response.json({ ok: false }, { status: 400 })

  const payload = await getPayload({ config: configPromise })
  const r = await payload.find({
    collection: 'suscriptores',
    where: { codigoBaja: { equals: codigo } },
    limit: 1,
    overrideAccess: true,
  })
  const s: any = r.docs[0]
  if (s && s.estado !== 'baja') {
    await payload.update({
      collection: 'suscriptores',
      id: s.id,
      data: { estado: 'baja', fechaBaja: new Date().toISOString() },
      overrideAccess: true,
    })
  }
  // Misma respuesta exista o no: no se revela si un código es válido.
  return Response.json({ ok: true })
}
