import { useEffect } from 'react'
import { useQuery } from 'convex/react'
import { api } from '../../convex/_generated/api'
import type { FaceId, Slot } from '../types'
import { useAuction } from './auction'

export function AuctionSync() {
  const board = useQuery(api.auction.getBoard)

  useEffect(() => {
    if (!board) return
    const slots: Slot[] = board.slots.map((slot) => ({
      ...slot,
      face: slot.face as FaceId,
    }))
    useAuction.getState().setBoard({
      slots,
      events: board.events,
      raisedUsd: board.raisedUsd,
    })
  }, [board])

  return null
}
