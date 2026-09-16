'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { ArrowUpRight, Menu } from 'lucide-react';
import { enlaceWhatsapp } from '../lib/negocio.js';
import { MarcaNegocio, abrirMenu, esActivo } from './comun.jsx';

/**
 * Cabecera del sitio.
 *
 * Misma geometría que la barra de la portada: marca a la izquierda, bloque
 * colgado del canto superior con los enlaces, píldora negra a la derecha.
 *
 * En páginas que traen su propia barra (la portada) se esconde
 * hasta pasar el primer pantallazo. En celular, además, se esconde al bajar
 * y vuelve al subir.
 *
 * `carrito` es el botón del carrito de la tienda; solo llega si la tienda
 * está activa en el panel.
 */
export default function Cabecera({ nav, negocio, carrito = null }) {
  const ruta = usePathname() || '/';
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const revelarAlScroll = Boolean(document.querySelector('[data-barra-propia]'));
    const movil = window.matchMedia('(max-width: 1023px)');
    let previo = window.scrollY;

    const onScroll = () => {
      const y = window.scrollY;
      const delta = y - previo;
      if (Math.abs(delta) < 8 && y > 80) return;
      previo = y;

      const base = revelarAlScroll ? y > 320 : true;
      if (!movil.matches || y <= 80) {
        setVisible(base);
        return;
      }
      setVisible(delta < 0 ? base : false);
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [ruta]);

  const enlaces = (nav?.menu || []).slice(0, 5);

  return (
    <header
      className={`marco marco-cabecera fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        visible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 pointer-events-none'
      }`}
    >
      <div className="px-2.5 sm:px-4 lg:pl-[7.5rem] lg:pr-8 pt-2.5 sm:pt-4">
        <div className="flex items-center lg:items-start gap-2 sm:gap-3 max-lg:rounded-full max-lg:bg-white/90 max-lg:backdrop-blur-xl max-lg:border max-lg:border-white max-lg:p-1.5 max-lg:shadow-[var(--shadow-lift)]">
          <a
            href="/"
            className={`shrink-0 flex items-center rounded-full bg-white/90 ${negocio?.logo?.url ? 'px-4 py-2.5' : 'pl-2.5 pr-4 py-2'} lg:border lg:border-white lg:shadow-sm hover:scale-105 transition-transform`}
            aria-label={`${negocio?.nombre || ''}, inicio`}
          >
            <MarcaNegocio negocio={negocio} tam={negocio?.logo?.url ? 21 : 26} claseTexto="text-[15px]" />
          </a>

          {enlaces.length > 0 && (
            <nav
              aria-label="Principal"
              className="hidden lg:flex flex-1 justify-center items-stretch -mt-2.5 sm:-mt-4 rounded-b-[26px] border border-t-0 border-line bg-white/85 backdrop-blur-xl shadow-[var(--shadow-soft)] px-3 pt-5 pb-2.5 max-w-3xl mx-auto"
            >
              {enlaces.map((e, i) => {
                const activo = esActivo(ruta, e.enlace);
                return (
                  <a
                    key={`${e.enlace}-${i}`}
                    href={e.enlace}
                    aria-current={activo ? 'page' : undefined}
                    className={`items-center whitespace-nowrap px-4 xl:px-6 text-[13px] font-semibold transition-colors ${
                      i > 0 ? 'border-l border-line' : ''
                    } ${i > 3 ? 'hidden xl:flex' : 'flex'} ${activo ? 'text-graphite' : 'text-slate hover:text-graphite'}`}
                  >
                    {e.etiqueta}
                  </a>
                );
              })}
            </nav>
          )}

          <span className="flex-1 lg:hidden" />

          {carrito && <div className="marco-carrito shrink-0">{carrito}</div>}

          <a
            href={enlaceWhatsapp(negocio)}
            target="_blank"
            rel="noreferrer"
            className={`pill-negra shrink-0 text-[13px] ${carrito ? 'max-sm:hidden' : ''}`}
          >
            <span>{nav?.botonCabecera || 'Hablemos'}</span>
            <span className="disco" aria-hidden="true"><ArrowUpRight className="w-4 h-4" /></span>
          </a>

          <button
            onClick={abrirMenu}
            data-menu-cabecera
            aria-label="Abrir menú de navegación"
            className="lg:hidden shrink-0 w-12 h-12 rounded-full bg-white/90 backdrop-blur-xl border border-white flex items-center justify-center text-graphite shadow-[var(--shadow-soft)] active:scale-95 transition-transform"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
