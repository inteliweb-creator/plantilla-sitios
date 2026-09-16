import type { Payload } from 'payload'

import { PROVEEDORES, type Proveedor } from './proveedores'
import { conversar, type Accion } from './agente'

/**
 * Conversaciones guardadas del asistente. El pedido se guarda al instante y
 * el trabajo sigue en el servidor; la burbuja consulta hasta que llega la
 * respuesta. Así no se pierde nada al cambiar de pantalla.
 */

export type MensajeGuardado = { role: 'user' | 'assistant'; content: string; acciones?: Accion[]; error?: boolean; via?: string; respaldo?: boolean; fecha: string }

const MAX_MENSAJES = 100
const MINUTOS_MAXIMOS = 6
const COLECCION = 'conversacionesAsistente' as const

const opciones = { overrideAccess: true, depth: 0, context: { disableRevalidate: true } } as const

/** Si un trabajo lleva demasiado tiempo (el servidor se cortó), se cierra con un aviso. */
async function sinTrabajoColgado(payload: Payload, doc: any) {
  if (doc?.estado !== 'trabajando' || !doc.trabajandoDesde) return doc
  if (Date.now() - new Date(doc.trabajandoDesde).getTime() < MINUTOS_MAXIMOS * 60_000) return doc
  const mensajes = [...(doc.mensajes || []), { role: 'assistant', content: 'Esta tarea se interrumpió antes de terminar. Pídemela de nuevo, por favor.', error: true, fecha: new Date().toISOString() }]
  return payload.update({ collection: COLECCION, id: doc.id, data: { mensajes, estado: 'lista', progreso: null } as any, ...opciones })
}

export async function leerConversacion(payload: Payload, usuario: any, id: number | string) {
  const doc: any = await payload.findByID({ collection: COLECCION, id, ...opciones }).catch(() => null)
  if (!doc || String(doc.usuario) !== String(usuario.id)) return null
  return sinTrabajoColgado(payload, doc)
}

export async function borrarConversacion(payload: Payload, usuario: any, id: number | string) {
  const doc = await leerConversacion(payload, usuario, id)
  if (!doc) return false
  await payload.delete({ collection: COLECCION, id, ...opciones })
  return true
}

/** Lo que la burbuja necesita al abrirse: nombre, si está lista, propuestas pendientes e historial. */
export async function estadoAsistente(payload: Payload, usuario: any) {
  const [ajustes, pendientes, conversaciones]: any[] = await Promise.all([
    payload.findGlobal({ slug: 'asistente', depth: 0, overrideAccess: true, showHiddenFields: true }).catch(() => null),
    payload.find({
      collection: 'registroAsistente',
      where: { and: [{ estado: { equals: 'propuesta' } }, { createdAt: { greater_than: new Date(Date.now() - 24 * 3600_000).toISOString() } }] },
      sort: '-createdAt',
      limit: 20,
      ...opciones,
    }),
    payload.find({
      collection: COLECCION,
      where: { usuario: { equals: usuario.id } },
      sort: '-updatedAt',
      limit: 30,
      select: { titulo: true, estado: true, updatedAt: true },
      ...opciones,
    } as any),
  ])
  const conectadas = (ajustes?.conexiones || []).filter((f: any) => f?.activa !== false && f?.claveCifrada)
  const negocio: any = await payload.findGlobal({ slug: 'tienda', depth: 0 }).catch(() => null)
  const principal = conectadas[0]
  const nombreDe = (f: any) => PROVEEDORES[(f?.proveedor || 'deepseek') as Proveedor]?.nombre || 'Proveedor'
  const listo = Boolean(ajustes?.activo && principal)
  return {
    nombre: ajustes?.nombre || 'Asistente',
    activo: Boolean(ajustes?.activo),
    listo,
    // Los colores de la marca del sitio (si están definidos) visten la burbuja.
    colores: { acento: negocio?.colorAcento || null, oscuro: negocio?.colorOscuro || null },
    aviso: !principal ? 'Falta agregar una conexión con su clave.' : !ajustes?.activo ? 'El asistente está apagado.' : null,
    proveedor: principal ? `${nombreDe(principal)}${conectadas.length > 1 ? ` (+${conectadas.length - 1} de respaldo)` : ''}` : '',
    pendientes: pendientes.docs.map((d: any) => ({ id: d.id, detalle: d.detalle })),
    conversaciones: conversaciones.docs.map((d: any) => ({ id: d.id, titulo: d.titulo, estado: d.estado, fecha: d.updatedAt })),
  }
}

/**
 * Guarda el pedido y devuelve la conversación con estado "trabajando".
 * `trabajo` es la función que hay que dejar corriendo (con `after`).
 */
export async function recibirPedido(payload: Payload, usuario: any, texto: string, conversacionId?: number | string | null) {
  const limpio = String(texto || '').trim().slice(0, 8000)
  if (!limpio) return { error: 'Escribe o dicta tu pedido.' }

  let doc: any = conversacionId ? await leerConversacion(payload, usuario, conversacionId) : null
  if (conversacionId && !doc) return { error: 'Esa conversación ya no existe.' }
  if (doc?.estado === 'trabajando') return { error: 'Todavía estoy trabajando en lo anterior. Espera a que termine.' }

  const ahora = new Date().toISOString()
  const mensajes: MensajeGuardado[] = [...(doc?.mensajes || []), { role: 'user', content: limpio, fecha: ahora }].slice(-MAX_MENSAJES)
  const datos = { mensajes, estado: 'trabajando', progreso: 'Pensando…', trabajandoDesde: ahora } as any
  doc = doc
    ? await payload.update({ collection: COLECCION, id: doc.id, data: datos, ...opciones })
    : await payload.create({ collection: COLECCION, data: { ...datos, usuario: usuario.id, titulo: limpio.replace(/\s+/g, ' ').slice(0, 70) }, ...opciones })

  const id = doc.id
  const trabajo = async () => {
    const avanzar = (progreso: string) => payload.update({ collection: COLECCION, id, data: { progreso } as any, ...opciones })
    let resultado: any
    try {
      resultado = await conversar(payload, usuario, mensajes.map(({ role, content }) => ({ role, content })), avanzar)
    } catch (e: any) {
      resultado = { error: e?.message || 'Algo falló.' }
    }
    const actual: any = await payload.findByID({ collection: COLECCION, id, ...opciones }).catch(() => null)
    if (!actual) return
    const respuesta: MensajeGuardado = resultado.error
      ? { role: 'assistant', content: resultado.error, acciones: resultado.acciones, error: true, fecha: new Date().toISOString() }
      : { role: 'assistant', content: resultado.respuesta, acciones: resultado.acciones, via: resultado.via, respaldo: Boolean(resultado.respaldo?.length), fecha: new Date().toISOString() }
    await payload.update({
      collection: COLECCION,
      id,
      data: { mensajes: [...(actual.mensajes || []), respuesta].slice(-MAX_MENSAJES), estado: 'lista', progreso: null } as any,
      ...opciones,
    })
  }
  return { conversacion: doc, trabajo }
}
