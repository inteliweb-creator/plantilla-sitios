'use client'

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Check } from 'lucide-react';

import { enlaceWhatsapp } from '../lib/negocio';

/**
 * Cotizador — el punto de conversión del sitio.
 *
 * No calcula un precio, y eso es intencional: el precio es personalizado y
 * publicar una cifra inventada sería exactamente el tipo de promesa que esta
 * marca decidió no hacer. Lo que calcula es el *encargo*: convierte cuatro
 * respuestas en un mensaje de WhatsApp ya escrito, con la información que hace
 * falta para cotizar de verdad.
 *
 * Eso resuelve el problema real de la conversión: la persona que quiere
 * escribir pero no sabe qué decir, y termina no escribiendo. Aquí llega al
 * chat con el mensaje redactado.
 */

// Opciones editables desde el panel (inicio.json → cotizador). El
// identificador de cada opción es su posición: renombrar una opción no rompe
// la selección.
export default function Cotizador({ datos: D = {}, negocio: infoNegocio = {} }) {
  const textos = (l) => (l ?? []).map((x) => (typeof x === 'string' ? x : x?.texto)).filter(Boolean);
  const aOpciones = (lista) => textos(lista).map((label, i) => ({ id: String(i), label }));
  const TIPOS = (D.tipos ?? []).map((t, i) => ({ id: String(i), label: t.label, desc: t.desc }));
  const TAMANOS = aOpciones(D.tamanos);
  const EXTRAS = aOpciones(D.extras);
  const PLAZOS = aOpciones(D.plazos);
  const whatsappLink = (mensaje) => enlaceWhatsapp(infoNegocio, mensaje);
  const [tipo, setTipo] = useState(TIPOS[0]?.id);
  const [tamano, setTamano] = useState((TAMANOS[1] ?? TAMANOS[0])?.id);
  const [extras, setExtras] = useState(EXTRAS.length ? [EXTRAS[0].id] : []);
  const [plazo, setPlazo] = useState(PLAZOS[0]?.id);
  const [negocio, setNegocio] = useState('');

  const alternar = (id) =>
    setExtras((previos) =>
      previos.includes(id) ? previos.filter((e) => e !== id) : [...previos, id]
    );

  // El mensaje se arma en el cliente y se abre con `wa.me`. No se envía nada a
  // ningún servidor: la conversación empieza directamente en el chat, que es
  // donde esta audiencia se siente cómoda.
  const mensaje = useMemo(() => {
    const t = TIPOS.find((x) => x.id === tipo)?.label ?? '';
    const s = TAMANOS.find((x) => x.id === tamano)?.label ?? '';
    const p = PLAZOS.find((x) => x.id === plazo)?.label ?? '';
    const listaExtras = EXTRAS.filter((e) => extras.includes(e.id)).map((e) => e.label);

    const lineas = [
      D.saludo,
      '',
      negocio.trim() ? `Negocio: ${negocio.trim()}` : null,
      `Necesito: ${t}`,
      `Tamaño estimado: ${s}`,
      listaExtras.length ? `También me interesa: ${listaExtras.join(', ')}` : null,
      `Cuándo: ${p}`,
    ].filter(Boolean);

    return lineas.join('\n');
  }, [tipo, tamano, extras, plazo, negocio]);

  const Opcion = ({ activo, children, ...props }) => (
    <button
      type="button"
      aria-pressed={activo}
      className={`text-left rounded-[var(--radius-tile)] border px-4 py-3 transition-all ${
        activo
          ? 'border-accent bg-accent-tint'
          : 'border-line bg-surface hover:border-line-strong'
      }`}
      {...props}
    >
      {children}
    </button>
  );

  return (
    <section id="cotizador" className="relative py-24 sm:py-32 overflow-hidden">
      <div className="aura aura-warm w-[36rem] h-[36rem] -bottom-40 -right-40 opacity-30" />
      <div className="grid-tech opacity-50" />

      <div className="relative z-10 max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12 pl-rail">
        <div className="max-w-3xl mb-12">
          <p className="eyebrow text-accent mb-5">{D.eyebrow}</p>
          <h2 className="h-section text-graphite mb-6">
            {D.titulo} <em className="text-accent">{D.enfasis}</em>
          </h2>
          <p className="text-base sm:text-lg text-slate leading-relaxed">
            {D.lead}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* ---------- Preguntas ---------- */}
          <div className="lg:col-span-7 card p-6 sm:p-8 space-y-8">
            <fieldset>
              <legend className="eyebrow text-ink-muted mb-4">{D.preguntaTipo}</legend>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {TIPOS.map((t) => (
                  <Opcion key={t.id} activo={tipo === t.id} onClick={() => setTipo(t.id)}>
                    <span className="block text-sm font-semibold text-graphite mb-0.5">{t.label}</span>
                    <span className="block text-[11px] text-ink-muted leading-snug">{t.desc}</span>
                  </Opcion>
                ))}
              </div>
            </fieldset>

            <fieldset>
              <legend className="eyebrow text-ink-muted mb-4">{D.preguntaTamano}</legend>
              <div className="flex flex-wrap gap-2">
                {TAMANOS.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    aria-pressed={tamano === t.id}
                    onClick={() => setTamano(t.id)}
                    className={`rounded-full border px-4 py-2 text-xs font-semibold transition-all ${
                      tamano === t.id
                        ? 'border-graphite bg-graphite text-canvas'
                        : 'border-line-strong text-slate hover:border-graphite hover:text-graphite'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </fieldset>

            <fieldset>
              <legend className="eyebrow text-ink-muted mb-4">{D.preguntaExtras}</legend>
              <div className="flex flex-wrap gap-2">
                {EXTRAS.map((e) => {
                  const activo = extras.includes(e.id);
                  return (
                    <button
                      key={e.id}
                      type="button"
                      aria-pressed={activo}
                      onClick={() => alternar(e.id)}
                      className={`inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-xs font-semibold transition-all ${
                        activo
                          ? 'border-accent bg-accent-tint text-accent'
                          : 'border-line-strong text-slate hover:border-graphite hover:text-graphite'
                      }`}
                    >
                      {activo && <Check className="w-3 h-3" />}
                      {e.label}
                    </button>
                  );
                })}
              </div>
            </fieldset>

            <fieldset>
              <legend className="eyebrow text-ink-muted mb-4">{D.preguntaPlazo}</legend>
              <div className="flex flex-wrap gap-2">
                {PLAZOS.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    aria-pressed={plazo === p.id}
                    onClick={() => setPlazo(p.id)}
                    className={`rounded-full border px-4 py-2 text-xs font-semibold transition-all ${
                      plazo === p.id
                        ? 'border-graphite bg-graphite text-canvas'
                        : 'border-line-strong text-slate hover:border-graphite hover:text-graphite'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </fieldset>

            <div>
              <label htmlFor="q-negocio" className="eyebrow text-ink-muted mb-3 block">
                {D.preguntaNegocio}
              </label>
              <input
                id="q-negocio"
                type="text"
                value={negocio}
                onChange={(ev) => setNegocio(ev.target.value)}
                placeholder={D.ejemploNegocio}
                className="w-full rounded-[var(--radius-tile)] border border-line bg-surface px-4 py-3 text-sm text-graphite placeholder:text-ink-muted/60 focus:border-accent focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* ---------- Vista previa del mensaje ---------- */}
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-28 card p-6 sm:p-7">
              <p className="eyebrow text-ink-muted mb-4">{D.tituloMensaje}</p>

              <motion.pre
                key={mensaje}
                initial={{ opacity: 0.4 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.25 }}
                className="rounded-[var(--radius-tile)] bg-surface-2 border border-line p-4 font-sans text-[13px] text-slate leading-relaxed whitespace-pre-wrap mb-6"
              >
                {mensaje}
              </motion.pre>

              <a
                href={whatsappLink(mensaje)}
                target="_blank"
                rel="noreferrer"
                className="pill-negra w-full text-sm mb-4"
              >
                <span>{D.boton}</span>
                <span className="disco" aria-hidden="true"><ArrowUpRight className="w-4 h-4" /></span>
              </a>

              <p className="text-[11px] text-ink-muted leading-relaxed text-center">
                {D.nota}
                {infoNegocio.horario && (
                  <>
                    <br />
                    Respondemos {infoNegocio.horario}.
                  </>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
