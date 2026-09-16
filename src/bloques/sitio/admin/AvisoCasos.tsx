import React from 'react'

/** Aviso dentro del bloque: los casos se editan en su propia colección. */
export const AvisoCasos: React.FC = () => (
  <p style={{ fontSize: 13, opacity: 0.75, margin: '8px 0 16px' }}>
    Las tarjetas de cada cliente se editan en{' '}
    <a href="/admin/collections/casos" style={{ textDecoration: 'underline' }}>
      Clientes y casos
    </a>
    .
  </p>
)
