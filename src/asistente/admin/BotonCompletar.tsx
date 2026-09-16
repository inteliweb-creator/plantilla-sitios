'use client'

import { useAllFormFields, useDocumentInfo, useField } from '@payloadcms/ui'
import React, { useState } from 'react'

import { useEstadoAsistente } from './activo'

/** Junta el texto plano de un campo de texto enriquecido (Lexical). */
const textoPlano = (nodo: any): string =>
  !nodo || typeof nodo !== 'object'
    ? ''
    : typeof nodo.text === 'string'
      ? nodo.text
      : (nodo.children || nodo.root?.children || []).map(textoPlano).join(nodo.root ? '\n' : ' ')

/** Reduce la imagen elegida (antes de guardarla) para enviarla liviana. */
async function imagenLigera(archivo: File): Promise<string | null> {
  if (!archivo?.type?.startsWith('image/')) return null
  try {
    const bitmap = await createImageBitmap(archivo)
    const escala = Math.min(1, 1024 / Math.max(bitmap.width, bitmap.height))
    const lienzo = document.createElement('canvas')
    lienzo.width = Math.round(bitmap.width * escala)
    lienzo.height = Math.round(bitmap.height * escala)
    lienzo.getContext('2d')?.drawImage(bitmap, 0, 0, lienzo.width, lienzo.height)
    return lienzo.toDataURL('image/jpeg', 0.85)
  } catch {
    return null
  }
}

const etiquetaDe = (label: any) => (typeof label === 'string' ? label : label && typeof label === 'object' ? label.es || Object.values(label)[0] : '')

/**
 * "✨ Completar con el asistente": debajo de un campo de texto, redacta su contenido con
 * el contexto del documento. Si ya tiene texto, lo mejora. Se puede deshacer.
 */
export const BotonCompletar: React.FC<{ path: string; field?: any }> = ({ path, field }) => {
  const { value, setValue } = useField<string>({ path })
  const [campos] = useAllFormFields()
  const { collectionSlug, globalSlug, id } = useDocumentInfo()
  const [estado, setEstado] = useState<{ cargando?: boolean; error?: string; anterior?: string | null; via?: string }>({})
  const asistente = useEstadoAsistente()

  const nombre = String(field?.name || path.split('.').pop())
  const esAlt = collectionSlug === 'media' && nombre === 'alt'

  const completar = async () => {
    setEstado({ cargando: true })
    try {
      const contexto: Record<string, string> = {}
      for (const [ruta, estadoCampo] of Object.entries(campos || {})) {
        const v: any = (estadoCampo as any)?.value
        if (ruta === path || ruta === 'file' || /(^|\.)(id|_status|createdAt|updatedAt|claveCifrada)$/.test(ruta)) continue
        if (typeof v === 'string' && v.trim() && !/^data:/.test(v)) contexto[ruta] = v
        else if (v && typeof v === 'object' && (v.root || v.children)) {
          const t = textoPlano(v).trim()
          if (t) contexto[ruta] = t.slice(0, 6000)
        }
      }
      const archivo: any = (campos as any)?.file?.value
      const imagen = esAlt && archivo instanceof File ? await imagenLigera(archivo) : null

      const res = await fetch('/next/asistente/completar', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          coleccion: collectionSlug || null,
          pantalla: globalSlug || null,
          id: id ?? null,
          campo: {
            nombre,
            ruta: path,
            etiqueta: etiquetaDe(field?.label),
            descripcion: etiquetaDe(field?.admin?.description),
            maxLength: field?.maxLength,
            tipo: field?.type === 'textarea' ? 'textarea' : 'text',
          },
          valorActual: typeof value === 'string' ? value : '',
          contexto,
          imagen,
        }),
      })
      const json = await res.json().catch(() => ({ error: `El servidor respondió ${res.status}.` }))
      if (json.error || typeof json.valor !== 'string') {
        setEstado({ error: json.error || 'No llegó ninguna sugerencia.' })
        return
      }
      const anterior = typeof value === 'string' ? value : ''
      setValue(json.valor)
      setEstado({ anterior, via: json.via })
    } catch {
      setEstado({ error: 'Se perdió la conexión. Inténtalo de nuevo.' })
    }
  }

  const deshacer = () => {
    setValue(estado.anterior ?? '')
    setEstado({})
  }

  // Si el asistente está apagado (o no hay sesión de administrador), el botón no aparece.
  if (!asistente?.activo) return null

  const quien = !asistente.nombre || asistente.nombre === 'Asistente' ? 'el asistente' : asistente.nombre
  const vacio = !(typeof value === 'string' && value.trim())
  return (
    <div className="iwe-completar">
      <button className="iwe-completar__boton" disabled={estado.cargando} onClick={completar} title={esAlt ? `${quien} mira la imagen y escribe la descripción` : `${quien} lo redacta con el contexto de esta pantalla`} type="button">
        <span aria-hidden="true">✨</span> {estado.cargando ? (esAlt ? 'Mirando la imagen…' : 'Redactando…') : vacio ? `Completar con ${quien}` : `Mejorar con ${quien}`}
      </button>
      {estado.anterior !== undefined && !estado.cargando ? (
        <button className="iwe-completar__deshacer" onClick={deshacer} type="button">
          Deshacer
        </button>
      ) : null}
      {estado.error ? (
        <span className="iwe-completar__error" role="alert">
          {estado.error}
        </span>
      ) : null}
    </div>
  )
}

export default BotonCompletar
