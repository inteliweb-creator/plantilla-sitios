# Plantilla de sitios — instrucciones para Claude

This project uses the Payload CMS skill at `.claude/skills/payload/`. Start with `.claude/skills/payload/SKILL.md`, then `.claude/skills/payload/reference/`.

## Contexto

- Plantilla reutilizable para sitios de clientes: Payload CMS 3 + Next.js 16 (Turbopack), SQLite con `@payloadcms/db-sqlite` (Turso en producción), Vercel Blob, Resend.
- Quien la usa **no es técnico**. Explica todo en español sencillo, sin jerga. El panel, los textos y los correos están en español.
- Lee `README.md`: explica los módulos, cómo empezar un cliente y cómo publicar.

## Regla principal: respetar el diseño del cliente

La carpeta `src/temas/base` y los bloques de `src/bloques/sitio` son un **diseño base**, no un estilo obligatorio.

- **Antes de construir o editar la parte visual, pregunta o revisa si el cliente ya tiene diseño** (sitio actual, código, capturas, manual de marca).
- Si lo tiene: **no rediseñes con el diseño base.** Extrae sus colores, tipografías, radios, sombras, espaciados y componentes; crea `src/temas/<cliente>/tema.css` e impórtalo en `src/app/(app)/globals.css`; recrea sus secciones como bloques editables conservando su aspecto; adapta `src/bloques/sitio/marco/` (cabecera, pie, menú) a su estilo.
- Pon los colores de su marca en *Datos del negocio* (`colorAcento`, `colorOscuro`): los usan los correos. Sus logos van en PNG.
- Solo si el cliente no tiene diseño, usa el diseño base y el botón *Cargar contenido de ejemplo* de `/admin/revision`.
- Las funciones (blog, boletín, recursos, comentarios, estadísticas, legales, correos, tienda) son independientes del diseño: no las quites al adaptar la estética.

## Mapa del código

- Colecciones: `src/collections` (Pages, Articulos, Comentarios, Recursos, SolicitudesRecurso, Casos, Preguntas, Legales, Mensajes, Suscriptores, Boletines, Media, Users, Visitas, RegistroCorreos; tienda vía `@payloadcms/plugin-ecommerce`).
- Pantallas globales: `src/globals` (Tienda = *Datos del negocio*, Navegacion, Avisos, Medicion, Ventanas, Modulos, Blog, TiendaTextos, Asistente).
- Módulos encendibles: `src/modulos/index.ts` (blog, boletin, recursos, tienda). Apagar un módulo oculta rutas, API, menú del panel y enlaces del sitio.
- Bloques del sitio: `src/bloques/sitio/config.ts` (definición) y `RenderBloques.tsx` (pintado). Marco: `src/bloques/sitio/marco`.
- Correos: `src/correo/index.ts` (plantilla con la marca y registro de envíos), `src/correo/adaptador.ts` (correos del panel).
- Legales automáticos: `src/bloques/sitio/legal/automaticos.ts` (párrafos `{bloque:…}`) y `fechas.ts`.
- Rutas propias (formularios, descargas, CSV, visitas): `src/app/(app)/next/*`.
- Panel: accesos rápidos `src/components/BeforeDashboard`, estadísticas `src/components/Estadisticas`, revisión `src/components/Revision` (`/admin/revision`).
- Contenido de ejemplo: `src/scripts/sembrar-ejemplo.ts` (solo en sitio vacío). Textos legales: `src/scripts/legales/*.md` → `node scripts/generar-textos-legales.mjs`.
- Publicación: `vercel.json` + `npm run ci` = `payload migrate` → `scripts/cargar-semilla.mjs` → `next build`.
- Asistente IA (opcional, apagado por defecto): `src/asistente/`.
  - `agente.ts`: instrucciones, ciclo de herramientas y paso a la conexión de respaldo si una falla.
  - `herramientas.ts`: lo único que puede hacer. Tipos `lectura`, `borrador` y `confirmar`; las de confirmar solo se ejecutan con *Aprobar*.
  - `modelo.ts`: conexiones, reintentos y consumo. `gemini.ts`: investigar, YouTube, imágenes. `conocimiento.ts`: manual de SEO y redacción.
  - `completar/`: botón ✨ y su plugin. `admin/`: burbuja, vista, ajustes.
  - Rutas `src/app/(app)/next/asistente/*`; ajustes en el global `Asistente`, historial en `RegistroAsistente` y `ConversacionesAsistente`.
- Direcciones (slugs): usa `slugEnEspanol` de `src/utilities/slug.ts` en todo `slugField` nuevo (el convertidor por defecto borra las letras con tilde).

## Reglas de trabajo

- **Migraciones:** en producción no hay "push" de esquema. Tras cambiar campos, crea la migración contra una base vacía (`payload migrate` y luego `payload migrate:create`) y súbela con el código.
- **Nunca** pongas claves en el código ni pidas que las peguen en el chat. Las variables las pone el usuario en Vercel; las de `NEXT_PUBLIC_` deben ser tipo *Config*.
- Las rutas que cargan contenido de ejemplo (`/next/seed`, `/next/sembrar-legales`) están cerradas en producción. `/next/sembrar-ejemplo` solo actúa si no hay páginas.
- No llames `revalidateTag`/`revalidatePath` durante el render de una página o vista del panel: hazlo en rutas (`route.ts`) o hooks, y respeta `req.context.disableRevalidate` en cargas masivas.
- En Vercel las funciones tienen segundos de vida: procesa por tandas lo que sea pesado (ver `optimizarImagenes`).
- Los correos no muestran WebP: usa el tamaño `correo` (PNG) de la biblioteca.
- `robots.ts` debe estar en la raíz de `src/app`, no dentro de un grupo de rutas.
- Durante el primer arranque en desarrollo (cuando se crean tablas) no lances varias peticiones a la vez: SQLite puede quedar bloqueado a medio crear.
- Verifica los cambios visibles en el navegador y en móvil antes de darlos por terminados, y prueba los flujos de punta a punta (formulario → base de datos → correo).
- **Asistente:** nunca agregues herramientas que borren, cambien usuarios, claves, configuración o código. Todo lo que publique o envíe debe ser de tipo `confirmar`. Envuelve lo que escriben visitantes (`deVisitante`) y lo que llega de internet (`externo`). El conocimiento propio de cada cliente va en el campo del panel, no en el código.
- **Antes de indexar un sitio** sigue la lista *Indexar el sitio en Google* del README (redirecciones del sitio anterior incluidas).
- Antes de hacer commit o push, pide confirmación al usuario.
