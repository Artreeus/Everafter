import mongoose, { Schema, model, models, type Document, type Types } from 'mongoose'

export interface IRecipient {
  _id:            Types.ObjectId
  name:           string
  email:          string
  deliveryToken:  string
  deliveredAt:    Date | null
  openedAt:       Date | null
  status:         'pending' | 'delivered' | 'opened'
}

export interface ICapsule extends Document {
  _id:          Types.ObjectId
  authorId:     Types.ObjectId
  title:        string
  theme:        'classic' | 'floral' | 'midnight' | 'golden' | 'sakura' | 'ocean' | 'ember' | 'velvet'
  recipients:   IRecipient[]
  status:       'draft' | 'sealed' | 'delivered' | 'expired'
  scheduledFor: Date
  sealedAt:     Date | null
  inngestJobId: string | null
  settings: {
    notifyOnOpen:  boolean
    allowReply:    boolean
    selfDestruct:  boolean
    recurrence:    'once' | 'monthly' | 'annually'
  }
  message:       string | null
  coverMediaId:  string | null
  schemaVersion: number
  createdAt:     Date
  updatedAt:     Date
}

const RecipientSchema = new Schema<IRecipient>({
  name:          { type: String, required: true, trim: true },
  email:         { type: String, required: true, lowercase: true, trim: true },
  deliveryToken: { type: String, required: true },
  deliveredAt:   { type: Date, default: null },
  openedAt:      { type: Date, default: null },
  status:        { type: String, enum: ['pending', 'delivered', 'opened'], default: 'pending' },
})

const CapsuleSchema = new Schema<ICapsule>(
  {
    authorId:    { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title:       { type: String, required: true, trim: true, maxlength: 120 },
    theme:       { type: String, enum: ['classic', 'floral', 'midnight', 'golden', 'sakura', 'ocean', 'ember', 'velvet'], default: 'classic' },
    recipients:  [RecipientSchema],
    status:      { type: String, enum: ['draft', 'sealed', 'delivered', 'expired'], default: 'draft' },
    scheduledFor: { type: Date, required: true },
    sealedAt:    { type: Date, default: null },
    inngestJobId: { type: String, default: null },
    settings: {
      notifyOnOpen: { type: Boolean, default: true },
      allowReply:   { type: Boolean, default: false },
      selfDestruct: { type: Boolean, default: false },
      recurrence:   { type: String, enum: ['once', 'monthly', 'annually'], default: 'once' },
    },
    message:      { type: String, default: null, maxlength: 600 },
    coverMediaId: { type: String, default: null },
    schemaVersion: { type: Number, default: 1 },
  },
  { timestamps: true },
)

CapsuleSchema.index({ authorId: 1, status: 1 })
CapsuleSchema.index({ scheduledFor: 1, status: 1 })
CapsuleSchema.index({ 'recipients.deliveryToken': 1 }, { unique: true, sparse: true })

export const Capsule =
  (models.Capsule as mongoose.Model<ICapsule>) ?? model<ICapsule>('Capsule', CapsuleSchema)
