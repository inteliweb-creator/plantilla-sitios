import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`pages_blocks_encabezado_pagina\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`eyebrow\` text,
  	\`titulo\` text,
  	\`enfasis\` text,
  	\`lead\` text,
  	\`destacado\` text,
  	\`destacado_meta\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_encabezado_pagina_order_idx\` ON \`pages_blocks_encabezado_pagina\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_encabezado_pagina_parent_id_idx\` ON \`pages_blocks_encabezado_pagina\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_encabezado_pagina_path_idx\` ON \`pages_blocks_encabezado_pagina\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_contacto_formulario_opciones\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`texto\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_contacto_formulario\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_contacto_formulario_opciones_order_idx\` ON \`pages_blocks_contacto_formulario_opciones\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_contacto_formulario_opciones_parent_id_idx\` ON \`pages_blocks_contacto_formulario_opciones\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_contacto_formulario\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`formulario_titulo\` text DEFAULT 'Escríbenos',
  	\`pregunta_opciones\` text DEFAULT 'Qué necesitas',
  	\`pregunta_mensaje\` text DEFAULT 'Cuéntanos un poco',
  	\`pista_mensaje\` text,
  	\`boton\` text DEFAULT 'Enviar mensaje',
  	\`nota_legal\` text,
  	\`exito_titulo\` text DEFAULT 'Recibimos tu mensaje',
  	\`exito_texto\` text DEFAULT 'Te respondemos muy pronto.',
  	\`directo_titulo\` text DEFAULT 'O directo, sin formulario',
  	\`mensaje_whatsapp\` text,
  	\`canales_whatsapp\` text,
  	\`canales_telefono\` text,
  	\`canales_correo\` text,
  	\`ubicacion_titulo\` text DEFAULT 'Dónde estamos',
  	\`ubicacion_nota\` text,
  	\`horario_titulo\` text DEFAULT 'Horario de atención',
  	\`boton_ficha\` text DEFAULT 'Ver nuestra ficha en Google',
  	\`enlace_ficha\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_contacto_formulario_order_idx\` ON \`pages_blocks_contacto_formulario\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_contacto_formulario_parent_id_idx\` ON \`pages_blocks_contacto_formulario\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_contacto_formulario_path_idx\` ON \`pages_blocks_contacto_formulario\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_boletin_suscripcion\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`variante\` text DEFAULT 'tarjeta',
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_boletin_suscripcion_order_idx\` ON \`pages_blocks_boletin_suscripcion\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_boletin_suscripcion_parent_id_idx\` ON \`pages_blocks_boletin_suscripcion\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_boletin_suscripcion_path_idx\` ON \`pages_blocks_boletin_suscripcion\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_recurso_gratis\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`recurso_id\` integer,
  	\`titulo\` text,
  	\`texto\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`recurso_id\`) REFERENCES \`recursos\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_recurso_gratis_order_idx\` ON \`pages_blocks_recurso_gratis\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_recurso_gratis_parent_id_idx\` ON \`pages_blocks_recurso_gratis\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_recurso_gratis_path_idx\` ON \`pages_blocks_recurso_gratis\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_recurso_gratis_recurso_idx\` ON \`pages_blocks_recurso_gratis\` (\`recurso_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_servicio_portada_municipios\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`texto\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_servicio_portada\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_servicio_portada_municipios_order_idx\` ON \`pages_blocks_servicio_portada_municipios\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_servicio_portada_municipios_parent_id_idx\` ON \`pages_blocks_servicio_portada_municipios\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_servicio_portada_chips\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`texto\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_servicio_portada\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_servicio_portada_chips_order_idx\` ON \`pages_blocks_servicio_portada_chips\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_servicio_portada_chips_parent_id_idx\` ON \`pages_blocks_servicio_portada_chips\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_servicio_portada\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`eyebrow\` text,
  	\`h1\` text,
  	\`h1_enfasis\` text,
  	\`lead\` text,
  	\`maqueta\` text DEFAULT 'sitio',
  	\`cita\` text,
  	\`cta\` text DEFAULT 'Escribir por WhatsApp',
  	\`boton_secundario\` text DEFAULT 'Calcular mi proyecto',
  	\`enlace_secundario\` text DEFAULT '/#cotizador',
  	\`mensaje_whatsapp\` text,
  	\`nombre_servicio\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_servicio_portada_order_idx\` ON \`pages_blocks_servicio_portada\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_servicio_portada_parent_id_idx\` ON \`pages_blocks_servicio_portada\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_servicio_portada_path_idx\` ON \`pages_blocks_servicio_portada\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_escena_iluminada\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`etiqueta\` text DEFAULT 'Te suena, ¿verdad?',
  	\`cita\` text,
  	\`cuerpo\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_escena_iluminada_order_idx\` ON \`pages_blocks_escena_iluminada\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_escena_iluminada_parent_id_idx\` ON \`pages_blocks_escena_iluminada\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_escena_iluminada_path_idx\` ON \`pages_blocks_escena_iluminada\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_caracteristicas_activas_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`titulo\` text,
  	\`desc\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_caracteristicas_activas\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_caracteristicas_activas_items_order_idx\` ON \`pages_blocks_caracteristicas_activas_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_caracteristicas_activas_items_parent_id_idx\` ON \`pages_blocks_caracteristicas_activas_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_caracteristicas_activas\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`eyebrow\` text,
  	\`titulo\` text,
  	\`enfasis\` text,
  	\`lead\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_caracteristicas_activas_order_idx\` ON \`pages_blocks_caracteristicas_activas\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_caracteristicas_activas_parent_id_idx\` ON \`pages_blocks_caracteristicas_activas\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_caracteristicas_activas_path_idx\` ON \`pages_blocks_caracteristicas_activas\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_pasos_linea_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`titulo\` text,
  	\`desc\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_pasos_linea\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_pasos_linea_items_order_idx\` ON \`pages_blocks_pasos_linea_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_pasos_linea_items_parent_id_idx\` ON \`pages_blocks_pasos_linea_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_pasos_linea\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`eyebrow\` text,
  	\`titulo\` text,
  	\`enfasis\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_pasos_linea_order_idx\` ON \`pages_blocks_pasos_linea\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_pasos_linea_parent_id_idx\` ON \`pages_blocks_pasos_linea\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_pasos_linea_path_idx\` ON \`pages_blocks_pasos_linea\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_desfile_casos\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`etiqueta\` text DEFAULT 'Trabajo publicado',
  	\`titulo\` text,
  	\`enfasis\` text,
  	\`lead\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_desfile_casos_order_idx\` ON \`pages_blocks_desfile_casos\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_desfile_casos_parent_id_idx\` ON \`pages_blocks_desfile_casos\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_desfile_casos_path_idx\` ON \`pages_blocks_desfile_casos\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_preguntas_servicio\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`etiqueta\` text DEFAULT 'Preguntas frecuentes',
  	\`titulo\` text,
  	\`enfasis\` text,
  	\`grupo\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_preguntas_servicio_order_idx\` ON \`pages_blocks_preguntas_servicio\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_preguntas_servicio_parent_id_idx\` ON \`pages_blocks_preguntas_servicio\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_preguntas_servicio_path_idx\` ON \`pages_blocks_preguntas_servicio\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_otros_servicios_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`titulo\` text,
  	\`enlace\` text,
  	\`descripcion\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_otros_servicios\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_otros_servicios_items_order_idx\` ON \`pages_blocks_otros_servicios_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_otros_servicios_items_parent_id_idx\` ON \`pages_blocks_otros_servicios_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_otros_servicios\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`etiqueta\` text DEFAULT 'Otros servicios',
  	\`titulo\` text,
  	\`enfasis\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_otros_servicios_order_idx\` ON \`pages_blocks_otros_servicios\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_otros_servicios_parent_id_idx\` ON \`pages_blocks_otros_servicios\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_otros_servicios_path_idx\` ON \`pages_blocks_otros_servicios\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_cierre_servicio\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`etiqueta\` text DEFAULT 'Empecemos',
  	\`titulo\` text,
  	\`enfasis\` text,
  	\`lead\` text,
  	\`cta\` text DEFAULT 'Escribir por WhatsApp',
  	\`boton_secundario\` text DEFAULT 'Calcular mi proyecto',
  	\`enlace_secundario\` text DEFAULT '/#cotizador',
  	\`mensaje_whatsapp\` text,
  	\`garantia\` text DEFAULT 'Sin ataduras ni cobros ocultos',
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_cierre_servicio_order_idx\` ON \`pages_blocks_cierre_servicio\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_cierre_servicio_parent_id_idx\` ON \`pages_blocks_cierre_servicio\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_cierre_servicio_path_idx\` ON \`pages_blocks_cierre_servicio\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_cobertura_municipios_municipios\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`texto\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_cobertura_municipios\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_cobertura_municipios_municipios_order_idx\` ON \`pages_blocks_cobertura_municipios_municipios\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_cobertura_municipios_municipios_parent_id_idx\` ON \`pages_blocks_cobertura_municipios_municipios\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_cobertura_municipios\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`etiqueta\` text DEFAULT 'Dónde atendemos',
  	\`titulo\` text,
  	\`enfasis\` text,
  	\`lead\` text,
  	\`nota\` text,
  	\`boton\` text DEFAULT 'Ver nuestra ficha en Google',
  	\`enlace_boton\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_cobertura_municipios_order_idx\` ON \`pages_blocks_cobertura_municipios\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_cobertura_municipios_parent_id_idx\` ON \`pages_blocks_cobertura_municipios\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_cobertura_municipios_path_idx\` ON \`pages_blocks_cobertura_municipios\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_comparativa_opciones_filas\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`tema\` text,
  	\`otra\` text,
  	\`propia\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_comparativa_opciones\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_comparativa_opciones_filas_order_idx\` ON \`pages_blocks_comparativa_opciones_filas\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_comparativa_opciones_filas_parent_id_idx\` ON \`pages_blocks_comparativa_opciones_filas\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_comparativa_opciones\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`etiqueta\` text DEFAULT 'Antes de decidir',
  	\`titulo\` text,
  	\`enfasis\` text,
  	\`lead\` text,
  	\`etiqueta_otra\` text DEFAULT 'La otra opción',
  	\`etiqueta_propia\` text DEFAULT 'Con nosotros',
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_comparativa_opciones_order_idx\` ON \`pages_blocks_comparativa_opciones\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_comparativa_opciones_parent_id_idx\` ON \`pages_blocks_comparativa_opciones\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_comparativa_opciones_path_idx\` ON \`pages_blocks_comparativa_opciones\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_portada_paisaje_barra\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`etiqueta\` text,
  	\`valor\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_portada_paisaje\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_portada_paisaje_barra_order_idx\` ON \`pages_blocks_portada_paisaje_barra\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_portada_paisaje_barra_parent_id_idx\` ON \`pages_blocks_portada_paisaje_barra\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_portada_paisaje\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`eyebrow\` text DEFAULT 'Tu ciudad',
  	\`h1\` text,
  	\`h1_enfasis\` text,
  	\`texto_clientes\` text,
  	\`cta_primario_texto\` text DEFAULT 'Escríbenos',
  	\`cta_secundario_texto\` text DEFAULT 'Ver más',
  	\`enlace_secundario\` text DEFAULT '#cotizador',
  	\`mensaje_whatsapp\` text,
  	\`palabra_fondo\` text,
  	\`texto_bajar\` text DEFAULT 'Baja para ver más',
  	\`boton_cabecera\` text DEFAULT 'Hablemos',
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_portada_paisaje_order_idx\` ON \`pages_blocks_portada_paisaje\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_portada_paisaje_parent_id_idx\` ON \`pages_blocks_portada_paisaje\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_portada_paisaje_path_idx\` ON \`pages_blocks_portada_paisaje\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_escenas_problema_escenas\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`nombre\` text,
  	\`etiqueta\` text,
  	\`maqueta\` text DEFAULT 'google',
  	\`titulo\` text,
  	\`texto\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_escenas_problema\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_escenas_problema_escenas_order_idx\` ON \`pages_blocks_escenas_problema_escenas\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_escenas_problema_escenas_parent_id_idx\` ON \`pages_blocks_escenas_problema_escenas\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_escenas_problema\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`eyebrow\` text,
  	\`titulo\` text,
  	\`enfasis\` text,
  	\`cuerpo\` text,
  	\`cierre\` text,
  	\`cierre_enfasis\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_escenas_problema_order_idx\` ON \`pages_blocks_escenas_problema\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_escenas_problema_parent_id_idx\` ON \`pages_blocks_escenas_problema\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_escenas_problema_path_idx\` ON \`pages_blocks_escenas_problema\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_soluciones_pestanas_items_puntos\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`texto\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_soluciones_pestanas_items\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_soluciones_pestanas_items_puntos_order_idx\` ON \`pages_blocks_soluciones_pestanas_items_puntos\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_soluciones_pestanas_items_puntos_parent_id_idx\` ON \`pages_blocks_soluciones_pestanas_items_puntos\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_soluciones_pestanas_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`etiqueta\` text,
  	\`widget\` text DEFAULT 'google',
  	\`titulo\` text,
  	\`desc\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_soluciones_pestanas\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_soluciones_pestanas_items_order_idx\` ON \`pages_blocks_soluciones_pestanas_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_soluciones_pestanas_items_parent_id_idx\` ON \`pages_blocks_soluciones_pestanas_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_soluciones_pestanas\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`eyebrow\` text,
  	\`titulo\` text,
  	\`enfasis\` text,
  	\`pista\` text DEFAULT 'Toca o desliza para ver las {n} soluciones',
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_soluciones_pestanas_order_idx\` ON \`pages_blocks_soluciones_pestanas\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_soluciones_pestanas_parent_id_idx\` ON \`pages_blocks_soluciones_pestanas\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_soluciones_pestanas_path_idx\` ON \`pages_blocks_soluciones_pestanas\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_servicios_lista_items_puntos\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`texto\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_servicios_lista_items\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_servicios_lista_items_puntos_order_idx\` ON \`pages_blocks_servicios_lista_items_puntos\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_servicios_lista_items_puntos_parent_id_idx\` ON \`pages_blocks_servicios_lista_items_puntos\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_servicios_lista_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`titulo\` text,
  	\`lema\` text,
  	\`etiqueta\` text,
  	\`enlace\` text,
  	\`desc\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_servicios_lista\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_servicios_lista_items_order_idx\` ON \`pages_blocks_servicios_lista_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_servicios_lista_items_parent_id_idx\` ON \`pages_blocks_servicios_lista_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_servicios_lista\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`eyebrow\` text,
  	\`titulo\` text,
  	\`enfasis\` text,
  	\`lead\` text,
  	\`nota\` text,
  	\`texto_ver\` text DEFAULT 'Ver',
  	\`texto_cotizar\` text DEFAULT 'Cotizar',
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_servicios_lista_order_idx\` ON \`pages_blocks_servicios_lista\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_servicios_lista_parent_id_idx\` ON \`pages_blocks_servicios_lista\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_servicios_lista_path_idx\` ON \`pages_blocks_servicios_lista\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_casos_cinta\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`eyebrow\` text,
  	\`titulo\` text,
  	\`enfasis\` text,
  	\`lead\` text,
  	\`texto_ver\` text DEFAULT 'Ver el sitio',
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_casos_cinta_order_idx\` ON \`pages_blocks_casos_cinta\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_casos_cinta_parent_id_idx\` ON \`pages_blocks_casos_cinta\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_casos_cinta_path_idx\` ON \`pages_blocks_casos_cinta\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_franja_llamada\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`frase\` text,
  	\`enfasis\` text,
  	\`boton\` text DEFAULT 'Escríbenos',
  	\`boton_secundario\` text DEFAULT 'Ver más',
  	\`enlace_secundario\` text DEFAULT '#cotizador',
  	\`mensaje_whatsapp\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_franja_llamada_order_idx\` ON \`pages_blocks_franja_llamada\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_franja_llamada_parent_id_idx\` ON \`pages_blocks_franja_llamada\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_franja_llamada_path_idx\` ON \`pages_blocks_franja_llamada\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_panel_control_pantallas_campos\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`etiqueta\` text,
  	\`valor\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_panel_control_pantallas\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_panel_control_pantallas_campos_order_idx\` ON \`pages_blocks_panel_control_pantallas_campos\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_panel_control_pantallas_campos_parent_id_idx\` ON \`pages_blocks_panel_control_pantallas_campos\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_panel_control_pantallas\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`pestana\` text,
  	\`titulo\` text,
  	\`resumen\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_panel_control\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_panel_control_pantallas_order_idx\` ON \`pages_blocks_panel_control_pantallas\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_panel_control_pantallas_parent_id_idx\` ON \`pages_blocks_panel_control_pantallas\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_panel_control_ahorro\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`texto\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_panel_control\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_panel_control_ahorro_order_idx\` ON \`pages_blocks_panel_control_ahorro\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_panel_control_ahorro_parent_id_idx\` ON \`pages_blocks_panel_control_ahorro\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_panel_control\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`eyebrow\` text,
  	\`titulo\` text,
  	\`enfasis\` text,
  	\`lead\` text,
  	\`direccion\` text DEFAULT 'tunegocio.com/panel',
  	\`pie\` text,
  	\`ahorro_titulo\` text,
  	\`nota\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_panel_control_order_idx\` ON \`pages_blocks_panel_control\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_panel_control_parent_id_idx\` ON \`pages_blocks_panel_control\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_panel_control_path_idx\` ON \`pages_blocks_panel_control\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_proceso_pasos_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`titulo\` text,
  	\`desc\` text,
  	\`detalle\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_proceso_pasos\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_proceso_pasos_items_order_idx\` ON \`pages_blocks_proceso_pasos_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_proceso_pasos_items_parent_id_idx\` ON \`pages_blocks_proceso_pasos_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_proceso_pasos\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`eyebrow\` text,
  	\`titulo\` text,
  	\`enfasis\` text,
  	\`lead\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_proceso_pasos_order_idx\` ON \`pages_blocks_proceso_pasos\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_proceso_pasos_parent_id_idx\` ON \`pages_blocks_proceso_pasos\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_proceso_pasos_path_idx\` ON \`pages_blocks_proceso_pasos\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_cotizador_whatsapp_tipos\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`label\` text,
  	\`desc\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_cotizador_whatsapp\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_cotizador_whatsapp_tipos_order_idx\` ON \`pages_blocks_cotizador_whatsapp_tipos\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_cotizador_whatsapp_tipos_parent_id_idx\` ON \`pages_blocks_cotizador_whatsapp_tipos\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_cotizador_whatsapp_tamanos\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`texto\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_cotizador_whatsapp\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_cotizador_whatsapp_tamanos_order_idx\` ON \`pages_blocks_cotizador_whatsapp_tamanos\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_cotizador_whatsapp_tamanos_parent_id_idx\` ON \`pages_blocks_cotizador_whatsapp_tamanos\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_cotizador_whatsapp_extras\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`texto\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_cotizador_whatsapp\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_cotizador_whatsapp_extras_order_idx\` ON \`pages_blocks_cotizador_whatsapp_extras\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_cotizador_whatsapp_extras_parent_id_idx\` ON \`pages_blocks_cotizador_whatsapp_extras\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_cotizador_whatsapp_plazos\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`texto\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_cotizador_whatsapp\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_cotizador_whatsapp_plazos_order_idx\` ON \`pages_blocks_cotizador_whatsapp_plazos\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_cotizador_whatsapp_plazos_parent_id_idx\` ON \`pages_blocks_cotizador_whatsapp_plazos\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_cotizador_whatsapp\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`eyebrow\` text,
  	\`titulo\` text,
  	\`enfasis\` text,
  	\`lead\` text,
  	\`pregunta_tipo\` text DEFAULT '01 · Qué necesitas',
  	\`pregunta_tamano\` text DEFAULT '02 · De qué tamaño',
  	\`pregunta_extras\` text DEFAULT '03 · Qué más te haría falta',
  	\`pregunta_plazo\` text DEFAULT '04 · Para cuándo',
  	\`pregunta_negocio\` text DEFAULT 'Opcional · Cómo se llama tu negocio',
  	\`ejemplo_negocio\` text,
  	\`titulo_mensaje\` text DEFAULT 'Tu mensaje, ya escrito',
  	\`saludo\` text DEFAULT 'Hola, quiero cotizar un proyecto.',
  	\`boton\` text DEFAULT 'Enviarlo por WhatsApp',
  	\`nota\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_cotizador_whatsapp_order_idx\` ON \`pages_blocks_cotizador_whatsapp\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_cotizador_whatsapp_parent_id_idx\` ON \`pages_blocks_cotizador_whatsapp\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_cotizador_whatsapp_path_idx\` ON \`pages_blocks_cotizador_whatsapp\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_confianza_datos_datos\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`etiqueta\` text,
  	\`valor\` text,
  	\`nota\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_confianza_datos\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_confianza_datos_datos_order_idx\` ON \`pages_blocks_confianza_datos_datos\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_confianza_datos_datos_parent_id_idx\` ON \`pages_blocks_confianza_datos_datos\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_confianza_datos\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`eyebrow\` text,
  	\`titulo\` text,
  	\`enfasis\` text,
  	\`lead\` text,
  	\`boton\` text DEFAULT 'Escribir por WhatsApp',
  	\`mensaje_whatsapp\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_confianza_datos_order_idx\` ON \`pages_blocks_confianza_datos\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_confianza_datos_parent_id_idx\` ON \`pages_blocks_confianza_datos\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_confianza_datos_path_idx\` ON \`pages_blocks_confianza_datos\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_preguntas_frecuentes\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`eyebrow\` text,
  	\`titulo\` text,
  	\`enfasis\` text,
  	\`grupo\` text,
  	\`otra_duda_titulo\` text DEFAULT '¿Tienes otra duda?',
  	\`otra_duda_texto\` text DEFAULT 'Escríbenos sin compromiso.',
  	\`boton\` text DEFAULT 'Hacer una pregunta',
  	\`mensaje_whatsapp\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_preguntas_frecuentes_order_idx\` ON \`pages_blocks_preguntas_frecuentes\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_preguntas_frecuentes_parent_id_idx\` ON \`pages_blocks_preguntas_frecuentes\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_preguntas_frecuentes_path_idx\` ON \`pages_blocks_preguntas_frecuentes\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_cierre_negro_garantias\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`texto\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_cierre_negro\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_cierre_negro_garantias_order_idx\` ON \`pages_blocks_cierre_negro_garantias\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_cierre_negro_garantias_parent_id_idx\` ON \`pages_blocks_cierre_negro_garantias\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_cierre_negro\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`eyebrow\` text,
  	\`titulo\` text,
  	\`enfasis\` text,
  	\`lead\` text,
  	\`boton\` text DEFAULT 'Escríbenos',
  	\`mensaje_whatsapp\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_cierre_negro_order_idx\` ON \`pages_blocks_cierre_negro\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_cierre_negro_parent_id_idx\` ON \`pages_blocks_cierre_negro\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_cierre_negro_path_idx\` ON \`pages_blocks_cierre_negro\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_cta_links\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`link_type\` text DEFAULT 'reference',
  	\`link_new_tab\` integer,
  	\`link_url\` text,
  	\`link_label\` text,
  	\`link_appearance\` text DEFAULT 'default',
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_cta\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_cta_links_order_idx\` ON \`pages_blocks_cta_links\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_cta_links_parent_id_idx\` ON \`pages_blocks_cta_links\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_cta\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`rich_text\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_cta_order_idx\` ON \`pages_blocks_cta\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_cta_parent_id_idx\` ON \`pages_blocks_cta\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_cta_path_idx\` ON \`pages_blocks_cta\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_content_columns\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`size\` text DEFAULT 'oneThird',
  	\`rich_text\` text,
  	\`enable_link\` integer,
  	\`link_type\` text DEFAULT 'reference',
  	\`link_new_tab\` integer,
  	\`link_url\` text,
  	\`link_label\` text,
  	\`link_appearance\` text DEFAULT 'default',
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_content\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_content_columns_order_idx\` ON \`pages_blocks_content_columns\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_content_columns_parent_id_idx\` ON \`pages_blocks_content_columns\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_content\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_content_order_idx\` ON \`pages_blocks_content\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_content_parent_id_idx\` ON \`pages_blocks_content\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_content_path_idx\` ON \`pages_blocks_content\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_media_block\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`media_id\` integer,
  	\`block_name\` text,
  	FOREIGN KEY (\`media_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_media_block_order_idx\` ON \`pages_blocks_media_block\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_media_block_parent_id_idx\` ON \`pages_blocks_media_block\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_media_block_path_idx\` ON \`pages_blocks_media_block\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_media_block_media_idx\` ON \`pages_blocks_media_block\` (\`media_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_archive\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`intro_content\` text,
  	\`populate_by\` text DEFAULT 'collection',
  	\`relation_to\` text DEFAULT 'products',
  	\`limit\` numeric DEFAULT 10,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_archive_order_idx\` ON \`pages_blocks_archive\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_archive_parent_id_idx\` ON \`pages_blocks_archive\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_archive_path_idx\` ON \`pages_blocks_archive\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_carousel\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`populate_by\` text DEFAULT 'collection',
  	\`relation_to\` text DEFAULT 'products',
  	\`limit\` numeric DEFAULT 10,
  	\`populated_docs_total\` numeric,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_carousel_order_idx\` ON \`pages_blocks_carousel\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_carousel_parent_id_idx\` ON \`pages_blocks_carousel\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_carousel_path_idx\` ON \`pages_blocks_carousel\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_three_item_grid\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_three_item_grid_order_idx\` ON \`pages_blocks_three_item_grid\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_three_item_grid_parent_id_idx\` ON \`pages_blocks_three_item_grid\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_three_item_grid_path_idx\` ON \`pages_blocks_three_item_grid\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_banner\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`style\` text DEFAULT 'info',
  	\`content\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_banner_order_idx\` ON \`pages_blocks_banner\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_banner_parent_id_idx\` ON \`pages_blocks_banner\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_banner_path_idx\` ON \`pages_blocks_banner\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_form_block\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`form_id\` integer,
  	\`enable_intro\` integer,
  	\`intro_content\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`form_id\`) REFERENCES \`forms\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_form_block_order_idx\` ON \`pages_blocks_form_block\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_form_block_parent_id_idx\` ON \`pages_blocks_form_block\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_form_block_path_idx\` ON \`pages_blocks_form_block\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_form_block_form_idx\` ON \`pages_blocks_form_block\` (\`form_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_hero_links\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`link_type\` text DEFAULT 'reference',
  	\`link_new_tab\` integer,
  	\`link_url\` text,
  	\`link_label\` text,
  	\`link_appearance\` text DEFAULT 'default',
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_hero_links_order_idx\` ON \`pages_hero_links\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_hero_links_parent_id_idx\` ON \`pages_hero_links\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`pages\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`published_on\` text,
  	\`hero_type\` text DEFAULT 'lowImpact',
  	\`hero_rich_text\` text,
  	\`hero_media_id\` integer,
  	\`meta_title\` text,
  	\`meta_image_id\` integer,
  	\`meta_description\` text,
  	\`generate_slug\` integer DEFAULT true,
  	\`slug\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`_status\` text DEFAULT 'draft',
  	FOREIGN KEY (\`hero_media_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`meta_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_hero_hero_media_idx\` ON \`pages\` (\`hero_media_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_meta_meta_image_idx\` ON \`pages\` (\`meta_image_id\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`pages_slug_idx\` ON \`pages\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX \`pages_updated_at_idx\` ON \`pages\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`pages_created_at_idx\` ON \`pages\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`pages__status_idx\` ON \`pages\` (\`_status\`);`)
  await db.run(sql`CREATE TABLE \`pages_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`pages_id\` integer,
  	\`categories_id\` integer,
  	\`products_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`pages_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`categories_id\`) REFERENCES \`categories\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`products_id\`) REFERENCES \`products\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_rels_order_idx\` ON \`pages_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`pages_rels_parent_idx\` ON \`pages_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_rels_path_idx\` ON \`pages_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`pages_rels_pages_id_idx\` ON \`pages_rels\` (\`pages_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_rels_categories_id_idx\` ON \`pages_rels\` (\`categories_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_rels_products_id_idx\` ON \`pages_rels\` (\`products_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_encabezado_pagina\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`eyebrow\` text,
  	\`titulo\` text,
  	\`enfasis\` text,
  	\`lead\` text,
  	\`destacado\` text,
  	\`destacado_meta\` text,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_encabezado_pagina_order_idx\` ON \`_pages_v_blocks_encabezado_pagina\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_encabezado_pagina_parent_id_idx\` ON \`_pages_v_blocks_encabezado_pagina\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_encabezado_pagina_path_idx\` ON \`_pages_v_blocks_encabezado_pagina\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_contacto_formulario_opciones\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`texto\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v_blocks_contacto_formulario\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_contacto_formulario_opciones_order_idx\` ON \`_pages_v_blocks_contacto_formulario_opciones\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_contacto_formulario_opciones_parent_id_idx\` ON \`_pages_v_blocks_contacto_formulario_opciones\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_contacto_formulario\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`formulario_titulo\` text DEFAULT 'Escríbenos',
  	\`pregunta_opciones\` text DEFAULT 'Qué necesitas',
  	\`pregunta_mensaje\` text DEFAULT 'Cuéntanos un poco',
  	\`pista_mensaje\` text,
  	\`boton\` text DEFAULT 'Enviar mensaje',
  	\`nota_legal\` text,
  	\`exito_titulo\` text DEFAULT 'Recibimos tu mensaje',
  	\`exito_texto\` text DEFAULT 'Te respondemos muy pronto.',
  	\`directo_titulo\` text DEFAULT 'O directo, sin formulario',
  	\`mensaje_whatsapp\` text,
  	\`canales_whatsapp\` text,
  	\`canales_telefono\` text,
  	\`canales_correo\` text,
  	\`ubicacion_titulo\` text DEFAULT 'Dónde estamos',
  	\`ubicacion_nota\` text,
  	\`horario_titulo\` text DEFAULT 'Horario de atención',
  	\`boton_ficha\` text DEFAULT 'Ver nuestra ficha en Google',
  	\`enlace_ficha\` text,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_contacto_formulario_order_idx\` ON \`_pages_v_blocks_contacto_formulario\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_contacto_formulario_parent_id_idx\` ON \`_pages_v_blocks_contacto_formulario\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_contacto_formulario_path_idx\` ON \`_pages_v_blocks_contacto_formulario\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_boletin_suscripcion\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`variante\` text DEFAULT 'tarjeta',
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_boletin_suscripcion_order_idx\` ON \`_pages_v_blocks_boletin_suscripcion\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_boletin_suscripcion_parent_id_idx\` ON \`_pages_v_blocks_boletin_suscripcion\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_boletin_suscripcion_path_idx\` ON \`_pages_v_blocks_boletin_suscripcion\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_recurso_gratis\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`recurso_id\` integer,
  	\`titulo\` text,
  	\`texto\` text,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`recurso_id\`) REFERENCES \`recursos\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_recurso_gratis_order_idx\` ON \`_pages_v_blocks_recurso_gratis\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_recurso_gratis_parent_id_idx\` ON \`_pages_v_blocks_recurso_gratis\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_recurso_gratis_path_idx\` ON \`_pages_v_blocks_recurso_gratis\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_recurso_gratis_recurso_idx\` ON \`_pages_v_blocks_recurso_gratis\` (\`recurso_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_servicio_portada_municipios\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`texto\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v_blocks_servicio_portada\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_servicio_portada_municipios_order_idx\` ON \`_pages_v_blocks_servicio_portada_municipios\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_servicio_portada_municipios_parent_id_idx\` ON \`_pages_v_blocks_servicio_portada_municipios\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_servicio_portada_chips\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`texto\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v_blocks_servicio_portada\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_servicio_portada_chips_order_idx\` ON \`_pages_v_blocks_servicio_portada_chips\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_servicio_portada_chips_parent_id_idx\` ON \`_pages_v_blocks_servicio_portada_chips\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_servicio_portada\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`eyebrow\` text,
  	\`h1\` text,
  	\`h1_enfasis\` text,
  	\`lead\` text,
  	\`maqueta\` text DEFAULT 'sitio',
  	\`cita\` text,
  	\`cta\` text DEFAULT 'Escribir por WhatsApp',
  	\`boton_secundario\` text DEFAULT 'Calcular mi proyecto',
  	\`enlace_secundario\` text DEFAULT '/#cotizador',
  	\`mensaje_whatsapp\` text,
  	\`nombre_servicio\` text,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_servicio_portada_order_idx\` ON \`_pages_v_blocks_servicio_portada\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_servicio_portada_parent_id_idx\` ON \`_pages_v_blocks_servicio_portada\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_servicio_portada_path_idx\` ON \`_pages_v_blocks_servicio_portada\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_escena_iluminada\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`etiqueta\` text DEFAULT 'Te suena, ¿verdad?',
  	\`cita\` text,
  	\`cuerpo\` text,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_escena_iluminada_order_idx\` ON \`_pages_v_blocks_escena_iluminada\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_escena_iluminada_parent_id_idx\` ON \`_pages_v_blocks_escena_iluminada\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_escena_iluminada_path_idx\` ON \`_pages_v_blocks_escena_iluminada\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_caracteristicas_activas_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`titulo\` text,
  	\`desc\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v_blocks_caracteristicas_activas\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_caracteristicas_activas_items_order_idx\` ON \`_pages_v_blocks_caracteristicas_activas_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_caracteristicas_activas_items_parent_id_idx\` ON \`_pages_v_blocks_caracteristicas_activas_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_caracteristicas_activas\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`eyebrow\` text,
  	\`titulo\` text,
  	\`enfasis\` text,
  	\`lead\` text,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_caracteristicas_activas_order_idx\` ON \`_pages_v_blocks_caracteristicas_activas\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_caracteristicas_activas_parent_id_idx\` ON \`_pages_v_blocks_caracteristicas_activas\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_caracteristicas_activas_path_idx\` ON \`_pages_v_blocks_caracteristicas_activas\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_pasos_linea_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`titulo\` text,
  	\`desc\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v_blocks_pasos_linea\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_pasos_linea_items_order_idx\` ON \`_pages_v_blocks_pasos_linea_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_pasos_linea_items_parent_id_idx\` ON \`_pages_v_blocks_pasos_linea_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_pasos_linea\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`eyebrow\` text,
  	\`titulo\` text,
  	\`enfasis\` text,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_pasos_linea_order_idx\` ON \`_pages_v_blocks_pasos_linea\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_pasos_linea_parent_id_idx\` ON \`_pages_v_blocks_pasos_linea\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_pasos_linea_path_idx\` ON \`_pages_v_blocks_pasos_linea\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_desfile_casos\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`etiqueta\` text DEFAULT 'Trabajo publicado',
  	\`titulo\` text,
  	\`enfasis\` text,
  	\`lead\` text,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_desfile_casos_order_idx\` ON \`_pages_v_blocks_desfile_casos\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_desfile_casos_parent_id_idx\` ON \`_pages_v_blocks_desfile_casos\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_desfile_casos_path_idx\` ON \`_pages_v_blocks_desfile_casos\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_preguntas_servicio\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`etiqueta\` text DEFAULT 'Preguntas frecuentes',
  	\`titulo\` text,
  	\`enfasis\` text,
  	\`grupo\` text,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_preguntas_servicio_order_idx\` ON \`_pages_v_blocks_preguntas_servicio\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_preguntas_servicio_parent_id_idx\` ON \`_pages_v_blocks_preguntas_servicio\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_preguntas_servicio_path_idx\` ON \`_pages_v_blocks_preguntas_servicio\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_otros_servicios_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`titulo\` text,
  	\`enlace\` text,
  	\`descripcion\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v_blocks_otros_servicios\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_otros_servicios_items_order_idx\` ON \`_pages_v_blocks_otros_servicios_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_otros_servicios_items_parent_id_idx\` ON \`_pages_v_blocks_otros_servicios_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_otros_servicios\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`etiqueta\` text DEFAULT 'Otros servicios',
  	\`titulo\` text,
  	\`enfasis\` text,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_otros_servicios_order_idx\` ON \`_pages_v_blocks_otros_servicios\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_otros_servicios_parent_id_idx\` ON \`_pages_v_blocks_otros_servicios\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_otros_servicios_path_idx\` ON \`_pages_v_blocks_otros_servicios\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_cierre_servicio\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`etiqueta\` text DEFAULT 'Empecemos',
  	\`titulo\` text,
  	\`enfasis\` text,
  	\`lead\` text,
  	\`cta\` text DEFAULT 'Escribir por WhatsApp',
  	\`boton_secundario\` text DEFAULT 'Calcular mi proyecto',
  	\`enlace_secundario\` text DEFAULT '/#cotizador',
  	\`mensaje_whatsapp\` text,
  	\`garantia\` text DEFAULT 'Sin ataduras ni cobros ocultos',
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_cierre_servicio_order_idx\` ON \`_pages_v_blocks_cierre_servicio\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_cierre_servicio_parent_id_idx\` ON \`_pages_v_blocks_cierre_servicio\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_cierre_servicio_path_idx\` ON \`_pages_v_blocks_cierre_servicio\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_cobertura_municipios_municipios\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`texto\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v_blocks_cobertura_municipios\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_cobertura_municipios_municipios_order_idx\` ON \`_pages_v_blocks_cobertura_municipios_municipios\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_cobertura_municipios_municipios_parent_id_idx\` ON \`_pages_v_blocks_cobertura_municipios_municipios\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_cobertura_municipios\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`etiqueta\` text DEFAULT 'Dónde atendemos',
  	\`titulo\` text,
  	\`enfasis\` text,
  	\`lead\` text,
  	\`nota\` text,
  	\`boton\` text DEFAULT 'Ver nuestra ficha en Google',
  	\`enlace_boton\` text,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_cobertura_municipios_order_idx\` ON \`_pages_v_blocks_cobertura_municipios\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_cobertura_municipios_parent_id_idx\` ON \`_pages_v_blocks_cobertura_municipios\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_cobertura_municipios_path_idx\` ON \`_pages_v_blocks_cobertura_municipios\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_comparativa_opciones_filas\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`tema\` text,
  	\`otra\` text,
  	\`propia\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v_blocks_comparativa_opciones\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_comparativa_opciones_filas_order_idx\` ON \`_pages_v_blocks_comparativa_opciones_filas\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_comparativa_opciones_filas_parent_id_idx\` ON \`_pages_v_blocks_comparativa_opciones_filas\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_comparativa_opciones\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`etiqueta\` text DEFAULT 'Antes de decidir',
  	\`titulo\` text,
  	\`enfasis\` text,
  	\`lead\` text,
  	\`etiqueta_otra\` text DEFAULT 'La otra opción',
  	\`etiqueta_propia\` text DEFAULT 'Con nosotros',
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_comparativa_opciones_order_idx\` ON \`_pages_v_blocks_comparativa_opciones\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_comparativa_opciones_parent_id_idx\` ON \`_pages_v_blocks_comparativa_opciones\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_comparativa_opciones_path_idx\` ON \`_pages_v_blocks_comparativa_opciones\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_portada_paisaje_barra\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`etiqueta\` text,
  	\`valor\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v_blocks_portada_paisaje\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_portada_paisaje_barra_order_idx\` ON \`_pages_v_blocks_portada_paisaje_barra\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_portada_paisaje_barra_parent_id_idx\` ON \`_pages_v_blocks_portada_paisaje_barra\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_portada_paisaje\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`eyebrow\` text DEFAULT 'Tu ciudad',
  	\`h1\` text,
  	\`h1_enfasis\` text,
  	\`texto_clientes\` text,
  	\`cta_primario_texto\` text DEFAULT 'Escríbenos',
  	\`cta_secundario_texto\` text DEFAULT 'Ver más',
  	\`enlace_secundario\` text DEFAULT '#cotizador',
  	\`mensaje_whatsapp\` text,
  	\`palabra_fondo\` text,
  	\`texto_bajar\` text DEFAULT 'Baja para ver más',
  	\`boton_cabecera\` text DEFAULT 'Hablemos',
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_portada_paisaje_order_idx\` ON \`_pages_v_blocks_portada_paisaje\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_portada_paisaje_parent_id_idx\` ON \`_pages_v_blocks_portada_paisaje\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_portada_paisaje_path_idx\` ON \`_pages_v_blocks_portada_paisaje\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_escenas_problema_escenas\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`nombre\` text,
  	\`etiqueta\` text,
  	\`maqueta\` text DEFAULT 'google',
  	\`titulo\` text,
  	\`texto\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v_blocks_escenas_problema\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_escenas_problema_escenas_order_idx\` ON \`_pages_v_blocks_escenas_problema_escenas\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_escenas_problema_escenas_parent_id_idx\` ON \`_pages_v_blocks_escenas_problema_escenas\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_escenas_problema\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`eyebrow\` text,
  	\`titulo\` text,
  	\`enfasis\` text,
  	\`cuerpo\` text,
  	\`cierre\` text,
  	\`cierre_enfasis\` text,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_escenas_problema_order_idx\` ON \`_pages_v_blocks_escenas_problema\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_escenas_problema_parent_id_idx\` ON \`_pages_v_blocks_escenas_problema\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_escenas_problema_path_idx\` ON \`_pages_v_blocks_escenas_problema\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_soluciones_pestanas_items_puntos\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`texto\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v_blocks_soluciones_pestanas_items\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_soluciones_pestanas_items_puntos_order_idx\` ON \`_pages_v_blocks_soluciones_pestanas_items_puntos\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_soluciones_pestanas_items_puntos_parent_id_idx\` ON \`_pages_v_blocks_soluciones_pestanas_items_puntos\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_soluciones_pestanas_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`etiqueta\` text,
  	\`widget\` text DEFAULT 'google',
  	\`titulo\` text,
  	\`desc\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v_blocks_soluciones_pestanas\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_soluciones_pestanas_items_order_idx\` ON \`_pages_v_blocks_soluciones_pestanas_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_soluciones_pestanas_items_parent_id_idx\` ON \`_pages_v_blocks_soluciones_pestanas_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_soluciones_pestanas\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`eyebrow\` text,
  	\`titulo\` text,
  	\`enfasis\` text,
  	\`pista\` text DEFAULT 'Toca o desliza para ver las {n} soluciones',
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_soluciones_pestanas_order_idx\` ON \`_pages_v_blocks_soluciones_pestanas\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_soluciones_pestanas_parent_id_idx\` ON \`_pages_v_blocks_soluciones_pestanas\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_soluciones_pestanas_path_idx\` ON \`_pages_v_blocks_soluciones_pestanas\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_servicios_lista_items_puntos\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`texto\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v_blocks_servicios_lista_items\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_servicios_lista_items_puntos_order_idx\` ON \`_pages_v_blocks_servicios_lista_items_puntos\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_servicios_lista_items_puntos_parent_id_idx\` ON \`_pages_v_blocks_servicios_lista_items_puntos\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_servicios_lista_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`titulo\` text,
  	\`lema\` text,
  	\`etiqueta\` text,
  	\`enlace\` text,
  	\`desc\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v_blocks_servicios_lista\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_servicios_lista_items_order_idx\` ON \`_pages_v_blocks_servicios_lista_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_servicios_lista_items_parent_id_idx\` ON \`_pages_v_blocks_servicios_lista_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_servicios_lista\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`eyebrow\` text,
  	\`titulo\` text,
  	\`enfasis\` text,
  	\`lead\` text,
  	\`nota\` text,
  	\`texto_ver\` text DEFAULT 'Ver',
  	\`texto_cotizar\` text DEFAULT 'Cotizar',
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_servicios_lista_order_idx\` ON \`_pages_v_blocks_servicios_lista\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_servicios_lista_parent_id_idx\` ON \`_pages_v_blocks_servicios_lista\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_servicios_lista_path_idx\` ON \`_pages_v_blocks_servicios_lista\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_casos_cinta\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`eyebrow\` text,
  	\`titulo\` text,
  	\`enfasis\` text,
  	\`lead\` text,
  	\`texto_ver\` text DEFAULT 'Ver el sitio',
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_casos_cinta_order_idx\` ON \`_pages_v_blocks_casos_cinta\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_casos_cinta_parent_id_idx\` ON \`_pages_v_blocks_casos_cinta\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_casos_cinta_path_idx\` ON \`_pages_v_blocks_casos_cinta\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_franja_llamada\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`frase\` text,
  	\`enfasis\` text,
  	\`boton\` text DEFAULT 'Escríbenos',
  	\`boton_secundario\` text DEFAULT 'Ver más',
  	\`enlace_secundario\` text DEFAULT '#cotizador',
  	\`mensaje_whatsapp\` text,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_franja_llamada_order_idx\` ON \`_pages_v_blocks_franja_llamada\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_franja_llamada_parent_id_idx\` ON \`_pages_v_blocks_franja_llamada\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_franja_llamada_path_idx\` ON \`_pages_v_blocks_franja_llamada\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_panel_control_pantallas_campos\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`etiqueta\` text,
  	\`valor\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v_blocks_panel_control_pantallas\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_panel_control_pantallas_campos_order_idx\` ON \`_pages_v_blocks_panel_control_pantallas_campos\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_panel_control_pantallas_campos_parent_id_idx\` ON \`_pages_v_blocks_panel_control_pantallas_campos\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_panel_control_pantallas\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`pestana\` text,
  	\`titulo\` text,
  	\`resumen\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v_blocks_panel_control\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_panel_control_pantallas_order_idx\` ON \`_pages_v_blocks_panel_control_pantallas\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_panel_control_pantallas_parent_id_idx\` ON \`_pages_v_blocks_panel_control_pantallas\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_panel_control_ahorro\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`texto\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v_blocks_panel_control\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_panel_control_ahorro_order_idx\` ON \`_pages_v_blocks_panel_control_ahorro\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_panel_control_ahorro_parent_id_idx\` ON \`_pages_v_blocks_panel_control_ahorro\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_panel_control\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`eyebrow\` text,
  	\`titulo\` text,
  	\`enfasis\` text,
  	\`lead\` text,
  	\`direccion\` text DEFAULT 'tunegocio.com/panel',
  	\`pie\` text,
  	\`ahorro_titulo\` text,
  	\`nota\` text,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_panel_control_order_idx\` ON \`_pages_v_blocks_panel_control\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_panel_control_parent_id_idx\` ON \`_pages_v_blocks_panel_control\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_panel_control_path_idx\` ON \`_pages_v_blocks_panel_control\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_proceso_pasos_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`titulo\` text,
  	\`desc\` text,
  	\`detalle\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v_blocks_proceso_pasos\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_proceso_pasos_items_order_idx\` ON \`_pages_v_blocks_proceso_pasos_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_proceso_pasos_items_parent_id_idx\` ON \`_pages_v_blocks_proceso_pasos_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_proceso_pasos\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`eyebrow\` text,
  	\`titulo\` text,
  	\`enfasis\` text,
  	\`lead\` text,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_proceso_pasos_order_idx\` ON \`_pages_v_blocks_proceso_pasos\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_proceso_pasos_parent_id_idx\` ON \`_pages_v_blocks_proceso_pasos\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_proceso_pasos_path_idx\` ON \`_pages_v_blocks_proceso_pasos\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_cotizador_whatsapp_tipos\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`label\` text,
  	\`desc\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v_blocks_cotizador_whatsapp\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_cotizador_whatsapp_tipos_order_idx\` ON \`_pages_v_blocks_cotizador_whatsapp_tipos\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_cotizador_whatsapp_tipos_parent_id_idx\` ON \`_pages_v_blocks_cotizador_whatsapp_tipos\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_cotizador_whatsapp_tamanos\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`texto\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v_blocks_cotizador_whatsapp\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_cotizador_whatsapp_tamanos_order_idx\` ON \`_pages_v_blocks_cotizador_whatsapp_tamanos\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_cotizador_whatsapp_tamanos_parent_id_idx\` ON \`_pages_v_blocks_cotizador_whatsapp_tamanos\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_cotizador_whatsapp_extras\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`texto\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v_blocks_cotizador_whatsapp\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_cotizador_whatsapp_extras_order_idx\` ON \`_pages_v_blocks_cotizador_whatsapp_extras\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_cotizador_whatsapp_extras_parent_id_idx\` ON \`_pages_v_blocks_cotizador_whatsapp_extras\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_cotizador_whatsapp_plazos\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`texto\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v_blocks_cotizador_whatsapp\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_cotizador_whatsapp_plazos_order_idx\` ON \`_pages_v_blocks_cotizador_whatsapp_plazos\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_cotizador_whatsapp_plazos_parent_id_idx\` ON \`_pages_v_blocks_cotizador_whatsapp_plazos\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_cotizador_whatsapp\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`eyebrow\` text,
  	\`titulo\` text,
  	\`enfasis\` text,
  	\`lead\` text,
  	\`pregunta_tipo\` text DEFAULT '01 · Qué necesitas',
  	\`pregunta_tamano\` text DEFAULT '02 · De qué tamaño',
  	\`pregunta_extras\` text DEFAULT '03 · Qué más te haría falta',
  	\`pregunta_plazo\` text DEFAULT '04 · Para cuándo',
  	\`pregunta_negocio\` text DEFAULT 'Opcional · Cómo se llama tu negocio',
  	\`ejemplo_negocio\` text,
  	\`titulo_mensaje\` text DEFAULT 'Tu mensaje, ya escrito',
  	\`saludo\` text DEFAULT 'Hola, quiero cotizar un proyecto.',
  	\`boton\` text DEFAULT 'Enviarlo por WhatsApp',
  	\`nota\` text,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_cotizador_whatsapp_order_idx\` ON \`_pages_v_blocks_cotizador_whatsapp\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_cotizador_whatsapp_parent_id_idx\` ON \`_pages_v_blocks_cotizador_whatsapp\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_cotizador_whatsapp_path_idx\` ON \`_pages_v_blocks_cotizador_whatsapp\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_confianza_datos_datos\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`etiqueta\` text,
  	\`valor\` text,
  	\`nota\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v_blocks_confianza_datos\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_confianza_datos_datos_order_idx\` ON \`_pages_v_blocks_confianza_datos_datos\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_confianza_datos_datos_parent_id_idx\` ON \`_pages_v_blocks_confianza_datos_datos\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_confianza_datos\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`eyebrow\` text,
  	\`titulo\` text,
  	\`enfasis\` text,
  	\`lead\` text,
  	\`boton\` text DEFAULT 'Escribir por WhatsApp',
  	\`mensaje_whatsapp\` text,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_confianza_datos_order_idx\` ON \`_pages_v_blocks_confianza_datos\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_confianza_datos_parent_id_idx\` ON \`_pages_v_blocks_confianza_datos\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_confianza_datos_path_idx\` ON \`_pages_v_blocks_confianza_datos\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_preguntas_frecuentes\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`eyebrow\` text,
  	\`titulo\` text,
  	\`enfasis\` text,
  	\`grupo\` text,
  	\`otra_duda_titulo\` text DEFAULT '¿Tienes otra duda?',
  	\`otra_duda_texto\` text DEFAULT 'Escríbenos sin compromiso.',
  	\`boton\` text DEFAULT 'Hacer una pregunta',
  	\`mensaje_whatsapp\` text,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_preguntas_frecuentes_order_idx\` ON \`_pages_v_blocks_preguntas_frecuentes\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_preguntas_frecuentes_parent_id_idx\` ON \`_pages_v_blocks_preguntas_frecuentes\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_preguntas_frecuentes_path_idx\` ON \`_pages_v_blocks_preguntas_frecuentes\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_cierre_negro_garantias\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`texto\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v_blocks_cierre_negro\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_cierre_negro_garantias_order_idx\` ON \`_pages_v_blocks_cierre_negro_garantias\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_cierre_negro_garantias_parent_id_idx\` ON \`_pages_v_blocks_cierre_negro_garantias\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_cierre_negro\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`eyebrow\` text,
  	\`titulo\` text,
  	\`enfasis\` text,
  	\`lead\` text,
  	\`boton\` text DEFAULT 'Escríbenos',
  	\`mensaje_whatsapp\` text,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_cierre_negro_order_idx\` ON \`_pages_v_blocks_cierre_negro\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_cierre_negro_parent_id_idx\` ON \`_pages_v_blocks_cierre_negro\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_cierre_negro_path_idx\` ON \`_pages_v_blocks_cierre_negro\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_cta_links\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`link_type\` text DEFAULT 'reference',
  	\`link_new_tab\` integer,
  	\`link_url\` text,
  	\`link_label\` text,
  	\`link_appearance\` text DEFAULT 'default',
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v_blocks_cta\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_cta_links_order_idx\` ON \`_pages_v_blocks_cta_links\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_cta_links_parent_id_idx\` ON \`_pages_v_blocks_cta_links\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_cta\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`rich_text\` text,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_cta_order_idx\` ON \`_pages_v_blocks_cta\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_cta_parent_id_idx\` ON \`_pages_v_blocks_cta\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_cta_path_idx\` ON \`_pages_v_blocks_cta\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_content_columns\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`size\` text DEFAULT 'oneThird',
  	\`rich_text\` text,
  	\`enable_link\` integer,
  	\`link_type\` text DEFAULT 'reference',
  	\`link_new_tab\` integer,
  	\`link_url\` text,
  	\`link_label\` text,
  	\`link_appearance\` text DEFAULT 'default',
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v_blocks_content\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_content_columns_order_idx\` ON \`_pages_v_blocks_content_columns\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_content_columns_parent_id_idx\` ON \`_pages_v_blocks_content_columns\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_content\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_content_order_idx\` ON \`_pages_v_blocks_content\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_content_parent_id_idx\` ON \`_pages_v_blocks_content\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_content_path_idx\` ON \`_pages_v_blocks_content\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_media_block\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`media_id\` integer,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`media_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_media_block_order_idx\` ON \`_pages_v_blocks_media_block\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_media_block_parent_id_idx\` ON \`_pages_v_blocks_media_block\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_media_block_path_idx\` ON \`_pages_v_blocks_media_block\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_media_block_media_idx\` ON \`_pages_v_blocks_media_block\` (\`media_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_archive\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`intro_content\` text,
  	\`populate_by\` text DEFAULT 'collection',
  	\`relation_to\` text DEFAULT 'products',
  	\`limit\` numeric DEFAULT 10,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_archive_order_idx\` ON \`_pages_v_blocks_archive\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_archive_parent_id_idx\` ON \`_pages_v_blocks_archive\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_archive_path_idx\` ON \`_pages_v_blocks_archive\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_carousel\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`populate_by\` text DEFAULT 'collection',
  	\`relation_to\` text DEFAULT 'products',
  	\`limit\` numeric DEFAULT 10,
  	\`populated_docs_total\` numeric,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_carousel_order_idx\` ON \`_pages_v_blocks_carousel\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_carousel_parent_id_idx\` ON \`_pages_v_blocks_carousel\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_carousel_path_idx\` ON \`_pages_v_blocks_carousel\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_three_item_grid\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_three_item_grid_order_idx\` ON \`_pages_v_blocks_three_item_grid\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_three_item_grid_parent_id_idx\` ON \`_pages_v_blocks_three_item_grid\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_three_item_grid_path_idx\` ON \`_pages_v_blocks_three_item_grid\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_banner\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`style\` text DEFAULT 'info',
  	\`content\` text,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_banner_order_idx\` ON \`_pages_v_blocks_banner\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_banner_parent_id_idx\` ON \`_pages_v_blocks_banner\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_banner_path_idx\` ON \`_pages_v_blocks_banner\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_form_block\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`form_id\` integer,
  	\`enable_intro\` integer,
  	\`intro_content\` text,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`form_id\`) REFERENCES \`forms\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_form_block_order_idx\` ON \`_pages_v_blocks_form_block\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_form_block_parent_id_idx\` ON \`_pages_v_blocks_form_block\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_form_block_path_idx\` ON \`_pages_v_blocks_form_block\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_form_block_form_idx\` ON \`_pages_v_blocks_form_block\` (\`form_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_version_hero_links\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`link_type\` text DEFAULT 'reference',
  	\`link_new_tab\` integer,
  	\`link_url\` text,
  	\`link_label\` text,
  	\`link_appearance\` text DEFAULT 'default',
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_version_hero_links_order_idx\` ON \`_pages_v_version_hero_links\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_version_hero_links_parent_id_idx\` ON \`_pages_v_version_hero_links\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`parent_id\` integer,
  	\`version_title\` text,
  	\`version_published_on\` text,
  	\`version_hero_type\` text DEFAULT 'lowImpact',
  	\`version_hero_rich_text\` text,
  	\`version_hero_media_id\` integer,
  	\`version_meta_title\` text,
  	\`version_meta_image_id\` integer,
  	\`version_meta_description\` text,
  	\`version_generate_slug\` integer DEFAULT true,
  	\`version_slug\` text,
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`version__status\` text DEFAULT 'draft',
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`latest\` integer,
  	\`autosave\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_hero_media_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_meta_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_parent_idx\` ON \`_pages_v\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_version_hero_version_hero_media_idx\` ON \`_pages_v\` (\`version_hero_media_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_version_meta_version_meta_image_idx\` ON \`_pages_v\` (\`version_meta_image_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_version_version_slug_idx\` ON \`_pages_v\` (\`version_slug\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_version_version_updated_at_idx\` ON \`_pages_v\` (\`version_updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_version_version_created_at_idx\` ON \`_pages_v\` (\`version_created_at\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_version_version__status_idx\` ON \`_pages_v\` (\`version__status\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_created_at_idx\` ON \`_pages_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_updated_at_idx\` ON \`_pages_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_latest_idx\` ON \`_pages_v\` (\`latest\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_autosave_idx\` ON \`_pages_v\` (\`autosave\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`pages_id\` integer,
  	\`categories_id\` integer,
  	\`products_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`_pages_v\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`pages_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`categories_id\`) REFERENCES \`categories\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`products_id\`) REFERENCES \`products\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_rels_order_idx\` ON \`_pages_v_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_rels_parent_idx\` ON \`_pages_v_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_rels_path_idx\` ON \`_pages_v_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_rels_pages_id_idx\` ON \`_pages_v_rels\` (\`pages_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_rels_categories_id_idx\` ON \`_pages_v_rels\` (\`categories_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_rels_products_id_idx\` ON \`_pages_v_rels\` (\`products_id\`);`)
  await db.run(sql`CREATE TABLE \`articulos\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`descripcion\` text,
  	\`portada_id\` integer,
  	\`contenido\` text,
  	\`palabra_clave\` text,
  	\`titulo_seo\` text,
  	\`imagen_redes_id\` integer,
  	\`llamado_tipo\` text DEFAULT 'ninguno',
  	\`llamado_recurso_id\` integer,
  	\`llamado_titulo\` text,
  	\`llamado_texto\` text,
  	\`llamado_texto_boton\` text,
  	\`llamado_mensaje_whatsapp\` text,
  	\`llamado_enlace\` text,
  	\`fecha_publicacion\` text,
  	\`fecha_actualizacion\` text,
  	\`comentarios_cerrados\` integer,
  	\`autor\` text,
  	\`minutos_lectura\` numeric,
  	\`generate_slug\` integer DEFAULT true,
  	\`slug\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`_status\` text DEFAULT 'draft',
  	FOREIGN KEY (\`portada_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`imagen_redes_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`llamado_recurso_id\`) REFERENCES \`recursos\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`articulos_portada_idx\` ON \`articulos\` (\`portada_id\`);`)
  await db.run(sql`CREATE INDEX \`articulos_imagen_redes_idx\` ON \`articulos\` (\`imagen_redes_id\`);`)
  await db.run(sql`CREATE INDEX \`articulos_llamado_llamado_recurso_idx\` ON \`articulos\` (\`llamado_recurso_id\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`articulos_slug_idx\` ON \`articulos\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX \`articulos_updated_at_idx\` ON \`articulos\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`articulos_created_at_idx\` ON \`articulos\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`articulos__status_idx\` ON \`articulos\` (\`_status\`);`)
  await db.run(sql`CREATE TABLE \`articulos_texts\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer NOT NULL,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`text\` text,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`articulos\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`articulos_texts_order_parent\` ON \`articulos_texts\` (\`order\`,\`parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_articulos_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`parent_id\` integer,
  	\`version_title\` text,
  	\`version_descripcion\` text,
  	\`version_portada_id\` integer,
  	\`version_contenido\` text,
  	\`version_palabra_clave\` text,
  	\`version_titulo_seo\` text,
  	\`version_imagen_redes_id\` integer,
  	\`version_llamado_tipo\` text DEFAULT 'ninguno',
  	\`version_llamado_recurso_id\` integer,
  	\`version_llamado_titulo\` text,
  	\`version_llamado_texto\` text,
  	\`version_llamado_texto_boton\` text,
  	\`version_llamado_mensaje_whatsapp\` text,
  	\`version_llamado_enlace\` text,
  	\`version_fecha_publicacion\` text,
  	\`version_fecha_actualizacion\` text,
  	\`version_comentarios_cerrados\` integer,
  	\`version_autor\` text,
  	\`version_minutos_lectura\` numeric,
  	\`version_generate_slug\` integer DEFAULT true,
  	\`version_slug\` text,
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`version__status\` text DEFAULT 'draft',
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`latest\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`articulos\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_portada_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_imagen_redes_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_llamado_recurso_id\`) REFERENCES \`recursos\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`_articulos_v_parent_idx\` ON \`_articulos_v\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_articulos_v_version_version_portada_idx\` ON \`_articulos_v\` (\`version_portada_id\`);`)
  await db.run(sql`CREATE INDEX \`_articulos_v_version_version_imagen_redes_idx\` ON \`_articulos_v\` (\`version_imagen_redes_id\`);`)
  await db.run(sql`CREATE INDEX \`_articulos_v_version_llamado_version_llamado_recurso_idx\` ON \`_articulos_v\` (\`version_llamado_recurso_id\`);`)
  await db.run(sql`CREATE INDEX \`_articulos_v_version_version_slug_idx\` ON \`_articulos_v\` (\`version_slug\`);`)
  await db.run(sql`CREATE INDEX \`_articulos_v_version_version_updated_at_idx\` ON \`_articulos_v\` (\`version_updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_articulos_v_version_version_created_at_idx\` ON \`_articulos_v\` (\`version_created_at\`);`)
  await db.run(sql`CREATE INDEX \`_articulos_v_version_version__status_idx\` ON \`_articulos_v\` (\`version__status\`);`)
  await db.run(sql`CREATE INDEX \`_articulos_v_created_at_idx\` ON \`_articulos_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_articulos_v_updated_at_idx\` ON \`_articulos_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_articulos_v_latest_idx\` ON \`_articulos_v\` (\`latest\`);`)
  await db.run(sql`CREATE TABLE \`_articulos_v_texts\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer NOT NULL,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`text\` text,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`_articulos_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_articulos_v_texts_order_parent\` ON \`_articulos_v_texts\` (\`order\`,\`parent_id\`);`)
  await db.run(sql`CREATE TABLE \`comentarios\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`estado\` text DEFAULT 'pendiente' NOT NULL,
  	\`articulo_id\` integer NOT NULL,
  	\`nombre\` text NOT NULL,
  	\`correo\` text,
  	\`texto\` text NOT NULL,
  	\`respuesta\` text,
  	\`fecha_respuesta\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`articulo_id\`) REFERENCES \`articulos\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`comentarios_estado_idx\` ON \`comentarios\` (\`estado\`);`)
  await db.run(sql`CREATE INDEX \`comentarios_articulo_idx\` ON \`comentarios\` (\`articulo_id\`);`)
  await db.run(sql`CREATE INDEX \`comentarios_updated_at_idx\` ON \`comentarios\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`comentarios_created_at_idx\` ON \`comentarios\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`recursos_beneficios\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`texto\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`recursos\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`recursos_beneficios_order_idx\` ON \`recursos_beneficios\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`recursos_beneficios_parent_id_idx\` ON \`recursos_beneficios\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`recursos\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`titulo\` text NOT NULL,
  	\`descripcion\` text NOT NULL,
  	\`portada_id\` integer,
  	\`texto_boton\` text DEFAULT 'Quiero recibirlo',
  	\`texto_exito\` text DEFAULT '¡Listo! Revisa tu correo: ahí está tu enlace.',
  	\`tipo_entrega\` text DEFAULT 'archivo',
  	\`archivo_id\` integer,
  	\`enlace\` text,
  	\`mostrar_en_pantalla\` integer DEFAULT true,
  	\`asunto_correo\` text,
  	\`texto_correo\` text DEFAULT 'Gracias por tu interés. Pulsa el botón para descargarlo. Si tienes dudas, responde este correo.',
  	\`publicado\` integer DEFAULT true,
  	\`descargas\` numeric DEFAULT 0,
  	\`generate_slug\` integer DEFAULT true,
  	\`slug\` text NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`portada_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`archivo_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`recursos_portada_idx\` ON \`recursos\` (\`portada_id\`);`)
  await db.run(sql`CREATE INDEX \`recursos_archivo_idx\` ON \`recursos\` (\`archivo_id\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`recursos_slug_idx\` ON \`recursos\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX \`recursos_updated_at_idx\` ON \`recursos\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`recursos_created_at_idx\` ON \`recursos\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`solicitudes_recurso\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`nombre\` text,
  	\`correo\` text NOT NULL,
  	\`recurso_id\` integer NOT NULL,
  	\`acepto_boletin\` integer,
  	\`descargo\` integer,
  	\`origen\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`recurso_id\`) REFERENCES \`recursos\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`solicitudes_recurso_correo_idx\` ON \`solicitudes_recurso\` (\`correo\`);`)
  await db.run(sql`CREATE INDEX \`solicitudes_recurso_recurso_idx\` ON \`solicitudes_recurso\` (\`recurso_id\`);`)
  await db.run(sql`CREATE INDEX \`solicitudes_recurso_updated_at_idx\` ON \`solicitudes_recurso\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`solicitudes_recurso_created_at_idx\` ON \`solicitudes_recurso\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`casos\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`nombre\` text NOT NULL,
  	\`rubro\` text,
  	\`url\` text NOT NULL,
  	\`descripcion\` text,
  	\`icono\` text DEFAULT 'globe',
  	\`orden\` numeric DEFAULT 0,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX \`casos_updated_at_idx\` ON \`casos\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`casos_created_at_idx\` ON \`casos\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`preguntas\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`pregunta\` text NOT NULL,
  	\`respuesta\` text NOT NULL,
  	\`grupo\` text DEFAULT 'inicio',
  	\`orden\` numeric DEFAULT 0,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX \`preguntas_grupo_idx\` ON \`preguntas\` (\`grupo\`);`)
  await db.run(sql`CREATE INDEX \`preguntas_updated_at_idx\` ON \`preguntas\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`preguntas_created_at_idx\` ON \`preguntas\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`legales\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`titulo\` text NOT NULL,
  	\`descripcion\` text,
  	\`contenido\` text NOT NULL,
  	\`slug\` text NOT NULL,
  	\`etiqueta\` text,
  	\`fecha_actualizacion\` text,
  	\`orden\` numeric DEFAULT 0,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`legales_slug_idx\` ON \`legales\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX \`legales_updated_at_idx\` ON \`legales\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`legales_created_at_idx\` ON \`legales\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`mensajes\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`estado\` text DEFAULT 'nuevo' NOT NULL,
  	\`nombre\` text NOT NULL,
  	\`telefono\` text,
  	\`correo\` text,
  	\`necesita\` text,
  	\`mensaje\` text,
  	\`notas\` text,
  	\`origen\` text,
  	\`aviso_enviado\` integer,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX \`mensajes_updated_at_idx\` ON \`mensajes\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`mensajes_created_at_idx\` ON \`mensajes\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`suscriptores\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`correo\` text NOT NULL,
  	\`nombre\` text,
  	\`estado\` text DEFAULT 'activo' NOT NULL,
  	\`origen\` text,
  	\`fecha_baja\` text,
  	\`codigo_baja\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`suscriptores_correo_idx\` ON \`suscriptores\` (\`correo\`);`)
  await db.run(sql`CREATE INDEX \`suscriptores_codigo_baja_idx\` ON \`suscriptores\` (\`codigo_baja\`);`)
  await db.run(sql`CREATE INDEX \`suscriptores_updated_at_idx\` ON \`suscriptores\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`suscriptores_created_at_idx\` ON \`suscriptores\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`boletines\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`asunto\` text NOT NULL,
  	\`contenido\` text,
  	\`estado\` text DEFAULT 'borrador',
  	\`resultado\` text,
  	\`destinatarios\` numeric,
  	\`enviado_el\` text,
  	\`correo_prueba\` text,
  	\`enviar_prueba\` integer,
  	\`confirmar_envio\` integer,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX \`boletines_updated_at_idx\` ON \`boletines\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`boletines_created_at_idx\` ON \`boletines\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`media\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`alt\` text NOT NULL,
  	\`optimizada\` text,
  	\`caption\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`url\` text,
  	\`thumbnail_u_r_l\` text,
  	\`filename\` text,
  	\`mime_type\` text,
  	\`filesize\` numeric,
  	\`width\` numeric,
  	\`height\` numeric,
  	\`focal_x\` numeric,
  	\`focal_y\` numeric,
  	\`sizes_miniatura_url\` text,
  	\`sizes_miniatura_width\` numeric,
  	\`sizes_miniatura_height\` numeric,
  	\`sizes_miniatura_mime_type\` text,
  	\`sizes_miniatura_filesize\` numeric,
  	\`sizes_miniatura_filename\` text,
  	\`sizes_mediana_url\` text,
  	\`sizes_mediana_width\` numeric,
  	\`sizes_mediana_height\` numeric,
  	\`sizes_mediana_mime_type\` text,
  	\`sizes_mediana_filesize\` numeric,
  	\`sizes_mediana_filename\` text,
  	\`sizes_grande_url\` text,
  	\`sizes_grande_width\` numeric,
  	\`sizes_grande_height\` numeric,
  	\`sizes_grande_mime_type\` text,
  	\`sizes_grande_filesize\` numeric,
  	\`sizes_grande_filename\` text,
  	\`sizes_correo_url\` text,
  	\`sizes_correo_width\` numeric,
  	\`sizes_correo_height\` numeric,
  	\`sizes_correo_mime_type\` text,
  	\`sizes_correo_filesize\` numeric,
  	\`sizes_correo_filename\` text,
  	\`sizes_redes_url\` text,
  	\`sizes_redes_width\` numeric,
  	\`sizes_redes_height\` numeric,
  	\`sizes_redes_mime_type\` text,
  	\`sizes_redes_filesize\` numeric,
  	\`sizes_redes_filename\` text
  );
  `)
  await db.run(sql`CREATE INDEX \`media_updated_at_idx\` ON \`media\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`media_created_at_idx\` ON \`media\` (\`created_at\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`media_filename_idx\` ON \`media\` (\`filename\`);`)
  await db.run(sql`CREATE INDEX \`media_sizes_miniatura_sizes_miniatura_filename_idx\` ON \`media\` (\`sizes_miniatura_filename\`);`)
  await db.run(sql`CREATE INDEX \`media_sizes_mediana_sizes_mediana_filename_idx\` ON \`media\` (\`sizes_mediana_filename\`);`)
  await db.run(sql`CREATE INDEX \`media_sizes_grande_sizes_grande_filename_idx\` ON \`media\` (\`sizes_grande_filename\`);`)
  await db.run(sql`CREATE INDEX \`media_sizes_correo_sizes_correo_filename_idx\` ON \`media\` (\`sizes_correo_filename\`);`)
  await db.run(sql`CREATE INDEX \`media_sizes_redes_sizes_redes_filename_idx\` ON \`media\` (\`sizes_redes_filename\`);`)
  await db.run(sql`CREATE TABLE \`categories\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text NOT NULL,
  	\`generate_slug\` integer DEFAULT true,
  	\`slug\` text NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`categories_slug_idx\` ON \`categories\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX \`categories_updated_at_idx\` ON \`categories\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`categories_created_at_idx\` ON \`categories\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`users_roles\` (
  	\`order\` integer NOT NULL,
  	\`parent_id\` integer NOT NULL,
  	\`value\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`users_roles_order_idx\` ON \`users_roles\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`users_roles_parent_idx\` ON \`users_roles\` (\`parent_id\`);`)
  await db.run(sql`CREATE TABLE \`users_sessions\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`created_at\` text,
  	\`expires_at\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`users_sessions_order_idx\` ON \`users_sessions\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`users_sessions_parent_id_idx\` ON \`users_sessions\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`users\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`name\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`email\` text NOT NULL,
  	\`reset_password_token\` text,
  	\`reset_password_expiration\` text,
  	\`salt\` text,
  	\`hash\` text,
  	\`login_attempts\` numeric DEFAULT 0,
  	\`lock_until\` text
  );
  `)
  await db.run(sql`CREATE INDEX \`users_updated_at_idx\` ON \`users\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`users_created_at_idx\` ON \`users\` (\`created_at\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`users_email_idx\` ON \`users\` (\`email\`);`)
  await db.run(sql`CREATE TABLE \`visitas\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`tipo\` text DEFAULT 'vista' NOT NULL,
  	\`ruta\` text NOT NULL,
  	\`fuente\` text,
  	\`referente\` text,
  	\`dispositivo\` text,
  	\`pais\` text,
  	\`visitante\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX \`visitas_tipo_idx\` ON \`visitas\` (\`tipo\`);`)
  await db.run(sql`CREATE INDEX \`visitas_ruta_idx\` ON \`visitas\` (\`ruta\`);`)
  await db.run(sql`CREATE INDEX \`visitas_fuente_idx\` ON \`visitas\` (\`fuente\`);`)
  await db.run(sql`CREATE INDEX \`visitas_visitante_idx\` ON \`visitas\` (\`visitante\`);`)
  await db.run(sql`CREATE INDEX \`visitas_updated_at_idx\` ON \`visitas\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`visitas_created_at_idx\` ON \`visitas\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`registro_correos\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`asunto\` text,
  	\`para\` text,
  	\`ok\` integer,
  	\`error\` text,
  	\`tipo\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX \`registro_correos_updated_at_idx\` ON \`registro_correos\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`registro_correos_created_at_idx\` ON \`registro_correos\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`forms_blocks_checkbox\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`name\` text NOT NULL,
  	\`label\` text,
  	\`width\` numeric,
  	\`required\` integer,
  	\`default_value\` integer,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`forms\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`forms_blocks_checkbox_order_idx\` ON \`forms_blocks_checkbox\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`forms_blocks_checkbox_parent_id_idx\` ON \`forms_blocks_checkbox\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`forms_blocks_checkbox_path_idx\` ON \`forms_blocks_checkbox\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`forms_blocks_country\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`name\` text NOT NULL,
  	\`label\` text,
  	\`width\` numeric,
  	\`required\` integer,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`forms\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`forms_blocks_country_order_idx\` ON \`forms_blocks_country\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`forms_blocks_country_parent_id_idx\` ON \`forms_blocks_country\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`forms_blocks_country_path_idx\` ON \`forms_blocks_country\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`forms_blocks_email\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`name\` text NOT NULL,
  	\`label\` text,
  	\`width\` numeric,
  	\`required\` integer,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`forms\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`forms_blocks_email_order_idx\` ON \`forms_blocks_email\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`forms_blocks_email_parent_id_idx\` ON \`forms_blocks_email\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`forms_blocks_email_path_idx\` ON \`forms_blocks_email\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`forms_blocks_message\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`message\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`forms\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`forms_blocks_message_order_idx\` ON \`forms_blocks_message\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`forms_blocks_message_parent_id_idx\` ON \`forms_blocks_message\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`forms_blocks_message_path_idx\` ON \`forms_blocks_message\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`forms_blocks_number\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`name\` text NOT NULL,
  	\`label\` text,
  	\`width\` numeric,
  	\`default_value\` numeric,
  	\`required\` integer,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`forms\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`forms_blocks_number_order_idx\` ON \`forms_blocks_number\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`forms_blocks_number_parent_id_idx\` ON \`forms_blocks_number\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`forms_blocks_number_path_idx\` ON \`forms_blocks_number\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`forms_blocks_select_options\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`label\` text NOT NULL,
  	\`value\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`forms_blocks_select\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`forms_blocks_select_options_order_idx\` ON \`forms_blocks_select_options\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`forms_blocks_select_options_parent_id_idx\` ON \`forms_blocks_select_options\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`forms_blocks_select\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`name\` text NOT NULL,
  	\`label\` text,
  	\`width\` numeric,
  	\`default_value\` text,
  	\`placeholder\` text,
  	\`required\` integer,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`forms\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`forms_blocks_select_order_idx\` ON \`forms_blocks_select\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`forms_blocks_select_parent_id_idx\` ON \`forms_blocks_select\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`forms_blocks_select_path_idx\` ON \`forms_blocks_select\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`forms_blocks_state\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`name\` text NOT NULL,
  	\`label\` text,
  	\`width\` numeric,
  	\`required\` integer,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`forms\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`forms_blocks_state_order_idx\` ON \`forms_blocks_state\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`forms_blocks_state_parent_id_idx\` ON \`forms_blocks_state\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`forms_blocks_state_path_idx\` ON \`forms_blocks_state\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`forms_blocks_text\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`name\` text NOT NULL,
  	\`label\` text,
  	\`width\` numeric,
  	\`default_value\` text,
  	\`required\` integer,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`forms\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`forms_blocks_text_order_idx\` ON \`forms_blocks_text\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`forms_blocks_text_parent_id_idx\` ON \`forms_blocks_text\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`forms_blocks_text_path_idx\` ON \`forms_blocks_text\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`forms_blocks_textarea\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`name\` text NOT NULL,
  	\`label\` text,
  	\`width\` numeric,
  	\`default_value\` text,
  	\`required\` integer,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`forms\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`forms_blocks_textarea_order_idx\` ON \`forms_blocks_textarea\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`forms_blocks_textarea_parent_id_idx\` ON \`forms_blocks_textarea\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`forms_blocks_textarea_path_idx\` ON \`forms_blocks_textarea\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`forms_emails\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`email_to\` text,
  	\`cc\` text,
  	\`bcc\` text,
  	\`reply_to\` text,
  	\`email_from\` text,
  	\`subject\` text DEFAULT 'You''ve received a new message.' NOT NULL,
  	\`message\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`forms\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`forms_emails_order_idx\` ON \`forms_emails\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`forms_emails_parent_id_idx\` ON \`forms_emails\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`forms\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text NOT NULL,
  	\`submit_button_label\` text,
  	\`confirmation_type\` text DEFAULT 'message',
  	\`confirmation_message\` text,
  	\`redirect_url\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX \`forms_updated_at_idx\` ON \`forms\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`forms_created_at_idx\` ON \`forms\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`form_submissions_submission_data\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`field\` text NOT NULL,
  	\`value\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`form_submissions\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`form_submissions_submission_data_order_idx\` ON \`form_submissions_submission_data\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`form_submissions_submission_data_parent_id_idx\` ON \`form_submissions_submission_data\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`form_submissions\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`form_id\` integer NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`form_id\`) REFERENCES \`forms\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`form_submissions_form_idx\` ON \`form_submissions\` (\`form_id\`);`)
  await db.run(sql`CREATE INDEX \`form_submissions_updated_at_idx\` ON \`form_submissions\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`form_submissions_created_at_idx\` ON \`form_submissions\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`addresses\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`customer_id\` integer,
  	\`title\` text,
  	\`first_name\` text,
  	\`last_name\` text,
  	\`company\` text,
  	\`address_line1\` text,
  	\`address_line2\` text,
  	\`city\` text,
  	\`state\` text,
  	\`postal_code\` text,
  	\`country\` text NOT NULL,
  	\`phone\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`customer_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`addresses_customer_idx\` ON \`addresses\` (\`customer_id\`);`)
  await db.run(sql`CREATE INDEX \`addresses_updated_at_idx\` ON \`addresses\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`addresses_created_at_idx\` ON \`addresses\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`variants\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`product_id\` integer,
  	\`inventory\` numeric DEFAULT 0,
  	\`price_in_c_o_p_enabled\` integer,
  	\`price_in_c_o_p\` numeric,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`deleted_at\` text,
  	\`_status\` text DEFAULT 'draft',
  	FOREIGN KEY (\`product_id\`) REFERENCES \`products\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`variants_product_idx\` ON \`variants\` (\`product_id\`);`)
  await db.run(sql`CREATE INDEX \`variants_updated_at_idx\` ON \`variants\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`variants_created_at_idx\` ON \`variants\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`variants_deleted_at_idx\` ON \`variants\` (\`deleted_at\`);`)
  await db.run(sql`CREATE INDEX \`variants__status_idx\` ON \`variants\` (\`_status\`);`)
  await db.run(sql`CREATE TABLE \`variants_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`variant_options_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`variants\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`variant_options_id\`) REFERENCES \`variant_options\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`variants_rels_order_idx\` ON \`variants_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`variants_rels_parent_idx\` ON \`variants_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`variants_rels_path_idx\` ON \`variants_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`variants_rels_variant_options_id_idx\` ON \`variants_rels\` (\`variant_options_id\`);`)
  await db.run(sql`CREATE TABLE \`_variants_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`parent_id\` integer,
  	\`version_title\` text,
  	\`version_product_id\` integer,
  	\`version_inventory\` numeric DEFAULT 0,
  	\`version_price_in_c_o_p_enabled\` integer,
  	\`version_price_in_c_o_p\` numeric,
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`version_deleted_at\` text,
  	\`version__status\` text DEFAULT 'draft',
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`latest\` integer,
  	\`autosave\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`variants\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_product_id\`) REFERENCES \`products\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`_variants_v_parent_idx\` ON \`_variants_v\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_variants_v_version_version_product_idx\` ON \`_variants_v\` (\`version_product_id\`);`)
  await db.run(sql`CREATE INDEX \`_variants_v_version_version_updated_at_idx\` ON \`_variants_v\` (\`version_updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_variants_v_version_version_created_at_idx\` ON \`_variants_v\` (\`version_created_at\`);`)
  await db.run(sql`CREATE INDEX \`_variants_v_version_version_deleted_at_idx\` ON \`_variants_v\` (\`version_deleted_at\`);`)
  await db.run(sql`CREATE INDEX \`_variants_v_version_version__status_idx\` ON \`_variants_v\` (\`version__status\`);`)
  await db.run(sql`CREATE INDEX \`_variants_v_created_at_idx\` ON \`_variants_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_variants_v_updated_at_idx\` ON \`_variants_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_variants_v_latest_idx\` ON \`_variants_v\` (\`latest\`);`)
  await db.run(sql`CREATE INDEX \`_variants_v_autosave_idx\` ON \`_variants_v\` (\`autosave\`);`)
  await db.run(sql`CREATE TABLE \`_variants_v_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`variant_options_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`_variants_v\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`variant_options_id\`) REFERENCES \`variant_options\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_variants_v_rels_order_idx\` ON \`_variants_v_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`_variants_v_rels_parent_idx\` ON \`_variants_v_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_variants_v_rels_path_idx\` ON \`_variants_v_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`_variants_v_rels_variant_options_id_idx\` ON \`_variants_v_rels\` (\`variant_options_id\`);`)
  await db.run(sql`CREATE TABLE \`variant_types\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`label\` text NOT NULL,
  	\`name\` text NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`deleted_at\` text
  );
  `)
  await db.run(sql`CREATE INDEX \`variant_types_updated_at_idx\` ON \`variant_types\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`variant_types_created_at_idx\` ON \`variant_types\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`variant_types_deleted_at_idx\` ON \`variant_types\` (\`deleted_at\`);`)
  await db.run(sql`CREATE TABLE \`variant_options\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_variantoptions_options_order\` text,
  	\`variant_type_id\` integer NOT NULL,
  	\`label\` text NOT NULL,
  	\`value\` text NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`deleted_at\` text,
  	FOREIGN KEY (\`variant_type_id\`) REFERENCES \`variant_types\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`variant_options__variantoptions_options_order_idx\` ON \`variant_options\` (\`_variantoptions_options_order\`);`)
  await db.run(sql`CREATE INDEX \`variant_options_variant_type_idx\` ON \`variant_options\` (\`variant_type_id\`);`)
  await db.run(sql`CREATE INDEX \`variant_options_updated_at_idx\` ON \`variant_options\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`variant_options_created_at_idx\` ON \`variant_options\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`variant_options_deleted_at_idx\` ON \`variant_options\` (\`deleted_at\`);`)
  await db.run(sql`CREATE TABLE \`products_gallery\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`image_id\` integer,
  	\`variant_option_id\` integer,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`variant_option_id\`) REFERENCES \`variant_options\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`products\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`products_gallery_order_idx\` ON \`products_gallery\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`products_gallery_parent_id_idx\` ON \`products_gallery\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`products_gallery_image_idx\` ON \`products_gallery\` (\`image_id\`);`)
  await db.run(sql`CREATE INDEX \`products_gallery_variant_option_idx\` ON \`products_gallery\` (\`variant_option_id\`);`)
  await db.run(sql`CREATE TABLE \`products_blocks_cta_links\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`link_type\` text DEFAULT 'reference',
  	\`link_new_tab\` integer,
  	\`link_url\` text,
  	\`link_label\` text,
  	\`link_appearance\` text DEFAULT 'default',
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`products_blocks_cta\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`products_blocks_cta_links_order_idx\` ON \`products_blocks_cta_links\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`products_blocks_cta_links_parent_id_idx\` ON \`products_blocks_cta_links\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`products_blocks_cta\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`rich_text\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`products\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`products_blocks_cta_order_idx\` ON \`products_blocks_cta\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`products_blocks_cta_parent_id_idx\` ON \`products_blocks_cta\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`products_blocks_cta_path_idx\` ON \`products_blocks_cta\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`products_blocks_content_columns\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`size\` text DEFAULT 'oneThird',
  	\`rich_text\` text,
  	\`enable_link\` integer,
  	\`link_type\` text DEFAULT 'reference',
  	\`link_new_tab\` integer,
  	\`link_url\` text,
  	\`link_label\` text,
  	\`link_appearance\` text DEFAULT 'default',
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`products_blocks_content\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`products_blocks_content_columns_order_idx\` ON \`products_blocks_content_columns\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`products_blocks_content_columns_parent_id_idx\` ON \`products_blocks_content_columns\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`products_blocks_content\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`products\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`products_blocks_content_order_idx\` ON \`products_blocks_content\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`products_blocks_content_parent_id_idx\` ON \`products_blocks_content\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`products_blocks_content_path_idx\` ON \`products_blocks_content\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`products_blocks_media_block\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`media_id\` integer,
  	\`block_name\` text,
  	FOREIGN KEY (\`media_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`products\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`products_blocks_media_block_order_idx\` ON \`products_blocks_media_block\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`products_blocks_media_block_parent_id_idx\` ON \`products_blocks_media_block\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`products_blocks_media_block_path_idx\` ON \`products_blocks_media_block\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`products_blocks_media_block_media_idx\` ON \`products_blocks_media_block\` (\`media_id\`);`)
  await db.run(sql`CREATE TABLE \`products\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`description\` text,
  	\`inventory\` numeric DEFAULT 0,
  	\`enable_variants\` integer,
  	\`price_in_c_o_p_enabled\` integer,
  	\`price_in_c_o_p\` numeric,
  	\`meta_title\` text,
  	\`meta_image_id\` integer,
  	\`meta_description\` text,
  	\`generate_slug\` integer DEFAULT true,
  	\`slug\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`deleted_at\` text,
  	\`_status\` text DEFAULT 'draft',
  	FOREIGN KEY (\`meta_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`products_meta_meta_image_idx\` ON \`products\` (\`meta_image_id\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`products_slug_idx\` ON \`products\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX \`products_updated_at_idx\` ON \`products\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`products_created_at_idx\` ON \`products\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`products_deleted_at_idx\` ON \`products\` (\`deleted_at\`);`)
  await db.run(sql`CREATE INDEX \`products__status_idx\` ON \`products\` (\`_status\`);`)
  await db.run(sql`CREATE TABLE \`products_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`pages_id\` integer,
  	\`variant_types_id\` integer,
  	\`products_id\` integer,
  	\`categories_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`products\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`pages_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`variant_types_id\`) REFERENCES \`variant_types\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`products_id\`) REFERENCES \`products\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`categories_id\`) REFERENCES \`categories\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`products_rels_order_idx\` ON \`products_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`products_rels_parent_idx\` ON \`products_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`products_rels_path_idx\` ON \`products_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`products_rels_pages_id_idx\` ON \`products_rels\` (\`pages_id\`);`)
  await db.run(sql`CREATE INDEX \`products_rels_variant_types_id_idx\` ON \`products_rels\` (\`variant_types_id\`);`)
  await db.run(sql`CREATE INDEX \`products_rels_products_id_idx\` ON \`products_rels\` (\`products_id\`);`)
  await db.run(sql`CREATE INDEX \`products_rels_categories_id_idx\` ON \`products_rels\` (\`categories_id\`);`)
  await db.run(sql`CREATE TABLE \`_products_v_version_gallery\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`image_id\` integer,
  	\`variant_option_id\` integer,
  	\`_uuid\` text,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`variant_option_id\`) REFERENCES \`variant_options\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_products_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_products_v_version_gallery_order_idx\` ON \`_products_v_version_gallery\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_products_v_version_gallery_parent_id_idx\` ON \`_products_v_version_gallery\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_products_v_version_gallery_image_idx\` ON \`_products_v_version_gallery\` (\`image_id\`);`)
  await db.run(sql`CREATE INDEX \`_products_v_version_gallery_variant_option_idx\` ON \`_products_v_version_gallery\` (\`variant_option_id\`);`)
  await db.run(sql`CREATE TABLE \`_products_v_blocks_cta_links\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`link_type\` text DEFAULT 'reference',
  	\`link_new_tab\` integer,
  	\`link_url\` text,
  	\`link_label\` text,
  	\`link_appearance\` text DEFAULT 'default',
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_products_v_blocks_cta\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_products_v_blocks_cta_links_order_idx\` ON \`_products_v_blocks_cta_links\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_products_v_blocks_cta_links_parent_id_idx\` ON \`_products_v_blocks_cta_links\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_products_v_blocks_cta\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`rich_text\` text,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_products_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_products_v_blocks_cta_order_idx\` ON \`_products_v_blocks_cta\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_products_v_blocks_cta_parent_id_idx\` ON \`_products_v_blocks_cta\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_products_v_blocks_cta_path_idx\` ON \`_products_v_blocks_cta\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`_products_v_blocks_content_columns\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`size\` text DEFAULT 'oneThird',
  	\`rich_text\` text,
  	\`enable_link\` integer,
  	\`link_type\` text DEFAULT 'reference',
  	\`link_new_tab\` integer,
  	\`link_url\` text,
  	\`link_label\` text,
  	\`link_appearance\` text DEFAULT 'default',
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_products_v_blocks_content\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_products_v_blocks_content_columns_order_idx\` ON \`_products_v_blocks_content_columns\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_products_v_blocks_content_columns_parent_id_idx\` ON \`_products_v_blocks_content_columns\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_products_v_blocks_content\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_products_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_products_v_blocks_content_order_idx\` ON \`_products_v_blocks_content\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_products_v_blocks_content_parent_id_idx\` ON \`_products_v_blocks_content\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_products_v_blocks_content_path_idx\` ON \`_products_v_blocks_content\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`_products_v_blocks_media_block\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`media_id\` integer,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`media_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_products_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_products_v_blocks_media_block_order_idx\` ON \`_products_v_blocks_media_block\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_products_v_blocks_media_block_parent_id_idx\` ON \`_products_v_blocks_media_block\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_products_v_blocks_media_block_path_idx\` ON \`_products_v_blocks_media_block\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`_products_v_blocks_media_block_media_idx\` ON \`_products_v_blocks_media_block\` (\`media_id\`);`)
  await db.run(sql`CREATE TABLE \`_products_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`parent_id\` integer,
  	\`version_title\` text,
  	\`version_description\` text,
  	\`version_inventory\` numeric DEFAULT 0,
  	\`version_enable_variants\` integer,
  	\`version_price_in_c_o_p_enabled\` integer,
  	\`version_price_in_c_o_p\` numeric,
  	\`version_meta_title\` text,
  	\`version_meta_image_id\` integer,
  	\`version_meta_description\` text,
  	\`version_generate_slug\` integer DEFAULT true,
  	\`version_slug\` text,
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`version_deleted_at\` text,
  	\`version__status\` text DEFAULT 'draft',
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`latest\` integer,
  	\`autosave\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`products\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_meta_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`_products_v_parent_idx\` ON \`_products_v\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_products_v_version_meta_version_meta_image_idx\` ON \`_products_v\` (\`version_meta_image_id\`);`)
  await db.run(sql`CREATE INDEX \`_products_v_version_version_slug_idx\` ON \`_products_v\` (\`version_slug\`);`)
  await db.run(sql`CREATE INDEX \`_products_v_version_version_updated_at_idx\` ON \`_products_v\` (\`version_updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_products_v_version_version_created_at_idx\` ON \`_products_v\` (\`version_created_at\`);`)
  await db.run(sql`CREATE INDEX \`_products_v_version_version_deleted_at_idx\` ON \`_products_v\` (\`version_deleted_at\`);`)
  await db.run(sql`CREATE INDEX \`_products_v_version_version__status_idx\` ON \`_products_v\` (\`version__status\`);`)
  await db.run(sql`CREATE INDEX \`_products_v_created_at_idx\` ON \`_products_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_products_v_updated_at_idx\` ON \`_products_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_products_v_latest_idx\` ON \`_products_v\` (\`latest\`);`)
  await db.run(sql`CREATE INDEX \`_products_v_autosave_idx\` ON \`_products_v\` (\`autosave\`);`)
  await db.run(sql`CREATE TABLE \`_products_v_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`pages_id\` integer,
  	\`variant_types_id\` integer,
  	\`products_id\` integer,
  	\`categories_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`_products_v\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`pages_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`variant_types_id\`) REFERENCES \`variant_types\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`products_id\`) REFERENCES \`products\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`categories_id\`) REFERENCES \`categories\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_products_v_rels_order_idx\` ON \`_products_v_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`_products_v_rels_parent_idx\` ON \`_products_v_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_products_v_rels_path_idx\` ON \`_products_v_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`_products_v_rels_pages_id_idx\` ON \`_products_v_rels\` (\`pages_id\`);`)
  await db.run(sql`CREATE INDEX \`_products_v_rels_variant_types_id_idx\` ON \`_products_v_rels\` (\`variant_types_id\`);`)
  await db.run(sql`CREATE INDEX \`_products_v_rels_products_id_idx\` ON \`_products_v_rels\` (\`products_id\`);`)
  await db.run(sql`CREATE INDEX \`_products_v_rels_categories_id_idx\` ON \`_products_v_rels\` (\`categories_id\`);`)
  await db.run(sql`CREATE TABLE \`carts_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`product_id\` integer,
  	\`variant_id\` integer,
  	\`quantity\` numeric DEFAULT 1 NOT NULL,
  	FOREIGN KEY (\`product_id\`) REFERENCES \`products\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`variant_id\`) REFERENCES \`variants\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`carts\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`carts_items_order_idx\` ON \`carts_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`carts_items_parent_id_idx\` ON \`carts_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`carts_items_product_idx\` ON \`carts_items\` (\`product_id\`);`)
  await db.run(sql`CREATE INDEX \`carts_items_variant_idx\` ON \`carts_items\` (\`variant_id\`);`)
  await db.run(sql`CREATE TABLE \`carts\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`secret\` text,
  	\`customer_id\` integer,
  	\`purchased_at\` text,
  	\`subtotal\` numeric,
  	\`currency\` text DEFAULT 'COP',
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`customer_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`carts_secret_idx\` ON \`carts\` (\`secret\`);`)
  await db.run(sql`CREATE INDEX \`carts_customer_idx\` ON \`carts\` (\`customer_id\`);`)
  await db.run(sql`CREATE INDEX \`carts_updated_at_idx\` ON \`carts\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`carts_created_at_idx\` ON \`carts\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`orders_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`product_id\` integer,
  	\`variant_id\` integer,
  	\`quantity\` numeric DEFAULT 1 NOT NULL,
  	FOREIGN KEY (\`product_id\`) REFERENCES \`products\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`variant_id\`) REFERENCES \`variants\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`orders\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`orders_items_order_idx\` ON \`orders_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`orders_items_parent_id_idx\` ON \`orders_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`orders_items_product_idx\` ON \`orders_items\` (\`product_id\`);`)
  await db.run(sql`CREATE INDEX \`orders_items_variant_idx\` ON \`orders_items\` (\`variant_id\`);`)
  await db.run(sql`CREATE TABLE \`orders\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`shipping_address_title\` text,
  	\`shipping_address_first_name\` text,
  	\`shipping_address_last_name\` text,
  	\`shipping_address_company\` text,
  	\`shipping_address_address_line1\` text,
  	\`shipping_address_address_line2\` text,
  	\`shipping_address_city\` text,
  	\`shipping_address_state\` text,
  	\`shipping_address_postal_code\` text,
  	\`shipping_address_country\` text,
  	\`shipping_address_phone\` text,
  	\`customer_id\` integer,
  	\`customer_email\` text,
  	\`status\` text DEFAULT 'processing',
  	\`amount\` numeric,
  	\`currency\` text DEFAULT 'COP',
  	\`access_token\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`customer_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`orders_customer_idx\` ON \`orders\` (\`customer_id\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`orders_access_token_idx\` ON \`orders\` (\`access_token\`);`)
  await db.run(sql`CREATE INDEX \`orders_updated_at_idx\` ON \`orders\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`orders_created_at_idx\` ON \`orders\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`orders_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`transactions_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`orders\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`transactions_id\`) REFERENCES \`transactions\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`orders_rels_order_idx\` ON \`orders_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`orders_rels_parent_idx\` ON \`orders_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`orders_rels_path_idx\` ON \`orders_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`orders_rels_transactions_id_idx\` ON \`orders_rels\` (\`transactions_id\`);`)
  await db.run(sql`CREATE TABLE \`transactions_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`product_id\` integer,
  	\`variant_id\` integer,
  	\`quantity\` numeric DEFAULT 1 NOT NULL,
  	FOREIGN KEY (\`product_id\`) REFERENCES \`products\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`variant_id\`) REFERENCES \`variants\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`transactions\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`transactions_items_order_idx\` ON \`transactions_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`transactions_items_parent_id_idx\` ON \`transactions_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`transactions_items_product_idx\` ON \`transactions_items\` (\`product_id\`);`)
  await db.run(sql`CREATE INDEX \`transactions_items_variant_idx\` ON \`transactions_items\` (\`variant_id\`);`)
  await db.run(sql`CREATE TABLE \`transactions\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`payment_method\` text,
  	\`wompi_reference\` text,
  	\`wompi_transaction_i_d\` text,
  	\`wompi_payment_method\` text,
  	\`wompi_shipping_address\` text,
  	\`billing_address_title\` text,
  	\`billing_address_first_name\` text,
  	\`billing_address_last_name\` text,
  	\`billing_address_company\` text,
  	\`billing_address_address_line1\` text,
  	\`billing_address_address_line2\` text,
  	\`billing_address_city\` text,
  	\`billing_address_state\` text,
  	\`billing_address_postal_code\` text,
  	\`billing_address_country\` text,
  	\`billing_address_phone\` text,
  	\`status\` text DEFAULT 'pending' NOT NULL,
  	\`customer_id\` integer,
  	\`customer_email\` text,
  	\`order_id\` integer,
  	\`cart_id\` integer,
  	\`amount\` numeric,
  	\`currency\` text DEFAULT 'COP',
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`customer_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`order_id\`) REFERENCES \`orders\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`cart_id\`) REFERENCES \`carts\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`transactions_wompi_wompi_reference_idx\` ON \`transactions\` (\`wompi_reference\`);`)
  await db.run(sql`CREATE INDEX \`transactions_customer_idx\` ON \`transactions\` (\`customer_id\`);`)
  await db.run(sql`CREATE INDEX \`transactions_order_idx\` ON \`transactions\` (\`order_id\`);`)
  await db.run(sql`CREATE INDEX \`transactions_cart_idx\` ON \`transactions\` (\`cart_id\`);`)
  await db.run(sql`CREATE INDEX \`transactions_updated_at_idx\` ON \`transactions\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`transactions_created_at_idx\` ON \`transactions\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`payload_kv\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`key\` text NOT NULL,
  	\`data\` text NOT NULL
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`payload_kv_key_idx\` ON \`payload_kv\` (\`key\`);`)
  await db.run(sql`CREATE TABLE \`payload_jobs_log\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`executed_at\` text NOT NULL,
  	\`completed_at\` text NOT NULL,
  	\`task_slug\` text NOT NULL,
  	\`task_i_d\` text NOT NULL,
  	\`input\` text,
  	\`output\` text,
  	\`state\` text NOT NULL,
  	\`error\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`payload_jobs\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`payload_jobs_log_order_idx\` ON \`payload_jobs_log\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`payload_jobs_log_parent_id_idx\` ON \`payload_jobs_log\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`payload_jobs\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`input\` text,
  	\`completed_at\` text,
  	\`total_tried\` numeric DEFAULT 0,
  	\`has_error\` integer DEFAULT false,
  	\`error\` text,
  	\`task_slug\` text,
  	\`queue\` text DEFAULT 'default',
  	\`wait_until\` text,
  	\`processing\` integer DEFAULT false,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX \`payload_jobs_completed_at_idx\` ON \`payload_jobs\` (\`completed_at\`);`)
  await db.run(sql`CREATE INDEX \`payload_jobs_total_tried_idx\` ON \`payload_jobs\` (\`total_tried\`);`)
  await db.run(sql`CREATE INDEX \`payload_jobs_has_error_idx\` ON \`payload_jobs\` (\`has_error\`);`)
  await db.run(sql`CREATE INDEX \`payload_jobs_task_slug_idx\` ON \`payload_jobs\` (\`task_slug\`);`)
  await db.run(sql`CREATE INDEX \`payload_jobs_queue_idx\` ON \`payload_jobs\` (\`queue\`);`)
  await db.run(sql`CREATE INDEX \`payload_jobs_wait_until_idx\` ON \`payload_jobs\` (\`wait_until\`);`)
  await db.run(sql`CREATE INDEX \`payload_jobs_processing_idx\` ON \`payload_jobs\` (\`processing\`);`)
  await db.run(sql`CREATE INDEX \`payload_jobs_updated_at_idx\` ON \`payload_jobs\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`payload_jobs_created_at_idx\` ON \`payload_jobs\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`payload_locked_documents\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`global_slug\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_global_slug_idx\` ON \`payload_locked_documents\` (\`global_slug\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_updated_at_idx\` ON \`payload_locked_documents\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_created_at_idx\` ON \`payload_locked_documents\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`payload_locked_documents_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`pages_id\` integer,
  	\`articulos_id\` integer,
  	\`comentarios_id\` integer,
  	\`recursos_id\` integer,
  	\`solicitudes_recurso_id\` integer,
  	\`casos_id\` integer,
  	\`preguntas_id\` integer,
  	\`legales_id\` integer,
  	\`mensajes_id\` integer,
  	\`suscriptores_id\` integer,
  	\`boletines_id\` integer,
  	\`media_id\` integer,
  	\`categories_id\` integer,
  	\`users_id\` integer,
  	\`visitas_id\` integer,
  	\`registro_correos_id\` integer,
  	\`forms_id\` integer,
  	\`form_submissions_id\` integer,
  	\`addresses_id\` integer,
  	\`variants_id\` integer,
  	\`variant_types_id\` integer,
  	\`variant_options_id\` integer,
  	\`products_id\` integer,
  	\`carts_id\` integer,
  	\`orders_id\` integer,
  	\`transactions_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`payload_locked_documents\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`pages_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`articulos_id\`) REFERENCES \`articulos\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`comentarios_id\`) REFERENCES \`comentarios\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`recursos_id\`) REFERENCES \`recursos\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`solicitudes_recurso_id\`) REFERENCES \`solicitudes_recurso\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`casos_id\`) REFERENCES \`casos\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`preguntas_id\`) REFERENCES \`preguntas\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`legales_id\`) REFERENCES \`legales\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`mensajes_id\`) REFERENCES \`mensajes\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`suscriptores_id\`) REFERENCES \`suscriptores\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`boletines_id\`) REFERENCES \`boletines\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`media_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`categories_id\`) REFERENCES \`categories\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`visitas_id\`) REFERENCES \`visitas\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`registro_correos_id\`) REFERENCES \`registro_correos\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`forms_id\`) REFERENCES \`forms\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`form_submissions_id\`) REFERENCES \`form_submissions\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`addresses_id\`) REFERENCES \`addresses\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`variants_id\`) REFERENCES \`variants\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`variant_types_id\`) REFERENCES \`variant_types\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`variant_options_id\`) REFERENCES \`variant_options\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`products_id\`) REFERENCES \`products\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`carts_id\`) REFERENCES \`carts\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`orders_id\`) REFERENCES \`orders\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`transactions_id\`) REFERENCES \`transactions\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_order_idx\` ON \`payload_locked_documents_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_parent_idx\` ON \`payload_locked_documents_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_path_idx\` ON \`payload_locked_documents_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_pages_id_idx\` ON \`payload_locked_documents_rels\` (\`pages_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_articulos_id_idx\` ON \`payload_locked_documents_rels\` (\`articulos_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_comentarios_id_idx\` ON \`payload_locked_documents_rels\` (\`comentarios_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_recursos_id_idx\` ON \`payload_locked_documents_rels\` (\`recursos_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_solicitudes_recurso_id_idx\` ON \`payload_locked_documents_rels\` (\`solicitudes_recurso_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_casos_id_idx\` ON \`payload_locked_documents_rels\` (\`casos_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_preguntas_id_idx\` ON \`payload_locked_documents_rels\` (\`preguntas_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_legales_id_idx\` ON \`payload_locked_documents_rels\` (\`legales_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_mensajes_id_idx\` ON \`payload_locked_documents_rels\` (\`mensajes_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_suscriptores_id_idx\` ON \`payload_locked_documents_rels\` (\`suscriptores_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_boletines_id_idx\` ON \`payload_locked_documents_rels\` (\`boletines_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_media_id_idx\` ON \`payload_locked_documents_rels\` (\`media_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_categories_id_idx\` ON \`payload_locked_documents_rels\` (\`categories_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_users_id_idx\` ON \`payload_locked_documents_rels\` (\`users_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_visitas_id_idx\` ON \`payload_locked_documents_rels\` (\`visitas_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_registro_correos_id_idx\` ON \`payload_locked_documents_rels\` (\`registro_correos_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_forms_id_idx\` ON \`payload_locked_documents_rels\` (\`forms_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_form_submissions_id_idx\` ON \`payload_locked_documents_rels\` (\`form_submissions_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_addresses_id_idx\` ON \`payload_locked_documents_rels\` (\`addresses_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_variants_id_idx\` ON \`payload_locked_documents_rels\` (\`variants_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_variant_types_id_idx\` ON \`payload_locked_documents_rels\` (\`variant_types_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_variant_options_id_idx\` ON \`payload_locked_documents_rels\` (\`variant_options_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_products_id_idx\` ON \`payload_locked_documents_rels\` (\`products_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_carts_id_idx\` ON \`payload_locked_documents_rels\` (\`carts_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_orders_id_idx\` ON \`payload_locked_documents_rels\` (\`orders_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_transactions_id_idx\` ON \`payload_locked_documents_rels\` (\`transactions_id\`);`)
  await db.run(sql`CREATE TABLE \`payload_preferences\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`key\` text,
  	\`value\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX \`payload_preferences_key_idx\` ON \`payload_preferences\` (\`key\`);`)
  await db.run(sql`CREATE INDEX \`payload_preferences_updated_at_idx\` ON \`payload_preferences\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`payload_preferences_created_at_idx\` ON \`payload_preferences\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`payload_preferences_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`users_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`payload_preferences\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`payload_preferences_rels_order_idx\` ON \`payload_preferences_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`payload_preferences_rels_parent_idx\` ON \`payload_preferences_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_preferences_rels_path_idx\` ON \`payload_preferences_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`payload_preferences_rels_users_id_idx\` ON \`payload_preferences_rels\` (\`users_id\`);`)
  await db.run(sql`CREATE TABLE \`payload_migrations\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`name\` text,
  	\`batch\` numeric,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX \`payload_migrations_updated_at_idx\` ON \`payload_migrations\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`payload_migrations_created_at_idx\` ON \`payload_migrations\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`tienda_horarios_dias\` (
  	\`order\` integer NOT NULL,
  	\`parent_id\` text NOT NULL,
  	\`value\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`tienda_horarios\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`tienda_horarios_dias_order_idx\` ON \`tienda_horarios_dias\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`tienda_horarios_dias_parent_idx\` ON \`tienda_horarios_dias\` (\`parent_id\`);`)
  await db.run(sql`CREATE TABLE \`tienda_horarios\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`abre\` text NOT NULL,
  	\`cierra\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`tienda\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`tienda_horarios_order_idx\` ON \`tienda_horarios\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`tienda_horarios_parent_id_idx\` ON \`tienda_horarios\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`tienda\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`nombre\` text DEFAULT 'Mi tienda' NOT NULL,
  	\`eslogan\` text,
  	\`color_acento\` text DEFAULT '#9A4A1F',
  	\`color_oscuro\` text DEFAULT '#0E0F11',
  	\`logo_id\` integer,
  	\`logo_blanco_id\` integer,
  	\`isotipo_id\` integer,
  	\`favicon_id\` integer,
  	\`whatsapp\` text,
  	\`mensaje_whatsapp\` text DEFAULT 'Hola, vengo del sitio web y quiero más información.',
  	\`mostrar_boton_whatsapp\` integer DEFAULT true,
  	\`correo\` text,
  	\`telefono\` text,
  	\`direccion\` text,
  	\`ciudad\` text DEFAULT 'Bogotá',
  	\`departamento\` text,
  	\`horario\` text,
  	\`instagram\` text,
  	\`facebook\` text,
  	\`tiktok\` text,
  	\`linkedin\` text,
  	\`youtube\` text,
  	\`ficha_google\` text,
  	\`tipo_negocio\` text DEFAULT 'LocalBusiness',
  	\`codigo_postal\` text,
  	\`latitud\` numeric,
  	\`longitud\` numeric,
  	\`rango_precios\` text,
  	\`updated_at\` text,
  	\`created_at\` text,
  	FOREIGN KEY (\`logo_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`logo_blanco_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`isotipo_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`favicon_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`tienda_logo_idx\` ON \`tienda\` (\`logo_id\`);`)
  await db.run(sql`CREATE INDEX \`tienda_logo_blanco_idx\` ON \`tienda\` (\`logo_blanco_id\`);`)
  await db.run(sql`CREATE INDEX \`tienda_isotipo_idx\` ON \`tienda\` (\`isotipo_id\`);`)
  await db.run(sql`CREATE INDEX \`tienda_favicon_idx\` ON \`tienda\` (\`favicon_id\`);`)
  await db.run(sql`CREATE TABLE \`tienda_texts\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer NOT NULL,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`text\` text,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`tienda\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`tienda_texts_order_parent\` ON \`tienda_texts\` (\`order\`,\`parent_id\`);`)
  await db.run(sql`CREATE TABLE \`navegacion_menu\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`etiqueta\` text NOT NULL,
  	\`enlace\` text NOT NULL,
  	\`icono\` text DEFAULT 'home',
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`navegacion\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`navegacion_menu_order_idx\` ON \`navegacion_menu\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`navegacion_menu_parent_id_idx\` ON \`navegacion_menu\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`navegacion_riel\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`etiqueta\` text NOT NULL,
  	\`enlace\` text NOT NULL,
  	\`icono\` text DEFAULT 'home',
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`navegacion\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`navegacion_riel_order_idx\` ON \`navegacion_riel\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`navegacion_riel_parent_id_idx\` ON \`navegacion_riel\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`navegacion_enlaces_pie\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`etiqueta\` text NOT NULL,
  	\`enlace\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`navegacion\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`navegacion_enlaces_pie_order_idx\` ON \`navegacion_enlaces_pie\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`navegacion_enlaces_pie_parent_id_idx\` ON \`navegacion_enlaces_pie\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`navegacion_legales\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`etiqueta\` text NOT NULL,
  	\`enlace\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`navegacion\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`navegacion_legales_order_idx\` ON \`navegacion_legales\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`navegacion_legales_parent_id_idx\` ON \`navegacion_legales\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`navegacion\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`boton_cabecera\` text DEFAULT 'Hablemos',
  	\`mostrar_carrito\` integer DEFAULT false,
  	\`mostrar_riel\` integer DEFAULT true,
  	\`descripcion_pie\` text,
  	\`titulo_enlaces_pie\` text DEFAULT 'Servicios',
  	\`texto_whatsapp_pie\` text DEFAULT 'Atención directa por WhatsApp',
  	\`updated_at\` text,
  	\`created_at\` text
  );
  `)
  await db.run(sql`CREATE TABLE \`avisos\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`correo_avisos\` text,
  	\`remitente\` text DEFAULT 'Mi negocio <hola@midominio.com>',
  	\`enviar_confirmacion\` integer DEFAULT true,
  	\`texto_confirmacion\` text DEFAULT 'Tu mensaje llegó bien. Te respondemos en menos de 24 horas hábiles. Si es urgente, responde a este correo o escríbenos por WhatsApp.',
  	\`updated_at\` text,
  	\`created_at\` text
  );
  `)
  await db.run(sql`CREATE TABLE \`medicion\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`ga4\` text,
  	\`gtm\` text,
  	\`meta_pixel\` text,
  	\`tiktok_pixel\` text,
  	\`clarity\` text,
  	\`pedir_consentimiento\` integer DEFAULT true,
  	\`texto_aviso\` text DEFAULT 'Usamos cookies para medir las visitas y mejorar el sitio. Tú decides si las activamos.',
  	\`boton_aceptar\` text DEFAULT 'Aceptar',
  	\`boton_rechazar\` text DEFAULT 'Solo las necesarias',
  	\`enlace_politica\` text DEFAULT '/cookies',
  	\`codigo_cabecera\` text,
  	\`codigo_final\` text,
  	\`updated_at\` text,
  	\`created_at\` text
  );
  `)
  await db.run(sql`CREATE TABLE \`ventanas\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`salida_activa\` integer DEFAULT false,
  	\`salida_titulo\` text DEFAULT '¿Te vas sin resolver tu duda?',
  	\`salida_texto\` text DEFAULT 'Escríbenos por WhatsApp y te respondemos en minutos, sin compromiso.',
  	\`salida_accion\` text DEFAULT 'whatsapp',
  	\`salida_boton\` text DEFAULT 'Escribir por WhatsApp',
  	\`salida_mensaje_whatsapp\` text,
  	\`salida_enlace\` text,
  	\`salida_recurso_id\` integer,
  	\`salida_dias\` numeric DEFAULT 7,
  	\`salida_segundos_minimos\` numeric DEFAULT 10,
  	\`burbuja_activa\` integer DEFAULT false,
  	\`burbuja_mensaje\` text DEFAULT 'Hola 👋 ¿Tienes alguna pregunta? Te ayudamos por WhatsApp.',
  	\`burbuja_segundos\` numeric DEFAULT 25,
  	\`burbuja_dias\` numeric DEFAULT 1,
  	\`updated_at\` text,
  	\`created_at\` text,
  	FOREIGN KEY (\`salida_recurso_id\`) REFERENCES \`recursos\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`ventanas_salida_recurso_idx\` ON \`ventanas\` (\`salida_recurso_id\`);`)
  await db.run(sql`CREATE TABLE \`ventanas_texts\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer NOT NULL,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`text\` text,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`ventanas\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`ventanas_texts_order_parent\` ON \`ventanas_texts\` (\`order\`,\`parent_id\`);`)
  await db.run(sql`CREATE TABLE \`modulos\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`blog\` integer DEFAULT true,
  	\`boletin\` integer DEFAULT true,
  	\`recursos\` integer DEFAULT true,
  	\`tienda\` integer DEFAULT true,
  	\`updated_at\` text,
  	\`created_at\` text
  );
  `)
  await db.run(sql`CREATE TABLE \`blog\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`eyebrow\` text DEFAULT 'Blog',
  	\`titulo\` text DEFAULT 'Lo que hay que saber,',
  	\`enfasis\` text,
  	\`lead\` text,
  	\`cita\` text,
  	\`meta\` text,
  	\`sin_articulos\` text DEFAULT 'Muy pronto publicaremos el primer artículo.',
  	\`seo_titulo\` text,
  	\`seo_descripcion\` text,
  	\`mostrar_boletin\` integer DEFAULT true,
  	\`boletin_etiqueta\` text DEFAULT 'Boletín',
  	\`boletin_titulo\` text DEFAULT 'Recibe los artículos',
  	\`boletin_enfasis\` text DEFAULT 'cuando salgan',
  	\`boletin_texto\` text,
  	\`boletin_boton\` text DEFAULT 'Suscribirme',
  	\`boletin_nota\` text DEFAULT 'Sin spam. Te puedes dar de baja en un clic.',
  	\`boletin_exito\` text DEFAULT 'Escribimos poco y solo cuando hay algo que de verdad sirve. Puedes salirte cuando quieras desde cualquier correo.',
  	\`bienvenida\` text DEFAULT 'Gracias por suscribirte. Te escribiremos solo cuando publiquemos algo que de verdad te sirva.',
  	\`avisar_suscripcion\` integer DEFAULT true,
  	\`texto_indice\` text DEFAULT 'En este artículo',
  	\`texto_sigue_leyendo\` text DEFAULT 'Sigue leyendo',
  	\`mostrar_compartir\` integer DEFAULT true,
  	\`texto_compartir\` text DEFAULT '¿Le sirve a alguien? Compártelo',
  	\`permitir_comentarios\` integer DEFAULT true,
  	\`titulo_comentarios\` text DEFAULT 'Comentarios',
  	\`boton_comentario\` text DEFAULT 'Enviar comentario',
  	\`invitacion_comentarios\` text DEFAULT 'Sé la primera persona en comentar. ¿Qué te quedó dando vueltas?',
  	\`aviso_moderacion\` text DEFAULT 'Gracias. Tu comentario aparecerá cuando lo revisemos.',
  	\`avisar_comentario\` integer DEFAULT true,
  	\`cierre_titulo\` text,
  	\`cierre_enfasis\` text,
  	\`cierre_lead\` text,
  	\`cierre_boton\` text DEFAULT 'Cuéntanos tu caso',
  	\`cierre_mensaje_whatsapp\` text,
  	\`updated_at\` text,
  	\`created_at\` text
  );
  `)
  await db.run(sql`CREATE TABLE \`tienda_textos_garantias\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`texto\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`tienda_textos\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`tienda_textos_garantias_order_idx\` ON \`tienda_textos_garantias\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`tienda_textos_garantias_parent_id_idx\` ON \`tienda_textos_garantias\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`tienda_textos\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`eyebrow\` text DEFAULT 'Tienda',
  	\`catalogo_titulo\` text DEFAULT 'Todo lo que ofrecemos,',
  	\`catalogo_enfasis\` text DEFAULT 'listo para pedir',
  	\`lead\` text DEFAULT 'Elige, paga en línea con tarjeta, PSE o Nequi y te lo enviamos.',
  	\`buscador\` text DEFAULT 'Buscar productos…',
  	\`sin_resultados\` text DEFAULT 'No encontramos productos con esos filtros.',
  	\`texto_volver\` text DEFAULT 'Volver a la tienda',
  	\`texto_agregar\` text DEFAULT 'Agregar al carrito',
  	\`texto_elegir\` text DEFAULT 'Elige una opción para continuar',
  	\`texto_preguntar\` text DEFAULT 'Preguntar por WhatsApp',
  	\`mensaje_preguntar\` text DEFAULT 'Hola, tengo una pregunta sobre {producto}.',
  	\`texto_relacionados\` text DEFAULT 'También te puede gustar',
  	\`carrito_titulo\` text DEFAULT 'Tu carrito',
  	\`carrito_vacio\` text DEFAULT 'Tu carrito está vacío.',
  	\`texto_finalizar\` text DEFAULT 'Finalizar compra',
  	\`pago_titulo\` text DEFAULT 'Finaliza tu',
  	\`pago_enfasis\` text DEFAULT 'compra',
  	\`pago_lead\` text DEFAULT 'Déjanos tus datos de envío y paga de forma segura con Wompi.',
  	\`updated_at\` text,
  	\`created_at\` text
  );
  `)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`pages_blocks_encabezado_pagina\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_contacto_formulario_opciones\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_contacto_formulario\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_boletin_suscripcion\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_recurso_gratis\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_servicio_portada_municipios\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_servicio_portada_chips\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_servicio_portada\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_escena_iluminada\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_caracteristicas_activas_items\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_caracteristicas_activas\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_pasos_linea_items\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_pasos_linea\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_desfile_casos\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_preguntas_servicio\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_otros_servicios_items\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_otros_servicios\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_cierre_servicio\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_cobertura_municipios_municipios\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_cobertura_municipios\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_comparativa_opciones_filas\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_comparativa_opciones\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_portada_paisaje_barra\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_portada_paisaje\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_escenas_problema_escenas\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_escenas_problema\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_soluciones_pestanas_items_puntos\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_soluciones_pestanas_items\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_soluciones_pestanas\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_servicios_lista_items_puntos\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_servicios_lista_items\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_servicios_lista\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_casos_cinta\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_franja_llamada\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_panel_control_pantallas_campos\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_panel_control_pantallas\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_panel_control_ahorro\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_panel_control\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_proceso_pasos_items\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_proceso_pasos\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_cotizador_whatsapp_tipos\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_cotizador_whatsapp_tamanos\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_cotizador_whatsapp_extras\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_cotizador_whatsapp_plazos\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_cotizador_whatsapp\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_confianza_datos_datos\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_confianza_datos\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_preguntas_frecuentes\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_cierre_negro_garantias\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_cierre_negro\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_cta_links\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_cta\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_content_columns\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_content\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_media_block\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_archive\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_carousel\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_three_item_grid\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_banner\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_form_block\`;`)
  await db.run(sql`DROP TABLE \`pages_hero_links\`;`)
  await db.run(sql`DROP TABLE \`pages\`;`)
  await db.run(sql`DROP TABLE \`pages_rels\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_encabezado_pagina\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_contacto_formulario_opciones\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_contacto_formulario\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_boletin_suscripcion\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_recurso_gratis\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_servicio_portada_municipios\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_servicio_portada_chips\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_servicio_portada\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_escena_iluminada\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_caracteristicas_activas_items\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_caracteristicas_activas\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_pasos_linea_items\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_pasos_linea\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_desfile_casos\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_preguntas_servicio\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_otros_servicios_items\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_otros_servicios\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_cierre_servicio\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_cobertura_municipios_municipios\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_cobertura_municipios\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_comparativa_opciones_filas\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_comparativa_opciones\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_portada_paisaje_barra\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_portada_paisaje\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_escenas_problema_escenas\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_escenas_problema\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_soluciones_pestanas_items_puntos\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_soluciones_pestanas_items\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_soluciones_pestanas\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_servicios_lista_items_puntos\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_servicios_lista_items\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_servicios_lista\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_casos_cinta\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_franja_llamada\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_panel_control_pantallas_campos\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_panel_control_pantallas\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_panel_control_ahorro\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_panel_control\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_proceso_pasos_items\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_proceso_pasos\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_cotizador_whatsapp_tipos\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_cotizador_whatsapp_tamanos\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_cotizador_whatsapp_extras\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_cotizador_whatsapp_plazos\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_cotizador_whatsapp\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_confianza_datos_datos\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_confianza_datos\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_preguntas_frecuentes\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_cierre_negro_garantias\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_cierre_negro\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_cta_links\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_cta\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_content_columns\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_content\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_media_block\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_archive\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_carousel\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_three_item_grid\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_banner\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_form_block\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_version_hero_links\`;`)
  await db.run(sql`DROP TABLE \`_pages_v\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_rels\`;`)
  await db.run(sql`DROP TABLE \`articulos\`;`)
  await db.run(sql`DROP TABLE \`articulos_texts\`;`)
  await db.run(sql`DROP TABLE \`_articulos_v\`;`)
  await db.run(sql`DROP TABLE \`_articulos_v_texts\`;`)
  await db.run(sql`DROP TABLE \`comentarios\`;`)
  await db.run(sql`DROP TABLE \`recursos_beneficios\`;`)
  await db.run(sql`DROP TABLE \`recursos\`;`)
  await db.run(sql`DROP TABLE \`solicitudes_recurso\`;`)
  await db.run(sql`DROP TABLE \`casos\`;`)
  await db.run(sql`DROP TABLE \`preguntas\`;`)
  await db.run(sql`DROP TABLE \`legales\`;`)
  await db.run(sql`DROP TABLE \`mensajes\`;`)
  await db.run(sql`DROP TABLE \`suscriptores\`;`)
  await db.run(sql`DROP TABLE \`boletines\`;`)
  await db.run(sql`DROP TABLE \`media\`;`)
  await db.run(sql`DROP TABLE \`categories\`;`)
  await db.run(sql`DROP TABLE \`users_roles\`;`)
  await db.run(sql`DROP TABLE \`users_sessions\`;`)
  await db.run(sql`DROP TABLE \`users\`;`)
  await db.run(sql`DROP TABLE \`visitas\`;`)
  await db.run(sql`DROP TABLE \`registro_correos\`;`)
  await db.run(sql`DROP TABLE \`forms_blocks_checkbox\`;`)
  await db.run(sql`DROP TABLE \`forms_blocks_country\`;`)
  await db.run(sql`DROP TABLE \`forms_blocks_email\`;`)
  await db.run(sql`DROP TABLE \`forms_blocks_message\`;`)
  await db.run(sql`DROP TABLE \`forms_blocks_number\`;`)
  await db.run(sql`DROP TABLE \`forms_blocks_select_options\`;`)
  await db.run(sql`DROP TABLE \`forms_blocks_select\`;`)
  await db.run(sql`DROP TABLE \`forms_blocks_state\`;`)
  await db.run(sql`DROP TABLE \`forms_blocks_text\`;`)
  await db.run(sql`DROP TABLE \`forms_blocks_textarea\`;`)
  await db.run(sql`DROP TABLE \`forms_emails\`;`)
  await db.run(sql`DROP TABLE \`forms\`;`)
  await db.run(sql`DROP TABLE \`form_submissions_submission_data\`;`)
  await db.run(sql`DROP TABLE \`form_submissions\`;`)
  await db.run(sql`DROP TABLE \`addresses\`;`)
  await db.run(sql`DROP TABLE \`variants\`;`)
  await db.run(sql`DROP TABLE \`variants_rels\`;`)
  await db.run(sql`DROP TABLE \`_variants_v\`;`)
  await db.run(sql`DROP TABLE \`_variants_v_rels\`;`)
  await db.run(sql`DROP TABLE \`variant_types\`;`)
  await db.run(sql`DROP TABLE \`variant_options\`;`)
  await db.run(sql`DROP TABLE \`products_gallery\`;`)
  await db.run(sql`DROP TABLE \`products_blocks_cta_links\`;`)
  await db.run(sql`DROP TABLE \`products_blocks_cta\`;`)
  await db.run(sql`DROP TABLE \`products_blocks_content_columns\`;`)
  await db.run(sql`DROP TABLE \`products_blocks_content\`;`)
  await db.run(sql`DROP TABLE \`products_blocks_media_block\`;`)
  await db.run(sql`DROP TABLE \`products\`;`)
  await db.run(sql`DROP TABLE \`products_rels\`;`)
  await db.run(sql`DROP TABLE \`_products_v_version_gallery\`;`)
  await db.run(sql`DROP TABLE \`_products_v_blocks_cta_links\`;`)
  await db.run(sql`DROP TABLE \`_products_v_blocks_cta\`;`)
  await db.run(sql`DROP TABLE \`_products_v_blocks_content_columns\`;`)
  await db.run(sql`DROP TABLE \`_products_v_blocks_content\`;`)
  await db.run(sql`DROP TABLE \`_products_v_blocks_media_block\`;`)
  await db.run(sql`DROP TABLE \`_products_v\`;`)
  await db.run(sql`DROP TABLE \`_products_v_rels\`;`)
  await db.run(sql`DROP TABLE \`carts_items\`;`)
  await db.run(sql`DROP TABLE \`carts\`;`)
  await db.run(sql`DROP TABLE \`orders_items\`;`)
  await db.run(sql`DROP TABLE \`orders\`;`)
  await db.run(sql`DROP TABLE \`orders_rels\`;`)
  await db.run(sql`DROP TABLE \`transactions_items\`;`)
  await db.run(sql`DROP TABLE \`transactions\`;`)
  await db.run(sql`DROP TABLE \`payload_kv\`;`)
  await db.run(sql`DROP TABLE \`payload_jobs_log\`;`)
  await db.run(sql`DROP TABLE \`payload_jobs\`;`)
  await db.run(sql`DROP TABLE \`payload_locked_documents\`;`)
  await db.run(sql`DROP TABLE \`payload_locked_documents_rels\`;`)
  await db.run(sql`DROP TABLE \`payload_preferences\`;`)
  await db.run(sql`DROP TABLE \`payload_preferences_rels\`;`)
  await db.run(sql`DROP TABLE \`payload_migrations\`;`)
  await db.run(sql`DROP TABLE \`tienda_horarios_dias\`;`)
  await db.run(sql`DROP TABLE \`tienda_horarios\`;`)
  await db.run(sql`DROP TABLE \`tienda\`;`)
  await db.run(sql`DROP TABLE \`tienda_texts\`;`)
  await db.run(sql`DROP TABLE \`navegacion_menu\`;`)
  await db.run(sql`DROP TABLE \`navegacion_riel\`;`)
  await db.run(sql`DROP TABLE \`navegacion_enlaces_pie\`;`)
  await db.run(sql`DROP TABLE \`navegacion_legales\`;`)
  await db.run(sql`DROP TABLE \`navegacion\`;`)
  await db.run(sql`DROP TABLE \`avisos\`;`)
  await db.run(sql`DROP TABLE \`medicion\`;`)
  await db.run(sql`DROP TABLE \`ventanas\`;`)
  await db.run(sql`DROP TABLE \`ventanas_texts\`;`)
  await db.run(sql`DROP TABLE \`modulos\`;`)
  await db.run(sql`DROP TABLE \`blog\`;`)
  await db.run(sql`DROP TABLE \`tienda_textos_garantias\`;`)
  await db.run(sql`DROP TABLE \`tienda_textos\`;`)
}
