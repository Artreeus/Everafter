'use client'

import { useState, useTransition }  from 'react'
import { AnimatePresence, motion }  from 'framer-motion'
import { PenLine, Image, Mic, BookOpen, Trash2 } from 'lucide-react'
import { toast }                    from 'sonner'
import { cn }                       from '@/lib/utils/cn'
import { LetterEditor }             from '@/features/capsules/components/editor/LetterEditor'
import { PhotoUploader }            from '@/features/capsules/components/editor/PhotoUploader'
import { VoiceRecorder }            from '@/features/capsules/components/editor/VoiceRecorder'
import { MemoryBlock }              from '@/features/capsules/components/editor/MemoryBlock'
import { addCapsuleItemAction }     from '@/features/capsules/actions/add-capsule-item.action'
import { removeCapsuleItemAction }  from '@/features/capsules/actions/remove-capsule-item.action'
import type { MediaPayload }        from '@/types/capsule.types'
import type { AddedItem }           from '@/features/capsules/actions/add-capsule-item.action'

type ItemType = 'letter' | 'photo' | 'voice' | 'memory'

const TABS: { id: ItemType; label: string; Icon: typeof PenLine }[] = [
  { id: 'letter',  label: 'Letter',  Icon: PenLine  },
  { id: 'photo',   label: 'Photo',   Icon: Image    },
  { id: 'voice',   label: 'Voice',   Icon: Mic      },
  { id: 'memory',  label: 'Memory',  Icon: BookOpen },
]

const TYPE_LABEL: Record<string, string> = {
  letter: 'Letter', photo: 'Photo', voice: 'Voice', memory: 'Memory',
}

interface EditItemsSectionProps {
  capsuleId:    string
  initialItems: AddedItem[]
}

export function EditItemsSection({ capsuleId, initialItems }: EditItemsSectionProps) {
  const [items,    setItems]   = useState<AddedItem[]>(initialItems)
  const [tab,      setTab]     = useState<ItemType>('letter')
  const [draft,    setDraft]   = useState('')
  const [pending,  startTransition] = useTransition()

  function resetDraft(newTab?: ItemType) {
    setDraft('')
    if (newTab) setTab(newTab)
  }

  async function addItem(payload: Parameters<typeof addCapsuleItemAction>[1]) {
    startTransition(async () => {
      const result = await addCapsuleItemAction(capsuleId, { ...payload, order: items.length })
      if (result.success) {
        setItems((prev) => [...prev, result.item])
        resetDraft()
        toast.success(`${TYPE_LABEL[payload.type]} added.`)
      } else {
        toast.error(result.error)
      }
    })
  }

  function handleMediaUpload(media: MediaPayload, type: 'photo' | 'voice') {
    addItem({ type, media, order: items.length })
  }

  function handleTextAdd() {
    if (!draft.trim()) return
    addItem({
      type:          tab as 'letter' | 'memory',
      content:       draft,
      contentFormat: tab === 'letter' ? 'rich' : 'plain',
      order:         items.length,
    })
  }

  function onRemove(id: string, type: string) {
    startTransition(async () => {
      const result = await removeCapsuleItemAction(capsuleId, id)
      if (result.success) {
        setItems((prev) => prev.filter((i) => i.id !== id))
        toast.success(`${TYPE_LABEL[type] ?? 'Item'} removed.`)
      } else {
        toast.error(result.error)
      }
    })
  }

  return (
    <div className="space-y-5">
      {/* Existing items list */}
      {items.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-medium text-warm-gray uppercase tracking-widest">
            In this capsule ({items.length})
          </p>
          <ul className="space-y-2">
            {items.map((item, i) => (
              <li
                key={item.id}
                className="flex items-center justify-between rounded-xl border border-stone/50 bg-ivory px-4 py-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-xs text-warm-gray font-sans w-4 text-right flex-shrink-0">
                    {i + 1}
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-charcoal">{TYPE_LABEL[item.type]}</p>
                    {item.content && (
                      <p className="text-xs text-warm-gray truncate max-w-[240px]">
                        {item.content.replace(/<[^>]+>/g, '').slice(0, 60)}
                      </p>
                    )}
                    {item.mediaUrl && (
                      <p className="text-xs text-warm-gray truncate max-w-[240px]">Media uploaded</p>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => onRemove(item.id, item.type)}
                  disabled={pending}
                  className="ml-3 p-1.5 text-warm-gray hover:text-rose transition-colors disabled:opacity-30
                             disabled:pointer-events-none rounded-lg flex-shrink-0"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Add new item */}
      <div className="rounded-xl border border-stone overflow-hidden">
        {/* Tab bar */}
        <div className="flex border-b border-stone bg-cream">
          {TABS.map(({ id, label, Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => resetDraft(id)}
              className={cn(
                'flex items-center gap-1.5 px-4 py-2.5 text-xs font-medium border-b-2 transition-all -mb-px',
                tab === id
                  ? 'border-charcoal text-charcoal bg-ivory'
                  : 'border-transparent text-warm-gray hover:text-charcoal',
              )}
            >
              <Icon size={13} />
              {label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="p-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15 }}
              className="space-y-3"
            >
              {(tab === 'letter') && (
                <>
                  <LetterEditor value={draft} onChange={setDraft} placeholder="Dear…" />
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={handleTextAdd}
                      disabled={!draft.trim() || pending}
                      className="rounded-lg bg-charcoal px-4 py-2 text-xs font-medium text-ivory
                                 hover:bg-charcoal/90 transition-colors disabled:opacity-40 disabled:pointer-events-none"
                    >
                      {pending ? 'Saving…' : 'Add letter'}
                    </button>
                  </div>
                </>
              )}

              {tab === 'photo' && (
                <PhotoUploader
                  onUpload={(m: MediaPayload) => handleMediaUpload(m, 'photo')}
                />
              )}

              {tab === 'voice' && (
                <VoiceRecorder
                  onUpload={(m: MediaPayload) => handleMediaUpload(m, 'voice')}
                />
              )}

              {tab === 'memory' && (
                <>
                  <MemoryBlock value={draft} onChange={setDraft} />
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={handleTextAdd}
                      disabled={!draft.trim() || pending}
                      className="rounded-lg bg-charcoal px-4 py-2 text-xs font-medium text-ivory
                                 hover:bg-charcoal/90 transition-colors disabled:opacity-40 disabled:pointer-events-none"
                    >
                      {pending ? 'Saving…' : 'Add memory'}
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
