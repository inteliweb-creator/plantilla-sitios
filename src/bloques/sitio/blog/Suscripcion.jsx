'use client';

import { useState } from 'react';
import { ArrowUpRight, Check, AlertTriangle, Loader2 } from 'lucide-react';
import { medir } from '@/components/Medicion/eventos';

/**
 * Formulario del boletín. Solo pide el
 * correo: cada campo de más reduce las altas.
 */
export default function Suscripcion({ textos = {}, compacto = false }) {
  const [estado, setEstado] = useState('inicial');
  const [mensaje, setMensaje] = useState('');

  const enviar = async (e) => {
    e.preventDefault();
    if (estado === 'enviando') return;
    setEstado('enviando');
    const f = new FormData(e.currentTarget);
    try {
      const res = await fetch('/next/boletin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correo: f.get('correo'), sitioWeb: f.get('sitioWeb'), origen: location.pathname }),
      });
      const datos = await res.json().catch(() => ({}));
      setMensaje(datos.mensaje || 'No pudimos registrarte. Inténtalo en un momento.');
      if (res.ok && datos.ok) medir('suscripcion');
      setEstado(res.ok && datos.ok ? 'ok' : 'error');
    } catch {
      setMensaje('No hay conexión. Inténtalo de nuevo.');
      setEstado('error');
    }
  };

  if (estado === 'ok') {
    return (
      <div className="flex items-start gap-3 rounded-[var(--radius-card)] border border-accent/40 bg-surface p-5 max-w-md">
        <Check className="w-5 h-5 text-accent shrink-0 mt-0.5" />
        <div>
          <p className="text-graphite font-semibold text-sm mb-1">{mensaje}</p>
          {textos.boletinExito && <p className="text-sm text-slate leading-relaxed">{textos.boletinExito}</p>}
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={enviar} className={compacto ? '' : 'max-w-md'}>
      <div className="flex flex-col sm:flex-row gap-2.5">
        <label htmlFor="boletin-correo" className="sr-only">Tu correo</label>
        <input
          id="boletin-correo"
          name="correo"
          type="email"
          required
          autoComplete="email"
          placeholder="tu@correo.com"
          className="flex-1 px-4 py-3.5 rounded-full bg-surface-2 border border-line text-graphite text-sm placeholder:text-slate/60 focus:border-accent focus:outline-none transition-colors"
        />
        <input type="text" name="sitioWeb" tabIndex={-1} autoComplete="off" aria-hidden="true" className="absolute w-px h-px -m-px overflow-hidden opacity-0 pointer-events-none" />
        <button type="submit" disabled={estado === 'enviando'} className="pill-negra text-sm shrink-0">
          <span>{estado === 'enviando' ? 'Un momento' : textos.boletinBoton || 'Suscribirme'}</span>
          <span className="disco" aria-hidden="true">{estado === 'enviando' ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowUpRight className="w-4 h-4" />}</span>
        </button>
      </div>

      {estado === 'error' && (
        <p role="alert" className="flex items-start gap-2 text-sm text-accent mt-3">
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
          {mensaje}
        </p>
      )}

      <p className="text-xs text-slate/70 mt-3 leading-relaxed">
        {textos.boletinNota || 'Sin spam. Te puedes dar de baja en un clic.'}{' '}
        <a href="/privacidad" className="underline hover:text-slate">Cómo tratamos tus datos</a>.
      </p>
    </form>
  );
}
