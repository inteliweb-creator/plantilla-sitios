# Plantilla de sitios

Base para crear sitios web de clientes con panel de administración en español. Incluye todo lo que se construyó y probó en producción: páginas por secciones, blog, boletín, recursos gratis, comentarios, tienda con Wompi, estadísticas propias, correos con la marca del cliente, documentos legales que se actualizan solos y un asistente de inteligencia artificial opcional.

**Tecnología:** Payload CMS 3 + Next.js 16, base de datos SQLite (en la nube, Turso), imágenes en Vercel Blob y correos con Resend.

---

## Qué incluye

| Área | Qué hace |
|---|---|
| **Páginas** | Se arman por secciones (bloques) desde el panel. Portada, servicios, proceso, preguntas, contacto, cierre, recursos y más. |
| **Blog** | Artículos con borradores, programación, índice, compartir en redes, llamado a la acción al final y comentarios con moderación. |
| **Boletín** | Formulario de suscripción, envíos masivos, baja con un clic, importar y descargar suscriptores en CSV. |
| **Recursos gratis** | Guías o plantillas a cambio del correo, con enlace de descarga firmado que vence en 7 días. |
| **Tienda** | Catálogo, carrito, pago con Wompi, cuentas y pedidos. Se enciende o apaga en *Módulos del sitio*. |
| **Estadísticas** | Visitas, personas, de dónde llegan, páginas más vistas y clics a WhatsApp, sin cookies. |
| **Analítica y píxeles** | Google Analytics, Tag Manager, Meta, TikTok y Clarity pegando su código, con aviso de cookies. |
| **Ventanas de conversión** | Aviso al intentar salir y burbuja de WhatsApp. |
| **Legales** | Privacidad, cookies y términos con los datos del negocio y párrafos que cambian solos según lo que el sitio usa. |
| **Google** | Mapa del sitio, robots, datos estructurados del negocio, artículos, servicios y preguntas. |
| **Imágenes** | Se optimizan al subirlas (WebP, varios tamaños y PNG para correos). |
| **Seguridad** | Contraseñas de 12+ caracteres, pedir la actual al cambiarla, bloqueo por intentos, recuperación por correo. |
| **Revisión del sitio** | Pantalla del panel que comprueba base de datos, imágenes, correos, logo y asistente, y permite enviar un correo de prueba. |
| **Asistente IA (opcional)** | Burbuja en todo el panel para pedir por texto o voz: borradores de artículos y boletines, resumen del buzón, respuestas a comentarios, investigación en Google, videos de YouTube convertidos en contenido e imágenes. Botón **✨ Completar** en los campos de texto. Lo que publica o envía espera aprobación. **Viene apagado.** |

---

## Empezar un sitio nuevo (en tu computador)

1. Crea el repositorio del cliente desde esta plantilla (botón **Use this template** en GitHub) y clónalo.
2. Instala: `npm ci`
3. Copia `.env.example` a `.env` y llena al menos `PAYLOAD_SECRET` (texto largo al azar), `DATABASE_URL=file:./mi-sitio.db` y `NEXT_PUBLIC_SERVER_URL=http://localhost:3000`.
4. Enciende: `npm run dev` (o doble clic en `Encender plantilla.bat`). La primera carga tarda 1 o 2 minutos.
5. Entra a `http://localhost:3000/admin` y crea la cuenta de administrador.
6. **¿El cliente ya tiene diseño?** Lee la sección siguiente antes de tocar nada.
   **¿No tiene?** Ve a **Revisión del sitio** y pulsa **Cargar contenido de ejemplo**. Luego edita desde el panel.
7. En **Datos del negocio** sube los logos (PNG) y pon nombre, WhatsApp, colores de marca y datos para Google.
8. En **Módulos del sitio** enciende solo lo que el cliente usa.

---

## Aplicar la plantilla a un cliente que ya tiene diseño

La plantilla trae un **diseño base** para cuando el cliente no tiene uno. **No es el diseño obligatorio.** Si el cliente ya tiene su sitio o su identidad visual, se conserva ese diseño y se le conectan las funciones de la plantilla:

1. **Primero se estudia el diseño existente:** colores, tipografías, espaciados, bordes, botones, cabecera, pie y cómo se ven sus secciones.
2. **Los colores y tipografías** se llevan a un tema propio (`src/temas/<cliente>/tema.css`) y se importa en `src/app/(app)/globals.css` en lugar de `temas/base`.
3. **Sus secciones** se recrean como bloques (en `src/bloques/sitio/` o en una carpeta propia) para que sigan viéndose igual pero se editen desde el panel.
4. **Cabecera, pie y menú** se adaptan en `src/bloques/sitio/marco/` manteniendo su aspecto; los datos siguen saliendo de *Menú y pie de página*.
5. **Los correos** toman los colores de *Datos del negocio → Color de acento / Color oscuro* y el logo PNG del cliente.
6. Las funciones (blog, boletín, recursos, estadísticas, legales, correos) no dependen del diseño: se conservan tal cual.

> Regla: nunca reemplazar la estética del cliente por el diseño base. El diseño base solo se usa cuando no hay otro.

---

## Publicar en internet (Vercel)

1. **Imágenes:** en Vercel, *Storage → Blob*, crea uno y conéctalo marcando **"Add a read-write token"** (crea `BLOB_READ_WRITE_TOKEN`).
2. **Base de datos:** crea una base en Turso y agrega en Vercel `DATABASE_URL` (libsql://…) y `DATABASE_AUTH_TOKEN`.
3. **Variables** (*Settings → Environment Variables*, Production):
   - `PAYLOAD_SECRET` y `PREVIEW_SECRET` → tipo **Secret**, textos largos al azar, uno distinto por sitio.
   - `NEXT_PUBLIC_SERVER_URL` → tipo **Config** (las que empiezan por `NEXT_PUBLIC_` no pueden ser Secret). Ej: `https://www.cliente.com`
   - `RESEND_API_KEY` → Secret. El dominio del remitente debe estar verificado en Resend.
   - Wompi solo si hay tienda: `NEXT_PUBLIC_WOMPI_PUBLIC_KEY`, `WOMPI_INTEGRITY_SECRET`, `WOMPI_EVENTS_SECRET`.
4. **Contenido inicial (opcional):** si armaste el contenido en tu computador, ejecuta `node scripts/exportar-semilla.mjs` y sube la carpeta `semilla/`. Al publicar se carga sola si la base está vacía, y las imágenes se suben a Blob.
5. Sube el código. Vercel ejecuta `npm run ci`: crea las tablas (migraciones), carga la semilla y compila.
6. **Apenas quede en vivo, crea la cuenta de administrador en `/admin`.** La primera cuenta que se crea queda como administradora.
7. En el panel: **Revisión del sitio** → revisa que todo esté en verde, pulsa **Optimizar imágenes subidas** si hace falta y envía un correo de prueba. Completa *Correos y avisos* con el correo donde el cliente recibe los mensajes.

---

## Asistente de inteligencia artificial (opcional)

Viene **apagado**: mientras lo esté, no aparece la burbuja ni los botones ✨. Necesita una clave de un proveedor de IA, que normalmente es **de pago** (DeepSeek es muy económico; Gemini tiene cuota gratuita pero a veces se satura).

**Encenderlo:**

1. *Configuración → Asistente IA → Conexiones → Añadir conexión.*
2. Elige el proveedor, deja **Modelo** vacío, pega la clave y pulsa **Probar conexión** (si el modelo recomendado no existe en esa cuenta, elige solo uno que funcione).
3. Recomendado: **DeepSeek como principal** (conversa y redacta) y **Google Gemini de respaldo** (además investiga en Google, ve videos de YouTube y describe o crea imágenes). Si una falla, usa la siguiente sola.
4. Llena **Conocimiento de la marca y cómo debe escribir** con la información del cliente: quiénes son, servicios y sus direcciones, qué los hace distintos, a quién le hablan, tono, palabras a usar y evitar, llamados a la acción. Sin esto escribe genérico.
5. Marca **Asistente encendido**, pon su **nombre** (sale en la burbuja) y un **límite de uso al mes**. Guarda.

**Seguridad:** no puede borrar, tocar usuarios, claves, configuración ni código. Publicar, responder comentarios y enviar boletines quedan como propuesta con botón **Aprobar**. Lo que escriben los visitantes o llega de internet se trata como información, nunca como órdenes. Todo queda en *Registro del asistente*. Las claves se guardan cifradas con `PAYLOAD_SECRET` (si esa variable cambia, hay que volver a pegarlas).

**Dictado por voz:** funciona en Chrome, Edge y Safari. El micrófono solo está permitido dentro de `/admin` (ver `next.config.ts`).

---

## Indexar el sitio en Google (al publicar cada cliente)

Antes de pedirle a Google que lo lea, haz una **auditoría SEO** con la guía `docs/prompt-auditoria-seo.md` (en Claude Code está como la skill `auditoria-seo`: basta con pedir *"haz una auditoría SEO del sitio para posicionarlo en <ciudad>"*; en otra IA, pega ese archivo como instrucciones). Luego:

1. **Revisa que todo esté listo:** textos definitivos (nada de contenido de ejemplo), *Datos del negocio* completos, logo, legales con los datos reales y *Revisión del sitio* en verde.
2. **Dirección única:** el dominio definitivo en `NEXT_PUBLIC_SERVER_URL` y en Vercel el dominio principal con redirección de la versión sin `www` (o al revés). Abre `/robots.txt` y `/sitemap.xml` y comprueba que usan ese dominio.
3. **Si el cliente tenía un sitio anterior**, lista sus direcciones y agrega redirecciones permanentes en `redirects.ts` hacia la página equivalente (así no pierde lo ganado en Google).
4. **Google Search Console** (con la cuenta de Google del cliente): *Agregar propiedad → Dominio* → copia el registro TXT → agrégalo en el DNS donde está el dominio (Vercel, GoDaddy, Hostinger…) → *Verificar*.
5. En Search Console: *Sitemaps* → envía `sitemap.xml`. Luego *Inspección de URLs* → pega la portada y las páginas de servicio → *Solicitar indexación*.
6. **Bing Webmaster Tools:** *Importar desde Google Search Console* (un clic; también alimenta a ChatGPT y Copilot).
7. **Ficha de Google Business Profile:** pon la dirección del sitio y verifica que nombre, teléfono y dirección coincidan exactamente con *Datos del negocio*.
8. Revisa Search Console a los 7 y 30 días: *Páginas* (qué se indexó y por qué no) y *Rendimiento* (búsquedas).

---

## Dónde está cada cosa en el panel

- **Accesos rápidos** en el inicio del panel, y debajo las estadísticas.
- **Revisión del sitio:** `/admin/revision`.
- **Cambiar contraseña:** tu cuenta → *Cambiar contraseña* (pide la actual).
- **Registro de correos:** *Configuración → Registro de correos*, con el motivo exacto si algo no salió.
- **Asistente IA:** ajustes en *Configuración → Asistente IA*; historial de acciones en *Configuración → Registro del asistente*; pantalla completa en `/admin/asistente`.

---

## Cambios en la estructura de datos

Si agregas o cambias campos de colecciones o pantallas, crea una migración antes de publicar:

```bash
DATABASE_URL=file:./vacia.db npx payload migrate
DATABASE_URL=file:./vacia.db npx payload migrate:create nombre-del-cambio
```

En tu computador la base se actualiza sola al encender; en producción solo con migraciones.
