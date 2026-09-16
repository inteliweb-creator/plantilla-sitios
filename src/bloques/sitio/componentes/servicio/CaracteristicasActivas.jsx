'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Lo que incluye el servicio, activado por scroll.
 *
 * La columna izquierda se queda fija con el titular y un contador grande
 * (01 / 06) que avanza. En la derecha, cada punto se enciende —gris a negro,
 * el mismo gesto de la escena— cuando cruza el centro de la pantalla, y se
 * apaga al salir. Se lee de uno en uno, que es como se entiende una lista de
 * seis cosas, en vez de un bloque de tarjetas iguales que el ojo se salta.
 */
const dos = (n) => String(n).padStart(2, '0');

export default function CaracteristicasActivas({ datos }) {
  const { eyebrow, titulo, enfasis, lead } = datos;
  const items = datos.items || [];
  const [activo, setActivo] = useState(0);
  const refs = useRef([]);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entradas) => {
        entradas.forEach((en) => {
          if (en.isIntersecting) setActivo(Number(en.target.dataset.indice));
        });
      },
      // Una franja fina en el centro de la ventana: solo cuenta lo que pasa por ahí.
      { rootMargin: '-45% 0px -45% 0px' },
    );
    refs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, [items.length]);

  return (
    <section className="relative bg-white py-20 sm:py-32">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12 pl-rail">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-28">
              <span className="etiqueta-zen mb-6">{eyebrow}</span>
              <h2 className="text-graphite text-[2.3rem] sm:text-[3.2rem] leading-[1] mb-6">
                {titulo} {enfasis && <em>{enfasis}</em>}
              </h2>
              {lead && <p className="text-base sm:text-lg text-slate leading-relaxed max-w-md">{lead}</p>}

              <div className="hidden lg:block mt-14">
                <p className="flex items-baseline gap-3 text-graphite">
                  <span className="text-[7.5rem] leading-[0.8] tracking-[-0.07em] font-medium tabular-nums">
                    {dos(activo + 1)}
                  </span>
                  <span className="text-2xl text-[#A3A6AB] tracking-[-0.04em]">/ {dos(items.length)}</span>
                </p>
                <div className="mt-6 flex gap-1.5 max-w-sm">
                  {items.map((_, i) => (
                    <span
                      key={i}
                      className={`h-1.5 flex-1 rounded-full transition-colors duration-500 ${
                        i === activo ? 'capsula-bronce' : i < activo ? 'bg-graphite' : 'bg-[#E4E6E9]'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          <ol className="lg:col-span-7 lg:pt-[10vh] lg:pb-[20vh]">
            {items.map((item, i) => {
              const on = i === activo;
              return (
                <li
                  key={item.id || i}
                  ref={(el) => (refs.current[i] = el)}
                  data-indice={i}
                  className="grid grid-cols-[auto_1fr] gap-5 sm:gap-8 py-8 sm:py-10 border-t border-line"
                >
                  <span
                    className={`mt-1 w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-[13px] tabular-nums transition-colors duration-500 ${
                      on ? 'bg-graphite text-white' : 'bg-[#F1F1F0] text-[#9EA2A8]'
                    }`}
                  >
                    {dos(i + 1)}
                  </span>
                  <div>
                    <h3
                      className={`text-[1.6rem] sm:text-[2.2rem] leading-[1.05] mb-3 transition-colors duration-500 ${
                        on ? 'text-graphite' : 'text-[#C4C7CC]'
                      }`}
                    >
                      {item.titulo}
                    </h3>
                    <p
                      className={`text-[15px] sm:text-base leading-relaxed max-w-xl transition-colors duration-500 ${
                        on ? 'text-slate' : 'text-[#C4C7CC]'
                      }`}
                    >
                      {item.desc}
                    </p>
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
