/**
 * Convierte un título en dirección web conservando las letras en español:
 * "Guía de diseño" → "guia-de-diseno". (El convertidor por defecto borraba las
 * letras con tilde o ñ: "gua-de-dise".)
 */
const MARCAS_DE_ACENTO = new RegExp('[\\u0300-\\u036f]', 'g')

export function aSlug(texto: unknown) {
  return String(texto ?? '')
    .normalize('NFD')
    .replace(MARCAS_DE_ACENTO, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 90)
    .replace(/-+$/g, '')
}

/** Para `slugField({ slugify })`. */
export const slugEnEspanol = ({ valueToSlugify }: { valueToSlugify?: unknown }) => aSlug(valueToSlugify) || undefined
