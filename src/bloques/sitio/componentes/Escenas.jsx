'use client'

import { useEffect, useRef, useState } from 'react';
import { Search, MessageCircle, Eye, ArrowRight } from 'lucide-react';

import { useEscenaScroll, opacidadTramo } from '../lib/escena-scroll.js';
import { GloboPunteado } from './Globo.jsx';

/**
 * El problema, contado como el cliente lo vive — con la estructura de la
 * franja blanca de presentación.
 *
 * El contenido y el efecto son los de siempre: una pista de scroll alta con un
 * panel pegado dentro, y tres escenas cotidianas que se relevan de una en una
 * según se baja. Lo que cambia es la ropa: fondo blanco, globo de meridianos
 * a la izquierda con la etiqueta de la escena, la frase grande a la derecha y
 * la fila de cápsulas abajo — que aquí hace además de indicador: la cápsula de
 * bronce es la escena en curso.
 *
 * La frase grande se ILUMINA. Arranca en gris y cada palabra pasa a negro a
 * medida que avanza el scroll de su escena, de izquierda a derecha, como si
 * una luz la fuera leyendo. Así el gris de la referencia deja de ser un
 * adorno fijo y marca por dónde va la lectura.
 */
// Textos desde el panel (bloque "Escenas del problema"). Los iconos y la
// maqueta de cada escena van por posición: Google, WhatsApp, confianza.
const ICONOS_ESCENA = [Search, MessageCircle, Eye];
const IDS_ESCENA = ['google', 'whatsapp', 'confianza'];
const escenasDe = (D) =>
  (D.escenas ?? []).slice(0, 3).map((e, i) => ({
    ...e,
    id: e.maqueta || IDS_ESCENA[i],
    icono: ICONOS_ESCENA[i],
  }));

/**
 * Tramo del recorrido en el que se ilumina cada escena. Cae dentro del tiempo
 * en que la escena está entera en pantalla (ver `opacidadTramo`), para que la
 * luz no corra mientras el texto todavía está entrando o ya se va.
 */
const TRAMOS_LUZ = [
  [0.02, 0.2],
  [0.36, 0.57],
  [0.73, 0.97],
];

const limitar = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);

/** Del gris apagado al negro del titular. */
const APAGADO = [196, 199, 204];
const ENCENDIDO = [14, 15, 17];

function Iluminado({ texto, avance }) {
  const palabras = texto.split(' ');
  const n = palabras.length;
  return palabras.map((palabra, k) => {
    // Cada palabra tarda "una palabra" en encenderse: el frente de luz es suave,
    // no un corte duro entre negro y gris.
    const t = limitar(avance * n - k);
    const color = APAGADO.map((c, i) => Math.round(c + (ENCENDIDO[i] - c) * t));
    return (
      <span key={k} style={{ color: `rgb(${color.join(',')})`, transition: 'color 0.15s linear' }}>
        {palabra}
        {k < n - 1 ? ' ' : ''}
      </span>
    );
  });
}

/** Maqueta de pantalla que acompaña a cada escena, en claro. */
function Maqueta({ id }) {
  const base = 'rounded-[22px] bg-white/85 backdrop-blur-md border border-line p-5 shadow-[var(--shadow-lift)]';

  if (id === 'google') {
    return (
      <div className={base}>
        <div className="rounded-full bg-[#F1F1F0] px-4 py-2.5 flex items-center gap-2.5 mb-4">
          <Search className="w-3.5 h-3.5 text-ink-muted" />
          <span className="text-[12px] text-slate">nombre de tu negocio</span>
        </div>
        <p className="text-[12px] text-ink-muted text-center py-5">Sin resultados relevantes</p>
      </div>
    );
  }

  if (id === 'whatsapp') {
    return (
      <div className={`${base} space-y-2.5`}>
        {['¿A qué horas abren?', '¿Hacen envíos a Cali?', '¿Dónde quedan exactamente?'].map((t) => (
          <p key={t} className="text-[13px] text-graphite bg-[#F1F1F0] rounded-2xl rounded-tl-sm px-4 py-2.5 w-fit max-w-full">
            {t}
          </p>
        ))}
      </div>
    );
  }

  return (
    <div className={`${base} space-y-3.5`}>
      {['Sitio web', 'Horario publicado', 'Trabajos anteriores'].map((campo) => (
        <div key={campo} className="flex items-center justify-between text-[13px]">
          <span className="text-slate">{campo}</span>
          <span className="text-[12px] text-[#9A4A1F]">— vacío —</span>
        </div>
      ))}
    </div>
  );
}

export default function Escenas({ datos: D = {} }) {
  const ESCENAS = escenasDe(D);
  const pista = useRef(null);
  const p = useEscenaScroll(pista);

  // Con movimiento reducido no hay luz que recorra el texto: se muestra negro.
  const [reducido, setReducido] = useState(false);
  useEffect(() => {
    setReducido(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }, []);

  const opacidades = ESCENAS.map((_, i) => opacidadTramo(p, i));
  const activo = opacidades.indexOf(Math.max(...opacidades));

  return (
    <section id="problema" className="relative bg-white">
      {/* ---------- Entradilla ---------- */}
      <div className="relative max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12 pl-rail pt-20 sm:pt-28">
        <span className="etiqueta-zen mb-6">{D.eyebrow}</span>
        <h2 className="text-graphite text-[2.2rem] sm:text-[3.2rem] leading-[1] max-w-3xl mb-5">
          {D.titulo} <em>{D.enfasis}</em>
        </h2>
        <p className="text-[15px] sm:text-base text-slate leading-relaxed max-w-2xl">{D.cuerpo}</p>
      </div>

      {/* ---------- La pista: alta por fuera, una pantalla por dentro ---------- */}
      <div ref={pista} className="relative h-[280vh]">
        <div className="sticky top-0 h-screen overflow-hidden flex flex-col">
          <div className="relative flex-1 min-h-0">
            {ESCENAS.map((escena, i) => {
              const opacidad = opacidades[i];
              const visible = opacidad > 0.15;
              const [a, b] = TRAMOS_LUZ[i];
              const avance = reducido ? 1 : limitar((p - a) / (b - a));

              return (
                <div
                  key={escena.id}
                  aria-hidden={!visible}
                  className="absolute inset-0 flex items-center"
                  style={{
                    opacity: opacidad,
                    transition: 'opacity 0.1s ease-out',
                    pointerEvents: visible ? 'auto' : 'none',
                  }}
                >
                  <div className="w-full max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12 pl-rail">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center">
                      {/* Izquierda: globo, etiqueta de la escena y maqueta */}
                      <div className="lg:col-span-5 relative lg:min-h-[22rem] flex flex-col justify-between">
                        <GloboPunteado className="hidden sm:block absolute -left-24 -top-10 w-[26rem] h-[26rem] pointer-events-none" />
                        <span className="etiqueta-zen relative self-start lg:ml-8 lg:mt-4">
                          {escena.etiqueta}
                        </span>
                        <div className="relative hidden sm:block max-w-sm lg:ml-8 mt-6">
                          <Maqueta id={escena.id} />
                        </div>
                        <p className="relative hidden lg:block mt-6 text-[11px] text-slate border-l border-graphite/30 pl-2">
                          Escena {String(i + 1).padStart(2, '0')} de {String(ESCENAS.length).padStart(2, '0')}
                        </p>
                      </div>

                      {/* Derecha: la frase que se ilumina */}
                      <div className="lg:col-span-7">
                        <p className="text-[1.35rem] sm:text-[2rem] leading-[1.18] tracking-[-0.035em] font-medium">
                          <Iluminado texto={`${escena.titulo} ${escena.texto}`} avance={avance} />
                        </p>

                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ---------- Fila de cápsulas: una por escena, y la flecha ----------
              La de bronce es la escena en curso. La negra lleva a la sección
              siguiente. Es la misma fila de la franja de presentación, que
              aquí además cuenta por dónde va el recorrido. */}
          <div className="relative max-w-[1400px] w-full mx-auto px-5 sm:px-8 lg:px-12 pl-rail pb-6 sm:pb-10">
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 sm:gap-3">
              {ESCENAS.map((escena, i) => (
                <span
                  key={escena.id}
                  className={`capsula-zen capsula-escena transition-colors duration-500 ${
                    i === activo
                      ? 'capsula-bronce'
                      : i < activo
                        ? 'bg-[#F1F1F0] text-graphite'
                        : 'bg-[#E4E6E9] text-[#7E8186]'
                  }`}
                >
                  {escena.nombre}
                </span>
              ))}
              <a
                href="#horizontal"
                aria-label="Ir a la sección siguiente"
                className="capsula-zen capsula-escena hidden sm:flex bg-graphite text-white hover:bg-[#26282C] transition-colors"
              >
                <ArrowRight className="w-6 h-6 sm:w-10 sm:h-10" strokeWidth={1.5} />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* ---------- Cierre ---------- */}
      <div className="relative max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12 pl-rail pb-24 sm:pb-32">
        <div className="h-px bg-line mb-8" />
        <p className="text-[1.5rem] sm:text-[2rem] leading-[1.15] tracking-[-0.035em] font-medium text-graphite max-w-3xl">
          {D.cierre}{' '}
          <span className="text-[#85888D]">{D.cierreEnfasis}</span>
        </p>
      </div>
    </section>
  );
}
