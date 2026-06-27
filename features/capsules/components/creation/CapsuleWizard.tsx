'use client'

import { AnimatePresence, motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { useCapsuleWizard, TOTAL_STEPS } from '@/features/capsules/hooks/useCapsuleWizard'
import { WizardProgress }  from './WizardProgress'
import { BasicsStep }      from './steps/BasicsStep'
import { RecipientsStep }  from './steps/RecipientsStep'
import { ScheduleStep }    from './steps/ScheduleStep'
import { ContentStep }     from './steps/ContentStep'
import { PreviewStep }     from './steps/PreviewStep'

const STEP_TITLES = [
  'Create your capsule',
  'Who receives it?',
  'When is it delivered?',
  'What\'s inside?',
  'Review your capsule',
]

export function CapsuleWizard({ userPlan = 'free' }: { userPlan?: 'free' | 'plus' }) {
  const { currentStep, state, dispatch, goNext, goBack, isPending, handleSubmit } =
    useCapsuleWizard()

  const direction = 1 // always forward for simplicity

  return (
    <div className="min-h-screen bg-ivory">
      {/* Top bar */}
      <div className="sticky top-0 z-10 border-b border-stone/50 bg-ivory/90 backdrop-blur-sm">
        <div className="mx-auto max-w-2xl px-6 py-4 flex items-center justify-between">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-xs text-warm-gray hover:text-charcoal transition-colors"
          >
            <ArrowLeft size={13} />
            Dashboard
          </Link>
          <span className="text-xs text-warm-gray">
            {currentStep} / {TOTAL_STEPS}
          </span>
        </div>
      </div>

      <div className="mx-auto max-w-2xl px-6 py-10">
        {/* Heading */}
        <div className="mb-8">
          <AnimatePresence mode="wait">
            <motion.h1
              key={currentStep}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
              className="font-display text-2xl font-light text-charcoal"
            >
              {STEP_TITLES[currentStep - 1]}
            </motion.h1>
          </AnimatePresence>
        </div>

        {/* Progress */}
        <WizardProgress currentStep={currentStep} totalSteps={TOTAL_STEPS} />

        {/* Step content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: direction * 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction * -20 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            {currentStep === 1 && (
              <BasicsStep state={state} dispatch={dispatch} onNext={goNext} userPlan={userPlan} />
            )}
            {currentStep === 2 && (
              <RecipientsStep state={state} dispatch={dispatch} onNext={goNext} onBack={goBack} />
            )}
            {currentStep === 3 && (
              <ScheduleStep state={state} dispatch={dispatch} onNext={goNext} onBack={goBack} />
            )}
            {currentStep === 4 && (
              <ContentStep state={state} dispatch={dispatch} onNext={goNext} onBack={goBack} />
            )}
            {currentStep === 5 && (
              <PreviewStep
                state={state}
                dispatch={dispatch}
                onBack={goBack}
                onSubmit={handleSubmit}
                isSubmitting={isPending}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
