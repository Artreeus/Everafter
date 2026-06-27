'use server'

import { cloudinary }        from '@/lib/cloudinary/config'
import { requireSession }    from '@/lib/auth/session'
import { connectDB }         from '@/lib/db/connection'
import { CapsuleContributor } from '@/lib/db/models/CapsuleContributor.model'

export interface CloudinarySignature {
  signature:  string
  timestamp:  number
  apiKey:     string
  cloudName:  string
  folder:     string
}

export async function getCloudinarySignatureAction(): Promise<CloudinarySignature> {
  const session = await requireSession()

  const timestamp = Math.round(Date.now() / 1000)
  const folder    = `everafter/${session.user.id}`

  const signature = cloudinary.utils.api_sign_request(
    { timestamp, folder },
    process.env.CLOUDINARY_API_SECRET!,
  )

  return {
    signature,
    timestamp,
    apiKey:    process.env.CLOUDINARY_API_KEY!,
    cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!,
    folder,
  }
}

export async function getContributorSignatureAction(inviteToken: string): Promise<CloudinarySignature> {
  await connectDB()
  const contributor = await CapsuleContributor.findOne({ inviteToken, status: 'accepted' })
    .select('capsuleId')
    .lean()
  if (!contributor) throw new Error('Invalid contributor token.')

  const timestamp = Math.round(Date.now() / 1000)
  const folder    = `everafter/contribute/${contributor.capsuleId.toString()}`

  const signature = cloudinary.utils.api_sign_request(
    { timestamp, folder },
    process.env.CLOUDINARY_API_SECRET!,
  )

  return {
    signature,
    timestamp,
    apiKey:    process.env.CLOUDINARY_API_KEY!,
    cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!,
    folder,
  }
}
