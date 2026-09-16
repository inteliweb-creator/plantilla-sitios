import type { Payload } from 'payload'

import { descifrar } from './cifrado'
import { PROVEEDORES, type Proveedor } from './proveedores'

export type MensajeModelo =
  | { role: 'system' | 'user'; content: string }
  | { role: 'assistant'; content: string | null; tool_calls?: LlamadaHerramienta[] }
  | { role: 'tool'; tool_call_id: string; content: string }

export type LlamadaHerramienta = { id: string; type: 'function'; function: { name: string; arguments: string } }

export type ConfigModelo = { url: string; modelo: string; clave: string; proveedor: Proveedor; nombreProveedor: string; id?: string }

/** Arma una conexión usable a partir de una fila guardada (o devuelve por qué no sirve). */
export function conexionDeFila(fila: any): { config?: ConfigModelo; error?: string } {
  const proveedor = (fila?.proveedor || 'deepseek') as Proveedor
  const base = PROVEEDORES[proveedor] || PROVEEDORES.deepseek
  const url = String((proveedor === 'personalizado' ? fila?.urlBase : base.url) || '').trim().replace(/\/$/, '')
  const modelo = String(fila?.modelo || base.modelo || '').trim()
  const clave = descifrar(fila?.claveCifrada)
  if (!clave) return { error: `${base.nombre}: falta la clave` }
  if (!url || !modelo) return { error: `${base.nombre}: faltan la dirección o el modelo` }
  return { config: { url, modelo, clave, proveedor, nombreProveedor: base.nombre, id: fila?.id ? String(fila.id) : undefined } }
}

/** Lee "Asistente IA": las conexiones encendidas, en orden, con sus claves descifradas. */
export async function leerConexiones(payload: Payload): Promise<{ conexiones: ConfigModelo[]; ajustes: any; error?: string }> {
  const ajustes: any = await payload.findGlobal({ slug: 'asistente', depth: 0, overrideAccess: true, showHiddenFields: true })
  const filas = (ajustes?.conexiones || []).filter((f: any) => f?.activa !== false)
  const conexiones = filas.map((f: any) => conexionDeFila(f).config).filter(Boolean) as ConfigModelo[]
  if (!conexiones.length) {
    return { ajustes, conexiones, error: 'Falta al menos una conexión con su clave. Agrégala en Configuración → Asistente IA.' }
  }
  return { ajustes, conexiones }
}

/** Anota en la conexión el último problema (se ve en el panel) o lo limpia. */
export async function anotarConexion(payload: Payload, id: string | undefined, datos: { ultimoError?: string | null; modelo?: string }) {
  if (!id) return
  const ajustes: any = await payload.findGlobal({ slug: 'asistente', depth: 0, overrideAccess: true, showHiddenFields: true }).catch(() => null)
  const filas = ajustes?.conexiones || []
  if (!filas.some((f: any) => String(f.id) === id)) return
  const conexiones = filas.map((f: any) => (String(f.id) === id ? { ...f, ...datos } : f))
  await payload
    .updateGlobal({ slug: 'asistente', data: { conexiones } as any, overrideAccess: true, context: { disableRevalidate: true, soloConsumo: true } })
    .catch(() => null)
}

const esperar = (ms: number) => new Promise((r) => setTimeout(r, ms))

/** Convierte la respuesta de error del proveedor en una frase que se entienda. Nunca incluye la clave. */
export function explicarError(config: ConfigModelo, estado: number, texto: string) {
  let detalle = texto.slice(0, 300)
  try {
    const json = JSON.parse(texto)
    const error = Array.isArray(json) ? json[0]?.error : json?.error
    detalle = String(error?.message || detalle)
  } catch {}
  const d = detalle.toLowerCase()
  const motivo =
    estado === 401 || estado === 403 || /api key|api_key|authorization|unauthorized|invalid.*key/.test(d)
      ? 'la clave no es válida. Cópiala de nuevo completa, sin espacios, desde la página del proveedor.'
      : estado === 404 || /not found|does not exist|model_not_found|unknown model/.test(d)
        ? `el modelo "${config.modelo}" no existe o ya fue retirado. Deja el campo Modelo vacío para usar el recomendado.`
        : estado === 402 || /insufficient|balance|billing|quota/.test(d)
          ? 'la cuenta no tiene saldo o se acabó la cuota gratuita.'
          : estado === 429
            ? 'demasiadas peticiones seguidas o se acabó la cuota gratuita de hoy. Espera un momento.'
            : estado === 503 || estado === 529 || /overloaded|high demand|unavailable/.test(d)
              ? 'el servicio está saturado en este momento (no es tu clave). Suele pasar en minutos.'
              : estado >= 500
                ? 'el servicio tuvo una falla temporal.'
                : detalle
  return `${config.nombreProveedor} respondió ${estado}: ${motivo}`.replaceAll(config.clave, '••••')
}

/** Una llamada al modelo con herramientas. Nunca deja escapar la clave en los errores. */
export async function llamarModelo(
  config: ConfigModelo,
  mensajes: MensajeModelo[],
  herramientas?: any[],
  opciones: { maxTokens?: number; temperatura?: number; timeoutMs?: number } = {},
): Promise<{ mensaje: { content: string | null; tool_calls?: LlamadaHerramienta[] }; tokens: number }> {
  const control = new AbortController()
  const reloj = setTimeout(() => control.abort(), opciones.timeoutMs ?? 120_000)
  try {
    const res = await fetch(`${config.url}/chat/completions`, {
      method: 'POST',
      signal: control.signal,
      headers: { Authorization: `Bearer ${config.clave}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: config.modelo,
        messages: mensajes,
        ...(herramientas?.length ? { tools: herramientas, tool_choice: 'auto' } : {}),
        temperature: opciones.temperatura ?? 0.4,
        max_tokens: opciones.maxTokens ?? 4000,
      }),
    })
    const texto = await res.text()
    if (!res.ok) {
      const error: any = new Error(explicarError(config, res.status, texto))
      error.estado = res.status
      error.sinModelo = res.status === 404 || /model.*(not found|does not exist|not supported)|model_not_found|unknown model/i.test(texto)
      error.cuota = res.status === 402 || /insufficient|balance|billing|quota|exceeded your current/i.test(texto)
      error.transitorio = !error.cuota && [408, 425, 429, 500, 502, 503, 504, 529].includes(res.status)
      throw error
    }
    const json = JSON.parse(texto)
    const tokens = Number(json?.usage?.total_tokens || 0)
    return { mensaje: json?.choices?.[0]?.message || { content: '' }, tokens }
  } catch (e: any) {
    if (e?.name === 'AbortError') {
      const error: any = new Error(`${config.nombreProveedor} tardó demasiado en responder.`)
      error.transitorio = true
      throw error
    }
    if (e instanceof TypeError) {
      const error: any = new Error(`No se pudo contactar a ${config.nombreProveedor}.`)
      error.transitorio = true
      throw error
    }
    throw e
  } finally {
    clearTimeout(reloj)
  }
}

/** Suma el consumo del mes y dice si ya se pasó del límite. */
export async function registrarConsumo(payload: Payload, ajustes: any, tokens: number) {
  const mes = new Date().toLocaleDateString('en-CA', { timeZone: 'America/Bogota' }).slice(0, 7)
  const previo = ajustes?.usoMes === mes ? Number(ajustes?.tokensMes || 0) : 0
  await payload.updateGlobal({
    slug: 'asistente',
    data: { usoMes: mes, tokensMes: previo + tokens } as any,
    overrideAccess: true,
    context: { disableRevalidate: true, soloConsumo: true },
  })
}

export function limiteSuperado(ajustes: any) {
  const mes = new Date().toLocaleDateString('en-CA', { timeZone: 'America/Bogota' }).slice(0, 7)
  const limite = Number(ajustes?.limiteTokensMes || 0)
  const usado = ajustes?.usoMes === mes ? Number(ajustes?.tokensMes || 0) : 0
  return limite > 0 && usado >= limite
}

/**
 * Llama al modelo y, si el error es pasajero (saturación, caída momentánea,
 * demasiadas peticiones), espera y reintenta antes de rendirse.
 */
export async function llamarConReintentos(
  config: ConfigModelo,
  mensajes: MensajeModelo[],
  herramientas?: any[],
  opciones: { maxTokens?: number; temperatura?: number; timeoutMs?: number } = {},
  esperas = [2000, 6000],
) {
  for (let intento = 0; ; intento++) {
    try {
      return await llamarModelo(config, mensajes, herramientas, opciones)
    } catch (e: any) {
      if (!e?.transitorio || intento >= esperas.length) throw e
      await esperar(esperas[intento])
    }
  }
}

