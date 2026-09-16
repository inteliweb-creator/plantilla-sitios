/**
 * Dirección de la versión optimizada de una imagen de la biblioteca.
 * Si la imagen se subió antes de existir ese tamaño (o es más pequeña), usa el original.
 */
export type TamanoImagen = 'miniatura' | 'mediana' | 'grande' | 'redes'

export function imagenDe(media: unknown, tamano?: TamanoImagen): string | null {
  if (!media || typeof media !== 'object') return null
  const m = media as { url?: string | null; sizes?: Record<string, { url?: string | null } | undefined> }
  return (tamano && m.sizes?.[tamano]?.url) || m.url || null
}
