'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Check,
  Search,
  Star,
  MapPin,
  ShoppingBag,
  Plus,
  MessageCircle,
  MousePointer2,
} from 'lucide-react';

/**
 * Maquetas animadas del hero de cada servicio.
 *
 * Cada una cuenta, sin texto, lo que el servicio hace por el negocio: el sitio
 * que se arma y queda publicado, la landing que convierte un clic en un
 * mensaje, la tienda que recibe un pedido de noche, el negocio que sube al
 * primer resultado, el pin que atiende a toda la región. Son ilustraciones:
 * no muestran cifras ni resultados que no se puedan sostener.
 *
 * Todas corren en bucle por etapas con `useCiclo`. Con movimiento reducido se
 * quedan quietas en su etapa final, que es la que resume la idea.
 */

function useCiclo(etapas, ms = 1100, pausaFinal = 2600) {
  const [etapa, setEtapa] = useState(0);
  const [reducido, setReducido] = useState(false);

  useEffect(() => {
    const r = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setReducido(r);
    if (r) setEtapa(etapas - 1);
  }, [etapas]);

  useEffect(() => {
    if (reducido) return;
    const espera = etapa === etapas - 1 ? pausaFinal : etapa === 0 ? 700 : ms;
    const t = setTimeout(() => setEtapa((e) => (e + 1) % etapas), espera);
    return () => clearTimeout(t);
  }, [etapa, etapas, ms, pausaFinal, reducido]);

  return etapa;
}

const SUAVE = { duration: 0.5, ease: [0.16, 1, 0.3, 1] };

/** Marco de navegador compartido. */
function Navegador({ url, children }) {
  return (
    <div className="rounded-[26px] bg-white border border-white shadow-[var(--shadow-lift)] overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-line bg-[#F7F7F6]">
        <span className="flex gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#DADCE0]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#DADCE0]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#DADCE0]" />
        </span>
        <span className="flex-1 mx-2 rounded-full bg-white border border-line px-3 py-1 text-[11px] text-slate truncate">
          {url}
        </span>
      </div>
      {children}
    </div>
  );
}

/** Barra de texto simulada. */
const Linea = ({ w, h = 'h-2.5', tono = 'bg-[#E4E6E9]', className = '' }) => (
  <span className={`block rounded-full ${h} ${tono} ${className}`} style={{ width: w }} />
);

/* ------------------------------------------------------------------ */
/* Diseño web: el sitio se arma por bloques y queda publicado.         */
/* ------------------------------------------------------------------ */
function MaquetaSitio() {
  const e = useCiclo(6);
  const ver = (n) => ({ opacity: e >= n ? 1 : 0, y: e >= n ? 0 : 14 });

  return (
    <Navegador url="tunegocio.com">
      <div className="p-5 sm:p-6 space-y-5 min-h-[20rem]">
        <motion.div animate={ver(1)} transition={SUAVE} className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-[#0E0F11]" />
            <Linea w="4.5rem" tono="bg-[#0E0F11]" />
          </span>
          <span className="hidden sm:flex gap-3">
            <Linea w="2.5rem" h="h-2" />
            <Linea w="2.5rem" h="h-2" />
            <Linea w="2.5rem" h="h-2" />
          </span>
        </motion.div>

        <div className="grid grid-cols-5 gap-4 items-center">
          <motion.div animate={ver(2)} transition={SUAVE} className="col-span-3 space-y-2.5">
            <Linea w="95%" h="h-4" tono="bg-[#0E0F11]" />
            <Linea w="70%" h="h-4" tono="bg-[#9EA2A8]" />
            <Linea w="85%" h="h-2" className="!mt-4" />
            <Linea w="60%" h="h-2" />
            <span className="inline-flex items-center gap-1.5 mt-3 rounded-full bg-[#0E0F11] pl-3 pr-1 py-1">
              <Linea w="3.5rem" h="h-1.5" tono="bg-white/80" />
              <span className="w-4 h-4 rounded-full bg-white" />
            </span>
          </motion.div>
          <motion.div
            animate={ver(3)}
            transition={SUAVE}
            className="col-span-2 aspect-[4/5] rounded-2xl"
            style={{ background: 'linear-gradient(160deg, #E6E7EA 0%, #C9793D55 100%)' }}
          />
        </div>

        <div className="grid grid-cols-3 gap-2.5">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={ver(4)}
              transition={{ ...SUAVE, delay: e >= 4 ? i * 0.12 : 0 }}
              className="rounded-xl bg-[#F4F4F5] p-3 space-y-2"
            >
              <span className="block w-5 h-5 rounded-md bg-white" />
              <Linea w="80%" h="h-2" tono="bg-[#CFD2D6]" />
              <Linea w="55%" h="h-1.5" />
            </motion.div>
          ))}
        </div>

        {/* Siempre montado: aparece con opacidad para no cambiar el alto de
            la maqueta (un salto aquí empuja toda la página). */}
        <motion.div
          animate={{ opacity: e >= 5 ? 1 : 0, y: e >= 5 ? 0 : 10, scale: e >= 5 ? 1 : 0.95 }}
          transition={SUAVE}
          className="inline-flex items-center gap-2 rounded-full bg-[#0E0F11] text-white px-3.5 py-2 text-[12px]"
        >
          <span className="w-4 h-4 rounded-full bg-white text-[#0E0F11] flex items-center justify-center">
            <Check className="w-3 h-3" />
          </span>
          Publicado · a tu nombre
        </motion.div>
      </div>
    </Navegador>
  );
}

/* ------------------------------------------------------------------ */
/* Landing: un clic en la oferta termina en un mensaje de WhatsApp.    */
/* ------------------------------------------------------------------ */
function MaquetaLanding() {
  const e = useCiclo(5, 1000, 2800);

  return (
    <div className="mx-auto w-[16.5rem] sm:w-[18rem] rounded-[38px] bg-[#0E0F11] p-2.5 shadow-[var(--shadow-lift)]">
      <div className="relative rounded-[30px] bg-white overflow-hidden min-h-[27rem] p-5 flex flex-col">
        <span className="mx-auto mb-5 w-16 h-1.5 rounded-full bg-[#E4E6E9]" />
        <span className="self-start rounded-full bg-[#F1F1F0] px-3 py-1 text-[10px] text-graphite mb-4">
          • Solo esta semana
        </span>
        <Linea w="90%" h="h-4" tono="bg-[#0E0F11]" />
        <Linea w="65%" h="h-4" tono="bg-[#9EA2A8]" className="mt-2" />
        <Linea w="85%" h="h-2" className="mt-4" />
        <Linea w="70%" h="h-2" className="mt-2" />

        <div
          className="mt-5 aspect-[16/10] rounded-2xl"
          style={{ background: 'linear-gradient(150deg, #E6E7EA 0%, #C9793D66 100%)' }}
        />

        <div className="relative mt-auto pt-5">
          <motion.span
            animate={{ scale: e === 2 ? 0.95 : 1 }}
            transition={{ duration: 0.2 }}
            className="flex items-center justify-between rounded-full bg-[#0E0F11] text-white pl-4 pr-1 py-1 text-[12px]"
          >
            Quiero la promoción
            <span className="w-7 h-7 rounded-full bg-white text-[#0E0F11] flex items-center justify-center">
              <MessageCircle className="w-3.5 h-3.5" />
            </span>
          </motion.span>

          {/* El cursor llega al botón y lo pulsa. */}
          <motion.span
            animate={{
              x: e >= 1 ? 150 : 40,
              y: e >= 1 ? 8 : -120,
              opacity: e >= 1 && e < 3 ? 1 : 0,
            }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="absolute left-0 top-0 text-[#0E0F11]"
          >
            <MousePointer2 className="w-5 h-5 fill-white" />
          </motion.span>
          <AnimatePresence>
            {e === 2 && (
              <motion.span
                initial={{ opacity: 0.5, scale: 0.4 }}
                animate={{ opacity: 0, scale: 1.8 }}
                transition={{ duration: 0.7 }}
                className="absolute left-[150px] top-[18px] w-10 h-10 -ml-5 -mt-5 rounded-full border-2 border-[#9A4A1F]"
              />
            )}
          </AnimatePresence>
        </div>

        {/* Llega el mensaje, con la campaña ya dicha. */}
        <AnimatePresence>
          {e >= 3 && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
              transition={SUAVE}
              className="absolute inset-x-3 bottom-3 rounded-2xl bg-white border border-line shadow-[var(--shadow-lift)] p-3.5"
            >
              <p className="flex items-center gap-1.5 text-[10px] text-slate mb-2">
                <MessageCircle className="w-3 h-3" /> WhatsApp · nuevo mensaje
              </p>
              <p className="rounded-2xl rounded-tl-sm bg-[#F1F1F0] px-3 py-2 text-[12px] text-graphite">
                Hola, vi la promoción de esta semana y quiero pedirla.
              </p>
              {e >= 4 && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-1.5 text-right text-[10px] text-slate"
                >
                  Visto ✓✓
                </motion.p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Tienda: se agregan productos y entra un pedido de noche.            */
/* ------------------------------------------------------------------ */
function MaquetaTienda() {
  const e = useCiclo(5, 1100, 2800);
  const carrito = e >= 3 ? 2 : e >= 1 ? 1 : 0;
  const pulsado = e === 1 ? 0 : e === 2 || e === 3 ? 3 : -1;

  return (
    <Navegador url="tutienda.com">
      <div className="relative p-5 sm:p-6 min-h-[20rem]">
        <div className="flex items-center justify-between mb-5">
          <Linea w="5rem" tono="bg-[#0E0F11]" />
          <span className="relative w-9 h-9 rounded-full bg-[#F1F1F0] flex items-center justify-center text-graphite">
            <ShoppingBag className="w-4 h-4" />
            <AnimatePresence>
              {carrito > 0 && (
                <motion.span
                  key={carrito}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 18 }}
                  className="absolute -top-1 -right-1 min-w-[18px] h-[18px] rounded-full bg-[#9A4A1F] text-white text-[10px] flex items-center justify-center"
                >
                  {carrito}
                </motion.span>
              )}
            </AnimatePresence>
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="rounded-2xl bg-[#F4F4F5] p-2.5">
              <div
                className="aspect-[4/3] rounded-xl mb-2.5"
                style={{
                  background:
                    i % 3 === 0
                      ? 'linear-gradient(150deg, #E6E7EA 0%, #C9793D55 100%)'
                      : 'linear-gradient(150deg, #FFFFFF 0%, #DADCE0 100%)',
                }}
              />
              <div className="flex items-end justify-between gap-2">
                <span className="flex-1 space-y-1.5">
                  <Linea w="85%" h="h-2" tono="bg-[#CFD2D6]" />
                  <Linea w="45%" h="h-2" tono="bg-[#0E0F11]" />
                </span>
                <motion.span
                  animate={{ scale: pulsado === i ? 0.85 : 1, backgroundColor: pulsado === i ? '#9A4A1F' : '#0E0F11' }}
                  transition={{ duration: 0.25 }}
                  className="w-7 h-7 rounded-full text-white flex items-center justify-center shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" />
                </motion.span>
              </div>
            </div>
          ))}
        </div>

        <AnimatePresence>
          {e >= 4 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={SUAVE}
              className="absolute left-1/2 -translate-x-1/2 bottom-5 flex items-center gap-2.5 rounded-full bg-[#0E0F11] text-white pl-1.5 pr-4 py-1.5 text-[12px] whitespace-nowrap shadow-[var(--shadow-lift)]"
            >
              <span className="w-6 h-6 rounded-full bg-white text-[#0E0F11] flex items-center justify-center">
                <Check className="w-3.5 h-3.5" />
              </span>
              Pedido recibido · 11:04 p.m.
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Navegador>
  );
}

/* ------------------------------------------------------------------ */
/* Google: la búsqueda se escribe y tu negocio sube al primer puesto.  */
/* ------------------------------------------------------------------ */
const CONSULTA = 'peluquería cerca de mí';

function MaquetaGoogle() {
  const e = useCiclo(5, 1200, 3000);
  const escrito = e === 0 ? 0 : e === 1 ? Math.ceil(CONSULTA.length / 2) : CONSULTA.length;
  const tuyoArriba = e >= 3;

  const otros = [
    { id: 'a', w: '70%' },
    { id: 'b', w: '55%' },
  ];
  const tuyo = { id: 'tuyo' };
  const orden = tuyoArriba ? [tuyo, ...otros] : [...otros, tuyo];

  return (
    <div className="rounded-[26px] bg-white border border-white shadow-[var(--shadow-lift)] p-5 sm:p-6 min-h-[20rem]">
      <div className="flex items-center gap-2.5 rounded-full bg-[#F1F1F0] px-4 py-3 mb-5">
        <Search className="w-4 h-4 text-slate shrink-0" />
        <span className="text-[13px] text-graphite truncate">
          {CONSULTA.slice(0, escrito)}
          <span className="inline-block w-px h-3.5 -mb-0.5 ml-0.5 bg-graphite animate-pulse" />
        </span>
      </div>

      <motion.ul animate={{ opacity: e >= 2 ? 1 : 0 }} transition={SUAVE} className="space-y-2.5">
        {orden.map((r) =>
          r.id === 'tuyo' ? (
            <motion.li
              layout
              key="tuyo"
              transition={{ layout: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }}
              className={`rounded-2xl p-3.5 flex items-center gap-3 transition-colors duration-500 ${
                tuyoArriba ? 'bg-[#0E0F11] text-white' : 'bg-[#F4F4F5] text-graphite'
              }`}
            >
              <span
                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                  tuyoArriba ? 'bg-white text-[#0E0F11]' : 'bg-white text-slate'
                }`}
              >
                <MapPin className="w-4 h-4" />
              </span>
              <span className="flex-1 min-w-0">
                <span className="block text-[13px] font-medium">Tu negocio</span>
                <span className="flex items-center gap-1.5 mt-1">
                  <span className="flex gap-0.5">
                    {[0, 1, 2, 3, 4].map((i) => (
                      <Star key={i} className="w-2.5 h-2.5" style={{ fill: '#C9793D', color: '#C9793D' }} />
                    ))}
                  </span>
                  <span className={`text-[10px] ${tuyoArriba ? 'text-white/70' : 'text-slate'}`}>Abierto ahora</span>
                </span>
              </span>
              {tuyoArriba && (
                <motion.span
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="rounded-full bg-white/15 px-2.5 py-1 text-[10px]"
                >
                  1.º
                </motion.span>
              )}
            </motion.li>
          ) : (
            <motion.li
              layout
              key={r.id}
              transition={{ layout: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }}
              className="rounded-2xl bg-[#F4F4F5] p-3.5 flex items-center gap-3"
            >
              <span className="w-9 h-9 rounded-xl bg-white shrink-0" />
              <span className="flex-1 space-y-2">
                <Linea w={r.w} h="h-2" tono="bg-[#CFD2D6]" />
                <Linea w="40%" h="h-1.5" />
              </span>
            </motion.li>
          ),
        )}
      </motion.ul>

      <motion.p
        animate={{ opacity: e >= 4 ? 1 : 0, y: e >= 4 ? 0 : 8 }}
        transition={SUAVE}
        className="mt-4 text-[12px] text-slate text-center"
      >
        Quien te busca, te encuentra primero.
      </motion.p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Ciudad: el pin en la ciudad y los municipios cercanos alrededor.   */
/* ------------------------------------------------------------------ */
const POSICIONES = [
  { left: '8%', top: '14%' },
  { left: '62%', top: '9%' },
  { left: '70%', top: '64%' },
  { left: '6%', top: '70%' },
  { left: '38%', top: '84%' },
  { left: '74%', top: '37%' },
  { left: '3%', top: '42%' },
];

function MaquetaMapa({ municipios: lista = [], ciudad = '' }) {
  const e = useCiclo(3, 1400, 3400);
  const municipios = lista.filter((m) => m !== ciudad).slice(0, POSICIONES.length);

  return (
    <div className="relative rounded-[26px] bg-white border border-white shadow-[var(--shadow-lift)] overflow-hidden aspect-[4/3.4] sm:aspect-[4/3]">
      {/* Calles y río: dibujo de fondo, sin datos geográficos reales. */}
      <svg viewBox="0 0 400 320" className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <rect width="400" height="320" fill="#F7F7F6" />
        {[40, 95, 150, 205, 260].map((y) => (
          <path key={`h${y}`} d={`M0 ${y} Q 200 ${y + 14} 400 ${y - 6}`} stroke="#E4E6E9" strokeWidth="6" fill="none" />
        ))}
        {[60, 140, 220, 300, 360].map((x) => (
          <path key={`v${x}`} d={`M${x} 0 Q ${x - 12} 160 ${x + 8} 320`} stroke="#E4E6E9" strokeWidth="6" fill="none" />
        ))}
        <path d="M-10 230 C 90 190, 160 260, 250 215 S 380 150, 420 175" stroke="#D5DEE6" strokeWidth="14" fill="none" strokeLinecap="round" />
      </svg>

      {/* Anillos que respiran desde la ciudad. */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="absolute left-1/2 top-1/2 rounded-full border border-[#9A4A1F]"
            style={{ width: 60, height: 60, marginLeft: -30, marginTop: -30 }}
            animate={{ scale: [0.4, 3.2], opacity: [0.5, 0] }}
            transition={{ duration: 3, repeat: Infinity, delay: i, ease: 'easeOut' }}
          />
        ))}
        <span className="relative flex flex-col items-center -mt-6">
          <span className="rounded-full bg-[#0E0F11] text-white px-3 py-1.5 text-[12px] font-medium mb-1.5 whitespace-nowrap shadow-[var(--shadow-lift)]">
            {ciudad}
          </span>
          <MapPin className="w-7 h-7 text-[#9A4A1F]" style={{ fill: '#9A4A1F33' }} />
        </span>
      </div>

      {municipios.map((m, i) => (
        <motion.span
          key={m}
          animate={{ opacity: e >= 1 ? 1 : 0, y: e >= 1 ? 0 : 8 }}
          transition={{ ...SUAVE, delay: e >= 1 ? i * 0.12 : 0 }}
          className="absolute inline-flex items-center gap-1.5 rounded-full bg-white/90 border border-line px-2.5 py-1 text-[11px] text-graphite shadow-[var(--shadow-soft)]"
          style={POSICIONES[i]}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#0E0F11]" />
          {m}
        </motion.span>
      ))}
    </div>
  );
}

const MAQUETAS = {
  sitio: MaquetaSitio,
  landing: MaquetaLanding,
  tienda: MaquetaTienda,
  google: MaquetaGoogle,
  mapa: MaquetaMapa,
};

/** `municipios` y `ciudad` solo los usa la maqueta del mapa. */
export default function Maqueta({ tipo, municipios, ciudad }) {
  const Componente = MAQUETAS[tipo] ?? MaquetaSitio;
  return <Componente municipios={municipios} ciudad={ciudad} />;
}
