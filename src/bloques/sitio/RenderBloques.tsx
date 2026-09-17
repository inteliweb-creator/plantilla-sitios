import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { unstable_cache } from 'next/cache'
import React from 'react'

import { getCachedGlobal } from '@/utilities/getGlobals'

import Portada from './componentes/Portada.jsx'
import Escenas from './componentes/Escenas.jsx'
import Soluciones from './componentes/Soluciones.jsx'
import Servicios from './componentes/Servicios.jsx'
import Casos from './componentes/Casos.jsx'
import Franja from './componentes/Franja.jsx'
import Proceso from './componentes/Proceso.jsx'
import Cotizador from './componentes/Cotizador.jsx'
import Confianza from './componentes/Confianza.jsx'
import Preguntas from './componentes/Preguntas.jsx'
import Cierre from './componentes/Cierre.jsx'
import Encabezado from './componentes/Encabezado.jsx'
import Contacto from './componentes/Contacto.jsx'
import Panel from './componentes/Panel.jsx'
import { RecuadroBoletin } from './blog/Piezas.jsx'
import BloqueRecurso from './recursos/BloqueRecurso'
import { recursoPorId } from './recursos/datos'
import ServicioHero from './componentes/servicio/ServicioHero.jsx'
import EscenaIluminada from './componentes/servicio/EscenaIluminada.jsx'
import CaracteristicasActivas from './componentes/servicio/CaracteristicasActivas.jsx'
import PasosLinea from './componentes/servicio/PasosLinea.jsx'
import {
  CierreServicio,
  Cobertura,
  Comparativa,
  DesfileCasos,
  OtrosServicios,
  PreguntasServicio,
} from './componentes/servicio/Piezas.jsx'

const COMPONENTES: Record<string, React.ComponentType<any>> = {
  portadaPaisaje: Portada,
  escenasProblema: Escenas,
  solucionesPestanas: Soluciones,
  serviciosLista: Servicios,
  casosCinta: Casos,
  franjaLlamada: Franja,
  procesoPasos: Proceso,
  cotizadorWhatsapp: Cotizador,
  confianzaDatos: Confianza,
  preguntasFrecuentes: Preguntas,
  cierreNegro: Cierre,
  encabezadoPagina: Encabezado,
  contactoFormulario: Contacto,
  panelControl: Panel,
  boletinSuscripcion: RecuadroBoletin,
  recursoGratis: BloqueRecurso,
  servicioPortada: ServicioHero,
  escenaIluminada: EscenaIluminada,
  caracteristicasActivas: CaracteristicasActivas,
  pasosLinea: PasosLinea,
  desfileCasos: DesfileCasos,
  preguntasServicio: PreguntasServicio,
  otrosServicios: OtrosServicios,
  cierreServicio: CierreServicio,
  coberturaMunicipios: Cobertura,
  comparativaOpciones: Comparativa,
}

export const esBloqueDelSitio = (tipo?: string) => Boolean(tipo && tipo in COMPONENTES)

const casosCache = unstable_cache(
  async () => {
    const payload = await getPayload({ config: configPromise })
    const r = await payload.find({ collection: 'casos', limit: 100, sort: 'orden', depth: 0 })
    return r.docs
  },
  ['casos'],
  { tags: ['casos'] },
)

const preguntasCache = unstable_cache(
  async () => {
    const payload = await getPayload({ config: configPromise })
    const r = await payload.find({ collection: 'preguntas', limit: 200, sort: 'orden', depth: 0 })
    return r.docs
  },
  ['preguntas'],
  { tags: ['preguntas'] },
)

/**
 * Pinta un bloque del diseño del sitio con los datos que necesita: todos
 * reciben "Datos del negocio"; los casos y las preguntas se consultan solo
 * si el bloque los usa.
 */
export async function BloqueDelSitio({ bloque }: { bloque: any }) {
  const Componente = COMPONENTES[bloque.blockType]
  if (!Componente) return null

  const negocio: any = await getCachedGlobal('tienda' as any, 1)()
  const extra: Record<string, unknown> = {}

  if (bloque.blockType === 'casosCinta' || bloque.blockType === 'desfileCasos') extra.casos = await casosCache()
  if (bloque.blockType === 'boletinSuscripcion') {
    extra.blog = await getCachedGlobal('blog' as any, 0)()
    extra.variante = bloque.variante
  }
  if (bloque.blockType === 'recursoGratis') {
    const id = typeof bloque.recurso === 'object' ? bloque.recurso?.id : bloque.recurso
    extra.recurso = id ? await recursoPorId(id) : null
  }
  if (bloque.blockType === 'preguntasFrecuentes' || bloque.blockType === 'preguntasServicio') {
    const todas: any[] = await preguntasCache()
    extra.preguntas = bloque.grupo ? todas.filter((p) => p.grupo === bloque.grupo) : todas
  }

  const contenido = <Componente datos={bloque} negocio={negocio ?? {}} {...extra} />

  // Portada de servicio: datos estructurados "Service" para Google.
  if (bloque.blockType === 'servicioPortada' && bloque.nombreServicio) {
    const municipios = (bloque.municipios || []).map((m: any) => m?.texto).filter(Boolean)
    const zona = municipios.length ? municipios : [negocio?.ciudad, 'Colombia'].filter(Boolean)
    const esquema = {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: bloque.nombreServicio,
      serviceType: bloque.nombreServicio,
      provider: { '@id': `${(process.env.NEXT_PUBLIC_SERVER_URL || '').replace(/\/$/, '')}/#negocio`, name: negocio?.nombre },
      areaServed: zona.map((name: string) => ({ '@type': 'Place', name })),
    }
    return (
      <>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(esquema).replace(/</g, '\\u003c') }} />
        {contenido}
      </>
    )
  }
  return contenido
}
