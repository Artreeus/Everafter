'use server'

import { z }                  from 'zod'
import { connectDB }          from '@/lib/db/connection'
import { Capsule }            from '@/lib/db/models/Capsule.model'
import { CapsuleItem }        from '@/lib/db/models/CapsuleItem.model'
import { CapsuleContributor } from '@/lib/db/models/CapsuleContributor.model'
import { User }               from '@/lib/db/models/User.model'
import { capsuleItemSchema }  from '@/features/capsules/schemas/capsule.schema'

// ── Get data + auto-accept ───────────────────────────────────────────────────

export interface ContributePageData {
  capsuleTitle:    string
  authorName:      string
  contributorName: string
  inviteToken:     string
  items:           ContributeItem[]
}

export interface ContributeItem {
  id:            string
  type:          string
  content:       string | null
  contentFormat: string
  mediaUrl:      string | null
  caption:       string | null
  order:         number
}

export type GetContributeDataResult =
  | { status: 'ok';     data: ContributePageData }
  | { status: 'closed'; capsuleTitle: string }
  | { status: 'notFound' }

export async function getContributeDataAction(inviteToken: string): Promise<GetContributeDataResult> {
  await connectDB()

  const contributor = await CapsuleContributor.findOne({ inviteToken })
  if (!contributor) return { status: 'notFound' }

  const capsule = await Capsule.findById(contributor.capsuleId).lean()
  if (!capsule) return { status: 'notFound' }

  if (capsule.status !== 'draft') {
    return { status: 'closed', capsuleTitle: capsule.title }
  }

  // Auto-accept on first visit
  if (contributor.status === 'pending') {
    contributor.status     = 'accepted'
    contributor.acceptedAt = new Date()
    await contributor.save()
  }

  if (contributor.status === 'declined') return { status: 'notFound' }

  const author = await User.findById(capsule.authorId).select('name').lean()

  const rawItems = await CapsuleItem.find({
    capsuleId:       capsule._id,
    contributorName: contributor.name,
  })
    .sort({ order: 1 })
    .lean()

  return {
    status: 'ok',
    data: {
      capsuleTitle:    capsule.title,
      authorName:      author?.name ?? 'the capsule creator',
      contributorName: contributor.name,
      inviteToken,
      items: rawItems.map((item) => ({
        id:            item._id.toString(),
        type:          item.type,
        content:       item.content,
        contentFormat: item.contentFormat,
        mediaUrl:      item.media?.url ?? null,
        caption:       item.metadata?.caption ?? null,
        order:         item.order,
      })),
    },
  }
}

// ── Add a contribution ───────────────────────────────────────────────────────

export interface AddedContributionItem {
  id:            string
  type:          string
  content:       string | null
  contentFormat: string
  mediaUrl:      string | null
  caption:       string | null
  order:         number
}

export type AddContributionResult =
  | { success: true;  item: AddedContributionItem }
  | { success: false; error: string }

export async function addContributionAction(
  inviteToken: string,
  payload: z.infer<typeof capsuleItemSchema>,
): Promise<AddContributionResult> {
  const parsed = capsuleItemSchema.safeParse(payload)
  if (!parsed.success) {
    const first = Object.values(parsed.error.flatten().fieldErrors)[0]?.[0]
    return { success: false, error: first ?? 'Invalid item.' }
  }

  await connectDB()

  const contributor = await CapsuleContributor.findOne({ inviteToken, status: 'accepted' }).lean()
  if (!contributor) return { success: false, error: 'Invalid or expired invite.' }

  const capsule = await Capsule.findOne({ _id: contributor.capsuleId, status: 'draft' })
    .select('_id authorId')
    .lean()
  if (!capsule) return { success: false, error: 'Capsule is no longer accepting contributions.' }

  const count = await CapsuleItem.countDocuments({ capsuleId: capsule._id })

  const item = await CapsuleItem.create({
    capsuleId:       capsule._id,
    authorId:        capsule.authorId,
    type:            parsed.data.type,
    order:           count,
    content:         parsed.data.content ?? null,
    contentFormat:   parsed.data.contentFormat ?? 'plain',
    media:           parsed.data.media ?? null,
    metadata:        { caption: parsed.data.caption ?? null, takenAt: null },
    contributorName: contributor.name,
    schemaVersion:   1,
  })

  return {
    success: true,
    item: {
      id:            item._id.toString(),
      type:          item.type,
      content:       item.content,
      contentFormat: item.contentFormat,
      mediaUrl:      item.media?.url ?? null,
      caption:       item.metadata?.caption ?? null,
      order:         item.order,
    },
  }
}

// ── Remove a contribution ────────────────────────────────────────────────────

export type RemoveContributionResult =
  | { success: true }
  | { success: false; error: string }

export async function removeContributionAction(
  inviteToken: string,
  itemId: string,
): Promise<RemoveContributionResult> {
  await connectDB()

  const contributor = await CapsuleContributor.findOne({ inviteToken, status: 'accepted' }).lean()
  if (!contributor) return { success: false, error: 'Invalid token.' }

  const item = await CapsuleItem.findOne({
    _id:             itemId,
    capsuleId:       contributor.capsuleId,
    contributorName: contributor.name,
  })
  if (!item) return { success: false, error: 'Item not found.' }

  await CapsuleItem.deleteOne({ _id: itemId })
  return { success: true }
}
