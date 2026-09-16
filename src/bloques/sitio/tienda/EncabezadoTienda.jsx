/**
 * Encabezado corto de las pantallas de la tienda (catálogo, pago, cuenta):
 * el mismo gris perla de la portada fundiéndose en blanco, ruta de
 * navegación, etiqueta y titular con parte destacada.
 */
/** @param {{ ruta?: { texto: string, href?: string }[], etiqueta?: string, titulo?: string, enfasis?: string, lead?: string, compacto?: boolean, children?: any }} props */
export default function EncabezadoTienda({ ruta = [], etiqueta, titulo, enfasis, lead, compacto = false, children }) {
  return (
    <section
      className={`relative overflow-hidden ${compacto ? 'pt-28 sm:pt-32 pb-8 sm:pb-10' : 'pt-28 sm:pt-36 pb-12 sm:pb-16'}`}
      style={{ background: 'linear-gradient(180deg, #E6E7EA 0%, #EEEFF1 55%, #FFFFFF 100%)' }}
    >
      <div aria-hidden="true" className="halo-bronce absolute w-[26rem] h-[26rem] -right-40 -top-24 opacity-50 pointer-events-none" />
      <div className="relative z-10 mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12 pl-rail">
        {ruta.length > 0 && (
          <nav aria-label="Ruta de navegación" className="mb-7">
            <ol className="flex flex-wrap items-center gap-2 text-[12px] text-slate">
              <li><a href="/" className="hover:text-graphite transition-colors">Inicio</a></li>
              {ruta.map((r, i) => (
                <li key={i} className="flex items-center gap-2">
                  <span aria-hidden="true" className="w-px h-3 bg-graphite/30" />
                  {r.href ? <a href={r.href} className="hover:text-graphite transition-colors">{r.texto}</a> : <span className="text-graphite">{r.texto}</span>}
                </li>
              ))}
            </ol>
          </nav>
        )}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="max-w-3xl">
            {etiqueta && <span className="etiqueta-zen mb-5">{etiqueta}</span>}
            {titulo && (
              <h1 className={`text-graphite leading-[0.98] ${compacto ? 'text-[2.2rem] sm:text-[3rem]' : 'text-[2.6rem] sm:text-[3.8rem] xl:text-[4.4rem]'} ${lead ? 'mb-5' : ''}`}>
                {titulo} {enfasis && <span className="text-slate">{enfasis}</span>}
              </h1>
            )}
            {lead && <p className="text-base sm:text-lg text-slate leading-relaxed max-w-xl">{lead}</p>}
          </div>
          {children}
        </div>
      </div>
    </section>
  );
}
