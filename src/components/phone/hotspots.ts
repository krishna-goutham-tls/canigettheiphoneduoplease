export type Hotspot = {
  id: string
  x: number
  y: number
  w: number
  h: number
  r: string
}

function icon(id: string, x: number, y: number): Hotspot {
  return { id, x, y, w: 3.82, h: 7.26, r: '22%' }
}

const COLS = [51.2, 55.5, 60.05, 64.75]
const ROWS = [36.03, 45.3, 54.2, 63.2]

export const HERO_SPOTS: Hotspot[] = [
  { id: 'widget-0', x: 31.0, y: 17.0, w: 15.4, h: 49.5, r: '7%' },
  { id: 'widget-1', x: 52.09, y: 17.88, w: 6.6, h: 16.76, r: '18%' },
  { id: 'widget-2', x: 60.01, y: 17.88, w: 6.9, h: 16.76, r: '18%' },
  ...ROWS.flatMap((y, row) => COLS.map((x, col) => icon(`grid-${row * 4 + col}`, x, y))),
]
