'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check } from 'lucide-react';
import { textos } from '../lib/negocio.js';

/**
 * "El control": una reproducción del
 * panel que muestra cómo el cliente cambia su propio sitio. Cada pestaña es
 * una pantalla con sus campos de ejemplo; todo se edita desde el panel.
 */
export default function Panel({ datos: D, negocio }) {
  const pantallas = (D.pantallas || []).slice(0, 4);
  const [activa, setActiva] = useState(0);
  const pantalla = pantallas[activa] || pantallas[0];
  const ahorro = textos(D.ahorro);

  return (
    <section id="panel" className="relative py-24 sm:py-32 overflow-hidden">
      <div className="aura aura-sky w-[38rem] h-[38rem] -top-40 -left-40 opacity-25" />
      <div className="grid-tech opacity-60" />

      <div className="relative z-10 max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12 pl-rail">
        <div className="max-w-3xl mb-14">
          {D.eyebrow && <p className="eyebrow text-accent mb-5">{D.eyebrow}</p>}
          <h2 className="h-section text-graphite mb-6">
            {D.titulo} {D.enfasis && <em className="text-accent">{D.enfasis}</em>}
          </h2>
          {D.lead && <p className="text-base sm:text-lg text-slate leading-relaxed">{D.lead}</p>}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {pantalla && (
            <div className="lg:col-span-8">
              <div className="flex flex-wrap gap-2 mb-4">
                {pantallas.map((p, i) => (
                  <button
                    key={i}
                    onClick={() => setActiva(i)}
                    aria-pressed={activa === i}
                    className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                      activa === i ? 'bg-graphite text-canvas' : 'border border-line-strong text-slate hover:text-graphite hover:border-graphite'
                    }`}
                  >
                    {p.pestana}
                  </button>
                ))}
              </div>

              <div className="card overflow-hidden shadow-[var(--shadow-lift)]">
                <div className="flex items-center gap-2 px-4 py-2.5 border-b border-line bg-surface-2">
                  <span className="flex gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-line-strong" />
                    <span className="w-2.5 h-2.5 rounded-full bg-line-strong" />
                    <span className="w-2.5 h-2.5 rounded-full bg-line-strong" />
                  </span>
                  <span className="flex-1 mx-2 rounded-full bg-surface border border-line px-3 py-1 font-mono text-[10px] text-ink-muted truncate">
                    {D.direccion || 'tunegocio.com/panel'}
                  </span>
                </div>

                <div className="tema-oscuro grid grid-cols-12 bg-void text-cream min-h-[22rem]">
                  <aside className="hidden sm:block col-span-4 md:col-span-3 border-r border-white/8 p-3">
                    <div className="flex items-center gap-2 px-2 py-2 mb-3">
                      {negocio?.isotipo?.url ? (
                        <img src={negocio.isotipo.url} alt="" className="w-5 h-5 object-contain invert" />
                      ) : (
                        <span className="w-5 h-5 rounded-md bg-accent" />
                      )}
                      <span className="text-[11px] font-semibold text-cream">Panel {negocio?.nombre}</span>
                    </div>
                    <ul className="space-y-0.5">
                      {pantallas.map((p, i) => (
                        <li key={i}>
                          <span className={`flex items-center gap-2 rounded-lg px-2.5 py-2 text-[11px] transition-colors ${activa === i ? 'bg-accent/15 text-accent font-semibold' : 'text-cream-muted'}`}>
                            <span className="w-1.5 h-1.5 rounded-full bg-current shrink-0" />
                            <span className="truncate">{p.titulo}</span>
                          </span>
                        </li>
                      ))}
                    </ul>
                  </aside>

                  <div className="col-span-12 sm:col-span-8 md:col-span-9 p-5 sm:p-7">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={activa}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                      >
                        <p className="text-xl text-cream mb-1.5">{pantalla.titulo}</p>
                        <p className="text-xs text-cream-muted mb-6">{pantalla.resumen}</p>
                        <div className="space-y-3">
                          {(pantalla.campos || []).map((c, i) => (
                            <span key={i} className="block">
                              <span className="block text-[10px] text-cream-muted mb-1.5">{c.etiqueta}</span>
                              <span className="block rounded-lg bg-white/5 border border-white/10 px-3 py-2.5 text-[12px] text-cream truncate">{c.valor}</span>
                            </span>
                          ))}
                        </div>
                        <div className="mt-6 flex items-center gap-3">
                          <span className="inline-flex items-center rounded-full bg-white text-[#0E0F11] font-medium whitespace-nowrap px-5 py-2.5 text-xs pointer-events-none">Guardar cambios</span>
                          <span className="inline-flex items-center gap-1.5 text-[11px] text-cream-muted">
                            <Check className="w-3.5 h-3.5 text-accent" />
                            Publicado hace un momento
                          </span>
                        </div>
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>
              </div>

              {D.pie && <p className="mt-3 font-mono text-[10px] text-ink-muted">{D.pie}</p>}
            </div>
          )}

          <div className="lg:col-span-4">
            <div className="card p-7">
              {D.ahorroTitulo && <h3 className="text-2xl text-graphite mb-5 leading-tight">{D.ahorroTitulo}</h3>}
              <ul className="space-y-4 mb-7">
                {ahorro.map((g) => (
                  <li key={g} className="flex items-start gap-3 text-sm text-slate leading-relaxed">
                    <Check className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                    <span>{g}</span>
                  </li>
                ))}
              </ul>
              {D.nota && (
                <>
                  <div className="rule-fade mb-6" />
                  <p className="text-sm text-slate leading-relaxed">{D.nota}</p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
