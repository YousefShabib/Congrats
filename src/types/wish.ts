export type WishMood = 'happy' | 'proud' | 'fun' | 'emotional'

export interface WishDoc {
  senderName: string
  message: string
  senderImage?: string
  createdAt: string
  likes: number
  isPinned: boolean
  mood?: WishMood
}

export interface WishInput {
  senderName: string
  message: string
  senderImage?: string
  mood?: WishMood
  imageFile?: File
}

export interface Congratulation {
  id: string
  senderName: string
  message: string
  avatar?: string
  createdAt: Date
  likes?: number
  isPinned?: boolean
  mood?: string
}

export interface WishSubmitPayload {
  senderName: string
  message: string
  imageFile?: File
  mood?: string
}
