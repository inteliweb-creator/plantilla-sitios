import type { Block, CollectionConfig, Config, Field, GlobalConfig, Plugin } from 'payload'

/**
 * Traduce al español lo que la plantilla y los plugins (tienda, SEO,
 * formularios) dejan en inglés en el panel.
 *
 * Va como ÚLTIMO plugin: así ve también las colecciones y campos que añaden
 * los demás. En vez de tocar decenas de archivos de la plantilla, todo está
 * en estos diccionarios, y una actualización de la plantilla no lo deshace.
 *
 * - POR_TEXTO: etiquetas escritas en inglés ("Product Details").
 * - POR_NOMBRE: campos sin etiqueta, que Payload nombra a partir del nombre
 *   interno ("gallery" → "Gallery").
 *
 * En desarrollo se avisa por consola de cualquier campo sin etiqueta que no
 * esté en el diccionario, para completarlo.
 */

const POR_TEXTO: Record<string, string> = {
  // Pestañas y grupos
  Content: 'Contenido',
  'Product Details': 'Detalles del producto',
  'Intro Content': 'Texto de introducción',
  Ecommerce: 'Tienda',
  // Bloques de la plantilla
  Collection: 'Colección',
  'Individual Selection': 'Elegir uno por uno',
  'Collections To Show': 'Colecciones a mostrar',
  Products: 'Productos',
  'Categories To Show': 'Categorías a mostrar',
  Limit: 'Cantidad máxima',
  Selection: 'Selección',
  'Populated Docs': 'Documentos cargados',
  'Populated Docs Total': 'Total de documentos cargados',
  Info: 'Información',
  Warning: 'Advertencia',
  Error: 'Error',
  Success: 'Éxito',
  'One Third': 'Un tercio',
  Half: 'Mitad',
  'Two Thirds': 'Dos tercios',
  Full: 'Completo',
  Default: 'Normal',
  Outline: 'Con borde',
  'Internal link': 'Página del sitio',
  'Custom URL': 'Dirección externa',
  'Open in new tab': 'Abrir en otra pestaña',
  'Document to link to': 'Página a la que lleva',
  'Custom URL ': 'Dirección externa',
  Label: 'Texto',
  None: 'Ninguna',
  'High Impact': 'Impacto alto',
  'Medium Impact': 'Impacto medio',
  'Low Impact': 'Impacto bajo',
  Admin: 'Administrador',
  Customer: 'Cliente',
  admin: 'Administrador',
  customer: 'Cliente',
  Submit: 'Enviar',
  Emails: 'Correos',
  Email: 'Correo',
  Form: 'Formulario',
  'Submission Data': 'Datos enviados',
  'Access Token': 'Código de acceso',
  Subtotal: 'Subtotal',
  'Meta Image': 'Imagen para redes sociales',
  'Meta Title': 'Título para Google',
  Type: 'Tipo',
  'Meta Description': 'Descripción para Google',
}

const POR_NOMBRE: Record<string, string> = {
  slug: 'Dirección (slug)',
  slugLock: 'Bloquear dirección',
  title: 'Título',
  description: 'Descripción',
  image: 'Imagen',
  media: 'Imagen o video',
  gallery: 'Galería',
  layout: 'Secciones',
  columns: 'Columnas',
  categories: 'Categorías',
  relatedProducts: 'Productos relacionados',
  variantOption: 'Opción de variante',
  name: 'Nombre',
  roles: 'Roles',
  orders: 'Pedidos',
  cart: 'Carrito',
  addresses: 'Direcciones',
  type: 'Tipo',
  links: 'Botones',
  link: 'Enlace',
  richText: 'Texto',
  form: 'Formulario',
  submissionData: 'Datos enviados',
  field: 'Campo',
  value: 'Valor',
  emails: 'Correos',
  accessToken: 'Código de acceso',
  populateBy: 'Mostrar',
  relationTo: 'Colección',
  introContent: 'Texto de introducción',
  code: 'Código',
  language: 'Lenguaje',
  style: 'Estilo',
  content: 'Contenido',
  size: 'Ancho',
  enableLink: 'Agregar enlace',
  blockName: 'Nombre del bloque',
  appearance: 'Apariencia',
  newTab: 'Abrir en otra pestaña',
  url: 'Dirección',
  label: 'Texto',
  reference: 'Página',
  caption: 'Pie de foto',
  alt: 'Texto alternativo',
  position: 'Posición',
  items: 'Artículos',
  product: 'Producto',
  variant: 'Variante',
  quantity: 'Cantidad',
  customer: 'Cliente',
  subtotal: 'Subtotal',
  amount: 'Monto',
  currency: 'Moneda',
  status: 'Estado',
  order: 'Pedido',
  options: 'Opciones',
  variantType: 'Tipo de variante',
  message: 'Mensaje',
  confirmationType: 'Tipo de confirmación',
  redirect: 'Redirigir',
  submitButtonLabel: 'Texto del botón',
  hero: 'Portada',
  meta: 'SEO',
  preview: 'Vista previa',
  overview: 'Resumen',
  docs: 'Documentos',
  selectedDocs: 'Elegidos',
  limit: 'Cantidad máxima',
  cc: 'Con copia (CC)',
  bcc: 'Con copia oculta (BCC)',
  replyTo: 'Responder a',
  emailFrom: 'Enviado desde',
  emailTo: 'Enviar a',
  subject: 'Asunto',
}

/** Singular y plural de las listas sin nombre propio ("Añadir Gallery"). */
const LISTAS: Record<string, [string, string]> = {
  gallery: ['Imagen', 'Galería'],
  layout: ['Sección', 'Secciones'],
  columns: ['Columna', 'Columnas'],
  links: ['Botón', 'Botones'],
  emails: ['Correo', 'Correos'],
  submissionData: ['Dato', 'Datos enviados'],
  items: ['Artículo', 'Artículos'],
  navItems: ['Enlace', 'Enlaces'],
}

const BLOQUES: Record<string, [string, string]> = {
  mediaBlock: ['Imagen o video', 'Imágenes o videos'],
  cta: ['Llamada a la acción', 'Llamadas a la acción'],
  content: ['Texto en columnas', 'Textos en columnas'],
  archive: ['Listado', 'Listados'],
  banner: ['Aviso', 'Avisos'],
  carousel: ['Carrusel de productos', 'Carruseles de productos'],
  code: ['Código', 'Códigos'],
  formBlock: ['Formulario a medida', 'Formularios a medida'],
  threeItemGrid: ['Tres productos destacados', 'Tres productos destacados'],
}

const COLECCIONES: Record<string, { labels?: [string, string]; group?: string }> = {
  products: { labels: ['Producto', 'Productos'], group: 'Tienda' },
  variants: { labels: ['Variante', 'Variantes'], group: 'Tienda' },
  variantTypes: { labels: ['Tipo de variante', 'Tipos de variante'], group: 'Tienda' },
  variantOptions: { labels: ['Opción de variante', 'Opciones de variante'], group: 'Tienda' },
  carts: { labels: ['Carrito', 'Carritos'], group: 'Tienda' },
  orders: { labels: ['Pedido', 'Pedidos'], group: 'Tienda' },
  transactions: { labels: ['Transacción', 'Transacciones'], group: 'Tienda' },
  addresses: { labels: ['Dirección', 'Direcciones'], group: 'Tienda' },
  users: { labels: ['Usuario', 'Usuarios'] },
}

const faltantes = new Set<string>()
const vistos = new WeakSet<object>()

const texto = (v: unknown) => (typeof v === 'string' && POR_TEXTO[v] ? POR_TEXTO[v] : v)

function traducirCampos(campos: Field[] = [], donde: string) {
  for (const f of campos as any[]) {
    if (!f || vistos.has(f)) continue
    vistos.add(f)

    if ('name' in f && f.name) {
      if (typeof f.label === 'string') f.label = texto(f.label)
      else if (f.label === undefined && f.type !== 'ui') {
        if (POR_NOMBRE[f.name]) f.label = POR_NOMBRE[f.name]
        else if (!f.admin?.hidden && !f.hidden && f.name !== 'id') faltantes.add(`${donde}.${f.name}`)
      }
    } else if (typeof f.label === 'string') {
      f.label = texto(f.label)
    }

    if (Array.isArray(f.options)) {
      f.options = f.options.map((o: any) =>
        typeof o === 'string'
          ? { label: POR_TEXTO[o] ?? o, value: o }
          : { ...o, label: typeof o.label === 'string' ? texto(o.label) : o.label },
      )
    }

    if ((f.type === 'array' || f.type === 'blocks') && !f.labels && LISTAS[f.name]) {
      f.labels = { singular: LISTAS[f.name][0], plural: LISTAS[f.name][1] }
    }

    if (Array.isArray(f.fields)) traducirCampos(f.fields, `${donde}.${f.name ?? f.type}`)
    if (Array.isArray(f.tabs)) {
      for (const t of f.tabs) {
        if (typeof t.label === 'string') t.label = texto(t.label)
        else if (t.label === undefined && t.name && POR_NOMBRE[t.name]) t.label = POR_NOMBRE[t.name]
        traducirCampos(t.fields, `${donde}.${t.name ?? 'tab'}`)
      }
    }
    if (Array.isArray(f.blocks)) f.blocks.forEach((b: Block) => traducirBloque(b))
  }
}

function traducirBloque(b: Block) {
  if (!b || vistos.has(b)) return
  vistos.add(b)
  if (BLOQUES[b.slug]) b.labels = { singular: BLOQUES[b.slug][0], plural: BLOQUES[b.slug][1] }
  traducirCampos(b.fields, `bloque:${b.slug}`)
}

export const traduccionesPanel: Plugin = (config: Config): Config => {
  for (const c of (config.collections || []) as CollectionConfig[]) {
    const t = COLECCIONES[c.slug]
    if (t?.labels && (!c.labels || typeof c.labels.plural !== 'string' || /^[A-Z][a-z]+s?$/.test(String(c.labels.plural)))) {
      c.labels = { singular: t.labels[0], plural: t.labels[1] }
    }
    // group === false significa "oculta del menú": se respeta.
    if (t?.group && c.admin?.group !== false) c.admin = { ...c.admin, group: t.group }
    else if (typeof c.admin?.group === 'string') c.admin.group = texto(c.admin.group) as string
    traducirCampos(c.fields, c.slug)
  }
  for (const g of (config.globals || []) as GlobalConfig[]) traducirCampos(g.fields, `global:${g.slug}`)
  ;(config.blocks || []).forEach((b) => traducirBloque(b))

  if (faltantes.size && process.env.NODE_ENV !== 'production') {
    console.warn(`[traducciones] Campos sin traducir: ${[...faltantes].join(', ')}`)
  }
  return config
}
