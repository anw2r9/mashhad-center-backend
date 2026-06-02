'use client'

import useSWR from 'swr'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { fetchFeaturedProducts } from '@/lib/api'
import { useStore } from '@/components/store-provider'
import { SectionHeader } from '@/components/site/section-header'
import { ProductCard } from '@/components/site/product-card'

function ProductSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-card">
      <div className="aspect-[4/3] animate-pulse bg-foreground/5" />
      <div className="space-y-3 p-4">
        <div className="flex justify-between">
          <div className="h-5 w-20 animate-pulse rounded-md bg-foreground/10" />
          <div className="h-3 w-16 animate-pulse rounded-full bg-foreground/10" />
        </div>
        <div className="h-4 w-full animate-pulse rounded-lg bg-foreground/10" />
        <div className="h-4 w-3/4 animate-pulse rounded-lg bg-foreground/10" />
        <div className="h-6 w-24 animate-pulse rounded-lg bg-foreground/10" />
        <div className="divider" />
        <div className="h-9 w-full animate-pulse rounded-xl bg-foreground/10" />
      </div>
    </div>
  )
}

export function FeaturedProducts() {
  const { t } = useStore()
  const { data, isLoading } = useSWR('featured-products', fetchFeaturedProducts)

  return (
    <section id="products" className="px-3 py-16 sm:px-5 lg:py-24">
      <div className="mx-auto max-w-6xl">
        {/* Header row */}
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeader
            eyebrow={t.featured.eyebrow}
            title={t.featured.title}
            subtitle={t.featured.subtitle}
          />
          <Link
            href="/products"
            className="hidden shrink-0 items-center gap-1.5 rounded-xl border border-border/60 bg-background px-4 py-2.5 text-sm font-semibold text-foreground shadow-sm transition hover:bg-muted sm:flex"
          >
            {t.viewAllProducts}
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* Product grid */}
        <div className="mt-10 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {isLoading || !data
            ? Array.from({ length: 8 }).map((_, i) => <ProductSkeleton key={i} />)
            : data.map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} />
              ))}
        </div>

        {/* Mobile "view all" */}
        <div className="mt-8 flex justify-center sm:hidden">
          <Link
            href="/products"
            className="flex items-center gap-2 rounded-xl border border-border/60 bg-background px-6 py-3 text-sm font-semibold text-foreground shadow-sm transition hover:bg-muted"
          >
            {t.viewAllProducts}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
