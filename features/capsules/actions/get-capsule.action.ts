'use server'

import { connectDB } from '@/lib/db/connection'
import { Capsule, type ICapsule } from '@/lib/db/models/Capsule.model'
import { CapsuleItem, type ICapsuleItem } from '@/lib/db/models/CapsuleItem.model'
import { requireSession } from '@/lib/auth/session'

export async function getCapsuleAction(id: string) {
  const session = await requireSession()
  await connectDB()

  const capsule = await Capsule.findOne({
    _id:      id,
    authorId: session.user.id,
  }).lean<ICapsule>()

  if (!capsule) return null

  const items = await CapsuleItem.find({ capsuleId: id })
    .sort({ order: 1 })
    .lean<ICapsuleItem[]>()

  return { capsule, items }
}

export async function getCapsulesAction() {
  const session = await requireSession()
  await connectDB()

  return Capsule.find({ authorId: session.user.id })
    .sort({ createdAt: -1 })
    .lean<ICapsule[]>()
}
