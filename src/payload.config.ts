import { sqliteAdapter } from '@payloadcms/db-sqlite'
import {
  BoldFeature,
  EXPERIMENTAL_TableFeature,
  IndentFeature,
  ItalicFeature,
  LinkFeature,
  OrderedListFeature,
  UnderlineFeature,
  UnorderedListFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { es } from '@payloadcms/translations/languages/es'
import { fileURLToPath } from 'url'

import { Categories } from '@/collections/Categories'
import { Casos } from '@/collections/Casos'
import { Preguntas } from '@/collections/Preguntas'
import { Media } from '@/collections/Media'
import { Pages } from '@/collections/Pages'
import { Legales } from '@/collections/Legales'
import { Users } from '@/collections/Users'
import { Navegacion } from '@/globals/Navegacion'
import { Avisos } from '@/globals/Avisos'
import { Mensajes } from '@/collections/Mensajes'
import { Articulos } from '@/collections/Articulos'
import { Suscriptores } from '@/collections/Suscriptores'
import { Boletines } from '@/collections/Boletines'
import { Blog } from '@/globals/Blog'
import { TiendaTextos } from '@/globals/TiendaTextos'
import { Modulos } from '@/globals/Modulos'
import { Medicion } from '@/globals/Medicion'
import { Visitas } from '@/collections/Visitas'
import { Comentarios } from '@/collections/Comentarios'
import { RegistroCorreos } from '@/collections/RegistroCorreos'
import { Recursos } from '@/collections/Recursos'
import { SolicitudesRecurso } from '@/collections/SolicitudesRecurso'
import { Ventanas } from '@/globals/Ventanas'
import { Tienda } from '@/globals/Tienda'
import { plugins } from './plugins'
import { correoPayload } from '@/correo/adaptador'
import sharp from 'sharp'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    // Tema claro fijo: el logo del panel es oscuro y se perdería en modo oscuro.
    theme: 'light',
    meta: {
      titleSuffix: '· Panel',
      icons: [
        { rel: 'icon', type: 'image/png', url: '/favicon.png' },
        { rel: 'apple-touch-icon', url: '/apple-touch-icon.png' },
      ],
      openGraph: { images: [{ url: '/og-sitio.jpg' }], siteName: 'Panel' },
    },
    components: {
      views: {
        revision: {
          Component: '@/components/Revision#default',
          path: '/revision',
        },
      },
      // Logo e ícono del panel: los del negocio, o unos neutros si aún no hay.
      graphics: {
        Logo: '@/components/MarcaPanel#LogoPanel',
        Icon: '@/components/MarcaPanel#IconoPanel',
      },
      // The `BeforeLogin` component renders a message that you see while logging into your admin panel.
      // Feel free to delete this at any time. Simply remove the line below and the import `BeforeLogin` statement on line 15.
      beforeLogin: ['@/components/BeforeLogin#BeforeLogin'],
      // The `BeforeDashboard` component renders the 'welcome' block that you see after logging into your admin panel.
      // Feel free to delete this at any time. Simply remove the line below and the import `BeforeDashboard` statement on line 15.
      beforeDashboard: ['@/components/BeforeDashboard#BeforeDashboard', '@/components/Estadisticas#Estadisticas'],
    },
    user: Users.slug,
  },
  collections: [Pages, Articulos, Comentarios, Recursos, SolicitudesRecurso, Casos, Preguntas, Legales, Mensajes, Suscriptores, Boletines, Media, Categories, Users, Visitas, RegistroCorreos],
  // En local, un archivo SQLite; en producción, Turso (misma base, en la nube).
  // Acepta los nombres que crea la integración de Turso en Vercel.
  db: sqliteAdapter({
    client: {
      url: process.env.DATABASE_URL || process.env.TURSO_DATABASE_URL || '',
      authToken: process.env.DATABASE_AUTH_TOKEN || process.env.TURSO_AUTH_TOKEN || undefined,
    },
    migrationDir: path.resolve(dirname, 'migrations'),
  }),
  editor: lexicalEditor({
    features: () => {
      return [
        UnderlineFeature(),
        BoldFeature(),
        ItalicFeature(),
        OrderedListFeature(),
        UnorderedListFeature(),
        LinkFeature({
          enabledCollections: ['pages'],
          fields: ({ defaultFields }) => {
            const defaultFieldsWithoutUrl = defaultFields.filter((field) => {
              if ('name' in field && field.name === 'url') return false
              return true
            })

            return [
              ...defaultFieldsWithoutUrl,
              {
                name: 'url',
                type: 'text',
                admin: {
                  condition: ({ linkType }) => linkType !== 'internal',
                },
                label: ({ t }) => t('fields:enterURL'),
                required: true,
              },
            ]
          },
        }),
        IndentFeature(),
        EXPERIMENTAL_TableFeature(),
      ]
    },
  }),
  email: correoPayload(),
  endpoints: [],
  globals: [Tienda, Navegacion, Avisos, Medicion, Ventanas, Modulos, Blog, TiendaTextos],
  // Panel en español para el cliente.
  i18n: {
    supportedLanguages: { es },
    fallbackLanguage: 'es',
  },
  plugins,
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  // Optimiza las imágenes al subirlas (tamaños y formato WebP).
  sharp,
  upload: {
    limits: { fileSize: 15 * 1024 * 1024 },
  },
})
