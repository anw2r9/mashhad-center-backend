'use client'

import { motion } from 'framer-motion'
import { ArrowLeft, BadgePercent, Boxes, CheckCircle2, Truck } from 'lucide-react'
import { useStore } from '@/components/store-provider'


export function ContractorSection() {
  const { t, pushToast } = useStore()

  const perks = [t.contractor.perk1, t.contractor.perk2, t.contractor.perk3, t.contractor.perk4]

  const features = [
    { icon: Boxes,        title: t.contractor.bulk,     desc: t.contractor.bulkDesc },
    { icon: BadgePercent, title: t.contractor.discount, desc: t.contractor.discountDesc },
    { icon: Truck,        title: t.contractor.delivery, desc: t.contractor.deliveryDesc },
  ]

  return (
    <section id="contractors" className="px-3 py-16 sm:px-5 lg:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="relative overflow-hidden rounded-3xl bg-foreground">
          {/* Ambient glows */}
          <div className="pointer-events-none absolute -end-24 -top-24 h-96 w-96 rounded-full bg-primary/20 blur-3xl" />
          <div className="pointer-events-none absolute -start-16 bottom-0 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />

          {/* Dot texture */}
          <div className="absolute inset-0 dot-pattern opacity-60" />

          <div className="relative grid gap-12 p-6 sm:p-10 lg:grid-cols-2 lg:gap-16 lg:p-14">

            {/* ── Left: headline & perks ── */}
            <div>
              <motion.span
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/15 px-3.5 py-1.5 text-xs font-bold uppercase tracking-widest text-primary"
              >
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
                {t.contractor.eyebrow}
              </motion.span>

              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.08, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="mt-5 text-balance text-3xl font-black leading-tight tracking-tight text-background sm:text-4xl lg:text-5xl"
              >
                {t.contractor.title}
              </motion.h2>

              <div className="mt-4 h-1 w-14 rounded-full bg-primary" />

              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.15, duration: 0.5 }}
                className="mt-5 max-w-md text-pretty text-base leading-relaxed text-background/65"
              >
                {t.contractor.subtitle}
              </motion.p>

              {/* Perk list */}
              <ul className="mt-7 space-y-3">
                {perks.map((perk, i) => (
                  <motion.li
                    key={perk}
                    initial={{ opacity: 0, x: -12 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 + i * 0.07, duration: 0.4 }}
                    className="flex items-center gap-3 text-sm text-background/80"
                  >
                    <CheckCircle2 className="h-4.5 w-4.5 shrink-0 text-primary" />
                    {perk}
                  </motion.li>
                ))}
              </ul>

              <motion.button
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.45, duration: 0.5 }}
                onClick={() => pushToast({ title: t.toast.quote, variant: 'success' })}
                className="btn-shine group mt-9 inline-flex items-center gap-2 rounded-xl bg-primary px-7 py-3.5 text-sm font-extrabold text-primary-foreground shadow-lg transition hover:brightness-110 active:scale-95"
                style={{ boxShadow: 'var(--shadow-primary)' }}
              >
                {t.contractor.cta}
                <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
              </motion.button>
            </div>

            {/* ── Right: feature cards ── */}
            <div className="flex flex-col justify-center gap-4">
              {features.map((feature, i) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 + i * 0.1, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                  className="flex items-start gap-4 rounded-2xl border border-background/10 bg-background/6 p-5 backdrop-blur-sm"
                >
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md">
                    <feature.icon className="h-5 w-5" strokeWidth={1.9} />
                  </span>
                  <div>
                    <h3 className="text-base font-bold text-background">{feature.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-background/60">{feature.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
