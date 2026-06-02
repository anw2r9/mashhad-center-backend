'use client'

import Link from 'next/link'
import Image from 'next/image'
import { AnimatePresence, motion } from 'framer-motion'
import { Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react'
import { formatPrice, useStore } from '@/components/store-provider'

export function CartDrawer() {
  const {
    t, locale, cartOpen, setCartOpen,
    lines, cartTotal, cartCount,
    updateQuantity, removeFromCart, clearCart,
  } = useStore()

  return (
    <AnimatePresence>
      {cartOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setCartOpen(false)}
            className="fixed inset-0 z-[70] bg-black/40 backdrop-blur-sm"
          />
          <motion.aside
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 36 }}
            className="glass-strong fixed inset-y-0 start-0 z-[80] flex w-full max-w-md flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border/60 p-5">
              <div className="flex items-center gap-2.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                  <ShoppingBag className="h-5 w-5" />
                </span>
                <h2 className="text-lg font-bold text-foreground">{t.cart.title}</h2>
                {cartCount > 0 && (
                  <span className="rounded-full bg-primary/15 px-2 py-0.5 text-xs font-bold text-primary">
                    {cartCount}
                  </span>
                )}
              </div>
              <button
                onClick={() => setCartOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-xl text-muted-foreground transition hover:bg-foreground/5 hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-4">
              {lines.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
                  <span className="flex h-16 w-16 items-center justify-center rounded-3xl bg-secondary text-muted-foreground">
                    <ShoppingBag className="h-7 w-7" />
                  </span>
                  <p className="text-sm font-medium text-muted-foreground">{t.cart.empty}</p>
                  <button
                    onClick={() => setCartOpen(false)}
                    className="text-xs font-semibold text-primary hover:underline"
                  >
                    {t.cart.shopNow}
                  </button>
                </div>
              ) : (
                <ul className="space-y-3">
                  <AnimatePresence initial={false}>
                    {lines.map((line) => {
                      // الاسم ممكن يكون object أو string
                      const name = typeof line.product.name === 'object'
                        ? line.product.name[locale]
                        : line.product.name

                      return (
                        <motion.li
                          key={line.product.id}
                          layout
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="glass flex gap-3 rounded-2xl p-3"
                        >
                          <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-secondary/40">
                            <Image
                              src={line.product.image || '/images/products/cement.png'}
                              alt={name}
                              fill
                              className="object-cover"
                              sizes="64px"
                            />
                          </div>
                          <div className="flex min-w-0 flex-1 flex-col">
                            <p className="line-clamp-1 text-sm font-bold text-foreground">{name}</p>
                            <p className="text-xs text-muted-foreground">{formatPrice(line.product.price)}</p>
                            <div className="mt-auto flex items-center justify-between pt-2">
                              <div className="flex items-center overflow-hidden rounded-xl border border-border/70">
                                <button
                                  onClick={() => updateQuantity(line.product.id, line.quantity - 1)}
                                  className="flex h-7 w-7 items-center justify-center text-foreground transition hover:bg-foreground/5"
                                >
                                  <Minus className="h-3.5 w-3.5" />
                                </button>
                                <span className="w-6 text-center text-xs font-semibold tabular-nums">{line.quantity}</span>
                                <button
                                  onClick={() => updateQuantity(line.product.id, line.quantity + 1)}
                                  className="flex h-7 w-7 items-center justify-center text-foreground transition hover:bg-foreground/5"
                                >
                                  <Plus className="h-3.5 w-3.5" />
                                </button>
                              </div>
                              <button
                                onClick={() => removeFromCart(line.product.id)}
                                className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground transition hover:bg-destructive/10 hover:text-destructive"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </motion.li>
                      )
                    })}
                  </AnimatePresence>
                </ul>
              )}
            </div>

            {/* Footer */}
            {lines.length > 0 && (
              <div className="border-t border-border/60 p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{t.cart.total}</span>
                  <span className="text-xl font-black text-foreground">{formatPrice(cartTotal)}</span>
                </div>
                <Link
                  href="/checkout"
                  onClick={() => setCartOpen(false)}
                  className="block w-full rounded-2xl bg-primary py-3.5 text-center text-sm font-bold text-primary-foreground shadow-lg shadow-primary/25 transition hover:brightness-110 active:scale-95"
                >
                  {t.cart.checkout}
                </Link>
                <button
                  onClick={clearCart}
                  className="w-full text-center text-xs text-muted-foreground transition hover:text-destructive"
                >
                  {t.cart.clearCart}
                </button>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}