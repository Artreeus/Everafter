import mongoose, { Schema, type Types } from 'mongoose'

export interface ICapsuleContributor {
  _id:         Types.ObjectId
  capsuleId:   Types.ObjectId
  name:        string
  email:       string
  inviteToken: string
  status:      'pending' | 'accepted' | 'declined'
  acceptedAt:  Date | null
  createdAt:   Date
  updatedAt:   Date
}

const CapsuleContributorSchema = new Schema<ICapsuleContributor>(
  {
    capsuleId:   { type: Schema.Types.ObjectId, ref: 'Capsule', required: true, index: true },
    name:        { type: String, required: true, trim: true },
    email:       { type: String, required: true, lowercase: true, trim: true },
    inviteToken: { type: String, required: true, unique: true },
    status:      { type: String, enum: ['pending', 'accepted', 'declined'], default: 'pending' },
    acceptedAt:  { type: Date, default: null },
  },
  { timestamps: true },
)

CapsuleContributorSchema.index({ capsuleId: 1, email: 1 }, { unique: true })

export const CapsuleContributor =
  (mongoose.models.CapsuleContributor as mongoose.Model<ICapsuleContributor>) ??
  mongoose.model<ICapsuleContributor>('CapsuleContributor', CapsuleContributorSchema)
