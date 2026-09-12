export const SLOT_IDS = [
  'widget-0',
  'widget-1',
  'widget-2',
  ...Array.from({ length: 16 }, (_, i) => `grid-${i}`),
]

export const FLOOR_USD = 11
export const STEP_USD = 10

export function slotMult(id: string) {
  if (id === 'widget-0') return 10
  if (id === 'widget-1' || id === 'widget-2') return 5
  return 1
}

export function faceFromId(id: string) {
  if (id.startsWith('widget-')) return 'widget'
  return 'grid'
}

export function minBidUsd(id: string, currentUsd: number, occupied: boolean) {
  if (!occupied) return FLOOR_USD * slotMult(id)
  return currentUsd + STEP_USD
}
