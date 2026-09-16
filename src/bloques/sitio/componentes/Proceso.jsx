'use client'

import { motion } from 'framer-motion';
import { Check } from 'lucide-react';


// El número se calcula por posición: si se añade o quita un paso, la numeración
// se recoloca sola en vez de quedar en 01, 02, 04.


export default function Proceso({ datos: D = {} }) {
  const steps = (D.items ?? []).map((item, i) => ({ ...item, num: String(i + 1).padStart(2, '0') }));
  return (
    <section id="proceso" className="py-24 md:py-32 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 pl-rail relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <p className="eyebrow text-accent mb-5">{D.eyebrow}</p>
          <h2 className="h-section text-graphite mb-5">
            {D.titulo} <em className="text-accent">{D.enfasis}</em>
          </h2>
          <p className="text-base sm:text-lg text-slate leading-relaxed">{D.lead}</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
          {steps.map((step, idx) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, delay: idx * 0.15 }}
              className="bg-surface rounded-[var(--radius-card)] p-8 flex flex-col justify-between transition-transform duration-300 hover:-translate-y-1.5"
            >
              <div>
                <span className="font-mono text-4xl font-medium text-accent block mb-6">{step.num}</span>
                <h3 className="text-2xl text-graphite mb-3">{step.titulo}</h3>
                <p className="text-sm text-ink-muted leading-relaxed mb-7">{step.desc}</p>
              </div>

              <div className="pt-5 border-t border-line flex items-center gap-2 text-xs font-medium text-slate">
                <Check className="w-4 h-4 text-accent" />
                <span>{step.detalle}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
