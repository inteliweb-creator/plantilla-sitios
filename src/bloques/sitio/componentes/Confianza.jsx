'use client'

import { motion } from 'framer-motion';
import { Clock, MapPin, CalendarCheck, ArrowUpRight, Mail } from 'lucide-react';

import { enlaceWhatsapp } from '../lib/negocio';

/**
 * Confianza y contacto.
 *
 * La marca es nueva y no tiene reputación acumulada, así que esta sección no
 * puede apoyarse en reseñas ni en años de trayectoria. Lo que sí puede hacer es
 * ser concreta: horario exacto, cómo se trabaja sin oficina, cuánto tarda la
 * entrega. Un dato verificable pesa más que un adjetivo.
 *
 * Nada de lo que hay aquí es una promesa de resultados. Son hechos operativos,
 * y por eso se pueden sostener.
 */
// Textos desde el panel (inicio.json → confianza). Si un valor queda vacío se
// usa el dato de "Contacto & Marca", así el horario se cambia en un solo sitio.
const ICONOS_DATO = [Clock, MapPin, CalendarCheck];

export default function Confianza({ datos: D = {}, negocio = {} }) {
  const VALOR_POR_DEFECTO = [negocio.horario, [negocio.ciudad, negocio.departamento].filter(Boolean).join(', '), ''];
  const DATOS = (D.datos ?? []).map((d, i) => ({
    ...d,
    icono: ICONOS_DATO[i % ICONOS_DATO.length],
    valor: d.valor || VALOR_POR_DEFECTO[i] || '',
  }));
  return (
    <section id="contacto-info" className="relative py-24 sm:py-32 bg-surface-2 border-y border-line">
      <div className="relative z-10 max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12 pl-rail">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          <div className="lg:col-span-5">
            <p className="eyebrow text-accent mb-5">{D.eyebrow}</p>
            <h2 className="h-section text-graphite mb-6">
              {D.titulo} <em className="text-accent">{D.enfasis}</em>
            </h2>
            <p className="text-base text-slate leading-relaxed mb-8">
              {D.lead}
            </p>

            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <a
                href={enlaceWhatsapp(negocio, D.mensajeWhatsapp)}
                target="_blank"
                rel="noreferrer"
                className="pill-negra text-sm"
              >
                <span>{D.boton}</span>
                <span className="disco" aria-hidden="true"><ArrowUpRight className="w-4 h-4" /></span>
              </a>
              {negocio.correo && <a href={`mailto:${negocio.correo}`} className="btn-ghost-ink px-6 py-3.5 text-sm whitespace-nowrap">
                <Mail className="w-4 h-4" />
                <span>{negocio.correo}</span>
              </a>}
            </div>
          </div>

          <div className="lg:col-span-7">
            <ul className="border-t border-line-strong">
              {DATOS.map((d, i) => {
                const Icono = d.icono;
                return (
                  <motion.li
                    key={d.etiqueta}
                    initial={{ opacity: 0, y: 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.4 }}
                    transition={{ duration: 0.6, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                    className="border-b border-line-strong py-7 flex items-start gap-5"
                  >
                    <span className="w-10 h-10 rounded-[11px] bg-surface border border-line flex items-center justify-center shrink-0">
                      <Icono className="w-4 h-4 text-accent" />
                    </span>
                    <div className="min-w-0">
                      <p className="eyebrow text-ink-muted mb-2">{d.etiqueta}</p>
                      <p className="text-xl sm:text-2xl text-graphite leading-tight mb-2">{d.valor}</p>
                      <p className="text-sm text-slate leading-relaxed">{d.nota}</p>
                    </div>
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
