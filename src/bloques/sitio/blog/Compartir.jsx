'use client';

import { useEffect, useState } from 'react';
import { Link2, Check, Share2 } from 'lucide-react';

/**
 * Botones para compartir un artículo. En el celular aparece además
 * "Compartir", que abre el menú del teléfono (WhatsApp, Telegram, lo que tenga).
 */
const REDES = [
  {
    nombre: 'WhatsApp',
    url: (u, t) => `https://wa.me/?text=${encodeURIComponent(`${t} ${u}`)}`,
    icono: 'M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.64.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.21 3.08c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.7.63.71.23 1.36.2 1.87.12.57-.08 1.76-.72 2.01-1.42.25-.7.25-1.29.17-1.42-.07-.12-.27-.2-.57-.35zM12.04 21.8a9.8 9.8 0 0 1-5-1.37l-.36-.21-3.72.97 1-3.62-.24-.37a9.8 9.8 0 1 1 8.32 4.6zm8.34-18.13A11.78 11.78 0 0 0 12.04.2C5.5.2.2 5.5.2 12.03c0 2.09.55 4.12 1.59 5.92L.1 24l6.2-1.63a11.8 11.8 0 0 0 5.73 1.46c6.53 0 11.84-5.3 11.84-11.83 0-3.16-1.23-6.13-3.46-8.36z',
  },
  {
    nombre: 'Facebook',
    url: (u) => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(u)}`,
    icono: 'M24 12.07C24 5.41 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.04V9.41c0-3.02 1.8-4.7 4.54-4.7 1.31 0 2.68.24 2.68.24v2.97h-1.5c-1.5 0-1.96.93-1.96 1.89v2.26h3.33l-.53 3.5h-2.8V24C19.62 23.1 24 18.1 24 12.07z',
  },
  {
    nombre: 'LinkedIn',
    url: (u) => `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(u)}`,
    icono: 'M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z',
  },
  {
    nombre: 'X',
    url: (u, t) => `https://x.com/intent/post?text=${encodeURIComponent(t)}&url=${encodeURIComponent(u)}`,
    icono: 'M18.9 1.15h3.68l-8.04 9.19L24 22.85h-7.4l-5.8-7.58-6.63 7.58H.49l8.6-9.83L0 1.15h7.59l5.24 6.93 6.07-6.93zm-1.29 19.5h2.04L6.48 3.24H4.3l13.31 17.41z',
  },
];

export default function Compartir({ url, titulo, texto }) {
  const [copiado, setCopiado] = useState(false);
  const [nativo, setNativo] = useState(false);
  useEffect(() => setNativo(typeof navigator.share === 'function'), []);

  const copiar = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    } catch {}
  };

  const boton =
    'w-10 h-10 rounded-full border border-line bg-white flex items-center justify-center text-graphite hover:bg-graphite hover:text-white hover:border-graphite transition-colors';

  return (
    <div className="not-prose flex flex-wrap items-center gap-3 mt-12 pt-8 border-t border-line" data-compartir>
      <p className="text-sm text-slate mr-1 !mt-0">{texto || '¿Le sirve a alguien? Compártelo'}</p>
      <div className="flex flex-wrap items-center gap-2">
        {REDES.map((r) => (
          <a key={r.nombre} href={r.url(url, titulo)} target="_blank" rel="noopener noreferrer" aria-label={`Compartir en ${r.nombre}`} title={r.nombre} className={boton}>
            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor" aria-hidden="true">
              <path d={r.icono} />
            </svg>
          </a>
        ))}
        <button type="button" onClick={copiar} aria-label="Copiar enlace" title="Copiar enlace" className={boton}>
          {copiado ? <Check className="w-4 h-4" /> : <Link2 className="w-4 h-4" />}
        </button>
        {nativo && (
          <button type="button" onClick={() => navigator.share({ title: titulo, url }).catch(() => {})} aria-label="Compartir" className={`${boton} sm:hidden`}>
            <Share2 className="w-4 h-4" />
          </button>
        )}
      </div>
      <span role="status" className="text-xs text-accent">{copiado ? 'Enlace copiado' : ''}</span>
    </div>
  );
}
