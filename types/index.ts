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
  content: string
  createdAt: string | Date
}

export type WsClientPayload =
  | { type: 'join'; username: string }
  | { type: 'message'; username: string; content: string }
  | { type: 'leave'; username: string }

export type WsServerPayload =
  | { type: 'message'; username: string; content: string; createdAt: string }
  | { type: 'system'; content: string; createdAt: string }
  | { type: 'participants'; count: number }
