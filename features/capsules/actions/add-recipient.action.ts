'use server'

import { revalidatePath }           from 'next/cache'
import { z }                        from 'zod'
import { connectDB }                from '@/lib/db/connection'
import { Capsule }                  from '@/lib/db/models/Capsule.model'
import { requireSession }           from '@/lib/auth/session'
import { generateDeliveryToken }    from '@/lib/utils/tokens'

const schema = z.object({
  name:  z.string().min(1).max(100).trim(),
  email: z.string().email().toLowerCase(),
})

export interface AddedRecipient {
  id:    string
  name:  string
  email: string
}

export type AddRecipientResult =
  | { success: true;  recipient: AddedRecipient }
  | { success: false; error: string }

export async function addRecipientAction(
  capsuleId: string,
  input: { name: string; email: string },
): Promise<AddRecipientResult> {
  const session = await requireSession()

  const parsed = schema.safeParse(input)
  if (!parsed.success) {
    const first = Object.values(parsed.error.flatten().fieldErrors)[0]?.[0]
    return { success: false, error: first ?? 'Invalid recipient.' }
  }

  await connectDB()

  const capsule = await Capsule.findOne({ _id: capsuleId, authorId: session.user.id })
  if (!capsule) return { success: false, error: 'Capsule not found.' }
  if (capsule.status !== 'draft') return { success: false, error: 'Only draft capsules can be edited.' }
  if (capsule.recipients.length >= 10) return { success: false, error: 'Maximum 10 recipients allowed.' }

  const duplicate = capsule.recipients.some(
    (r) => r.email === parsed.data.email,
  )
  if (duplicate) return { success: false, error: 'This email is already a recipient.' }

  const newRecipient = {
    name:          parsed.data.name,
    email:         parsed.data.email,
    deliveryToken: generateDeliveryToken(),
    status:        'pending' as const,
    deliveredAt:   null,
    openedAt:      null,
  }

  await Capsule.updateOne(
    { _id: capsuleId },
    { $push: { recipients: newRecipient } },
  )

  // Fetch back to get the generated _id
  const updated = await Capsule.findOne(
    { _id: capsuleId, 'recipients.email': parsed.data.email },
    { 'recipients.$': 1 },
  )
  const saved = updated?.recipients[0]

  revalidatePath(`/capsules/${capsuleId}/edit`)

  return {
    success: true,
    recipient: {
      id:    saved?._id.toString() ?? '',
      name:  parsed.data.name,
      email: parsed.data.email,
    },
  }
}
