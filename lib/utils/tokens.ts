import { nanoid } from 'nanoid'

export function generateDeliveryToken(): string {
  return nanoid(21)
}

export function generateSecretKey(): string {
  return nanoid(32)
}
