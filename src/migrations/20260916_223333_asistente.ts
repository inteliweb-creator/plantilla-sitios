import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`registro_asistente\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`detalle\` text,
  	\`estado\` text,
  	\`herramienta\` text,
  	\`datos\` text,
  	\`resultado\` text,
  	\`usuario_id\` integer,
  	\`aprobado_por_id\` integer,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`usuario_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`aprobado_por_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`registro_asistente_estado_idx\` ON \`registro_asistente\` (\`estado\`);`)
  await db.run(sql`CREATE INDEX \`registro_asistente_usuario_idx\` ON \`registro_asistente\` (\`usuario_id\`);`)
  await db.run(sql`CREATE INDEX \`registro_asistente_aprobado_por_idx\` ON \`registro_asistente\` (\`aprobado_por_id\`);`)
  await db.run(sql`CREATE INDEX \`registro_asistente_updated_at_idx\` ON \`registro_asistente\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`registro_asistente_created_at_idx\` ON \`registro_asistente\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`conversaciones_asistente\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`titulo\` text,
  	\`usuario_id\` integer,
  	\`mensajes\` text,
  	\`estado\` text DEFAULT 'lista',
  	\`progreso\` text,
  	\`trabajando_desde\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`usuario_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`conversaciones_asistente_usuario_idx\` ON \`conversaciones_asistente\` (\`usuario_id\`);`)
  await db.run(sql`CREATE INDEX \`conversaciones_asistente_updated_at_idx\` ON \`conversaciones_asistente\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`conversaciones_asistente_created_at_idx\` ON \`conversaciones_asistente\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`asistente_conexiones\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`proveedor\` text DEFAULT 'deepseek' NOT NULL,
  	\`modelo\` text,
  	\`activa\` integer DEFAULT true,
  	\`url_base\` text,
  	\`clave_resumen\` text,
  	\`clave_cifrada\` text,
  	\`ultimo_error\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`asistente\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`asistente_conexiones_order_idx\` ON \`asistente_conexiones\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`asistente_conexiones_parent_id_idx\` ON \`asistente_conexiones\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`asistente\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`activo\` integer DEFAULT false,
  	\`nombre\` text DEFAULT 'Asistente',
  	\`instrucciones\` text,
  	\`investigar\` integer DEFAULT true,
  	\`videos\` integer DEFAULT true,
  	\`imagenes\` integer DEFAULT true,
  	\`modelo_imagen\` text,
  	\`limite_tokens_mes\` numeric DEFAULT 2000000,
  	\`tokens_mes\` numeric DEFAULT 0,
  	\`uso_mes\` text,
  	\`updated_at\` text,
  	\`created_at\` text
  );
  `)
  await db.run(sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`registro_asistente_id\` integer REFERENCES registro_asistente(id);`)
  await db.run(sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`conversaciones_asistente_id\` integer REFERENCES conversaciones_asistente(id);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_registro_asistente_id_idx\` ON \`payload_locked_documents_rels\` (\`registro_asistente_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_conversaciones_asistente_i_idx\` ON \`payload_locked_documents_rels\` (\`conversaciones_asistente_id\`);`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`registro_asistente\`;`)
  await db.run(sql`DROP TABLE \`conversaciones_asistente\`;`)
  await db.run(sql`DROP TABLE \`asistente_conexiones\`;`)
  await db.run(sql`DROP TABLE \`asistente\`;`)
  await db.run(sql`PRAGMA foreign_keys=OFF;`)
  await db.run(sql`CREATE TABLE \`__new_payload_locked_documents_rels\` (
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
  await db.run(sql`INSERT INTO \`__new_payload_locked_documents_rels\`("id", "order", "parent_id", "path", "pages_id", "articulos_id", "comentarios_id", "recursos_id", "solicitudes_recurso_id", "casos_id", "preguntas_id", "legales_id", "mensajes_id", "suscriptores_id", "boletines_id", "media_id", "categories_id", "users_id", "visitas_id", "registro_correos_id", "forms_id", "form_submissions_id", "addresses_id", "variants_id", "variant_types_id", "variant_options_id", "products_id", "carts_id", "orders_id", "transactions_id") SELECT "id", "order", "parent_id", "path", "pages_id", "articulos_id", "comentarios_id", "recursos_id", "solicitudes_recurso_id", "casos_id", "preguntas_id", "legales_id", "mensajes_id", "suscriptores_id", "boletines_id", "media_id", "categories_id", "users_id", "visitas_id", "registro_correos_id", "forms_id", "form_submissions_id", "addresses_id", "variants_id", "variant_types_id", "variant_options_id", "products_id", "carts_id", "orders_id", "transactions_id" FROM \`payload_locked_documents_rels\`;`)
  await db.run(sql`DROP TABLE \`payload_locked_documents_rels\`;`)
  await db.run(sql`ALTER TABLE \`__new_payload_locked_documents_rels\` RENAME TO \`payload_locked_documents_rels\`;`)
  await db.run(sql`PRAGMA foreign_keys=ON;`)
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
}
