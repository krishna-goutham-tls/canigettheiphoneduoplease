import type { Colorway } from '../../types'

export function chassisColor(color: Colorway) {
  return color === 'night' ? '#1A2432' : '#F3EFE6'
}

export function chromeColor(color: Colorway) {
  return color === 'night' ? '#C5CED8' : '#F4F0E8'
}

export function islandColor(color: Colorway) {
  return color === 'night' ? '#222A36' : '#E8E3D8'
}
