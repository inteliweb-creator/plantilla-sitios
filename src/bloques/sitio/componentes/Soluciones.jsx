'use client'

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Bot, Award, Check, ChevronRight, ChevronLeft, Hand } from 'lucide-react';


// Iconos y widget ilustrativo se quedan en el código: son la parte visual, no
// texto editable. Van emparejados por posición con los paneles de los datos.
//
// Esta sección es la SOLUCIÓN en espejo del problema: tres paneles en el
// mismo orden que las tres escenas de la sección anterior —Google, WhatsApp,
// confianza—. Si se reordenan las escenas, hay que reordenar esto también, o
// el espejo se rompe.
const ICONOS = [Search, Bot, Award];
const WIDGETS = ['google', 'bot', 'authority'];

const panelesDe = (D) =>
  (D.items ?? []).map((item, i) => ({
    ...item,
    id: item.id || `solucion-${i}`,
    puntos: (item.puntos ?? []).map((x) => (typeof x === 'string' ? x : x?.texto)).filter(Boolean),
    icon: ICONOS[i % ICONOS.length],
    type: item.widget || WIDGETS[i % WIDGETS.length],
  }));

/** Widget ilustrativo propio de cada panel. */
function PanelWidget({ type }) {
  if (type === 'google') {
    return (
      <div className="glass-pill w-full max-w-xl rounded-[var(--radius-tile)] px-4 py-3.5 mb-7">
        <Search className="w-4 h-4 text-slate shrink-0" />
        <span className="text-sm text-slate flex-1">¿Dónde queda [tu negocio]?</span>
        <span className="text-[10px] font-semibold text-ink-muted">GOOGLE</span>
      </div>
    );
  }

  if (type === 'dilemma') {
    return (
      <div className="grid grid-cols-2 gap-3 max-w-xl mb-7">
        <div className="glass-pill flex-col items-start rounded-[var(--radius-tile)] px-4 py-3.5">
          <span className="text-[10px] font-semibold text-ink-muted">SIN SITIO</span>
          <span className="text-sm text-slate">Duda y descarta</span>
        </div>
        <div className="rounded-[var(--radius-tile)] bg-surface px-4 py-3.5">
          <span className="text-[10px] font-semibold text-ink-muted block">CON SITIO</span>
          <span className="text-sm text-graphite font-medium">Confirma y compra</span>
        </div>
      </div>
    );
  }

  if (type === 'bot') {
    return (
      <div className="glass-pill w-full max-w-xl rounded-[var(--radius-tile)] px-4 py-3.5 mb-7 justify-between">
        <span className="text-sm text-slate">Atención automática</span>
        <span className="text-[11px] font-semibold text-graphite">1:00 a.m. · activo</span>
      </div>
    );
  }

  return (
    <div className="glass-pill w-full max-w-xl rounded-[var(--radius-tile)] px-4 py-3.5 mb-7 justify-between">
      <span className="text-sm text-slate">Respaldo digital verificable</span>
      <Award className="w-4 h-4 text-graphite" />
    </div>
  );
}

/**
 * Cuánto dura cada panel en pantalla antes de pasar solo al siguiente.
 * Da tiempo a leer el titular y el texto sin que el relevo se sienta lento.
 */
const DURACION_MS = 7000;

export default function Soluciones({ datos: D = {} }) {
  const panels = panelesDe(D);
  const [activePanel, setActivePanel] = useState(0);
  const [progreso, setProgreso] = useState(0);
  const [enPantalla, setEnPantalla] = useState(false);
  const [pausado, setPausado] = useState(false);
  // En cuanto la persona elige un panel a mano, el avance automático se
  // retira: ya descubrió que hay más y no hay que quitarle el control.
  const [interactuado, setInteractuado] = useState(false);
  const [reducido, setReducido] = useState(false);
  const seccion = useRef(null);
  // El progreso vive en una ref para que el bucle lo acumule sin depender de
  // actualizaciones de estado encadenadas; el estado solo se usa para pintar.
  const progresoRef = useRef(0);

  const irA = (idx, manual = true) => {
    setActivePanel((idx + panels.length) % panels.length);
    progresoRef.current = 0;
    setProgreso(0);
    if (manual) setInteractuado(true);
  };
  const handleNext = () => irA(activePanel + 1);
  const handlePrev = () => irA(activePanel - 1);

  useEffect(() => {
    setReducido(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    const el = seccion.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setEnPantalla(e.isIntersecting), { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  /**
   * Avance automático.
   *
   * Existe porque los paneles 2 y 3 solo se ven con un clic, y quien baja la
   * página con la rueda no suele pararse a pulsar flechas: da por hecho que lo
   * que ve es todo lo que hay. Así las tres soluciones pasan por delante aunque
   * nadie toque nada.
   *
   * Solo corre con la sección en pantalla, se pausa con el cursor encima o con
   * foco de teclado dentro, y no arranca con movimiento reducido.
   */
  const corriendo = enPantalla && !pausado && !interactuado && !reducido;
  useEffect(() => {
    if (!corriendo) return;
    let raf = 0;
    let previo = performance.now();
    const paso = (ahora) => {
      const dt = ahora - previo;
      previo = ahora;
      progresoRef.current += dt / DURACION_MS;
      if (progresoRef.current >= 1) {
        progresoRef.current = 0;
        setActivePanel((a) => (a + 1) % panels.length);
      }
      setProgreso(progresoRef.current);
      raf = requestAnimationFrame(paso);
    };
    raf = requestAnimationFrame(paso);
    return () => cancelAnimationFrame(raf);
  }, [corriendo]);

  const current = panels[activePanel];

  return (
    <section
      ref={seccion}
      id="horizontal"
      className="py-24 md:py-32 relative overflow-hidden min-h-[85vh] flex flex-col justify-center"
      onMouseEnter={() => setPausado(true)}
      onMouseLeave={() => setPausado(false)}
      onFocusCapture={() => setPausado(true)}
      onBlurCapture={() => setPausado(false)}
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 pl-rail w-full relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-6">
          <div>
            <p className="eyebrow text-accent mb-5">{D.eyebrow}</p>
            <h2 className="h-section text-graphite max-w-2xl">
              {D.titulo} <em className="text-accent">{D.enfasis}</em>
            </h2>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={handlePrev}
              className="w-12 h-12 rounded-full glass flex items-center justify-center text-graphite hover:bg-surface-3 transition-colors"
              aria-label="Solución anterior"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="glass-pill px-4 py-2 text-xs text-graphite">
              {activePanel + 1} / {panels.length}
            </span>
            {/* La flecha siguiente late suave hasta la primera interacción:
                es la señal de que hay algo más a la derecha. */}
            <button
              onClick={handleNext}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                interactuado ? 'glass text-graphite hover:bg-surface-3' : 'bg-graphite text-white flecha-llamada'
              }`}
              aria-label="Solución siguiente"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ---------- Pestañas con nombre y progreso ----------
            Sustituyen a los puntos: tres cápsulas con el nombre de cada
            solución, las mismas de la sección del problema. Se entiende de un
            vistazo que hay tres y cuáles son. La activa se llena mientras
            corre el avance automático. */}
        <div role="tablist" aria-label="Soluciones" className="grid grid-cols-3 gap-2 sm:gap-3 mb-3">
          {panels.map((p, idx) => {
            const activa = activePanel === idx;
            const nombre = (p.etiqueta || '').split(' · ')[0];
            const Icono = p.icon;
            return (
              <button
                key={p.id}
                role="tab"
                aria-selected={activa}
                onClick={() => irA(idx)}
                className={`relative overflow-hidden rounded-full h-12 sm:h-14 flex items-center justify-center gap-2 text-[13px] sm:text-[15px] font-medium tracking-[-0.02em] transition-colors ${
                  activa ? 'bg-graphite text-white' : 'bg-[#F1F1F0] text-graphite hover:bg-[#E7E8E9]'
                }`}
              >
                {activa && (
                  <span
                    aria-hidden="true"
                    className="absolute inset-y-0 left-0 capsula-bronce opacity-90"
                    style={{ width: `${(interactuado || reducido ? 1 : progreso) * 100}%` }}
                  />
                )}
                <Icono className="relative w-4 h-4 shrink-0" />
                <span className="relative">{nombre}</span>
              </button>
            );
          })}
        </div>

        <p
          className={`flex items-center justify-center gap-2 text-[12px] text-slate mb-6 transition-opacity duration-500 ${
            interactuado ? 'opacity-0' : 'opacity-100'
          }`}
          aria-hidden={interactuado}
        >
          <Hand className="w-3.5 h-3.5" />
          {(D.pista || 'Toca o desliza para ver las {n} soluciones').replace('{n}', panels.length)}
        </p>

        {/* Las tres tarjetas ocupan la MISMA celda de rejilla: dos copias
            invisibles fijan la altura de la más alta y la visible se estira a
            ella. Sin esto la de Google medía menos, y cada relevo automático
            cambiaba el alto de la sección y empujaba todo lo de abajo. */}
        <div className="grid">
          {panels.map((p) => (
            <div
              key={`medida-${p.id}`}
              aria-hidden="true"
              inert
              className="card grain p-8 sm:p-12 min-h-[440px] flex flex-col justify-between overflow-hidden invisible pointer-events-none [grid-area:1/1]"
            >
              <ContenidoTarjeta panel={p} />
            </div>
          ))}

          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              // Deslizar con el dedo o arrastrar con el ratón. La tarjeta vuelve
              // a su sitio al soltar; solo si el gesto supera 60px cambia de panel,
              // con la misma animación de entrada y salida de siempre.
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.18}
              onDragEnd={(_, info) => {
                if (info.offset.x < -60) handleNext();
                else if (info.offset.x > 60) handlePrev();
              }}
              className="card grain p-8 sm:p-12 min-h-[440px] flex flex-col justify-between overflow-hidden [grid-area:1/1] cursor-grab active:cursor-grabbing touch-pan-y"
            >
              <ContenidoTarjeta panel={current} />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

/** Contenido de una tarjeta de solución. */
function ContenidoTarjeta({ panel }) {
  const Icono = panel.icon;
  return (
    <>
      <div className={`mesh ${panel.malla}`} />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-7">
          <span className="glass-pill px-3.5 py-1.5 text-[11px] font-semibold text-graphite">
            {panel.etiqueta}
          </span>
          <div className="glass-orb w-11 h-11 flex items-center justify-center">
            <Icono className="w-5 h-5 text-graphite" />
          </div>
        </div>

        <h3 className="text-3xl sm:text-[2.6rem] text-graphite mb-6 max-w-3xl">
          {panel.titulo}
        </h3>

        <PanelWidget type={panel.type} />

        <p className="text-sm sm:text-base text-slate leading-relaxed max-w-3xl">
          {panel.desc}
        </p>
      </div>

      <div className="relative z-10 grid grid-cols-1 sm:grid-cols-3 gap-3 pt-7 mt-7 border-t border-line">
        {panel.puntos.map((item) => (
          <div key={item} className="flex items-start gap-2.5 text-xs text-slate">
            <Check className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{item}</span>
          </div>
        ))}
      </div>
    </>
  );
}
