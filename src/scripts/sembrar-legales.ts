import type { Payload } from 'payload'
import { convertMarkdownToLexical, editorConfigFactory } from '@payloadcms/richtext-lexical'

import * as textos from './legales/textos'

/**
 * Carga los documentos legales de ejemplo (privacidad, cookies y términos).
 * Conservan los marcadores {empresa}, {correo}…: se llenan con los datos del
 * negocio. Si el documento ya existe (misma dirección) se actualiza.
 * Revísalos con el cliente: son un punto de partida, no asesoría legal.
 */
const DOCUMENTOS = [
  { slug: 'privacidad', etiqueta: 'Privacidad y datos', orden: 1 },
  { slug: 'cookies', etiqueta: 'Cookies', orden: 2 },
  { slug: 'terminos', etiqueta: 'Términos', orden: 3 },
]

function leer(md: string) {
  const m = md.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/)
  const datos: Record<string, string> = {}
  for (const linea of (m?.[1] || '').split(/\r?\n/)) {
    const par = linea.match(/^(\w+):\s*(.*)$/)
    if (par) datos[par[1]] = par[2].trim().replace(/^'(.*)'$|^"(.*)"$/, '$1$2').replace(/''/g, "'")
  }
  return { datos, cuerpo: m ? m[2] : md }
}

export async function sembrarLegales(payload: Payload) {
  const editorConfig = await editorConfigFactory.default({ config: payload.config })
  let n = 0
  for (const d of DOCUMENTOS) {
    const { datos, cuerpo } = leer((textos as Record<string, string>)[d.slug] || '')
    if (!cuerpo.trim()) continue
    const data: any = {
      titulo: datos.heading || datos.title,
      descripcion: (datos.description || '').slice(0, 160),
      contenido: convertMarkdownToLexical({ editorConfig, markdown: cuerpo }),
      slug: d.slug,
      etiqueta: d.etiqueta,
      orden: d.orden,
      fechaActualizacion: datos.updated ? new Date(`${datos.updated}T12:00:00Z`).toISOString() : undefined,
    }
    const existe = await payload.find({ collection: 'legales', where: { slug: { equals: d.slug } }, limit: 1, depth: 0 })
    if (existe.docs[0]) await payload.update({ collection: 'legales', id: existe.docs[0].id, data, context: { disableRevalidate: true } })
    else await payload.create({ collection: 'legales', data, context: { disableRevalidate: true } })
    n++
  }
  payload.logger.info(`✓ ${n} documentos legales`)
  return { legales: n }
}
