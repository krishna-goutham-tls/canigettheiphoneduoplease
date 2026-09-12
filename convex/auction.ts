import { mutation, query } from './_generated/server'
import { v } from 'convex/values'
import { SLOT_IDS, STEP_USD, faceFromId, minBidUsd } from './rules'

export const getBoard = query({
  args: {},
  handler: async (ctx) => {
    const rows = await ctx.db.query('slots').collect()
    const byId = new Map(rows.map((row) => [row.slotId, row]))
    const slots = SLOT_IDS.map((id) => {
      const row = byId.get(id)
      if (!row) {
        return {
          id,
          face: faceFromId(id),
          index: Number(id.split('-')[1]),
          bidUsd: 0,
          holder: null as null,
        }
      }
      return {
        id: row.slotId,
        face: row.face,
        index: row.index,
        bidUsd: row.bidUsd,
        holder: row.holderName
          ? {
              name: row.holderName,
              url: row.holderUrl ?? '',
              logoDataUrl: row.holderLogo ?? '',
            }
          : null,
      }
    })
    const eventRows = await ctx.db.query('events').order('desc').take(80)
    const events = eventRows.map((row) => ({
      id: row._id,
      at: row.at,
      slotId: row.slotId,
      name: row.name,
      amountUsd: row.amountUsd,
      kind: row.kind,
    }))
    const raisedUsd = eventRows.reduce((sum, row) => sum + row.amountUsd, 0)
    return { slots, events, raisedUsd }
  },
})

export const placeBid = mutation({
  args: {
    slotId: v.string(),
    name: v.string(),
    url: v.string(),
    logoDataUrl: v.string(),
    amountUsd: v.number(),
  },
  handler: async (ctx, args) => {
    if (!SLOT_IDS.includes(args.slotId)) {
      return { ok: false as const, error: 'That slot is gone.' }
    }
    const name = args.name.trim()
    const url = args.url.trim()
    if (!name) return { ok: false as const, error: 'Name the brand.' }
    if (!url) return { ok: false as const, error: 'Add a URL.' }
    if (!args.logoDataUrl) return { ok: false as const, error: 'Add a square logo.' }

    const existing = await ctx.db
      .query('slots')
      .withIndex('by_slotId', (q) => q.eq('slotId', args.slotId))
      .unique()
    const bidUsd = existing?.bidUsd ?? 0
    const occupied = Boolean(existing?.holderName)
    const min = minBidUsd(args.slotId, bidUsd, occupied)
    if (args.amountUsd < min || (args.amountUsd - min) % STEP_USD !== 0) {
      return { ok: false as const, error: `Bid $${min} or more, in $${STEP_USD} steps.` }
    }

    const sameHolder =
      occupied &&
      existing?.holderName &&
      existing.holderName.trim().toLowerCase() === name.toLowerCase()
    const kind = !occupied ? 'claim' : sameHolder ? 'raise' : 'outbid'
    const charged = sameHolder ? args.amountUsd - bidUsd : args.amountUsd

    const slotDoc = {
      slotId: args.slotId,
      face: faceFromId(args.slotId),
      index: Number(args.slotId.split('-')[1]),
      bidUsd: args.amountUsd,
      holderName: name,
      holderUrl: url,
      holderLogo: args.logoDataUrl,
    }
    if (existing) {
      await ctx.db.patch(existing._id, slotDoc)
    } else {
      await ctx.db.insert('slots', slotDoc)
    }

    await ctx.db.insert('events', {
      slotId: args.slotId,
      name,
      amountUsd: charged,
      kind,
      at: Date.now(),
    })

    return { ok: true as const }
  },
})
