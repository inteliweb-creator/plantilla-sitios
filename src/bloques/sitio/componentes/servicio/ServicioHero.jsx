'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight } from 'lucide-react';

import { enlaceWhatsapp, textos } from '../../lib/negocio.js';
import { useParallaxLayers } from '../../lib/parallax-scrolling';
import Maqueta from './Maquetas.jsx';

/**
 * Hero de las páginas de servicio.
 *
 * El encabezado genérico de las páginas interiores (titular y una tarjeta con
 * una frase) no mostraba nada: había que leer para entender el servicio. Aquí
 * la mitad derecha lo enseña funcionando, con una maqueta animada propia de
 * cada página, y la izquierda lleva el mensaje y las dos acciones de siempre.
 *
 * Misma piel que la portada: gris perla fundiéndose en blanco, halo de bronce,
 * etiqueta en píldora, titular negro con el destacado en gris y píldora negra.
 * Al bajar, maqueta y tarjeta de la frase se desplazan a distinta velocidad.
 */
const CAPAS = [
  { capa: 'halo', yPercent: 40 },
  { capa: 'maqueta', yPercent: 12 },
];

// En móvil la cita va debajo de la maqueta, no encima: si sube, la tapa.
const CAPAS_MOVIL = [{ capa: 'halo', yPercent: 40 }];

export default function ServicioHero({ datos, negocio }) {
  const { eyebrow, h1, h1Enfasis: enfasis, lead, cita, maqueta, mensajeWhatsapp, cta = 'Quiero que me encuentren', botonSecundario, enlaceSecundario = '/#cotizador' } = datos;
  const seccion = useRef(null);
  const [capas, setCapas] = useState(CAPAS);
  useEffect(() => {
    if (window.matchMedia('(max-width: 1023px)').matches) setCapas(CAPAS_MOVIL);
  }, []);
  useParallaxLayers(seccion, capas);

  const chips = textos(datos.chips);

  return (
    <section
      ref={seccion}
      className="relative overflow-hidden pt-28 sm:pt-36 pb-16 sm:pb-24"
      style={{ background: 'linear-gradient(180deg, #E6E7EA 0%, #EEEFF1 60%, #FFFFFF 100%)' }}
    >
      <div data-parallax-layer="halo" aria-hidden="true" className="absolute right-[-10rem] top-10 pointer-events-none">
        <div className="halo-bronce w-[30rem] h-[30rem] sm:w-[44rem] sm:h-[44rem]" />
      </div>

      <div className="relative z-10 mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12 pl-rail">
        <nav aria-label="Ruta de navegación" className="mb-8">
          <ol className="flex items-center gap-2 text-[12px] text-slate">
            <li><a href="/" className="hover:text-graphite transition-colors">Inicio</a></li>
            <li aria-hidden="true" className="w-px h-3 bg-graphite/30" />
            <li className="text-graphite">{eyebrow}</li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-center">
          <div className="lg:col-span-6 entrada">
            {eyebrow && <span className="etiqueta-zen mb-6">{eyebrow}</span>}
            <h1 className="text-graphite text-[2.6rem] sm:text-[3.8rem] xl:text-[4.6rem] leading-[0.98] mb-7">
              {h1} {enfasis && <em>{enfasis}</em>}
            </h1>
            <p className="text-base sm:text-lg text-slate leading-relaxed max-w-xl mb-8">{lead}</p>

            <div className="flex flex-wrap items-center gap-2.5 mb-9">
              <a
                href={enlaceWhatsapp(negocio, mensajeWhatsapp)}
                target="_blank"
                rel="noreferrer"
                className="pill-negra text-[13px] sm:text-sm"
              >
                <span>{cta}</span>
                <span className="disco" aria-hidden="true"><ArrowUpRight className="w-4 h-4" /></span>
              </a>
              {botonSecundario && <a href={enlaceSecundario} className="pill-gris text-[13px] sm:text-sm">{botonSecundario}</a>}
            </div>

            {chips.length > 0 && (
              <ul className="flex flex-wrap gap-2">
                {chips.map((c) => (
                  <li key={c} className="rounded-full bg-white/70 border border-white px-3.5 py-1.5 text-[12px] text-graphite">
                    {c}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="lg:col-span-6 relative">
            <div data-parallax-layer="maqueta" className="relative">
              <Maqueta tipo={maqueta} municipios={textos(datos.municipios)} ciudad={negocio?.ciudad} />

            {/* La frase va DEBAJO de la maqueta, sin taparla, en vidrio y a
                tamaño de nota: acompaña a la animación, no compite con ella. */}
            {cita && (
              <p className="mt-5 ml-auto w-fit max-w-sm flex items-start gap-2.5 rounded-2xl bg-white/45 backdrop-blur-xl border border-white/70 px-4 py-3 text-[13px] leading-snug text-graphite shadow-[var(--shadow-soft)]">
                <span aria-hidden="true" className="mt-1.5 w-[5px] h-[5px] rounded-full bg-graphite shrink-0" />
                {cita}
              </p>
            )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
