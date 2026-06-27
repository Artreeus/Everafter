import mongoose, { Schema, type Types } from 'mongoose'

export interface ICapsuleReply {
  _id:            Types.ObjectId
  capsuleId:      Types.ObjectId
  recipientToken: string
  recipientName:  string
  content:        string
  createdAt:      Date
  updatedAt:      Date
}

const CapsuleReplySchema = new Schema<ICapsuleReply>(
  {
    capsuleId:      { type: Schema.Types.ObjectId, ref: 'Capsule', required: true, index: true },
    recipientToken: { type: String, required: true },
    recipientName:  { type: String, required: true },
    content:        { type: String, required: true, maxlength: 1000 },
  },
  { timestamps: true },
)

CapsuleReplySchema.index({ capsuleId: 1, createdAt: 1 })

export const CapsuleReply =
  (mongoose.models.CapsuleReply as mongoose.Model<ICapsuleReply>) ??
  mongoose.model<ICapsuleReply>('CapsuleReply', CapsuleReplySchema)
