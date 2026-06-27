export type CapsuleTheme  = 'classic' | 'floral' | 'midnight' | 'golden' | 'sakura' | 'ocean' | 'ember' | 'velvet'
export type CapsuleStatus = 'draft' | 'sealed' | 'delivered' | 'expired'
export type ItemType      = 'letter' | 'photo' | 'voice' | 'memory'
export type Recurrence    = 'once' | 'monthly' | 'annually'

export interface RecipientInput {
  id:    string  // client-side UUID
  name:  string
  email: string
}

export interface MediaPayload {
  cloudinaryId:  string
  url:           string
  thumbnailUrl:  string | null
  mimeType:      string
  sizeBytes:     number
  durationSeconds?: number
}

export interface CapsuleItemInput {
  id:            string  // client-side UUID
  type:          ItemType
  order:         number
  content?:      string  // Tiptap JSON string for letter/memory text
  contentFormat?: 'plain' | 'rich'
  media?:        MediaPayload
  caption?:      string
}

export interface WizardState {
  // Step 1
  title:   string
  theme:   CapsuleTheme
  message: string

  // Step 2
  recipients: RecipientInput[]

  // Step 3
  scheduledDate: string  // YYYY-MM-DD
  scheduledTime: string  // HH:MM
  timezone:      string
  recurrence:    Recurrence

  // Step 4
  items: CapsuleItemInput[]

  // Settings (step 5)
  notifyOnOpen: boolean
  allowReply:   boolean
}

export type WizardAction =
  | { type: 'SET_BASICS';       payload: Pick<WizardState, 'title' | 'theme' | 'message'> }
  | { type: 'ADD_RECIPIENT';    payload: Omit<RecipientInput, 'id'> }
  | { type: 'REMOVE_RECIPIENT'; payload: string }
  | { type: 'SET_SCHEDULE';     payload: Pick<WizardState, 'scheduledDate' | 'scheduledTime' | 'timezone'> }
  | { type: 'ADD_ITEM';         payload: Omit<CapsuleItemInput, 'id' | 'order'> }
  | { type: 'UPDATE_ITEM';      payload: { id: string; updates: Partial<CapsuleItemInput> } }
  | { type: 'REMOVE_ITEM';      payload: string }
  | { type: 'REORDER_ITEMS';    payload: CapsuleItemInput[] }
  | { type: 'SET_NOTIFY';       payload: boolean }
  | { type: 'SET_ALLOW_REPLY';  payload: boolean }
  | { type: 'SET_RECURRENCE';   payload: Recurrence }
