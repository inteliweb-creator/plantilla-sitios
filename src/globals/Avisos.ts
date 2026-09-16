import type { GlobalConfig } from 'payload'

import { adminOnly } from '@/access/adminOnly'

/**
 * Correos y avisos. A diferencia de "Datos del negocio", esta pantalla NO es
 * pública: solo un administrador puede leerla. Por eso el correo donde llegan
 * los avisos vive aquí y nunca aparece en el sitio ni en la API abierta.
 *
 * La clave de Resend no se guarda en el panel: va en las variables del
 * servidor (RESEND_API_KEY), para que nunca quede en la base de datos.
 */
export const Avisos: GlobalConfig = {
  slug: 'avisos',
  label: 'Correos y avisos',
  admin: {
    group: 'Configuración',
    description: 'A dónde llegan los avisos de mensajes nuevos. Esta información es privada: no se muestra en el sitio.',
  },
  access: { read: adminOnly, update: adminOnly },
  fields: [
    {
      name: 'correoAvisos',
      type: 'email',
      label: 'Correo donde te llegan los avisos',
      admin: { description: 'Cuando alguien escriba en el formulario, te llega un correo aquí. No se muestra en el sitio.' },
    },
    {
      name: 'remitente',
      type: 'text',
      label: 'Quién envía los correos',
      defaultValue: 'Mi negocio <hola@midominio.com>',
      admin: { description: 'Nombre y correo de tu dominio verificado en Resend. Ej: Mi negocio <hola@minegocio.com>' },
    },
    {
      name: 'enviarConfirmacion',
      type: 'checkbox',
      label: 'Enviar confirmación a quien escribe (si deja su correo)',
      defaultValue: true,
    },
    {
      name: 'textoConfirmacion',
      type: 'textarea',
      label: 'Texto del correo de confirmación',
      defaultValue: 'Tu mensaje llegó bien. Te respondemos en menos de 24 horas hábiles. Si es urgente, responde a este correo o escríbenos por WhatsApp.',
      admin: { condition: (_, s) => Boolean(s?.enviarConfirmacion) },
    },
  ],
}
