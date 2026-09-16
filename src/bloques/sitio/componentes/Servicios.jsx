'use client'

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Plus, Minus } from 'lucide-react';


/**
 * Servicios, en índice editorial.
 *
 * Deliberadamente no es una grilla de tarjetas con icono: esa composición es
 * la que hace que un sitio de agencia se parezca a los otros cuarenta. Aquí los
 * servicios son filas de un índice —número, nombre, promesa— y el detalle
 * aparece al pasar por encima o al tocar. Se lee como una tabla de contenidos,
 * que es lo que realmente es.
 *
 * El encabezado queda fijo en escritorio mientras se recorren las filas: el
 * contexto ("no todos los negocios necesitan lo mismo") tiene que seguir a la
 * vista mientras se compara.
 *
 * La fila es un BOTÓN que abre y cierra, no un enlace.
 *
 * La primera versión hacía dos cosas mal a la vez en táctil: solo se abría al
 * pasar el cursor —gesto que en un teléfono no existe— y la fila entera era un
 * enlace, así que el único toque posible te sacaba de la página en vez de
 * mostrarte el detalle. El resultado era que en móvil solo se veía desplegado
 * el primer servicio y los demás no hacían nada.
 *
 * Ahora: tocar abre y vuelve a tocar cierra; el cursor sigue abriendo en
 * escritorio, que ahí es cómodo; y el enlace vive dentro del panel abierto,
 * donde se ve lo que se va a visitar antes de ir.
 */
export default function Servicios({ datos = {} }) {
  const D = {
    ...datos,
    items: (datos.items ?? []).map((item, i) => ({
      ...item,
      id: item.id || `servicio-${i}`,
      href: item.enlace ?? item.href ?? '',
      puntos: (item.puntos ?? []).map((x) => (typeof x === 'string' ? x : x?.texto)).filter(Boolean),
    })),
  };
  const [activo, setActivo] = useState(D.items[0]?.id ?? null);

  return (
    <section id="servicios" className="relative py-24 sm:py-32 bg-surface-2 border-y border-line">
      <div className="relative z-10 max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12 pl-rail">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Encabezado fijo */}
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-28">
              <p className="eyebrow text-accent mb-5">{D.eyebrow}</p>
              <h2 className="h-section text-graphite mb-6">
                {D.titulo} <em className="text-accent">{D.enfasis}</em>
              </h2>
              <p className="text-base text-slate leading-relaxed mb-8">{D.lead}</p>

              {D.nota && (
                <>
                  <div className="rule-fade mb-6" />
                  <p className="font-mono text-[11px] text-ink-muted leading-relaxed whitespace-pre-line">{D.nota}</p>
                </>
              )}
            </div>
          </div>

          {/* Índice de servicios */}
          <div className="lg:col-span-8">
            <ul className="border-t border-line-strong">
              {D.items.map((item, i) => {
                const abierto = activo === item.id;
                return (
                  <motion.li
                    key={item.id}
                    initial={{ opacity: 0, y: 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.4 }}
                    transition={{ duration: 0.55, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
                    className="border-b border-line-strong"
                    onMouseEnter={() => setActivo(item.id)}
                  >
                    <button
                      type="button"
                      aria-expanded={abierto}
                      onFocus={() => setActivo(item.id)}
                      onClick={() => setActivo(abierto ? null : item.id)}
                      className="block w-full text-left group py-7 sm:py-9 cursor-pointer"
                    >
                      <div className="flex items-start gap-5 sm:gap-8">
                        <span className="font-mono text-[11px] text-ink-muted pt-2 shrink-0 w-8">
                          {String(i + 1).padStart(2, '0')}
                        </span>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-4">
                            <h3
                              className={`text-2xl sm:text-[2rem] leading-tight transition-colors ${
                                abierto ? 'text-graphite' : 'text-graphite/55'
                              }`}
                            >
                              {item.titulo}
                            </h3>

                            {/* Señal de que la fila abre. Sin ella, en un
                                teléfono no hay forma de saber que hay algo
                                debajo, y nadie toca lo que parece un título. */}
                            <span
                              aria-hidden="true"
                              className={`shrink-0 mt-1 w-8 h-8 rounded-full border flex items-center justify-center transition-colors ${
                                abierto
                                  ? 'bg-accent border-accent text-white'
                                  : 'border-line-strong text-slate group-hover:border-graphite group-hover:text-graphite'
                              }`}
                            >
                              {abierto ? <Minus className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                            </span>
                          </div>

                          <p className="mt-1.5 font-mono text-[11px] text-accent uppercase tracking-[0.12em]">
                            {item.lema}
                          </p>

                          {/* El detalle solo ocupa espacio cuando se pide. */}
                          <div
                            className={`grid transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                              abierto ? 'grid-rows-[1fr] opacity-100 mt-5' : 'grid-rows-[0fr] opacity-0'
                            }`}
                          >
                            <div className="overflow-hidden">
                              <p className="text-sm sm:text-[15px] text-slate leading-relaxed max-w-xl mb-5">
                                {item.desc}
                              </p>
                              <ul className="flex flex-wrap gap-2 mb-5">
                                {item.puntos.map((punto) => (
                                  <li
                                    key={punto}
                                    className="rounded-full border border-line-strong bg-surface px-3.5 py-1.5 text-[11px] text-slate"
                                  >
                                    {punto}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    </button>

                    {/* El enlace, fuera del botón: anidar un enlace dentro de
                        un botón no es HTML válido y en táctil vuelve ambiguo
                        qué se está tocando. */}
                    {item.href && (
                      <div
                        className={`grid transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                          abierto ? 'grid-rows-[1fr] opacity-100 pb-8' : 'grid-rows-[0fr] opacity-0'
                        }`}
                      >
                        <div className="overflow-hidden pl-[3.25rem] sm:pl-16">
                          {/* Enlace de texto, sin fondo: la sección es para leer y
                              comparar, no un muro de botones. */}
                          <a
                            href={item.href}
                            tabIndex={abierto ? 0 : -1}
                            className="group/enlace inline-flex items-center gap-1.5 border-b border-graphite/25 pb-0.5 text-[13px] font-medium text-graphite hover:border-graphite transition-colors"
                          >
                            <span>{item.href.startsWith('#') ? D.textoCotizar || 'Cotizar' : D.textoVer || 'Ver'} {item.etiqueta.toLowerCase()}</span>
                            <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover/enlace:rotate-45" />
                          </a>
                        </div>
                      </div>
                    )}
                  </motion.li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
