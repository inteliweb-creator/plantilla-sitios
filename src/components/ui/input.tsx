import * as React from 'react'

import { cn } from '@/utilities/cn'

function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        'bg-surface-2 border-line placeholder:text-slate/60 flex h-11 w-full py-2 file:inline-flex file:border-0 file:bg-transparent file:text-sm min-w-0 rounded-xl border px-4 text-sm text-graphite transition-colors outline-none focus-visible:border-accent disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-60',
        'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
        className,
      )}
      {...props}
    />
  )
}

export { Input }
