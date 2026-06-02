'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Mail, MapPin, MessageCircle, Phone, Send } from 'lucide-react'
import { useStore } from '@/components/store-provider'

export function Footer() {
  const { t, tr, pushToast } = useStore()
  const [email, setEmail] = useState('')

  const categoryLinks = [
    { he: 'מלט', ar: 'إسمنت' },
    { he: 'ברזל', ar: 'حديد تسليح' },
    { he: 'בלוקים', ar: 'بلوك' },
    { he: 'כלי עבודה', ar: 'أدوات' },
    { he: 'צבעים', ar: 'دهانات' },
    { he: 'סניטציה', ar: 'صحي' },
  ]

  const navLinks = [
    { label: t.nav.home,        href: '#home' },
    { label: t.nav.products,    href: '#products' },
    { label: t.nav.contractors, href: '#contractors' },
    { label: t.nav.contact,     href: '#contact' },
  ]

  function handleSubscribe(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    pushToast({ title: t.footer.subscribeSuccess, variant: 'success' })
    setEmail('')
  }

  return (
    <footer id="contact" className="px-3 pb-6 sm:px-5">
      <div className="mx-auto max-w-6xl space-y-4">

        {/* ── Newsletter banner ── */}
        <div className="relative overflow-hidden rounded-2xl bg-primary px-6 py-8 sm:px-10">
          <div className="pointer-events-none absolute -end-16 -top-16 h-56 w-56 rounded-full bg-white/10 blur-2xl" />
          <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-lg font-black text-primary-foreground">{t.footer.newsletter}</p>
              <p className="mt-1 text-sm text-primary-foreground/70">{t.footer.newsletterSub}</p>
            </div>
            <form onSubmit={handleSubscribe} className="flex w-full max-w-sm items-center gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t.footer.emailPlaceholder}
                className="h-11 flex-1 rounded-xl border border-white/20 bg-white/15 px-4 text-sm text-primary-foreground placeholder:text-primary-foreground/50 outline-none backdrop-blur-sm focus:bg-white/25 focus:ring-2 focus:ring-white/30"
              />
              <button
                type="submit"
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-foreground text-primary shadow-md transition hover:scale-105 active:scale-95"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>

        {/* ── Main footer card ── */}
        <div className="rounded-2xl border border-border/60 bg-card p-6 sm:p-10">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">

            {/* Brand column */}
            <div>
              <div className="flex items-center gap-2.5">
                <Image
                  src="/images/logo.png"
                  alt="مشهد سنتر"
                  width={56}
                  height={56}
                  className="h-14 w-14 rounded-xl object-contain"
                />
              </div>

              <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
                {t.footer.tagline}
              </p>

              {/* WhatsApp CTA */}
              <a
                href="https://wa.me/972500000000"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-600 active:scale-95"
              >
                <MessageCircle className="h-4 w-4" />
                {t.footer.whatsapp}
              </a>
            </div>

            {/* Quick links */}
            <div>
              <h4 className="text-sm font-bold text-foreground">{t.footer.links}</h4>
              <ul className="mt-4 space-y-2.5">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <a href={link.href} className="text-sm text-muted-foreground transition hover:text-foreground">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Categories */}
            <div>
              <h4 className="text-sm font-bold text-foreground">{t.footer.categories}</h4>
              <ul className="mt-4 space-y-2.5">
                {categoryLinks.map((cat) => (
                  <li key={cat.he}>
                    <a href="#categories" className="text-sm text-muted-foreground transition hover:text-foreground">
                      {tr(cat)}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-sm font-bold text-foreground">{t.footer.contact}</h4>
              <ul className="mt-4 space-y-3.5">
                <li>
                  <a
                    href="tel:+97250000000"
                    className="flex items-center gap-2.5 text-sm text-muted-foreground transition hover:text-foreground"
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Phone className="h-3.5 w-3.5" />
                    </span>
                    <span dir="ltr">+972 50-000-0000</span>
                  </a>
                </li>
                <li>
                  <a
                    href="mailto:info@mashhadcenter.com"
                    className="flex items-center gap-2.5 text-sm text-muted-foreground transition hover:text-foreground"
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Mail className="h-3.5 w-3.5" />
                    </span>
                    <span dir="ltr">info@mashhadcenter.com</span>
                  </a>
                </li>
                <li className="flex items-start gap-2.5 text-sm text-muted-foreground">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <MapPin className="h-3.5 w-3.5" />
                  </span>
                  <span className="pt-1">{t.footer.address}</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="divider mt-10" />
          <div className="mt-6 flex flex-col items-center justify-between gap-3 text-xs text-muted-foreground sm:flex-row">
            <p>© {new Date().getFullYear()} {t.logo.name}. {t.footer.rights}</p>
            <p className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              {t.footer.allServicesOnline}
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
