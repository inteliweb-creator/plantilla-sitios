'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Cómo se trabaja, como un camino que se recorre.
 *
 * Una línea vertical se va llenando de negro a medida que la sección pasa por
 * la pantalla, y cada paso se marca como alcanzado cuando la línea llega a él.
 * Enseña de un vistazo que el proceso tiene principio y final.
 */
const limitar = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);

export default function PasosLinea({ datos }) {
  const { eyebrow, titulo, enfasis } = datos;
  const pasos = datos.items || [];
  const lista = useRef(null);
  const [avance, setAvance] = useState(0);

  useEffect(() => {
    const el = lista.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setAvance(1);
      return;
    }
    let raf = 0;
    const medir = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      // La línea avanza con el punto que está al 60% de la altura de la ventana.
      setAvance(limitar((window.innerHeight * 0.6 - r.top) / r.height));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(medir);
    };
    medir();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  const n = pasos.length;

  return (
    <section className="relative py-20 sm:py-32" style={{ background: '#F4F4F5' }}>
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12 pl-rail">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-28">
              <span className="etiqueta-zen !bg-white mb-6">{eyebrow}</span>
              <h2 className="text-graphite text-[2.3rem] sm:text-[3.2rem] leading-[1]">
                {titulo} {enfasis && <em>{enfasis}</em>}
              </h2>
            </div>
          </div>

          <ol ref={lista} className="lg:col-span-8 relative">
            {/* Riel y relleno. */}
            <span aria-hidden="true" className="absolute left-[19px] sm:left-[23px] top-2 bottom-2 w-px bg-[#D5D7DB]" />
            <span
              aria-hidden="true"
              className="absolute left-[19px] sm:left-[23px] top-2 w-px bg-graphite origin-top"
              style={{ height: `calc((100% - 1rem) * ${avance})` }}
            />

            {pasos.map((paso, i) => {
              const alcanzado = avance >= (i + 0.35) / n;
              return (
                <li key={paso.id || i} className="relative grid grid-cols-[auto_1fr] gap-6 sm:gap-9 pb-12 last:pb-0">
                  <span
                    className={`relative z-10 w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-[13px] tabular-nums transition-all duration-500 ${
                      alcanzado ? 'bg-graphite text-white scale-100' : 'bg-white text-[#9EA2A8] border border-[#D5D7DB] scale-90'
                    }`}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div
                    className="pt-1.5 transition-all duration-700"
                    style={{ opacity: alcanzado ? 1 : 0.35, transform: `translateY(${alcanzado ? 0 : 10}px)` }}
                  >
                    <h3 className="text-[1.5rem] sm:text-[2rem] leading-[1.05] text-graphite mb-3">{paso.titulo}</h3>
                    <p className="text-[15px] sm:text-base text-slate leading-relaxed max-w-xl">{paso.desc}</p>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
