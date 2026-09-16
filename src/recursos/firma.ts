import crypto from 'crypto'

/** Firma del enlace de descarga de un recurso: nadie puede fabricar uno ni alargar su vencimiento. */
export function firmar(id: string | number, vence: number) {
  return crypto.createHmac('sha256', process.env.PAYLOAD_SECRET || '').update(`recurso|${id}|${vence}`).digest('hex').slice(0, 32)
}
