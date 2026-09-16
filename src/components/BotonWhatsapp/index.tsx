import { getCachedGlobal } from '@/utilities/getGlobals'

/**
 * Botón flotante de WhatsApp. Número y mensaje salen de "Datos de la tienda";
 * si no hay número o el cliente lo apaga, no se muestra.
 */
export async function BotonWhatsapp() {
  const tienda: any = await getCachedGlobal('tienda' as any, 0)()
  if (!tienda?.whatsapp || tienda?.mostrarBotonWhatsapp === false) return null

  const url = `https://wa.me/${tienda.whatsapp}?text=${encodeURIComponent(tienda.mensajeWhatsapp || '')}`

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Escribir por WhatsApp"
      className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-105"
    >
      <svg viewBox="0 0 24 24" className="h-7 w-7" fill="currentColor" aria-hidden="true">
        <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.64.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.21 3.08c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.7.63.71.23 1.36.2 1.87.12.57-.08 1.76-.72 2.01-1.42.25-.7.25-1.29.17-1.42-.07-.12-.27-.2-.57-.35zM12.04 21.8h-.01a9.8 9.8 0 0 1-5-1.37l-.36-.21-3.72.97 1-3.62-.24-.37a9.8 9.8 0 1 1 8.33 4.6zm8.34-18.13A11.78 11.78 0 0 0 12.04.2C5.5.2.2 5.5.2 12.03c0 2.09.55 4.12 1.59 5.92L.1 24l6.2-1.63a11.8 11.8 0 0 0 5.73 1.46h.01c6.53 0 11.84-5.3 11.84-11.83 0-3.16-1.23-6.13-3.46-8.36z" />
      </svg>
    </a>
  )
}
