import { ArrowUpRight } from 'lucide-react';

import { enlaceWhatsapp } from '../lib/negocio';

/**
 * Franja de llamada a la acción entre secciones. Frase grande, botón negro
 * que abre WhatsApp y botón gris opcional.
 */
export default function Franja({ datos: D = {}, negocio = {} }) {
  return (
    <section className="relative bg-white">
      <div className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12 pl-rail py-14 sm:py-20">
        <div className="border-y border-line py-10 sm:py-12 flex flex-col lg:flex-row items-center justify-between gap-6 text-center lg:text-left">
          <p className="text-[1.6rem] sm:text-[2.2rem] leading-[1.05] tracking-[-0.04em] font-medium text-graphite max-w-2xl">
            {D.frase} {D.enfasis && <span className="text-[#85888D]">{D.enfasis}</span>}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2.5 shrink-0">
            <a href={enlaceWhatsapp(negocio, D.mensajeWhatsapp)} target="_blank" rel="noreferrer" className="pill-negra text-[13px]">
              <span>{D.boton}</span>
              <span className="disco" aria-hidden="true">
                <ArrowUpRight className="w-4 h-4" />
              </span>
            </a>
            {D.botonSecundario && (
              <a href={D.enlaceSecundario || '#cotizador'} className="pill-gris text-[13px]">
                {D.botonSecundario}
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
