/**
 * Encabezado de página interior:
 * el gris perla de la portada fundiéndose en blanco, ruta de navegación,
 * etiqueta, titular con parte destacada, entradilla y, opcional, la tarjeta
 * de vidrio con una frase.
 */
export default function Encabezado({ datos }) {
  const { eyebrow, titulo, enfasis, lead, destacado, destacadoMeta } = datos;

  return (
    <section
      className="relative overflow-hidden pt-28 sm:pt-36 pb-14 sm:pb-20"
      style={{ background: 'linear-gradient(180deg, #E6E7EA 0%, #EEEFF1 55%, #FFFFFF 100%)' }}
    >
      <div aria-hidden="true" className="halo-bronce absolute w-[30rem] h-[30rem] -right-40 -top-24 opacity-60 pointer-events-none" />
      <div className="relative z-10 mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12 pl-rail">
        {eyebrow && (
          <nav aria-label="Ruta de navegación" className="mb-8">
            <ol className="flex items-center gap-2 text-[12px] text-slate">
              <li><a href="/" className="hover:text-graphite transition-colors">Inicio</a></li>
              <li aria-hidden="true" className="w-px h-3 bg-graphite/30" />
              <li className="text-graphite">{eyebrow}</li>
            </ol>
          </nav>
        )}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-end">
          <div className="lg:col-span-7">
            {eyebrow && <span className="etiqueta-zen mb-6">{eyebrow}</span>}
            <h1 className="text-graphite text-[2.6rem] sm:text-[3.8rem] xl:text-[4.6rem] leading-[0.98] mb-7">
              {titulo}
              {enfasis && <> <span className="text-slate">{enfasis}</span></>}
            </h1>
            {lead && <p className="text-base sm:text-lg text-slate leading-relaxed max-w-xl">{lead}</p>}
          </div>
          {destacado && (
            <aside className="lg:col-span-5">
              <div className="vidrio-zen !bg-white/70 rounded-[28px] p-7 sm:p-8 shadow-[var(--shadow-lift)]">
                <p className="text-[1.35rem] sm:text-[1.6rem] leading-[1.2] tracking-[-0.035em] font-medium text-graphite mb-6">{destacado}</p>
                {destacadoMeta && (
                  <>
                    <div className="h-px bg-graphite/10 mb-5" />
                    <p className="text-[12px] text-slate leading-relaxed">{destacadoMeta}</p>
                  </>
                )}
              </div>
            </aside>
          )}
        </div>
      </div>
    </section>
  );
}
