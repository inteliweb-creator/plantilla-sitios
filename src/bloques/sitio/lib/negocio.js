/**
 * Utilidades comunes de los bloques a partir de "Datos del negocio".
 * Todos los bloques reciben `negocio` (el global `tienda`) desde RenderBlocks.
 */

/** Enlace de WhatsApp con el mensaje ya escrito. Sin número, lleva a contacto. */
export function enlaceWhatsapp(negocio, mensaje) {
  const numero = String(negocio?.whatsapp ?? '').replace(/\D/g, '');
  if (!numero) return '/contacto';
  const texto = mensaje || negocio?.mensajeWhatsapp || '';
  return `https://wa.me/${numero}${texto ? `?text=${encodeURIComponent(texto)}` : ''}`;
}

/** Los arrays de Payload llegan como [{ texto }]; los componentes usan strings. */
export const textos = (lista) => (Array.isArray(lista) ? lista.map((x) => (typeof x === 'string' ? x : x?.texto)).filter(Boolean) : []);
