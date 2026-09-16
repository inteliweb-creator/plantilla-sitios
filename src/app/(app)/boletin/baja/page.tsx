import type { Metadata } from 'next'

import BajaBoletin from '@/bloques/sitio/blog/BajaBoletin.jsx'

export const metadata: Metadata = { title: 'Darte de baja del boletín', robots: { index: false } }

export default async function Page({ searchParams }: { searchParams: Promise<{ c?: string }> }) {
  const { c } = await searchParams
  return (
    <section className="diseno-propio min-h-[70vh] flex items-center" style={{ background: 'linear-gradient(180deg,#E6E7EA 0%,#FFFFFF 100%)' }}>
      <div className="mx-auto max-w-xl px-5 py-32 pl-rail text-center">
        <BajaBoletin codigo={c || ''} />
      </div>
    </section>
  )
}
