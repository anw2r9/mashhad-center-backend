'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Minus, Plus, ShoppingCart, Star } from 'lucide-react'
import { useStore } from '@/components/store-provider'
import { cn } from '@/lib/utils'
import type { Product } from '@/lib/types'

function StockBadge({ stock }: { stock: number }) {
  const { t } = useStore()
  const config =
    stock === 0
      ? { label: t.product.outOfStock, cls: 'bg-destructive/10 text-destructive border-destructive/20' }
      : stock < 15
        ? { label: t.product.lowStock,   cls: 'bg-amber-500/10 text-amber-600 border-amber-500/20' }
        : { label: t.product.inStock,    cls: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' }
  return (
    <span className={cn('inline-flex items-center rounded-md border px-2 py-0.5 text-[11px] font-semibold', config.cls)}>
      {config.label}
    </span>
  )
}

function Stars({ rating = 4.5 }: { rating?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className={cn('h-3 w-3', i < Math.floor(rating) ? 'fill-primary text-primary' : 'fill-muted text-muted-foreground/40')} />
      ))}
      <span className="ms-1.5 text-[11px] font-medium text-muted-foreground">{rating}</span>
    </div>
  )
}

export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const { tr, t, addToCart } = useStore()
  const [qty, setQty] = useState(1)
  const [adding, setAdding] = useState(false)
  const soldOut = product.stock === 0

  function handleAdd(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    if (soldOut) return
    setAdding(true)
    // استخدم useStore addToCart عشان يتزامن مع cartCount بالـ Navbar
    addToCart(product, qty)
    setQty(1)
    setTimeout(() => setAdding(false), 700)
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ delay: index * 0.05, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="group flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
    >
      {/* صورة — Link للمنتج */}
      <Link href={`/products/${product.id}`} className="relative block aspect-[4/3] overflow-hidden bg-muted/40 cursor-pointer">
        <Image
          src={product.image || '/placeholder.svg'}
          alt={tr(product.name)}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 280px"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        {product.badge && (
          <span className="absolute start-3 top-3 rounded-lg bg-primary px-2.5 py-1 text-[11px] font-bold text-primary-foreground shadow-md">
            {tr(product.badge)}
          </span>
        )}
      </Link>

      {/* Body */}
      <div className="flex flex-1 flex-col p-4">

        <div className="flex items-center justify-between gap-2">
          <StockBadge stock={product.stock} />
          <Stars rating={product.rating ?? 4.5} />
        </div>

        {/* اسم المنتج */}
        <Link href={`/products/${product.id}`} className="mt-2.5 cursor-pointer">
          <h3 className="line-clamp-2 text-sm font-bold leading-snug text-foreground hover:text-primary transition-colors">
            {tr(product.name)}
          </h3>
        </Link>

        <div className="mt-3 flex items-baseline gap-1.5">
          <span className="text-xl font-black text-foreground">₪{product.price}</span>
          {product.unit && (
            <span className="text-xs text-muted-foreground">/ {tr(product.unit)}</span>
          )}
        </div>

        <div className="divider my-3" />

        {/* أزرار الكمية والإضافة */}
        <div className="flex items-center gap-2">
          <div className="flex items-center overflow-hidden rounded-xl border border-border/70 bg-muted/40">
            <button
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); setQty(q => Math.max(1, q - 1)) }}
              disabled={soldOut}
              className="flex h-9 w-8 items-center justify-center text-foreground transition hover:bg-foreground/5 disabled:opacity-40"
            >
              <Minus className="h-3.5 w-3.5" />
            </button>
            <span className="w-7 text-center text-sm font-bold tabular-nums">{qty}</span>
            <button
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); setQty(q => q + 1) }}
              disabled={soldOut}
              className="flex h-9 w-8 items-center justify-center text-foreground transition hover:bg-foreground/5 disabled:opacity-40"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>

          <motion.button
            onClick={handleAdd}
            disabled={soldOut}
            animate={adding ? { scale: [1, 0.93, 1] } : {}}
            transition={{ duration: 0.25 }}
            className={cn(
              'btn-shine flex h-9 flex-1 items-center justify-center gap-1.5 rounded-xl text-xs font-bold transition',
              soldOut ? 'cursor-not-allowed bg-muted text-muted-foreground' : 'bg-foreground text-background hover:bg-foreground/85',
            )}
          >
            <ShoppingCart className="h-3.5 w-3.5 shrink-0" />
            <span className="hidden sm:inline">
              {soldOut ? t.product.outOfStock : t.product.addToCart}
            </span>
          </motion.button>
        </div>
      </div>
    </motion.article>
  )
}