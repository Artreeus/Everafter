'use client'

import { useState, useTransition }  from 'react'
import { PenLine, Image, Mic, BookOpen, Plus, Trash2, Check } from 'lucide-react'
import { cn }                        from '@/lib/utils/cn'
import { toast }                     from 'sonner'
import { LetterEditor }              from '@/features/capsules/components/editor/LetterEditor'
import { PhotoUploader }             from '@/features/capsules/components/editor/PhotoUploader'
import { VoiceRecorder }             from '@/features/capsules/components/editor/VoiceRecorder'
import { MemoryBlock }               from '@/features/capsules/components/editor/MemoryBlock'
import {
  addContributionAction,
  removeContributionAction,
  type ContributeItem,
} from '@/features/contribute/actions/contribute.action'
import { getContributorSignatureAction } from '@/features/media/actions/upload-media.action'
import type { MediaPayload }         from '@/types/capsule.types'

type Tab = 'letter' | 'photo' | 'voice' | 'memory'

const TABS: { id: Tab; label: string; Icon: typeof PenLine }[] = [
  { id: 'letter', label: 'Letter',   Icon: PenLine   },
  { id: 'photo',  label: 'Photo',    Icon: Image     },
  { id: 'voice',  label: 'Voice',    Icon: Mic       },
  { id: 'memory', label: 'Memory',   Icon: BookOpen  },
]

const TYPE_LABELS: Record<Tab, string> = {
  letter: 'Letter', photo: 'Photo', voice: 'Voice memo', memory: 'Memory',
}

interface ContributeClientProps {
  inviteToken:     string
  capsuleTitle:    string
  authorName:      string
  contributorName: string
  initialItems:    ContributeItem[]
}

export function ContributeClient({
  inviteToken, capsuleTitle, authorName, contributorName, initialItems,
}: ContributeClientProps) {
  const [tab,     setTab]     = useState<Tab>('letter')
  const [items,   setItems]   = useState<ContributeItem[]>(initialItems)
  const [done,    setDone]    = useState(false)
  const [pending, startTransition] = useTransition()

  // Per-editor draft state
  const [letterContent, setLetterContent] = useState('')
  const [memoryContent, setMemoryContent] = useState('')
  const [pendingMedia,  setPendingMedia]  = useState<MediaPayload | null>(null)

  const getSignature = () => getContributorSignatureAction(inviteToken)

  function handleMediaUpload(media: MediaPayload, type: 'photo' | 'voice') {
    setPendingMedia(media)
    startTransition(async () => {
      const result = await addContributionAction(inviteToken, {
        type,
        order: items.length,
        media,
      })
      if (!result.success) {
        toast.error(result.error)
        setPendingMedia(null)
        return
      }
      setItems((prev) => [...prev, result.item])
      setPendingMedia(null)
      toast.success(`${TYPE_LABELS[type]} added.`)
    })
  }

  function handleAddText(type: 'letter' | 'memory') {
    const content = type === 'letter' ? letterContent : memoryContent
    if (!content.trim()) return
    startTransition(async () => {
      const result = await addContributionAction(inviteToken, {
        type,
        order:         items.length,
        content:       content.trim(),
        contentFormat: type === 'letter' ? 'rich' : 'plain',
      })
      if (!result.success) {
        toast.error(result.error)
        return
      }
      setItems((prev) => [...prev, result.item])
      if (type === 'letter') setLetterContent('')
      else                   setMemoryContent('')
      toast.success(`${TYPE_LABELS[type]} added.`)
    })
  }

  function handleRemove(itemId: string) {
    startTransition(async () => {
      const result = await removeContributionAction(inviteToken, itemId)
      if (!result.success) {
        toast.error(result.error)
        return
      }
      setItems((prev) => prev.filter((i) => i.id !== itemId))
      toast.success('Removed.')
    })
  }

  if (done) {
    return (
      <div className="min-h-screen bg-ivory flex flex-col items-center justify-center text-center px-6 gap-4">
        <div className="w-14 h-14 rounded-full bg-gold/10 flex items-center justify-center">
          <Check className="w-6 h-6 text-gold" />
        </div>
        <h2 className="font-display text-2xl font-light text-charcoal">
          Thank you, {contributorName}.
        </h2>
        <p className="text-sm text-warm-gray max-w-xs leading-relaxed">
          Your {items.length} contribution{items.length !== 1 ? 's have' : ' has'} been added
          to &ldquo;{capsuleTitle}&rdquo;. {authorName} will deliver it when the time is right.
        </p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-ivory">
      {/* Header */}
      <div className="border-b border-stone/30 bg-white px-6 py-5">
        <div className="max-w-xl mx-auto">
          <p className="text-[10px] text-warm-gray uppercase tracking-[0.2em] mb-1">
            Contributing to
          </p>
          <h1 className="font-display text-xl font-light text-charcoal leading-tight">
            {capsuleTitle}
          </h1>
          <p className="text-xs text-warm-gray mt-1">
            by {authorName} · as <span className="font-medium text-charcoal">{contributorName}</span>
          </p>
        </div>
      </div>

      <div className="max-w-xl mx-auto px-6 py-8 space-y-8">

        {/* Items already added */}
        {items.length > 0 && (
          <div className="space-y-3">
            <p className="text-xs text-warm-gray uppercase tracking-widest font-medium">
              Your contributions ({items.length})
            </p>
            <div className="divide-y divide-stone/30 rounded-xl border border-stone/40 overflow-hidden">
              {items.map((item) => (
                <div key={item.id} className="flex items-center gap-3 px-4 py-3">
                  <div className="w-7 h-7 rounded-full bg-gold/10 flex items-center justify-center flex-shrink-0">
                    {item.type === 'letter' && <PenLine size={12} className="text-gold" />}
                    {item.type === 'photo'  && <Image   size={12} className="text-gold" />}
                    {item.type === 'voice'  && <Mic     size={12} className="text-gold" />}
                    {item.type === 'memory' && <BookOpen size={12} className="text-gold" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-charcoal">{TYPE_LABELS[item.type as Tab]}</p>
                    {item.content && (
                      <p className="text-xs text-warm-gray truncate">
                        {item.content.replace(/<[^>]+>/g, '').slice(0, 60)}
                      </p>
                    )}
                    {item.mediaUrl && (
                      <p className="text-xs text-warm-gray">Media attached</p>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemove(item.id)}
                    disabled={pending}
                    className="text-warm-gray/40 hover:text-rose transition-colors disabled:opacity-30"
                    aria-label="Remove"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Add more */}
        <div className="space-y-4">
          <p className="text-xs text-warm-gray uppercase tracking-widest font-medium">
            Add something
          </p>

          {/* Tabs */}
          <div className="flex gap-1 rounded-xl bg-stone/20 p-1">
            {TABS.map(({ id, label, Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => setTab(id)}
                className={cn(
                  'flex-1 flex items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-medium transition-all',
                  tab === id
                    ? 'bg-white text-charcoal shadow-sm'
                    : 'text-warm-gray hover:text-charcoal',
                )}
              >
                <Icon size={12} />
                {label}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div>
            {tab === 'letter' && (
              <div className="space-y-3">
                <LetterEditor
                  value={letterContent}
                  onChange={setLetterContent}
                />
                <button
                  type="button"
                  onClick={() => handleAddText('letter')}
                  disabled={!letterContent.trim() || pending}
                  className={cn(
                    'inline-flex items-center gap-1.5 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors',
                    letterContent.trim() && !pending
                      ? 'bg-charcoal text-ivory hover:bg-dark'
                      : 'bg-stone/40 text-warm-gray cursor-not-allowed',
                  )}
                >
                  <Plus size={14} />
                  {pending ? 'Adding…' : 'Add letter'}
                </button>
              </div>
            )}

            {tab === 'photo' && (
              <PhotoUploader
                onUpload={(media) => handleMediaUpload(media, 'photo')}
                getSignature={getSignature}
              />
            )}

            {tab === 'voice' && (
              <VoiceRecorder
                onUpload={(media) => handleMediaUpload(media, 'voice')}
                getSignature={getSignature}
              />
            )}

            {tab === 'memory' && (
              <div className="space-y-3">
                <MemoryBlock
                  value={memoryContent}
                  onChange={setMemoryContent}
                />
                <button
                  type="button"
                  onClick={() => handleAddText('memory')}
                  disabled={!memoryContent.trim() || pending}
                  className={cn(
                    'inline-flex items-center gap-1.5 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors',
                    memoryContent.trim() && !pending
                      ? 'bg-charcoal text-ivory hover:bg-dark'
                      : 'bg-stone/40 text-warm-gray cursor-not-allowed',
                  )}
                >
                  <Plus size={14} />
                  {pending ? 'Adding…' : 'Add memory'}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Done */}
        {items.length > 0 && (
          <div className="pt-2 border-t border-stone/30">
            <button
              type="button"
              onClick={() => setDone(true)}
              className="w-full rounded-xl py-3.5 text-sm font-medium text-warm-gray border border-stone hover:border-warm-gray/50 hover:text-charcoal transition-colors"
            >
              I&apos;m done contributing
            </button>
          </div>
        )}
      </div>

      {/* Offscreen — suppress unused warning */}
      {pendingMedia && <span className="sr-only">{pendingMedia.cloudinaryId}</span>}
    </div>
  )
}
