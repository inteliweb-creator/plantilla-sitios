'use client';

import { useEffect, useRef, useState } from 'react';

import { useEscenaScroll } from '../../lib/escena-scroll.js';
import Iluminado from './Iluminado.jsx';

/**
 * La escena cotidiana con la que abre cada servicio, contada con scroll.
 *
 * Antes era una tarjeta estática que se leía o se saltaba. Ahora es una pista
 * de scroll con un panel pegado: la frase grande se ilumina palabra a palabra
 * mientras se baja —como el problema de la portada— y cuando termina aparece
 * debajo la explicación, que es la que da la vuelta a la escena.
 */
const limitar = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);

export default function EscenaIluminada({ datos }) {
  const { cita = '', cuerpo, etiqueta = 'Te suena, ¿verdad?' } = datos;
  const pista = useRef(null);
  const p = useEscenaScroll(pista);

  const [reducido, setReducido] = useState(false);
  useEffect(() => {
    setReducido(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }, []);

  const luz = reducido ? 1 : limitar(p / 0.62);
  const cierre = reducido ? 1 : limitar((p - 0.66) / 0.18);

  return (
    <section className="relative bg-white">
      <div ref={pista} className="relative h-[210vh]">
        <div className="sticky top-0 h-screen overflow-hidden flex items-center">
          <div className="w-full mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12 pl-rail">
            <div className="max-w-5xl">
              <span className="etiqueta-zen mb-8">{etiqueta}</span>

              <p className="text-[1.7rem] sm:text-[2.6rem] lg:text-[3.3rem] leading-[1.1] tracking-[-0.045em] font-medium mb-10">
                <Iluminado texto={cita} avance={luz} />
              </p>

              <div
                className="grid grid-cols-1 md:grid-cols-12 gap-6 border-t border-line pt-7"
                style={{ opacity: cierre, transform: `translateY(${(1 - cierre) * 24}px)` }}
              >
                <p className="md:col-span-8 text-base sm:text-lg text-slate leading-relaxed">{cuerpo}</p>
              </div>
            </div>
          </div>

          {/* Avance de la escena: una línea fina al pie. */}
          <div aria-hidden="true" className="absolute left-0 bottom-0 h-[2px] w-full bg-line">
            <div className="h-full bg-graphite" style={{ width: `${p * 100}%` }} />
          </div>
        </div>
      </div>
    </section>
  );
}
