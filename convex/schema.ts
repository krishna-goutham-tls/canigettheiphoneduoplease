import { defineSchema, defineTable } from 'convex/server'
import { v } from 'convex/values'

export default defineSchema({
  slots: defineTable({
    slotId: v.string(),
    face: v.string(),
    index: v.number(),
    bidUsd: v.number(),
    holderName: v.optional(v.string()),
    holderUrl: v.optional(v.string()),
    holderLogo: v.optional(v.string()),
  }).index('by_slotId', ['slotId']),
  events: defineTable({
    slotId: v.string(),
    name: v.string(),
    amountUsd: v.number(),
    kind: v.union(v.literal('claim'), v.literal('outbid'), v.literal('raise')),
    at: v.number(),
  }),
})
