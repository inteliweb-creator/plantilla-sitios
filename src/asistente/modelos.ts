import type { ConfigModelo } from './modelo'

/**
 * Pregunta al proveedor qué modelos puede usar esta clave (formato OpenAI:
 * GET /models). Sirve cuando el modelo recomendado no está disponible para
 * la cuenta: cada proveedor retira y renombra modelos con frecuencia.
 */
export async function modelosDisponibles(config: Pick<ConfigModelo, 'url' | 'clave'>): Promise<string[]> {
  try {
    const res = await fetch(`${config.url}/models`, { headers: { Authorization: `Bearer ${config.clave}` }, signal: AbortSignal.timeout(20_000) })
    if (!res.ok) return []
    const json = await res.json()
    const lista = Array.isArray(json?.data) ? json.data : Array.isArray(json?.models) ? json.models : []
    return lista.map((m: any) => String(m?.id || m?.name || '').replace(/^models\//, '')).filter(Boolean)
  } catch {
    return []
  }
}

// Modelos que no sirven para conversar con herramientas.
const NO_CONVERSAN = /embed|image|imagen|tts|audio|speech|live|transcri|veo|video|aqa|robotics|computer-use|vision-exp|moderation|dall-e|whisper|search|realtime|native|thinking-exp|learnlm|gemma/i

/** Ordena los candidatos: primero los estables, "flash"/"chat" antes que "pro", y la versión más nueva primero. */
export function candidatos(ids: string[], preferido?: string) {
  const version = (id: string) => {
    const m = id.match(/(\d+(?:\.\d+)?)/)
    return m ? Number(m[1]) : 0
  }
  const puntos = (id: string) =>
    (/preview|exp|beta|alpha/i.test(id) ? 0 : 1000) +
    (/flash|chat|luna|mini|haiku|sonnet/i.test(id) ? 500 : 0) -
    (/lite|nano/i.test(id) ? 100 : 0) +
    version(id) * 10
  const utiles = [...new Set(ids)].filter((id) => !NO_CONVERSAN.test(id))
  const orden = utiles.sort((a, b) => puntos(b) - puntos(a))
  return preferido && orden.includes(preferido) ? [preferido, ...orden.filter((x) => x !== preferido)] : orden
}
