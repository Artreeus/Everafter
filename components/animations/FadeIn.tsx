'use client'

import { motion, type MotionProps, useInView } from 'framer-motion'
import { useRef } from 'react'
import { fadeIn, fadeInSlow } from './variants'
import { cn } from '@/lib/utils/cn'

interface FadeInProps extends Omit<MotionProps, 'ref'> {
  children: React.ReactNode
  className?: string
  delay?: number
  slow?: boolean
  once?: boolean
  inView?: boolean
}

export function FadeIn({
  children,
  className,
  delay = 0,
  slow = false,
  once = true,
  inView: triggerOnView = false,
  ...props
}: FadeInProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once, margin: '-60px' })

  const variant = slow ? fadeInSlow : fadeIn

  const animateState = triggerOnView ? (isInView ? 'animate' : 'initial') : 'animate'

  return (
    <motion.div
      ref={ref}
      variants={variant}
      initial="initial"
      animate={animateState}
      exit="exit"
      transition={{ delay }}
      className={cn(className)}
      {...props}
    >
      {children}
    </motion.div>
  )
}
