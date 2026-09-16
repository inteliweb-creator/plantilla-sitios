import React from 'react';

/**
 * Símbolo neutro para cuando el negocio todavía no subió su logo: la inicial
 * del nombre en un cuadrado redondeado, con los colores del tema. Cada cliente
 * sube su logo en "Datos del negocio" y este símbolo deja de verse.
 */
export function BrandIsotype({ size = 32, nombre = '', className = '' }) {
  const inicial = (String(nombre).trim()[0] || 'M').toUpperCase();
  return (
    <span
      aria-hidden="true"
      className={`shrink-0 inline-flex items-center justify-center rounded-[28%] bg-graphite text-white font-bold ${className}`}
      style={{ width: size, height: size, fontSize: Math.round(size * 0.5), lineHeight: 1 }}
    >
      {inicial}
    </span>
  );
}

/**
 * Logotipo de respaldo: símbolo + nombre del negocio.
 * - variant: 'dark-text' (para fondos claros) | 'light-text' (para fondos oscuros)
 * - size: 'sm' (26px) | 'md' (30px) | 'lg' (38px)
 */
export default function BrandLogo({ nombre = 'Mi negocio', variant = 'dark-text', size = 'md', isotypeOnly = false, className = '' }) {
  const sizePixels = size === 'sm' ? 26 : size === 'lg' ? 38 : 30;
  const textSizeClass = size === 'sm' ? 'text-[15px]' : size === 'lg' ? 'text-[20px] sm:text-[23px]' : 'text-[17px]';
  return (
    <span className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      <BrandIsotype size={sizePixels} nombre={nombre} />
      {!isotypeOnly && (
        <span className={`font-bold tracking-[-0.03em] ${textSizeClass} ${variant === 'light-text' ? 'text-white' : 'text-graphite'}`}>{nombre}</span>
      )}
    </span>
  );
}
