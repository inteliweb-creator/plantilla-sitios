import configPromise from '@payload-config'
import { getPayload } from 'payload'

import { enviarCorreo, correoAvisoComentario, marcaCorreo } from '@/correo'
import { modulosActivos } from '@/modulos'

/**
 * Nuevo comentario en un artículo. Queda "pendiente" hasta que el negocio lo
 * aprueba. Filtros contra robots: campo trampa, tiempo mínimo para escribir,
 * límite por conexión y un máximo de enlaces.
 */

const CORREO_VALIDO = /^[^@\s]+@[^@\s]+\.[^@\s]+$/
const LIMITE = 3
const VENTANA_MS = 10 * 60 * 1000
const intentos = new Map<string, number[]>()
const responder = (ok: boolean, mensaje: string, status = 200) => Response.json({ ok, mensaje }, { status })
const texto = (v: unknown, max: number) => String(v ?? '').trim().slice(0, max)

export async function POST(req: Request) {
  if (!(await modulosActivos()).blog) return responder(false, 'No encontrado.', 404)
  let f: Record<string, unknown>
  try {
    f = await req.json()
  } catch {
    return responder(false, 'No se pudo leer el formulario.', 400)
  }

  const payload = await getPayload({ config: configPromise })
  const blog: any = await payload.findGlobal({ slug: 'blog', depth: 0 })
  const exito = blog?.avisoModeracion || 'Gracias. Tu comentario aparecerá cuando lo revisemos.'

  // Robots: campo invisible relleno, o enviado en menos de 3 segundos. Se responde "ok" para no dar pistas.
  const abierto = Number(f.abierto || 0)
  if (texto(f.sitioWeb, 200) || (abierto && Date.now() - abierto < 3000)) return responder(true, exito)

  if (blog?.permitirComentarios === false) return responder(false, 'Los comentarios están cerrados.', 403)

  const ip = (req.headers.get('x-forwarded-for') || 'local').split(',')[0].trim()
  const ahora = Date.now()
  const recientes = (intentos.get(ip) || []).filter((t) => ahora - t < VENTANA_MS)
  if (recientes.length >= LIMITE) return responder(false, 'Has enviado varios comentarios seguidos. Espera unos minutos.', 429)

  const datos = {
    slug: texto(f.articulo, 200),
    nombre: texto(f.nombre, 80),
    correo: texto(f.correo, 160).toLowerCase(),
    texto: texto(f.texto, 2000),
  }
  if (!datos.nombre) return responder(false, 'Escribe tu nombre.', 400)
  if (!CORREO_VALIDO.test(datos.correo)) return responder(false, 'Revisa tu correo: no se publica, pero lo necesitamos por si hay que responderte.', 400)
  if (datos.texto.length < 3) return responder(false, 'Escribe tu comentario.', 400)
  if ((datos.texto.match(/https?:\/\/|www\./gi) || []).length > 2) return responder(false, 'Quita algunos enlaces del comentario, por favor.', 400)
  if (f.acepto !== true && f.acepto !== 'on' && f.acepto !== 'true') return responder(false, 'Acepta la política de privacidad para comentar.', 400)

  const { docs } = await payload.find({
    collection: 'articulos',
    where: { and: [{ slug: { equals: datos.slug } }, { _status: { equals: 'published' } }] },
    limit: 1,
    depth: 0,
  })
  const articulo: any = docs[0]
  if (!articulo) return responder(false, 'No encontramos el artículo.', 404)
  if (articulo.comentariosCerrados) return responder(false, 'Los comentarios de este artículo están cerrados.', 403)

  recientes.push(ahora)
  intentos.set(ip, recientes)

  let guardado: any
  try {
    guardado = await payload.create({
      collection: 'comentarios',
      data: { articulo: articulo.id, nombre: datos.nombre, correo: datos.correo, texto: datos.texto, estado: 'pendiente' },
      context: { disableRevalidate: true },
    })
  } catch (e: any) {
    payload.logger.error(`No se pudo guardar el comentario: ${e?.message}`)
    return responder(false, 'No pudimos guardar tu comentario. Inténtalo en un momento.', 500)
  }

  if (blog?.avisarComentario !== false) {
    try {
      const [avisos, negocio]: any[] = await Promise.all([
        payload.findGlobal({ slug: 'avisos', depth: 0 }),
        payload.findGlobal({ slug: 'tienda', depth: 1 }),
      ])
      if (avisos?.correoAvisos && avisos?.remitente) {
        const base = (process.env.NEXT_PUBLIC_SERVER_URL || new URL(req.url).origin).replace(/\/$/, '')
        const r = await enviarCorreo({
          para: avisos.correoAvisos,
          remitente: avisos.remitente,
          tipo: 'aviso-comentario',
          responderA: datos.correo,
          asunto: `Nuevo comentario en "${articulo.title}"`,
          html: correoAvisoComentario(marcaCorreo(negocio, base), datos.nombre, datos.texto, articulo.title, `${base}/admin/collections/comentarios/${guardado.id}`),
        })
        if (!r.ok) payload.logger.warn(`Aviso de comentario no enviado: ${r.error}`)
      }
    } catch (e: any) {
      payload.logger.error(`Error avisando del comentario: ${e?.message}`)
    }
  }

  return responder(true, exito)
}
