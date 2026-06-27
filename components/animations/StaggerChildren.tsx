'use client'

import { motion } from 'framer-motion'
import { staggerContainer, staggerContainerFast } from './variants'
import { cn } from '@/lib/utils/cn'

interface StaggerChildrenProps {
  children: React.ReactNode
  className?: string
  fast?: boolean
  delay?: number
}

export function StaggerChildren({
  children,
  className,
  fast = false,
  delay = 0,
}: StaggerChildrenProps) {
  const variant = fast ? staggerContainerFast : staggerContainer

  return (
    <motion.div
      variants={variant}
      initial="initial"
      animate="animate"
      transition={{ delayChildren: delay }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  )
}
