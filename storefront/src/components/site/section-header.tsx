'use client'

import { motion } from 'framer-motion'

interface SectionHeaderProps {
  eyebrow: string
  title: string
  subtitle?: string
  align?: 'start' | 'center'
}

export function SectionHeader({ eyebrow, title, subtitle, align = 'start' }: SectionHeaderProps) {
  const isCenter = align === 'center'

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={isCenter ? 'mx-auto max-w-2xl text-center' : 'max-w-2xl'}
    >
      {/* Eyebrow pill */}
      <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1.5 text-xs font-bold uppercase tracking-widest text-primary">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
        {eyebrow}
      </span>

      {/* Title */}
      <h2 className="mt-4 text-balance text-3xl font-extrabold leading-tight text-foreground sm:text-4xl lg:text-[2.6rem]">
        {title}
      </h2>

      {/* Accent underline */}
      <div className={`mt-4 h-[3px] w-14 rounded-full bg-primary ${isCenter ? 'mx-auto' : ''}`} />

      {/* Subtitle */}
      {subtitle && (
        <p className="mt-4 text-pretty text-base leading-relaxed text-muted-foreground sm:text-[1.0625rem]">
          {subtitle}
        </p>
      )}
    </motion.div>
  )
}
