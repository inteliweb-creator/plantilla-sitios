import type { AdminViewServerProps } from 'payload'
import { DefaultTemplate } from '@payloadcms/next/templates'
import { Gutter } from '@payloadcms/ui'
import { redirect } from 'next/navigation'
import React from 'react'

import { checkRole } from '@/access/utilities'
import { hayCorreo, enviarCorreo } from '@/correo'
import { optimizarImagenes } from '@/scripts/optimizar-imagenes'

import './index.scss'

// Optimizar imágenes tarda: se pide el máximo que permite el servidor.
export const maxDuration = 60

/**
 * "Revisión del sitio": comprueba de un vistazo que todo lo que necesita
 * llaves o servicios externos esté conectado (base de datos, imágenes en la
 * nube, correos) y permite enviar un correo de prueba. Nunca muestra claves:
 * solo dice si están puestas y qué contestó el servicio.
 */
type Estado = 'ok' | 'aviso' | 'mal'
type Punto = { estado: Estado; titulo: string; detalle: string }

const ICONO: Record<Estado, string> = { ok: '✓', aviso: '!', mal: '✗' }

export default async function Revision({ initPageResult, params, searchParams }: AdminViewServerProps) {
  const { req } = initPageResult
  const { payload, user } = req
  if (!user || !checkRole(['admin'], user as any)) redirect('/admin/login')
  const sp = await searchParams
  const enviarPrueba = sp?.probarCorreo === '1'
  const optimizar = sp?.optimizar === '1'
  const ejemplo = typeof sp?.ejemplo === 'string' ? sp.ejemplo : ''

  const env = (n: string) => Boolean(process.env[n] && String(process.env[n]).trim())
  const [avisos, negocio, modulos]: any[] = await Promise.all([
    payload.findGlobal({ slug: 'avisos', depth: 0 }),
    payload.findGlobal({ slug: 'tienda', depth: 1 }),
    payload.findGlobal({ slug: 'modulos', depth: 0 }),
  ])
  const base = (process.env.NEXT_PUBLIC_SERVER_URL || '').replace(/\/$/, '')

  const puntos: Punto[] = []
  const añadir = (estado: Estado, titulo: string, detalle: string) => puntos.push({ estado, titulo, detalle })

  // Resultado de "Cargar contenido de ejemplo" (lo hace /next/sembrar-ejemplo)
  const resultadoEjemplo: Punto | null =
    ejemplo === 'listo'
      ? { estado: 'ok', titulo: 'Contenido de ejemplo cargado', detalle: 'Inicio, contacto, preguntas, legales y menú listos para editar. Abre el sitio para verlo.' }
      : ejemplo === 'ocupado'
        ? { estado: 'aviso', titulo: 'No se cargó el ejemplo', detalle: 'El sitio ya tiene páginas: el ejemplo solo se carga en un sitio vacío.' }
        : ejemplo === 'error'
          ? { estado: 'mal', titulo: 'No se cargó el ejemplo', detalle: 'Ocurrió un error. Revisa los registros del servidor.' }
          : null
  let sitioVacio = false

  // Base de datos
  try {
    const paginas = await payload.count({ collection: 'pages' })
    sitioVacio = paginas.totalDocs === 0
    const enNube = /^libsql:|^https:/.test(process.env.DATABASE_URL || process.env.TURSO_DATABASE_URL || '')
    añadir('ok', 'Base de datos', `Conectada${enNube ? ' (en la nube)' : ' (archivo local)'}. ${paginas.totalDocs} páginas.`)
  } catch (e: any) {
    añadir('mal', 'Base de datos', `No responde: ${e?.message}`)
  }

  // Dirección del sitio
  añadir(base ? 'ok' : 'mal', 'Dirección del sitio', base || 'Falta la variable NEXT_PUBLIC_SERVER_URL: los enlaces de los correos saldrán mal.')

  // Imágenes en la nube
  añadir(
    env('BLOB_READ_WRITE_TOKEN') ? 'ok' : 'aviso',
    'Imágenes en la nube',
    env('BLOB_READ_WRITE_TOKEN')
      ? 'Conectadas a Vercel Blob: las imágenes que subas se guardan en la nube.'
      : 'Sin conectar. En el servidor, las imágenes que subas se perderán al publicar cambios.',
  )

  // Correos
  const remitente = avisos?.remitente
  añadir(
    hayCorreo() ? 'ok' : 'mal',
    'Servicio de correo (Resend)',
    hayCorreo() ? 'La clave está puesta.' : 'Falta la variable RESEND_API_KEY: no sale ningún correo.',
  )
  añadir(
    remitente ? 'ok' : 'mal',
    'Remitente de los correos',
    remitente ? `Se envían como: ${remitente}` : 'Falta en Correos y avisos: sin remitente no sale ningún correo.',
  )
  añadir(
    avisos?.correoAvisos ? 'ok' : 'aviso',
    'Correo donde recibes los avisos',
    avisos?.correoAvisos
      ? `Los mensajes del formulario llegan a ${avisos.correoAvisos}`
      : 'Vacío en Correos y avisos: los mensajes se guardan en el buzón, pero no te llega aviso.',
  )

  // Prueba de envío
  let prueba: Punto | null = null
  if (enviarPrueba) {
    const para = (user as any).email
    if (!hayCorreo() || !remitente) {
      prueba = { estado: 'mal', titulo: 'Correo de prueba', detalle: 'Faltan la clave de Resend o el remitente.' }
    } else {
      const r = await enviarCorreo({
        para,
        remitente,
        tipo: 'prueba',
        asunto: 'Correo de prueba del sitio',
        html: `<p>Esto es una prueba enviada desde el panel de ${negocio?.nombre || 'tu sitio'}. Si lo recibes, los correos funcionan.</p>`,
      })
      prueba = r.ok
        ? { estado: 'ok', titulo: 'Correo de prueba', detalle: `Enviado a ${para}. Revisa tu bandeja y la carpeta de spam.` }
        : { estado: 'mal', titulo: 'Correo de prueba', detalle: `No se pudo enviar: ${r.error}` }
    }
  }

  if (optimizar) {
    const r = await optimizarImagenes(payload, true)
    añadir(
      r.fallidas.length ? 'aviso' : 'ok',
      'Imágenes optimizadas',
      `${r.optimizadas} listas.${r.pendientes ? ` Faltan ${r.pendientes}: vuelve a pulsar el botón.` : ' No queda ninguna pendiente.'}${
        r.fallidas.length ? ` Fallaron: ${r.fallidas.join(', ')}` : ''
      }`,
    )
  }

  // Logo de los correos
  const pngDe = (m: any) => m?.sizes?.correo?.url || (/(png|jpe?g)$/i.test(m?.mimeType || '') ? m?.url : null)
  const logoCorreo = pngDe(negocio?.logoBlanco) || pngDe(negocio?.logo)
  añadir(
    logoCorreo ? 'ok' : 'aviso',
    'Logo en los correos',
    logoCorreo
      ? 'Los correos salen con tu logo.'
      : negocio?.logo || negocio?.logoBlanco
        ? 'Tu logo está en WebP, que muchos gestores de correo no muestran. Pulsa "Optimizar imágenes subidas" para generar la versión PNG (puede necesitar varios clics).'
        : 'No hay logo en Datos del negocio: los correos salen con el nombre escrito.',
  )

  // Negocio y módulos
  añadir(
    negocio?.whatsapp ? 'ok' : 'aviso',
    'Datos del negocio',
    `${negocio?.nombre || 'Sin nombre'}${negocio?.whatsapp ? ` · WhatsApp ${negocio.whatsapp}` : ' · sin WhatsApp'}${negocio?.correo ? ` · ${negocio.correo}` : ''}`,
  )
  const encendidos = Object.entries(modulos || {})
    .filter(([k, v]) => ['blog', 'boletin', 'recursos', 'tienda'].includes(k) && v !== false)
    .map(([k]) => ({ blog: 'Blog', boletin: 'Boletín', recursos: 'Recursos', tienda: 'Tienda' })[k])
  añadir('ok', 'Módulos encendidos', encendidos.join(', ') || 'Ninguno')

  if (modulos?.tienda) {
    añadir(
      env('NEXT_PUBLIC_WOMPI_PUBLIC_KEY') && env('WOMPI_INTEGRITY_SECRET') ? 'ok' : 'mal',
      'Pagos (Wompi)',
      env('NEXT_PUBLIC_WOMPI_PUBLIC_KEY') ? 'Llaves puestas.' : 'La tienda está encendida pero faltan las llaves de Wompi: no se puede cobrar.',
    )
  }

  const ultimos = await payload
    .find({ collection: 'registroCorreos', sort: '-createdAt', limit: 6, depth: 0 })
    .then((r) => r.docs as any[])
    .catch(() => [])

  return (
    <DefaultTemplate
      i18n={initPageResult.req.i18n}
      locale={initPageResult.locale}
      params={await params}
      payload={payload}
      permissions={initPageResult.permissions}
      searchParams={sp}
      user={user}
      visibleEntities={initPageResult.visibleEntities}
    >
      <Gutter>
        <div className="revision">
          <h1>Revisión del sitio</h1>
          <p className="revision__intro">
            Comprueba que todo lo que necesita una conexión externa esté funcionando. Aquí nunca se muestran claves.
          </p>

          {resultadoEjemplo && (
            <div className={`revision__punto revision__punto--${resultadoEjemplo.estado} revision__punto--destacado`}>
              <span aria-hidden="true">{ICONO[resultadoEjemplo.estado]}</span>
              <div>
                <strong>{resultadoEjemplo.titulo}</strong>
                <span>{resultadoEjemplo.detalle}</span>
              </div>
            </div>
          )}

          {sitioVacio && (
            <div className="revision__punto revision__punto--aviso revision__punto--destacado">
              <span aria-hidden="true">!</span>
              <div>
                <strong>El sitio está vacío</strong>
                <span>
                  Puedes cargar un contenido de ejemplo (inicio, contacto, preguntas, legales y menú) para editarlo desde el panel. Si el
                  cliente ya tiene su propio diseño, no hace falta.
                </span>
                <form method="POST" action="/next/sembrar-ejemplo" style={{ marginTop: 10 }}>
                  <button type="submit" className="btn btn--style-primary btn--size-small" style={{ margin: 0 }}>
                    Cargar contenido de ejemplo
                  </button>
                </form>
              </div>
            </div>
          )}

          {prueba && (
            <div className={`revision__punto revision__punto--${prueba.estado} revision__punto--destacado`}>
              <span aria-hidden="true">{ICONO[prueba.estado]}</span>
              <div>
                <strong>{prueba.titulo}</strong>
                <span>{prueba.detalle}</span>
              </div>
            </div>
          )}

          <ul className="revision__lista">
            {puntos.map((p) => (
              <li key={p.titulo} className={`revision__punto revision__punto--${p.estado}`}>
                <span aria-hidden="true">{ICONO[p.estado]}</span>
                <div>
                  <strong>{p.titulo}</strong>
                  <span>{p.detalle}</span>
                </div>
              </li>
            ))}
          </ul>

          {ultimos.length > 0 && (
            <>
              <h2 className="revision__subtitulo">Últimos correos que salieron</h2>
              <ul className="revision__lista">
                {ultimos.map((c) => (
                  <li key={c.id} className={`revision__punto revision__punto--${c.ok ? 'ok' : 'mal'}`}>
                    <span aria-hidden="true">{c.ok ? '✓' : '✗'}</span>
                    <div>
                      <strong>{c.asunto}</strong>
                      <span>
                        {c.para} · {new Date(c.createdAt).toLocaleString('es-CO', { timeZone: 'America/Bogota' })}
                        {c.error ? ` · ${c.error}` : ''}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </>
          )}

          <div className="revision__acciones">
            <a className="btn btn--style-primary btn--size-small" href="/admin/revision?probarCorreo=1">
              Enviarme un correo de prueba
            </a>
            <a className="btn btn--style-secondary btn--size-small" href="/admin/revision?optimizar=1">
              Optimizar imágenes subidas
            </a>
            <a className="btn btn--style-secondary btn--size-small" href="/admin/globals/avisos">
              Correos y avisos
            </a>
            <a className="btn btn--style-secondary btn--size-small" href="/admin/globals/tienda">
              Datos del negocio
            </a>
          </div>
        </div>
      </Gutter>
    </DefaultTemplate>
  )
}
