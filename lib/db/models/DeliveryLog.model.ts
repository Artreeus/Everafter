import mongoose, { Schema, model, models, type Document, type Types } from 'mongoose'

export interface IDeliveryLog extends Document {
  _id:              Types.ObjectId
  capsuleId:        Types.ObjectId
  recipientEmail:   string
  recipientToken:   string
  emailMessageId:   string | null
  status:           'queued' | 'sent' | 'failed' | 'opened'
  attemptCount:     number
  lastAttemptAt:    Date | null
  failureReason:    string | null
  openedAt:         Date | null
  schemaVersion:    number
  createdAt:        Date
  updatedAt:        Date
}

const DeliveryLogSchema = new Schema<IDeliveryLog>(
  {
    capsuleId:      { type: Schema.Types.ObjectId, ref: 'Capsule', required: true },
    recipientEmail: { type: String, required: true, lowercase: true, trim: true },
    recipientToken: { type: String, required: true },
    emailMessageId: { type: String, default: null },
    status:         { type: String, enum: ['queued', 'sent', 'failed', 'opened'], default: 'queued' },
    attemptCount:   { type: Number, default: 0 },
    lastAttemptAt:  { type: Date, default: null },
    failureReason:  { type: String, default: null },
    openedAt:       { type: Date, default: null },
    schemaVersion:  { type: Number, default: 1 },
  },
  { timestamps: true },
)

DeliveryLogSchema.index({ capsuleId: 1 })
DeliveryLogSchema.index({ recipientToken: 1 })

export const DeliveryLog =
  (models.DeliveryLog as mongoose.Model<IDeliveryLog>) ??
  model<IDeliveryLog>('DeliveryLog', DeliveryLogSchema)
