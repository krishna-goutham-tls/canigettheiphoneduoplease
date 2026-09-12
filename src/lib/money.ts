export const GOAL_USD = 3408
export const FLOOR_USD = 11
export const STEP_USD = 10

export function slotMult(id: string) {
  if (id === 'widget-0') return 10
  if (id === 'widget-1' || id === 'widget-2') return 5
  return 1
}

export function minBidUsd(id: string, currentUsd: number, occupied: boolean) {
  if (!occupied) return FLOOR_USD * slotMult(id)
  return currentUsd + STEP_USD
}

export function isValidBid(id: string, amountUsd: number, currentUsd: number, occupied: boolean) {
  const min = minBidUsd(id, currentUsd, occupied)
  if (amountUsd < min) return false
  return (amountUsd - min) % STEP_USD === 0
}

export function formatUsd(n: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(n)
}

export function faceLabel(face: string) {
  if (face === 'widget') return 'widgets'
  if (face === 'grid') return 'icons'
  if (face === 'dock') return 'dock'
  return face
}

export function slotShort(id: string) {
  if (id === 'widget-0') return 'big widget'
  if (id === 'widget-1') return 'widget 2'
  if (id === 'widget-2') return 'widget 3'
  const [face, index] = id.split('-')
  const n = Number(index) + 1
  if (face === 'dock') return `dock ${n}`
  if (face === 'grid') return `icon ${n}`
  return id
}
