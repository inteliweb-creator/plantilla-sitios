'use client';

import { useState } from 'react';
import { ArrowUpRight, CheckCircle2, AlertTriangle, Loader2, MessageCircle, Phone, Mail, MapPin, Clock } from 'lucide-react';
import { enlaceWhatsapp, textos } from '../lib/negocio.js';
import { medir } from '@/components/Medicion/eventos';

/**
 * Sección de contacto: formulario a la
 * izquierda y canales directos a la derecha.
 *
 * El formulario guarda el mensaje en el buzón del panel y avisa por correo.
 * Solo nombre y teléfono son obligatorios: cada campo obligatorio de más es
 * gente que abandona a mitad.
 */
function Formulario({ datos, negocio }) {
  const opciones = textos(datos.opciones);
  const [estado, setEstado] = useState('escribiendo');
  const [error, setError] = useState('');
  const [f, setF] = useState({ nombre: '', correo: '', telefono: '', necesita: opciones[0] || '', mensaje: '', sitioWeb: '' });
  const cambiar = (campo) => (e) => setF({ ...f, [campo]: e.target.value });
  const wa = enlaceWhatsapp(negocio, datos.mensajeWhatsapp);

  const enviar = async (e) => {
    e.preventDefault();
    setEstado('enviando');
    setError('');
    try {
      const res = await fetch('/next/contacto', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...f, origen: location.pathname }),
      });
      const json = await res.json().catch(() => ({}));
      if (res.ok && json.ok) {
        medir('contacto');
        return setEstado('enviado');
      }
      setError(json.error || 'No pudimos enviar tu mensaje. Inténtalo otra vez.');
    } catch {
      setError('Parece que no hay conexión. Revísala e inténtalo de nuevo.');
    }
    setEstado('escribiendo');
  };

  const campo =
    'w-full px-4 py-3.5 rounded-xl bg-surface-2 border border-line text-graphite text-sm placeholder:text-slate/60 focus:border-accent focus:outline-none transition-colors';

  if (estado === 'enviado') {
    return (
      <div className="rounded-[var(--radius-card)] border border-accent/40 bg-surface p-10 text-center">
        <CheckCircle2 className="w-12 h-12 text-accent mx-auto mb-5" />
        <h3 className="text-2xl text-graphite mb-3">{datos.exitoTitulo || 'Recibimos tu mensaje'}</h3>
        <p className="text-sm text-slate leading-relaxed">
          {datos.exitoTexto || 'Te respondemos muy pronto.'}{' '}
          {negocio?.whatsapp && (
            <>Si es urgente, <a href={wa} target="_blank" rel="noreferrer" className="text-accent underline">escríbenos por WhatsApp</a>.</>
          )}
        </p>
      </div>
    );
  }

  const enviando = estado === 'enviando';

  return (
    <form onSubmit={enviar} className="space-y-4" noValidate>
      <input type="text" name="sitioWeb" tabIndex={-1} autoComplete="off" aria-hidden="true" value={f.sitioWeb} onChange={cambiar('sitioWeb')} className="absolute w-px h-px -left-[9999px] opacity-0" />

      <div>
        <label htmlFor="f-nombre" className="block text-sm text-slate mb-2">Tu nombre <span className="text-accent">*</span></label>
        <input id="f-nombre" type="text" required autoComplete="name" value={f.nombre} onChange={cambiar('nombre')} className={campo} />
      </div>
      <div>
        <label htmlFor="f-correo" className="block text-sm text-slate mb-2">Tu correo electrónico <span className="text-slate/60">(opcional)</span></label>
        <input id="f-correo" type="email" autoComplete="email" placeholder="nombre@correo.com" value={f.correo} onChange={cambiar('correo')} className={campo} />
      </div>
      <div>
        <label htmlFor="f-tel" className="block text-sm text-slate mb-2">Tu teléfono o WhatsApp <span className="text-accent">*</span></label>
        <input id="f-tel" type="tel" required autoComplete="tel" placeholder="+57 300 000 0000" value={f.telefono} onChange={cambiar('telefono')} className={campo} />
      </div>
      {opciones.length > 0 && (
        <div>
          <label htmlFor="f-necesita" className="block text-sm text-slate mb-2">{datos.preguntaOpciones || 'Qué necesitas'}</label>
          <select id="f-necesita" value={f.necesita} onChange={cambiar('necesita')} className={campo}>
            {opciones.map((o) => <option key={o}>{o}</option>)}
          </select>
        </div>
      )}
      <div>
        <label htmlFor="f-msg" className="block text-sm text-slate mb-2">{datos.preguntaMensaje || 'Cuéntanos un poco'} <span className="text-slate/60">(opcional)</span></label>
        <textarea id="f-msg" rows={4} placeholder={datos.pistaMensaje || ''} value={f.mensaje} onChange={cambiar('mensaje')} className={`${campo} resize-none`} />
      </div>

      {error && (
        <div role="alert" className="flex items-start gap-2.5 rounded-xl border border-accent/40 bg-accent/10 px-4 py-3">
          <AlertTriangle className="w-4 h-4 text-accent shrink-0 mt-0.5" />
          <p className="text-sm text-graphite">{error}</p>
        </div>
      )}

      <button type="submit" disabled={enviando} className="pill-negra w-full text-sm">
        <span>{enviando ? 'Enviando…' : datos.boton || 'Enviar mensaje'}</span>
        <span className="disco" aria-hidden="true">{enviando ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowUpRight className="w-4 h-4" />}</span>
      </button>

      {datos.notaLegal && (
        <p className="text-xs text-slate/70 text-center leading-relaxed">
          {datos.notaLegal}{' '}
          <a href="/privacidad" className="text-accent underline">Así cuidamos tus datos</a>.
        </p>
      )}
    </form>
  );
}

export default function Contacto({ datos, negocio }) {
  const tel = String(negocio?.telefono || '').replace(/[^\d+]/g, '');
  const notas = datos.canales || {};
  const canales = [
    negocio?.whatsapp && { icono: MessageCircle, etiqueta: 'WhatsApp', valor: negocio.telefono || 'Escríbenos', href: enlaceWhatsapp(negocio, datos.mensajeWhatsapp), nota: notas.whatsapp, externo: true },
    negocio?.telefono && { icono: Phone, etiqueta: 'Teléfono', valor: negocio.telefono, href: `tel:${tel}`, nota: notas.telefono },
    negocio?.correo && { icono: Mail, etiqueta: 'Correo', valor: negocio.correo, href: `mailto:${negocio.correo}`, nota: notas.correo },
  ].filter(Boolean);
  const ubicacion = [negocio?.direccion, negocio?.ciudad, negocio?.departamento].filter(Boolean).join(', ');

  return (
    <section id="contacto" className="py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 pl-rail">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
          <div className="lg:col-span-7">
            {datos.formularioTitulo && <h2 className="text-3xl sm:text-4xl text-graphite mb-8">{datos.formularioTitulo}</h2>}
            <Formulario datos={datos} negocio={negocio} />
          </div>

          <div className="lg:col-span-5 space-y-4">
            {datos.directoTitulo && <h2 className="text-3xl sm:text-4xl text-graphite mb-8">{datos.directoTitulo}</h2>}

            {canales.map(({ icono: Icono, ...c }) => (
              <a
                key={c.etiqueta}
                href={c.href}
                {...(c.externo ? { target: '_blank', rel: 'noreferrer' } : {})}
                className="group flex items-start gap-4 rounded-[var(--radius-card)] border border-line bg-surface p-6 transition-colors hover:border-accent/50"
              >
                <span className="w-11 h-11 rounded-full border border-line flex items-center justify-center shrink-0 transition-colors group-hover:bg-accent">
                  <Icono className="w-5 h-5 text-accent transition-colors group-hover:text-white" />
                </span>
                <span className="min-w-0">
                  <span className="block text-xs text-slate mb-0.5">{c.etiqueta}</span>
                  <span className="block text-xl text-graphite mb-1 break-words">{c.valor}</span>
                  {c.nota && <span className="block text-sm text-slate leading-relaxed">{c.nota}</span>}
                </span>
              </a>
            ))}

            {(ubicacion || negocio?.horario) && (
              <div className="rounded-[var(--radius-card)] bg-surface p-6 space-y-4">
                {ubicacion && (
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                    <div>
                      <span className="block text-sm font-semibold text-graphite">{datos.ubicacionTitulo || 'Dónde estamos'}</span>
                      <span className="block text-sm text-slate">{ubicacion}</span>
                      {datos.ubicacionNota && <span className="block text-xs text-slate/80 mt-1">{datos.ubicacionNota}</span>}
                    </div>
                  </div>
                )}
                {negocio?.horario && (
                  <div className={`flex items-start gap-3 ${ubicacion ? 'pt-4 border-t border-line' : ''}`}>
                    <Clock className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                    <div>
                      <span className="block text-sm font-semibold text-graphite">{datos.horarioTitulo || 'Horario de atención'}</span>
                      <span className="block text-sm text-slate">{negocio.horario}</span>
                    </div>
                  </div>
                )}
                {datos.enlaceFicha && (
                  <a href={datos.enlaceFicha} target="_blank" rel="noreferrer" className="btn-ghost-ink w-full px-6 py-3.5 text-sm">
                    {datos.botonFicha || 'Ver nuestra ficha en Google'}
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
