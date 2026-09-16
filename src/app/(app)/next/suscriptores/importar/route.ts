import configPromise from '@payload-config'
import { headers } from 'next/headers'
import { getPayload } from 'payload'

import { checkRole } from '@/access/utilities'
import { modulosActivos } from '@/modulos'

/**
 * Importa suscriptores desde un CSV (el que exporta Excel, Mailchimp, Google
 * Contacts…). Reglas:
 *   - Solo administradores, y solo si confirman que tienen permiso de esas personas.
 *   - Quien se dio de baja NO se reactiva: pidió no recibir más correos.
 *   - Los repetidos y los correos mal escritos se saltan y se informan.
 */

const CORREO_VALIDO = /^[^@\s,;"']+@[^@\s,;"']+\.[^@\s,;"']+$/
const MAXIMO = 5000

/** Separa una línea de CSV respetando comillas. */
function celdas(linea: string, sep: string) {
  const r: string[] = []
  let actual = ''
  let comillas = false
  for (let i = 0; i < linea.length; i++) {
    const c = linea[i]
    if (c === '"') {
      if (comillas && linea[i + 1] === '"') {
        actual += '"'
        i++
      } else comillas = !comillas
    } else if (c === sep && !comillas) {
      r.push(actual)
      actual = ''
    } else actual += c
  }
  r.push(actual)
  return r.map((x) => x.trim())
}

function leerCsv(texto: string) {
  const lineas = texto.replace(/^﻿/, '').split(/\r\n|\n|\r/).filter((l) => l.trim())
  if (!lineas.length) return []
  const sep = [';', ',', '\t'].sort((a, b) => lineas[0].split(b).length - lineas[0].split(a).length)[0]
  const primera = celdas(lineas[0], sep).map((x) => x.toLowerCase())
  const colCorreo = primera.findIndex((x) => /^(correo|e-?mail|email address|correo electr[oó]nico|mail)$/.test(x))
  const colNombre = primera.findIndex((x) => /^(nombre|name|first name|nombres|nombre completo)$/.test(x))
  const tieneEncabezado = colCorreo >= 0 || !primera.some((x) => CORREO_VALIDO.test(x))
  const filas = (tieneEncabezado ? lineas.slice(1) : lineas).map((l) => celdas(l, sep))
  return filas.map((f) => {
    const correo = (colCorreo >= 0 ? f[colCorreo] : f.find((x) => x.includes('@'))) || ''
    const nombre = colNombre >= 0 ? f[colNombre] : colCorreo < 0 ? f.find((x) => x && !x.includes('@')) : ''
    return { correo: correo.toLowerCase().trim(), nombre: (nombre || '').slice(0, 120) }
  })
}

export async function POST(req: Request) {
  const payload = await getPayload({ config: configPromise })
  const { user } = await payload.auth({ headers: await headers() })
  if (!user || !checkRole(['admin'], user as any)) return Response.json({ ok: false, mensaje: 'No autorizado.' }, { status: 403 })
  if (!(await modulosActivos()).boletin) return Response.json({ ok: false, mensaje: 'El módulo Boletín está apagado.' }, { status: 404 })

  let cuerpo: any
  try {
    cuerpo = await req.json()
  } catch {
    return Response.json({ ok: false, mensaje: 'No se pudo leer el archivo.' }, { status: 400 })
  }
  if (cuerpo?.confirmo !== true) {
    return Response.json({ ok: false, mensaje: 'Confirma que estas personas te dieron permiso para escribirles.' }, { status: 400 })
  }
  const filas = leerCsv(String(cuerpo?.csv || ''))
  if (!filas.length) return Response.json({ ok: false, mensaje: 'El archivo está vacío o no tiene correos.' }, { status: 400 })
  if (filas.length > MAXIMO) return Response.json({ ok: false, mensaje: `Máximo ${MAXIMO} filas por archivo. Divídelo en partes.` }, { status: 400 })

  const origen = `Importado (${new Date().toLocaleDateString('es-CO', { timeZone: 'America/Bogota' })})`
  const resumen = { nuevos: 0, yaEstaban: 0, dadosDeBaja: 0, invalidos: [] as string[], repetidos: 0 }
  const vistos = new Set<string>()

  for (const f of filas) {
    if (!CORREO_VALIDO.test(f.correo)) {
      if (f.correo || f.nombre) resumen.invalidos.push(f.correo || f.nombre)
      continue
    }
    if (vistos.has(f.correo)) {
      resumen.repetidos++
      continue
    }
    vistos.add(f.correo)
    const existe = await payload.find({ collection: 'suscriptores', where: { correo: { equals: f.correo } }, limit: 1, depth: 0 })
    const doc: any = existe.docs[0]
    if (doc) {
      if (doc.estado === 'baja') resumen.dadosDeBaja++
      else resumen.yaEstaban++
      continue
    }
    try {
      await payload.create({ collection: 'suscriptores', data: { correo: f.correo, nombre: f.nombre || undefined, estado: 'activo', origen }, depth: 0 })
      resumen.nuevos++
    } catch {
      resumen.invalidos.push(f.correo)
    }
  }

  return Response.json({ ok: true, ...resumen, invalidos: resumen.invalidos.slice(0, 20), totalInvalidos: resumen.invalidos.length })
}
