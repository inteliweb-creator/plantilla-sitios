'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';

/**
 * Acordeón reutilizable de las páginas de servicio. Recibe los mismos datos que
 * alimentan el schema FAQPage de la página, para que nunca se desincronicen.
 */
export default function FaqAccordion({ items }) {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className="space-y-3">
      {items.map((faq, idx) => {
        const isOpen = openIndex === idx;
        return (
          <motion.div
            key={faq.q}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-30px' }}
            transition={{ duration: 0.45, delay: idx * 0.06 }}
            className={`rounded-[var(--radius-card)] border transition-colors duration-300 overflow-hidden ${
              isOpen ? 'bg-white border-white shadow-[var(--shadow-lift)]' : 'bg-white/60 border-line hover:border-line-strong'
            }`}
          >
            <button
              onClick={() => setOpenIndex(isOpen ? null : idx)}
              className="w-full p-6 text-left flex items-center justify-between gap-4 text-[1.15rem] sm:text-[1.4rem] leading-[1.15] tracking-[-0.035em] font-medium text-graphite"
              aria-expanded={isOpen}
            >
              <span>{faq.q}</span>
              <span
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                  isOpen ? 'bg-[#0E0F11] text-white' : 'bg-[#F1F1F0] text-graphite'
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
                  <p className="px-6 pb-6 pt-1 text-[15px] text-slate leading-relaxed max-w-2xl">{faq.a}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </div>
  );
}
