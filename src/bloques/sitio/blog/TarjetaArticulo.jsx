import { ArrowUpRight, Search, MapPin, Palette, Sparkles, Store, PenTool } from 'lucide-react';
import { imagenDe } from '@/utilities/imagenDe';

/**
 * Tarjeta de artículo: anillo exterior,
 * imagen de portada con velo claro (o malla de color si no hay imagen),
 * orbe con icono, píldoras de temas, panel con número, fecha y lectura, y
 * firma vertical en el canto derecho.
 */
const ICONOS = { 'SEO local': MapPin, SEO: Search, Artistas: Palette, 'Google Business Profile': MapPin, 'Marca personal': Palette, Tiendas: Store, 'Diseño web': PenTool };
const MALLAS = ['mesh-sky', 'mesh-mist', 'mesh-periwinkle', 'mesh-dusk', 'mesh-ivory'];

export default function TarjetaArticulo({ articulo, indice = 0, negocio }) {
  const { title, descripcion, etiquetas = [], minutosLectura, fechaPublicacion, portada, slug } = articulo;
  const temas = etiquetas || [];
  const Icono = ICONOS[temas[0]] ?? Sparkles;
  const imagen = imagenDe(portada, 'mediana');
  const numero = String(indice + 1).padStart(2, '0');
  const fecha = fechaPublicacion ? new Date(fechaPublicacion) : null;

  return (
    <article>
      <div className="rounded-[34px] sm:rounded-[40px] bg-surface border border-line p-2 sm:p-2.5 shadow-[var(--shadow-lift)] transition-transform duration-500 hover:-translate-y-2">
        <a href={`/blog/${slug}`} aria-label={title} className="group relative block overflow-hidden rounded-[26px] sm:rounded-[32px] grain min-h-[26rem] sm:min-h-[22rem]">
          {imagen ? (
            <>
              <img src={imagen} alt={portada?.alt || ''} loading="lazy" className="absolute inset-0 w-full h-full object-cover z-0" />
              <div className="absolute inset-0 z-[1]" style={{ background: 'linear-gradient(to right, rgba(255,255,255,.95) 0%, rgba(255,255,255,.86) 55%, rgba(255,255,255,.42) 100%)' }} />
            </>
          ) : (
            <div className={`mesh ${MALLAS[indice % MALLAS.length]}`} />
          )}

          {temas[0] && (
            <span className="hidden sm:flex absolute right-0 top-0 bottom-0 w-11 items-center justify-center border-l border-line bg-surface-2 z-20">
              <span className="text-vertical rotate-180 text-[10px] font-semibold uppercase tracking-[0.22em] text-slate whitespace-nowrap">
                {temas[0]}{negocio?.nombre ? ` · ${negocio.nombre}` : ''}
              </span>
            </span>
          )}

          <div className="relative z-10 h-full flex flex-col justify-between p-6 sm:p-9 sm:pr-20">
            <div className="flex items-start justify-between gap-4 mb-7">
              <span className="glass-orb w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center shrink-0">
                <Icono className="w-6 h-6 text-graphite" />
              </span>
              <div className="flex flex-col items-end gap-2">
                {temas.slice(0, 2).map((t) => (
                  <span key={t} className="glass-pill px-3.5 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-graphite">{t}</span>
                ))}
              </div>
            </div>

            <div className="max-w-2xl">
              <h2 className="font-display text-[1.75rem] sm:text-4xl lg:text-[2.6rem] leading-[1.08] text-graphite mb-4">{title}</h2>
              <p className="text-sm sm:text-base text-slate leading-relaxed line-clamp-3">{descripcion}</p>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <div className="glass-pill rounded-[22px] px-2 py-2 pr-5 gap-4">
                <span className="w-11 h-11 rounded-full bg-white/85 text-graphite font-display text-lg flex items-center justify-center shrink-0">{numero}</span>
                <span className="flex items-center gap-5 sm:gap-7">
                  {fecha && (
                    <span className="block">
                      <span className="block text-[9px] font-semibold uppercase tracking-[0.16em] text-ink-muted">Publicado</span>
                      <time dateTime={fecha.toISOString()} className="block text-sm font-medium text-graphite">
                        {fecha.toLocaleDateString('es-CO', { day: 'numeric', month: 'short', timeZone: 'UTC' })} {fecha.getUTCFullYear()}
                      </time>
                    </span>
                  )}
                  {minutosLectura ? (
                    <span className="block">
                      <span className="block text-[9px] font-semibold uppercase tracking-[0.16em] text-ink-muted">Lectura</span>
                      <span className="block text-sm font-medium text-graphite">{minutosLectura} min</span>
                    </span>
                  ) : null}
                </span>
              </div>
              <span className="glass-orb w-12 h-12 flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:bg-accent group-hover:border-accent">
                <ArrowUpRight className="w-5 h-5 text-graphite" />
              </span>
            </div>
          </div>
        </a>
      </div>
    </article>
  );
}
