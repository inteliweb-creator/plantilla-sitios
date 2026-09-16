'use client'

import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowUpRight, Building2, Compass, Globe, Shield, Zap, Coffee } from 'lucide-react';
const dominioDe = (url) => {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return '';
  }
};

const ICONOS = { building2: Building2, compass: Compass, globe: Globe, shield: Shield, zap: Zap, coffee: Coffee };

/**
 * Marquee de doble pista: la fila superior avanza a la derecha y la inferior a
 * la izquierda según el progreso de scroll de la sección. Se conserva la
 * mecánica original (transform en GPU, sin re-render de React).
 */
export default function Casos({ datos: D = {}, casos: CLIENTES = [] }) {
  const sectionRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    handleResize();
    window.addEventListener('resize', handleResize, { passive: true });
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const LOOP_WIDTH = 1212;
  const distance = isMobile ? LOOP_WIDTH * 1.2 : LOOP_WIDTH * 0.8;

  const topTranslateX = useTransform(scrollYProgress, [0, 1], [-LOOP_WIDTH, -LOOP_WIDTH + distance]);
  const bottomTranslateX = useTransform(scrollYProgress, [0, 1], [0, -distance]);

  // Se reparten en dos pistas desde la fuente compartida: el orden y los
  // textos se editan en un solo sitio, no aquí.
  const mitad = Math.ceil(CLIENTES.length / 2);
  const topRowProjects = CLIENTES.slice(0, mitad);
  const bottomRowProjects = CLIENTES.slice(mitad);

  const renderCard = (project, keyPrefix, idx) => {
    const Icon = ICONOS[project.icono] ?? Compass;
    return (
      <a
        key={`${keyPrefix}-${idx}`}
        href={project.url}
        target="_blank"
        rel="noopener noreferrer"
        className="card grain w-[290px] sm:w-[380px] shrink-0 p-6 flex flex-col justify-between overflow-hidden transition-transform duration-300 hover:-translate-y-1.5"
      >
        <div className={`mesh ${project.malla || 'mesh-sky'} opacity-90`} />

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-5">
            <div className="glass-orb w-10 h-10 flex items-center justify-center">
              <Icon className="w-4 h-4 text-graphite" />
            </div>
            <span className="glass-pill px-3 py-1 text-[10px] font-semibold text-graphite">
              {project.rubro}
            </span>
          </div>

          <span className="text-[11px] text-ink-muted block mb-1.5">{dominioDe(project.url)}</span>

          <h3 className="text-2xl text-graphite mb-2.5">{project.nombre}</h3>

          <p className="text-[13px] text-slate leading-relaxed mb-6">{project.descripcion}</p>
        </div>

        <div className="relative z-10 pt-4 border-t border-line flex items-center justify-between">
          <span className="text-[11px] font-semibold text-graphite">{D.textoVer}</span>
          <div className="glass-orb w-8 h-8 flex items-center justify-center">
            <ArrowUpRight className="w-4 h-4 text-graphite" />
          </div>
        </div>
      </a>
    );
  };

  // Repetido para que el bucle no muestre bordes vacíos en ningún punto del scroll.
  const multiply = (arr) => Array.from({ length: 5 }, () => arr).flat();

  return (
    <section
      ref={sectionRef}
      id="portafolio"
      className="w-full overflow-hidden select-none py-20 sm:py-28 relative"
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="text-center max-w-3xl mx-auto mb-14 sm:mb-20 px-5 relative z-10"
      >
        <p className="eyebrow text-accent mb-5">{D.eyebrow}</p>
        <h2 className="h-section text-graphite mb-5">
          {D.titulo} <em className="text-accent">{D.enfasis}</em>
        </h2>
        <p className="text-base text-slate leading-relaxed">{D.lead}</p>
      </motion.div>

      {/* Las pistas SÍ cruzan de canto a canto y pasan por debajo del riel.
          Es lo que hace que el riel se lea dentro de la página: si el
          carrusel se detuviera antes de llegar a él, el riel parecería vivir
          en un margen aparte. */}
      <div className="flex flex-col gap-5 sm:gap-6 relative z-10">
        <motion.div className="flex w-max gap-5 sm:gap-6" style={{ x: topTranslateX, willChange: 'transform' }}>
          {multiply(topRowProjects).map((item, idx) => renderCard(item, 'top', idx))}
        </motion.div>

        <motion.div className="flex w-max gap-5 sm:gap-6" style={{ x: bottomTranslateX, willChange: 'transform' }}>
          {multiply(bottomRowProjects).map((item, idx) => renderCard(item, 'bottom', idx))}
        </motion.div>
      </div>
    </section>
  );
}
