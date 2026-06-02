'use client'

import useSWR from 'swr'
import Image from 'next/image'
import { motion } from 'framer-motion'
import {
  Blocks, Bolt, Layers, Mountain, PaintRoller,
  Pickaxe, Pipette, Wrench, ArrowRight, type LucideIcon,
} from 'lucide-react'
import { fetchCategories } from '@/lib/api'
import { useStore } from '@/components/store-provider'
import { SectionHeader } from '@/components/site/section-header'

const icons: Record<string, LucideIcon> = {
  Layers, Bolt, Blocks, Mountain, Pickaxe, Wrench, PaintRoller, Pipette,
}

/* صورة خلفية لكل category */
const categoryBg: Record<string, string> = {
  cement:   '/images/categories/cement.png',
  steel:    '/images/categories/steel.png',
  blocks:   '/images/categories/blocks.png',
  sand:     '/images/categories/sand.png',
  gravel:   '/images/categories/gravel.png',
  tools:    '/images/categories/tools.png',
  paint:    '/images/categories/paint.png',
  plumbing: '/images/categories/plumbing.png',
}

export function CategoriesSection() {
  const { t, tr } = useStore()
  const { data, isLoading } = useSWR('categories', fetchCategories)

  return (
    <section id="categories" className="px-3 py-16 sm:px-5 lg:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-10 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeader
            eyebrow={t.categoriesSection.eyebrow}
            title={t.categoriesSection.title}
            subtitle={t.categoriesSection.subtitle}
          />
          <a
            href="/products"
            className="hidden shrink-0 items-center gap-1.5 rounded-xl border border-border/60 bg-background px-4 py-2.5 text-sm font-semibold text-foreground shadow-sm transition hover:bg-muted sm:flex"
          >
            {t.viewAll}
            <ArrowRight className="h-3.5 w-3.5" />
          </a>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
          {isLoading || !data
            ? Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="h-44 animate-pulse rounded-2xl bg-foreground/5"
                  style={{ animationDelay: `${i * 60}ms` }}
                />
              ))
            : data.map((category, i) => {
                const Icon = icons[category.icon] ?? Layers
                const bg   = categoryBg[category.slug]

                return (
                  <motion.a
                    key={category.id}
                    href={`/products?category=${category.slug}`}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-50px' }}
                    transition={{ delay: i * 0.055, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    whileHover={{ y: -6, scale: 1.02 }}
                    className="group relative flex h-44 flex-col justify-between overflow-hidden rounded-2xl shadow-md transition-shadow hover:shadow-xl"
                  >
                    {/* صورة الخلفية */}
                    {bg && (
                      <Image
                        src={bg}
                        alt={tr(category.name)}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      />
                    )}

                    {/* طبقة تعتيم gradiant */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10 transition-opacity duration-300 group-hover:from-black/90" />

                    {/* أيقونة — أعلى يمين */}
                    <div className="relative flex justify-end p-3">
                      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/15 text-white backdrop-blur-sm transition-colors group-hover:bg-primary">
                        <Icon className="h-4.5 w-4.5" strokeWidth={1.9} />
                      </span>
                    </div>

                    {/* اسم الفئة — أسفل */}
                    <div className="relative p-4">
                      <p className="text-base font-extrabold leading-tight text-white drop-shadow-sm">
                        {tr(category.name)}
                      </p>
                      <p className="mt-0.5 flex items-center gap-1 text-xs text-white/65">
                        {category.count} {tr({ he: 'מוצרים', ar: 'منتج' })}
                        <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                      </p>
                    </div>
                  </motion.a>
                )
              })}
        </div>
      </div>
    </section>
  )
}
