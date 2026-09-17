---
name: auditoria-seo
description: Auditoría SEO completa y aplicada para cualquier sitio web, adaptada al sector y la ciudad del negocio. Úsala cuando pidan auditar, revisar o mejorar el SEO o el posicionamiento de un sitio; investigar palabras clave o cola larga; preparar un sitio antes de indexarlo en Google; posicionarse en una ciudad (SEO local, Google Maps, ficha de Google Business Profile); o revisar por qué un sitio no aparece en Google. También cuando digan "quiero salir primero en Google", "optimiza mi página para Google" o "qué palabras clave uso".
---

# Auditoría SEO universal

Guía para auditar un sitio web, decidir según su **sector** y su **zona** cómo debe estar construido y posicionado, y **corregir** lo que falla. Sirve para cualquier negocio: local (restaurante, odontólogo, abogado, ferretería), de servicios profesionales, tienda online o marca personal.

## Reglas

- **Explica todo en español sencillo.** Quien pide la auditoría normalmente no es técnico: cada hallazgo va con "qué es", "por qué importa" y "qué hacemos".
- **No inventes datos.** Sin herramientas de pago no hay volúmenes de búsqueda exactos: habla de señales ("aparece en las sugerencias de Google", "hay 10 competidores con página dedicada"), nunca de cifras inventadas. No prometas posiciones ni plazos garantizados.
- **No hagas trampa con Google.** Nada de texto oculto, reseñas falsas, relleno de palabras clave, páginas por ciudad copiadas cambiando solo el nombre, compra de enlaces ni datos estructurados que no correspondan a lo visible.
- **Si un buscador pide verificar que no eres un robot (CAPTCHA), no lo saltes.** Usa otras fuentes (DuckDuckGo en HTML, Bing, las sugerencias de Google, el sitio del competidor directamente).
- **Respeta lo que el cliente ya editó** y su voz de marca. Cambios de contenido publicables: como borrador o con aprobación.
- **Antes de tocar direcciones (URLs)** de páginas ya publicadas, deja redirección permanente (301/308) de la vieja a la nueva.
- **Verifica en el sitio en vivo** cada cambio al terminar y muestra la evidencia.

## Fase 0 — Entender el negocio (5 minutos)

Averigua (del sitio, el panel o preguntando):

1. **Qué vende** y cuál es el servicio o producto **más rentable** (define la prioridad).
2. **Dónde**: ciudad, barrios o municipios que atiende; si tiene local abierto o atiende a domicilio / remoto (negocio de área de servicio).
3. **A quién le vende** y cómo decide ese cliente (urgencia, precio, confianza, cercanía).
4. **Diferenciales reales** comprobables (años, casos, garantías, plazos). Sin esto el contenido será genérico.
5. **Tipo de sitio**: local, nacional, tienda online o mixto. Cambia la estrategia:
   - *Local:* ficha de Google + página por servicio + página por ciudad/zona con sustancia.
   - *Nacional / servicios:* páginas por servicio y por sector de cliente + contenido informativo (blog) que atrae la búsqueda previa.
   - *Tienda:* categorías y productos optimizados, datos de producto, velocidad, reseñas reales.

## Fase 1 — Técnica (que Google pueda leer el sitio)

Revisa y anota ✓/✗ con la evidencia:

- `robots.txt` no bloquea el sitio y apunta al mapa; `sitemap.xml` existe, usa el dominio definitivo y solo incluye páginas publicadas que responden 200.
- Un solo dominio principal (con o sin `www`, `https`) y las otras variantes redirigen a él.
- Cada página del mapa: estado 200, `canonical` a sí misma, sin `noindex` (ni en `<meta>` ni en la cabecera `X-Robots-Tag`), `lang="es"` (o el idioma real), una sola `<h1>`.
- El contenido está en el HTML que llega del servidor (no solo generado en el navegador).
- Página 404 real para direcciones que no existen (no redirigir todo a inicio).
- Direcciones legibles, en minúscula, sin tildes rotas ("guia", no "gua"), cortas y con la palabra clave.
- Direcciones del sitio anterior (si hubo) redirigen a su equivalente.
- Velocidad y móvil: imágenes optimizadas (WebP/AVIF, tamaños adecuados, `alt`), sin desbordes horizontales, texto legible en celular. Si hay acceso, PageSpeed Insights.
- Datos estructurados (JSON-LD) válidos y coherentes con lo visible: `LocalBusiness` o subtipo correcto (`ProfessionalService`, `Restaurant`, `Dentist`…), `Service` por servicio, `FAQPage` si hay preguntas visibles, `BlogPosting`/`Article`, `BreadcrumbList`, `Product` en tiendas. Horario estructurado, zonas atendidas, enlace a la ficha de Maps y redes en `sameAs`. **Nunca** `AggregateRating` sin reseñas reales visibles.
- Guion rápido para revisar todas las páginas del mapa: descarga `sitemap.xml`, recorre cada URL y extrae estado, `<title>` (largo), meta descripción (largo), `canonical`, robots, número de `<h1>`, `og:image` y tipos de JSON-LD; marca títulos o descripciones repetidos.

## Fase 2 — Investigación de palabras clave (sin herramientas de pago)

1. **Semillas:** servicio + ciudad, servicio a secas, problema del cliente, sector del cliente ("página web para restaurante"), precio ("cuánto cuesta…"), comparación ("X o Y"), cerca de mí.
2. **Sugerencias de Google** (autocompletar): `https://suggestqueries.google.com/complete/search?client=firefox&hl=es&gl=<país>&q=<semilla>` y variantes con letras (`semilla a`, `semilla b`…). Pocas o ninguna sugerencia con la ciudad = poca búsqueda local (pero también poca competencia).
3. **Preguntas reales:** "Otras preguntas de los usuarios", búsquedas relacionadas, foros, y sobre todo **lo que los clientes preguntan por WhatsApp o en el formulario**.
4. **Clasifica por intención:** transaccional/local (vender ya), comparativa, informativa (educar). Cada intención pide un tipo de página distinto.
5. **Prioriza** en una tabla: búsqueda · intención · página destino (existente o nueva) · qué tan buena para vender (alta/media/baja) · dificultad observada (quién sale arriba) · acción.

## Fase 3 — Competencia en los resultados

Para las 3–5 búsquedas principales:

- Quién sale arriba (agencias nacionales con páginas por ciudad, negocios locales reales, directorios).
- De cada competidor: título, `h1`, cantidad de texto, si muestra precios, preguntas frecuentes, datos estructurados, fotos reales, reseñas, ficha de Google.
- **Huecos que se pueden ganar:** presencia local real, precios o rangos, preguntas que nadie responde, sectores de cliente no cubiertos, mejor experiencia en celular.

## Fase 4 — Contenido y estructura (página por página)

- **Mapa de palabras clave:** una búsqueda principal por página; que dos páginas no peleen por la misma (canibalización).
  - Inicio: marca + servicio principal + ciudad.
  - Una página por servicio.
  - Una página por ciudad o zona **con contenido propio** (municipios, ejemplos, preguntas locales).
  - Páginas por sector de cliente si el negocio atiende varios.
- **Cada página:**
  - `<title>` de 50–60 caracteres con la búsqueda al inicio y la marca al final.
  - Meta descripción de 140–160 con beneficio y llamado.
  - `h1` que contenga la búsqueda sin perder la creatividad.
  - Subtítulos con variaciones naturales.
  - Respuesta clara en los primeros párrafos.
  - Prueba: casos, proceso, garantías reales.
  - Preguntas frecuentes locales o de precio.
  - Un llamado a la acción principal (WhatsApp / llamar / cotizar).
  - Enlaces internos con texto descriptivo.
- **Blog:** 3–6 artículos iniciales que respondan búsquedas informativas con demanda (precio, cómo elegir, errores, guía por sector o ciudad) y enlacen a la página de servicio. Tono de la marca, sin relleno, sin datos inventados; si se citan precios de mercado, que sean observados y se diga de dónde.
- **Imágenes:** fotos reales, nombre de archivo y `alt` descriptivos.

## Fase 5 — Presencia local fuera del sitio (checklist para el dueño)

- **Google Business Profile:**
  - Categoría principal exacta.
  - Categorías secundarias pocas y correctas.
  - Servicios cargados uno por uno, descripción de 750 caracteres, horario (y festivos), fotos reales mensuales.
  - Área de servicio si no hay local, enlace al sitio, publicaciones periódicas.
  - Preguntas y respuestas.
- **Reseñas:** pedirlas de forma sistemática con el enlace directo, responder todas.
- **Nombre, dirección y teléfono idénticos** en el sitio, la ficha, las redes y los directorios.
- **Directorios y menciones** relevantes del país y del sector (cámara de comercio, gremios, directorios locales serios, medios locales, proveedores/aliados). Nada de enlaces comprados.
- **Search Console:**
  - Verificar la propiedad de dominio.
  - Enviar el mapa y solicitar indexación de las páginas clave.
  - Revisar *Páginas* y *Rendimiento* a los 7 y 30 días.
- **Bing Webmaster Tools:** importar desde Search Console.

## Fase 6 — Aplicar y entregar

1. **Aplicar primero lo técnico y lo que no depende de nadie:** errores de indexación, redirecciones, datos estructurados, títulos y descripciones.
2. **Después, el contenido de páginas existentes.** Si el sitio tiene panel/CMS, cambia solo campos que no hayan sido editados a mano, o deja la propuesta.
3. **Páginas y artículos nuevos como borrador** para aprobación.
4. **Verificar en vivo** (estado, títulos, datos estructurados, móvil) y repetir el guion de la Fase 1.
5. **Informe final para alguien no técnico:**
   - Resumen de 5 líneas.
   - Qué se encontró (✓/✗).
   - Qué se cambió (con enlaces).
   - Tabla de palabras clave elegidas.
   - Tareas del dueño (ficha, reseñas, Search Console) en pasos numerados.
   - Plan de contenidos para 3 meses.
   - Expectativas honestas de tiempo: ficha de Google en semanas; búsquedas locales en 1–3 meses; competidas en más tiempo.

## Checklist rápida por sector

- **Restaurantes / cafés:**
  - Carta en HTML (no PDF) con precios, horario, ubicación y botón de ruta, reservas por WhatsApp.
  - Fotos de platos reales, temporada turística, `Restaurant` + `servesCuisine` + `menu`.
- **Salud (médicos, odontólogos, psicólogos):**
  - Página por especialidad o tratamiento, credenciales visibles (registro, formación).
  - Preguntas sobre precio, dolor y duración; agendamiento; `MedicalClinic`/`Dentist`.
  - Cuidado con promesas médicas.
- **Abogados / contadores / consultores:**
  - Página por tipo de caso o servicio, respuestas a dudas legales frecuentes (sin asesoría concreta).
  - Casos o experiencia, `LegalService`/`AccountingService`.
- **Construcción / técnicos / hogar:**
  - Páginas por servicio y por zona, fotos de trabajos reales antes/después.
  - Urgencias ("24 horas" solo si es verdad), cotización rápida.
- **Tiendas online:**
  - Categorías con texto propio y fichas de producto únicas (no copiar la del fabricante).
  - Precio y disponibilidad visibles, envíos y devoluciones claros, `Product`/`Offer`, velocidad.
- **Agencias / servicios profesionales B2B:**
  - Página por servicio y por sector de cliente, casos con resultados verificables.
  - Proceso, precios o rangos si es posible, páginas por ciudad con sustancia.
- **Marca personal / artistas:**
  - Página "sobre mí" completa, portafolio por proyecto con fichas.
  - Prensa, contacto profesional, `Person`.
