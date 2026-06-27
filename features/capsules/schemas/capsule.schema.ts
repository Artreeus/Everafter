import { z } from 'zod'

export const recipientSchema = z.object({
  name:  z.string().min(1, 'Name is required').max(100).trim(),
  email: z.string().email('Invalid email address').toLowerCase(),
})

export const createCapsuleSchema = z.object({
  title:         z.string().min(1, 'Title is required').max(120).trim(),
  theme:         z.enum(['classic', 'floral', 'midnight', 'golden', 'sakura', 'ocean', 'ember', 'velvet']),
  message:       z.string().max(600).optional(),
  recipients:    z.array(recipientSchema).min(1, 'At least one recipient is required').max(10),
  scheduledDate: z.string().min(1, 'Delivery date is required'),
  scheduledTime: z.string().default('09:00'),
  timezone:      z.string().min(1),
  notifyOnOpen:  z.boolean().default(true),
  allowReply:    z.boolean().default(false),
  recurrence:    z.enum(['once', 'monthly', 'annually']).default('once'),
})

export const itemMediaSchema = z.object({
  cloudinaryId:    z.string(),
  url:             z.string().url(),
  thumbnailUrl:    z.string().url().nullable(),
  mimeType:        z.string(),
  sizeBytes:       z.number(),
  durationSeconds: z.number().optional(),
})

export const capsuleItemSchema = z.object({
  type:          z.enum(['letter', 'photo', 'voice', 'memory']),
  order:         z.number().int().min(0),
  content:       z.string().optional(),
  contentFormat: z.enum(['plain', 'rich']).optional(),
  media:         itemMediaSchema.optional(),
  caption:       z.string().max(300).optional(),
})

export type CreateCapsuleInput = z.infer<typeof createCapsuleSchema>
export type CapsuleItemPayload = z.infer<typeof capsuleItemSchema>
