'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { Check, Info, X, AlertCircle } from 'lucide-react'
import { useStore } from '@/components/store-provider'

export function Toaster() {
  const { toasts, dismissToast } = useStore()

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-4 z-[60] flex flex-col items-center gap-2 px-4 sm:bottom-6">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            layout
            initial={{ opacity: 0, y: 30, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.92 }}
            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
            className="glass-strong pointer-events-auto flex w-full max-w-sm items-center gap-3 rounded-2xl p-3 ps-4"
            role="status"
          >
            <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
              toast.variant === 'success' ? 'bg-primary text-primary-foreground' :
              toast.variant === 'error'   ? 'bg-destructive text-white' :
                                            'bg-foreground text-background'
            }`}>
              {toast.variant === 'success' ? <Check className="h-5 w-5" /> :
               toast.variant === 'error'   ? <AlertCircle className="h-5 w-5" /> :
                                              <Info className="h-5 w-5" />}
            </span>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold text-foreground">{toast.title}</p>
              {toast.description && (
                <p className="truncate text-xs text-muted-foreground">{toast.description}</p>
              )}
            </div>

            <button
              onClick={() => dismissToast(toast.id)}
              className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground transition hover:bg-foreground/5 hover:text-foreground"
              aria-label="סגור"
            >
              <X className="h-4 w-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}