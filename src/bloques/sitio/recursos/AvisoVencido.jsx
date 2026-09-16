'use client';

import { useSearchParams } from 'next/navigation';

/** Aviso cuando alguien abre un enlace de descarga que ya venció. */
export default function AvisoVencido() {
  if (!useSearchParams().get('vencido')) return null;
  return (
    <p role="alert" className="text-sm text-accent mb-4">
      Ese enlace de descarga ya venció. Pídelo de nuevo y te enviamos uno nuevo.
    </p>
  );
}
