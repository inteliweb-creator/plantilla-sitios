import type { EmailAdapter } from 'payload'

import { enviarCorreo, hayCorreo } from '@/correo'

/**
 * Los correos propios de Payload (recuperar contraseña) salen por el mismo
 * Resend que el resto, con el remitente de "Correos y avisos". Sin
 * RESEND_API_KEY, Payload los deja escritos en la consola del servidor.
 */
export const adaptadorCorreo: EmailAdapter = ({ payload }) => ({
  name: 'resend',
  defaultFromAddress: 'hola@midominio.com',
  defaultFromName: 'Mi negocio',
  sendEmail: async (mensaje) => {
    const avisos: any = await payload.findGlobal({ slug: 'avisos', depth: 0 })
    const para = Array.isArray(mensaje.to) ? mensaje.to[0] : mensaje.to
    const r = await enviarCorreo({
      para: typeof para === 'string' ? para : String((para as any)?.address ?? ''),
      asunto: String(mensaje.subject ?? ''),
      html: String(mensaje.html ?? ''),
      remitente: avisos?.remitente || `Mi negocio <hola@midominio.com>`,
      tipo: 'panel',
    })
    if (!r.ok) payload.logger.error(`No se pudo enviar el correo "${mensaje.subject}": ${r.error}`)
    return r
  },
})

export const correoPayload = () => (hayCorreo() ? adaptadorCorreo : undefined)
