import type { Payload } from 'payload'

import { sembrarLegales } from './sembrar-legales'

/**
 * Contenido de ejemplo para arrancar un sitio nuevo: datos del negocio, menú,
 * página de inicio y de contacto armadas con los bloques del diseño base,
 * preguntas frecuentes, textos del blog, documentos legales y módulos.
 *
 * Todo es genérico y está pensado para reemplazarse desde el panel. Solo se
 * carga en una base vacía (sin páginas): nunca pisa el contenido de un cliente.
 *
 * Si el cliente ya tiene su propio diseño, no hace falta cargar este ejemplo:
 * ver "Aplicar la plantilla a un cliente" en README.md.
 */

const t = (lista: string[]) => lista.map((texto) => ({ texto }))

export async function sembrarEjemplo(payload: Payload) {
  const ya = await payload.count({ collection: 'pages' })
  if (ya.totalDocs > 0) return { ok: false as const, motivo: 'El sitio ya tiene páginas: el ejemplo solo se carga en un sitio vacío.' }

  const ctx = { disableRevalidate: true }

  // 1. Datos del negocio
  await payload.updateGlobal({
    slug: 'tienda',
    context: ctx,
    data: {
      nombre: 'Mi negocio',
      eslogan: 'Escribe aquí, en una frase, lo que haces y para quién',
      whatsapp: '573000000000',
      mensajeWhatsapp: 'Hola, vengo del sitio web y quiero más información.',
      mostrarBotonWhatsapp: true,
      correo: 'hola@minegocio.com',
      telefono: '+57 300 000 0000',
      ciudad: 'Tu ciudad',
      departamento: 'Tu departamento',
      horario: 'Lun a Vie · 8:00 a.m. - 6:00 p.m.',
      tipoNegocio: 'LocalBusiness',
    } as any,
  })

  // 2. Menú, riel lateral y pie
  await payload.updateGlobal({
    slug: 'navegacion',
    context: ctx,
    data: {
      menu: [
        { etiqueta: 'Servicios', enlace: '/#servicios', icono: 'layout' },
        { etiqueta: 'Cómo trabajamos', enlace: '/#proceso', icono: 'target' },
        { etiqueta: 'Blog', enlace: '/blog', icono: 'newspaper' },
        { etiqueta: 'Contacto', enlace: '/contacto', icono: 'message' },
      ],
      botonCabecera: 'Hablemos',
      mostrarCarrito: false,
      mostrarRiel: true,
      riel: [
        { etiqueta: 'Inicio', enlace: '/', icono: 'home' },
        { etiqueta: 'Recursos', enlace: '/recursos', icono: 'download' },
        { etiqueta: 'Blog', enlace: '/blog', icono: 'newspaper' },
        { etiqueta: 'Contacto', enlace: '/contacto', icono: 'message' },
      ],
      descripcionPie: 'Una o dos frases sobre tu negocio: qué haces, para quién y dónde.',
      tituloEnlacesPie: 'Enlaces',
      enlacesPie: [
        { etiqueta: 'Inicio', enlace: '/' },
        { etiqueta: 'Blog', enlace: '/blog' },
        { etiqueta: 'Contacto', enlace: '/contacto' },
      ],
      textoWhatsappPie: 'Atención directa por WhatsApp',
      legales: [
        { etiqueta: 'Privacidad y datos', enlace: '/privacidad' },
        { etiqueta: 'Cookies', enlace: '/cookies' },
        { etiqueta: 'Términos', enlace: '/terminos' },
      ],
    } as any,
  })

  // 3. Preguntas frecuentes
  const preguntas = [
    ['¿Cómo puedo contactarlos?', 'Escríbenos por WhatsApp o desde el formulario de contacto. Te respondemos en horario de atención.'],
    ['¿En qué zonas atienden?', 'Cuenta aquí en qué ciudades o barrios trabajas y si atiendes a domicilio o en línea.'],
    ['¿Cuánto cuesta?', 'Explica cómo defines tus precios o qué incluye cada opción. Ser claro aquí evita muchas preguntas.'],
    ['¿Cuánto tiempo tarda?', 'Indica los plazos habituales y de qué dependen.'],
  ]
  for (const [i, [pregunta, respuesta]] of preguntas.entries()) {
    await payload.create({ collection: 'preguntas', context: ctx, data: { pregunta, respuesta, grupo: 'inicio', orden: i } as any })
  }

  // 4. Página de inicio con los bloques del diseño base
  const inicio = [
    {
      blockType: 'portadaPaisaje',
      eyebrow: 'Tu ciudad',
      h1: 'Tu titular principal',
      h1Enfasis: 'con la palabra que destaca',
      textoClientes: 'clientes satisfechos',
      ctaPrimarioTexto: 'Escríbenos',
      ctaSecundarioTexto: 'Ver servicios',
      enlaceSecundario: '#servicios',
      palabraFondo: 'MARCA',
      textoBajar: 'Baja para ver más',
      botonCabecera: 'Hablemos',
      barra: [
        { etiqueta: 'Ciudad', valor: 'Tu ciudad' },
        { etiqueta: 'Qué ofrecemos', valor: 'Tu servicio' },
        { etiqueta: 'Atención', valor: 'Lun a Vie' },
      ],
    },
    {
      blockType: 'serviciosLista',
      eyebrow: 'Servicios',
      titulo: 'Lo que hacemos',
      enfasis: 'por ti',
      lead: 'Describe en dos líneas qué problema resuelves y para quién.',
      nota: 'Escribe aquí una nota breve, por ejemplo cómo se cotiza.',
      textoVer: 'Ver',
      textoCotizar: 'Pedir información',
      items: [1, 2, 3].map((n) => ({
        titulo: `Servicio ${n}`,
        lema: 'Frase corta que lo resume',
        etiqueta: `Servicio ${n}`,
        enlace: '/contacto',
        desc: 'Explica en qué consiste, para quién es y qué resultado obtiene el cliente.',
        puntos: t(['Primer beneficio', 'Segundo beneficio', 'Tercer beneficio']),
      })),
    },
    {
      blockType: 'franjaLlamada',
      frase: '¿Tienes dudas sobre qué necesitas?',
      enfasis: 'Te orientamos sin compromiso.',
      boton: 'Escríbenos',
      mensajeWhatsapp: 'Hola, quiero más información.',
      botonSecundario: 'Ver cómo trabajamos',
      enlaceSecundario: '#proceso',
    },
    {
      blockType: 'procesoPasos',
      eyebrow: 'Cómo trabajamos',
      titulo: 'Así de simple es',
      enfasis: 'el proceso',
      lead: 'Tres pasos claros para que el cliente sepa qué esperar.',
      items: [
        { titulo: 'Nos cuentas qué necesitas', desc: 'Describe el primer paso con tus palabras.', detalle: 'Paso 1' },
        { titulo: 'Te proponemos una solución', desc: 'Describe el segundo paso.', detalle: 'Paso 2' },
        { titulo: 'Lo hacemos realidad', desc: 'Describe el resultado final.', detalle: 'Paso 3' },
      ],
    },
    {
      blockType: 'confianzaDatos',
      eyebrow: 'Por qué elegirnos',
      titulo: 'Claros desde',
      enfasis: 'el primer día',
      lead: 'Cuenta aquí qué te diferencia: experiencia, garantía, cercanía.',
      boton: 'Escribir por WhatsApp',
      mensajeWhatsapp: 'Hola, quiero hacer una pregunta.',
      datos: [
        { etiqueta: 'Horario de atención', valor: '', nota: 'Se toma de Datos del negocio.' },
        { etiqueta: 'Garantía', valor: 'Tu garantía', nota: 'Explica en qué consiste.' },
        { etiqueta: 'Experiencia', valor: 'X años', nota: 'Un dato que genere confianza.' },
      ],
    },
    {
      blockType: 'preguntasFrecuentes',
      eyebrow: 'Tus dudas',
      titulo: 'Preguntas',
      enfasis: 'frecuentes',
      grupo: 'inicio',
      otraDudaTitulo: '¿Tienes otra duda?',
      otraDudaTexto: 'Escríbenos sin compromiso.',
      boton: 'Hacer una pregunta',
    },
    {
      blockType: 'cierreNegro',
      eyebrow: 'Empieza hoy',
      titulo: 'Tu frase de cierre',
      enfasis: 'que invita a actuar',
      lead: 'Recuerda en una frase por qué vale la pena escribirte hoy.',
      boton: 'Escríbenos',
      garantias: t(['Primera garantía o tranquilidad', 'Segunda garantía o tranquilidad']),
    },
  ]

  const pagina = (slug: string, title: string, layout: any[], meta: { title: string; description: string }) =>
    payload.create({ collection: 'pages', context: ctx, data: { title, slug, _status: 'published', hero: { type: 'none' }, layout, meta } as any })

  await pagina('home', 'Inicio', inicio, {
    title: 'Mi negocio — Tu servicio principal en tu ciudad',
    description: 'Describe en una o dos frases qué ofreces, para quién y dónde. Es el texto que aparece en Google.',
  })

  // 5. Contacto
  await pagina(
    'contacto',
    'Contacto',
    [
      {
        blockType: 'encabezadoPagina',
        eyebrow: 'Contacto',
        titulo: 'Hablemos,',
        enfasis: 'sin compromiso',
        lead: 'Cuéntanos qué necesitas y te respondemos en horario de atención.',
      },
      {
        blockType: 'contactoFormulario',
        formularioTitulo: 'Escríbenos',
        preguntaOpciones: 'Qué necesitas',
        opciones: t(['Información general', 'Una cotización', 'Otra cosa']),
        preguntaMensaje: 'Cuéntanos un poco',
        pistaMensaje: '¿Qué necesitas y para cuándo?',
        boton: 'Enviar mensaje',
        notaLegal: 'Te respondemos en horario de atención.',
        exitoTitulo: 'Recibimos tu mensaje',
        exitoTexto: 'Te respondemos muy pronto.',
        directoTitulo: 'O directo, sin formulario',
        mensajeWhatsapp: 'Hola, quiero más información.',
        ubicacionTitulo: 'Dónde estamos',
        horarioTitulo: 'Horario',
      },
    ],
    { title: 'Contacto — Mi negocio', description: 'Escríbenos por WhatsApp, correo o el formulario. Te respondemos en horario de atención.' },
  )

  // 6. Correos: sin correo de avisos (lo pone el cliente); texto de confirmación genérico
  await payload.updateGlobal({
    slug: 'avisos',
    context: ctx,
    data: {
      enviarConfirmacion: true,
      textoConfirmacion: 'Tu mensaje llegó bien. Te respondemos muy pronto. Si es urgente, escríbenos por WhatsApp.',
    } as any,
  })

  // 7. Blog y boletín: textos de ejemplo
  await payload.updateGlobal({
    slug: 'blog',
    context: ctx,
    data: {
      eyebrow: 'Blog',
      titulo: 'Ideas y consejos',
      enfasis: 'que sirven',
      lead: 'Artículos para resolver las dudas más comunes de tus clientes.',
      sinArticulos: 'Muy pronto publicaremos el primer artículo.',
      boletinTitulo: 'Recibe los artículos',
      boletinEnfasis: 'cuando salgan',
      boletinTexto: 'Escribimos poco y solo cuando hay algo útil.',
      bienvenida: 'Gracias por suscribirte. Te escribiremos solo cuando tengamos algo que valga la pena.',
    } as any,
  })

  // 8. Módulos: sitio, blog, boletín y recursos; la tienda empieza apagada
  await payload.updateGlobal({ slug: 'modulos', context: ctx, data: { blog: true, boletin: true, recursos: true, tienda: false } as any })

  const legales = await sembrarLegales(payload)
  return { ok: true as const, paginas: 2, preguntas: preguntas.length, ...legales }
}
