import { useMemo, useState } from 'react'
import * as THREE from 'three'
import { useCursor } from '@react-three/drei'
import { useAuction } from '../../store/auction'
import { roundedPlane } from '../../lib/geom'

const FACE = '-apple-system, BlinkMacSystemFont, Helvetica, sans-serif'

const SKINS: Record<string, string> = {
  'grid-0': '#30D158',
  'grid-1': '#FF453A',
  'grid-2': '#0A84FF',
  'grid-3': '#FF9F0A',
  'grid-4': '#64D2FF',
  'grid-5': '#BF5AF2',
  'grid-6': '#FF375F',
  'grid-7': '#AC8E68',
  'grid-8': '#8E8E93',
  'dock-0': '#0A84FF',
  'dock-1': '#30D158',
  'dock-2': '#FF9F0A',
  'dock-3': '#FF453A',
  'widget-1': '#5AC8F5',
  'widget-2': '#E7E2D6',
}

function squircle(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath()
  ctx.roundRect(x, y, w, h, r)
}

function makeIconMap(id: string) {
  const c = document.createElement('canvas')
  c.width = 256
  c.height = 256
  const ctx = c.getContext('2d')
  if (!ctx) return new THREE.CanvasTexture(c)
  const bg = SKINS[id] ?? '#0A84FF'
  squircle(ctx, 8, 8, 240, 240, 56)
  ctx.fillStyle = bg
  ctx.fill()
  ctx.fillStyle = 'rgba(255,255,255,0.92)'
  ctx.beginPath()
  ctx.arc(128, 118, 28, 0, Math.PI * 2)
  ctx.fill()
  ctx.fillStyle = 'rgba(255,255,255,0.35)'
  ctx.beginPath()
  ctx.roundRect(86, 168, 84, 18, 9)
  ctx.fill()
  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.anisotropy = 8
  return tex
}

function makeWidgetMap(id: string) {
  const c = document.createElement('canvas')
  c.width = 512
  c.height = id === 'widget-0' ? 720 : 360
  const ctx = c.getContext('2d')
  if (!ctx) return new THREE.CanvasTexture(c)
  const r = 48
  squircle(ctx, 8, 8, c.width - 16, c.height - 16, r)
  if (id === 'widget-0') {
    const g = ctx.createLinearGradient(0, 0, 0, c.height)
    g.addColorStop(0, '#7EA4C8')
    g.addColorStop(1, '#C9B89A')
    ctx.fillStyle = g
    ctx.fill()
    ctx.fillStyle = 'rgba(255,255,255,0.92)'
    ctx.font = `600 36px ${FACE}`
    ctx.fillText('Photo', 36, 70)
    ctx.font = `400 22px ${FACE}`
    ctx.fillStyle = 'rgba(255,255,255,0.7)'
    ctx.fillText('Your ad lives here.', 36, 108)
  } else if (id === 'widget-1') {
    ctx.fillStyle = '#5AC8F5'
    ctx.fill()
    ctx.fillStyle = '#fff'
    ctx.font = `500 28px ${FACE}`
    ctx.fillText('12°', 36, 86)
    ctx.font = `400 18px ${FACE}`
    ctx.fillText('Clear', 36, 118)
  } else {
    ctx.fillStyle = '#E7E2D6'
    ctx.fill()
    ctx.fillStyle = '#1D1D1F'
    ctx.font = `500 22px ${FACE}`
    ctx.fillText('Map', 36, 80)
    ctx.fillStyle = '#0A84FF'
    ctx.beginPath()
    ctx.arc(c.width * 0.62, c.height * 0.55, 14, 0, Math.PI * 2)
    ctx.fill()
  }
  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.anisotropy = 8
  return tex
}

const loader = new THREE.TextureLoader()
const texCache = new Map<string, THREE.Texture>()

function useLogoTexture(url: string | null) {
  return useMemo(() => {
    if (!url) return null
    const hit = texCache.get(url)
    if (hit) return hit
    const tex = loader.load(url)
    tex.colorSpace = THREE.SRGBColorSpace
    tex.anisotropy = 8
    texCache.set(url, tex)
    return tex
  }, [url])
}

type Props = {
  id: string
  x: number
  y: number
  w: number
  h: number
  z: number
  kind: 'widget' | 'icon' | 'dock'
}

export function SlotBadge({ id, x, y, w, h, z, kind }: Props) {
  const slot = useAuction((st) => st.slots.find((item) => item.id === id))
  const hoveredId = useAuction((st) => st.hoveredId)
  const inspect = useAuction((st) => st.inspect)
  const hover = useAuction((st) => st.hover)
  const occupied = Boolean(slot?.holder)
  const [over, setOver] = useState(false)
  useCursor(over)
  const emptyMap = useMemo(
    () => (kind === 'widget' ? makeWidgetMap(id) : makeIconMap(id)),
    [id, kind],
  )
  const logoMap = useLogoTexture(slot?.holder?.logoDataUrl ?? null)
  const radius = kind === 'widget' ? Math.min(w, h) * 0.12 : Math.min(w, h) * 0.31
  const geom = useMemo(() => roundedPlane(w, h, radius), [w, h, radius])
  const scale = over || hoveredId === id ? 1.06 : 1

  if (!slot) return null

  return (
    <group position={[x, y, z]} scale={scale}>
      <mesh
        geometry={geom}
        onPointerOver={(e) => {
          e.stopPropagation()
          setOver(true)
          hover(id)
        }}
        onPointerOut={() => {
          setOver(false)
          hover(null)
        }}
        onClick={(e) => {
          e.stopPropagation()
          inspect(id)
        }}
      >
        <meshPhysicalMaterial
          map={occupied ? logoMap : emptyMap}
          roughness={0.32}
          metalness={0.06}
          clearcoat={0.55}
          clearcoatRoughness={0.22}
        />
      </mesh>
    </group>
  )
}
