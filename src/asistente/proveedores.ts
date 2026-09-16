/**
 * Proveedores de inteligencia artificial compatibles. Todos se hablan con el
 * mismo formato (el de OpenAI, que DeepSeek y los demás copian), así que
 * cambiar de proveedor es cambiar la dirección, el modelo y la clave.
 */
export const PROVEEDORES = {
  deepseek: { nombre: 'DeepSeek', url: 'https://api.deepseek.com', modelo: 'deepseek-flash', otros: ['deepseek-v4-pro'] },
  gemini: { nombre: 'Google Gemini', url: 'https://generativelanguage.googleapis.com/v1beta/openai', modelo: 'gemini-3.8-flash', otros: ['gemini-3.5-flash-lite', 'gemini-2.5-pro'] },
  openai: { nombre: 'OpenAI', url: 'https://api.openai.com/v1', modelo: 'gpt-5.6-luna', otros: ['gpt-5.6-terra'] },
  anthropic: { nombre: 'Anthropic (Claude)', url: 'https://api.anthropic.com/v1', modelo: 'claude-sonnet-5', otros: ['claude-haiku-4-5'] },
  personalizado: { nombre: 'Otro compatible con OpenAI', url: '', modelo: '', otros: [] },
} as const

export type Proveedor = keyof typeof PROVEEDORES

/** Texto de ayuda con los modelos sugeridos de cada proveedor (vigentes en septiembre de 2026). */
export const AYUDA_MODELOS = Object.values(PROVEEDORES)
  .filter((p) => p.modelo)
  .map((p) => `${p.nombre}: ${[p.modelo, ...p.otros].join(', ')}`)
  .join(' · ')
