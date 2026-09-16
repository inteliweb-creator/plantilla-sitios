import { ArrowUpRight, ShieldCheck, Clock, MapPin } from 'lucide-react';
import { enlaceWhatsapp, textos } from '../../lib/negocio.js';
import Acordeon from './Acordeon.jsx';

/**
 * Secciones fijas de las páginas de servicio.
 * Todas reciben `datos` (el bloque del panel) y `negocio` ("Datos del negocio").
 */

const titular = (titulo, enfasis) => (
  <>
    {titulo} {enfasis && <em>{enfasis}</em>}
  </>
);

/** Trabajo publicado: los casos reales en dos cintas que corren en sentidos opuestos. */
export function DesfileCasos({ datos, casos = [] }) {
  if (!casos.length) return null;
  const filas = [casos, [...casos].reverse()];
  return (
    <section className="relative bg-white py-20 sm:py-28 overflow-hidden">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12 pl-rail mb-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            {datos.etiqueta && <span className="etiqueta-zen mb-6">{datos.etiqueta}</span>}
            <h2 className="text-graphite text-[2.3rem] sm:text-[3.2rem] leading-[1] max-w-2xl">{titular(datos.titulo, datos.enfasis)}</h2>
          </div>
          {datos.lead && <p className="text-[15px] text-slate leading-relaxed max-w-sm">{datos.lead}</p>}
        </div>
      </div>
      <div className="space-y-3">
        {filas.map((fila, f) => (
          <div key={f} className="desfile-marco overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_8%,black_92%,transparent)]">
            <ul className="desfile-pista gap-3 pr-3" style={f === 1 ? { animationDirection: 'reverse', animationDuration: '46s' } : undefined}>
              {[...fila, ...fila].map((c, i) => (
                <li key={`${c.id}-${i}`} aria-hidden={i >= fila.length ? 'true' : undefined}>
                  <a
                    href={c.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    tabIndex={i >= fila.length ? -1 : undefined}
                    className="group flex items-center gap-4 rounded-full bg-[#F4F4F5] hover:bg-[#0E0F11] pl-6 pr-2 py-2 transition-colors duration-300 whitespace-nowrap"
                  >
                    <span>
                      <span className="block text-[17px] font-medium tracking-[-0.03em] text-graphite group-hover:text-white transition-colors">{c.nombre}</span>
                      <span className="block text-[11px] text-slate group-hover:text-white/60 transition-colors">{c.rubro}</span>
                    </span>
                    <span className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-graphite transition-transform duration-300 group-hover:rotate-45">
                      <ArrowUpRight className="w-4 h-4" />
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}

/** Preguntas del servicio (del grupo elegido en "Preguntas frecuentes"), con sus datos para Google. */
export function PreguntasServicio({ datos, preguntas = [] }) {
  if (!preguntas.length) return null;
  const items = preguntas.map((p) => ({ q: p.pregunta, a: p.respuesta }));
  const esquema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  };
  return (
    <section className="py-20 sm:py-28" style={{ background: '#F4F4F5' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(esquema).replace(/</g, '\\u003c') }} />
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12 pl-rail">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
          <div className="lg:col-span-4">
            {datos.etiqueta && <span className="etiqueta-zen !bg-white mb-6">{datos.etiqueta}</span>}
            <h2 className="text-graphite text-[2.3rem] sm:text-[3.2rem] leading-[1]">{titular(datos.titulo, datos.enfasis)}</h2>
          </div>
          <div className="lg:col-span-8">
            <Acordeon items={items} />
          </div>
        </div>
      </div>
    </section>
  );
}

/** Enlaces a los otros servicios. */
export function OtrosServicios({ datos }) {
  const items = (datos.items || []).filter((x) => x?.enlace);
  if (!items.length) return null;
  return (
    <section className="py-16 sm:py-24 bg-white">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12 pl-rail">
        {datos.etiqueta && <span className="etiqueta-zen mb-6">{datos.etiqueta}</span>}
        <h2 className="text-graphite text-[2rem] sm:text-[2.6rem] leading-[1] mb-10">{titular(datos.titulo, datos.enfasis)}</h2>
        <ul className="grid grid-cols-1 md:grid-cols-2 border-t border-line">
          {items.map((s, i) => (
            <li key={s.id || i} className={`border-b border-line ${i % 2 === 0 ? 'md:border-r md:pr-8' : 'md:pl-8'}`}>
              <a href={s.enlace} className="group flex items-start justify-between gap-6 py-7">
                <span>
                  <span className="block text-[1.5rem] sm:text-[1.8rem] leading-[1.05] tracking-[-0.04em] font-medium text-graphite mb-2">{s.titulo}</span>
                  {s.descripcion && <span className="block text-sm text-slate leading-relaxed max-w-md">{s.descripcion}</span>}
                </span>
                <span className="w-11 h-11 rounded-full bg-[#F1F1F0] flex items-center justify-center shrink-0 text-graphite transition-all duration-300 group-hover:bg-[#0E0F11] group-hover:text-white group-hover:rotate-45">
                  <ArrowUpRight className="w-4 h-4" />
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/** Cierre en negro: el único bloque oscuro de la página, marca el final. */
export function CierreServicio({ datos, negocio }) {
  return (
    <section className="px-3 sm:px-5 pb-16 sm:pb-24">
      <div className="tema-oscuro relative overflow-hidden rounded-[var(--radius-panel)] bg-[#0E0F11] px-6 sm:px-12 py-20 sm:py-28 text-center">
        <div aria-hidden="true" className="absolute left-1/2 -translate-x-1/2 -bottom-72 pointer-events-none">
          <div className="halo-bronce w-[40rem] h-[40rem] opacity-50" />
        </div>
        <div className="relative z-10 flex flex-col items-center">
          {datos.etiqueta && (
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[12px] text-white/80 mb-7">
              <span className="w-[5px] h-[5px] rounded-full bg-white" />
              {datos.etiqueta}
            </span>
          )}
          <h2 className="text-white text-[2.3rem] sm:text-[3.6rem] leading-[1] max-w-4xl mb-6">
            {datos.titulo} {datos.enfasis && <em className="!text-[#9EA2A8]">{datos.enfasis}</em>}
          </h2>
          {datos.lead && <p className="text-base sm:text-lg text-white/60 leading-relaxed max-w-2xl mb-10">{datos.lead}</p>}
          <div className="flex flex-wrap items-center justify-center gap-2.5">
            <a href={enlaceWhatsapp(negocio, datos.mensajeWhatsapp)} target="_blank" rel="noreferrer" className="pill-negra text-sm">
              <span>{datos.cta || 'Escribir por WhatsApp'}</span>
              <span className="disco" aria-hidden="true"><ArrowUpRight className="w-4 h-4" /></span>
            </a>
            {datos.botonSecundario && (
              <a href={datos.enlaceSecundario || '/#cotizador'} className="pill-gris text-sm !bg-white/10 !text-white hover:!bg-white/20">
                {datos.botonSecundario}
              </a>
            )}
          </div>
          <div className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-[12px] text-white/50">
            {datos.garantia && <span className="flex items-center gap-2"><ShieldCheck className="w-4 h-4" /> {datos.garantia}</span>}
            {negocio?.horario && <span className="flex items-center gap-2"><Clock className="w-4 h-4" /> {negocio.horario}</span>}
          </div>
        </div>
      </div>
    </section>
  );
}

/** Cobertura por municipios (página local). */
export function Cobertura({ datos, negocio }) {
  const municipios = textos(datos.municipios);
  const ubicacion = [negocio?.ciudad, negocio?.departamento].filter(Boolean).join(', ');
  return (
    <section className="bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12 pl-rail">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-end">
          <div className="lg:col-span-6">
            {datos.etiqueta && <span className="etiqueta-zen mb-6">{datos.etiqueta}</span>}
            <h2 className="text-graphite text-[2.3rem] sm:text-[3.2rem] leading-[1] mb-5">{titular(datos.titulo, datos.enfasis)}</h2>
            {datos.lead && <p className="text-base sm:text-lg text-slate leading-relaxed max-w-xl">{datos.lead}</p>}
          </div>
          <div className="lg:col-span-6">
            <ul className="flex flex-wrap gap-2">
              {municipios.map((m, i) => (
                <li key={m} className={`inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-[14px] ${i === 0 ? 'bg-[#0E0F11] text-white' : 'bg-[#F4F4F5] text-graphite'}`}>
                  <span className={`w-[5px] h-[5px] rounded-full ${i === 0 ? 'bg-white' : 'bg-[#0E0F11]'}`} />
                  {m}
                </li>
              ))}
            </ul>
          </div>
        </div>
        {(datos.nota || datos.enlaceBoton) && (
          <div className="mt-12 flex flex-col sm:flex-row sm:items-center gap-5 border-t border-line pt-8">
            <div className="flex items-start gap-3 flex-1">
              <MapPin className="w-5 h-5 text-graphite shrink-0 mt-0.5" />
              <p className="text-[15px] text-slate leading-relaxed">
                {ubicacion && <span className="block font-medium text-graphite mb-0.5">{ubicacion}</span>}
                {datos.nota}
              </p>
            </div>
            {datos.enlaceBoton && (
              <a href={datos.enlaceBoton} target="_blank" rel="noreferrer" className="pill-gris text-sm whitespace-nowrap">
                {datos.boton || 'Ver en Google Maps'}
              </a>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

/** Comparativa en dos columnas: la opción de afuera en gris, la propia en negro. */
export function Comparativa({ datos }) {
  const filas = datos.filas || [];
  return (
    <section className="bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12 pl-rail">
        <div className="max-w-3xl mb-12">
          {datos.etiqueta && <span className="etiqueta-zen mb-6">{datos.etiqueta}</span>}
          <h2 className="text-graphite text-[2.3rem] sm:text-[3.2rem] leading-[1] mb-5">{titular(datos.titulo, datos.enfasis)}</h2>
          {datos.lead && <p className="text-base sm:text-lg text-slate leading-relaxed">{datos.lead}</p>}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-[28px] bg-[#F4F4F5] p-7 sm:p-9">
            <p className="text-[13px] text-slate mb-6">{datos.etiquetaOtra}</p>
            <ul className="space-y-6">
              {filas.map((f, i) => (
                <li key={f.id || i} className="border-t border-graphite/10 pt-5">
                  <span className="block text-[12px] text-slate mb-1.5">{f.tema}</span>
                  <span className="block text-[15px] text-slate leading-relaxed">{f.otra}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="tema-oscuro rounded-[28px] bg-[#0E0F11] p-7 sm:p-9">
            <p className="inline-flex items-center gap-2 text-[13px] text-white mb-6">
              <span className="w-[5px] h-[5px] rounded-full bg-[#E3A06A]" /> {datos.etiquetaPropia}
            </p>
            <ul className="space-y-6">
              {filas.map((f, i) => (
                <li key={f.id || i} className="border-t border-white/10 pt-5">
                  <span className="block text-[12px] text-white/50 mb-1.5">{f.tema}</span>
                  <span className="block text-[15px] text-white leading-relaxed">{f.propia}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
