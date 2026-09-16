'use client'

import { cn } from '@/utilities/cn'
import { createUrl } from '@/utilities/createUrl'
import { SearchIcon } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import React from 'react'

type Props = {
  className?: string
  placeholder?: string
}

/** Buscador del catálogo, en píldora como los campos del sitio. */
export const Search: React.FC<Props> = ({ className, placeholder }) => {
  const router = useRouter()
  const searchParams = useSearchParams()

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const search = (e.target as HTMLFormElement).search as HTMLInputElement
    const newParams = new URLSearchParams(searchParams.toString())
    if (search.value) newParams.set('q', search.value)
    else newParams.delete('q')
    router.push(createUrl('/shop', newParams))
  }

  return (
    <form className={cn('relative w-full max-w-xl', className)} onSubmit={onSubmit} role="search">
      <label htmlFor="buscar-productos" className="sr-only">Buscar productos</label>
      <input
        id="buscar-productos"
        autoComplete="off"
        className="w-full rounded-full border border-line bg-white pl-12 pr-5 py-3.5 text-sm text-graphite placeholder:text-slate/60 shadow-[var(--shadow-soft)] outline-none focus:border-accent transition-colors"
        defaultValue={searchParams?.get('q') || ''}
        key={searchParams?.get('q')}
        name="search"
        placeholder={placeholder || 'Buscar productos…'}
        type="search"
      />
      <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate" aria-hidden="true" />
    </form>
  )
}
