'use client';

import {
  Home,
  Layout,
  Target,
  ShoppingBag,
  Search,
  MapPin,
  Newspaper,
  MessageSquare,
  Package,
  Star,
  Phone,
  User,
  Download,
} from 'lucide-react';
import { BrandIsotype } from '../componentes/Marca.jsx';

/** Iconos que se eligen en el panel (Menú y pie de página). */
export const ICONOS = {
  home: Home,
  package: Package,
  newspaper: Newspaper,
  message: MessageSquare,
  layout: Layout,
  target: Target,
  bag: ShoppingBag,
  search: Search,
  pin: MapPin,
  star: Star,
  phone: Phone,
  user: User,
  download: Download,
};

/** Evento con el que la cabecera abre el menú de celular. */
export const EVENTO_MENU = 'sitio:abrir-menu';
export const abrirMenu = () => window.dispatchEvent(new Event(EVENTO_MENU));

/** Enlace activo: coincide la ruta exacta, o la sección si empieza igual. */
export const esActivo = (ruta, enlace) =>
  Boolean(enlace) && !enlace.startsWith('#') && !enlace.startsWith('http') &&
  (enlace === '/' ? ruta === '/' : ruta === enlace || ruta.startsWith(`${enlace}/`));

export const esExterno = (enlace = '') => /^https?:\/\//.test(enlace);

/**
 * Logo del negocio (subido en "Datos del negocio"); si no hay, símbolo + nombre.
 * Sirve para cualquier cliente. `claro` usa la versión blanca, para fondos oscuros.
 */
export function MarcaNegocio({ negocio, tam = 26, claseTexto = 'text-[16px]', claro = false }) {
  const logo = (claro && negocio?.logoBlanco?.url) || negocio?.logo?.url;
  if (logo) {
    return <img src={logo} alt={negocio.nombre || ''} style={{ height: tam }} className="w-auto max-w-[220px] object-contain" />;
  }
  return (
    <span className="inline-flex items-center gap-2 select-none">
      <BrandIsotype size={tam} nombre={negocio?.nombre} />
      <span className={`${claseTexto} font-semibold tracking-[-0.03em] text-graphite`}>{negocio?.nombre}</span>
    </span>
  );
}
