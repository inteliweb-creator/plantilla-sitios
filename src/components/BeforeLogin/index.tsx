import React from 'react'

export const BeforeLogin: React.FC = () => {
  return (
    <div>
      <p>
        <b>¡Bienvenido al panel!</b>
        {' Aquí entras para administrar tu sitio. Si eres cliente de la tienda, entra a tu cuenta desde '}
        <a href="/login">el sitio</a>
        {' para ver tus pedidos.'}
      </p>
    </div>
  )
}
