/**
 * Párrafos automáticos de los documentos legales.
 *
 * Un párrafo que solo contiene {bloque:nombre} se reemplaza por texto que
 * describe lo que el sitio usa DE VERDAD en este momento: qué herramientas de
 * medición están conectadas en "Analítica y píxeles", si el boletín o la
 * tienda están encendidos, qué se guarda en el navegador. Así las políticas no
 * pueden quedar diciendo algo falso cuando el cliente conecta un píxel.
 */

export type EstadoSitio = {
  medicion: {
    ga4?: string | null
    gtm?: string | null
    metaPixel?: string | null
    tiktokPixel?: string | null
    clarity?: string | null
    pedirConsentimiento?: boolean | null
    codigoCabecera?: string | null
    codigoFinal?: string | null
  } | null
  modulos: { blog?: boolean; boletin?: boolean; tienda?: boolean; recursos?: boolean } | null
  blog?: { permitirComentarios?: boolean | null } | null
  ventanas?: { salidaActiva?: boolean | null; burbujaActiva?: boolean | null } | null
}

const hayComentarios = (e: EstadoSitio) => e.modulos?.blog !== false && e.blog?.permitirComentarios !== false
const hayRecursos = (e: EstadoSitio) => e.modulos?.recursos !== false
const hayVentanas = (e: EstadoSitio) => Boolean(e.ventanas?.salidaActiva || e.ventanas?.burbujaActiva)

export const BLOQUES = ['datos', 'medicion', 'medicion-detalle', 'boletin', 'proveedores', 'navegador'] as const

// ---------- Nodos de Lexical
type Trozo = string | { b: string } | { enlace: string; texto: string }

const texto = (t: string, negrita = false) => ({ type: 'text', text: t, format: negrita ? 1 : 0, detail: 0, mode: 'normal', style: '', version: 1 })
const trozos = (partes: Trozo[]) =>
  partes.map((p) =>
    typeof p === 'string'
      ? texto(p)
      : 'b' in p
        ? texto(p.b, true)
        : { type: 'link', version: 3, direction: 'ltr', format: '', indent: 0, fields: { url: p.enlace, newTab: false, linkType: 'custom' }, children: [texto(p.texto)] },
  )
const parrafo = (...partes: Trozo[]) => ({ type: 'paragraph', version: 1, direction: 'ltr', format: '', indent: 0, textFormat: 0, children: trozos(partes) })
const lista = (items: Trozo[][]) => ({
  type: 'list',
  listType: 'bullet',
  tag: 'ul',
  start: 1,
  version: 1,
  direction: 'ltr',
  format: '',
  indent: 0,
  children: items.map((partes, i) => ({ type: 'listitem', value: i + 1, version: 1, direction: 'ltr', format: '', indent: 0, children: trozos(partes) })),
})

// ---------- Herramientas conectadas
type Herramienta = { nombre: string; empresa: string; para: string; cookies: string }

export function herramientasActivas(m: EstadoSitio['medicion']): Herramienta[] {
  if (!m) return []
  const h: Herramienta[] = []
  const hay = (v?: string | null) => Boolean(v && v.trim())
  if (hay(m.ga4)) h.push({ nombre: 'Google Analytics', empresa: 'Google LLC', para: 'contar las visitas y entender cómo se usa el sitio', cookies: '_ga, _ga_*' })
  if (hay(m.gtm)) h.push({ nombre: 'Google Tag Manager', empresa: 'Google LLC', para: 'cargar las etiquetas de medición que configuramos', cookies: 'las de las etiquetas que carga' })
  if (hay(m.metaPixel)) h.push({ nombre: 'Píxel de Meta', empresa: 'Meta Platforms, Inc.', para: 'medir los resultados de nuestros anuncios en Facebook e Instagram y mostrarte anuncios relacionados', cookies: '_fbp, fr' })
  if (hay(m.tiktokPixel)) h.push({ nombre: 'Píxel de TikTok', empresa: 'TikTok Pte. Ltd.', para: 'medir los resultados de nuestros anuncios en TikTok', cookies: '_ttp' })
  if (hay(m.clarity)) h.push({ nombre: 'Microsoft Clarity', empresa: 'Microsoft Corporation', para: 'ver de forma anónima cómo se recorre la página (clics y desplazamiento) para mejorarla; oculta lo que escribes en los formularios', cookies: '_clck, _clsk' })
  if (hay(m.codigoCabecera) || hay(m.codigoFinal)) h.push({ nombre: 'Otras herramientas de medición', empresa: 'proveedores externos', para: 'medir y mejorar el sitio', cookies: 'las propias de cada herramienta' })
  return h
}

const conPermiso = (m: EstadoSitio['medicion']) => m?.pedirConsentimiento !== false

function bloque(nombre: string, e: EstadoSitio): any[] {
  const h = herramientasActivas(e.medicion)
  const boletin = Boolean(e.modulos?.boletin)
  const tienda = Boolean(e.modulos?.tienda)
  const propia = parrafo(
    'Contamos las visitas con una herramienta propia que ',
    { b: 'no usa cookies ni guarda tu dirección IP' },
    ': solo registra la página vista, el tipo de sitio desde el que llegaste (un buscador, una red social…) y el tipo de dispositivo.',
  )

  switch (nombre) {
    case 'datos': {
      const items: Trozo[][] = [
        [{ b: 'A través del formulario de contacto:' }, ' tu nombre, tu teléfono o WhatsApp, tu correo si lo indicas, el servicio que te interesa y el mensaje que escribas.'],
        [{ b: 'Si nos escribes por WhatsApp, correo o teléfono:' }, ' los datos que contenga esa comunicación, incluido tu número o dirección de correo.'],
      ]
      if (boletin) items.push([{ b: 'Si te suscribes al boletín:' }, ' tu correo electrónico y, si lo indicas, tu nombre.'])
      if (hayRecursos(e)) items.push([{ b: 'Si pides un recurso gratis (una guía, una plantilla):' }, ' tu correo y, si lo indicas, tu nombre, para enviarte el enlace de descarga. No te añadimos al boletín salvo que marques la casilla.'])
      if (hayComentarios(e)) items.push([{ b: 'Si comentas un artículo:' }, ' tu nombre, que se publica junto al comentario, y tu correo, que no se publica y solo usamos si hace falta responderte.'])
      if (tienda) {
        items.push([{ b: 'Si compras en la tienda o creas una cuenta:' }, ' tu nombre, correo, teléfono, dirección de envío y el detalle de tus pedidos.'])
        items.push([{ b: 'Pagos:' }, ' los datos de tu tarjeta o cuenta los recibe directamente la pasarela de pagos. Nosotros nunca los vemos ni los guardamos.'])
      }
      items.push([{ b: 'Si llegas a ser cliente:' }, ' los datos adicionales necesarios para prestar el servicio y facturarlo, que se recogen en ese momento y con tu conocimiento.'])
      return [lista(items)]
    }

    case 'medicion': {
      if (!h.length) {
        return [
          parrafo({ b: 'No usamos herramientas de seguimiento publicitario ni perfilado.' }, ' Este sitio no instala píxeles de redes sociales ni cookies de publicidad o de medición de terceros. Lo que sí utiliza se detalla en la ', { enlace: '/cookies', texto: 'política de cookies' }, '.'),
          propia,
        ]
      }
      return [
        parrafo(
          { b: 'Usamos estas herramientas de medición: ' },
          h.map((x) => x.nombre).join(', ') + '. ',
          conPermiso(e.medicion)
            ? 'Solo se activan si las aceptas en el aviso de cookies, y puedes cambiar tu decisión cuando quieras. '
            : 'Se activan al entrar al sitio. ',
          'El detalle está en la ',
          { enlace: '/cookies', texto: 'política de cookies' },
          '.',
        ),
        propia,
      ]
    }

    case 'medicion-detalle': {
      if (!h.length) {
        return [
          parrafo({ b: 'Este sitio no instala cookies de publicidad, de redes sociales ni de medición de terceros.' }, ' No hay píxel de Meta ni de TikTok, ni Google Analytics, ni etiquetas de remarketing.'),
          propia,
        ]
      }
      return [
        parrafo('Usamos las siguientes herramientas de terceros, que instalan sus propias cookies:'),
        lista(h.map((x) => [{ b: `${x.nombre}` }, ` (${x.empresa}): para ${x.para}. Cookies: ${x.cookies}.`])),
        conPermiso(e.medicion)
          ? parrafo({ b: 'Ninguna se activa sin tu permiso.' }, ' Al entrar te mostramos un aviso para aceptarlas o rechazarlas. Puedes ', { enlace: '#cookies', texto: 'cambiar tus preferencias de cookies' }, ' en cualquier momento.')
          : parrafo('Estas herramientas se activan al entrar al sitio. Si no quieres que funcionen, puedes bloquear las cookies de terceros desde la configuración de tu navegador.'),
        parrafo('Estas empresas pueden procesar la información fuera de Colombia, conforme a sus propias políticas de privacidad.'),
        propia,
      ]
    }

    case 'boletin':
      return boletin
        ? [parrafo({ b: 'Boletín:' }, ' solo te enviamos correos si te suscribes. Cada correo trae un enlace para darte de baja con un clic, y al hacerlo dejamos de escribirte de inmediato. No te añadimos a la lista por el hecho de escribirnos por el formulario de contacto.')]
        : [parrafo({ b: 'No enviamos correos comerciales masivos' }, ' ni boletines, y no vamos a añadirte a ninguna lista de difusión por el hecho de haber escrito. Si en el futuro quisiéramos hacerlo, te pediríamos tu autorización expresa y separada.')]

    case 'proveedores': {
      const items: Trozo[][] = [
        [{ b: 'Alojamiento del sitio y base de datos,' }, ' que procesan las solicitudes técnicas necesarias para mostrarte la página y guardar lo que nos envías.'],
        [{ b: 'Envío de correos electrónicos,' }, ' para avisarnos de tu mensaje y responderte' + (boletin ? ', y para enviarte el boletín si te suscribes.' : '.')],
      ]
      if (tienda) items.push([{ b: 'Pasarela de pagos,' }, ' que procesa el cobro de tus compras.'])
      if (h.length) items.push([{ b: 'Herramientas de medición:' }, ` ${h.map((x) => `${x.nombre} (${x.empresa})`).join(', ')}` + (conPermiso(e.medicion) ? ', solo si las aceptas.' : '.')])
      items.push([{ b: 'Servicio de tipografías,' }, ' que recibe la petición técnica necesaria para mostrar las letras del sitio.'])
      return [lista(items)]
    }

    case 'navegador': {
      const items: Trozo[][] = []
      if (hayVentanas(e)) items.push([{ b: 'Si cierras un aviso o la burbuja de WhatsApp,' }, ' lo recordamos unos días para no volver a mostrártelo (almacenamiento local).'])
      if (h.length && conPermiso(e.medicion)) items.push([{ b: 'Tu decisión sobre el aviso de cookies,' }, ' para no volver a preguntarte en cada visita (almacenamiento local).'])
      if (tienda) {
        items.push([{ b: 'Tu carrito de compras,' }, ' para que no se vacíe al cambiar de página (almacenamiento local).'])
        items.push([{ b: 'Tu sesión,' }, ' solo si inicias sesión en tu cuenta, para no pedirte la contraseña en cada página (cookie necesaria).'])
      }
      if (!items.length) {
        return [parrafo({ b: 'Nada.' }, ' Este sitio no guarda cookies ni datos en tu navegador mientras lo visitas.')]
      }
      return [
        parrafo('Guardamos únicamente lo necesario para que el sitio funcione:'),
        lista(items),
        parrafo('Estos datos son técnicos: no contienen tu nombre ni sirven para seguirte por otros sitios, y no se comparten con terceros.'),
      ]
    }
  }
  return []
}

const textoPlano = (n: any): string => (typeof n?.text === 'string' ? n.text : (n?.children || []).map(textoPlano).join(''))

/** Reemplaza los párrafos {bloque:…} por su texto según el estado actual del sitio. */
export function expandirBloques(contenido: any, estado: EstadoSitio) {
  if (!contenido?.root?.children) return contenido
  const hijos: any[] = []
  for (const nodo of contenido.root.children) {
    const m = nodo?.type === 'paragraph' ? textoPlano(nodo).trim().match(/^\{bloque:([a-z-]+)\}$/) : null
    if (m) hijos.push(...bloque(m[1], estado))
    else hijos.push(nodo)
  }
  return { ...contenido, root: { ...contenido.root, children: hijos } }
}

/** Qué partes del estado cambian el texto legal (para mover la fecha de actualización). */
export function huellaLegal(estado: EstadoSitio) {
  return JSON.stringify({
    h: herramientasActivas(estado.medicion).map((x) => x.nombre),
    p: conPermiso(estado.medicion),
    b: Boolean(estado.modulos?.boletin),
    t: Boolean(estado.modulos?.tienda),
    c: hayComentarios(estado),
    r: hayRecursos(estado),
    v: hayVentanas(estado),
  })
}
