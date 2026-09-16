import type { ConfigModelo } from './modelo'
import { explicarError } from './modelo'
import { modelosDisponibles } from './modelos'

/**
 * Funciones que hoy solo ofrece Google Gemini con la misma clave:
 * búsqueda en Google en tiempo real, lectura de páginas, videos de YouTube e
 * imágenes. Usan la API de "interactions" de Gemini (la de OpenAI no las trae).
 */

export const esGemini = (config?: ConfigModelo | null) => Boolean(config && /generativelanguage\.googleapis\.com/.test(config.url))

const raiz = (config: ConfigModelo) => config.url.replace(/\/openai\/?$/, '')

type Resultado = { texto: string; fuentes: { titulo: string; url: string }[]; tokens: number }

/** Recorre la respuesta y junta el texto final y las fuentes citadas, sea cual sea la forma exacta. */
function leerRespuesta(json: any): Resultado {
  const textos: string[] = []
  const fuentes = new Map<string, string>()
  const visitar = (nodo: any, enSalida: boolean) => {
    if (!nodo || typeof nodo !== 'object') return
    if (Array.isArray(nodo)) return nodo.forEach((n) => visitar(n, enSalida))
    const salida = enSalida || nodo.type === 'model_output' || nodo.type === 'output_text'
    if (salida && nodo.type === 'text' && typeof nodo.text === 'string') textos.push(nodo.text)
    if (nodo.type === 'url_citation' && nodo.url) fuentes.set(nodo.url, nodo.title || nodo.url)
    if (nodo.web?.uri) fuentes.set(nodo.web.uri, nodo.web.title || nodo.web.uri)
    for (const [clave, valor] of Object.entries(nodo)) {
      if (clave === 'summary' || clave === 'signature' || clave === 'search_suggestions') continue
      visitar(valor, salida)
    }
  }
  if (json?.steps) visitar(json.steps, false)
  else if (json?.outputs) visitar(json.outputs, true)
  let texto = textos.join('\n').trim()
  if (!texto && typeof json?.output_text === 'string') texto = json.output_text
  if (!texto) {
    // Formato clásico (generateContent) por si la cuenta responde así.
    texto = (json?.candidates?.[0]?.content?.parts || []).map((p: any) => p?.text || '').join('\n').trim()
    for (const c of json?.candidates?.[0]?.groundingMetadata?.groundingChunks || []) if (c?.web?.uri) fuentes.set(c.web.uri, c.web.title || c.web.uri)
  }
  const u = json?.usage || json?.usageMetadata || {}
  const tokens = Number(u.total_tokens ?? u.totalTokens ?? u.totalTokenCount ?? 0)
  return { texto, fuentes: [...fuentes].map(([url, titulo]) => ({ url, titulo })), tokens }
}

async function interaccion(config: ConfigModelo, input: any, herramientas: any[] | undefined, timeoutMs: number): Promise<Resultado> {
  // Google a veces responde "alta demanda" (503) o "demasiadas peticiones" (429): se espera y se reintenta.
  for (let intento = 0; ; intento++) {
    try {
      return await interaccionUnaVez(config, input, herramientas, timeoutMs)
    } catch (e: any) {
      if (!e?.transitorio || intento >= 2) throw e
      await new Promise((r) => setTimeout(r, intento === 0 ? 3000 : 8000))
    }
  }
}

async function interaccionUnaVez(config: ConfigModelo, input: any, herramientas: any[] | undefined, timeoutMs: number): Promise<Resultado> {
  const res = await fetch(`${raiz(config)}/interactions`, {
    method: 'POST',
    headers: { 'x-goog-api-key': config.clave, 'Content-Type': 'application/json' },
    signal: AbortSignal.timeout(timeoutMs),
    body: JSON.stringify({ model: config.modelo, input, ...(herramientas ? { tools: herramientas } : {}), store: false }),
  }).catch((e) => {
    throw new Error(e?.name === 'TimeoutError' ? 'Google tardó demasiado en responder. Inténtalo de nuevo.' : 'No se pudo contactar a Google.')
  })
  const texto = await res.text()
  if (!res.ok) {
    const error: any = new Error(explicarError(config, res.status, texto))
    error.transitorio = [429, 500, 502, 503, 504].includes(res.status) && !/quota|billing|limit: 0/i.test(texto)
    throw error
  }
  let json: any = null
  try {
    json = JSON.parse(texto)
  } catch {}
  const r = leerRespuesta(json)
  if (!r.texto) throw new Error(`Google respondió sin texto (${texto.slice(0, 160).replaceAll(config.clave, '••••')}…)`)
  return r
}

/** Investiga en Google en tiempo real (y lee los enlaces que vengan en la pregunta). */
export function investigar(config: ConfigModelo, pregunta: string) {
  const instruccion = `Investiga en internet con información actual y responde en español de Colombia.
Pedido: ${pregunta}

Entrega: 1) respuesta clara y ordenada, 2) datos concretos con su fecha o vigencia, 3) qué dicen distintas fuentes si no coinciden, 4) ideas o ángulos útiles para un negocio que quiere escribir sobre esto. Distingue hechos de opiniones. No inventes nada que no encuentres.`
  return interaccion(config, instruccion, [{ type: 'google_search' }, { type: 'url_context' }], 150_000)
}

/** Analiza un video público de YouTube y devuelve notas detalladas para reutilizarlo. */
export function analizarVideo(config: ConfigModelo, url: string, enfoque?: string) {
  const instruccion = `Mira este video completo y prepara notas de trabajo en español para convertirlo en contenido propio.${enfoque ? ` Enfoque pedido: ${enfoque}.` : ''}
Entrega:
- Título y tema central (1 frase).
- A quién le sirve y qué problema resuelve.
- Ideas clave en orden, cada una con su explicación (lo más completo posible).
- Datos, cifras, pasos, herramientas y ejemplos mencionados, con el minuto aproximado.
- Frases textuales destacadas (máximo 5, cortas).
- Estructura del video y llamado a la acción que usa.
- Posibles búsquedas en Google relacionadas.
No inventes nada que no esté en el video.`
  return interaccion(config, [{ type: 'text', text: instruccion }, { type: 'video', uri: url }], undefined, 240_000)
}

/** Genera una imagen con el modelo de imágenes disponible en la cuenta. */
export async function generarImagen(config: ConfigModelo, prompt: string, modeloPreferido?: string | null) {
  let modelo = String(modeloPreferido || '').trim()
  if (!modelo) {
    const ids = await modelosDisponibles(config)
    const puntos = (id: string) => (/preview|exp/i.test(id) ? 0 : 100) + (/flash/i.test(id) ? 50 : 0) - (/lite/i.test(id) ? 10 : 0) + Number(id.match(/(\d+(?:\.\d+)?)/)?.[1] || 0)
    const deImagen = ids.filter((id) => /image/i.test(id) && !/imagen-|edit|embed|understanding/i.test(id)).sort((a, b) => puntos(b) - puntos(a))
    modelo = deImagen[0] || (esGemini(config) ? 'gemini-2.5-flash-image' : 'gpt-image-1')
  }
  const res = await fetch(`${config.url}/images/generations`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${config.clave}`, 'Content-Type': 'application/json' },
    signal: AbortSignal.timeout(180_000),
    body: JSON.stringify({ model: modelo, prompt, n: 1, response_format: 'b64_json' }),
  }).catch((e) => {
    throw new Error(e?.name === 'TimeoutError' ? 'La imagen tardó demasiado. Inténtalo de nuevo.' : 'No se pudo contactar al servicio de imágenes.')
  })
  const texto = await res.text()
  if (!res.ok) {
    const base = explicarError({ ...config, modelo }, res.status, texto)
    const gratis = res.status === 429 || /quota|free tier|billing|limit: 0/i.test(texto)
    throw new Error(gratis ? `${base} Crear imágenes suele requerir activar la facturación en Google AI Studio.` : base)
  }
  const json = JSON.parse(texto)
  const b64 = json?.data?.[0]?.b64_json
  if (!b64) throw new Error('El servicio no devolvió ninguna imagen.')
  return { datos: Buffer.from(b64, 'base64'), modelo }
}
