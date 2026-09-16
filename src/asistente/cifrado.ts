import crypto from 'crypto'

/**
 * Cifra la clave del servicio de inteligencia artificial antes de guardarla
 * en la base de datos (AES-256-GCM, con una llave derivada de PAYLOAD_SECRET).
 * Si alguien copiara la base de datos, no podría leer la clave.
 * Si PAYLOAD_SECRET cambia, la clave guardada deja de servir y hay que volver a pegarla.
 */
const llave = () => crypto.createHash('sha256').update(`asistente|${process.env.PAYLOAD_SECRET || ''}`).digest()

export function cifrar(texto: string) {
  const iv = crypto.randomBytes(12)
  const c = crypto.createCipheriv('aes-256-gcm', llave(), iv)
  const datos = Buffer.concat([c.update(texto, 'utf8'), c.final()])
  return `v1:${iv.toString('base64')}:${c.getAuthTag().toString('base64')}:${datos.toString('base64')}`
}

export function descifrar(guardado?: string | null): string | null {
  if (!guardado || !guardado.startsWith('v1:')) return null
  try {
    const [, iv, tag, datos] = guardado.split(':')
    if (!iv || !tag || !datos) return null
    const d = crypto.createDecipheriv('aes-256-gcm', llave(), Buffer.from(iv, 'base64'))
    d.setAuthTag(Buffer.from(tag, 'base64'))
    return Buffer.concat([d.update(Buffer.from(datos, 'base64')), d.final()]).toString('utf8')
  } catch {
    return null
  }
}
