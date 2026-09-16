'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { MessageCircle, Menu, X, ArrowUpRight, Home } from 'lucide-react';
import { enlaceWhatsapp } from '../lib/negocio.js';
import { EVENTO_MENU, ICONOS, MarcaNegocio, esActivo, esExterno } from './comun.jsx';

/**
 * Navegación con dos formas:
 *
 * - Escritorio: riel vertical de iconos en el canto izquierdo con aumento
 *   tipo dock al pasar el cursor. El último icono siempre es WhatsApp.
 * - Celular: capa a pantalla completa con la lista del menú, que se abre
 *   desde el botón de la cabecera (o el flotante si no hay cabecera).
 *
 * Ambas se renderizan y CSS decide cuál se ve, para no saltar al hidratar.
 */

const REPOSO = 40;
const AUMENTO = 68;
const ALCANCE = 130;
const MUELLE = { mass: 0.1, stiffness: 150, damping: 12 };

function IconoDock({ mouseY, item, activo = false, whatsapp = false, reducido }) {
  const ref = useRef(null);
  const [encima, setEncima] = useState(false);
  const Icon = item.icon;
  const externo = whatsapp || esExterno(item.href);

  const distancia = useTransform(mouseY, (y) => {
    const caja = ref.current?.getBoundingClientRect() ?? { y: 0, height: 0 };
    return y - caja.y - caja.height / 2;
  });
  const tam = useSpring(
    useTransform(distancia, [-ALCANCE, 0, ALCANCE], reducido ? [REPOSO, REPOSO, REPOSO] : [REPOSO, AUMENTO, REPOSO]),
    MUELLE,
  );
  const tamIcono = useSpring(
    useTransform(distancia, [-ALCANCE, 0, ALCANCE], reducido ? [16, 16, 16] : [16, 28, 16]),
    MUELLE,
  );

  return (
    <a
      href={item.href}
      aria-label={item.name}
      aria-current={activo ? 'page' : undefined}
      {...(externo ? { target: '_blank', rel: 'noreferrer' } : {})}
      onMouseEnter={() => setEncima(true)}
      onMouseLeave={() => setEncima(false)}
      onFocus={() => setEncima(true)}
      onBlur={() => setEncima(false)}
      className="relative block"
    >
      <motion.span
        ref={ref}
        style={{ width: tam, height: tam }}
        className={`rail-btn rail-dock ${whatsapp ? '!bg-accent !border-accent text-white hover:!bg-accent-soft' : ''}`}
      >
        <motion.span style={{ width: tamIcono, height: tamIcono }} className="flex items-center justify-center">
          <Icon className={`w-full h-full pointer-events-none ${whatsapp ? 'fill-current' : ''}`} />
        </motion.span>
      </motion.span>

      <AnimatePresence>
        {encima && (
          <motion.span
            initial={{ opacity: 0, x: -6, y: '-50%' }}
            animate={{ opacity: 1, x: 0, y: '-50%' }}
            exit={{ opacity: 0, x: -4, y: '-50%' }}
            transition={{ duration: 0.18 }}
            className="absolute left-[calc(100%+0.75rem)] top-1/2 whitespace-nowrap rounded-lg bg-graphite px-2.5 py-1 text-[11px] font-medium text-white pointer-events-none shadow-lg z-20"
          >
            {item.name}
          </motion.span>
        )}
      </AnimatePresence>
    </a>
  );
}

function RielEscritorio({ ruta, items, negocio }) {
  const mouseY = useMotionValue(Infinity);
  const [reducido, setReducido] = useState(false);
  useEffect(() => {
    setReducido(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }, []);

  return (
    <div className="marco hidden lg:block">
      <nav
        aria-label="Navegación principal"
        className="fixed left-0 top-1/2 -translate-y-1/2 z-40 w-[6.5rem] flex justify-center opacity-[0.55] hover:opacity-100 focus-within:opacity-100 transition-opacity duration-300"
      >
        <div
          onMouseMove={(e) => mouseY.set(e.clientY)}
          onMouseLeave={() => mouseY.set(Infinity)}
          className="rail-capsula flex flex-col items-center gap-2 py-3"
        >
          {items.map((item, i) => (
            <IconoDock
              key={`${item.href}-${i}`}
              mouseY={mouseY}
              item={item}
              activo={esActivo(ruta, item.href)}
              reducido={reducido}
            />
          ))}

          {negocio?.whatsapp && (
            <>
              <span className="h-2" aria-hidden="true" />
              <IconoDock
                mouseY={mouseY}
                item={{ name: 'WhatsApp directo', href: enlaceWhatsapp(negocio), icon: MessageCircle }}
                whatsapp
                reducido={reducido}
              />
            </>
          )}
        </div>
      </nav>
    </div>
  );
}

function MenuMovil({ ruta, items, negocio }) {
  const [abierto, setAbierto] = useState(false);
  const panel = useRef(null);

  useEffect(() => {
    const abrir = () => setAbierto(true);
    window.addEventListener(EVENTO_MENU, abrir);
    return () => window.removeEventListener(EVENTO_MENU, abrir);
  }, []);

  // Al cambiar de página, el menú se cierra.
  useEffect(() => setAbierto(false), [ruta]);

  useEffect(() => {
    if (!abierto) return;
    const escape = (e) => e.key === 'Escape' && setAbierto(false);
    const previo = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', escape);
    panel.current?.focus();
    return () => {
      document.body.style.overflow = previo;
      window.removeEventListener('keydown', escape);
    };
  }, [abierto]);

  return (
    <>
      <button
        onClick={() => setAbierto(true)}
        aria-expanded={abierto}
        aria-label="Abrir menú de navegación"
        className={`marco boton-menu-flotante lg:hidden fixed bottom-5 right-4 z-50 w-14 h-14 rounded-full flex items-center justify-center border border-line bg-surface/90 text-graphite backdrop-blur-xl shadow-[var(--shadow-lift)] transition-opacity ${
          abierto ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
      >
        <Menu className="w-5 h-5" />
      </button>

      <div
        ref={panel}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label="Navegación"
        className={`marco lg:hidden fixed inset-0 z-[100] bg-canvas outline-none ${abierto ? 'flex flex-col' : 'hidden'}`}
      >
        <div className="relative z-10 flex items-center justify-between px-5 pt-6">
          <a href="/" onClick={() => setAbierto(false)} aria-label={`${negocio?.nombre || ''}, inicio`}>
            <MarcaNegocio negocio={negocio} tam={negocio?.logo?.url ? 26 : 30} claseTexto="text-[17px]" />
          </a>
          <button
            onClick={() => setAbierto(false)}
            aria-label="Cerrar menú"
            className="w-12 h-12 rounded-full bg-accent text-white flex items-center justify-center shadow-[var(--shadow-lift)] active:scale-95 transition-transform"
          >
            <X className="w-5 h-5" strokeWidth={2.5} />
          </button>
        </div>

        <nav aria-label="Navegación principal" className="relative z-10 flex-1 overflow-y-auto flex flex-col justify-center px-5 py-6">
          {items.map((item, idx) => {
            const Icon = item.icon;
            const activo = esActivo(ruta, item.href);
            return (
              <a
                key={`${item.href}-${idx}`}
                href={item.href}
                onClick={() => setAbierto(false)}
                aria-current={activo ? 'page' : undefined}
                {...(esExterno(item.href) ? { target: '_blank', rel: 'noreferrer' } : {})}
                className={`flex items-center gap-4 py-3.5 border-b border-line transition-colors ${
                  activo ? 'text-accent' : 'text-graphite hover:text-accent'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0 opacity-60" />
                <span className="text-xl font-medium tracking-[-0.02em]">{item.name}</span>
                {activo && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-accent shrink-0" />}
              </a>
            );
          })}
        </nav>

        {negocio?.whatsapp && (
          <div className="relative z-10 px-5 pb-8">
            <a href={enlaceWhatsapp(negocio)} target="_blank" rel="noreferrer" className="pill-negra w-full text-sm">
              <span>WhatsApp directo</span>
              <span className="disco" aria-hidden="true"><ArrowUpRight className="w-4 h-4" /></span>
            </a>
          </div>
        )}
      </div>
    </>
  );
}

const aItems = (lista = []) =>
  lista.filter((e) => e?.enlace).map((e) => ({ name: e.etiqueta, href: e.enlace, icon: ICONOS[e.icono] || Home }));

export default function Riel({ nav, negocio }) {
  const ruta = usePathname() || '/';
  const riel = aItems(nav?.riel);

  // En celular se ven juntos: la primera del riel (Inicio), el menú superior y
  // el resto del riel, sin repetir direcciones.
  const vistos = new Set();
  const movil = [...riel.slice(0, 1), ...aItems(nav?.menu), ...riel.slice(1)].filter((i) => !vistos.has(i.href) && vistos.add(i.href));

  return (
    <>
      {nav?.mostrarRiel !== false && riel.length > 0 && <RielEscritorio ruta={ruta} items={riel} negocio={negocio} />}
      <MenuMovil ruta={ruta} items={movil} negocio={negocio} />
    </>
  );
}
