import type { Variants } from 'framer-motion'

const SPRING = [0.16, 1, 0.3, 1] as const
const SMOOTH = [0.4, 0, 0.2, 1] as const

export const fadeIn: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.4, ease: SMOOTH } },
  exit:    { opacity: 0, transition: { duration: 0.2, ease: SMOOTH } },
}

export const fadeInSlow: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.8, ease: SMOOTH } },
  exit:    { opacity: 0, transition: { duration: 0.3, ease: SMOOTH } },
}

export const slideUp: Variants = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: SPRING } },
  exit:    { opacity: 0, y: -12, transition: { duration: 0.2, ease: SMOOTH } },
}

export const slideDown: Variants = {
  initial: { opacity: 0, y: -24 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: SPRING } },
  exit:    { opacity: 0, y: 24, transition: { duration: 0.2, ease: SMOOTH } },
}

export const slideIn: Variants = {
  initial: { opacity: 0, x: -24 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.5, ease: SPRING } },
  exit:    { opacity: 0, x: 24, transition: { duration: 0.2, ease: SMOOTH } },
}

export const scaleIn: Variants = {
  initial: { opacity: 0, scale: 0.92 },
  animate: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: SPRING } },
  exit:    { opacity: 0, scale: 0.95, transition: { duration: 0.2, ease: SMOOTH } },
}

export const staggerContainer: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
}

export const staggerContainerFast: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.05,
    },
  },
}

export const letterReveal: Variants = {
  initial: { opacity: 0, y: 40, rotateX: -15 },
  animate: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: { duration: 0.8, ease: SPRING },
  },
}

export const envelopeFlap: Variants = {
  sealed: {
    rotateX: 0,
    transition: { duration: 0.6, ease: SMOOTH },
  },
  open: {
    rotateX: -180,
    transition: { duration: 0.8, ease: SPRING },
  },
}

export const envelopeLetter: Variants = {
  sealed: {
    y: 0,
    transition: { duration: 0.4, ease: SMOOTH },
  },
  open: {
    y: '-60%',
    transition: { delay: 0.5, duration: 0.9, ease: SPRING },
  },
}

export const waxSeal: Variants = {
  initial: { scale: 0, opacity: 0, rotate: -20 },
  animate: {
    scale: 1,
    opacity: 1,
    rotate: 0,
    transition: { type: 'spring', stiffness: 260, damping: 20, delay: 0.2 },
  },
  press: {
    scale: 0.92,
    transition: { duration: 0.1 },
  },
}

export const floating: Variants = {
  initial: { y: 0 },
  animate: {
    y: [-8, 8, -8],
    transition: {
      duration: 5,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
}

export const floatingSlow: Variants = {
  initial: { y: 0 },
  animate: {
    y: [-6, 6, -6],
    transition: {
      duration: 7,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
}

export const glowPulse: Variants = {
  initial: { opacity: 0.5 },
  animate: {
    opacity: [0.5, 1, 0.5],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
}

export const pageTransition: Variants = {
  initial: { opacity: 0, y: 8 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: SPRING },
  },
  exit: {
    opacity: 0,
    y: -8,
    transition: { duration: 0.25, ease: SMOOTH },
  },
}

export const cardHover = {
  rest: {
    y: 0,
    boxShadow: '0 4px 20px rgba(44,40,37,0.08)',
    transition: { duration: 0.3, ease: SMOOTH },
  },
  hover: {
    y: -4,
    boxShadow: '0 16px 48px rgba(44,40,37,0.14)',
    transition: { duration: 0.3, ease: SMOOTH },
  },
}

export const buttonPress = {
  rest:  { scale: 1 },
  hover: { scale: 1.02 },
  tap:   { scale: 0.97 },
}
