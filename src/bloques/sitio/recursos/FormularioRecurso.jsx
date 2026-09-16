'use client';

import { useState } from 'react';
import { ArrowUpRight, Check, AlertTriangle, Loader2, Download } from 'lucide-react';
import { medir } from '@/components/Medicion/eventos';

/**
 * Pedir un recurso gratis: nombre (opcional), correo y permiso. La casilla
 * del boletín va aparte y sin marcar: recibir el recurso no obliga a nada más.
 */
export default function FormularioRecurso({ recurso, boton = 'Quiero recibirlo', ofrecerBoletin = false, oscuro = false }) {
  const [estado, setEstado] = useState('inicial');
  const [respuesta, setRespuesta] = useState({});

  const enviar = async (e) => {
    e.preventDefault();
    if (estado === 'enviando') return;
    setEstado('enviando');
    const f = new FormData(e.currentTarget);
    try {
      const res = await fetch('/next/recurso', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recurso,
          nombre: f.get('nombre'),
          correo: f.get('correo'),
          acepto: f.get('acepto') === 'on',
          boletin: f.get('boletin') === 'on',
          sitioWeb: f.get('sitioWeb'),
          origen: location.pathname,
        }),
      });
      const datos = await res.json().catch(() => ({}));
      setRespuesta(datos);
      if (res.ok && datos.ok) medir('contacto');
      setEstado(res.ok && datos.ok ? 'ok' : 'error');
    } catch {
      setRespuesta({ mensaje: 'No hay conexión. Inténtalo de nuevo.' });
      setEstado('error');
    }
  };

  const tinta = oscuro ? 'text-white' : 'text-graphite';
  const suave = oscuro ? 'text-white/70' : 'text-slate';

  if (estado === 'ok') {
    return (
      <div role="status" className={`rounded-[var(--radius-card)] border ${oscuro ? 'border-white/20 bg-white/5' : 'border-accent/40 bg-surface'} p-5`}>
        <p className={`flex items-start gap-3 text-sm font-semibold ${tinta}`}>
          <Check className="w-5 h-5 text-accent shrink-0" />
          {respuesta.mensaje}
        </p>
        {respuesta.enlace && (
          <a href={respuesta.enlace} className={`pill-negra text-sm mt-4`} data-descarga>
            <span>Descargar ahora</span>
            <span className="disco" aria-hidden="true"><Download className="w-4 h-4" /></span>
          </a>
        )}
      </div>
    );
  }

  const campo = `w-full px-4 py-3.5 rounded-full border text-sm focus:border-accent focus:outline-none transition-colors ${
    oscuro ? 'bg-white/10 border-white/20 text-white placeholder:text-white/50' : 'bg-surface-2 border-line text-graphite placeholder:text-slate/60'
  }`;
  const id = `recurso-${recurso}`;
  return (
    <form onSubmit={enviar} className="space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        <label htmlFor={`${id}-nombre`} className="sr-only">Tu nombre</label>
        <input id={`${id}-nombre`} name="nombre" autoComplete="name" placeholder="Tu nombre" maxLength={120} className={campo} />
        <label htmlFor={`${id}-correo`} className="sr-only">Tu correo</label>
        <input id={`${id}-correo`} name="correo" type="email" required autoComplete="email" placeholder="tu@correo.com" className={campo} />
      </div>
      <input type="text" name="sitioWeb" tabIndex={-1} autoComplete="off" aria-hidden="true" className="absolute w-px h-px -m-px overflow-hidden opacity-0 pointer-events-none" />
      <label className={`flex items-start gap-2.5 text-xs leading-relaxed ${suave}`}>
        <input type="checkbox" name="acepto" required className="mt-0.5" />
        <span>
          Acepto la <a href="/privacidad" className="underline">política de privacidad</a> y que me envíen el recurso a este correo.
        </span>
      </label>
      {ofrecerBoletin && (
        <label className={`flex items-start gap-2.5 text-xs leading-relaxed ${suave}`}>
          <input type="checkbox" name="boletin" className="mt-0.5" />
          <span>Quiero recibir también el boletín (opcional, puedo darme de baja cuando quiera).</span>
        </label>
      )}
      {estado === 'error' && (
        <p role="alert" className="flex items-start gap-2 text-sm text-accent">
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
          {respuesta.mensaje || 'No pudimos procesar tu solicitud.'}
        </p>
      )}
      <button type="submit" disabled={estado === 'enviando'} className={`pill-negra text-sm`}>
        <span>{estado === 'enviando' ? 'Un momento' : boton}</span>
        <span className="disco" aria-hidden="true">
          {estado === 'enviando' ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowUpRight className="w-4 h-4" />}
        </span>
      </button>
    </form>
  );
}
