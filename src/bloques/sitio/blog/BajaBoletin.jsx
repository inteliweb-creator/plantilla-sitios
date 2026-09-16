'use client';

import { useState } from 'react';
import { ArrowUpRight, Check, Loader2 } from 'lucide-react';

/** Confirmación de baja: un botón, para que los antivirus de correo no den de baja a nadie al abrir el enlace. */
export default function BajaBoletin({ codigo }) {
  const [estado, setEstado] = useState('inicial');

  if (!codigo) {
    return (
      <>
        <h1 className="text-4xl sm:text-5xl text-graphite mb-5">Enlace incompleto</h1>
        <p className="text-slate leading-relaxed">Usa el enlace "Darte de baja" que aparece al final de cualquiera de nuestros correos.</p>
      </>
    );
  }

  if (estado === 'ok') {
    return (
      <>
        <span className="w-14 h-14 rounded-full bg-accent/10 text-accent flex items-center justify-center mx-auto mb-6"><Check className="w-6 h-6" /></span>
        <h1 className="text-4xl sm:text-5xl text-graphite mb-5">Listo, ya no recibirás el boletín</h1>
        <p className="text-slate leading-relaxed mb-8">Si fue un error, puedes volver a suscribirte cuando quieras desde el blog.</p>
        <a href="/" className="pill-negra text-sm"><span>Volver al inicio</span><span className="disco" aria-hidden="true"><ArrowUpRight className="w-4 h-4" /></span></a>
      </>
    );
  }

  const confirmar = async () => {
    setEstado('enviando');
    try {
      const r = await fetch(`/next/boletin/baja?c=${encodeURIComponent(codigo)}`, { method: 'POST' });
      setEstado(r.ok ? 'ok' : 'error');
    } catch {
      setEstado('error');
    }
  };

  return (
    <>
      <h1 className="text-4xl sm:text-5xl text-graphite mb-5">¿Quieres dejar de recibir el boletín?</h1>
      <p className="text-slate leading-relaxed mb-8">Dejaremos de escribirte. No tienes que dar explicaciones.</p>
      <button onClick={confirmar} disabled={estado === 'enviando'} className="pill-negra text-sm">
        <span>{estado === 'enviando' ? 'Un momento' : 'Sí, darme de baja'}</span>
        <span className="disco" aria-hidden="true">{estado === 'enviando' ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowUpRight className="w-4 h-4" />}</span>
      </button>
      {estado === 'error' && <p role="alert" className="text-sm text-accent mt-4">No pudimos procesarlo. Inténtalo de nuevo en un momento.</p>}
    </>
  );
}
