'use client'

import { useReducer, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import type { WizardState, WizardAction, CapsuleItemInput } from '@/types/capsule.types'
import { createCapsuleAction } from '@/features/capsules/actions/create-capsule.action'
import type { CapsuleItemPayload } from '@/features/capsules/schemas/capsule.schema'

const browserTimezone =
  typeof window !== 'undefined'
    ? Intl.DateTimeFormat().resolvedOptions().timeZone
    : 'UTC'

const initialState: WizardState = {
  title:         '',
  theme:         'classic',
  message:       '',
  recipients:    [],
  scheduledDate: '',
  scheduledTime: '09:00',
  timezone:      browserTimezone,
  items:         [],
  notifyOnOpen:  true,
  allowReply:    false,
  recurrence:    'once' as const,
}

function wizardReducer(state: WizardState, action: WizardAction): WizardState {
  switch (action.type) {
    case 'SET_BASICS':
      return { ...state, ...action.payload }

    case 'ADD_RECIPIENT':
      return {
        ...state,
        recipients: [
          ...state.recipients,
          { id: crypto.randomUUID(), ...action.payload },
        ],
      }

    case 'REMOVE_RECIPIENT':
      return {
        ...state,
        recipients: state.recipients.filter((r) => r.id !== action.payload),
      }

    case 'SET_SCHEDULE':
      return { ...state, ...action.payload }

    case 'ADD_ITEM': {
      const newItem: CapsuleItemInput = {
        id:    crypto.randomUUID(),
        order: state.items.length,
        ...action.payload,
      }
      return { ...state, items: [...state.items, newItem] }
    }

    case 'UPDATE_ITEM':
      return {
        ...state,
        items: state.items.map((item) =>
          item.id === action.payload.id
            ? { ...item, ...action.payload.updates }
            : item,
        ),
      }

    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items
          .filter((i) => i.id !== action.payload)
          .map((i, idx) => ({ ...i, order: idx })),
      }

    case 'REORDER_ITEMS':
      return { ...state, items: action.payload }

    case 'SET_NOTIFY':
      return { ...state, notifyOnOpen: action.payload }

    case 'SET_ALLOW_REPLY':
      return { ...state, allowReply: action.payload }

    case 'SET_RECURRENCE':
      return { ...state, recurrence: action.payload }

    default:
      return state
  }
}

export const TOTAL_STEPS = 5

export function useCapsuleWizard() {
  const [currentStep, setCurrentStep] = useState(1)
  const [state, dispatch]             = useReducer(wizardReducer, initialState)
  const [isPending, startTransition]  = useTransition()
  const router                        = useRouter()

  const goNext = () => setCurrentStep((s) => Math.min(s + 1, TOTAL_STEPS))
  const goBack = () => setCurrentStep((s) => Math.max(s - 1, 1))

  const handleSubmit = () => {
    startTransition(async () => {
      const itemPayloads: CapsuleItemPayload[] = state.items.map((item) => ({
        type:          item.type,
        order:         item.order,
        content:       item.content,
        contentFormat: item.contentFormat,
        media:         item.media
          ? {
              cloudinaryId:    item.media.cloudinaryId,
              url:             item.media.url,
              thumbnailUrl:    item.media.thumbnailUrl ?? null,
              mimeType:        item.media.mimeType,
              sizeBytes:       item.media.sizeBytes,
              durationSeconds: item.media.durationSeconds,
            }
          : undefined,
        caption: item.caption,
      }))

      const result = await createCapsuleAction(state, itemPayloads)

      if (!result.success) {
        toast.error(result.error)
        return
      }

      toast.success('Capsule saved as draft.')
      router.push(`/capsules/${result.capsuleId}`)
    })
  }

  return { currentStep, state, dispatch, goNext, goBack, isPending, handleSubmit, TOTAL_STEPS }
}
