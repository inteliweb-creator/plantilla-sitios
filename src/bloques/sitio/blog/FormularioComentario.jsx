'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, Check, AlertTriangle, Loader2 } from 'lucide-react';

/** Formulario para comentar un artículo. El comentario queda pendiente de revisión. */
export default function FormularioComentario({ articulo, boton = 'Enviar comentario' }) {
  const [estado, setEstado] = useState('inicial');
  const [mensaje, setMensaje] = useState('');
  const abierto = useRef(0);
  useEffect(() => {
    abierto.current = Date.now();
  }, []);

  const enviar = async (e) => {
    e.preventDefault();
    if (estado === 'enviando') return;
    setEstado('enviando');
    const f = new FormData(e.currentTarget);
    try {
      const res = await fetch('/next/comentario', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          articulo,
          nombre: f.get('nombre'),
          correo: f.get('correo'),
          texto: f.get('texto'),
          acepto: f.get('acepto') === 'on',
          sitioWeb: f.get('sitioWeb'),
          abierto: abierto.current,
        }),
      });
      const datos = await res.json().catch(() => ({}));
      setMensaje(datos.mensaje || 'No pudimos enviar tu comentario.');
      setEstado(res.ok && datos.ok ? 'ok' : 'error');
    } catch {
      setMensaje('No hay conexión. Inténtalo de nuevo.');
      setEstado('error');
    }
  };

  if (estado === 'ok') {
    return (
      <div role="status" className="flex items-start gap-3 rounded-[var(--radius-card)] border border-accent/40 bg-surface p-5">
        <Check className="w-5 h-5 text-accent shrink-0 mt-0.5" />
        <p className="text-graphite text-sm">{mensaje}</p>
      </div>
    );
  }

  const campo =
    'w-full px-4 py-3 rounded-2xl bg-surface-2 border border-line text-graphite text-sm placeholder:text-slate/60 focus:border-accent focus:outline-none transition-colors';
  return (
    <form onSubmit={enviar} className="space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label htmlFor="comentario-nombre" className="block text-xs text-slate mb-1.5">Nombre (se publica)</label>
          <input id="comentario-nombre" name="nombre" required maxLength={80} autoComplete="name" className={campo} />
        </div>
        <div>
          <label htmlFor="comentario-correo" className="block text-xs text-slate mb-1.5">Correo (no se publica)</label>
          <input id="comentario-correo" name="correo" type="email" required autoComplete="email" className={campo} />
        </div>
      </div>
      <div>
        <label htmlFor="comentario-texto" className="block text-xs text-slate mb-1.5">Comentario</label>
        <textarea id="comentario-texto" name="texto" required minLength={3} maxLength={2000} rows={4} className={campo} />
      </div>
      <input type="text" name="sitioWeb" tabIndex={-1} autoComplete="off" aria-hidden="true" className="absolute w-px h-px -m-px overflow-hidden opacity-0 pointer-events-none" />
      <label className="flex items-start gap-2.5 text-xs text-slate leading-relaxed">
        <input type="checkbox" name="acepto" required className="mt-0.5" />
        <span>
          Acepto la <a href="/privacidad" className="underline">política de privacidad</a>. Mi correo solo se usa por si hay que responderme.
        </span>
      </label>
      {estado === 'error' && (
        <p role="alert" className="flex items-start gap-2 text-sm text-accent">
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
          {mensaje}
        </p>
      )}
      <button type="submit" disabled={estado === 'enviando'} className="pill-negra text-sm">
        <span>{estado === 'enviando' ? 'Enviando' : boton}</span>
        <span className="disco" aria-hidden="true">
          {estado === 'enviando' ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowUpRight className="w-4 h-4" />}
        </span>
      </button>
    </form>
  );
}
