'use client'

import React, { useCallback, useEffect, useRef, useState } from 'react'

import './iwe.scss'

type Accion = { id?: number | string; detalle: string; estado: 'ejecutada' | 'propuesta' | 'fallida'; enlace?: string }
type Mensaje = { role: 'user' | 'assistant'; content: string; acciones?: Accion[]; error?: boolean; via?: string; respaldo?: boolean; fecha?: string }
type Conversacion = { id: number | string; titulo?: string; mensajes?: Mensaje[]; estado?: 'lista' | 'trabajando'; progreso?: string | null }
type Resumen = { id: number | string; titulo?: string; estado?: string; fecha?: string }
type Propuesta = { id: number | string; detalle: string }
type Estado = { nombre: string; activo?: boolean; listo: boolean; aviso: string | null; proveedor: string; pendientes: Propuesta[]; conversaciones: Resumen[]; colores?: { acento?: string | null; oscuro?: string | null } }
type Decision = { estado: 'aprobando' | 'cancelando' | 'hecho' | 'cancelado' | 'fallo'; mensaje?: string }

const RECUERDO = 'iwe-panel'

const OPCIONES = [
  { titulo: 'Escribir un artículo', texto: 'Investiga la búsqueda y escribe un borrador de artículo sobre ' },
  { titulo: 'Convertir un video de YouTube', texto: 'Convierte este video en un artículo, un boletín y publicaciones para redes, adaptados a nuestra marca: ' },
  { titulo: 'Investigar un tema', texto: 'Investiga en internet y resúmeme con fuentes: ' },
  { titulo: 'Ideas de palabras clave', texto: 'Propón 10 búsquedas para artículos del blog con su intención y por qué nos convienen, sobre ' },
  { titulo: 'Crear una imagen', texto: 'Crea una imagen horizontal para ' },
  { titulo: 'Revisar el buzón', enviar: 'Resúmeme los mensajes nuevos del buzón y dime cuáles son más urgentes' },
  { titulo: 'Comentarios pendientes', enviar: '¿Qué comentarios están pendientes? Propón una respuesta para cada uno' },
  { titulo: 'Preparar un boletín', enviar: 'Prepara un borrador de boletín con los artículos más recientes' },
  { titulo: '¿Cómo va el sitio?', enviar: '¿Cómo va el sitio esta semana? Visitas, mensajes y lo que deba atender' },
  { titulo: 'Correos con problemas', enviar: '¿Hay correos que fallaron? Explícame por qué' },
]

/** Escapa HTML y aplica un Markdown mínimo: negritas, títulos, listas y enlaces seguros. */
function aHtml(texto: string) {
  const esc = texto.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
  const enLinea = (s: string) =>
    s
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      .replace(/\[([^\]]+)\]\(((?:\/admin|https:\/\/)[^\s)]*)\)/g, (_m, t, u) => `<a href="${u}"${u.startsWith('https') ? ' target="_blank" rel="noopener noreferrer"' : ''}>${t}</a>`)
      .replace(/(^|[\s(])(\/admin\/[\w\-/?=&.]+)/g, '$1<a href="$2">$2</a>')
  let html = ''
  let lista: 'ul' | 'ol' | null = null
  const cerrar = () => {
    if (lista) html += `</${lista}>`
    lista = null
  }
  for (const linea of esc.split(/\r?\n/)) {
    const titulo = linea.match(/^#{1,4}\s+(.*)/)
    const vineta = linea.match(/^\s*[-*•]\s+(.*)/)
    const numero = linea.match(/^\s*\d+[.)]\s+(.*)/)
    if (vineta || numero) {
      const tipo = vineta ? 'ul' : 'ol'
      if (lista !== tipo) {
        cerrar()
        html += `<${tipo}>`
        lista = tipo
      }
      html += `<li>${enLinea((vineta || numero)![1])}</li>`
      continue
    }
    cerrar()
    if (titulo) html += `<h4>${enLinea(titulo[1])}</h4>`
    else if (linea.trim()) html += `<p>${enLinea(linea)}</p>`
  }
  cerrar()
  return html
}

const leerRecuerdo = (): { abierto?: boolean; conversacion?: number | string | null } => {
  try {
    return JSON.parse(localStorage.getItem(RECUERDO) || '{}')
  } catch {
    return {}
  }
}
const guardarRecuerdo = (datos: object) => {
  try {
    localStorage.setItem(RECUERDO, JSON.stringify({ ...leerRecuerdo(), ...datos }))
  } catch {}
}

/**
 * Dictado por voz con el reconocimiento del navegador (Chrome, Edge, Safari).
 * Sigue escuchando aunque hagas pausas, hasta que pulses el micrófono otra vez.
 */
function useDictado(alCambiar: (texto: string) => void) {
  const [escuchando, setEscuchando] = useState(false)
  const [disponible, setDisponible] = useState(false)
  const [problema, setProblema] = useState<string | null>(null)
  const reconocedor = useRef<any>(null)
  const quiere = useRef(false)
  const acumulado = useRef('')

  useEffect(() => {
    setDisponible(Boolean((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition))
    return () => {
      quiere.current = false
      reconocedor.current?.abort?.()
    }
  }, [])

  const arrancar = () => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SR) return
    const r = new SR()
    r.lang = 'es-CO'
    r.continuous = true
    r.interimResults = true
    const base = acumulado.current
    r.onresult = (e: any) => {
      let dicho = ''
      for (let i = 0; i < e.results.length; i++) dicho += e.results[i][0].transcript
      const texto = `${base}${base && dicho ? ' ' : ''}${dicho.trim()}`
      alCambiar(texto)
      // Lo ya confirmado queda como base si el navegador corta y hay que volver a arrancar.
      let final = ''
      for (let i = 0; i < e.results.length; i++) if (e.results[i].isFinal) final += e.results[i][0].transcript
      if (final.trim()) acumulado.current = `${base}${base ? ' ' : ''}${final.trim()}`
    }
    r.onerror = (e: any) => {
      const tipo = e?.error
      if (tipo === 'no-speech' || tipo === 'aborted') return
      quiere.current = false
      setProblema(
        tipo === 'not-allowed' || tipo === 'service-not-allowed'
          ? 'El navegador no dio permiso al micrófono. Pulsa el candado junto a la dirección, permite el micrófono y recarga la página.'
          : tipo === 'audio-capture'
            ? 'No se encontró un micrófono conectado.'
            : tipo === 'network'
              ? 'El dictado necesita internet y no pudo conectarse. Inténtalo de nuevo.'
              : 'El dictado se detuvo. Inténtalo de nuevo.',
      )
    }
    r.onend = () => {
      // Chrome corta tras unos segundos de silencio: si la persona no lo apagó, se vuelve a encender.
      if (quiere.current) {
        try {
          arrancar()
          return
        } catch {}
      }
      setEscuchando(false)
    }
    reconocedor.current = r
    r.start()
  }

  const iniciar = (textoActual: string) => {
    setProblema(null)
    acumulado.current = textoActual.trim()
    quiere.current = true
    try {
      arrancar()
      setEscuchando(true)
    } catch {
      quiere.current = false
      setProblema('No se pudo encender el micrófono. Recarga la página e inténtalo de nuevo.')
    }
  }
  const detener = () => {
    quiere.current = false
    reconocedor.current?.stop?.()
    setEscuchando(false)
  }
  return { disponible, escuchando, problema, iniciar, detener }
}

const Icono = {
  micro: (
    <svg aria-hidden="true" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <rect x="9" y="3" width="6" height="11" rx="3" />
      <path d="M5 11a7 7 0 0 0 14 0M12 18v3" />
    </svg>
  ),
  enviar: (
    <svg aria-hidden="true" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h13M13 6l6 6-6 6" />
    </svg>
  ),
  historial: (
    <svg aria-hidden="true" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M3 12a9 9 0 1 0 3-6.7L3 8M3 3v5h5M12 7v5l3 2" />
    </svg>
  ),
  nueva: (
    <svg aria-hidden="true" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M12 5v14M5 12h14" />
    </svg>
  ),
  ampliar: (
    <svg aria-hidden="true" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M14 4h6v6M10 20H4v-6M20 4l-7 7M4 20l7-7" />
    </svg>
  ),
  cerrar: (
    <svg aria-hidden="true" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  ),
  ajustes: (
    <svg aria-hidden="true" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z" />
    </svg>
  ),
}

/**
 * El asistente del panel. En modo "flotante" es la burbuja de la esquina
 * que acompaña en todas las pantallas; en modo "pagina" ocupa /admin/asistente.
 */
export function IWe({ modo = 'flotante' }: { modo?: 'flotante' | 'pagina' }) {
  const flotante = modo === 'flotante'
  const [abierto, setAbierto] = useState(!flotante)
  const [estado, setEstado] = useState<Estado | null>(null)
  const [conversacion, setConversacion] = useState<Conversacion | null>(null)
  const [vista, setVista] = useState<'chat' | 'historial'>('chat')
  const [texto, setTexto] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [aviso, setAviso] = useState<string | null>(null)
  const [decisiones, setDecisiones] = useState<Record<string, Decision>>({})
  const final = useRef<HTMLDivElement>(null)
  const campo = useRef<HTMLTextAreaElement>(null)
  const dictado = useDictado(setTexto)

  const trabajando = conversacion?.estado === 'trabajando'

  const cargarEstado = useCallback(async () => {
    try {
      const res = await fetch('/next/asistente', { credentials: 'include' })
      if (res.ok) setEstado(await res.json())
    } catch {}
  }, [])

  const abrirConversacion = useCallback(async (id: number | string) => {
    try {
      const res = await fetch(`/next/asistente/conversacion?id=${encodeURIComponent(String(id))}`, { credentials: 'include' })
      if (!res.ok) {
        guardarRecuerdo({ conversacion: null })
        return
      }
      const json = await res.json()
      setConversacion(json.conversacion)
      setVista('chat')
      guardarRecuerdo({ conversacion: id })
    } catch {}
  }, [])

  // Al montar: recuerda si estaba abierta y en qué conversación.
  useEffect(() => {
    const r = leerRecuerdo()
    if (flotante && r.abierto) setAbierto(true)
    if (r.conversacion) abrirConversacion(r.conversacion)
    cargarEstado()
  }, [flotante, abrirConversacion, cargarEstado])

  useEffect(() => {
    if (flotante) guardarRecuerdo({ abierto })
    if (abierto) cargarEstado()
  }, [abierto, flotante, cargarEstado])

  // Mientras trabaja, consulta cada 2,5 s hasta que llega la respuesta.
  useEffect(() => {
    if (!trabajando || !conversacion) return
    const reloj = setInterval(async () => {
      try {
        const res = await fetch(`/next/asistente/conversacion?id=${conversacion.id}`, { credentials: 'include' })
        if (!res.ok) return
        const json = await res.json()
        setConversacion(json.conversacion)
        if (json.conversacion?.estado !== 'trabajando') cargarEstado()
      } catch {}
    }, 2500)
    return () => clearInterval(reloj)
  }, [trabajando, conversacion?.id, cargarEstado]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    final.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [conversacion?.mensajes?.length, conversacion?.progreso, abierto, vista])

  const enviar = async (contenido: string) => {
    const limpio = contenido.trim()
    if (!limpio || enviando || trabajando) return
    if (dictado.escuchando) dictado.detener()
    setEnviando(true)
    setAviso(null)
    const previa = conversacion
    // Se muestra de inmediato; el servidor devuelve la versión guardada.
    setConversacion({ ...(previa || { id: 'nueva' }), estado: 'trabajando', progreso: 'Pensando…', mensajes: [...(previa?.mensajes || []), { role: 'user', content: limpio }] })
    setTexto('')
    try {
      const res = await fetch('/next/asistente', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ texto: limpio, conversacion: previa?.id && previa.id !== 'nueva' ? previa.id : null }),
      })
      const json = await res.json().catch(() => ({ error: `El servidor respondió ${res.status}.` }))
      if (json.error) {
        setConversacion(previa)
        setTexto(limpio)
        setAviso(json.error)
      } else {
        setConversacion(json.conversacion)
        guardarRecuerdo({ conversacion: json.conversacion.id })
      }
    } catch {
      setConversacion(previa)
      setTexto(limpio)
      setAviso('Se perdió la conexión. Inténtalo de nuevo.')
    } finally {
      setEnviando(false)
    }
  }

  const nueva = () => {
    setConversacion(null)
    setVista('chat')
    setAviso(null)
    guardarRecuerdo({ conversacion: null })
    setTimeout(() => campo.current?.focus(), 50)
  }

  const borrar = async (id: Resumen['id']) => {
    if (!window.confirm('¿Borrar esta conversación del historial? Lo que ya se hizo no se deshace.')) return
    await fetch(`/next/asistente/conversacion?id=${encodeURIComponent(String(id))}`, { method: 'DELETE', credentials: 'include' }).catch(() => null)
    if (String(conversacion?.id) === String(id)) nueva()
    cargarEstado()
  }

  const decidir = async (id: Propuesta['id'], decision: 'aprobar' | 'cancelar') => {
    const clave = String(id)
    setDecisiones((d) => ({ ...d, [clave]: { estado: decision === 'aprobar' ? 'aprobando' : 'cancelando' } }))
    try {
      const res = await fetch('/next/asistente/confirmar', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, decision }),
      })
      const json = await res.json().catch(() => ({ ok: false, mensaje: `Error ${res.status}` }))
      setDecisiones((d) => ({
        ...d,
        [clave]: { estado: json.ok ? (decision === 'aprobar' ? 'hecho' : 'cancelado') : 'fallo', mensaje: json.resultado?.enlace ? `${json.mensaje} Ver: ${json.resultado.enlace}` : json.mensaje },
      }))
    } catch {
      setDecisiones((d) => ({ ...d, [clave]: { estado: 'fallo', mensaje: 'Se perdió la conexión.' } }))
    }
  }

  const nombre = estado?.nombre || 'Asistente'
  const esColor = (c?: string | null) => (c && /^#[0-9a-f]{3,8}$/i.test(c) ? c : undefined)
  const colores = {
    ...(esColor(estado?.colores?.acento) ? { '--iwe-acento': estado!.colores!.acento } : {}),
    ...(esColor(estado?.colores?.oscuro) ? { '--iwe-oscuro': estado!.colores!.oscuro } : {}),
  } as React.CSSProperties
  const listo = Boolean(estado?.listo)
  const pendientes = estado?.pendientes || []
  const sinResolver = pendientes.filter((p) => !decisiones[String(p.id)] || ['aprobando', 'cancelando'].includes(decisiones[String(p.id)].estado)).length
  const mensajes = conversacion?.mensajes || []

  const burbuja = flotante ? (
    <button
      aria-expanded={abierto}
      aria-label={abierto ? `Cerrar ${nombre}` : `Abrir ${nombre}, tu asistente`}
      className={`iwe__burbuja${abierto ? ' iwe__burbuja--abierta' : ''}`}
      style={colores}
      onClick={() => setAbierto((a) => !a)}
      type="button"
    >
      {abierto ? Icono.cerrar : <span className="iwe__marca">{nombre}</span>}
      {!abierto && (sinResolver > 0 || trabajando) ? <span className={`iwe__punto${trabajando ? ' iwe__punto--trabajando' : ''}`}>{trabajando ? '' : sinResolver}</span> : null}
    </button>
  ) : null

  if (flotante && !abierto) return burbuja

  return (
    <>
      <section aria-label={`${nombre}, asistente del panel`} className={`iwe iwe--${modo}`} style={colores}>
        <header className="iwe__cabecera">
          <div className="iwe__identidad">
            <span className="iwe__avatar" aria-hidden="true">
              {nombre.slice(0, 3)}
            </span>
            <div>
              <strong>{nombre}</strong>
              <small>{trabajando ? conversacion?.progreso || 'Trabajando…' : listo ? 'Listo para ayudarte' : estado?.aviso || 'Cargando…'}</small>
            </div>
          </div>
          <div className="iwe__herramientas">
            <button aria-label="Historial" className={vista === 'historial' ? 'activo' : ''} onClick={() => setVista((v) => (v === 'historial' ? 'chat' : 'historial'))} title="Historial" type="button">
              {Icono.historial}
            </button>
            <button aria-label="Nueva conversación" onClick={nueva} title="Nueva conversación" type="button">
              {Icono.nueva}
            </button>
            <a aria-label="Ajustes del asistente" href="/admin/globals/asistente" title="Ajustes">
              {Icono.ajustes}
            </a>
            {flotante ? (
              <>
                <a aria-label="Abrir en pantalla completa" href="/admin/asistente" title="Pantalla completa">
                  {Icono.ampliar}
                </a>
                <button aria-label="Cerrar" onClick={() => setAbierto(false)} title="Cerrar" type="button">
                  {Icono.cerrar}
                </button>
              </>
            ) : null}
          </div>
        </header>

        <div className="iwe__cuerpo">
          {vista === 'historial' ? (
            <div className="iwe__historial">
              <h3>Conversaciones</h3>
              {estado?.conversaciones?.length ? (
                <ul>
                  {estado.conversaciones.map((c) => (
                    <li className={String(c.id) === String(conversacion?.id) ? 'actual' : ''} key={String(c.id)}>
                      <button onClick={() => abrirConversacion(c.id)} type="button">
                        <span>{c.titulo || 'Sin título'}</span>
                        <small>
                          {c.estado === 'trabajando' ? 'Trabajando… · ' : ''}
                          {c.fecha ? new Date(c.fecha).toLocaleString('es-CO', { day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' }) : ''}
                        </small>
                      </button>
                      <button aria-label="Borrar conversación" className="iwe__borrar" onClick={() => borrar(c.id)} title="Borrar" type="button">
                        {Icono.cerrar}
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="iwe__nota">Aún no hay conversaciones guardadas.</p>
              )}
            </div>
          ) : (
            <>
              {!listo && estado ? (
                <p className="iwe__aviso">
                  {estado.aviso} <a href="/admin/globals/asistente">Configurar el asistente</a>
                </p>
              ) : null}

              {pendientes.length ? (
                <div className="iwe__pendientes">
                  {pendientes.map((p) => {
                    const d = decisiones[String(p.id)]
                    const resuelta = d && ['hecho', 'cancelado', 'fallo'].includes(d.estado)
                    return (
                      <div className={`iwe__propuesta${resuelta ? ` iwe__propuesta--${d.estado}` : ''}`} key={String(p.id)}>
                        <span className="iwe__etiqueta">Necesita tu aprobación</span>
                        <p>{p.detalle}</p>
                        {resuelta ? (
                          <p className="iwe__decision">
                            {d.estado === 'hecho' ? '✓ ' : d.estado === 'fallo' ? '✗ ' : ''}
                            {d.mensaje}
                          </p>
                        ) : (
                          <div className="iwe__botones">
                            <button className="iwe__aprobar" disabled={Boolean(d)} onClick={() => decidir(p.id, 'aprobar')} type="button">
                              {d?.estado === 'aprobando' ? 'Aprobando…' : 'Aprobar'}
                            </button>
                            <button className="iwe__cancelar" disabled={Boolean(d)} onClick={() => decidir(p.id, 'cancelar')} type="button">
                              Cancelar
                            </button>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              ) : null}

              {!mensajes.length ? (
                <div className="iwe__bienvenida">
                  <p>
                    Hola, soy <strong>{nombre}</strong>. Escríbeme o dicta con el micrófono lo que necesitas. Lo que publique o envíe esperará tu aprobación.
                  </p>
                  <div className="iwe__opciones">
                    {OPCIONES.map((o) => (
                      <button
                        disabled={!listo}
                        key={o.titulo}
                        onClick={() => {
                          if (o.enviar) enviar(o.enviar)
                          else {
                            setTexto(o.texto || '')
                            setTimeout(() => campo.current?.focus(), 30)
                          }
                        }}
                        type="button"
                      >
                        {o.titulo}
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}

              {mensajes.map((m, i) => (
                <div className={`iwe__mensaje iwe__mensaje--${m.role}${m.error ? ' iwe__mensaje--error' : ''}`} key={i}>
                  {m.role === 'user' ? <p>{m.content}</p> : <div dangerouslySetInnerHTML={{ __html: aHtml(m.content || '') }} />}
                  {m.acciones?.some((a) => a.estado !== 'propuesta') ? (
                    <ul className="iwe__acciones">
                      {m.acciones
                        .filter((a) => a.estado !== 'propuesta')
                        .map((a, j) => (
                          <li className={`iwe__accion--${a.estado}`} key={j}>
                            {a.estado === 'ejecutada' ? '✓ ' : '✗ '}
                            {a.detalle}
                            {a.enlace ? (
                              <>
                                {' · '}
                                <a href={a.enlace}>Abrir</a>
                              </>
                            ) : null}
                          </li>
                        ))}
                    </ul>
                  ) : null}
                  {m.acciones?.some((a) => a.estado === 'propuesta') ? <p className="iwe__nota">Dejé arriba lo que necesita tu aprobación.</p> : null}
                  {m.respaldo && m.via ? <p className="iwe__nota">Respondí con la conexión de respaldo ({m.via}) porque la principal falló.</p> : null}
                </div>
              ))}

              {trabajando ? (
                <div className="iwe__mensaje iwe__mensaje--assistant iwe__pensando" role="status">
                  <span className="iwe__puntos" aria-hidden="true">
                    <i />
                    <i />
                    <i />
                  </span>
                  {conversacion?.progreso || 'Pensando…'}
                  <small>Puedes seguir usando el panel: te dejo la respuesta aquí.</small>
                </div>
              ) : null}
              <div ref={final} />
            </>
          )}
        </div>

        <form
          className="iwe__formulario"
          onSubmit={(e) => {
            e.preventDefault()
            enviar(texto)
          }}
        >
          {aviso ? <p className="iwe__error">{aviso}</p> : null}
          {dictado.escuchando ? <p className="iwe__escuchando">● Escuchando… habla con naturalidad y pulsa el micrófono para terminar.</p> : null}
          {dictado.problema && !dictado.escuchando ? <p className="iwe__error">{dictado.problema}</p> : null}
          <div className="iwe__caja">
            <textarea
              aria-label={`Escribe a ${nombre}`}
              disabled={!listo}
              maxLength={8000}
              onChange={(e) => setTexto(e.target.value)}
              onFocus={() => setVista('chat')}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  enviar(texto)
                }
              }}
              placeholder={!listo ? 'Configura el asistente para empezar' : trabajando ? 'Espera a que termine…' : 'Escribe o dicta tu pedido…'}
              ref={campo}
              rows={2}
              value={texto}
            />
            {dictado.disponible ? (
              <button
                aria-label={dictado.escuchando ? 'Terminar de dictar' : 'Dictar con el micrófono'}
                aria-pressed={dictado.escuchando}
                className={`iwe__micro${dictado.escuchando ? ' iwe__micro--activo' : ''}`}
                disabled={!listo}
                onClick={() => (dictado.escuchando ? dictado.detener() : dictado.iniciar(texto))}
                title={dictado.escuchando ? 'Terminar de dictar' : 'Dictar'}
                type="button"
              >
                {Icono.micro}
              </button>
            ) : null}
            <button aria-label="Enviar" className="iwe__enviar" disabled={!listo || enviando || trabajando || !texto.trim()} title="Enviar" type="submit">
              {Icono.enviar}
            </button>
          </div>
          {listo && estado?.proveedor ? <small className="iwe__pie">Con {estado.proveedor} · Enter para enviar, Shift+Enter para otra línea</small> : null}
        </form>
      </section>
      {burbuja}
    </>
  )
}

export default IWe
