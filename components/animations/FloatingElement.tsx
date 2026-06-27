'use client'

import { motion } from 'framer-motion'
import { floating, floatingSlow } from './variants'
import { cn } from '@/lib/utils/cn'

interface FloatingElementProps {
  children: React.ReactNode
  className?: string
  slow?: boolean
  delay?: number
}

export function FloatingElement({
  children,
  className,
  slow = false,
  delay = 0,
}: FloatingElementProps) {
  const variant = slow ? floatingSlow : floating

  return (
    <motion.div
      variants={variant}
      initial="initial"
      animate="animate"
      transition={{ delay }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  )
}
