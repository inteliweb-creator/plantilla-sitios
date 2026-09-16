'use client'

import { useEffect, type RefObject } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

/**
 * Parallax por capas + scroll suave.
 *
 * Adaptado del componente "Parallax Scrolling" de Osmo. El original trae su
 * propia sección —montañas, un título "Parallax", un icono y créditos— y aquí
 * no se usa nada de eso: el sitio ya tiene su diseño. Lo que se conserva es el
 * mecanismo, dividido en dos piezas reutilizables:
 *
 *   · `useParallaxLayers`: dentro de un contenedor, cada elemento marcado con
 *     `data-parallax-layer="n"` se desplaza en vertical a una velocidad
 *     distinta mientras el contenedor sale de pantalla. Las capas del fondo se
 *     mueven más; las del frente, menos. Eso fabrica la profundidad.
 *   · `SmoothScroll`: Lenis, que suaviza la rueda del ratón y mantiene a
 *     ScrollTrigger sincronizado con él.
 *
 * Tres diferencias deliberadas con el original:
 *
 * 1. La limpieza no mata TODOS los ScrollTrigger de la página
 *    (`ScrollTrigger.getAll().forEach(kill)`), solo los de este contenedor, con
 *    `gsap.context`. El original rompería cualquier otro efecto de scroll que
 *    se añada después.
 * 2. Con `prefers-reduced-motion` no hay parallax ni scroll suave. Ambos son
 *    exactamente el tipo de movimiento que esa preferencia pide evitar.
 * 3. Lenis se detiene mientras un modal o el menú de móvil bloquean el scroll
 *    del body. Sin eso, la rueda seguiría desplazando la página por detrás.
 */

gsap.registerPlugin(ScrollTrigger);

const prefiereMenosMovimiento = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export type CapaParallax = {
  /** Valor del atributo `data-parallax-layer` que identifica la capa. */
  capa: string;
  /** Cuánto baja la capa, en % de su propia altura, a lo largo del recorrido. */
  yPercent: number;
};

/**
 * Capas por defecto, las del original: fondo muy rápido, frente casi quieto.
 */
export const CAPAS_POR_DEFECTO: CapaParallax[] = [
  { capa: '1', yPercent: 70 },
  { capa: '2', yPercent: 55 },
  { capa: '3', yPercent: 40 },
  { capa: '4', yPercent: 10 },
];

export function useParallaxLayers(
  contenedor: RefObject<HTMLElement | null>,
  capas: CapaParallax[] = CAPAS_POR_DEFECTO,
) {
  useEffect(() => {
    const raiz = contenedor.current;
    if (!raiz || prefiereMenosMovimiento()) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: raiz,
          // Del borde superior del contenedor en el borde superior de la
          // ventana, hasta que su borde inferior llega arriba: el efecto dura
          // exactamente lo que tarda la sección en irse.
          start: 'top top',
          end: 'bottom top',
          scrub: 0,
        },
      });

      capas.forEach(({ capa, yPercent }, i) => {
        const objetivos = raiz.querySelectorAll(`[data-parallax-layer="${capa}"]`);
        if (!objetivos.length) return;
        tl.to(objetivos, { yPercent, ease: 'none' }, i === 0 ? 0 : '<');
      });
    }, raiz);

    return () => ctx.revert();
    // Se rehace si cambia el juego de capas (p. ej. al elegir el de móvil tras
    // montar). Quien llama debe pasar un array estable, no uno nuevo por render.
  }, [contenedor, capas]);
}

/**
 * Scroll suave de todo el sitio. Se monta una sola vez, en el layout.
 * No pinta nada.
 */
export function SmoothScroll() {
  useEffect(() => {
    if (prefiereMenosMovimiento()) return;

    // `scroll-behavior: smooth` en el html pelea con Lenis: los dos intentan
    // suavizar el mismo desplazamiento. Mientras Lenis viva, se apaga.
    const html = document.documentElement;
    const comportamientoPrevio = html.style.scrollBehavior;
    html.style.scrollBehavior = 'auto';

    const lenis = new Lenis({
      // Los enlaces #cotizador, #portafolio… se desplazan con Lenis en vez de
      // saltar, así el ancla también es suave.
      anchors: true,
    });

    lenis.on('scroll', ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    // Modales y menú móvil bloquean el scroll poniendo `overflow: hidden` en
    // el body. Lenis desplaza el documento por su cuenta y lo ignoraría.
    const sincronizarBloqueo = () => {
      if (document.body.style.overflow === 'hidden') lenis.stop();
      else lenis.start();
    };
    const observador = new MutationObserver(sincronizarBloqueo);
    observador.observe(document.body, { attributes: true, attributeFilter: ['style'] });

    return () => {
      observador.disconnect();
      gsap.ticker.remove(tick);
      lenis.destroy();
      html.style.scrollBehavior = comportamientoPrevio;
    };
  }, []);

  return null;
}
