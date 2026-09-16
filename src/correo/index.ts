/**
 * Envío de correos con Resend, en un solo sitio.
 *
 * Nunca lanza: devuelve { ok, error }. Quien llama está atendiendo a una
 * persona que acaba de pulsar "Enviar", y un fallo del correo no debe dejarla
 * sin respuesta (el mensaje ya quedó guardado en el buzón).
 */

// RESEND_API_URL solo existe para pruebas locales; en producción no se define.
const API = () => process.env.RESEND_API_URL || 'https://api.resend.com'

/**
 * Deja constancia de cada intento en "Registro de correos". Si esto falla, no
 * pasa nada: es un registro, no puede romper el envío.
 */
async function registrar(datos: { para: string; asunto: string; ok: boolean; error?: string; tipo?: string }) {
  try {
    const { getPayload } = await import('payload')
    const config = (await import('@payload-config')).default
    const payload = await getPayload({ config })
    await payload.create({ collection: 'registroCorreos', data: datos as any, depth: 0, context: { disableRevalidate: true } })
    // De vez en cuando se borran los más viejos: el registro no debe crecer sin fin.
    if (Math.random() < 0.05) {
      const viejos = await payload.find({ collection: 'registroCorreos', sort: '-createdAt', limit: 1, page: 301, depth: 0 })
      const corte = viejos.docs[0] as any
      if (corte?.createdAt) await payload.delete({ collection: 'registroCorreos', where: { createdAt: { less_than: corte.createdAt } } })
    }
  } catch (e: any) {
    console.error('[registro de correos] no se pudo anotar:', e?.message)
  }
}

export const hayCorreo = () => Boolean(process.env.RESEND_API_KEY)

export async function enviarCorreo(opciones: {
  para: string
  asunto: string
  html: string
  remitente: string
  responderA?: string
  tipo?: string
}): Promise<{ ok: boolean; error?: string }> {
  const { para, asunto, tipo } = opciones
  const clave = process.env.RESEND_API_KEY
  if (!clave) {
    await registrar({ para, asunto, ok: false, error: 'Falta la clave de Resend (RESEND_API_KEY)', tipo })
    return { ok: false, error: 'Falta RESEND_API_KEY' }
  }

  try {
    const res = await fetch(`${API()}/emails`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${clave}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: opciones.remitente,
        to: [opciones.para],
        subject: opciones.asunto,
        html: opciones.html,
        ...(opciones.responderA ? { reply_to: opciones.responderA } : {}),
      }),
    })
    if (res.ok) {
      await registrar({ para, asunto, ok: true, tipo })
      return { ok: true }
    }
    const detalle = (await res.text()).slice(0, 300)
    console.error('Resend rechazó el envío:', res.status, detalle)
    const error = `Resend respondió ${res.status}: ${detalle}`
    await registrar({ para, asunto, ok: false, error, tipo })
    return { ok: false, error }
  } catch (e: any) {
    console.error('Error enviando correo:', e?.message)
    await registrar({ para, asunto, ok: false, error: e?.message, tipo })
    return { ok: false, error: e?.message }
  }
}

/**
 * Envío masivo (boletín) con la API por lotes de Resend: hasta 100 correos por
 * petición, cada uno con su propio enlace de baja.
 */
export async function enviarLote(
  correos: { para: string; asunto: string; html: string; remitente: string; cabeceras?: Record<string, string> }[],
): Promise<{ enviados: number; fallidos: number; error?: string }> {
  const clave = process.env.RESEND_API_KEY
  if (!clave) return { enviados: 0, fallidos: correos.length, error: 'Falta RESEND_API_KEY' }

  let enviados = 0
  let error: string | undefined
  for (let i = 0; i < correos.length; i += 100) {
    const tanda = correos.slice(i, i + 100)
    try {
      const res = await fetch(`${API()}/emails/batch`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${clave}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(
          tanda.map((c) => ({ from: c.remitente, to: [c.para], subject: c.asunto, html: c.html, headers: c.cabeceras })),
        ),
      })
      if (res.ok) {
        enviados += tanda.length
        await registrar({ para: `${tanda.length} suscriptores`, asunto: tanda[0]?.asunto || 'Boletín', ok: true, tipo: 'boletin' })
      } else {
        error = `Resend respondió ${res.status}: ${(await res.text()).slice(0, 200)}`
        await registrar({ para: `${tanda.length} suscriptores`, asunto: tanda[0]?.asunto || 'Boletín', ok: false, error, tipo: 'boletin' })
      }
    } catch (e: any) {
      error = e?.message
      await registrar({ para: `${tanda.length} suscriptores`, asunto: tanda[0]?.asunto || 'Boletín', ok: false, error, tipo: 'boletin' })
    }
  }
  return { enviados, fallidos: correos.length - enviados, error }
}

const escapar = (t: unknown) =>
  String(t ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')

/**
 * Los correos llevan la misma piel que el sitio: banda grafito con el logo en
 * blanco, tarjeta clara de esquinas redondas, etiqueta en bronce, titular
 * grande y pie con los datos del negocio. Todo en tablas y con los estilos
 * escritos en cada etiqueta, que es lo único que respetan Gmail y Outlook.
 */
const PALETA_BASE = {
  fondo: '#ECEDEE',
  tarjeta: '#FFFFFF',
  banda: '#0E0F11',
  linea: '#E6E7E8',
  grafito: '#0E0F11',
  pizarra: '#55585E',
  suave: '#8A8D93',
  bronce: '#9A4A1F',
  bronceSuave: '#F6ECE5',
  tipografia: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif",
}
const C = { ...PALETA_BASE }

const hex = (v: unknown) => (typeof v === 'string' && /^#[0-9a-f]{6}$/i.test(v.trim()) ? v.trim() : undefined)
/** Mezcla un color con blanco para el fondo suave de las citas y el pie. */
const tinte = (color: string, cuanto = 0.9) => {
  const n = parseInt(color.slice(1), 16)
  const c = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((x) => Math.round(x + (255 - x) * cuanto))
  return `#${c.map((x) => x.toString(16).padStart(2, '0')).join('')}`
}
/** Aplica los colores de "Datos del negocio" antes de armar cada correo. */
function usarPaleta(m: Marca) {
  Object.assign(C, PALETA_BASE)
  if (m.colorAcento) Object.assign(C, { bronce: m.colorAcento, bronceSuave: tinte(m.colorAcento) })
  if (m.colorOscuro) Object.assign(C, { banda: m.colorOscuro, grafito: m.colorOscuro })
}

export type Enlace = { texto: string; url: string; nota?: string }

export type Marca = {
  nombre: string
  logo?: string
  logoBlanco?: string
  sitio: string
  whatsapp?: string
  mensajeWhatsapp?: string
  telefono?: string
  correo?: string
  ciudad?: string
  departamento?: string
  redes: { nombre: string; url: string }[]
  blog?: boolean
  colorAcento?: string
  colorOscuro?: string
}

const absoluta = (url: string | undefined, base: string) => {
  if (!url) return undefined
  const u = /^https?:\/\//.test(url) ? url : `${base.replace(/\/$/, '')}${url}`
  // Un correo no puede mostrar imágenes de "localhost": se cae a texto.
  return /^https:\/\//.test(u) ? u : undefined
}

/**
 * Convierte "Datos del negocio" en lo que necesitan los correos. El logo sale
 * en PNG (WebP no se ve en muchos gestores de correo); si no hay uno servible,
 * se usa el nombre escrito.
 */
export function marcaCorreo(tienda: any, base: string, modulos?: { blog?: boolean }): Marca {
  const png = (m: any) => m?.sizes?.correo?.url || (/(png|jpe?g)$/i.test(m?.mimeType || '') ? m?.url : undefined)
  const sitio = base.replace(/\/$/, '')
  const redes = [
    { nombre: 'Instagram', url: tienda?.instagram },
    { nombre: 'Facebook', url: tienda?.facebook },
    { nombre: 'TikTok', url: tienda?.tiktok },
    { nombre: 'LinkedIn', url: tienda?.linkedin },
    { nombre: 'YouTube', url: tienda?.youtube },
  ].filter((r) => typeof r.url === 'string' && /^https?:\/\//.test(r.url)) as { nombre: string; url: string }[]

  return {
    nombre: tienda?.nombre || '',
    logo: absoluta(png(tienda?.logo), base),
    logoBlanco: absoluta(png(tienda?.logoBlanco), base) || absoluta(png(tienda?.logo), base),
    sitio,
    whatsapp: String(tienda?.whatsapp || '').replace(/\D/g, '') || undefined,
    mensajeWhatsapp: tienda?.mensajeWhatsapp || undefined,
    telefono: tienda?.telefono || undefined,
    correo: tienda?.correo || undefined,
    ciudad: tienda?.ciudad || undefined,
    departamento: tienda?.departamento || undefined,
    redes,
    blog: modulos?.blog !== false,
    colorAcento: hex(tienda?.colorAcento),
    colorOscuro: hex(tienda?.colorOscuro),
  }
}

const enlaceWhatsapp = (m: Marca, mensaje?: string) =>
  m.whatsapp ? `https://wa.me/${m.whatsapp}${mensaje || m.mensajeWhatsapp ? `?text=${encodeURIComponent(mensaje || m.mensajeWhatsapp || '')}` : ''}` : undefined

type Boton = { texto: string; url: string }

/** Banda superior: logo centrado sobre grafito y, debajo, el dominio. */
const banda = (m: Marca) => `
  <tr><td align="center" style="background:${C.banda};border-radius:26px 26px 0 0;padding:30px 32px 26px">
    ${
      m.logoBlanco
        ? `<img src="${escapar(m.logoBlanco)}" alt="${escapar(m.nombre)}" height="30" style="height:30px;width:auto;display:block;margin:0 auto;border:0;outline:none">`
        : `<div style="font-size:19px;font-weight:700;letter-spacing:-0.02em;color:#FFFFFF">${escapar(m.nombre)}</div>`
    }
    <div style="font-size:11px;letter-spacing:0.12em;color:#8E9198;padding-top:12px">${escapar(m.sitio.replace(/^https?:\/\//, '').replace(/\/$/, ''))}</div>
  </td></tr>`

/** Bloque "Mientras tanto": dos o tres caminos claros para seguir. */
function sugerencias(m: Marca, extra?: Enlace[], solo?: boolean) {
  const wa = enlaceWhatsapp(m)
  const lista: Enlace[] = solo && extra?.length ? extra : [
    ...(extra || []),
    ...(m.blog ? [{ texto: 'Leer el blog', url: `${m.sitio}/blog`, nota: 'Artículos y consejos útiles' }] : []),
    ...(wa ? [{ texto: 'Escribirnos por WhatsApp', url: wa, nota: 'Te respondemos en horario laboral' }] : []),
    { texto: 'Ver el sitio', url: `${m.sitio}/`, nota: 'Conoce todo lo que ofrecemos' },
  ].slice(0, 3)

  return `
  <tr><td style="padding:0 32px 30px">
    <div style="border-top:1px solid ${C.linea};padding-top:22px">
      <div style="font-size:11px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:${C.suave};padding-bottom:12px">Mientras tanto</div>
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
        ${lista
          .map(
            (e) => `<tr><td style="padding:9px 0;border-bottom:1px solid ${C.linea}">
              <a href="${escapar(e.url)}" style="text-decoration:none;color:${C.grafito};font-size:15px;font-weight:600">${escapar(e.texto)} <span style="color:${C.bronce}">↗</span></a>
              ${e.nota ? `<div style="font-size:13px;color:${C.suave};padding-top:2px">${escapar(e.nota)}</div>` : ''}
            </td></tr>`,
          )
          .join('')}
      </table>
    </div>
  </td></tr>`
}

/** Pie: quién escribe, cómo responderle y dónde más está. */
function pieCorreo(m: Marca, extra?: string) {
  const contacto = [
    m.telefono ? `<a href="tel:${escapar(String(m.telefono).replace(/\s/g, ''))}" style="color:${C.pizarra};text-decoration:none">${escapar(m.telefono)}</a>` : '',
    m.correo ? `<a href="mailto:${escapar(m.correo)}" style="color:${C.pizarra};text-decoration:none">${escapar(m.correo)}</a>` : '',
  ]
    .filter(Boolean)
    .join(' &nbsp;·&nbsp; ')

  return `
  <tr><td style="padding:24px 32px 30px;background:${C.bronceSuave};border-radius:0 0 26px 26px">
    <div style="font-size:14px;font-weight:700;color:${C.grafito};letter-spacing:-0.01em">${escapar(m.nombre)}</div>
    ${contacto ? `<div style="font-size:13px;color:${C.pizarra};padding-top:6px">${contacto}</div>` : ''}
    ${
      m.redes.length
        ? `<div style="font-size:13px;padding-top:10px">${m.redes
            .map((r) => `<a href="${escapar(r.url)}" style="color:${C.bronce};text-decoration:none;font-weight:600">${escapar(r.nombre)}</a>`)
            .join(` <span style="color:${C.suave}">·</span> `)}</div>`
        : ''
    }
    <div style="font-size:12px;color:${C.suave};padding-top:14px;line-height:1.6">
      <a href="${escapar(m.sitio)}" style="color:${C.suave};text-decoration:underline">${escapar(m.sitio.replace(/^https?:\/\//, ''))}</a>
      &nbsp;·&nbsp; <a href="${escapar(`${m.sitio}/privacidad`)}" style="color:${C.suave};text-decoration:underline">Privacidad</a>
      ${extra ? `<br>${extra}` : ''}
    </div>
  </td></tr>`
}

/** Estructura común de todos los correos del sitio. */
function plantilla({
  negocio,
  etiqueta,
  titulo,
  cuerpo,
  boton,
  pie,
  enlaces,
  soloEnlaces,
  sinSugerencias,
}: {
  negocio: Marca
  etiqueta?: string
  titulo: string
  cuerpo: string
  boton?: Boton
  pie?: string
  enlaces?: Enlace[]
  soloEnlaces?: boolean
  sinSugerencias?: boolean
}) {
  const adelanto = escapar(String(titulo).replace(/<[^>]+>/g, '').slice(0, 120))
  return `<!doctype html>
<html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light"><meta name="supported-color-schemes" content="light"><title>${adelanto}</title></head>
<body style="margin:0;padding:0;background:${C.fondo};font-family:${C.tipografia};color:${C.pizarra};-webkit-font-smoothing:antialiased">
<div style="display:none;max-height:0;overflow:hidden;opacity:0">${adelanto}</div>
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:${C.fondo}">
  <tr><td align="center" style="padding:32px 14px 40px">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width:600px;background:${C.tarjeta};border-radius:26px;overflow:hidden;border:1px solid ${C.linea}">
      ${banda(negocio)}
      <tr><td style="padding:34px 32px 8px">
        ${etiqueta ? `<div style="font-size:11px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:${C.bronce};padding-bottom:12px">${escapar(etiqueta)}</div>` : ''}
        <h1 style="margin:0 0 16px;font-size:29px;line-height:1.14;letter-spacing:-0.035em;font-weight:600;color:${C.grafito}">${titulo}</h1>
        <div style="font-size:15.5px;line-height:1.68;color:${C.pizarra}">${cuerpo}</div>
        ${
          boton
            ? `<table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin:28px 0 4px"><tr><td style="background:${C.grafito};border-radius:999px">
                 <a href="${escapar(boton.url)}" style="display:inline-block;padding:16px 30px;font-size:14.5px;font-weight:600;color:#FFFFFF;text-decoration:none;letter-spacing:-0.01em">${escapar(boton.texto)} &nbsp;↗</a>
               </td></tr></table>`
            : ''
        }
      </td></tr>
      <tr><td style="height:26px"></td></tr>
      ${sinSugerencias ? '' : sugerencias(negocio, enlaces, soloEnlaces)}
      ${pieCorreo(negocio, pie)}
    </table>
    <div style="max-width:600px;font-size:11px;color:${C.suave};padding:16px 6px 0;line-height:1.6;text-align:center">
      Recibes este correo porque escribiste, te suscribiste o descargaste algo en ${escapar(negocio.sitio.replace(/^https?:\/\//, ''))}.
    </div>
  </td></tr>
</table>
</body></html>`
}

/** Recuadro con el texto que escribió una persona. */
const cita = (texto: string) =>
  `<div style="margin:0;padding:16px 18px;background:${C.bronceSuave};border-left:3px solid ${C.bronce};border-radius:10px;white-space:pre-wrap;color:${C.grafito}">${escapar(texto)}</div>`

export type DatosMensaje = { nombre: string; correo?: string; telefono?: string; necesita?: string; mensaje?: string; origen?: string }

export function correoAviso(negocio: Marca, m: DatosMensaje, urlPanel: string) {
  usarPaleta(negocio)
  const fila = (etiqueta: string, valor?: string) =>
    valor
      ? `<tr><td style="padding:7px 0;color:${C.suave};font-size:13px;width:110px;vertical-align:top">${etiqueta}</td><td style="padding:7px 0;font-size:15px;font-weight:600;color:${C.grafito}">${escapar(valor)}</td></tr>`
      : ''
  const digitos = String(m.telefono ?? '').replace(/\D/g, '')
  const wa = digitos.length >= 7 ? `https://wa.me/${digitos.length === 10 ? `57${digitos}` : digitos}` : ''

  return plantilla({
    negocio,
    etiqueta: 'Mensaje nuevo',
    titulo: `Te escribió ${escapar(m.nombre)}`,
    cuerpo: `<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-bottom:18px">
      ${fila('Nombre', m.nombre)}${fila('Teléfono', m.telefono)}${fila('Correo', m.correo)}${fila('Necesita', m.necesita)}${fila('Desde', m.origen)}
    </table>
    ${m.mensaje ? cita(m.mensaje) : `<p style="margin:0;color:${C.suave}">No dejó mensaje.</p>`}`,
    boton: wa ? { texto: 'Responder por WhatsApp', url: wa } : m.correo ? { texto: 'Responder por correo', url: `mailto:${m.correo}` } : undefined,
    enlaces: [{ texto: 'Abrir el buzón del panel', url: urlPanel, nota: 'Ahí quedan todos los mensajes y su estado' }],
    soloEnlaces: true,
  })
}

export function correoBienvenida(negocio: Marca, texto: string, enlaceBaja: string) {
  usarPaleta(negocio)
  return plantilla({
    negocio,
    etiqueta: 'Boletín',
    titulo: '¡Listo, ya estás en la lista!',
    cuerpo: `<p style="margin:0;white-space:pre-wrap">${escapar(texto)}</p>`,
    pie: `¿Te apuntaste por error? <a href="${escapar(enlaceBaja)}" style="color:${C.suave};text-decoration:underline">Darte de baja</a>.`,
  })
}

export function correoAvisoSuscripcion(negocio: Marca, correo: string, nombre: string, origen: string, urlPanel: string) {
  usarPaleta(negocio)
  return plantilla({
    negocio,
    etiqueta: 'Boletín',
    titulo: 'Un suscriptor nuevo',
    cuerpo: `<p style="margin:0 0 8px;color:${C.grafito};font-weight:600;font-size:17px">${escapar(nombre || correo)}</p>
      <p style="margin:0;color:${C.suave};font-size:13px">${escapar(correo)}${origen ? ` · desde ${escapar(origen)}` : ''}</p>`,
    boton: { texto: 'Ver la lista', url: urlPanel },
    sinSugerencias: true,
  })
}

/** El boletín: el HTML del cuerpo viene del editor del panel (ya es seguro). */
export function correoBoletin(o: { negocio: Marca; asunto: string; cuerpo: string; enlaceBaja: string; urlSitio: string }) {
  usarPaleta(o.negocio)
  return plantilla({
    negocio: o.negocio,
    titulo: escapar(o.asunto),
    cuerpo: `<div style="font-size:15.5px;line-height:1.7;color:${C.pizarra}">${o.cuerpo}</div>`,
    pie: `Recibes este correo porque te suscribiste. <a href="${escapar(o.enlaceBaja)}" style="color:${C.suave};text-decoration:underline">Darte de baja</a>.`,
  })
}

export function correoConfirmacion(negocio: Marca, nombre: string, texto: string) {
  usarPaleta(negocio)
  const primer = String(nombre).trim().split(/\s+/)[0] || ''
  return plantilla({
    negocio,
    etiqueta: 'Mensaje recibido',
    titulo: `Gracias${primer ? `, ${escapar(primer)}` : ''}`,
    cuerpo: `<p style="margin:0;white-space:pre-wrap">${escapar(texto)}</p>`,
  })
}

export function correoRecuperarClave(negocio: Marca, nombre: string, url: string, minutos: number) {
  usarPaleta(negocio)
  const primer = String(nombre || '').trim().split(/\s+/)[0] || ''
  return plantilla({
    negocio,
    etiqueta: 'Seguridad',
    titulo: `Crea una nueva contraseña${primer ? `, ${escapar(primer)}` : ''}`,
    cuerpo: `<p style="margin:0 0 12px">Alguien pidió recuperar la contraseña de esta cuenta. Si fuiste tú, pulsa el botón y escribe una nueva.</p>
      <p style="margin:0;font-size:13px;color:${C.suave}">El enlace vence en ${minutos} minutos y solo sirve una vez. Si no lo pediste, ignora este correo: tu contraseña sigue igual.</p>`,
    boton: { texto: 'Crear nueva contraseña', url },
    sinSugerencias: true,
  })
}

export function correoAvisoComentario(negocio: Marca, nombre: string, texto: string, articulo: string, urlPanel: string) {
  usarPaleta(negocio)
  return plantilla({
    negocio,
    etiqueta: 'Comentario',
    titulo: `${escapar(nombre)} comentó tu artículo`,
    cuerpo: `<p style="margin:0 0 14px;color:${C.suave};font-size:13px">En <em style="color:${C.grafito}">${escapar(articulo)}</em></p>
      ${cita(texto)}
      <p style="margin:18px 0 0;font-size:13px;color:${C.suave}">No se publica hasta que lo apruebes.</p>`,
    boton: { texto: 'Revisar comentario', url: urlPanel },
    sinSugerencias: true,
  })
}

export function correoRecurso(o: { negocio: Marca; nombre: string; titulo: string; texto: string; enlace: string; boton: string }) {
  usarPaleta(o.negocio)
  const primer = String(o.nombre || '').trim().split(/\s+/)[0] || ''
  return plantilla({
    negocio: o.negocio,
    etiqueta: 'Tu descarga',
    titulo: `${primer ? `${escapar(primer)}, aquí` : 'Aquí'} tienes: ${escapar(o.titulo)}`,
    cuerpo: `<p style="margin:0 0 12px;white-space:pre-wrap">${escapar(o.texto || 'Gracias por tu interés. Pulsa el botón para descargarlo.')}</p>
      <p style="margin:0;font-size:13px;color:${C.suave}">El enlace funciona durante 7 días.</p>`,
    boton: { texto: o.boton || 'Descargar', url: o.enlace },
  })
}
