import type { GlobalConfig } from 'payload'
import { revalidateTag } from 'next/cache'

import { adminOnly } from '@/access/adminOnly'
import { moverFechasLegales } from '@/bloques/sitio/legal/fechas'

const formato = (re: RegExp, ejemplo: string) => (v: unknown) =>
  !v || (typeof v === 'string' && re.test(v.trim())) ? true : `Revisa el formato. Ejemplo: ${ejemplo}`

/**
 * Herramientas de medición externas: Google Analytics, Tag Manager, píxeles
 * de anuncios y Microsoft Clarity. Basta con pegar el código de cada una.
 *
 * Las estadísticas del panel no dependen de esto: funcionan siempre y sin cookies.
 */
export const Medicion: GlobalConfig = {
  slug: 'medicion',
  label: 'Analítica y píxeles',
  admin: {
    group: 'Configuración',
    description:
      'Conecta Google Analytics, Tag Manager, Meta, TikTok o Clarity pegando su código. Deja vacío lo que no uses. Las políticas de privacidad y de cookies se actualizan solas con lo que conectes aquí. Las estadísticas del inicio del panel funcionan sin nada de esto.',
  },
  access: { read: adminOnly, update: adminOnly },
  hooks: {
    afterChange: [
      async ({ doc, previousDoc, req }) => {
        if (!req.context?.disableRevalidate) revalidateTag('global_medicion', 'max')
        await moverFechasLegales(req, { medicion: previousDoc }, { medicion: doc })
        return doc
      },
    ],
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Herramientas',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'ga4',
                  type: 'text',
                  label: 'Google Analytics 4',
                  validate: formato(/^G-[A-Z0-9]{4,}$/i, 'G-AB12CD34EF'),
                  admin: { placeholder: 'G-XXXXXXXXXX', description: 'En Analytics: Administrar → Flujos de datos → ID de medición.' },
                },
                {
                  name: 'gtm',
                  type: 'text',
                  label: 'Google Tag Manager',
                  validate: formato(/^GTM-[A-Z0-9]{4,}$/i, 'GTM-AB12CD3'),
                  admin: { placeholder: 'GTM-XXXXXXX', description: 'Si usas Tag Manager, no hace falta poner también Analytics aquí.' },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'metaPixel',
                  type: 'text',
                  label: 'Píxel de Meta (Facebook e Instagram)',
                  validate: formato(/^\d{8,20}$/, '123456789012345'),
                  admin: { placeholder: '123456789012345', description: 'Solo los números del ID del píxel.' },
                },
                {
                  name: 'tiktokPixel',
                  type: 'text',
                  label: 'Píxel de TikTok',
                  validate: formato(/^[A-Z0-9]{10,30}$/i, 'C1A2B3C4D5E6F7G8H9I0'),
                  admin: { placeholder: 'CXXXXXXXXXXXXXXXXXXX' },
                },
              ],
            },
            {
              name: 'clarity',
              type: 'text',
              label: 'Microsoft Clarity (grabaciones y mapas de calor, gratis)',
              validate: formato(/^[a-z0-9]{6,20}$/i, 'abcd1234ef'),
              admin: { placeholder: 'abcd1234ef', width: '50%' },
            },
          ],
        },
        {
          label: 'Aviso de cookies',
          fields: [
            {
              name: 'pedirConsentimiento',
              type: 'checkbox',
              label: 'Pedir permiso antes de activar estas herramientas',
              defaultValue: true,
              admin: {
                description:
                  'Recomendado. Nada de lo de la pestaña anterior se carga hasta que la persona pulse "Aceptar". Si no conectaste ninguna herramienta, el aviso no aparece.',
              },
            },
            {
              name: 'textoAviso',
              type: 'textarea',
              label: 'Texto del aviso',
              defaultValue: 'Usamos cookies para medir las visitas y mejorar el sitio. Tú decides si las activamos.',
            },
            {
              type: 'row',
              fields: [
                { name: 'botonAceptar', type: 'text', label: 'Botón para aceptar', defaultValue: 'Aceptar' },
                { name: 'botonRechazar', type: 'text', label: 'Botón para rechazar', defaultValue: 'Solo las necesarias' },
                { name: 'enlacePolitica', type: 'text', label: 'Enlace a la política', defaultValue: '/cookies' },
              ],
            },
          ],
        },
        {
          label: 'Código a medida',
          description:
            'Para otras herramientas que te den un código para pegar. Solo pega código de servicios en los que confíes: se ejecuta en todas las páginas. También espera el permiso de cookies.',
          fields: [
            { name: 'codigoCabecera', type: 'code', label: 'Código dentro de <head>', admin: { language: 'html' } },
            { name: 'codigoFinal', type: 'code', label: 'Código al final de la página', admin: { language: 'html' } },
          ],
        },
      ],
    },
  ],
}
