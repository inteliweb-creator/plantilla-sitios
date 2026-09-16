'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

import type { EventoMedicion } from './eventos'

export type ConfigMedicion = {
  ga4?: string | null
  gtm?: string | null
  metaPixel?: string | null
  tiktokPixel?: string | null
  clarity?: string | null
  pedirConsentimiento?: boolean | null
  textoAviso?: string | null
  botonAceptar?: string | null
  botonRechazar?: string | null
  enlacePolitica?: string | null
  codigoCabecera?: string | null
  codigoFinal?: string | null
}

const CLAVE = 'consentimiento-cookies'
const limpio = (id?: string | null) => (id || '').trim().replace(/[^A-Za-z0-9-]/g, '')

function agregarCodigo(codigo: string, id: string, destino: HTMLElement = document.head) {
  if (document.getElementById(id)) return
  const s = document.createElement('script')
  s.id = id
  s.text = codigo
  destino.appendChild(s)
}

/** Pega HTML con scripts: los <script> insertados como texto no se ejecutan, así que se recrean. */
function pegarHtml(html: string, destino: HTMLElement, marca: string) {
  if (!html.trim() || document.querySelector(`[data-medicion="${marca}"]`)) return
  const plantilla = document.createElement('template')
  plantilla.innerHTML = html
  for (const nodo of Array.from(plantilla.content.childNodes)) {
    let nuevo: Node
    if (nodo instanceof HTMLScriptElement) {
      const s = document.createElement('script')
      for (const atributo of Array.from(nodo.attributes)) s.setAttribute(atributo.name, atributo.value)
      s.text = nodo.text
      nuevo = s
    } else {
      nuevo = nodo.cloneNode(true)
    }
    if (nuevo instanceof Element) nuevo.setAttribute('data-medicion', marca)
    destino.appendChild(nuevo)
  }
}

function cargar(c: ConfigMedicion) {
  const w = window as any
  const ga4 = limpio(c.ga4)
  const gtm = limpio(c.gtm)
  const meta = limpio(c.metaPixel)
  const tiktok = limpio(c.tiktokPixel)
  const clarity = limpio(c.clarity)

  if (ga4 || gtm) {
    w.dataLayer = w.dataLayer || []
    w.gtag = w.gtag || function () { w.dataLayer.push(arguments) } // eslint-disable-line
  }
  if (ga4 && !document.getElementById('medicion-ga4')) {
    const s = document.createElement('script')
    s.id = 'medicion-ga4'
    s.async = true
    s.src = `https://www.googletagmanager.com/gtag/js?id=${ga4}`
    document.head.appendChild(s)
    w.gtag('js', new Date())
    w.gtag('config', ga4)
  }
  if (gtm) {
    agregarCodigo(
      `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${gtm}');`,
      'medicion-gtm',
    )
  }
  if (meta) {
    agregarCodigo(
      `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${meta}');fbq('track','PageView');`,
      'medicion-meta',
    )
  }
  if (tiktok) {
    agregarCodigo(
      `!function(w,d,t){w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var i="https://analytics.tiktok.com/i18n/pixel/events.js";ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=i,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};var o=d.createElement("script");o.type="text/javascript",o.async=!0,o.src=i+"?sdkid="+e+"&lib="+t;var a=d.getElementsByTagName("script")[0];a.parentNode.insertBefore(o,a)};ttq.load('${tiktok}');ttq.page();}(window,document,'ttq');`,
      'medicion-tiktok',
    )
  }
  if (clarity) {
    agregarCodigo(
      `(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script","${clarity}");`,
      'medicion-clarity',
    )
  }
  if (c.codigoCabecera) pegarHtml(c.codigoCabecera, document.head, 'cabecera')
  if (c.codigoFinal) pegarHtml(c.codigoFinal, document.body, 'final')
}

/** Convierte las conversiones del sitio al nombre que entiende cada herramienta. */
function reenviar(evento: EventoMedicion) {
  const w = window as any
  const ga = { contacto: 'generate_lead', suscripcion: 'sign_up', whatsapp: 'contacto_whatsapp' }[evento]
  const fb = { contacto: 'Lead', suscripcion: 'Subscribe', whatsapp: 'Contact' }[evento]
  const tt = { contacto: 'SubmitForm', suscripcion: 'Subscribe', whatsapp: 'Contact' }[evento]
  w.gtag?.('event', ga)
  if (!w.gtag) w.dataLayer?.push({ event: ga })
  w.fbq?.('track', fb)
  w.ttq?.track?.(tt)
}

/**
 * Carga las herramientas de "Analítica y píxeles" y muestra el aviso de
 * cookies. Nada se carga antes de que la persona acepte (si así se configuró).
 * Cualquier enlace a "#cookies" vuelve a abrir el aviso.
 */
export function Analitica({ config }: { config: ConfigMedicion }) {
  const ruta = usePathname()
  const [decision, setDecision] = useState<'si' | 'no' | null | undefined>(undefined)
  const cargado = useRef(false)
  const primeraRuta = useRef(true)

  const hayAlgo = Boolean(
    limpio(config.ga4) || limpio(config.gtm) || limpio(config.metaPixel) || limpio(config.tiktokPixel) || limpio(config.clarity) || config.codigoCabecera?.trim() || config.codigoFinal?.trim(),
  )
  const pedir = config.pedirConsentimiento !== false
  const permitido = hayAlgo && (!pedir || decision === 'si')

  useEffect(() => {
    let guardada: string | null = null
    try {
      guardada = localStorage.getItem(CLAVE)
    } catch {}
    setDecision(guardada === 'si' || guardada === 'no' ? guardada : null)

    const reabrir = (e: MouseEvent) => {
      const a = (e.target as HTMLElement | null)?.closest?.('a')
      if (a?.getAttribute('href') === '#cookies') {
        e.preventDefault()
        setDecision(null)
      }
    }
    document.addEventListener('click', reabrir)
    return () => document.removeEventListener('click', reabrir)
  }, [])

  useEffect(() => {
    if (!permitido || cargado.current) return
    cargado.current = true
    cargar(config)
  }, [permitido, config])

  // Cambios de página dentro del sitio: Meta y TikTok no los detectan solos.
  useEffect(() => {
    if (primeraRuta.current) {
      primeraRuta.current = false
      return
    }
    if (!cargado.current) return
    const w = window as any
    w.fbq?.('track', 'PageView')
    w.ttq?.page?.()
  }, [ruta])

  useEffect(() => {
    const alEvento = (e: Event) => {
      if (cargado.current) reenviar((e as CustomEvent<EventoMedicion>).detail)
    }
    window.addEventListener('medicion', alEvento)
    return () => window.removeEventListener('medicion', alEvento)
  }, [])

  const decidir = (valor: 'si' | 'no') => {
    try {
      localStorage.setItem(CLAVE, valor)
    } catch {}
    // Si retira el permiso con las herramientas ya cargadas, se recarga para quitarlas.
    if (valor === 'no' && cargado.current) window.location.reload()
    setDecision(valor)
  }

  if (!hayAlgo || !pedir || decision !== null) return null

  return (
    <div
      role="dialog"
      aria-label="Aviso de cookies"
      className="fixed z-[60] bottom-4 left-4 right-4 sm:right-auto sm:max-w-sm rounded-2xl bg-white border border-line p-5 shadow-[var(--shadow-lift)]"
    >
      <p className="text-sm text-slate leading-relaxed mb-4">
        {config.textoAviso || 'Usamos cookies para medir las visitas y mejorar el sitio. Tú decides si las activamos.'}{' '}
        {config.enlacePolitica && (
          <a href={config.enlacePolitica} className="underline text-graphite">
            Más información
          </a>
        )}
      </p>
      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={() => decidir('si')} className="rounded-full bg-graphite text-white text-sm font-semibold px-5 py-2.5 hover:opacity-90">
          {config.botonAceptar || 'Aceptar'}
        </button>
        <button type="button" onClick={() => decidir('no')} className="rounded-full border border-line text-graphite text-sm font-semibold px-5 py-2.5 hover:border-graphite/40">
          {config.botonRechazar || 'Solo las necesarias'}
        </button>
      </div>
    </div>
  )
}
