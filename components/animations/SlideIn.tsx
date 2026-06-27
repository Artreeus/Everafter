'use client'

import { motion, type MotionProps, useInView } from 'framer-motion'
import { useRef } from 'react'
import { slideUp, slideDown, slideIn } from './variants'
import { cn } from '@/lib/utils/cn'

type Direction = 'up' | 'down' | 'left'

const directionVariants = { up: slideUp, down: slideDown, left: slideIn }

interface SlideInProps extends Omit<MotionProps, 'ref'> {
  children: React.ReactNode
  className?: string
  direction?: Direction
  delay?: number
  once?: boolean
  inView?: boolean
}

export function SlideIn({
  children,
  className,
  direction = 'up',
  delay = 0,
  once = true,
  inView: triggerOnView = false,
  ...props
}: SlideInProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once, margin: '-60px' })

  const variant = directionVariants[direction]
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
