import { useEffect, useMemo } from 'react'
import { useTexture } from '@react-three/drei'
import * as THREE from 'three'
import { roundedPlane, DIM } from '../../lib/geom'

type Props = {
  z: number
  nudgeX?: number
  showStatus?: boolean
}

const FACE = '-apple-system, BlinkMacSystemFont, Helvetica, sans-serif'

export function InnerScreen({ z, nudgeX = 0, showStatus = false }: Props) {
  const wallpaper = useTexture('/wallpaper.jpg')
  wallpaper.colorSpace = THREE.SRGBColorSpace
  const w = DIM.W - DIM.BEZEL - 0.04
  const h = DIM.H - DIM.BEZEL * 2
  const geom = useMemo(() => roundedPlane(w, h, DIM.R - 0.12), [w, h])
  const canvas = useMemo(() => {
    const c = document.createElement('canvas')
    c.width = 1024
    c.height = 1480
    return c
  }, [])
  const overlay = useMemo(() => {
    const tex = new THREE.CanvasTexture(canvas)
    tex.colorSpace = THREE.SRGBColorSpace
    tex.premultiplyAlpha = true
    return tex
  }, [canvas])

  useEffect(() => {
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.clearRect(0, 0, 1024, 1480)
    if (!showStatus) {
      overlay.needsUpdate = true
      return
    }
    const now = new Date()
    const time = now.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: false,
    })
    ctx.fillStyle = 'rgba(255,255,255,0.92)'
    ctx.font = `500 34px ${FACE}`
    ctx.textAlign = 'right'
    ctx.fillText(time, 980, 70)
    overlay.needsUpdate = true
  }, [canvas, overlay, showStatus])

  return (
    <group position={[nudgeX, 0, z]}>
      <mesh geometry={geom}>
        <meshStandardMaterial map={wallpaper} roughness={0.26} metalness={0.04} color="#d9dee6" />
      </mesh>
      {showStatus ? (
        <mesh geometry={geom} position={[0, 0, 0.002]}>
          <meshBasicMaterial map={overlay} transparent depthWrite={false} />
        </mesh>
      ) : null}
    </group>
  )
}
