'use client'

import { motion } from 'framer-motion';
import { ArrowUpRight, ShieldCheck, PhoneCall } from 'lucide-react';
import { enlaceWhatsapp } from '../lib/negocio';
const ICONOS_GARANTIA = [ShieldCheck, PhoneCall];

/**
 * Cierre.
 *
 * Es el único bloque oscuro del sitio público, y por eso funciona: después de
 * doce secciones claras, el corte a negro se lee como un cambio de tono, no
 * como decoración. Si mañana se añade otra sección oscura, esta pierde su
 * efecto — el contraste editorial solo existe si es escaso.
 */
export default function Cierre({ datos: D = {}, negocio = {} }) {
  const garantias = ((l) => (l ?? []).map((x) => (typeof x === 'string' ? x : x?.texto)).filter(Boolean))(D.garantias);
  return (
    <section id="cta" className="px-3 sm:px-5 pt-8 pb-16 sm:pb-24">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        className="tema-oscuro relative w-full rounded-[var(--radius-panel)] bg-void px-6 sm:px-12 py-20 sm:py-28 text-center overflow-hidden"
      >
        <div className="grid-tech grid-tech-dark" />
        <div className="aura aura-warm w-[34rem] h-[34rem] -bottom-56 left-1/2 -translate-x-1/2 opacity-25" />

        <div className="relative z-10 flex flex-col items-center">
          <p className="eyebrow text-accent mb-6">{D.eyebrow}</p>

          <h2 className="h-section leading-[1.05] mb-8 max-w-4xl">
            {D.titulo} <em className="text-accent">{D.enfasis}</em>
          </h2>

          <p className="text-base sm:text-lg text-cream-muted max-w-2xl leading-relaxed mb-12">
            {D.lead}
          </p>

          <a href={enlaceWhatsapp(negocio, D.mensajeWhatsapp)} target="_blank" rel="noreferrer" className="pill-negra text-sm sm:text-base">
            <span>{D.boton}</span>
            <span className="disco" aria-hidden="true"><ArrowUpRight className="w-4 h-4" /></span>
          </a>

          <div className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs text-cream-muted">
            {garantias.map((texto, i) => {
              const Icono = ICONOS_GARANTIA[i % ICONOS_GARANTIA.length];
              return (
                <span key={texto} className="flex items-center gap-2">
                  <Icono className="w-4 h-4 text-accent" />
                  {texto}
                </span>
              );
            })}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
