import crypto from 'crypto'
import { getPayload } from 'payload'
import config from '@payload-config'

import { checkRole } from '@/access/utilities'

/**
 * Recibe cada página vista (y cada clic a WhatsApp) desde el navegador.
 * Descarta robots, vistas previas y a los administradores, para que las
 * cifras del panel sean de clientes reales.
 */

// Solo llegan navegadores que ejecutan JavaScript; aun así hay robots que lo hacen.
const ROBOTS = /bot\b|bot\/|crawl|spider|slurp|headless|lighthouse|pagespeed|phantomjs|selenium|puppeteer|playwright|curl|wget|python|axios|node-fetch|go-http|java\//i

const FUENTES: [RegExp, string][] = [
  [/(^|\.)(google|bing|duckduckgo|yahoo|ecosia|yandex|baidu)\.|search\.brave\.com/, 'buscador'],
  [/chatgpt\.com|openai\.com|perplexity\.ai|gemini\.google|claude\.ai|copilot\.microsoft/, 'ia'],
  [/facebook\.|fb\.|instagram\.|(^|\.)t\.co$|twitter\.|(^|\.)x\.com$|linkedin\.|lnkd\.in|tiktok\.|youtube\.|pinterest\.|threads\.net|wa\.me|whatsapp\.|l\.wl\.co|reddit\./, 'redes'],
  [/mail\.|outlook\.|gmail/, 'correo'],
]

function clasificar(referente: string, host: string, utm: { source?: string; medium?: string }) {
  const medio = (utm.medium || '').toLowerCase()
  const origen = (utm.source || '').toLowerCase()
  if (/cpc|ppc|paid|ads|anuncio/.test(medio)) return 'anuncios'
  if (/email|correo|newsletter|boletin/.test(medio + origen)) return 'correo'
  if (origen) {
    for (const [re, f] of FUENTES) if (re.test(`${origen}.com`) || re.test(origen)) return f
  }
  if (!referente) return 'directo'
  if (referente === host || referente.endsWith(`.${host}`)) return 'interno'
  for (const [re, f] of FUENTES) if (re.test(referente)) return f
  return 'otros'
}

function dispositivo(ua: string) {
  if (/ipad|tablet|(android(?!.*mobile))/i.test(ua)) return 'tableta'
  if (/mobi|iphone|android/i.test(ua)) return 'movil'
  return 'escritorio'
}

// Límite por IP en memoria: suficiente contra recargas en bucle.
const intentos = new Map<string, { n: number; hasta: number }>()
function demasiadas(ip: string) {
  const ahora = Date.now()
  const r = intentos.get(ip)
  if (!r || r.hasta < ahora) {
    if (intentos.size > 5000) intentos.clear()
    intentos.set(ip, { n: 1, hasta: ahora + 60_000 })
    return false
  }
  r.n++
  return r.n > 60
}

const nada = () => new Response(null, { status: 204 })

export async function POST(req: Request): Promise<Response> {
  const ua = req.headers.get('user-agent') || ''
  if (!ua || ROBOTS.test(ua)) return nada()
  if (/prefetch|prerender/i.test(req.headers.get('purpose') || req.headers.get('sec-purpose') || '')) return nada()

  let datos: any
  try {
    datos = JSON.parse(await req.text())
  } catch {
    return nada()
  }
  const ruta = String(datos?.ruta || '').split(/[?#]/)[0].slice(0, 200)
  if (!ruta.startsWith('/') || /^\/(admin|api|next|_next)(\/|$)/.test(ruta)) return nada()
  const tipo = datos?.tipo === 'whatsapp' ? 'whatsapp' : 'vista'

  const ip = (req.headers.get('x-forwarded-for') || '').split(',')[0].trim() || req.headers.get('x-real-ip') || 'local'
  if (demasiadas(ip)) return nada()

  const payload = await getPayload({ config })

  // Tus propias visitas no cuentan.
  if (/payload-token=/.test(req.headers.get('cookie') || '')) {
    const { user } = await payload.auth({ headers: req.headers })
    if (user && checkRole(['admin'], user as any)) return nada()
  }

  const host = (req.headers.get('x-forwarded-host') || req.headers.get('host') || '').split(':')[0].replace(/^www\./, '')
  let referente = ''
  try {
    referente = datos?.referente ? new URL(String(datos.referente)).hostname.replace(/^www\./, '') : ''
  } catch {}
  const fuente = clasificar(referente, host, { source: datos?.utmSource, medium: datos?.utmMedium })

  const dia = new Date().toISOString().slice(0, 10)
  const visitante = crypto
    .createHash('sha256')
    .update(`${process.env.PAYLOAD_SECRET}|${dia}|${ip}|${ua}`)
    .digest('hex')
    .slice(0, 20)

  try {
    await payload.create({
      collection: 'visitas',
      data: {
        tipo,
        ruta,
        fuente: fuente as any,
        referente: fuente === 'interno' || fuente === 'directo' ? undefined : referente.slice(0, 100),
        dispositivo: dispositivo(ua) as any,
        pais: req.headers.get('x-vercel-ip-country') || undefined,
        visitante,
      },
      depth: 0,
    })
    // De vez en cuando se borran las visitas de hace más de 13 meses.
    if (Math.random() < 0.01) {
      const limite = new Date(Date.now() - 400 * 24 * 3600 * 1000).toISOString()
      await payload.delete({ collection: 'visitas', where: { createdAt: { less_than: limite } } })
    }
  } catch (e) {
    payload.logger.error({ err: e, msg: 'No se pudo guardar la visita' })
  }
  return nada()
}
