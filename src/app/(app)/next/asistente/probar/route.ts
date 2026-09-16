import { descifrar } from '@/asistente/cifrado'
import { llamarConReintentos, type ConfigModelo } from '@/asistente/modelo'
import { candidatos, modelosDisponibles } from '@/asistente/modelos'
import { PROVEEDORES, type Proveedor } from '@/asistente/proveedores'

import { exigirAdmin } from '@/asistente/permiso'

export const maxDuration = 60

/**
 * Prueba la conexión con lo que hay escrito en el formulario (aunque no se
 * haya guardado). Si no se pegó una clave nueva, usa la guardada.
 */
export async function POST(req: Request): Promise<Response> {
  const { payload, rechazo } = await exigirAdmin(20, 'pruebas')
  if (rechazo) return rechazo
  const cuerpo = await req.json().catch(() => ({}))

  const proveedor = (cuerpo?.proveedor in PROVEEDORES ? cuerpo.proveedor : 'deepseek') as Proveedor
  const base = PROVEEDORES[proveedor]
  const url = String((proveedor === 'personalizado' ? cuerpo?.urlBase : base.url) || '').trim().replace(/\/$/, '')
  const modelo = String(cuerpo?.modelo || base.modelo || '').trim()
  let clave = String(cuerpo?.claveNueva || '').trim()
  if (!clave && cuerpo?.filaId) {
    const guardado: any = await payload.findGlobal({ slug: 'asistente', depth: 0, overrideAccess: true, showHiddenFields: true })
    const fila = (guardado?.conexiones || []).find((f: any) => String(f.id) === String(cuerpo.filaId))
    // La clave guardada solo sirve para el mismo proveedor con el que se guardó.
    if (fila && fila.proveedor === proveedor) clave = descifrar(fila.claveCifrada) || ''
  }

  if (!clave) return Response.json({ ok: false, mensaje: 'Pega la clave primero.' })
  if (!/^https:\/\//.test(url) && !/^http:\/\/(localhost|127\.0\.0\.1)[:/]/.test(url)) return Response.json({ ok: false, mensaje: 'La dirección del servicio debe empezar por https://' })
  if (!modelo) return Response.json({ ok: false, mensaje: 'Escribe el nombre del modelo.' })

  const config = { url, modelo, clave, proveedor, nombreProveedor: base.nombre }
  const inicio = Date.now()
  const segundos = () => ((Date.now() - inicio) / 1000).toFixed(1)
  const oculto = (t: string) => t.replaceAll(clave, '••••')

  try {
    const r = await probarModelo(config)
    return Response.json({
      ok: r,
      mensaje: r
        ? `Conectado con ${base.nombre} (${modelo}) en ${segundos()} s. Todo listo: guarda y enciende el asistente.`
        : `Conecta con ${base.nombre} (${modelo}), pero este modelo no sabe usar herramientas, así que no podría consultar ni crear nada. Elige otro modelo.`,
    })
  } catch (e: any) {
    if (!e?.sinModelo && !e?.transitorio) return Response.json({ ok: false, mensaje: oculto(String(e?.message || 'No se pudo conectar.')) })

    // La clave sirve pero ese modelo no: se pregunta cuáles tiene la cuenta y se prueba el mejor.
    const disponibles = await modelosDisponibles(config)
    const opciones = candidatos(disponibles, base.modelo).filter((m) => m !== modelo).slice(0, 4)
    for (const alternativa of opciones) {
      try {
        if (await probarModelo({ ...config, modelo: alternativa })) {
          return Response.json({
            ok: true,
            modeloSugerido: alternativa,
            mensaje: e?.transitorio
              ? `El modelo "${modelo}" está saturado en este momento, pero "${alternativa}" de tu misma cuenta sí responde (${segundos()} s). Lo escribí en el campo Modelo: pulsa Guardar.`
              : `Tu clave funciona, pero el modelo "${modelo}" no está disponible para tu cuenta. Elegí "${alternativa}", que sí funciona (${segundos()} s). Ya lo escribí en el campo Modelo: pulsa Guardar y enciende el asistente.`,
          })
        }
      } catch {}
    }
    const lista = candidatos(disponibles).slice(0, 8)
    if (e?.transitorio) {
      return Response.json({
        ok: false,
        mensaje: `${oculto(String(e?.message))} Vuelve a probar en unos minutos. Mientras tanto, si tienes otra conexión de respaldo (por ejemplo DeepSeek), el asistente la usará sola.`,
      })
    }
    return Response.json({
      ok: false,
      mensaje: lista.length
        ? `Tu clave funciona, pero el modelo "${modelo}" no está disponible y no encontré otro que responda. Modelos de tu cuenta: ${lista.join(', ')}. Escribe uno en el campo Modelo y prueba de nuevo.`
        : oculto(String(e?.message || 'No se pudo conectar.')),
    })
  }
}

/** true si el modelo responde y sabe usar herramientas; lanza el error del proveedor si falla. */
async function probarModelo(config: ConfigModelo) {
  const herramienta = [{ type: 'function', function: { name: 'confirmar', description: 'Confirma que funciona', parameters: { type: 'object', properties: { ok: { type: 'boolean' } }, required: ['ok'] } } }]
  const { mensaje } = await llamarConReintentos(config, [{ role: 'user', content: 'Prueba de conexión. Usa la herramienta "confirmar" con ok=true.' }], herramienta, {
    maxTokens: 1000,
    temperatura: 0,
    timeoutMs: 30_000,
  })
  return Boolean(mensaje.tool_calls?.length)
}
