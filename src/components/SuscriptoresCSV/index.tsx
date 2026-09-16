'use client'

import React, { useRef, useState } from 'react'

import './index.scss'

type Resultado = { ok: boolean; mensaje?: string; nuevos?: number; yaEstaban?: number; dadosDeBaja?: number; repetidos?: number; invalidos?: string[]; totalInvalidos?: number }

/** Encima de la lista de suscriptores: descargar la lista o subir un CSV. */
export const SuscriptoresCSV: React.FC = () => {
  const [abierto, setAbierto] = useState(false)
  const [archivo, setArchivo] = useState<File | null>(null)
  const [confirmo, setConfirmo] = useState(false)
  const [enviando, setEnviando] = useState(false)
  const [resultado, setResultado] = useState<Resultado | null>(null)
  const entrada = useRef<HTMLInputElement>(null)

  const importar = async () => {
    if (!archivo) return
    setEnviando(true)
    setResultado(null)
    try {
      const csv = await archivo.text()
      const res = await fetch('/next/suscriptores/importar', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ csv, confirmo }),
      })
      setResultado(await res.json())
    } catch {
      setResultado({ ok: false, mensaje: 'No se pudo subir el archivo.' })
    }
    setEnviando(false)
  }

  return (
    <div className="suscriptores-csv">
      <div className="suscriptores-csv__botones">
        <a className="btn btn--style-secondary btn--size-small" href="/next/suscriptores/exportar?activos=1">
          Descargar activos (CSV)
        </a>
        <a className="btn btn--style-secondary btn--size-small" href="/next/suscriptores/exportar">
          Descargar todos
        </a>
        <button type="button" className="btn btn--style-primary btn--size-small" onClick={() => setAbierto(!abierto)}>
          {abierto ? 'Cerrar' : 'Importar desde un archivo'}
        </button>
      </div>

      {abierto && (
        <div className="suscriptores-csv__panel">
          <p>
            Sube un archivo <strong>CSV</strong> (en Excel: Archivo → Guardar como → CSV). Debe tener una columna <strong>correo</strong> y, si
            quieres, otra <strong>nombre</strong>. Quien ya se dio de baja no se vuelve a añadir.
          </p>
          <input ref={entrada} type="file" accept=".csv,text/csv,text/plain" onChange={(e) => setArchivo(e.target.files?.[0] || null)} />
          <label className="suscriptores-csv__confirmo">
            <input type="checkbox" checked={confirmo} onChange={(e) => setConfirmo(e.target.checked)} />
            <span>Estas personas me dieron permiso para enviarles correos (lo exige la ley de protección de datos).</span>
          </label>
          <button type="button" className="btn btn--style-primary btn--size-small" disabled={!archivo || !confirmo || enviando} onClick={importar}>
            {enviando ? 'Importando…' : 'Importar'}
          </button>

          {resultado && (
            <div className={`suscriptores-csv__resultado ${resultado.ok ? 'ok' : 'error'}`} role="status">
              {resultado.ok ? (
                <>
                  <strong>Listo.</strong> {resultado.nuevos} nuevos · {resultado.yaEstaban} ya estaban · {resultado.dadosDeBaja} se habían dado de baja (no se añadieron)
                  {resultado.repetidos ? ` · ${resultado.repetidos} repetidos en el archivo` : ''}
                  {resultado.totalInvalidos ? ` · ${resultado.totalInvalidos} con el correo mal escrito: ${resultado.invalidos?.join(', ')}` : ''}
                  {resultado.nuevos ? (
                    <>
                      {' '}
                      <a href="/admin/collections/suscriptores">Recarga la lista</a> para verlos.
                    </>
                  ) : null}
                </>
              ) : (
                resultado.mensaje
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default SuscriptoresCSV
