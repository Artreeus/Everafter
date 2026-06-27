import type { Metadata }             from 'next'
import { notFound, redirect }         from 'next/navigation'
import Link                           from 'next/link'
import { ArrowLeft }                  from 'lucide-react'
import { requireSession }             from '@/lib/auth/session'
import { connectDB }                  from '@/lib/db/connection'
import { User }                       from '@/lib/db/models/User.model'
import { getCapsuleAction }           from '@/features/capsules/actions/get-capsule.action'
import { getContributorsAction }      from '@/features/capsules/actions/get-contributors.action'
import { EditBasicsForm }             from '@/features/capsules/components/edit/EditBasicsForm'
import { EditItemsSection }           from '@/features/capsules/components/edit/EditItemsSection'
import { EditRecipientsSection }      from '@/features/capsules/components/edit/EditRecipientsSection'
import { EditContributorsSection }    from '@/features/capsules/components/edit/EditContributorsSection'
import { DeleteDraftButton }          from '@/features/capsules/components/edit/DeleteDraftButton'
import type { AddedItem }             from '@/features/capsules/actions/add-capsule-item.action'

export const metadata: Metadata = { title: 'Edit Capsule' }

interface Props { params: Promise<{ id: string }> }

export default async function EditCapsulePage({ params }: Props) {
  const { id } = await params
  const session = await requireSession()
  await connectDB()

  const [result, contributors, userRecord] = await Promise.all([
    getCapsuleAction(id),
    getContributorsAction(id),
    User.findById(session.user.id).select('plan').lean(),
  ])

  if (!result) notFound()

  const { capsule, items } = result

  if (capsule.status !== 'draft') {
    redirect(`/capsules/${id}`)
  }

  // Convert scheduledFor (UTC Date) to date/time strings for the form
  const dt           = new Date(capsule.scheduledFor)
  const scheduledDate = dt.toISOString().split('T')[0]
  const scheduledTime = dt.toISOString().split('T')[1].slice(0, 5)

  const serializedItems: AddedItem[] = items.map((item) => ({
    id:            item._id.toString(),
    type:          item.type,
    content:       item.content,
    contentFormat: item.contentFormat,
    mediaUrl:      item.media?.url ?? null,
    caption:       item.metadata?.caption ?? null,
    order:         item.order,
  }))

  const serializedRecipients = capsule.recipients.map((r) => ({
    id:    r._id.toString(),
    name:  r.name,
    email: r.email,
  }))

  return (
    <div className="px-6 py-8 max-w-2xl mx-auto space-y-10">

      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <Link
          href={`/capsules/${id}`}
          className="inline-flex items-center gap-1.5 text-sm text-warm-gray hover:text-charcoal transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to capsule
        </Link>
        <DeleteDraftButton capsuleId={id} capsuleTitle={capsule.title} />
      </div>

      <div>
        <h1 className="font-display text-2xl font-light text-charcoal">Edit capsule</h1>
        <p className="text-sm text-warm-gray mt-1">{capsule.title}</p>
      </div>

      {/* Basics */}
      <Section title="Basics">
        <EditBasicsForm
          capsuleId={id}
          title={capsule.title}
          theme={capsule.theme}
          message={capsule.message ?? null}
          scheduledDate={scheduledDate}
          scheduledTime={scheduledTime}
          timezone="UTC"
          notifyOnOpen={capsule.settings.notifyOnOpen}
          allowReply={capsule.settings.allowReply}
          recurrence={capsule.settings.recurrence}
          userPlan={userRecord?.plan ?? 'free'}
        />
      </Section>

      {/* Content */}
      <Section title="Content">
        <EditItemsSection
          capsuleId={id}
          initialItems={serializedItems}
        />
      </Section>

      {/* Recipients */}
      <Section title="Recipients">
        <EditRecipientsSection
          capsuleId={id}
          recipients={serializedRecipients}
        />
      </Section>

      {/* Contributors */}
      <Section title="Contributors">
        <p className="text-xs text-warm-gray -mt-2 mb-4">
          Invite people to add their own content to this capsule. They'll receive a private link.
        </p>
        <EditContributorsSection
          capsuleId={id}
          contributors={contributors}
        />
      </Section>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-5">
      <div className="flex items-center gap-4">
        <h2 className="text-sm font-medium text-charcoal uppercase tracking-widest">{title}</h2>
        <div className="flex-1 h-px bg-stone/50" />
      </div>
      {children}
    </div>
  )
}
