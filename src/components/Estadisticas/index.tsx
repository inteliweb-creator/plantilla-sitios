import { sql } from '@payloadcms/db-sqlite'
import type { Payload } from 'payload'
import React from 'react'

import { modulosActivos } from '@/modulos'

import './index.scss'

/**
 * Estadísticas en el inicio del panel: visitas, personas, de dónde llegan,
 * qué páginas leen, clics a WhatsApp, mensajes y suscriptores. Salen de la
 * colección Visitas (sin cookies) y del buzón y el boletín.
 */

// Colombia no cambia de hora: los días se cortan a medianoche de Bogotá.
const ZONA = '-5 hours'
const PERIODOS = [7, 30, 90]

const NOMBRES_FUENTE: Record<string, string> = {
  directo: 'Directo (escriben la dirección o guardado)',
  buscador: 'Buscadores (Google, Bing…)',
  redes: 'Redes sociales',
  ia: 'Asistentes de IA (ChatGPT, Gemini…)',
  correo: 'Correo',
  anuncios: 'Anuncios',
  otros: 'Otros sitios',
}
const NOMBRES_DISPOSITIVO: Record<string, string> = { movil: 'Celular', tableta: 'Tableta', escritorio: 'Computador' }

const numero = (n: number) => new Intl.NumberFormat('es-CO').format(n)
const dia = (iso: string) =>
  new Date(`${iso}T12:00:00Z`).toLocaleDateString('es-CO', { day: 'numeric', month: 'short', timeZone: 'UTC' })

type Fila = Record<string, any>

async function consultar(payload: Payload, consulta: ReturnType<typeof sql>): Promise<Fila[]> {
  return (payload.db as any).drizzle.all(consulta)
}

function Variacion({ ahora, antes }: { ahora: number; antes: number }) {
  if (!antes && !ahora) return null
  if (!antes) return <span className="estadisticas__variacion estadisticas__variacion--sube">nuevo</span>
  const cambio = Math.round(((ahora - antes) / antes) * 100)
  const clase = cambio > 0 ? 'sube' : cambio < 0 ? 'baja' : 'igual'
  return (
    <span className={`estadisticas__variacion estadisticas__variacion--${clase}`} title="Comparado con el periodo anterior">
      {cambio > 0 ? '▲' : cambio < 0 ? '▼' : '='} {Math.abs(cambio)}%
    </span>
  )
}

function Barras({ filas, total }: { filas: { etiqueta: React.ReactNode; valor: number; extra?: string }[]; total: number }) {
  if (!filas.length) return <p className="estadisticas__vacio">Sin datos en este periodo.</p>
  return (
    <ul className="estadisticas__barras">
      {filas.map((f, i) => (
        <li key={i}>
          <div className="estadisticas__barra-texto">
            <span className="estadisticas__barra-etiqueta">{f.etiqueta}</span>
            <span className="estadisticas__barra-valor">
              {numero(f.valor)}
              {f.extra ? <small> · {f.extra}</small> : null}
            </span>
          </div>
          <div className="estadisticas__barra-fondo">
            <div className="estadisticas__barra" style={{ width: `${Math.max(2, (f.valor / Math.max(total, 1)) * 100)}%` }} />
          </div>
        </li>
      ))}
    </ul>
  )
}

export const Estadisticas = async ({ payload, searchParams }: { payload: Payload; searchParams?: Record<string, string | string[]> }) => {
  const pedido = Number(Array.isArray(searchParams?.dias) ? searchParams?.dias[0] : searchParams?.dias)
  const dias = PERIODOS.includes(pedido) ? pedido : 30
  const ahora = Date.now()
  const desde = new Date(ahora - dias * 86400000).toISOString()
  const antesDesde = new Date(ahora - 2 * dias * 86400000).toISOString()
  const m = await modulosActivos()

  const totales = (inicio: string, fin: string) =>
    consultar(
      payload,
      sql`select
        coalesce(sum(case when tipo = 'vista' then 1 else 0 end), 0) as vistas,
        count(distinct case when tipo = 'vista' then visitante || substr(created_at, 1, 10) end) as personas,
        coalesce(sum(case when tipo = 'whatsapp' then 1 else 0 end), 0) as whatsapp
      from visitas where created_at >= ${inicio} and created_at < ${fin}`,
    ).then((r) => ({ vistas: Number(r[0]?.vistas || 0), personas: Number(r[0]?.personas || 0), whatsapp: Number(r[0]?.whatsapp || 0) }))

  const finIso = new Date(ahora + 60000).toISOString()
  const contar = (collection: 'mensajes' | 'suscriptores', inicio: string, fin: string) =>
    payload
      .count({ collection, where: { and: [{ createdAt: { greater_than_equal: inicio } }, { createdAt: { less_than: fin } }] } })
      .then((r) => r.totalDocs)
      .catch(() => 0)

  const [actual, anterior, hoy, porDia, fuentes, referentes, paginas, dispositivos, whatsappDesde, paises, mensajes, mensajesAntes, suscriptores, suscriptoresAntes, hayAlguna, ultimos] =
    await Promise.all([
      totales(desde, finIso),
      totales(antesDesde, desde),
      consultar(payload, sql`select count(*) as n from visitas where tipo = 'vista' and date(created_at, ${ZONA}) = date('now', ${ZONA})`),
      consultar(
        payload,
        sql`select date(created_at, ${ZONA}) as dia, count(*) as vistas, count(distinct visitante) as personas
          from visitas where tipo = 'vista' and created_at >= ${desde} group by dia order by dia`,
      ),
      consultar(
        payload,
        sql`select fuente, count(*) as n from visitas
          where tipo = 'vista' and created_at >= ${desde} and fuente is not null and fuente != 'interno'
          group by fuente order by n desc`,
      ),
      consultar(
        payload,
        sql`select referente, count(*) as n from visitas
          where tipo = 'vista' and created_at >= ${desde} and referente is not null and referente != ''
          group by referente order by n desc limit 6`,
      ),
      consultar(
        payload,
        sql`select ruta, count(*) as n, count(distinct visitante || substr(created_at, 1, 10)) as personas from visitas
          where tipo = 'vista' and created_at >= ${desde} group by ruta order by n desc limit 10`,
      ),
      consultar(
        payload,
        sql`select dispositivo, count(*) as n from visitas where tipo = 'vista' and created_at >= ${desde} group by dispositivo order by n desc`,
      ),
      consultar(
        payload,
        sql`select ruta, count(*) as n from visitas where tipo = 'whatsapp' and created_at >= ${desde} group by ruta order by n desc limit 5`,
      ),
      consultar(
        payload,
        sql`select pais, count(*) as n from visitas
          where tipo = 'vista' and created_at >= ${desde} and pais is not null and pais != '' group by pais order by n desc limit 6`,
      ),
      contar('mensajes', desde, finIso),
      contar('mensajes', antesDesde, desde),
      m.boletin ? contar('suscriptores', desde, finIso) : Promise.resolve(0),
      m.boletin ? contar('suscriptores', antesDesde, desde) : Promise.resolve(0),
      consultar(payload, sql`select 1 as hay from visitas limit 1`).then((r) => r.length > 0),
      payload
        .find({ collection: 'mensajes', sort: '-createdAt', limit: 5, depth: 0, select: { nombre: true, necesita: true, estado: true, createdAt: true } })
        .then((r) => r.docs)
        .catch(() => []),
    ])

  // Títulos legibles para las direcciones más vistas.
  const [paginasCms, articulos, legales] = await Promise.all([
    payload.find({ collection: 'pages', limit: 100, depth: 0, pagination: false, select: { title: true, slug: true } }).then((r) => r.docs).catch(() => []),
    m.blog
      ? payload.find({ collection: 'articulos', limit: 200, depth: 0, pagination: false, select: { title: true, slug: true } }).then((r) => r.docs).catch(() => [])
      : Promise.resolve([]),
    payload.find({ collection: 'legales', limit: 50, depth: 0, pagination: false, select: { titulo: true, etiqueta: true, slug: true } }).then((r) => r.docs).catch(() => []),
  ])
  const titulos = new Map<string, string>()
  for (const p of paginasCms as any[]) titulos.set(p.slug === 'home' ? '/' : `/${p.slug}`, p.title)
  for (const a of articulos as any[]) titulos.set(`/blog/${a.slug}`, a.title)
  for (const l of legales as any[]) titulos.set(`/${l.slug}`, l.etiqueta || l.titulo)
  titulos.set('/blog', 'Blog')
  const titulo = (ruta: string) => titulos.get(ruta) || ruta

  // Todos los días del periodo, también los que no tuvieron visitas.
  const mapaDias = new Map(porDia.map((d) => [String(d.dia), d]))
  const serie: { dia: string; vistas: number; personas: number }[] = []
  const hoyBogota = new Date(ahora - 5 * 3600000)
  for (let i = dias - 1; i >= 0; i--) {
    const d = new Date(hoyBogota.getTime() - i * 86400000).toISOString().slice(0, 10)
    const fila = mapaDias.get(d)
    serie.push({ dia: d, vistas: Number(fila?.vistas || 0), personas: Number(fila?.personas || 0) })
  }
  const maximo = Math.max(1, ...serie.map((s) => s.vistas))
  const ancho = 100 / serie.length
  const totalFuentes = fuentes.reduce((n, f) => n + Number(f.n), 0)
  const totalDispositivos = dispositivos.reduce((n, f) => n + Number(f.n), 0)
  const cadaCuanto = Math.ceil(serie.length / 7)

  return (
    <section className="estadisticas">
      <header className="estadisticas__cabecera">
        <div>
          <h2>Cómo va tu sitio</h2>
          <p>
            Hoy: <strong>{numero(Number(hoy[0]?.n || 0))}</strong> páginas vistas. Tus visitas como administrador no cuentan.
          </p>
        </div>
        <nav className="estadisticas__periodos" aria-label="Periodo">
          {PERIODOS.map((p) => (
            <a key={p} href={`?dias=${p}`} className={p === dias ? 'activo' : ''} aria-current={p === dias ? 'true' : undefined}>
              {p} días
            </a>
          ))}
        </nav>
      </header>

      {!hayAlguna && (
        <p className="estadisticas__aviso">
          Aún no hay visitas registradas. Se cuentan solas desde que el sitio está publicado, sin cookies y sin datos personales.
        </p>
      )}

      <div className="estadisticas__tarjetas">
        <div className="estadisticas__tarjeta">
          <span>Páginas vistas</span>
          <strong>{numero(actual.vistas)}</strong>
          <Variacion ahora={actual.vistas} antes={anterior.vistas} />
        </div>
        <div className="estadisticas__tarjeta">
          <span>Personas</span>
          <strong>{numero(actual.personas)}</strong>
          <Variacion ahora={actual.personas} antes={anterior.personas} />
        </div>
        <div className="estadisticas__tarjeta">
          <span>Clics a WhatsApp</span>
          <strong>{numero(actual.whatsapp)}</strong>
          <Variacion ahora={actual.whatsapp} antes={anterior.whatsapp} />
        </div>
        <a className="estadisticas__tarjeta" href="/admin/collections/mensajes">
          <span>Mensajes recibidos</span>
          <strong>{numero(mensajes)}</strong>
          <Variacion ahora={mensajes} antes={mensajesAntes} />
        </a>
        {m.boletin && (
          <a className="estadisticas__tarjeta" href="/admin/collections/suscriptores">
            <span>Nuevos suscriptores</span>
            <strong>{numero(suscriptores)}</strong>
            <Variacion ahora={suscriptores} antes={suscriptoresAntes} />
          </a>
        )}
      </div>

      <div className="estadisticas__panel">
        <h3>Visitas por día</h3>
        <svg className="estadisticas__grafico" viewBox="0 0 100 40" preserveAspectRatio="none" role="img" aria-label={`Páginas vistas por día en los últimos ${dias} días`}>
          {serie.map((s, i) => {
            const alto = (s.vistas / maximo) * 38
            return (
              <rect key={s.dia} x={i * ancho + ancho * 0.15} y={40 - alto} width={ancho * 0.7} height={Math.max(alto, s.vistas ? 0.6 : 0.15)} rx={0.4}>
                <title>{`${dia(s.dia)}: ${s.vistas} vistas, ${s.personas} personas`}</title>
              </rect>
            )
          })}
        </svg>
        <div className="estadisticas__ejes">
          {serie.map((s, i) => (
            <span key={s.dia} style={{ width: `${ancho}%` }}>
              {i % cadaCuanto === 0 || i === serie.length - 1 ? dia(s.dia) : ''}
            </span>
          ))}
        </div>
      </div>

      <div className="estadisticas__rejilla">
        <div className="estadisticas__panel">
          <h3>Páginas más vistas</h3>
          <Barras
            total={Number(paginas[0]?.n || 0)}
            filas={paginas.map((p) => ({
              etiqueta: (
                <a href={p.ruta} target="_blank" rel="noreferrer" title={p.ruta}>
                  {titulo(String(p.ruta))}
                </a>
              ),
              valor: Number(p.n),
              extra: `${numero(Number(p.personas))} personas`,
            }))}
          />
        </div>

        <div className="estadisticas__panel">
          <h3>De dónde llegan</h3>
          <Barras
            total={totalFuentes}
            filas={fuentes.map((f) => ({
              etiqueta: NOMBRES_FUENTE[f.fuente] || f.fuente,
              valor: Number(f.n),
              extra: `${Math.round((Number(f.n) / Math.max(totalFuentes, 1)) * 100)}%`,
            }))}
          />
          {referentes.length > 0 && (
            <>
              <h4>Sitios que te enviaron visitas</h4>
              <ul className="estadisticas__lista">
                {referentes.map((r) => (
                  <li key={r.referente}>
                    <span>{r.referente}</span>
                    <span>{numero(Number(r.n))}</span>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>

        <div className="estadisticas__panel">
          <h3>Desde qué dispositivo</h3>
          <Barras
            total={totalDispositivos}
            filas={dispositivos
              .filter((d) => d.dispositivo)
              .map((d) => ({
                etiqueta: NOMBRES_DISPOSITIVO[d.dispositivo] || d.dispositivo,
                valor: Number(d.n),
                extra: `${Math.round((Number(d.n) / Math.max(totalDispositivos, 1)) * 100)}%`,
              }))}
          />
          {paises.length > 0 && (
            <>
              <h4>Países</h4>
              <ul className="estadisticas__lista">
                {paises.map((p) => (
                  <li key={p.pais}>
                    <span>{new Intl.DisplayNames(['es'], { type: 'region' }).of(p.pais) || p.pais}</span>
                    <span>{numero(Number(p.n))}</span>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>

        <div className="estadisticas__panel">
          <h3>Dónde pulsan WhatsApp</h3>
          <Barras
            total={Number(whatsappDesde[0]?.n || 0)}
            filas={whatsappDesde.map((w) => ({ etiqueta: titulo(String(w.ruta)), valor: Number(w.n) }))}
          />
          <h4>Últimos mensajes</h4>
          {ultimos.length ? (
            <ul className="estadisticas__lista">
              {(ultimos as any[]).map((u) => (
                <li key={u.id}>
                  <a href={`/admin/collections/mensajes/${u.id}`}>
                    {u.estado === 'nuevo' ? '● ' : ''}
                    {u.nombre}
                    {u.necesita ? ` · ${u.necesita}` : ''}
                  </a>
                  <span>{dia(String(u.createdAt).slice(0, 10))}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="estadisticas__vacio">Todavía no hay mensajes.</p>
          )}
        </div>
      </div>
    </section>
  )
}

export default Estadisticas
