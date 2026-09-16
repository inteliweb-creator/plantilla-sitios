'use client'

import { useEffect, useRef, useState } from 'react';

/**
 * Progreso de una escena atada al scroll, suavizado.
 *
 * Es la parte reutilizable del patrón "escena cinematográfica": un contenedor
 * alto que hace de pista de scroll, un hijo pegado con `position: sticky` que
 * ocupa la pantalla, y un valor de 0 a 1 que dice por dónde va el recorrido.
 * Todo lo que se dibuje dentro se decide a partir de ese número.
 *
 * Dos detalles que importan más de lo que parecen:
 *
 * 1. El valor se interpola en cada fotograma en vez de leerse en crudo del
 *    scroll. Sin esa interpolación, cada muesca de la rueda del ratón produce
 *    un salto y la escena se ve a tirones. La constante TAU controla cuánto
 *    "persigue" el valor a su destino, y la fórmula usa el tiempo transcurrido
 *    real para que el suavizado sea el mismo a 60 Hz que a 120.
 *
 * 2. Con `prefers-reduced-motion` no se interpola: el valor salta a su destino.
 *    Suavizar es precisamente el tipo de movimiento que esa preferencia pide
 *    evitar, y sin suavizado la escena sigue siendo perfectamente usable.
 *
 * El bucle se detiene cuando la pista no está en pantalla. Seguir calculando
 * mientras alguien lee el pie de página es gastar batería a cambio de nada.
 */

const TAU = 8;      // velocidad de persecución del valor suavizado
const SNAP = 0.0004; // por debajo de esto se considera que ya llegó

const limitar = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);

export function useEscenaScroll(refPista) {
  const [progreso, setProgreso] = useState(0);
  const actual = useRef(0);

  useEffect(() => {
    const pista = refPista.current;
    if (!pista) return;

    const reducido = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let raf = 0;
    let vivo = false;
    let ultimo = performance.now();

    /**
     * Cuánto se ha recorrido de la pista.
     *
     * `-rect.top` es lo que ya pasó por encima del borde superior de la
     * ventana, y el recorrido útil es el alto de la pista menos una pantalla:
     * el elemento pegado deja de moverse cuando el final de la pista llega
     * abajo. Se mide contra el rect en vez de contra `scrollY` para que la
     * pista pueda estar en cualquier punto de la página.
     */
    const medir = () => {
      const rect = pista.getBoundingClientRect();
      const recorrido = pista.offsetHeight - window.innerHeight;
      if (recorrido <= 0) return 0;
      return limitar(-rect.top / recorrido);
    };

    const paso = (ahora) => {
      if (!vivo) return;
      const dt = Math.min(0.1, (ahora - ultimo) / 1000);
      ultimo = ahora;

      const destino = medir();

      if (reducido) {
        actual.current = destino;
      } else {
        actual.current += (destino - actual.current) * (1 - Math.exp(-dt * TAU));
        if (Math.abs(destino - actual.current) < SNAP) actual.current = destino;
      }

      setProgreso(actual.current);
      raf = requestAnimationFrame(paso);
    };

    const arrancar = () => {
      if (vivo) return;
      vivo = true;
      ultimo = performance.now();
      raf = requestAnimationFrame(paso);
    };

    const parar = () => {
      vivo = false;
      cancelAnimationFrame(raf);
    };

    const observador = new IntersectionObserver(([entrada]) => {
      if (entrada.isIntersecting) arrancar();
      else {
        parar();
        // Se deja el valor en el extremo por el que salió, para que al volver
        // a entrar la escena no arranque a mitad de camino.
        const destino = medir();
        actual.current = destino;
        setProgreso(destino);
      }
    });
    observador.observe(pista);

    return () => {
      parar();
      observador.disconnect();
    };
  }, [refPista]);

  return progreso;
}

/**
 * Rampas de opacidad secuenciales.
 *
 * Cada tramo entra, se mantiene y sale antes de que aparezca el siguiente, de
 * modo que nunca hay dos textos encima del mismo fondo.
 *
 * Los cortes están encajados para que el siguiente tramo empiece a entrar
 * exactamente donde el anterior termina de salir. Los valores de la referencia
 * dejaban entre medias un hueco de cuatro centésimas del recorrido con las
 * tres opacidades a cero: allí eso no se nota porque debajo corre un vídeo a
 * pantalla completa, pero aquí el fondo es liso y ese hueco se vería como un
 * panel vacío durante casi una quinta parte del recorrido.
 *
 * Si se toca un corte hay que revisar sus vecinos: el encaje es lo que evita
 * tanto el solape como el vacío.
 */
export function opacidadTramo(p, indice) {
  if (indice === 0) return p < 0.2 ? 1 : Math.max(0, 1 - (p - 0.2) / 0.09);
  if (indice === 1) {
    if (p < 0.29) return 0;
    if (p < 0.38) return (p - 0.29) / 0.09;
    if (p < 0.57) return 1;
    return Math.max(0, 1 - (p - 0.57) / 0.09);
  }
  if (p < 0.66) return 0;
  if (p < 0.75) return (p - 0.66) / 0.09;
  return 1;
}
