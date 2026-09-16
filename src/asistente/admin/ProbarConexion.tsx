'use client'

import { Button, useField, useFormFields } from '@payloadcms/ui'
import React, { useState } from 'react'

/**
 * Botón "Probar conexión" de cada conexión: usa lo escrito en esa fila, aunque
 * todavía no esté guardado. Si no se pegó una clave nueva, usa la guardada.
 */
export const ProbarConexion: React.FC<{ path?: string }> = ({ path = '' }) => {
  // path llega como "conexiones.0.probar": los campos hermanos comparten ese prefijo.
  const prefijo = path.includes('.') ? path.slice(0, path.lastIndexOf('.') + 1) : ''
  const valores = useFormFields(([campos]) => ({
    proveedor: campos?.[`${prefijo}proveedor`]?.value,
    modelo: campos?.[`${prefijo}modelo`]?.value,
    urlBase: campos?.[`${prefijo}urlBase`]?.value,
    claveNueva: campos?.[`${prefijo}claveNueva`]?.value,
    filaId: campos?.[`${prefijo}id`]?.value,
  }))
  const campoModelo = useField<string>({ path: `${prefijo}modelo` })
  const [estado, setEstado] = useState<{ cargando?: boolean; ok?: boolean; mensaje?: string }>({})

  const probar = async () => {
    setEstado({ cargando: true })
    try {
      const res = await fetch('/next/asistente/probar', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(valores),
      })
      const json = await res.json().catch(() => ({ ok: false, mensaje: `Error ${res.status}` }))
      // Si el recomendado no estaba disponible, deja escrito el que sí funcionó.
      if (json.modeloSugerido) campoModelo.setValue(json.modeloSugerido)
      setEstado({ ok: Boolean(json.ok), mensaje: json.mensaje || json.error })
    } catch {
      setEstado({ ok: false, mensaje: 'No se pudo contactar al servidor.' })
    }
  }

  return (
    <div style={{ margin: '4px 0 24px' }}>
      <Button buttonStyle="secondary" disabled={estado.cargando} onClick={probar} size="medium" type="button">
        {estado.cargando ? 'Probando…' : 'Probar conexión'}
      </Button>
      {estado.mensaje ? (
        <p
          role="status"
          style={{
            marginTop: 8,
            padding: '10px 14px',
            borderRadius: 6,
            background: estado.ok ? 'var(--theme-success-100)' : 'var(--theme-error-100)',
            color: estado.ok ? 'var(--theme-success-800)' : 'var(--theme-error-800)',
          }}
        >
          {estado.ok ? '✓ ' : '✗ '}
          {estado.mensaje}
        </p>
      ) : null}
    </div>
  )
}

export default ProbarConexion
