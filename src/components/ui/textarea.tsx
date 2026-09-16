import * as React from 'react'

import { cn } from '@/utilities/cn'

function Textarea({ className, ...props }: React.ComponentProps<'textarea'>) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        'bg-surface-2 border-line placeholder:text-slate/60 flex min-h-24 w-full rounded-xl border px-4 py-3 text-sm text-graphite outline-none transition-colors focus-visible:border-accent disabled:cursor-not-allowed disabled:opacity-60',
        className,
      )}
      {...props}
    />
  )
}

export { Textarea }
