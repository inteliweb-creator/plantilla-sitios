import type { Block, Field } from 'payload'

/**
 * Bloques del diseño base del sitio.
 *
 * Cada bloque es una sección completa de la portada: el cliente escribe sus
 * textos y elige el orden, pero no puede tocar márgenes, fuentes ni efectos.
 * Los nombres de los campos dicen dónde aparece cada texto, igual que en el
 * panel anterior ("Titular — parte en negro").
 */

const titular = (opciones: { lead?: boolean } = {}): Field[] => [
  { name: 'eyebrow', type: 'text', label: 'Etiqueta pequeña (arriba del titular)' },
  {
    type: 'row',
    fields: [
      { name: 'titulo', type: 'text', label: 'Titular — parte en negro', required: true },
      { name: 'enfasis', type: 'text', label: 'Titular — parte destacada en gris' },
    ],
  },
  ...(opciones.lead ? [{ name: 'lead', type: 'textarea', label: 'Entradilla' } as Field] : []),
]

const listaTextos = (name: string, label: string, textoLabel = 'Texto'): Field => ({
  name,
  type: 'array',
  label,
  labels: { singular: textoLabel, plural: label },
  fields: [{ name: 'texto', type: 'text', label: textoLabel, required: true }],
})

const mensajeWhatsapp: Field = {
  name: 'mensajeWhatsapp',
  type: 'text',
  label: 'Mensaje que se escribe al abrir WhatsApp',
  admin: { description: 'Si lo dejas vacío se usa el de "Datos del negocio".' },
}

export const BloquePortada: Block = {
  slug: 'portadaPaisaje',
  interfaceName: 'BloquePortada',
  labels: { singular: 'Portada con montañas', plural: 'Portadas' },
  imageAltText: 'Portada con la palabra de fondo y montañas en movimiento',
  fields: [
    { name: 'eyebrow', type: 'text', label: 'Texto sobre el titular', defaultValue: 'Tu ciudad' },
    {
      type: 'row',
      fields: [
        { name: 'h1', type: 'text', label: 'Titular — parte en negro', required: true },
        { name: 'h1Enfasis', type: 'text', label: 'Titular — parte destacada en gris' },
      ],
    },
    { name: 'textoClientes', type: 'text', label: 'Texto junto a las estrellas', admin: { description: 'Ej: 120 clientes satisfechos' } },
    {
      type: 'row',
      fields: [
        { name: 'ctaPrimarioTexto', type: 'text', label: 'Botón negro (abre WhatsApp)', defaultValue: 'Escríbenos' },
        { name: 'ctaSecundarioTexto', type: 'text', label: 'Botón gris', defaultValue: 'Ver más' },
        { name: 'enlaceSecundario', type: 'text', label: 'Enlace del botón gris', defaultValue: '#cotizador' },
      ],
    },
    mensajeWhatsapp,
    { name: 'palabraFondo', type: 'text', label: 'Palabra gigante detrás de las montañas', admin: { description: 'Vacío = nombre del negocio' } },
    { name: 'textoBajar', type: 'text', label: 'Invitación a bajar', defaultValue: 'Baja para ver más' },
    { name: 'botonCabecera', type: 'text', label: 'Botón de la barra superior', defaultValue: 'Hablemos' },
    {
      name: 'barra',
      type: 'array',
      label: 'Barra colgante de arriba (escritorio)',
      labels: { singular: 'Campo', plural: 'Campos' },
      maxRows: 3,
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'etiqueta', type: 'text', label: 'Etiqueta pequeña' },
            { name: 'valor', type: 'text', label: 'Valor' },
          ],
        },
      ],
    },
  ],
}

export const BloqueEscenas: Block = {
  slug: 'escenasProblema',
  interfaceName: 'BloqueEscenas',
  labels: { singular: 'Escenas del problema', plural: 'Escenas del problema' },
  fields: [
    ...titular(),
    { name: 'cuerpo', type: 'textarea', label: 'Entradilla' },
    {
      name: 'escenas',
      type: 'array',
      label: 'Escenas (se iluminan con el scroll)',
      labels: { singular: 'Escena', plural: 'Escenas' },
      minRows: 3,
      maxRows: 3,
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'nombre', type: 'text', label: 'Nombre de la cápsula', required: true },
            { name: 'etiqueta', type: 'text', label: 'Etiqueta de la escena' },
            {
              name: 'maqueta',
              type: 'select',
              label: 'Dibujo que acompaña',
              defaultValue: 'google',
              options: [
                { label: 'Búsqueda sin resultados', value: 'google' },
                { label: 'Mensajes de WhatsApp', value: 'whatsapp' },
                { label: 'Datos vacíos', value: 'confianza' },
              ],
            },
          ],
        },
        { name: 'titulo', type: 'text', label: 'Frase principal', required: true },
        { name: 'texto', type: 'textarea', label: 'Continuación de la frase' },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'cierre', type: 'text', label: 'Frase de cierre — parte en negro' },
        { name: 'cierreEnfasis', type: 'text', label: 'Frase de cierre — parte en gris' },
      ],
    },
  ],
}

export const BloqueSoluciones: Block = {
  slug: 'solucionesPestanas',
  interfaceName: 'BloqueSoluciones',
  labels: { singular: 'Soluciones en pestañas', plural: 'Soluciones en pestañas' },
  fields: [
    ...titular(),
    { name: 'pista', type: 'text', label: 'Pista bajo las pestañas', defaultValue: 'Toca o desliza para ver las {n} soluciones', admin: { description: '{n} se reemplaza por el número de soluciones.' } },
    {
      name: 'items',
      type: 'array',
      label: 'Soluciones',
      labels: { singular: 'Solución', plural: 'Soluciones' },
      minRows: 1,
      maxRows: 4,
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'etiqueta', type: 'text', label: 'Etiqueta (antes de " · " va el nombre de la pestaña)', required: true },
            {
              name: 'widget',
              type: 'select',
              label: 'Dibujo',
              defaultValue: 'google',
              options: [
                { label: 'Búsqueda en Google', value: 'google' },
                { label: 'Asistente / chat', value: 'bot' },
                { label: 'Sello de confianza', value: 'authority' },
              ],
            },
          ],
        },
        { name: 'titulo', type: 'text', label: 'Titular de la tarjeta', required: true },
        { name: 'desc', type: 'textarea', label: 'Texto' },
        listaTextos('puntos', 'Puntos', 'Punto'),
      ],
    },
  ],
}

export const BloqueServicios: Block = {
  slug: 'serviciosLista',
  interfaceName: 'BloqueServicios',
  labels: { singular: 'Servicios desplegables', plural: 'Servicios desplegables' },
  fields: [
    ...titular({ lead: true }),
    { name: 'nota', type: 'textarea', label: 'Nota bajo el titular (opcional)' },
    {
      type: 'row',
      fields: [
        { name: 'textoVer', type: 'text', label: 'Palabra del enlace a una página', defaultValue: 'Ver' },
        { name: 'textoCotizar', type: 'text', label: 'Palabra del enlace al cotizador', defaultValue: 'Cotizar' },
      ],
    },
    {
      name: 'items',
      type: 'array',
      label: 'Servicios',
      labels: { singular: 'Servicio', plural: 'Servicios' },
      minRows: 1,
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'titulo', type: 'text', label: 'Nombre del servicio', required: true },
            { name: 'lema', type: 'text', label: 'Lema corto' },
          ],
        },
        {
          type: 'row',
          fields: [
            { name: 'etiqueta', type: 'text', label: 'Palabra del enlace (ej. "corporativo")' },
            { name: 'enlace', type: 'text', label: 'Enlace (ej. /diseno-web o #cotizador)' },
          ],
        },
        { name: 'desc', type: 'textarea', label: 'Texto' },
        listaTextos('puntos', 'Puntos', 'Punto'),
      ],
    },
  ],
}

export const BloqueCasos: Block = {
  slug: 'casosCinta',
  interfaceName: 'BloqueCasos',
  labels: { singular: 'Casos de clientes', plural: 'Casos de clientes' },
  fields: [
    ...titular({ lead: true }),
    { name: 'textoVer', type: 'text', label: 'Texto del enlace de cada tarjeta', defaultValue: 'Ver el sitio' },
    {
      type: 'ui',
      name: 'aviso',
      admin: { components: { Field: '@/bloques/sitio/admin/AvisoCasos#AvisoCasos' } },
    },
  ],
}

export const BloqueFranja: Block = {
  slug: 'franjaLlamada',
  interfaceName: 'BloqueFranja',
  labels: { singular: 'Franja de llamada a la acción', plural: 'Franjas de llamada a la acción' },
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'frase', type: 'text', label: 'Frase — parte en negro', required: true },
        { name: 'enfasis', type: 'text', label: 'Frase — parte en gris' },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'boton', type: 'text', label: 'Botón negro (abre WhatsApp)', defaultValue: 'Escríbenos' },
        { name: 'botonSecundario', type: 'text', label: 'Botón gris', defaultValue: 'Ver más' },
        { name: 'enlaceSecundario', type: 'text', label: 'Enlace del botón gris', defaultValue: '#cotizador' },
      ],
    },
    mensajeWhatsapp,
  ],
}

export const BloqueProceso: Block = {
  slug: 'procesoPasos',
  interfaceName: 'BloqueProceso',
  labels: { singular: 'Pasos del proceso', plural: 'Pasos del proceso' },
  fields: [
    ...titular({ lead: true }),
    {
      name: 'items',
      type: 'array',
      label: 'Pasos',
      labels: { singular: 'Paso', plural: 'Pasos' },
      minRows: 1,
      fields: [
        { name: 'titulo', type: 'text', label: 'Título del paso', required: true },
        { name: 'desc', type: 'textarea', label: 'Texto' },
        { name: 'detalle', type: 'text', label: 'Pie del paso' },
      ],
    },
  ],
}

export const BloqueCotizador: Block = {
  slug: 'cotizadorWhatsapp',
  interfaceName: 'BloqueCotizador',
  labels: { singular: 'Cotizador por WhatsApp', plural: 'Cotizadores' },
  fields: [
    ...titular({ lead: true }),
    { name: 'preguntaTipo', type: 'text', label: 'Pregunta 1', defaultValue: '01 · Qué necesitas' },
    {
      name: 'tipos',
      type: 'array',
      label: 'Opciones de la pregunta 1',
      labels: { singular: 'Opción', plural: 'Opciones' },
      minRows: 1,
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'label', type: 'text', label: 'Nombre', required: true },
            { name: 'desc', type: 'text', label: 'Descripción' },
          ],
        },
      ],
    },
    { name: 'preguntaTamano', type: 'text', label: 'Pregunta 2', defaultValue: '02 · De qué tamaño' },
    listaTextos('tamanos', 'Opciones de la pregunta 2', 'Opción'),
    { name: 'preguntaExtras', type: 'text', label: 'Pregunta 3', defaultValue: '03 · Qué más te haría falta' },
    listaTextos('extras', 'Opciones de la pregunta 3', 'Opción'),
    { name: 'preguntaPlazo', type: 'text', label: 'Pregunta 4', defaultValue: '04 · Para cuándo' },
    listaTextos('plazos', 'Opciones de la pregunta 4', 'Opción'),
    {
      type: 'row',
      fields: [
        { name: 'preguntaNegocio', type: 'text', label: 'Campo del nombre del negocio', defaultValue: 'Opcional · Cómo se llama tu negocio' },
        { name: 'ejemploNegocio', type: 'text', label: 'Ejemplo dentro de ese campo' },
      ],
    },
    { name: 'tituloMensaje', type: 'text', label: 'Título de la vista previa', defaultValue: 'Tu mensaje, ya escrito' },
    { name: 'saludo', type: 'text', label: 'Primera línea del mensaje', defaultValue: 'Hola, quiero cotizar un proyecto.' },
    { name: 'boton', type: 'text', label: 'Botón de enviar', defaultValue: 'Enviarlo por WhatsApp' },
    { name: 'nota', type: 'textarea', label: 'Nota bajo el botón' },
  ],
}

export const BloqueConfianza: Block = {
  slug: 'confianzaDatos',
  interfaceName: 'BloqueConfianza',
  labels: { singular: 'Datos de confianza', plural: 'Datos de confianza' },
  fields: [
    ...titular({ lead: true }),
    { name: 'boton', type: 'text', label: 'Botón de WhatsApp', defaultValue: 'Escribir por WhatsApp' },
    mensajeWhatsapp,
    {
      name: 'datos',
      type: 'array',
      label: 'Datos verificables',
      labels: { singular: 'Dato', plural: 'Datos' },
      maxRows: 3,
      admin: { description: 'Si el valor queda vacío se usa el horario y la ciudad de "Datos del negocio".' },
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'etiqueta', type: 'text', label: 'Etiqueta' },
            { name: 'valor', type: 'text', label: 'Valor' },
          ],
        },
        { name: 'nota', type: 'textarea', label: 'Nota' },
      ],
    },
  ],
}

export const BloquePreguntas: Block = {
  slug: 'preguntasFrecuentes',
  interfaceName: 'BloquePreguntas',
  labels: { singular: 'Preguntas frecuentes', plural: 'Preguntas frecuentes' },
  fields: [
    ...titular(),
    {
      name: 'grupo',
      type: 'text',
      label: 'Grupo de preguntas a mostrar',
      admin: { description: 'Escribe el mismo grupo que pusiste en "Preguntas frecuentes". Vacío = todas.' },
    },
    {
      type: 'row',
      fields: [
        { name: 'otraDudaTitulo', type: 'text', label: 'Recuadro final — título', defaultValue: '¿Tienes otra duda?' },
        { name: 'otraDudaTexto', type: 'text', label: 'Recuadro final — texto', defaultValue: 'Escríbenos sin compromiso.' },
        { name: 'boton', type: 'text', label: 'Recuadro final — botón', defaultValue: 'Hacer una pregunta' },
      ],
    },
    mensajeWhatsapp,
  ],
}

export const BloqueCierre: Block = {
  slug: 'cierreNegro',
  interfaceName: 'BloqueCierre',
  labels: { singular: 'Cierre en negro', plural: 'Cierres en negro' },
  fields: [
    ...titular({ lead: true }),
    { name: 'boton', type: 'text', label: 'Botón', defaultValue: 'Escríbenos' },
    mensajeWhatsapp,
    listaTextos('garantias', 'Garantías del pie', 'Garantía'),
  ],
}

export const BloqueEncabezado: Block = {
  slug: 'encabezadoPagina',
  interfaceName: 'BloqueEncabezado',
  labels: { singular: 'Encabezado de página', plural: 'Encabezados de página' },
  fields: [
    ...titular({ lead: true }),
    {
      type: 'row',
      fields: [
        { name: 'destacado', type: 'textarea', label: 'Tarjeta a la derecha — frase (opcional)' },
        { name: 'destacadoMeta', type: 'text', label: 'Tarjeta — texto pequeño' },
      ],
    },
  ],
}

export const BloqueContacto: Block = {
  slug: 'contactoFormulario',
  interfaceName: 'BloqueContacto',
  labels: { singular: 'Formulario de contacto', plural: 'Formularios de contacto' },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Formulario',
          description: 'Los mensajes llegan a "Buzón de mensajes" y te avisamos al correo de "Correos y avisos".',
          fields: [
            { name: 'formularioTitulo', type: 'text', label: 'Título sobre el formulario', defaultValue: 'Escríbenos' },
            { name: 'preguntaOpciones', type: 'text', label: 'Pregunta de la lista desplegable', defaultValue: 'Qué necesitas' },
            listaTextos('opciones', 'Opciones de la lista', 'Opción'),
            {
              type: 'row',
              fields: [
                { name: 'preguntaMensaje', type: 'text', label: 'Pregunta del mensaje', defaultValue: 'Cuéntanos un poco' },
                { name: 'pistaMensaje', type: 'text', label: 'Texto de ejemplo dentro del mensaje' },
              ],
            },
            { name: 'boton', type: 'text', label: 'Botón de enviar', defaultValue: 'Enviar mensaje' },
            { name: 'notaLegal', type: 'textarea', label: 'Nota bajo el botón' },
            {
              type: 'row',
              fields: [
                { name: 'exitoTitulo', type: 'text', label: 'Al enviar — título', defaultValue: 'Recibimos tu mensaje' },
                { name: 'exitoTexto', type: 'text', label: 'Al enviar — texto', defaultValue: 'Te respondemos muy pronto.' },
              ],
            },
          ],
        },
        {
          label: 'Contacto directo',
          description: 'Teléfono, correo, dirección y horario salen de "Datos del negocio".',
          fields: [
            { name: 'directoTitulo', type: 'text', label: 'Título de la columna', defaultValue: 'O directo, sin formulario' },
            mensajeWhatsapp,
            {
              name: 'canales',
              type: 'group',
              label: 'Nota bajo cada canal',
              fields: [
                { name: 'whatsapp', type: 'text', label: 'WhatsApp' },
                { name: 'telefono', type: 'text', label: 'Teléfono' },
                { name: 'correo', type: 'text', label: 'Correo' },
              ],
            },
            {
              type: 'row',
              fields: [
                { name: 'ubicacionTitulo', type: 'text', label: 'Título de ubicación', defaultValue: 'Dónde estamos' },
                { name: 'ubicacionNota', type: 'text', label: 'Nota de ubicación' },
              ],
            },
            { name: 'horarioTitulo', type: 'text', label: 'Título del horario', defaultValue: 'Horario de atención' },
            {
              type: 'row',
              fields: [
                { name: 'botonFicha', type: 'text', label: 'Botón de la ficha de Google', defaultValue: 'Ver nuestra ficha en Google' },
                { name: 'enlaceFicha', type: 'text', label: 'Enlace de la ficha de Google (vacío = sin botón)' },
              ],
            },
          ],
        },
      ],
    },
  ],
}

export const BloquePanel: Block = {
  slug: 'panelControl',
  interfaceName: 'BloquePanel',
  labels: { singular: 'El control (maqueta del panel)', plural: 'El control (maqueta del panel)' },
  fields: [
    ...titular({ lead: true }),
    { name: 'direccion', type: 'text', label: 'Dirección que se ve en la barra del navegador', defaultValue: 'tunegocio.com/panel' },
    {
      name: 'pantallas',
      type: 'array',
      label: 'Pestañas de la maqueta',
      labels: { singular: 'Pestaña', plural: 'Pestañas' },
      maxRows: 4,
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'pestana', type: 'text', label: 'Texto de la pestaña', required: true },
            { name: 'titulo', type: 'text', label: 'Título dentro del panel' },
          ],
        },
        { name: 'resumen', type: 'text', label: 'Frase bajo el título' },
        {
          name: 'campos',
          type: 'array',
          label: 'Campos de ejemplo',
          labels: { singular: 'Campo', plural: 'Campos' },
          maxRows: 4,
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'etiqueta', type: 'text', label: 'Nombre del campo' },
                { name: 'valor', type: 'text', label: 'Valor de ejemplo' },
              ],
            },
          ],
        },
      ],
    },
    { name: 'pie', type: 'text', label: 'Nota pequeña bajo la maqueta' },
    { name: 'ahorroTitulo', type: 'text', label: 'Tarjeta — título' },
    listaTextos('ahorro', 'Tarjeta — beneficios', 'Beneficio'),
    { name: 'nota', type: 'textarea', label: 'Tarjeta — nota final' },
  ],
}

export const BloqueBoletin: Block = {
  slug: 'boletinSuscripcion',
  interfaceName: 'BloqueBoletin',
  labels: { singular: 'Suscripción al boletín', plural: 'Suscripciones al boletín' },
  fields: [
    {
      name: 'variante',
      type: 'select',
      label: 'Forma',
      defaultValue: 'tarjeta',
      options: [
        { label: 'Tarjeta con fondo', value: 'tarjeta' },
        { label: 'Franja con línea arriba', value: 'franja' },
      ],
      admin: { description: 'Los textos se cambian en Blog y boletín → Blog: textos de la página → Recuadro del boletín.' },
    },
  ],
}

export const BloqueRecursoGratis: Block = {
  slug: 'recursoGratis',
  interfaceName: 'BloqueRecursoGratis',
  labels: { singular: 'Recurso gratis', plural: 'Recursos gratis' },
  fields: [
    { name: 'recurso', type: 'relationship', relationTo: 'recursos', label: 'Recurso', required: true, admin: { description: 'Se crean en Blog y boletín → Recursos gratis.' } },
    { name: 'titulo', type: 'text', label: 'Título (opcional)', admin: { description: 'Vacío = el título del recurso.' } },
    { name: 'texto', type: 'textarea', label: 'Texto (opcional)', admin: { description: 'Vacío = el resumen del recurso.' } },
  ],
}

// ---------- Páginas de servicio ----------

const encabezadoCorto = (etiquetaDefecto = ''): Field[] => [
  { name: 'etiqueta', type: 'text', label: 'Etiqueta pequeña', defaultValue: etiquetaDefecto || undefined },
  {
    type: 'row',
    fields: [
      { name: 'titulo', type: 'text', label: 'Titular — parte en negro' },
      { name: 'enfasis', type: 'text', label: 'Titular — parte destacada en gris' },
    ],
  },
]

export const BloqueServicioPortada: Block = {
  slug: 'servicioPortada',
  interfaceName: 'BloqueServicioPortada',
  labels: { singular: 'Portada de servicio (con animación)', plural: 'Portadas de servicio' },
  fields: [
    { name: 'eyebrow', type: 'text', label: 'Etiqueta pequeña (también sale en la ruta "Inicio | …")' },
    {
      type: 'row',
      fields: [
        { name: 'h1', type: 'text', label: 'Titular — parte en negro', required: true },
        { name: 'h1Enfasis', type: 'text', label: 'Titular — parte destacada' },
      ],
    },
    { name: 'lead', type: 'textarea', label: 'Entradilla' },
    {
      name: 'maqueta',
      type: 'select',
      label: 'Animación de la derecha',
      defaultValue: 'sitio',
      options: [
        { label: 'Sitio web que se arma', value: 'sitio' },
        { label: 'Landing que convierte', value: 'landing' },
        { label: 'Tienda que recibe un pedido', value: 'tienda' },
        { label: 'Negocio que sube en Google', value: 'google' },
        { label: 'Mapa con municipios', value: 'mapa' },
      ],
    },
    { ...listaTextos('municipios', 'Municipios del mapa', 'Municipio'), admin: { condition: (_: any, s: any) => s?.maqueta === 'mapa' } } as Field,
    { name: 'cita', type: 'text', label: 'Nota bajo la animación' },
    listaTextos('chips', 'Datos cortos bajo los botones', 'Dato'),
    {
      type: 'row',
      fields: [
        { name: 'cta', type: 'text', label: 'Botón negro (abre WhatsApp)', defaultValue: 'Escribir por WhatsApp' },
        { name: 'botonSecundario', type: 'text', label: 'Botón gris', defaultValue: 'Calcular mi proyecto' },
        { name: 'enlaceSecundario', type: 'text', label: 'Dirección del botón gris', defaultValue: '/#cotizador' },
      ],
    },
    mensajeWhatsapp,
    {
      name: 'nombreServicio',
      type: 'text',
      label: 'Nombre del servicio para Google',
      admin: { description: 'Ej: "Diseño de sitios web corporativos". Va en los datos que Google lee de la página.' },
    },
  ],
}

export const BloqueEscenaIluminada: Block = {
  slug: 'escenaIluminada',
  interfaceName: 'BloqueEscenaIluminada',
  labels: { singular: 'Escena que se ilumina al bajar', plural: 'Escenas que se iluminan' },
  fields: [
    { name: 'etiqueta', type: 'text', label: 'Etiqueta pequeña', defaultValue: 'Te suena, ¿verdad?' },
    { name: 'cita', type: 'textarea', label: 'Frase grande (se ilumina palabra a palabra)', required: true },
    { name: 'cuerpo', type: 'textarea', label: 'Explicación que aparece al final' },
  ],
}

const listaTituloDesc = (name: string, label: string, singular: string): Field => ({
  name,
  type: 'array',
  label,
  labels: { singular, plural: label },
  fields: [
    { name: 'titulo', type: 'text', label: 'Título', required: true },
    { name: 'desc', type: 'textarea', label: 'Descripción' },
  ],
})

export const BloqueCaracteristicas: Block = {
  slug: 'caracteristicasActivas',
  interfaceName: 'BloqueCaracteristicas',
  labels: { singular: 'Qué incluye (se activa al bajar)', plural: 'Qué incluye' },
  fields: [...titular({ lead: true }), listaTituloDesc('items', 'Puntos', 'Punto')],
}

export const BloquePasosLinea: Block = {
  slug: 'pasosLinea',
  interfaceName: 'BloquePasosLinea',
  labels: { singular: 'Pasos con línea que se llena', plural: 'Pasos con línea' },
  fields: [...titular(), listaTituloDesc('items', 'Pasos', 'Paso')],
}

export const BloqueDesfileCasos: Block = {
  slug: 'desfileCasos',
  interfaceName: 'BloqueDesfileCasos',
  labels: { singular: 'Trabajo publicado (cintas de clientes)', plural: 'Trabajo publicado' },
  fields: [
    ...encabezadoCorto('Trabajo publicado'),
    { name: 'lead', type: 'textarea', label: 'Texto a la derecha' },
    {
      type: 'ui',
      name: 'aviso',
      admin: { components: { Field: '@/bloques/sitio/admin/AvisoCasos#AvisoCasos' } },
    },
  ],
}

export const BloquePreguntasServicio: Block = {
  slug: 'preguntasServicio',
  interfaceName: 'BloquePreguntasServicio',
  labels: { singular: 'Preguntas del servicio', plural: 'Preguntas del servicio' },
  fields: [
    ...encabezadoCorto('Preguntas frecuentes'),
    {
      name: 'grupo',
      type: 'text',
      label: 'Grupo de preguntas',
      required: true,
      admin: { description: 'El mismo "Grupo" que pusiste en Contenido → Preguntas frecuentes. Ej: diseno-web' },
    },
  ],
}

export const BloqueOtrosServicios: Block = {
  slug: 'otrosServicios',
  interfaceName: 'BloqueOtrosServicios',
  labels: { singular: 'Otros servicios', plural: 'Otros servicios' },
  fields: [
    ...encabezadoCorto('Otros servicios'),
    {
      name: 'items',
      type: 'array',
      label: 'Servicios',
      labels: { singular: 'Servicio', plural: 'Servicios' },
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'titulo', type: 'text', label: 'Nombre', required: true },
            { name: 'enlace', type: 'text', label: 'Dirección (ej. /servicios)', required: true },
          ],
        },
        { name: 'descripcion', type: 'text', label: 'Frase corta' },
      ],
    },
  ],
}

export const BloqueCierreServicio: Block = {
  slug: 'cierreServicio',
  interfaceName: 'BloqueCierreServicio',
  labels: { singular: 'Cierre en negro de servicio', plural: 'Cierres de servicio' },
  fields: [
    ...encabezadoCorto('Empecemos'),
    { name: 'lead', type: 'textarea', label: 'Texto' },
    {
      type: 'row',
      fields: [
        { name: 'cta', type: 'text', label: 'Botón (abre WhatsApp)', defaultValue: 'Escribir por WhatsApp' },
        { name: 'botonSecundario', type: 'text', label: 'Botón gris', defaultValue: 'Calcular mi proyecto' },
        { name: 'enlaceSecundario', type: 'text', label: 'Dirección del botón gris', defaultValue: '/#cotizador' },
      ],
    },
    mensajeWhatsapp,
    { name: 'garantia', type: 'text', label: 'Garantía (abajo)', defaultValue: 'Sin ataduras ni cobros ocultos' },
  ],
}

export const BloqueCobertura: Block = {
  slug: 'coberturaMunicipios',
  interfaceName: 'BloqueCobertura',
  labels: { singular: 'Cobertura por municipios', plural: 'Coberturas' },
  fields: [
    ...encabezadoCorto('Dónde atendemos'),
    { name: 'lead', type: 'textarea', label: 'Texto' },
    listaTextos('municipios', 'Municipios', 'Municipio'),
    { name: 'nota', type: 'textarea', label: 'Nota bajo la lista' },
    {
      type: 'row',
      fields: [
        { name: 'boton', type: 'text', label: 'Botón', defaultValue: 'Ver nuestra ficha en Google' },
        { name: 'enlaceBoton', type: 'text', label: 'Enlace del botón (vacío = sin botón)' },
      ],
    },
  ],
}

export const BloqueComparativa: Block = {
  slug: 'comparativaOpciones',
  interfaceName: 'BloqueComparativa',
  labels: { singular: 'Comparativa en dos columnas', plural: 'Comparativas' },
  fields: [
    ...encabezadoCorto('Antes de decidir'),
    { name: 'lead', type: 'textarea', label: 'Texto' },
    {
      type: 'row',
      fields: [
        { name: 'etiquetaOtra', type: 'text', label: 'Columna gris — título', defaultValue: 'La otra opción' },
        { name: 'etiquetaPropia', type: 'text', label: 'Columna negra — título', defaultValue: 'Con nosotros' },
      ],
    },
    {
      name: 'filas',
      type: 'array',
      label: 'Filas',
      labels: { singular: 'Fila', plural: 'Filas' },
      fields: [
        { name: 'tema', type: 'text', label: 'Tema', required: true },
        {
          type: 'row',
          fields: [
            { name: 'otra', type: 'textarea', label: 'Columna gris' },
            { name: 'propia', type: 'textarea', label: 'Columna negra' },
          ],
        },
      ],
    },
  ],
}

export const bloquesDelSitio: Block[] = [
  BloqueEncabezado,
  BloqueContacto,
  BloqueBoletin,
  BloqueRecursoGratis,
  BloqueServicioPortada,
  BloqueEscenaIluminada,
  BloqueCaracteristicas,
  BloquePasosLinea,
  BloqueDesfileCasos,
  BloquePreguntasServicio,
  BloqueOtrosServicios,
  BloqueCierreServicio,
  BloqueCobertura,
  BloqueComparativa,
  BloquePortada,
  BloqueEscenas,
  BloqueSoluciones,
  BloqueServicios,
  BloqueCasos,
  BloqueFranja,
  BloquePanel,
  BloqueProceso,
  BloqueCotizador,
  BloqueConfianza,
  BloquePreguntas,
  BloqueCierre,
]

export const slugsDelSitio = bloquesDelSitio.map((b) => b.slug)
