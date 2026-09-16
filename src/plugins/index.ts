import { formBuilderPlugin } from '@payloadcms/plugin-form-builder'
import { seoPlugin } from '@payloadcms/plugin-seo'
import { Plugin } from 'payload'
import { GenerateTitle, GenerateURL } from '@payloadcms/plugin-seo/types'
import { FixedToolbarFeature, HeadingFeature, lexicalEditor } from '@payloadcms/richtext-lexical'
import { ecommercePlugin } from '@payloadcms/plugin-ecommerce'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'

import { wompiAdapter } from '@/pagos/wompi'
import { COP } from '@/pagos/monedas'
import { paises } from '@/pagos/paises'
import { traduccionesPanel } from './traducciones'
import { modulosPlugin } from '@/modulos'

import { Page, Product } from '@/payload-types'
import { getServerSideURL } from '@/utilities/getURL'
import { ProductsCollection } from '@/collections/Products'
import { adminOrPublishedStatus } from '@/access/adminOrPublishedStatus'
import { adminOnlyFieldAccess } from '@/access/adminOnlyFieldAccess'
import { customerOnlyFieldAccess } from '@/access/customerOnlyFieldAccess'
import { isAdmin } from '@/access/isAdmin'
import { completarConIA } from '@/asistente/completar/plugin'
import { isDocumentOwner } from '@/access/isDocumentOwner'

const generateTitle: GenerateTitle<Product | Page> = ({ doc }) => {
  return doc?.title ? `${doc.title} | ${process.env.SITE_NAME || 'Tienda'}` : process.env.SITE_NAME || 'Tienda'
}

const generateURL: GenerateURL<Product | Page> = ({ doc }) => {
  const url = getServerSideURL()

  return doc?.slug ? `${url}/${doc.slug}` : url
}

export const plugins: Plugin[] = [
  seoPlugin({
    generateTitle,
    generateURL,
  }),
  formBuilderPlugin({
    fields: {
      payment: false,
    },
    formSubmissionOverrides: {
      labels: { singular: 'Respuesta', plural: 'Respuestas de formularios a medida' },
      access: {
        delete: isAdmin,
        read: isAdmin,
        update: isAdmin,
      },
      admin: {
        group: 'Avanzado',
      },
    },
    formOverrides: {
      labels: { singular: 'Formulario a medida', plural: 'Formularios a medida' },
      access: {
        delete: isAdmin,
        read: isAdmin,
        update: isAdmin,
        create: isAdmin,
      },
      admin: {
        group: 'Avanzado',
      },
      fields: ({ defaultFields }) => {
        return defaultFields.map((field) => {
          if ('name' in field && field.name === 'confirmationMessage') {
            return {
              ...field,
              editor: lexicalEditor({
                features: ({ rootFeatures }) => {
                  return [
                    ...rootFeatures,
                    FixedToolbarFeature(),
                    HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
                  ]
                },
              }),
            }
          }
          return field
        })
      },
    },
  }),
  ecommercePlugin({
    access: {
      adminOnlyFieldAccess,
      adminOrPublishedStatus,
      customerOnlyFieldAccess,
      isAdmin,
      isDocumentOwner,
    },
    customers: {
      slug: 'users',
    },
    addresses: {
      supportedCountries: paises,
    },
    currencies: {
      supportedCurrencies: [COP],
      defaultCurrency: 'COP',
    },
    orders: {
      ordersCollectionOverride: ({ defaultCollection }) => ({
        ...defaultCollection,
        fields: [
          // Estados pensados para una tienda en Colombia: el pedido se crea
          // cuando el pago ya está aprobado, así que empieza en "Pagado".
          ...defaultCollection.fields.map((field) =>
            'name' in field && field.name === 'status' && field.type === 'select'
              ? {
                  ...field,
                  defaultValue: 'processing',
                  options: [
                    { label: 'Pagado · por despachar', value: 'processing' },
                    { label: 'Despachado', value: 'shipped' },
                    { label: 'Entregado', value: 'completed' },
                    { label: 'Cancelado', value: 'cancelled' },
                    { label: 'Reembolsado', value: 'refunded' },
                  ],
                }
              : field,
          ),
          {
            name: 'accessToken',
            type: 'text',
            unique: true,
            index: true,
            admin: {
              position: 'sidebar',
              readOnly: true,
            },
            hooks: {
              beforeValidate: [
                ({ value, operation }) => {
                  if (operation === 'create' || !value) {
                    return crypto.randomUUID()
                  }
                  return value
                },
              ],
            },
          },
        ],
      }),
    },
    payments: {
      paymentMethods: [
        wompiAdapter({
          publicKey: process.env.NEXT_PUBLIC_WOMPI_PUBLIC_KEY || '',
          integritySecret: process.env.WOMPI_INTEGRITY_SECRET || '',
          eventsSecret: process.env.WOMPI_EVENTS_SECRET || '',
        }),
      ],
    },
    products: {
      productsCollectionOverride: ProductsCollection,
    },
  }),
  // Imágenes en la nube (Vercel Blob). En Vercel el disco se borra con cada
  // publicación, así que allá es obligatorio: basta con crear el Blob en el
  // proyecto y Vercel añade BLOB_READ_WRITE_TOKEN solo. En local, sin esa
  // variable, las imágenes siguen en public/media.
  vercelBlobStorage({
    enabled: Boolean(process.env.BLOB_READ_WRITE_TOKEN),
    collections: { media: true },
    token: process.env.BLOB_READ_WRITE_TOKEN,
    // La subida va directo del navegador a Blob: Vercel no acepta peticiones de más de 4,5 MB.
    clientUploads: true,
  }),
  // Al final: actúan también sobre lo que añaden los plugins de arriba.
  modulosPlugin,
  traduccionesPanel,
  // Botón "✨ Completar con el asistente" en los campos de texto donde ayuda redactar.
  completarConIA,
]
