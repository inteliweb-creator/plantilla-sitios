'use client'

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, MessageSquare, ArrowUpRight } from 'lucide-react';
import { enlaceWhatsapp } from '../lib/negocio';



export default function Preguntas({ datos: D = {}, preguntas = [], negocio = {} }) {
  const faqs = preguntas.map((p) => ({ q: p.pregunta, a: p.respuesta }));
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section id="faq" className="py-24 md:py-32 relative">
      <div className="max-w-4xl mx-auto px-5 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <p className="eyebrow text-accent mb-5">{D.eyebrow}</p>
          <h2 className="h-section text-graphite mb-5">
            {D.titulo} <em className="text-accent">{D.enfasis}</em>
          </h2>
        </motion.div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <motion.div
                key={faq.q}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-30px' }}
                transition={{ duration: 0.5, delay: idx * 0.06 }}
                className={`rounded-[var(--radius-card)] border transition-colors duration-300 overflow-hidden ${
                  isOpen ? 'bg-surface border-accent/40' : 'bg-transparent border-line hover:border-line-strong'
                }`}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full p-6 sm:p-7 text-left flex items-center justify-between gap-4 font-display text-xl sm:text-2xl text-graphite"
                  aria-expanded={isOpen}
                >
                  <span>{faq.q}</span>
                  <span
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                      isOpen ? 'bg-accent text-white' : 'bg-surface-2 text-graphite'
                    }`}
                  >
                    {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  </span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                    >
                      <p className="px-6 sm:px-7 pb-6 pt-1 text-sm text-slate leading-relaxed">
                        {faq.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-12 rounded-[var(--radius-card)] bg-surface p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-left">
            <MessageSquare className="w-5 h-5 text-accent shrink-0" />
            <div>
              <span className="block text-sm font-semibold text-graphite">{D.otraDudaTitulo}</span>
              <span className="text-xs text-ink-muted">{D.otraDudaTexto}</span>
            </div>
          </div>
          <a href={enlaceWhatsapp(negocio, D.mensajeWhatsapp)} target="_blank" rel="noreferrer" className="pill-negra text-sm shrink-0">
            <span>{D.boton}</span>
            <span className="disco" aria-hidden="true"><ArrowUpRight className="w-4 h-4" /></span>
          </a>
        </div>
      </div>
    </section>
  );
}
