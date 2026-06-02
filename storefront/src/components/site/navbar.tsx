'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { AnimatePresence, motion } from 'framer-motion'
import { LogIn, LogOut, Menu, Search, ShoppingCart, User, X } from 'lucide-react'
import { SearchBar } from '@/components/site/search-bar'
import { useStore } from '@/components/store-provider'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '@/features/auth/slices/authSlice'
import { AppDispatch, RootState } from '@/store/store'
import { cn } from '@/lib/utils'

export function Navbar() {
  const { t, locale, setLocale, setCartOpen, cartCount } = useStore()
  const dispatch = useDispatch<AppDispatch>()
  const user = useSelector((s: RootState) => s.auth.user)
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const navLinks = [
    { label: t.nav.categories, href: '/#categories' },
    { label: t.nav.products, href: '/#products' },
    { label: t.nav.contractors, href: '/#contractors' },
    { label: t.nav.contact, href: '/#contact' },
  ]

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5 sm:pt-4">

      {/* Logo */}
      <motion.a
        href="/"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="absolute start-6 top-2 z-10 flex items-center gap-3 sm:start-8 sm:top-3"
      >
        <Image
          src="/images/logo.png"
          alt={t.logo.name}
          width={80}
          height={80}
          className="h-16 w-16 drop-shadow-lg sm:h-20 sm:w-20"
          priority
        />
        <div className="hidden sm:block">
          <p className="text-lg font-black leading-tight tracking-tight text-foreground drop-shadow-sm">
            {t.logo.name}
          </p>
          <p className="text-xs font-semibold text-primary">{t.logo.subtitle}</p>
        </div>
      </motion.a>

      {/* Nav bar */}
      <motion.nav
        initial={{ y: -32, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className={cn(
          'mx-auto flex max-w-6xl items-center gap-3 rounded-2xl px-3 py-2 transition-all duration-300 sm:px-4',
          scrolled ? 'glass-strong shadow-lg' : 'glass',
        )}
      >
        <div className="w-20 shrink-0 sm:w-28" />

        <SearchBar />

        <ul className="hidden items-center gap-0.5 lg:flex">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-foreground/5 hover:text-foreground"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="ms-auto flex items-center gap-1.5 md:ms-0">

          {/* Language switcher */}
          <div className="flex items-center rounded-xl border border-border/60 bg-background/50 p-0.5">
            {(['he', 'ar'] as const).map((lng) => (
              <button
                key={lng}
                onClick={() => setLocale(lng)}
                className={cn(
                  'relative rounded-lg px-2.5 py-1.5 text-xs font-bold transition',
                  locale === lng ? 'text-primary-foreground' : 'text-muted-foreground hover:text-foreground',
                )}
                aria-pressed={locale === lng}
              >
                {locale === lng && (
                  <motion.span
                    layoutId="lang-pill"
                    className="absolute inset-0 rounded-lg bg-primary"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative">{lng === 'he' ? 'עב' : 'ع'}</span>
              </button>
            ))}
          </div>

          {/* Login / User */}
          {mounted && user ? (
            <div className="hidden items-center gap-1.5 sm:flex">
              <Link
                href="/profile"
                className="flex items-center gap-1.5 rounded-xl border border-border/60 bg-background/50 px-3 py-2 text-xs font-semibold text-foreground transition hover:bg-foreground/5"
              >
                <User className="h-3.5 w-3.5 text-primary" />
                <span className="hidden max-w-[80px] truncate lg:inline">{user.name}</span>
              </Link>
              <button
                onClick={() => dispatch(logout())}
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-border/60 bg-background/50 text-muted-foreground transition hover:bg-destructive/10 hover:text-destructive"
                title="تسجيل الخروج"
              >
                <LogOut className="h-3.5 w-3.5" />
              </button>
            </div>
          ) : mounted ? (
            <Link
              href="/login"
              className="hidden items-center gap-1.5 rounded-xl border border-border/60 bg-background/50 px-3 py-2 text-xs font-semibold text-foreground transition hover:bg-foreground/5 sm:flex"
            >
              <LogIn className="h-3.5 w-3.5" />
              <span className="hidden lg:inline">{t.nav.login}</span>
            </Link>
          ) : null}

          {/* Cart */}
          <button
            onClick={() => setCartOpen(true)}
            className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-foreground text-background transition hover:bg-foreground/85 active:scale-95"
            aria-label={t.cart.title}
          >
            <ShoppingCart className="h-4.5 w-4.5" />
            <AnimatePresence>
              {cartCount > 0 && (
                <motion.span
                  key={cartCount}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 18 }}
                  className="absolute -end-1 -top-1 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground"
                >
                  {cartCount}
                </motion.span>
              )}
            </AnimatePresence>
          </button>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-border/60 bg-background/50 text-foreground transition hover:bg-foreground/5 lg:hidden"
            aria-label="Menu"
          >
            <AnimatePresence mode="wait">
              {mobileOpen
                ? <motion.span key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}><X className="h-5 w-5" /></motion.span>
                : <motion.span key="m" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}><Menu className="h-5 w-5" /></motion.span>
              }
            </AnimatePresence>
          </button>
        </div>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="glass-strong mx-auto mt-2 max-w-6xl overflow-hidden rounded-2xl p-3 lg:hidden"
          >
            <div className="mb-2 md:hidden">
              <SearchBar />
            </div>

            <ul className="grid gap-0.5">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center rounded-xl px-4 py-3 text-sm font-semibold text-foreground transition hover:bg-foreground/5"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>

            <div className="divider my-2" />
            {mounted && user ? (
              <>
                <Link
                  href="/profile"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-foreground transition hover:bg-foreground/5"
                >
                  <User className="h-4 w-4 text-primary" />
                  {user.name}
                </Link>
                <button
                  onClick={() => { dispatch(logout()); setMobileOpen(false) }}
                  className="flex w-full items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-destructive transition hover:bg-destructive/10"
                >
                  <LogOut className="h-4 w-4" />
                  {locale === 'he' ? 'יציאה' : 'تسجيل الخروج'}
                </button>
              </>
            ) : mounted ? (
              <Link
                href="/login"
                className="flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-foreground transition hover:bg-foreground/5"
                onClick={() => setMobileOpen(false)}
              >
                <LogIn className="h-4 w-4 text-primary" />
                {t.nav.login}
              </Link>
            ) : null}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}