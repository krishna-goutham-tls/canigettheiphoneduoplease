import { create } from 'zustand'
import type { Colorway, FaceId, Pose, Slot } from '../types'

const SLOT_IDS = [
  'widget-0',
  'widget-1',
  'widget-2',
  ...Array.from({ length: 16 }, (_, i) => `grid-${i}`),
]

function faceFromId(id: string): FaceId {
  if (id.startsWith('widget-')) return 'widget'
  return 'grid'
}

export function emptySlots(): Slot[] {
  return SLOT_IDS.map((id) => ({
    id,
    face: faceFromId(id),
    index: Number(id.split('-')[1]),
    bidUsd: 0,
    holder: null,
  }))
}

type AuctionState = {
  slots: Slot[]
  events: import('../types').BidEvent[]
  raisedUsd: number
  pose: Pose
  color: Colorway
  hoveredId: string | null
  activeId: string | null
  sheetOpen: boolean
  setBoard: (board: {
    slots: Slot[]
    events: import('../types').BidEvent[]
    raisedUsd: number
  }) => void
  setColor: (color: Colorway) => void
  hover: (id: string | null) => void
  inspect: (id: string) => void
  closeSheet: () => void
  openClaim: (id: string) => void
}

export const useAuction = create<AuctionState>()((set, get) => ({
  slots: emptySlots(),
  events: [],
  raisedUsd: 0,
  pose: 'cover',
  color: 'star',
  hoveredId: null,
  activeId: null,
  sheetOpen: false,
  setBoard: (board) => set(board),
  setColor: (color) => set({ color }),
  hover: (id) => set({ hoveredId: id }),
  inspect: (id) => {
    const slot = get().slots.find((s) => s.id === id)
    if (!slot) return
    set({ activeId: id, pose: 'inner', sheetOpen: true })
  },
  closeSheet: () => set({ sheetOpen: false }),
  openClaim: (id) => {
    const slot = get().slots.find((s) => s.id === id)
    if (!slot) return
    set({ activeId: id, pose: 'inner', sheetOpen: true })
  },
}))
