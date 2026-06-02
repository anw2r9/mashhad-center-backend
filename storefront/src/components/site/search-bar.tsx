'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Search, X } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import { useStore } from '@/components/store-provider'

export function SearchBar() {
  const { t } = useStore()
  const router = useRouter()
  const products = useSelector((s: RootState) => s.products.products)

  const [query, setQuery]       = useState('')
  const [focused, setFocused]   = useState(false)
  const containerRef            = useRef<HTMLDivElement>(null)

  /* إغلاق الـ dropdown لما يضغط خارجه */
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (!containerRef.current?.contains(e.target as Node)) {
        setFocused(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  /* فلترة المنتجات */
  const results = query.trim().length < 2
    ? []
    : (products as any[])
        .filter((p: any) =>
          p.name?.toLowerCase().includes(query.toLowerCase()) ||
          p.category?.toLowerCase().includes(query.toLowerCase())
        )
        .slice(0, 6)

  const showDropdown = focused && query.trim().length >= 2

  function handleSelect(id: string) {
    setQuery('')
    setFocused(false)
    router.push(`/products/${id}`)
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && results.length > 0) {
      handleSelect(results[0]._id)
    }
    if (e.key === 'Escape') {
      setFocused(false)
      setQuery('')
    }
  }

  return (
    <div ref={containerRef} className="relative ms-2 hidden flex-1 md:block">
      {/* Input */}
      <div className="relative flex items-center">
        <Search className="pointer-events-none absolute start-3.5 h-4 w-4 text-muted-foreground" />
        <input
          type="search"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          onKeyDown={handleKeyDown}
          placeholder={t.search}
          aria-label={t.search}
          className="h-10 w-full rounded-xl border border-border/60 bg-background/60 ps-10 pe-9 text-sm text-foreground outline-none transition placeholder:text-muted-foreground/70 focus:border-primary/50 focus:bg-background focus:ring-2 focus:ring-primary/20"
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="absolute end-2.5 flex h-5 w-5 items-center justify-center rounded-full bg-muted text-muted-foreground hover:text-foreground"
          >
            <X className="h-3 w-3" />
          </button>
        )}
      </div>

      {/* Dropdown results */}
      <AnimatePresence>
        {showDropdown && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="absolute inset-x-0 top-12 z-[90] overflow-hidden rounded-2xl border border-border/60 bg-card shadow-xl"
          >
            {results.length === 0 ? (
              <div className="px-4 py-6 text-center text-sm text-muted-foreground">
                {t.products.noResults}
              </div>
            ) : (
              <ul>
                {results.map((product: any, i) => (
                  <li key={product._id}>
                    <button
                      onMouseDown={() => handleSelect(product._id)}
                      className={`flex w-full items-center gap-3 px-4 py-3 text-start transition hover:bg-muted/60 ${
                        i !== results.length - 1 ? 'border-b border-border/40' : ''
                      }`}
                    >
                      {/* صورة مصغرة */}
                      <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-muted">
                        <Image
                          src={product.images?.[0] || product.image || '/images/products/cement.png'}
                          alt={product.name}
                          fill
                          className="object-cover"
                          sizes="48px"
                        />
                      </div>
                      {/* معلومات */}
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-foreground">{product.name}</p>
                        <p className="text-xs text-muted-foreground">{product.category}</p>
                      </div>
                      {/* السعر */}
                      <span className="shrink-0 text-sm font-black text-primary">₪{product.price}</span>
                    </button>
                  </li>
                ))}

                {/* زر عرض كل النتائج */}
                <li>
                  <button
                    onMouseDown={() => {
                      setFocused(false)
                      router.push(`/products?search=${encodeURIComponent(query)}`)
                    }}
                    className="flex w-full items-center justify-center gap-2 bg-muted/40 px-4 py-3 text-xs font-semibold text-muted-foreground transition hover:text-foreground"
                  >
                    <Search className="h-3.5 w-3.5" />
                    عرض كل النتائج لـ "{query}"
                  </button>
                </li>
              </ul>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
