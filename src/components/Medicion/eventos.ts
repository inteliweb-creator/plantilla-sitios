/** Aviso de conversión (mensaje enviado, suscripción, clic a WhatsApp) para las herramientas de medición conectadas. */
export type EventoMedicion = 'contacto' | 'suscripcion' | 'whatsapp'

export function medir(evento: EventoMedicion) {
  if (typeof window === 'undefined') return
  window.dispatchEvent(new CustomEvent('medicion', { detail: evento }))
}
