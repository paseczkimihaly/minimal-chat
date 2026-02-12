export interface AuthUser {
  id: string
  name: string
  email: string
  username: string
  displayUsername: string
}

export interface Room {
  _id: string
  name: string
  createdBy: string
  createdAt: string | Date
}

export interface Message {
  _id?: string
  roomId: string
  username: string
  color: string
  content: string
  createdAt: string | Date
}

export const USER_COLORS = [
  '#FFB3BA', '#FFDFBA', '#FFFFBA', '#BAFFC9',
  '#BAE1FF', '#D4BAFF', '#FFB3E6', '#B3FFE6',
  '#FFD4B3', '#B3D4FF', '#E6B3FF', '#B3FFB3',
  '#FFB3B3', '#B3FFFF', '#FFE6B3', '#D4FFB3',
] as const

export type WsClientPayload =
  | { type: 'join'; username: string; color: string }
  | { type: 'message'; username: string; color: string; content: string }
  | { type: 'leave'; username: string }

export type WsServerPayload =
  | { type: 'message'; username: string; color: string; content: string; createdAt: string }
  | { type: 'system'; content: string; createdAt: string }
  | { type: 'participants'; count: number }
