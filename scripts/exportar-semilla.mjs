/**
 * Prepara el contenido inicial de un sitio para publicarlo: exporta la base
 * local a semilla/contenido.json y copia las imágenes que usa a semilla/media.
 * Al publicar en Vercel, scripts/cargar-semilla.mjs lo carga en la base de
 * producción (solo si está vacía) y sube las imágenes a Vercel Blob. Así no
 * hace falta copiar ninguna clave al computador.
 *
 *   node scripts/exportar-semilla.mjs
 *
 * No exporta: usuarios y sesiones (el dueño crea su cuenta en /admin),
 * suscriptores, datos de prueba de la tienda, visitas, preferencias del panel,
 * ni el correo privado de avisos.
 */
import fs from 'node:fs'
import path from 'node:path'
import { createClient } from '@libsql/client'

const ORIGEN = process.env.ORIGEN_DB || 'file:./mi-sitio.db'
const DESTINO = path.resolve('semilla')
const MEDIA = path.resolve('public/media')

const SALTAR = new Set([
  'payload_migrations', 'payload_preferences', 'payload_preferences_rels', 'payload_locked_documents', 'payload_locked_documents_rels',
  'payload_kv', 'payload_jobs', 'payload_jobs_log',
  'users', 'users_roles', 'users_sessions',
  'suscriptores', 'solicitudes_recurso', 'comentarios', 'mensajes',
  'carts', 'carts_items', 'orders', 'orders_items', 'orders_rels', 'transactions', 'transactions_items', 'transactions_rels', 'addresses',
  'forms_emails', 'visitas',
])

const db = createClient({ url: ORIGEN })
const tablas = (await db.execute("select name from sqlite_master where type='table' and name not like 'sqlite_%'")).rows.map((r) => String(r.name))

// Orden: primero las tablas de las que dependen otras.
const deps = new Map()
for (const t of tablas) deps.set(t, (await db.execute(`pragma foreign_key_list("${t}")`)).rows.map((r) => String(r.table)).filter((x) => x !== t))
const orden = []
const visto = new Set()
const visitar = (t) => {
  if (visto.has(t)) return
  visto.add(t)
  for (const d of deps.get(t) || []) visitar(d)
  orden.push(t)
}
tablas.forEach(visitar)

const contenido = []
for (const t of orden) {
  if (SALTAR.has(t)) continue
  const filas = (await db.execute(`select * from "${t}"`)).rows.map((f) => ({ ...f }))
  if (!filas.length) continue
  if (t === 'avisos') for (const f of filas) f.correo_avisos = null
  contenido.push({ tabla: t, filas })
}

fs.rmSync(DESTINO, { recursive: true, force: true })
fs.mkdirSync(path.join(DESTINO, 'media'), { recursive: true })
fs.writeFileSync(path.join(DESTINO, 'contenido.json'), JSON.stringify({ creado: new Date().toISOString(), contenido }))

// Solo las imágenes que usa algún registro de la biblioteca (original y tamaños).
const media = (await db.execute('select * from media')).rows
const usados = new Set()
for (const m of media) for (const [k, v] of Object.entries(m)) if ((k === 'filename' || /^sizes_.*_filename$/.test(k)) && v) usados.add(String(v))
let copiados = 0
for (const f of usados) {
  const origen = path.join(MEDIA, f)
  if (fs.existsSync(origen)) {
    fs.copyFileSync(origen, path.join(DESTINO, 'media', f))
    copiados++
  } else console.warn(`Falta en public/media: ${f}`)
}

const filas = contenido.reduce((n, t) => n + t.filas.length, 0)
console.log(`Semilla lista: ${filas} filas de ${contenido.length} tablas y ${copiados} archivos en semilla/`)
