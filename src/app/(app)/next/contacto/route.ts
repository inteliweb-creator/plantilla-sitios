import configPromise from '@payload-config'
import { getPayload } from 'payload'

import { correoAviso, correoConfirmacion, enviarCorreo, marcaCorreo } from '@/correo'
import { modulosActivos } from '@/modulos'

/**
 * Formulario de contacto.
 *
 *   1. Filtra robots (campo trampa y límite de envíos por conexión).
 *   2. Valida: nombre y teléfono obligatorios; el correo, si viene, bien escrito.
 *   3. Guarda el mensaje en el buzón. Desde aquí ya no se pierde.
 *   4. Avisa por correo al negocio (correo privado de "Correos y avisos") y,
 *      si dejó correo, le confirma a quien escribió.
 *
 * Solo los pasos 1-3 pueden hacer fallar la petición. Si el correo falla, el
 * mensaje ya está en el buzón y a la persona se le responde que llegó.
 */

const CORREO_VALIDO = /^[^@\s]+@[^@\s]+\.[^@\s]+$/
const LIMITE = 5
const VENTANA_MS = 10 * 60 * 1000
const envios = new Map<string, number[]>()

const responder = (cuerpo: object, status = 200) => Response.json(cuerpo, { status })
const texto = (v: unknown, max: number) => String(v ?? '').trim().slice(0, max)

export async function POST(req: Request) {
  let f: Record<string, unknown>
  try {
    const tipo = req.headers.get('content-type') || ''
    f = tipo.includes('application/json') ? await req.json() : Object.fromEntries((await req.formData()).entries())
  } catch {
    return responder({ ok: false, error: 'No se pudieron leer los datos del formulario.' }, 400)
  }

  // Campo trampa: invisible para una persona. Se responde "ok" para no delatar la señal.
  if (texto(f.sitioWeb, 200)) return responder({ ok: true })

  const ip = (req.headers.get('x-forwarded-for') || 'local').split(',')[0].trim()
  const ahora = Date.now()
  const recientes = (envios.get(ip) || []).filter((t) => ahora - t < VENTANA_MS)
  if (recientes.length >= LIMITE) {
    return responder({ ok: false, error: 'Has enviado varios mensajes seguidos. Espera unos minutos o escríbenos por WhatsApp.' }, 429)
  }

  const datos = {
    nombre: texto(f.nombre, 120),
    correo: texto(f.correo ?? f.email, 160).toLowerCase(),
    telefono: texto(f.telefono, 40),
    necesita: texto(f.necesita, 120),
    mensaje: texto(f.mensaje, 4000),
    origen: texto(f.origen, 200),
  }

  const faltan: string[] = []
  if (!datos.nombre) faltan.push('tu nombre')
  if (!datos.telefono) faltan.push('tu teléfono')
  else if (datos.telefono.replace(/\D/g, '').length < 7) faltan.push('un teléfono válido')
  if (datos.correo && !CORREO_VALIDO.test(datos.correo)) faltan.push('un correo bien escrito')
  if (faltan.length) return responder({ ok: false, error: `Nos falta ${faltan.join(', ')}.` }, 400)

  recientes.push(ahora)
  envios.set(ip, recientes)

  const payload = await getPayload({ config: configPromise })

  let guardado: { id: number | string }
  try {
    guardado = await payload.create({
      collection: 'mensajes',
      data: { ...datos, correo: datos.correo || undefined, estado: 'nuevo' },
      overrideAccess: true,
    })
  } catch (e: any) {
    payload.logger.error(`No se pudo guardar el mensaje: ${e?.message}`)
    return responder({ ok: false, error: 'No pudimos recibir tu mensaje. Escríbenos por WhatsApp y lo resolvemos.' }, 500)
  }

  // A partir de aquí nada hace fallar la petición.
  try {
    const [avisos, negocio]: any[] = await Promise.all([
      payload.findGlobal({ slug: 'avisos', overrideAccess: true }),
      payload.findGlobal({ slug: 'tienda', overrideAccess: true, depth: 1 }),
    ])
    const nombreNegocio = negocio?.nombre || 'Tu sitio'
    const base = process.env.NEXT_PUBLIC_SERVER_URL || new URL(req.url).origin
    const marca = marcaCorreo(negocio, base, await modulosActivos())
    const remitente = avisos?.remitente
    if (avisos?.correoAvisos && remitente) {
      const aviso = await enviarCorreo({
        para: avisos.correoAvisos,
        remitente,
        tipo: 'aviso-mensaje',
        responderA: datos.correo || undefined,
        asunto: `Nuevo mensaje de ${datos.nombre}${datos.necesita ? ` — ${datos.necesita}` : ''}`,
        html: correoAviso(marca, datos, `${base}/admin/collections/mensajes/${guardado.id}`),
      })
      if (aviso.ok) {
        await payload.update({ collection: 'mensajes', id: guardado.id, data: { avisoEnviado: true }, overrideAccess: true })
      }

      if (datos.correo && avisos.enviarConfirmacion) {
        const conf = await enviarCorreo({
          para: datos.correo,
          remitente,
          tipo: 'confirmacion-contacto',
          asunto: `Recibimos tu mensaje — ${nombreNegocio}`,
          html: correoConfirmacion(marca, datos.nombre, avisos.textoConfirmacion || ''),
        })
        if (!conf.ok) payload.logger.warn(`No se pudo confirmar a quien escribió: ${conf.error}`)
      }
    } else {
      payload.logger.warn('Mensaje guardado sin aviso: falta el correo de avisos o el remitente en "Correos y avisos".')
    }
  } catch (e: any) {
    payload.logger.error(`Error en los avisos del mensaje: ${e?.message}`)
  }

  return responder({ ok: true })
}
