'use client'

import Image from 'next/image'
import { motion, useInView } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { ArrowLeft, ChevronDown, FileText, PackageCheck, Truck, Users } from 'lucide-react'
import { useStore } from '@/components/store-provider'

/* ── Animated number counter ── */
function Counter({ to, suffix = '' }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true })
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!inView) return
    let start = 0
    const duration = 1600
    const step = 16
    const increment = to / (duration / step)
    const timer = setInterval(() => {
      start += increment
      if (start >= to) {
        setCount(to)
        clearInterval(timer)
      } else {
        setCount(Math.floor(start))
      }
    }, step)
    return () => clearInterval(timer)
  }, [inView, to])

  return (
    <span ref={ref} className="tabular-nums">
      {count.toLocaleString()}{suffix}
    </span>
  )
}

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.08 * i, duration: 0.65, ease: [0.22, 1, 0.36, 1] as const },
  }),
}

export function Hero() {
  const { t, pushToast } = useStore()

  const stats = [
    { icon: PackageCheck, label: t.hero.stat1, value: 12000, suffix: '+' },
    { icon: Users,        label: t.hero.stat2, value: 3400,  suffix: '' },
    { icon: Truck,        label: t.hero.stat3, value: 24,    suffix: '/7' },
  ]

  return (
    <section id="home" className="relative overflow-hidden px-3 pb-10 pt-24 sm:px-5 sm:pt-28 lg:pb-16">
      {/* Page-level ambient blobs */}
      <div className="ambient-grid absolute inset-0 -z-10" />

      <div className="relative mx-auto max-w-6xl">
        {/* ── Main hero card ── */}
        <div className="relative overflow-hidden rounded-3xl shadow-2xl">

          {/* Background image */}
          <Image
            src="/images/hero-construction.png"
            alt="موقع بناء احترافي"
            fill
            priority
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 1152px"
          />

          {/* Layered gradient overlays */}
          <div className="absolute inset-0 bg-gradient-to-tr from-black/90 via-black/55 to-black/20" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

          {/* Dot overlay texture */}
          <div className="absolute inset-0 dot-pattern opacity-30" />

          {/* ── Content grid ── */}
          <div className="relative grid gap-8 p-6 sm:p-10 lg:min-h-[540px] lg:grid-cols-[1fr_auto] lg:items-end lg:p-14">

            {/* Left — text & CTAs */}
            <div className="max-w-2xl">

              {/* Eyebrow */}
              <motion.div custom={0} variants={fadeUp} initial="hidden" animate="show">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-white backdrop-blur-sm">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
                  {t.hero.eyebrow}
                </span>
              </motion.div>

              {/* Headline */}
              <motion.h1
                custom={1}
                variants={fadeUp}
                initial="hidden"
                animate="show"
                className="mt-5 text-balance text-4xl font-black leading-[1.04] tracking-tight text-white sm:text-5xl lg:text-6xl"
              >
                {t.hero.title}
              </motion.h1>

              {/* Accent bar */}
              <motion.div custom={2} variants={fadeUp} initial="hidden" animate="show">
                <div className="mt-5 h-1 w-16 rounded-full bg-primary" />
              </motion.div>

              {/* Subtitle */}
              <motion.p
                custom={3}
                variants={fadeUp}
                initial="hidden"
                animate="show"
                className="mt-4 max-w-lg text-pretty text-base leading-relaxed text-white/75 sm:text-lg"
              >
                {t.hero.subtitle}
              </motion.p>

              {/* CTAs */}
              <motion.div
                custom={4}
                variants={fadeUp}
                initial="hidden"
                animate="show"
                className="mt-8 flex flex-wrap items-center gap-3"
              >
                <a
                  href="#products"
                  className="btn-shine group inline-flex items-center gap-2 rounded-xl bg-primary px-7 py-3.5 text-sm font-extrabold text-primary-foreground shadow-lg shadow-primary/30 transition hover:brightness-110 active:scale-95"
                  style={{ boxShadow: 'var(--shadow-primary)' }}
                >
                  {t.hero.shopNow}
                  <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                </a>

                <button
                  onClick={() => pushToast({ title: t.toast.quote, variant: 'success' })}
                  className="inline-flex items-center gap-2 rounded-xl border border-white/25 bg-white/10 px-6 py-3.5 text-sm font-bold text-white backdrop-blur-sm transition hover:bg-white/18 active:scale-95"
                >
                  <FileText className="h-4 w-4" />
                  {t.hero.requestQuote}
                </button>
              </motion.div>
            </div>

            {/* Right — floating stat cards */}
            <motion.div
              custom={5}
              variants={fadeUp}
              initial="hidden"
              animate="show"
              className="flex items-end lg:justify-end"
            >
              <div className="grid w-full grid-cols-3 gap-2 sm:gap-2.5 lg:w-56 lg:grid-cols-1">
                {stats.map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + i * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    className="flex items-center gap-2 rounded-xl border border-white/15 bg-black/35 p-3 backdrop-blur-md sm:gap-3 sm:rounded-2xl sm:p-4"
                  >
                    <span className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md sm:flex">
                      <stat.icon className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="text-lg font-black leading-none text-white sm:text-2xl">
                        <Counter to={stat.value} suffix={stat.suffix} />
                      </p>
                      <p className="mt-1 hidden text-xs text-white/60 sm:block">{stat.label}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* ── Scroll cue ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="mt-8 flex justify-center"
        >
          <a
            href="#categories"
            className="flex flex-col items-center gap-1.5 text-xs font-medium text-muted-foreground transition hover:text-foreground"
          >
            <span>{t.hero.scrollCue}</span>
            <motion.span
              animate={{ y: [0, 5, 0] }}
              transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
            >
              <ChevronDown className="h-4 w-4" />
            </motion.span>
          </a>
        </motion.div>
      </div>
    </section>
  )
}
