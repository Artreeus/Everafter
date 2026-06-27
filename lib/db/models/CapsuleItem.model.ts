import mongoose, { Schema, model, models, type Document, type Types } from 'mongoose'

export interface ICapsuleItem extends Document {
  _id:           Types.ObjectId
  capsuleId:     Types.ObjectId
  authorId:      Types.ObjectId
  type:          'letter' | 'photo' | 'voice' | 'memory'
  order:         number
  content:       string | null
  contentFormat: 'plain' | 'rich'
  media: {
    cloudinaryId:    string
    url:             string
    thumbnailUrl:    string | null
    mimeType:        string
    sizeBytes:       number
    durationSeconds: number | null
  } | null
  metadata: {
    caption:  string | null
    takenAt:  Date | null
  }
  contributorName: string | null
  schemaVersion:   number
  createdAt:       Date
  updatedAt:       Date
}

const CapsuleItemSchema = new Schema<ICapsuleItem>(
  {
    capsuleId:     { type: Schema.Types.ObjectId, ref: 'Capsule', required: true },
    authorId:      { type: Schema.Types.ObjectId, ref: 'User',    required: true },
    type:          { type: String, enum: ['letter', 'photo', 'voice', 'memory'], required: true },
    order:         { type: Number, required: true, default: 0 },
    content:       { type: String, default: null },
    contentFormat: { type: String, enum: ['plain', 'rich'], default: 'plain' },
    media: {
      type: new Schema({
        cloudinaryId:    { type: String, required: true },
        url:             { type: String, required: true },
        thumbnailUrl:    { type: String, default: null },
        mimeType:        { type: String, required: true },
        sizeBytes:       { type: Number, required: true },
        durationSeconds: { type: Number, default: null },
      }, { _id: false }),
      default: null,
    },
    metadata: {
      caption: { type: String, default: null },
      takenAt: { type: Date,   default: null },
    },
    contributorName: { type: String, default: null },
    schemaVersion:   { type: Number, default: 1 },
  },
  { timestamps: true },
)

CapsuleItemSchema.index({ capsuleId: 1, order: 1 })

export const CapsuleItem =
  (models.CapsuleItem as mongoose.Model<ICapsuleItem>) ??
  model<ICapsuleItem>('CapsuleItem', CapsuleItemSchema)
