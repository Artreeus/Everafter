'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils/cn'

const STEP_LABELS = ['Basics', 'Recipients', 'Schedule', 'Content', 'Preview']

interface WizardProgressProps {
  currentStep: number
  totalSteps:  number
}

export function WizardProgress({ currentStep, totalSteps }: WizardProgressProps) {
  return (
    <div className="mb-10">
      {/* Step labels */}
      <div className="flex items-center justify-between mb-3 px-1">
        {STEP_LABELS.map((label, i) => {
          const step      = i + 1
          const isActive  = step === currentStep
          const isDone    = step < currentStep
          return (
            <span
              key={label}
              className={cn(
                'text-xs font-sans transition-colors duration-300 hidden sm:block',
                isActive  && 'text-charcoal font-medium',
                isDone    && 'text-warm-gray',
                !isActive && !isDone && 'text-stone',
              )}
            >
              {label}
            </span>
          )
        })}
      </div>

      {/* Track */}
      <div className="relative h-px bg-stone rounded-full overflow-hidden">
        <motion.div
          className="absolute inset-y-0 left-0 bg-charcoal rounded-full"
          initial={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
          animate={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>

      {/* Mobile step indicator */}
      <p className="mt-2 text-xs text-warm-gray text-center sm:hidden">
        Step {currentStep} of {totalSteps} — {STEP_LABELS[currentStep - 1]}
      </p>
    </div>
  )
}
