import { ArrowUpRight, MessageCircle } from 'lucide-react';
import { enlaceWhatsapp } from '../lib/negocio.js';
import Suscripcion from './Suscripcion.jsx';
import { modulosActivos } from '@/modulos';

/** Recuadro del boletín, con los textos de "Blog: textos de la página". */
export async function RecuadroBoletin({ blog, variante = 'tarjeta' }) {
  if (blog?.mostrarBoletin === false || !(await modulosActivos()).boletin) return null;
  const encabezado = (
    <>
      {blog?.boletinEtiqueta && <span className="etiqueta-zen mb-4">{blog.boletinEtiqueta}</span>}
      <h2 className="text-2xl sm:text-3xl text-graphite mb-3">
        {blog?.boletinTitulo} {blog?.boletinEnfasis && <em className="text-accent">{blog.boletinEnfasis}</em>}
      </h2>
      {blog?.boletinTexto && <p className="text-sm text-slate leading-relaxed mb-6 max-w-xl">{blog.boletinTexto}</p>}
      <Suscripcion textos={blog || {}} />
    </>
  );

  if (variante === 'franja') {
    return (
      <section className="py-14 border-t border-line">
        <div className="max-w-6xl mx-auto px-5 sm:px-6 lg:px-8 pl-rail">
          <div className="max-w-2xl">{encabezado}</div>
        </div>
      </section>
    );
  }
  return (
    <section className="pb-8">
      <div className="max-w-6xl mx-auto px-5 sm:px-6 lg:px-8 pl-rail">
        <div className="rounded-[var(--radius-card)] border border-line bg-surface p-8 sm:p-10">{encabezado}</div>
      </div>
    </section>
  );
}

/** Banda de cierre (portada de CtaBand): titular, texto y botones a WhatsApp. */
export function CierreBlog({ blog, negocio }) {
  if (!blog?.cierreTitulo) return null;
  const wa = enlaceWhatsapp(negocio, blog.cierreMensajeWhatsapp);
  return (
    <section className="px-3 sm:px-5 py-16 sm:py-24">
      <div className="w-full rounded-[var(--radius-panel)] bg-surface grain px-6 sm:px-12 py-20 sm:py-24 text-center relative overflow-hidden">
        <div className="relative z-10 flex flex-col items-center">
          <h2 className="text-4xl sm:text-5xl md:text-[3.6rem] text-graphite leading-[1.06] mb-7 max-w-3xl">
            {blog.cierreTitulo} {blog.cierreEnfasis && <em className="text-accent">{blog.cierreEnfasis}</em>}
          </h2>
          {blog.cierreLead && <p className="text-base sm:text-lg text-ink-muted max-w-2xl leading-relaxed mb-10">{blog.cierreLead}</p>}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
            <a href={wa} target="_blank" rel="noreferrer" className="pill-negra text-sm">
              <span>{blog.cierreBoton || 'Cuéntanos tu caso'}</span>
              <span className="disco" aria-hidden="true"><ArrowUpRight className="w-4 h-4" /></span>
            </a>
            {negocio?.telefono && (
              <a href={wa} target="_blank" rel="noreferrer" className="btn-ghost-ink px-7 py-4 text-sm whitespace-nowrap">
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp {negocio.telefono}</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
