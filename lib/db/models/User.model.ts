import mongoose, { Schema, model, models, type Document, type Types } from 'mongoose'
import { nanoid } from 'nanoid'

export interface IUser extends Document {
  _id: Types.ObjectId
  email: string
  emailVerified: Date | null
  name: string
  image: string | null
  passwordHash: string | null
  provider: 'google' | 'github' | 'credentials'
  preferences: {
    timezone: string
    emailNotifications: boolean
  }
  plan:                   'free' | 'plus'
  stripeCustomerId:       string | null
  stripeSubscriptionId:   string | null
  planExpiresAt:          Date | null
  capsuleCount:           number
  unsubscribeToken:       string
  schemaVersion:          number
  createdAt: Date
  updatedAt: Date
}

const UserSchema = new Schema<IUser>(
  {
    email:         { type: String, required: true, unique: true, lowercase: true, trim: true },
    emailVerified: { type: Date, default: null },
    name:          { type: String, required: true, trim: true },
    image:         { type: String, default: null },
    passwordHash:  { type: String, default: null, select: false },
    provider:      { type: String, enum: ['google', 'github', 'credentials'], required: true },
    preferences: {
      timezone:           { type: String, default: 'UTC' },
      emailNotifications: { type: Boolean, default: true },
    },
    plan:                 { type: String, enum: ['free', 'plus'], default: 'free' },
    stripeCustomerId:     { type: String, default: null },
    stripeSubscriptionId: { type: String, default: null },
    planExpiresAt:        { type: Date,   default: null },
    capsuleCount:         { type: Number, default: 0 },
    unsubscribeToken:     { type: String, default: () => nanoid(21), index: true },
    schemaVersion: { type: Number, default: 1 },
  },
  { timestamps: true },
)

UserSchema.index({ email: 1 }, { unique: true })

export const User = (models.User as mongoose.Model<IUser>) ?? model<IUser>('User', UserSchema)
