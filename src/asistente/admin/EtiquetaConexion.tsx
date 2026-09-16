'use client'

import { useRowLabel } from '@payloadcms/ui'
import React from 'react'

import { PROVEEDORES, type Proveedor } from '../proveedores'

/** Título de cada conexión en la lista: "1 · DeepSeek · principal · ••••1234". */
export const EtiquetaConexion: React.FC = () => {
  const { data, rowNumber } = useRowLabel<any>()
  const n = (rowNumber ?? 0) + 1
  const nombre = PROVEEDORES[(data?.proveedor || 'deepseek') as Proveedor]?.nombre || 'Conexión'
  const clave = String(data?.claveResumen || '').match(/••••\S+/)?.[0]
  const papel = data?.activa === false ? 'apagada' : n === 1 ? 'principal' : 'respaldo'
  return (
    <span>
      {n} · {nombre}
      {data?.modelo ? ` (${data.modelo})` : ''} · {papel}
      {clave ? ` · ${clave}` : ' · sin clave'}
    </span>
  )
}

export default EtiquetaConexion
