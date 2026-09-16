import configPromise from '@payload-config'
import { getPayload } from 'payload'

import { suscribir } from '@/boletin/suscribir'
import { correoRecurso, enviarCorreo, hayCorreo, marcaCorreo } from '@/correo'
import { modulosActivos } from '@/modulos'
import { firmar } from '@/recursos/firma'

/**
 * Pedir un recurso gratis: guarda a la persona en "Interesados en recursos",
 * la suscribe al boletín solo si lo marcó, y le envía el enlace de descarga
 * por correo. El enlace va firmado y vence en 7 días.
 */

const CORREO_VALIDO = /^[^@\s]+@[^@\s]+\.[^@\s]+$/
const LIMITE = 5
const VENTANA_MS = 10 * 60 * 1000
const DIAS_ENLACE = 7
const intentos = new Map<string, number[]>()
const responder = (cuerpo: Record<string, unknown>, status = 200) => Response.json(cuerpo, { status })
const texto = (v: unknown, max: number) => String(v ?? '').trim().slice(0, max)

export async function POST(req: Request) {
  const modulos = await modulosActivos()
  if (!modulos.recursos) return responder({ ok: false, mensaje: 'No encontrado.' }, 404)

  let f: Record<string, unknown>
  try {
    f = await req.json()
  } catch {
    return responder({ ok: false, mensaje: 'No se pudo leer el formulario.' }, 400)
  }
  if (texto(f.sitioWeb, 200)) return responder({ ok: true, mensaje: 'Revisa tu correo.' })

  const ip = (req.headers.get('x-forwarded-for') || 'local').split(',')[0].trim()
  const ahora = Date.now()
  const recientes = (intentos.get(ip) || []).filter((t) => ahora - t < VENTANA_MS)
  if (recientes.length >= LIMITE) return responder({ ok: false, mensaje: 'Demasiadas solicitudes seguidas. Espera unos minutos.' }, 429)

  const datos = {
    slug: texto(f.recurso, 200),
    nombre: texto(f.nombre, 120),
    correo: texto(f.correo, 160).toLowerCase(),
    origen: texto(f.origen, 200),
    boletin: f.boletin === true,
  }
  if (!CORREO_VALIDO.test(datos.correo)) return responder({ ok: false, mensaje: 'Revisa el correo: ahí te enviamos el enlace.' }, 400)
  if (f.acepto !== true) return responder({ ok: false, mensaje: 'Acepta la política de privacidad para recibirlo.' }, 400)

  const payload = await getPayload({ config: configPromise })
  const { docs } = await payload.find({
    collection: 'recursos',
    where: { and: [{ slug: { equals: datos.slug } }, { publicado: { equals: true } }] },
    limit: 1,
    depth: 0,
  })
  const recurso: any = docs[0]
  if (!recurso) return responder({ ok: false, mensaje: 'Este recurso ya no está disponible.' }, 404)

  recientes.push(ahora)
  intentos.set(ip, recientes)

  const base = (process.env.NEXT_PUBLIC_SERVER_URL || new URL(req.url).origin).replace(/\/$/, '')
  let solicitud: any
  try {
    solicitud = await payload.create({
      collection: 'solicitudesRecurso',
      data: { nombre: datos.nombre || undefined, correo: datos.correo, recurso: recurso.id, aceptoBoletin: datos.boletin && modulos.boletin, origen: datos.origen },
    })
    if (datos.boletin && modulos.boletin) {
      await suscribir(payload, { correo: datos.correo, nombre: datos.nombre, origen: `Recurso: ${recurso.titulo}`, base })
    }
  } catch (e: any) {
    payload.logger.error(`No se pudo guardar la solicitud del recurso: ${e?.message}`)
    return responder({ ok: false, mensaje: 'No pudimos procesar tu solicitud. Inténtalo en un momento.' }, 500)
  }

  const vence = Date.now() + DIAS_ENLACE * 86400000
  const enlace = `${base}/next/recurso/descargar?s=${solicitud.id}&v=${vence}&f=${firmar(solicitud.id, vence)}`

  let enviado = false
  try {
    const [avisos, negocio]: any[] = await Promise.all([
      payload.findGlobal({ slug: 'avisos', depth: 0 }),
      payload.findGlobal({ slug: 'tienda', depth: 1 }),
    ])
    if (hayCorreo() && avisos?.remitente) {
      const r = await enviarCorreo({
        para: datos.correo,
        remitente: avisos.remitente,
        tipo: 'recurso',
        responderA: avisos.correoAvisos || undefined,
        asunto: recurso.asuntoCorreo || `Aquí tienes: ${recurso.titulo}`,
        html: correoRecurso({ negocio: marcaCorreo(negocio, base, modulos), nombre: datos.nombre, titulo: recurso.titulo, texto: recurso.textoCorreo, enlace, boton: 'Descargar' }),
      })
      enviado = r.ok
      if (!r.ok) payload.logger.warn(`Correo del recurso no enviado: ${r.error}`)
    }
  } catch (e: any) {
    payload.logger.error(`Error enviando el recurso: ${e?.message}`)
  }

  // Si el correo no pudo salir, el enlace se entrega en pantalla: la persona no se queda sin nada.
  const enPantalla = recurso.mostrarEnPantalla !== false || !enviado
  return responder({
    ok: true,
    mensaje: enviado ? recurso.textoExito || '¡Listo! Revisa tu correo: ahí está tu enlace.' : '¡Listo! Aquí tienes tu enlace.',
    ...(enPantalla ? { enlace } : {}),
  })
}
