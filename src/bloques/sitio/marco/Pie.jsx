'use client';

import { MapPin, Clock, Mail, ArrowUpRight } from 'lucide-react';
import { enlaceWhatsapp } from '../lib/negocio.js';
import { MarcaNegocio, esExterno } from './comun.jsx';

/**
 * Pie de página. Todo sale del panel:
 * frase, enlaces y legales desde "Menú y pie de página"; ubicación, horario,
 * correo, WhatsApp y redes desde "Datos del negocio".
 */
const REDES = [
  { key: 'instagram', label: 'IG' },
  { key: 'facebook', label: 'FB' },
  { key: 'tiktok', label: 'TK' },
];

const externo = (href) => (esExterno(href) ? { target: '_blank', rel: 'noreferrer' } : {});

export default function Pie({ nav, negocio }) {
  const ubicacion = [negocio?.ciudad, negocio?.departamento].filter(Boolean).join(', ');
  const redes = REDES.filter((r) => String(negocio?.[r.key] || '').trim());
  const enlaces = nav?.enlacesPie || [];
  const legales = nav?.legales || [];

  return (
    <footer className="marco marco-pie border-t border-line px-5 sm:px-6 lg:px-8 pl-rail pt-16 pb-32 lg:pb-16 text-sm">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 pb-12 border-b border-line">
          <div className="lg:col-span-7 space-y-5">
            <a href="/" className="inline-flex items-center gap-2.5" aria-label={`${negocio?.nombre || ''}, inicio`}>
              <MarcaNegocio negocio={negocio} tam={negocio?.logo?.url ? 34 : 36} claseTexto="text-[20px] sm:text-[23px]" />
            </a>

            {(nav?.descripcionPie || negocio?.eslogan) && (
              <p className="text-slate leading-relaxed max-w-md">{nav?.descripcionPie || negocio?.eslogan}</p>
            )}

            <ul className="flex flex-wrap items-center gap-x-6 gap-y-3 text-xs text-slate pt-1">
              {(negocio?.direccion || ubicacion) && (
                <li className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-accent" />
                  {[negocio?.direccion, ubicacion].filter(Boolean).join(' · ')}
                </li>
              )}
              {negocio?.horario && (
                <li className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-accent" />
                  {negocio.horario}
                </li>
              )}
              {negocio?.correo && (
                <li className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-accent" />
                  <a href={`mailto:${negocio.correo}`} className="hover:text-graphite transition-colors">{negocio.correo}</a>
                </li>
              )}
            </ul>
          </div>

          {enlaces.length > 0 && (
            <nav className="lg:col-span-2" aria-label="Pie de página">
              {nav?.tituloEnlacesPie && <h2 className="eyebrow text-slate/70 mb-4">{nav.tituloEnlacesPie}</h2>}
              <ul className="space-y-2.5">
                {enlaces.map((e, i) => (
                  <li key={`${e.enlace}-${i}`}>
                    <a href={e.enlace} {...externo(e.enlace)} className="text-slate hover:text-graphite transition-colors">{e.etiqueta}</a>
                  </li>
                ))}
              </ul>
            </nav>
          )}

          <div className={`${enlaces.length ? 'lg:col-span-3' : 'lg:col-span-5'} flex flex-col lg:items-end gap-5`}>
            {negocio?.whatsapp && (
              <>
                {nav?.textoWhatsappPie && <p className="text-xs text-slate">{nav.textoWhatsappPie}</p>}
                <a href={enlaceWhatsapp(negocio)} target="_blank" rel="noreferrer" className="pill-negra text-sm">
                  <span>{negocio.telefono || 'WhatsApp'}</span>
                  <span className="disco" aria-hidden="true"><ArrowUpRight className="w-4 h-4" /></span>
                </a>
              </>
            )}

            {redes.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 pt-1">
                {redes.map((r) => (
                  <a
                    key={r.key}
                    href={negocio[r.key]}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={r.key}
                    className="px-2.5 py-1 rounded-lg bg-surface-2 hover:bg-accent hover:text-white text-graphite font-semibold text-xs transition-all border border-line"
                  >
                    {r.label}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate/70">
          <p>&copy; {new Date().getFullYear()} {negocio?.nombre}{ubicacion ? ` · ${ubicacion}` : ''}</p>
          {legales.length > 0 && (
            <nav aria-label="Legal">
              <ul className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
                {legales.map((e, i) => (
                  <li key={`${e.enlace}-${i}`}>
                    <a href={e.enlace} {...externo(e.enlace)} className="hover:text-graphite transition-colors">{e.etiqueta}</a>
                  </li>
                ))}
              </ul>
            </nav>
          )}
        </div>
      </div>
    </footer>
  );
}
