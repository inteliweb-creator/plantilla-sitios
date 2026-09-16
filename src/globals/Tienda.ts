import type { GlobalConfig } from 'payload'
import { revalidateTag } from 'next/cache'

import { adminOnly } from '@/access/adminOnly'

/**
 * Datos de la tienda: lo que cambia de un cliente a otro y se usa en todo el
 * sitio (botón de WhatsApp, pie de página, correos, datos estructurados).
 * Es lo primero que se llena al montar la plantilla para un cliente nuevo.
 */
export const Tienda: GlobalConfig = {
  slug: 'tienda',
  label: 'Datos del negocio',
  admin: {
    group: 'Configuración',
    description: 'Nombre, contacto y redes del negocio. Se usan en todo el sitio.',
  },
  access: {
    read: () => true,
    update: adminOnly,
  },
  hooks: {
    afterChange: [
      ({ doc, req }) => {
        if (!req.context?.disableRevalidate) revalidateTag('global_tienda', 'max')
        return doc
      },
    ],
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Negocio',
          fields: [
            { name: 'nombre', type: 'text', label: 'Nombre del negocio', required: true, defaultValue: 'Mi tienda' },
            { name: 'eslogan', type: 'text', label: 'Frase corta' },
            {
              type: 'row',
              fields: [
                {
                  name: 'colorAcento',
                  type: 'text',
                  label: 'Color de acento de la marca',
                  defaultValue: '#9A4A1F',
                  admin: { description: 'En formato #RRGGBB. Se usa en los correos (etiquetas, enlaces, detalles).' },
                  validate: (v: unknown) => !v || /^#[0-9a-f]{6}$/i.test(String(v)) || 'Usa el formato #RRGGBB, por ejemplo #2F5BEA',
                },
                {
                  name: 'colorOscuro',
                  type: 'text',
                  label: 'Color oscuro de la marca',
                  defaultValue: '#0E0F11',
                  admin: { description: 'Banda superior, títulos y botones de los correos.' },
                  validate: (v: unknown) => !v || /^#[0-9a-f]{6}$/i.test(String(v)) || 'Usa el formato #RRGGBB, por ejemplo #111827',
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'logo',
                  type: 'upload',
                  relationTo: 'media',
                  label: 'Logo para fondos claros',
                  admin: { description: 'El logo completo en oscuro. Se usa en el menú, el pie, el panel y los correos. PNG sin fondo.' },
                },
                {
                  name: 'logoBlanco',
                  type: 'upload',
                  relationTo: 'media',
                  label: 'Logo para fondos oscuros',
                  admin: { description: 'El mismo logo en blanco.' },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'isotipo',
                  type: 'upload',
                  relationTo: 'media',
                  label: 'Ícono (solo el símbolo)',
                  admin: { description: 'Sin el nombre. Se usa donde hay poco espacio, como el panel.' },
                },
                {
                  name: 'favicon',
                  type: 'upload',
                  relationTo: 'media',
                  label: 'Ícono de la pestaña del navegador (favicon)',
                  admin: { description: 'Cuadrado, PNG de al menos 512 × 512.' },
                },
              ],
            },
          ],
        },
        {
          label: 'Contacto',
          fields: [
            {
              name: 'whatsapp',
              type: 'text',
              label: 'WhatsApp',
              admin: { description: 'Número con indicativo, sin espacios. Ej: 573001234567' },
              validate: (v: unknown) =>
                !v || /^\d{10,15}$/.test(String(v)) || 'Escribe solo números, con el indicativo (ej. 573001234567).',
            },
            {
              name: 'mensajeWhatsapp',
              type: 'text',
              label: 'Mensaje que se escribe al abrir WhatsApp',
              defaultValue: 'Hola, vengo del sitio web y quiero más información.',
            },
            { name: 'mostrarBotonWhatsapp', type: 'checkbox', label: 'Mostrar botón flotante de WhatsApp', defaultValue: true },
            { name: 'correo', type: 'email', label: 'Correo de contacto' },
            { name: 'telefono', type: 'text', label: 'Teléfono' },
          ],
        },
        {
          label: 'Ubicación',
          fields: [
            { name: 'direccion', type: 'text', label: 'Dirección' },
            { name: 'ciudad', type: 'text', label: 'Ciudad', defaultValue: 'Bogotá' },
            { name: 'departamento', type: 'text', label: 'Departamento' },
            { name: 'horario', type: 'text', label: 'Horario de atención', admin: { description: 'Ej: Lun a Sáb · 9:00 a.m. - 6:00 p.m.' } },
          ],
        },
        {
          label: 'Redes sociales',
          fields: [
            { name: 'instagram', type: 'text', label: 'Instagram (enlace)' },
            { name: 'facebook', type: 'text', label: 'Facebook (enlace)' },
            { name: 'tiktok', type: 'text', label: 'TikTok (enlace)' },
            { name: 'linkedin', type: 'text', label: 'LinkedIn (enlace)' },
            { name: 'youtube', type: 'text', label: 'YouTube (enlace)' },
            { name: 'fichaGoogle', type: 'text', label: 'Ficha de Google (enlace a Google Maps)', admin: { description: 'El enlace de tu perfil de empresa en Google. Ayuda a que Google una el sitio con tu ficha.' } },
          ],
        },
        {
          label: 'Para Google',
          description:
            'Estos datos no se ven en la página: se entregan a Google en el formato que entiende, para que muestre bien tu negocio (dirección, horario, teléfono) en búsquedas y en Maps. Usa los mismos datos que tu ficha de Google.',
          fields: [
            {
              name: 'tipoNegocio',
              type: 'select',
              label: 'Tipo de negocio',
              defaultValue: 'LocalBusiness',
              options: [
                { label: 'Negocio local (general)', value: 'LocalBusiness' },
                { label: 'Servicios profesionales (agencia, consultoría, diseño)', value: 'ProfessionalService' },
                { label: 'Tienda física', value: 'Store' },
                { label: 'Tienda de ropa', value: 'ClothingStore' },
                { label: 'Restaurante', value: 'Restaurant' },
                { label: 'Cafetería', value: 'CafeOrCoffeeShop' },
                { label: 'Panadería o pastelería', value: 'Bakery' },
                { label: 'Peluquería o salón de belleza', value: 'BeautySalon' },
                { label: 'Spa', value: 'DaySpa' },
                { label: 'Gimnasio', value: 'ExerciseGym' },
                { label: 'Consultorio médico', value: 'MedicalClinic' },
                { label: 'Odontología', value: 'Dentist' },
                { label: 'Veterinaria', value: 'VeterinaryCare' },
                { label: 'Abogados', value: 'LegalService' },
                { label: 'Contabilidad', value: 'AccountingService' },
                { label: 'Inmobiliaria', value: 'RealEstateAgent' },
                { label: 'Taller de carros o motos', value: 'AutoRepair' },
                { label: 'Construcción y reformas', value: 'HomeAndConstructionBusiness' },
                { label: 'Hotel u hospedaje', value: 'LodgingBusiness' },
                { label: 'Agencia de viajes', value: 'TravelAgency' },
                { label: 'Educación (academia, colegio, cursos)', value: 'EducationalOrganization' },
                { label: 'Solo en línea (sin local que visitar)', value: 'Organization' },
              ],
            },
            {
              type: 'row',
              fields: [
                { name: 'codigoPostal', type: 'text', label: 'Código postal', admin: { width: '33%' } },
                { name: 'latitud', type: 'number', label: 'Latitud', admin: { width: '33%', step: 0.000001, description: 'En Google Maps: clic derecho sobre tu local → el primer número.' } },
                { name: 'longitud', type: 'number', label: 'Longitud', admin: { width: '33%', step: 0.000001, description: 'El segundo número.' } },
              ],
            },
            {
              name: 'horarios',
              type: 'array',
              label: 'Horario de atención (para Google)',
              labels: { singular: 'Franja', plural: 'Franjas' },
              admin: { description: 'Una franja por cada horario distinto. Ej: Lunes a viernes 8:00–18:00, y otra para sábado 9:00–13:00.' },
              fields: [
                {
                  name: 'dias',
                  type: 'select',
                  label: 'Días',
                  hasMany: true,
                  required: true,
                  options: [
                    { label: 'Lunes', value: 'Monday' },
                    { label: 'Martes', value: 'Tuesday' },
                    { label: 'Miércoles', value: 'Wednesday' },
                    { label: 'Jueves', value: 'Thursday' },
                    { label: 'Viernes', value: 'Friday' },
                    { label: 'Sábado', value: 'Saturday' },
                    { label: 'Domingo', value: 'Sunday' },
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    { name: 'abre', type: 'text', label: 'Abre', required: true, admin: { placeholder: '08:00' }, validate: (v: unknown) => /^([01]\d|2[0-3]):[0-5]\d$/.test(String(v || '')) || 'Usa el formato 24 horas: 08:00' },
                    { name: 'cierra', type: 'text', label: 'Cierra', required: true, admin: { placeholder: '18:00' }, validate: (v: unknown) => /^([01]\d|2[0-3]):[0-5]\d$|^24:00$/.test(String(v || '')) || 'Usa el formato 24 horas: 18:00' },
                  ],
                },
              ],
            },
            {
              name: 'zonasAtendidas',
              type: 'text',
              hasMany: true,
              label: 'Zonas que atiendes',
              admin: { description: 'Ciudades o municipios. Ej: Medellín, Envigado, Itagüí.' },
            },
            {
              name: 'rangoPrecios',
              type: 'select',
              label: 'Rango de precios',
              options: [
                { label: '$ (económico)', value: '$' },
                { label: '$$ (medio)', value: '$$' },
                { label: '$$$ (alto)', value: '$$$' },
              ],
            },
          ],
        },
      ],
    },
  ],
}
