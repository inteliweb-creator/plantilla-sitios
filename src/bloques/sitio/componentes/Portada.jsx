'use client'

import { useEffect, useRef, useState } from 'react';
import {
  ArrowRight,
  ArrowUpRight,
  Star,
  ChevronDown,
  MapPin,
  Layers,
  CalendarClock,
  Menu,
} from 'lucide-react';

import { useParallaxLayers } from '../lib/parallax-scrolling';
import { enlaceWhatsapp } from '../lib/negocio';
import { MarcaNegocio, abrirMenu } from '../marco/comun.jsx';

/**
 * Capas del paisaje, de la más lejana a la más cercana.
 *
 * El nombre de la marca va DETRÁS de las cordilleras. Cuanto más lejos está
 * una capa, más yPercent lleva: así contrarresta más el scroll y en pantalla
 * parece quedarse quieta, mientras lo cercano sube por encima. Resultado: al
 * bajar, las montañas se levantan y van tapando la palabra hasta ocultarla.
 *
 * Las diferencias son grandes a propósito, y el título lleva el valor más alto
 * aunque no sea la capa más lejana. `yPercent` se mide sobre la altura de cada
 * capa, y la palabra y las cordilleras son bandas bajas: con porcentajes
 * "realistas" se desplazaban casi lo mismo en píxeles y se movían juntas.
 * Con estos, la palabra baja unos 400px a lo largo del recorrido mientras la
 * cordillera media apenas 70, y termina tragada por las montañas.
 */
const CAPAS_HERO = [
  { capa: 'halo', yPercent: 120 },
  { capa: 'titulo', yPercent: 165 },
  { capa: 'lejana', yPercent: 85 },
  { capa: 'media', yPercent: 35 },
  { capa: 'frente', yPercent: 5 },
  { capa: 'texto', yPercent: 25 },
];

/**
 * Capas de móvil.
 *
 * En pantalla estrecha la proporción se invierte: la palabra mide unos 90px de
 * alto y la cordillera lejana más de 300. Con los valores de escritorio la
 * montaña bajaba MÁS píxeles que la palabra, se alejaba de ella en vez de
 * taparla, y el efecto no se veía. Aquí la palabra lleva un yPercent muy alto
 * (≈350px de recorrido) y las cordilleras casi nada, así que al bajar las
 * montañas trepan sobre la palabra en los primeros 300px de scroll.
 */
const CAPAS_HERO_MOVIL = [
  { capa: 'halo', yPercent: 60 },
  { capa: 'titulo', yPercent: 450 },
  { capa: 'lejana', yPercent: 18 },
  { capa: 'media', yPercent: 10 },
  { capa: 'frente', yPercent: 3 },
  { capa: 'texto', yPercent: 20 },
];

export default function Portada({ datos: hero = {}, negocio = {} }) {
  const seccion = useRef(null);
  const [capas, setCapas] = useState(CAPAS_HERO);
  useEffect(() => {
    if (window.matchMedia('(max-width: 767px)').matches) setCapas(CAPAS_HERO_MOVIL);
  }, []);
  useParallaxLayers(seccion, capas);

  return (
    <section
      ref={seccion}
      id="hero"
      className="relative overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #E6E7EA 0%, #DADCE0 50%, #CDD0D5 100%)' }}
    >
      <Paisaje palabra={hero.palabraFondo || negocio.nombre || ''} />

      <BarraSuperior hero={hero} negocio={negocio} />

      <div className="relative z-10 max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12 pl-rail pt-12 sm:pt-16 min-h-[calc(110svh-4.5rem)] flex flex-col">
        {/* ---------- Mensaje, centrado ---------- */}
        <div data-parallax-layer="texto" className="relative z-30 mx-auto max-w-4xl text-center">
          <div className="entrada">
            <p className="inline-flex items-center gap-2 text-[12px] text-graphite mb-6">
              <span className="w-px h-3 bg-graphite" />
              {hero.eyebrow}
              <span className="w-px h-3 bg-graphite" />
            </p>

            <h1 className="text-graphite text-[2.8rem] sm:text-[4.2rem] xl:text-[5.4rem] leading-[0.95] mb-7">
              {hero.h1 || 'Hacemos visible'} <em>{hero.h1Enfasis || 'lo que tu negocio ofrece'}</em>
            </h1>

            <div className="flex items-center justify-center gap-2.5 mb-8">
              <span className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5" style={{ fill: '#9A4A1F', color: '#9A4A1F' }} />
                ))}
              </span>
              <span className="text-[12px] text-graphite">
                {hero.textoClientes}
              </span>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2.5">
              <a href={enlaceWhatsapp(negocio, hero.mensajeWhatsapp)} target="_blank" rel="noreferrer" className="pill-negra text-[13px]">
                <span>{hero.ctaPrimarioTexto || 'Escríbenos'}</span>
                <span className="disco" aria-hidden="true"><ArrowUpRight className="w-4 h-4" /></span>
              </a>
              <a href={hero.enlaceSecundario || '#cotizador'} className="pill-gris text-[13px]">
                {hero.ctaSecundarioTexto || 'Calcular mi proyecto'}
              </a>
            </div>
          </div>
        </div>

        {/* Hueco para que el paisaje respire bajo el mensaje. */}
        <div className="flex-1 min-h-[40vh] lg:min-h-[14rem]" />

        {/* ---------- Franja de vidrio inferior ---------- */}
        <div className="relative z-30 mb-4 sm:mb-6">
          <div className="vidrio-zen rounded-full flex items-center justify-center sm:justify-between gap-4 px-2 py-2 text-[12px] text-graphite whitespace-nowrap">
            <span className="hidden sm:inline rounded-full bg-white/70 px-4 py-2">• {negocio.horario}</span>
            <span className="hidden md:inline rounded-full bg-white/70 px-4 py-2">• Desde {negocio.ciudad}{negocio.departamento ? `, ${negocio.departamento}` : ''}</span>
            <a href="#problema" className="inline-flex items-center gap-2 rounded-full bg-white/70 px-5 py-2.5 hover:bg-white transition-colors max-sm:w-full max-sm:justify-center">
              {hero.textoBajar || 'Baja para ver más'}
              <ChevronDown className="w-4 h-4 animate-bounce" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * Paisaje por capas del hero.
 *
 * Orden de atrás hacia delante: halo de bronce, el nombre de la marca, la
 * cordillera lejana, la media y la colina blanca. La palabra queda así
 * detrás de las montañas, que asoman por encima de su parte baja y la van
 * cubriendo con el scroll.
 *
 * Además del parallax, cada plano deriva despacio en horizontal y el halo
 * respira, para que el fondo esté vivo aunque nadie haga scroll. Esas
 * animaciones van en un elemento INTERIOR: la capa exterior la mueve GSAP y
 * si compartieran nodo pelearían por la misma propiedad `transform`.
 */
function Paisaje({ palabra }) {
  return (
    <div aria-hidden="true" className="absolute inset-0 z-0 pointer-events-none">
      {/* Halo de bronce, lo más lejano */}
      <div data-parallax-layer="halo" className="absolute left-1/2 -translate-x-1/2 bottom-[18%]">
        <div className="halo-bronce w-[26rem] h-[26rem] sm:w-[38rem] sm:h-[38rem]" />
      </div>

      {/* El nombre de la marca, detrás de las montañas */}
      {/* Desde md, anclada ARRIBA: al crecer la sección la palabra se queda
          donde está y solo bajan las montañas, que van ancladas abajo.
          En móvil, anclada ABAJO, a la altura de las cumbres: con `svh` en
          teléfonos de pantalla corta caía encima de "Calcular mi proyecto". */}
      <div data-parallax-layer="titulo" className="absolute inset-x-0 bottom-[31%] md:bottom-auto md:top-[66svh] lg:top-[60svh] flex justify-center">
        <p className="marca-agua marca-agua-solida text-[20vw] lg:text-[19vw] uppercase">{palabra}</p>
      </div>

      {/* Cordillera lejana */}
      <div data-parallax-layer="lejana" className="absolute inset-x-0 bottom-0 h-[40%] md:h-[34%]">
        <svg viewBox="0 0 1440 400" preserveAspectRatio="none" className="deriva-lenta absolute left-[-4%] bottom-0 w-[108%] h-full">
          <path d="M0 170 L120 110 L230 150 L360 50 L480 130 L610 40 L740 120 L860 70 L990 140 L1110 45 L1240 125 L1350 80 L1440 110 L1440 400 L0 400 Z" fill="#B9BDC3" />
          <path d="M0 170 L120 110 L230 150 L360 50 L480 130 L610 40 L740 120 L860 70 L990 140 L1110 45 L1240 125 L1350 80 L1440 110" fill="none" stroke="#FFFFFF" strokeOpacity="0.45" strokeWidth="1.5" />
        </svg>
      </div>

      {/* Cordillera media */}
      <div data-parallax-layer="media" className="absolute inset-x-0 bottom-0 h-[29%] md:h-[24%]">
        <svg viewBox="0 0 1440 400" preserveAspectRatio="none" className="deriva-media absolute left-[-4%] bottom-0 w-[108%] h-full">
          <path d="M0 200 L150 120 L300 180 L420 80 L560 170 L700 100 L820 175 L980 70 L1120 165 L1260 105 L1440 170 L1440 400 L0 400 Z" fill="#8F949B" />
          <path d="M0 200 L150 120 L300 180 L420 80 L560 170 L700 100 L820 175 L980 70 L1120 165 L1260 105 L1440 170" fill="none" stroke="#FFFFFF" strokeOpacity="0.3" strokeWidth="1.5" />
        </svg>
      </div>

      {/* Colina delantera, blanca */}
      <div data-parallax-layer="frente" className="absolute inset-x-0 bottom-0 h-[15%] md:h-[13%]">
        <svg viewBox="0 0 1440 300" preserveAspectRatio="none" className="deriva-rapida absolute left-[-4%] bottom-0 w-[108%] h-full">
          <path d="M0 140 C 240 40, 420 50, 640 110 C 860 170, 1080 40, 1440 100 L1440 300 L0 300 Z" fill="#FFFFFF" />
        </svg>
      </div>

      {/* Fundido final hacia el blanco de la sección siguiente */}
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent via-white/70 to-white" />
    </div>
  );
}

/**
 * Encabezado colgante, en la piel nueva.
 *
 * Recupera la estructura que ya tenía el sitio: píldora de marca a la
 * izquierda, un bloque central que cuelga del borde superior —sube a ras del
 * canto con un margen negativo y solo redondea sus esquinas de abajo— y la
 * píldora de acción a la derecha. Lo que cambia es el material: blanco
 * translúcido sobre el gris perla, tinta negra y la grotesca apretada del
 * diseño nuevo, en lugar del vidrio sobre el cielo de antes.
 *
 * Los tres campos resumen el encargo del cotizador y llevan a él.
 */
const ICONOS_BARRA = [MapPin, Layers, CalendarClock];

function BarraSuperior({ hero, negocio }) {
  // Textos editables desde el panel; los iconos van por posición.
  const CAMPOS = (hero.barra?.length ? hero.barra : [
    { etiqueta: 'Ciudad', valor: negocio.ciudad },
    { etiqueta: 'Qué necesitas', valor: 'Sitio web' },
    { etiqueta: 'Entrega', valor: '5 a 7 días' },
  ]).map((c, i) => ({ ...c, icono: ICONOS_BARRA[i % ICONOS_BARRA.length] }));

  return (
    <div data-barra-propia className="relative z-40 max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12 pl-rail pt-4">
      <div className="flex items-center lg:items-start gap-2 sm:gap-3">
        <a
          href="/"
          aria-label={`${negocio.nombre || ""}, inicio`}
          className={`shrink-0 flex items-center gap-2 rounded-full bg-white/75 backdrop-blur-xl border border-white ${negocio.logo?.url ? 'px-4 sm:px-5' : 'pl-2 pr-4 sm:pr-5'} py-2.5 shadow-[var(--shadow-soft)] hover:bg-white transition-colors`}
        >
          <MarcaNegocio negocio={negocio} tam={negocio.logo?.url ? 22 : 26} />
        </a>

        {/* El bloque colgante: `-mt-4` cancela el respiro superior para que
            su canto quede a ras del borde de la ventana. */}
        <a
          href={hero.enlaceSecundario || '#cotizador'}
          className="hidden lg:flex flex-1 max-w-2xl mx-auto justify-center items-stretch -mt-4 rounded-b-[26px] bg-white/75 backdrop-blur-xl border border-t-0 border-white px-3 pt-5 pb-3 shadow-[var(--shadow-soft)] hover:bg-white transition-colors group"
        >
          {CAMPOS.map(({ icono: Icono, etiqueta, valor }, i) => (
            <span
              key={etiqueta}
              className={`flex items-center gap-2.5 px-6 ${i > 0 ? 'border-l border-graphite/10' : ''}`}
            >
              <Icono className="w-4 h-4 text-graphite/50 shrink-0" />
              <span className="text-left">
                <span className="block text-[10px] text-graphite/55">{etiqueta}</span>
                <span className="block text-[14px] font-medium tracking-[-0.02em] text-graphite -mt-0.5">
                  {valor}
                </span>
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-graphite/40 group-hover:text-graphite transition-colors shrink-0" />
            </span>
          ))}
        </a>

        <span className="flex-1 lg:hidden" />

        <a href={enlaceWhatsapp(negocio, hero.mensajeWhatsapp)} target="_blank" rel="noreferrer" className="pill-negra text-[13px] shrink-0">
          <span>{hero.botonCabecera || 'Hablemos'}</span>
          <span className="disco" aria-hidden="true"><ArrowUpRight className="w-4 h-4" /></span>
        </a>

        <button
          onClick={abrirMenu}
          data-menu-cabecera
          aria-label="Abrir menú de navegación"
          className="lg:hidden shrink-0 w-11 h-11 rounded-full bg-white/75 backdrop-blur-xl border border-white flex items-center justify-center text-graphite shadow-[var(--shadow-soft)] active:scale-95 transition-transform"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
