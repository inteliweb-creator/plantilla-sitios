import type { PayloadRequest } from 'payload'

import { huellaLegal, type EstadoSitio } from './automaticos'

type Pantallas = { medicion?: any; modulos?: any; blog?: any; ventanas?: any }

/** Estado del sitio que describen los documentos legales, leyendo las pantallas que falten. */
export async function leerEstado(req: PayloadRequest, dadas: Pantallas = {}): Promise<EstadoSitio> {
  const leer = (slug: 'medicion' | 'modulos' | 'blog' | 'ventanas') =>
    slug in dadas ? Promise.resolve((dadas as any)[slug]) : req.payload.findGlobal({ slug, depth: 0, req }).catch(() => null)
  const [medicion, modulos, blog, ventanas] = await Promise.all([leer('medicion'), leer('modulos'), leer('blog'), leer('ventanas')])
  return { medicion, modulos, blog, ventanas }
}

/**
 * Cuando cambia algo que altera el texto automático de los documentos legales
 * (se conecta un píxel, se enciende el boletín o la tienda, se activan los
 * comentarios o una ventana), su fecha de "Última actualización" pasa a hoy.
 * Una política que cambia sin cambiar la fecha estaría mintiendo.
 */
export async function moverFechasLegales(req: PayloadRequest, antes: Pantallas, despues: Pantallas) {
  const resto: Pantallas = {}
  const [a, d] = await Promise.all([leerEstado(req, { ...resto, ...antes }), leerEstado(req, { ...resto, ...despues })])
  if (huellaLegal(a) === huellaLegal(d)) return
  const { docs } = await req.payload.find({ collection: 'legales', limit: 100, depth: 0, pagination: false, req })
  const ahora = new Date().toISOString()
  for (const doc of docs as any[]) {
    if (!JSON.stringify(doc.contenido || '').includes('{bloque:')) continue
    await req.payload.update({ collection: 'legales', id: doc.id, data: { fechaActualizacion: ahora }, depth: 0, req })
  }
}
