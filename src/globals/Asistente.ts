import type { GlobalConfig } from 'payload'
import { revalidateTag } from 'next/cache'

import { adminOnly } from '@/access/adminOnly'
import { cifrar } from '@/asistente/cifrado'
import { AYUDA_MODELOS, PROVEEDORES } from '@/asistente/proveedores'
import { moverFechasLegales } from '@/bloques/sitio/legal/fechas'

const hoy = () => new Date().toLocaleDateString('es-CO', { timeZone: 'America/Bogota' })

/**
 * Configuración del asistente de inteligencia artificial del panel.
 *
 * Las claves se pegan aquí (no hace falta ir a Vercel), en una lista de
 * conexiones por orden de prioridad: si la primera falla (sin saldo, saturada,
 * clave vencida), el asistente usa la siguiente. Cada clave se guarda cifrada
 * y nunca se vuelve a mostrar: solo sus últimos 4 caracteres.
 */
export const Asistente: GlobalConfig = {
  slug: 'asistente',
  label: 'Asistente IA',
  admin: {
    group: 'Configuración',
    description:
      'Agrega una o varias conexiones (proveedor + clave) en orden de prioridad y pruébalas. Si una falla, el asistente pasa sola a la siguiente. Se abre con la burbuja de la esquina inferior derecha. Todo lo que publica o envía pide tu aprobación.',
  },
  access: { read: adminOnly, update: adminOnly },
  hooks: {
    beforeChange: [
      async ({ data, req }) => {
        // Las claves guardadas se leen siempre de la base: nunca se acepta una "cifrada" que llegue en la petición.
        const guardado: any = await req.payload
          .findGlobal({ slug: 'asistente', depth: 0, overrideAccess: true, showHiddenFields: true, req })
          .catch(() => null)
        const previas = new Map<string, any>((guardado?.conexiones || []).map((c: any) => [String(c.id), c]))

        if (!Array.isArray(data.conexiones)) {
          // Guardados internos (consumo del mes, modelo elegido solo): la lista se conserva tal cual.
          data.conexiones = guardado?.conexiones || []
          return data
        }

        data.conexiones = data.conexiones.map((fila: any) => {
          const previa = previas.get(String(fila?.id))
          const nueva = typeof fila?.claveNueva === 'string' ? fila.claveNueva.trim() : ''
          const resultado = { ...fila, claveNueva: undefined, borrarClave: false }
          if (nueva) {
            resultado.claveCifrada = cifrar(nueva)
            resultado.claveResumen = `Guardada: ••••${nueva.slice(-4)} · ${hoy()}`
            resultado.ultimoError = null
          } else if (fila?.borrarClave) {
            resultado.claveCifrada = null
            resultado.claveResumen = null
          } else {
            resultado.claveCifrada = previa?.claveCifrada ?? null
            resultado.claveResumen = previa?.claveResumen ?? null
          }
          if (!('ultimoError' in (fila || {}))) resultado.ultimoError = previa?.ultimoError ?? null
          return resultado
        })
        return data
      },
    ],
    afterChange: [
      async ({ doc, previousDoc, req }) => {
        if (req.context?.soloConsumo) return doc
        if (!req.context?.disableRevalidate) revalidateTag('global_asistente', 'max')
        await moverFechasLegales(req, { asistente: previousDoc }, { asistente: doc })
        return doc
      },
    ],
  },
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'activo', type: 'checkbox', label: 'Asistente encendido', defaultValue: false },
        {
          name: 'nombre',
          type: 'text',
          label: 'Nombre del asistente',
          defaultValue: 'Asistente',
          admin: { description: 'Así aparece en la burbuja del panel.' },
        },
      ],
    },
    {
      name: 'conexiones',
      type: 'array',
      label: 'Conexiones (en orden de prioridad)',
      labels: { singular: 'Conexión', plural: 'Conexiones' },
      admin: {
        initCollapsed: false,
        description:
          'La primera es la principal; las demás son de respaldo. Arrastra para cambiar el orden. Si una se queda sin saldo, está saturada o su clave deja de servir, el asistente usa la siguiente sin que tengas que hacer nada.',
        components: { RowLabel: '@/asistente/admin/EtiquetaConexion#EtiquetaConexion' },
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'proveedor',
              type: 'select',
              label: 'Proveedor',
              required: true,
              defaultValue: 'deepseek',
              options: Object.entries(PROVEEDORES).map(([value, p]) => ({ value, label: p.nombre })),
            },
            {
              name: 'modelo',
              type: 'text',
              label: 'Modelo',
              admin: { description: `Vacío = el recomendado. ${AYUDA_MODELOS}` },
            },
            { name: 'activa', type: 'checkbox', label: 'Usar esta conexión', defaultValue: true },
          ],
        },
        {
          name: 'urlBase',
          type: 'text',
          label: 'Dirección del servicio',
          admin: {
            condition: (_, fila) => fila?.proveedor === 'personalizado',
            placeholder: 'https://…/v1',
            description: 'Solo para proveedores compatibles con el formato de OpenAI.',
          },
        },
        {
          name: 'claveNueva',
          type: 'text',
          label: 'Pegar clave (API key)',
          virtual: true,
          admin: {
            components: { Field: '@/asistente/admin/CampoClaveApi#CampoClaveApi' },
            description: 'Se guarda cifrada. Déjalo vacío para conservar la que ya está.',
          },
        },
        { name: 'claveResumen', type: 'text', label: 'Clave actual', admin: { readOnly: true, condition: (_, fila) => Boolean(fila?.claveResumen) } },
        { name: 'borrarClave', type: 'checkbox', label: 'Borrar esta clave', virtual: true, admin: { condition: (_, fila) => Boolean(fila?.claveResumen) } },
        { name: 'claveCifrada', type: 'text', hidden: true },
        { name: 'ultimoError', type: 'text', label: 'Último problema', admin: { readOnly: true, condition: (_, fila) => Boolean(fila?.ultimoError) } },
        { name: 'probar', type: 'ui', admin: { components: { Field: '@/asistente/admin/ProbarConexion#ProbarConexion' } } },
      ],
    },
    {
      name: 'instrucciones',
      type: 'textarea',
      label: 'Conocimiento de la marca y cómo debe escribir',
      admin: {
        rows: 18,
        description:
          'Todo lo que el asistente debe saber del negocio: quiénes son, servicios, qué los hace distintos, a quién le hablan, tono, palabras que prefieren o evitan y llamados a la acción. Lo tiene presente en cada respuesta.',
      },
    },
    {
      type: 'collapsible',
      label: 'Funciones extra',
      admin: { initCollapsed: false },
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'investigar', type: 'checkbox', label: 'Investigar en Google en tiempo real', defaultValue: true },
            { name: 'videos', type: 'checkbox', label: 'Ver videos de YouTube', defaultValue: true },
            { name: 'imagenes', type: 'checkbox', label: 'Crear imágenes', defaultValue: true },
          ],
        },
        {
          name: 'modeloImagen',
          type: 'text',
          label: 'Modelo de imágenes',
          admin: {
            description:
              'Investigar y ver videos necesitan una conexión de Google Gemini en la lista (aunque la principal sea otra, como DeepSeek). Crear imágenes necesita Gemini u OpenAI y puede requerir activar la facturación. Vacío = el que tenga disponible tu cuenta.',
          },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'limiteTokensMes',
          type: 'number',
          label: 'Límite de uso al mes (tokens)',
          defaultValue: 2000000,
          min: 0,
          admin: { description: 'Protege tu gasto: al llegar al límite, el asistente se pausa hasta el mes siguiente. 0 = sin límite.' },
        },
        { name: 'tokensMes', type: 'number', label: 'Usado este mes (tokens)', defaultValue: 0, admin: { readOnly: true } },
        { name: 'usoMes', type: 'text', label: 'Mes', admin: { readOnly: true } },
      ],
    },
  ],
}
