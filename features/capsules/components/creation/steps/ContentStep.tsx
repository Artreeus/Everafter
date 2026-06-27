'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { PenLine, Image, Mic, BookOpen, X } from 'lucide-react'
import { LetterEditor }  from '../../editor/LetterEditor'
import { PhotoUploader } from '../../editor/PhotoUploader'
import { VoiceRecorder } from '../../editor/VoiceRecorder'
import { MemoryBlock }   from '../../editor/MemoryBlock'
import { cn } from '@/lib/utils/cn'
import type { WizardState, WizardAction, CapsuleItemInput, ItemType, MediaPayload } from '@/types/capsule.types'

const CONTENT_TABS: { id: ItemType; label: string; Icon: typeof PenLine }[] = [
  { id: 'letter',  label: 'Letter',  Icon: PenLine  },
  { id: 'photo',   label: 'Photo',   Icon: Image    },
  { id: 'voice',   label: 'Voice',   Icon: Mic      },
  { id: 'memory',  label: 'Memory',  Icon: BookOpen },
]

interface ContentStepProps {
  state:    WizardState
  dispatch: React.Dispatch<WizardAction>
  onNext:   () => void
  onBack:   () => void
}

export function ContentStep({ state, dispatch, onNext, onBack }: ContentStepProps) {
  const [activeTab,  setActiveTab]  = useState<ItemType>('letter')
  const [draftText,  setDraftText]  = useState('')
  const [draftCaption, setDraftCaption] = useState('')

  const addTextItem = () => {
    if (!draftText.trim()) return
    dispatch({
      type:    'ADD_ITEM',
      payload: {
        type:          activeTab === 'memory' ? 'memory' : 'letter',
        content:       draftText,
        contentFormat: activeTab === 'letter' ? 'rich' : 'plain',
      },
    })
    setDraftText('')
    setDraftCaption('')
  }

  const handleMediaUpload = (media: MediaPayload, type: 'photo' | 'voice') => {
    dispatch({
      type:    'ADD_ITEM',
      payload: { type, media, caption: draftCaption || undefined },
    })
    setDraftCaption('')
  }

  return (
    <div className="space-y-5">
      {/* Existing items */}
      {state.items.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-medium text-warm-gray uppercase tracking-widest">
            In this capsule
          </p>
          <ul className="space-y-2">
            {state.items.map((item) => (
              <ItemRow
                key={item.id}
                item={item}
                onRemove={() => dispatch({ type: 'REMOVE_ITEM', payload: item.id })}
              />
            ))}
          </ul>
        </div>
      )}

      {/* Tab bar */}
      <div>
        <div className="flex border-b border-stone">
          {CONTENT_TABS.map(({ id, label, Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => { setActiveTab(id); setDraftText(''); setDraftCaption('') }}
              className={cn(
                'flex items-center gap-1.5 px-4 py-2.5 text-xs font-medium border-b-2 transition-all duration-200 -mb-px',
                activeTab === id
                  ? 'border-charcoal text-charcoal'
                  : 'border-transparent text-warm-gray hover:text-charcoal',
              )}
            >
              <Icon size={13} />
              {label}
            </button>
          ))}
        </div>

        <div className="pt-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === 'letter' && (
                <div className="space-y-3">
                  <LetterEditor
                    value={draftText}
                    onChange={setDraftText}
                    placeholder="Dear..."
                  />
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={addTextItem}
                      className="rounded-lg bg-charcoal px-4 py-2 text-xs font-medium text-ivory hover:bg-dark transition-colors"
                    >
                      Add letter
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'photo' && (
                <div className="space-y-3">
                  <PhotoUploader onUpload={(m: MediaPayload) => handleMediaUpload(m, 'photo')} />
                  <input
                    type="text"
                    placeholder="Add a caption (optional)"
                    value={draftCaption}
                    onChange={(e) => setDraftCaption(e.target.value)}
                    className="block w-full rounded-lg border border-stone bg-ivory px-3.5 py-2.5 text-sm text-charcoal placeholder:text-warm-gray/50 outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold/60"
                  />
                </div>
              )}

              {activeTab === 'voice' && (
                <VoiceRecorder onUpload={(m: MediaPayload) => handleMediaUpload(m, 'voice')} />
              )}

              {activeTab === 'memory' && (
                <div className="space-y-3">
                  <MemoryBlock value={draftText} onChange={setDraftText} />
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={addTextItem}
                      className="rounded-lg bg-charcoal px-4 py-2 text-xs font-medium text-ivory hover:bg-dark transition-colors"
                    >
                      Add memory
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <div className="flex justify-between pt-2">
        <button type="button" onClick={onBack} className="text-sm text-warm-gray hover:text-charcoal transition-colors">
          Back
        </button>
        <button
          type="button"
          onClick={onNext}
          className="rounded-lg bg-charcoal px-6 py-2.5 text-sm font-medium text-ivory hover:bg-dark transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
        >
          Preview capsule
        </button>
      </div>
    </div>
  )
}

function ItemRow({ item, onRemove }: { item: CapsuleItemInput; onRemove: () => void }) {
  const icons: Record<ItemType, typeof PenLine> = {
    letter: PenLine, photo: Image, voice: Mic, memory: BookOpen,
  }
  const Icon = icons[item.type]

  const label =
    item.type === 'photo' ? (item.caption ?? 'Photo') :
    item.type === 'voice' ? 'Voice recording' :
    item.type === 'letter' ? 'Letter' :
    'Memory'

  return (
    <li className="flex items-center gap-3 rounded-lg border border-stone bg-ivory px-4 py-2.5">
      <Icon size={14} className="text-warm-gray flex-shrink-0" />
      <span className="text-sm text-charcoal flex-1 truncate">{label}</span>
      <button
        type="button"
        onClick={onRemove}
        className="text-warm-gray hover:text-rose transition-colors"
        aria-label="Remove item"
      >
        <X size={14} />
      </button>
    </li>
  )
}
