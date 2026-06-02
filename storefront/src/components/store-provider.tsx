'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { getDictionary, type Dictionary } from '@/lib/i18n'
import type { CartLine, Locale, Product } from '@/lib/types'

export interface Toast {
  id: number
  title: string
  description?: string
  variant: 'success' | 'info' | 'error'  // ← أضفنا error
}

interface StoreContextValue {
  locale: Locale
  dir: 'rtl'
  t: Dictionary
  setLocale: (locale: Locale) => void
  tr: (text: { he: string; ar: string }) => string

  lines: CartLine[]
  cartCount: number
  cartTotal: number
  addToCart: (product: Product, quantity?: number) => void
  removeFromCart: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  cartOpen: boolean
  setCartOpen: (open: boolean) => void

  toasts: Toast[]
  pushToast: (toast: Omit<Toast, 'id'>) => void
  dismissToast: (id: number) => void
}

const StoreContext = createContext<StoreContextValue | null>(null)

const CART_KEY   = 'mashhad_cart'
const LOCALE_KEY = 'mashhad_locale'

function loadCart(): CartLine[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(CART_KEY)
    return raw ? JSON.parse(raw) : []
  } catch { return [] }
}

function saveCart(lines: CartLine[]) {
  if (typeof window === 'undefined') return
  localStorage.setItem(CART_KEY, JSON.stringify(lines))
}

function loadLocale(): Locale {
  if (typeof window === 'undefined') return 'he'
  return (localStorage.getItem(LOCALE_KEY) as Locale) || 'he'
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('he')
  const [lines, setLines]        = useState<CartLine[]>([])
  const [cartOpen, setCartOpen]  = useState(false)
  const [toasts, setToasts]      = useState<Toast[]>([])

  useEffect(() => {
    setLines(loadCart())
    setLocaleState(loadLocale())
  }, [])

  const t  = getDictionary(locale)
  const tr = useCallback((text: { he: string; ar: string }) => text[locale], [locale])

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next)
    localStorage.setItem(LOCALE_KEY, next)
    if (typeof document !== 'undefined') {
      document.documentElement.lang = next
      document.documentElement.dir  = 'rtl'
    }
  }, [])

  const dismissToast = useCallback((id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  const pushToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = Date.now() + Math.random()
    setToasts(prev => [...prev, { ...toast, id }])
    setTimeout(() => dismissToast(id), 3200)
  }, [dismissToast])

  const addToCart = useCallback((product: Product, quantity = 1) => {
    setLines(prev => {
      const existing = prev.find(line => line.product.id === product.id)
      const next = existing
        ? prev.map(line => line.product.id === product.id
            ? { ...line, quantity: line.quantity + quantity }
            : line)
        : [...prev, { product, quantity }]
      saveCart(next)
      return next
    })
    pushToast({
      title: t.toast.added,
      description: product.name[locale],
      variant: 'success',
    })
  }, [locale, pushToast, t.toast.added])

  const removeFromCart = useCallback((productId: string) => {
    setLines(prev => {
      const next = prev.filter(line => line.product.id !== productId)
      saveCart(next)
      return next
    })
  }, [])

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    setLines(prev => {
      const next = prev
        .map(line => line.product.id === productId ? { ...line, quantity: Math.max(0, quantity) } : line)
        .filter(line => line.quantity > 0)
      saveCart(next)
      return next
    })
  }, [])

  const clearCart = useCallback(() => {
    setLines([])
    saveCart([])
  }, [])

  const cartCount = useMemo(() => lines.reduce((sum, line) => sum + line.quantity, 0), [lines])
  const cartTotal = useMemo(() => lines.reduce((sum, line) => sum + line.quantity * line.product.price, 0), [lines])

  const value: StoreContextValue = {
    locale, dir: 'rtl', t, setLocale, tr,
    lines, cartCount, cartTotal, addToCart, removeFromCart, updateQuantity, clearCart,
    cartOpen, setCartOpen,
    toasts, pushToast, dismissToast,
  }

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore() {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore must be used within StoreProvider')
  return ctx
}

export function formatPrice(amount: number) {
  return new Intl.NumberFormat('he-IL', {
    style: 'currency',
    currency: 'ILS',
    maximumFractionDigits: amount % 1 === 0 ? 0 : 2,
  }).format(amount)
}