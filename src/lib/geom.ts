import * as THREE from 'three'

export const DIM = {
  W: 8.41,
  H: 11.78,
  T: 0.48,
  R: 0.7,
  BEZEL: 0.09,
}

export function roundedRectShape(w: number, h: number, r: number) {
  const shape = new THREE.Shape()
  const x = -w / 2
  const y = -h / 2
  const rr = Math.min(r, w / 2, h / 2)
  shape.moveTo(x + rr, y)
  shape.lineTo(x + w - rr, y)
  shape.quadraticCurveTo(x + w, y, x + w, y + rr)
  shape.lineTo(x + w, y + h - rr)
  shape.quadraticCurveTo(x + w, y + h, x + w - rr, y + h)
  shape.lineTo(x + rr, y + h)
  shape.quadraticCurveTo(x, y + h, x, y + h - rr)
  shape.lineTo(x, y + rr)
  shape.quadraticCurveTo(x, y, x + rr, y)
  return shape
}

export function roundedPlane(w: number, h: number, r: number) {
  const g = new THREE.ShapeGeometry(roundedRectShape(w, h, r), 16)
  g.computeBoundingBox()
  const bb = g.boundingBox
  if (!bb) return g
  const pos = g.attributes.position
  const uv = new Float32Array(pos.count * 2)
  for (let i = 0; i < pos.count; i++) {
    uv[i * 2] = (pos.getX(i) - bb.min.x) / w
    uv[i * 2 + 1] = (pos.getY(i) - bb.min.y) / h
  }
  g.setAttribute('uv', new THREE.BufferAttribute(uv, 2))
  return g
}

export function iconGrid(w: number, h: number, yBias = -0.1) {
  const cell = Math.min(w, h) * 0.26
  const gap = cell * 0.26
  const ox = (cell + gap) / 2
  const oy = (cell + gap) / 2
  const yOff = h * yBias
  return [
    { x: -ox, y: oy + yOff, s: cell },
    { x: ox, y: oy + yOff, s: cell },
    { x: -ox, y: -oy + yOff, s: cell },
    { x: ox, y: -oy + yOff, s: cell },
  ] as const
}

export type HomeSlotLayout = {
  id: string
  panel: 'left' | 'right'
  x: number
  y: number
  w: number
  h: number
  kind: 'widget' | 'icon' | 'dock'
}

export function homeSlots(): HomeSlotLayout[] {
  const icon = 1.08
  const g = 0.28
  const items: HomeSlotLayout[] = [
    { id: 'widget-0', panel: 'left', x: 0.18, y: 0.05, w: 7.15, h: 10.15, kind: 'widget' },
    { id: 'widget-1', panel: 'right', x: -1.72, y: 3.52, w: 2.52, h: 2.18, kind: 'widget' },
    { id: 'widget-2', panel: 'right', x: 0.92, y: 3.52, w: 2.52, h: 2.18, kind: 'widget' },
  ]
  let n = 0
  for (let row = 0; row < 3; row += 1) {
    for (let col = 0; col < 3; col += 1) {
      items.push({
        id: `grid-${n}`,
        panel: 'right',
        x: -1.85 + col * (icon + g),
        y: 0.55 - row * (icon + g),
        w: icon,
        h: icon,
        kind: 'icon',
      })
      n += 1
    }
  }
  ;[1.85, 0.52, -0.81, -2.14].forEach((y, i) => {
    items.push({
      id: `dock-${i}`,
      panel: 'right',
      x: 3.14,
      y,
      w: icon,
      h: icon,
      kind: 'dock',
    })
  })
  return items
}
