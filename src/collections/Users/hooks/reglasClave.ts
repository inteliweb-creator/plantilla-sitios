import type { CollectionBeforeOperationHook } from 'payload'
import { ValidationError } from 'payload'
import crypto from 'crypto'

/**
 * Reglas para cualquier contraseña nueva, venga de donde venga: crear una
 * cuenta, cambiarla desde el panel o recuperarla con el enlace del correo.
 *
 * - Mínimo 12 caracteres y que no contenga el correo.
 * - Quien cambia SU PROPIA contraseña debe escribir la actual. Así, alguien que
 *   encuentre la sesión abierta en un computador ajeno no puede quedarse con
 *   la cuenta.
 */

export const LARGO_MINIMO = 12

function problemaDeClave(clave: string, correo?: string): string | null {
  if (clave.length < LARGO_MINIMO) return `La contraseña debe tener al menos ${LARGO_MINIMO} caracteres.`
  if (/^(.)\1+$/.test(clave)) return 'La contraseña no puede ser el mismo carácter repetido.'
  const usuario = correo?.split('@')[0]?.toLowerCase()
  if (usuario && usuario.length >= 4 && clave.toLowerCase().includes(usuario)) {
    return 'La contraseña no puede contener tu correo.'
  }
  return null
}

/** Compara con el mismo cálculo que usa Payload al iniciar sesión. */
function coincide(clave: string, salt?: string, hash?: string) {
  if (typeof salt !== 'string' || typeof hash !== 'string') return Promise.resolve(false)
  return new Promise<boolean>((resolve) => {
    crypto.pbkdf2(clave, salt, 25000, 512, 'sha256', (e, calculado) => {
      const guardado = Buffer.from(hash, 'hex')
      resolve(!e && calculado.length === guardado.length && crypto.timingSafeEqual(calculado, guardado))
    })
  })
}

const error = (path: string, message: string) =>
  new ValidationError({ collection: 'users', errors: [{ path, message }] })

export const reglasClave: CollectionBeforeOperationHook = async ({ args: argumentos, operation, req }) => {
  const args = argumentos as any
  const data = args?.data
  const clave = data?.password
  if (typeof clave !== 'string' || !clave) return args

  if (operation === 'resetPassword') {
    const problema = problemaDeClave(clave)
    if (problema) throw error('password', problema)
    return args
  }

  if (operation === 'create') {
    const problema = problemaDeClave(clave, data?.email)
    if (problema) throw error('password', problema)
    return args
  }

  if (operation === 'update') {
    // Nunca se cambian contraseñas en lote.
    if (args.id === undefined || args.id === null) throw error('password', 'La contraseña se cambia de una cuenta a la vez.')

    const actual = await req.payload.db.findOne<any>({
      collection: 'users',
      where: { id: { equals: args.id } },
      req,
    })
    const problema = problemaDeClave(clave, data?.email || actual?.email)
    if (problema) throw error('password', problema)

    const esPropia = req.user && String(req.user.id) === String(args.id)
    if (esPropia && !req.context?.claveVerificada) {
      const escrita = typeof data.claveActual === 'string' ? data.claveActual : ''
      if (!escrita) throw error('claveActual', 'Escribe tu contraseña actual para poder cambiarla.')
      if (!(await coincide(escrita, actual?.salt, actual?.hash))) {
        throw error('claveActual', 'La contraseña actual no es correcta.')
      }
      if (escrita === clave) throw error('password', 'La nueva contraseña debe ser distinta de la actual.')
    }
  }

  return args
}
