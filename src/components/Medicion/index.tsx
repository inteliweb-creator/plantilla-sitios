import { getCachedGlobal } from '@/utilities/getGlobals'

import { Analitica } from './Analitica'
import { ContadorVisitas } from './ContadorVisitas'

/** Estadísticas propias (siempre) y herramientas externas de "Analítica y píxeles" (si hay). */
export async function Medicion() {
  const m: any = await getCachedGlobal('medicion', 0)()
  const config = {
    ga4: m?.ga4,
    gtm: m?.gtm,
    metaPixel: m?.metaPixel,
    tiktokPixel: m?.tiktokPixel,
    clarity: m?.clarity,
    pedirConsentimiento: m?.pedirConsentimiento,
    textoAviso: m?.textoAviso,
    botonAceptar: m?.botonAceptar,
    botonRechazar: m?.botonRechazar,
    enlacePolitica: m?.enlacePolitica,
    codigoCabecera: m?.codigoCabecera,
    codigoFinal: m?.codigoFinal,
  }
  return (
    <>
      <ContadorVisitas />
      <Analitica config={config} />
    </>
  )
}
