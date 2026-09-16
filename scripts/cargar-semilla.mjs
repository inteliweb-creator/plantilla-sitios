/**
 * Se ejecuta al publicar (después de "payload migrate"): si la base de
 * producción está vacía, carga el contenido de semilla/contenido.json, y sube
 * a Vercel Blob las imágenes de semilla/media que aún no estén allí.
 *
 * Nunca pisa contenido: si la base ya tiene páginas, no toca nada. Si no hay
 * semilla o no hay base configurada, termina sin hacer nada.
 */
import fs from 'node:fs'
import path from 'node:path'
import { createClient } from '@libsql/client'

const SEMILLA = path.resolve('semilla')
const url = process.env.DATABASE_URL || process.env.TURSO_DATABASE_URL
const authToken = process.env.DATABASE_AUTH_TOKEN || process.env.TURSO_AUTH_TOKEN

if (!fs.existsSync(path.join(SEMILLA, 'contenido.json'))) {
  console.log('[semilla] No hay semilla: nada que cargar.')
  process.exit(0)
}
if (!url) {
  console.log('[semilla] No hay base de datos configurada: nada que cargar.')
  process.exit(0)
}

// ---------- Contenido
const db = createClient({ url, authToken })
const paginas = Number((await db.execute('select count(*) as n from pages')).rows[0].n)
if (paginas > 0) {
  console.log(`[semilla] La base ya tiene contenido (${paginas} páginas): no se toca.`)
} else {
  const { contenido } = JSON.parse(fs.readFileSync(path.join(SEMILLA, 'contenido.json'), 'utf8'))
  let total = 0
  for (const { tabla, filas } of contenido) {
    const columnas = new Set((await db.execute(`pragma table_info("${tabla}")`)).rows.map((r) => String(r.name)))
    if (!columnas.size) continue
    const cols = Object.keys(filas[0]).filter((c) => columnas.has(c))
    const sql = `insert or replace into "${tabla}" (${cols.map((c) => `"${c}"`).join(',')}) values (${cols.map(() => '?').join(',')})`
    for (let i = 0; i < filas.length; i += 200) {
      await db.batch(filas.slice(i, i + 200).map((f) => ({ sql, args: cols.map((c) => f[c] ?? null) })), 'write')
    }
    total += filas.length
  }
  console.log(`[semilla] Contenido cargado: ${total} filas de ${contenido.length} tablas.`)
}

// ---------- Imágenes
const token = process.env.BLOB_READ_WRITE_TOKEN
const carpeta = path.join(SEMILLA, 'media')
if (!token || !fs.existsSync(carpeta)) {
  console.log('[semilla] Sin Vercel Blob o sin imágenes: no se suben archivos.')
} else {
  const { head, put } = await import('@vercel/blob')
  const tipos = { '.webp': 'image/webp', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.svg': 'image/svg+xml', '.pdf': 'application/pdf', '.gif': 'image/gif' }
  let subidos = 0
  let yaEstaban = 0
  for (const f of fs.readdirSync(carpeta)) {
    try {
      await head(f, { token })
      yaEstaban++
      continue
    } catch {}
    await put(f, fs.readFileSync(path.join(carpeta, f)), {
      access: 'public',
      token,
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType: tipos[path.extname(f).toLowerCase()] || 'application/octet-stream',
    })
    subidos++
  }
  console.log(`[semilla] Imágenes: ${subidos} subidas, ${yaEstaban} ya estaban.`)
}
