import type { Config, Field, Plugin } from 'payload'

/**
 * Pone el botón "✨ Completar con el asistente" debajo de los campos de texto donde
 * tiene sentido pedir ayuda para redactar (títulos, descripciones, textos
 * alternativos de imágenes, llamados a la acción…).
 *
 * No se pone en datos que no se deben inventar (direcciones, correos,
 * teléfonos, códigos, claves) ni en pantallas técnicas.
 */

const BOTON = '@/asistente/admin/BotonCompletar#BotonCompletar'

// Dónde sí: colección o pantalla → "todos" o solo los campos dentro de un grupo concreto.
const COLECCIONES: Record<string, 'todos' | string> = {
  articulos: 'todos',
  media: 'todos',
  boletines: 'todos',
  recursos: 'todos',
  casos: 'todos',
  preguntas: 'todos',
  comentarios: 'todos',
  categories: 'todos',
  products: 'todos',
  pages: 'meta',
}
const PANTALLAS: Record<string, 'todos' | string> = {
  blog: 'todos',
  ventanas: 'todos',
  tiendaTextos: 'todos',
}

const NOMBRES_EXCLUIDOS = /^(slug|id|whatsapp|telefono|correo|email|autor|nombre)$|url|enlace|href|codigo|^clave|password|token|pixel|ga4|gtm|clarity|remitente|dominio|latitud|longitud|postal|ruta|icono|color|placeholder|filename|mime|prefijo|sku|precio|price|horario|direccion|ciudad|departamento/i

function marcar(campos: Field[] | undefined, modo: 'todos' | string, dentroDelGrupo = false) {
  for (const campo of campos || []) {
    const c: any = campo
    const permitido = modo === 'todos' || dentroDelGrupo
    if ((c.type === 'text' || c.type === 'textarea') && permitido && c.name && !c.hasMany && !c.virtual && !c.hidden) {
      if (c.admin?.readOnly || c.admin?.hidden || c.admin?.disabled || NOMBRES_EXCLUIDOS.test(c.name)) continue
      if (c.admin?.components?.Field) continue // los campos con componente propio ya traen su interfaz
      const actual = c.admin?.components?.afterInput
      const lista = Array.isArray(actual) ? actual : actual ? [actual] : []
      c.admin = { ...c.admin, components: { ...c.admin?.components, afterInput: [...lista, BOTON] } }
      continue
    }
    const entra = dentroDelGrupo || (modo !== 'todos' && c.name === modo)
    if (Array.isArray(c.fields)) marcar(c.fields, modo, entra)
    if (Array.isArray(c.tabs)) for (const t of c.tabs) marcar(t.fields, modo, entra || (modo !== 'todos' && t.name === modo))
    if (Array.isArray(c.blocks)) for (const b of c.blocks) if (typeof b === 'object') marcar(b.fields, modo, entra)
  }
}

export const completarConIA: Plugin = (config: Config): Config => {
  for (const c of config.collections || []) if (COLECCIONES[c.slug]) marcar(c.fields, COLECCIONES[c.slug])
  for (const g of config.globals || []) if (PANTALLAS[g.slug]) marcar(g.fields, PANTALLAS[g.slug])
  return config
}
