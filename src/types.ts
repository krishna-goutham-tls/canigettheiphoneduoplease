export type FaceId = 'widget' | 'grid' | 'dock'

export type Pose = 'cover' | 'inner' | 'back'

export type Colorway = 'night' | 'star'

export type Holder = {
  name: string
  url: string
  logoDataUrl: string
}

export type Slot = {
  id: string
  face: FaceId
  index: number
  bidUsd: number
  holder: Holder | null
}

export type BidEvent = {
  id: string
  at: number
  slotId: string
  name: string
  amountUsd: number
  kind: 'claim' | 'outbid' | 'raise'
}

export type BidDraft = {
  name: string
  url: string
  logoDataUrl: string
  amountUsd: number
}
