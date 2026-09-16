# Plantilla de sitios

Base para crear sitios web de clientes con panel de administración en español. Incluye todo lo que se construyó y probó en producción: páginas por secciones, blog, boletín, recursos gratis, comentarios, tienda con Wompi, estadísticas propias, correos con la marca del cliente y documentos legales que se actualizan solos.

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
| **Revisión del sitio** | Pantalla del panel que comprueba base de datos, imágenes, correos y logo, y permite enviar un correo de prueba. |

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

## Dónde está cada cosa en el panel

- **Accesos rápidos** en el inicio del panel, y debajo las estadísticas.
- **Revisión del sitio:** `/admin/revision`.
- **Cambiar contraseña:** tu cuenta → *Cambiar contraseña* (pide la actual).
- **Registro de correos:** *Configuración → Registro de correos*, con el motivo exacto si algo no salió.

---

## Cambios en la estructura de datos

Si agregas o cambias campos de colecciones o pantallas, crea una migración antes de publicar:

```bash
DATABASE_URL=file:./vacia.db npx payload migrate
DATABASE_URL=file:./vacia.db npx payload migrate:create nombre-del-cambio
```

En tu computador la base se actualiza sola al encender; en producción solo con migraciones.
