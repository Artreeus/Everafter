'use client'

import { useState, useTransition } from 'react'
import { Users, Mail, Check, Clock, Trash2, UserPlus } from 'lucide-react'
import { toast }                   from 'sonner'
import { cn }                      from '@/lib/utils/cn'
import { inviteContributorAction } from '@/features/capsules/actions/invite-contributor.action'
import { removeContributorAction } from '@/features/capsules/actions/remove-contributor.action'
import type { SerializedContributor } from '@/features/capsules/actions/get-contributors.action'
import type { AddedContributor }   from '@/features/capsules/actions/invite-contributor.action'

interface EditContributorsSectionProps {
  capsuleId:    string
  contributors: SerializedContributor[]
}

export function EditContributorsSection({ capsuleId, contributors: initial }: EditContributorsSectionProps) {
  const [contributors, setContributors] = useState<SerializedContributor[]>(initial)
  const [name,         setName]         = useState('')
  const [email,        setEmail]        = useState('')
  const [pending,      startTransition] = useTransition()
  const [removing,     setRemoving]     = useState<string | null>(null)

  function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    startTransition(async () => {
      const result = await inviteContributorAction(capsuleId, name, email)
      if (!result.success) {
        toast.error(result.error)
        return
      }
      const added = result.contributor as AddedContributor
      setContributors((prev) => [
        ...prev,
        { id: added.id, name: added.name, email: added.email, status: 'pending', acceptedAt: null },
      ])
      setName('')
      setEmail('')
      toast.success(`Invite sent to ${added.email}.`)
    })
  }

  function handleRemove(contributorId: string) {
    setRemoving(contributorId)
    startTransition(async () => {
      const result = await removeContributorAction(capsuleId, contributorId)
      setRemoving(null)
      if (!result.success) {
        toast.error(result.error)
        return
      }
      setContributors((prev) => prev.filter((c) => c.id !== contributorId))
      toast.success('Contributor removed.')
    })
  }

  return (
    <div className="space-y-5">

      {/* Current contributors */}
      {contributors.length > 0 && (
        <div className="divide-y divide-stone/30 rounded-xl border border-stone/40 overflow-hidden">
          {contributors.map((c) => (
            <div key={c.id} className="flex items-center gap-3 px-4 py-3">
              <div className={cn(
                'w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0',
                c.status === 'accepted' ? 'bg-gold/10' : 'bg-stone/40',
              )}>
                {c.status === 'accepted'
                  ? <Check size={12} className="text-gold" />
                  : <Clock size={12} className="text-warm-gray/60" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-charcoal truncate">{c.name}</p>
                <p className="text-xs text-warm-gray truncate">{c.email}</p>
              </div>
              <span className={cn(
                'text-[10px] uppercase tracking-wider mr-2 flex-shrink-0',
                c.status === 'accepted' ? 'text-gold' : 'text-warm-gray/60',
              )}>
                {c.status === 'accepted' ? 'Accepted' : 'Pending'}
              </span>
              <button
                type="button"
                onClick={() => handleRemove(c.id)}
                disabled={removing === c.id}
                className="text-warm-gray/50 hover:text-rose transition-colors disabled:opacity-40"
                aria-label={`Remove ${c.name}`}
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      {contributors.length === 0 && (
        <div className="rounded-xl border border-dashed border-stone/60 py-8 flex flex-col items-center gap-2 text-center">
          <Users size={20} className="text-warm-gray/40" />
          <p className="text-sm text-warm-gray/60">No contributors yet</p>
          <p className="text-xs text-warm-gray/40">Invite people to add their own letters, photos, and memories.</p>
        </div>
      )}

      {/* Invite form */}
      {contributors.length < 10 && (
        <form onSubmit={handleAdd} className="space-y-3">
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-charcoal mb-1.5 tracking-wide">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Emma Watson"
                required
                className={cn(
                  'block w-full rounded-xl border border-stone bg-ivory px-4 py-2.5 text-sm text-charcoal',
                  'outline-none transition-all duration-150 focus:ring-2 focus:ring-gold/40 focus:border-gold/60',
                  'hover:border-warm-gray/50 placeholder:text-warm-gray/50',
                )}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-charcoal mb-1.5 tracking-wide">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="emma@example.com"
                required
                className={cn(
                  'block w-full rounded-xl border border-stone bg-ivory px-4 py-2.5 text-sm text-charcoal',
                  'outline-none transition-all duration-150 focus:ring-2 focus:ring-gold/40 focus:border-gold/60',
                  'hover:border-warm-gray/50 placeholder:text-warm-gray/50',
                )}
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={pending || !name.trim() || !email.trim()}
            className={cn(
              'inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors',
              name.trim() && email.trim() && !pending
                ? 'bg-charcoal text-ivory hover:bg-dark'
                : 'bg-stone/40 text-warm-gray cursor-not-allowed',
            )}
          >
            {pending ? (
              <>
                <Mail size={14} />
                Sending invite…
              </>
            ) : (
              <>
                <UserPlus size={14} />
                Send invite
              </>
            )}
          </button>
        </form>
      )}
    </div>
  )
}
