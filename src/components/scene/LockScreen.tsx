import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import { roundedPlane, DIM } from '../../lib/geom'

type Props = {
  z: number
  rotation: [number, number, number]
}

const FACE =
  '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", Helvetica, sans-serif'

export function LockScreen({ z, rotation }: Props) {
  const wallpaper = useTexture('/wallpaper.jpg')
  wallpaper.colorSpace = THREE.SRGBColorSpace
  const canvas = useMemo(() => {
    const c = document.createElement('canvas')
    c.width = 1024
    c.height = 1480
    return c
  }, [])
  const texture = useMemo(() => {
    const tex = new THREE.CanvasTexture(canvas)
    tex.colorSpace = THREE.SRGBColorSpace
    tex.premultiplyAlpha = true
    return tex
  }, [canvas])
  const lastMin = useRef(-1)

  const draw = useMemo(() => {
    return () => {
      const ctx = canvas.getContext('2d')
      if (!ctx) return
      ctx.clearRect(0, 0, 1024, 1480)
      const g = ctx.createLinearGradient(0, 0, 0, 520)
      g.addColorStop(0, 'rgba(0,0,0,0.28)')
      g.addColorStop(1, 'rgba(0,0,0,0)')
      ctx.fillStyle = g
      ctx.fillRect(0, 0, 1024, 520)
      const now = new Date()
      const time = now.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: false,
      })
      const date = now.toLocaleDateString('en-US', {
        weekday: 'long',
        day: 'numeric',
        month: 'short',
      })
      ctx.fillStyle = 'rgba(255,255,255,0.86)'
      ctx.font = `500 38px ${FACE}`
      ctx.textAlign = 'center'
      ctx.fillText(date, 512, 220)
      ctx.fillStyle = '#F5F5F7'
      ctx.font = `300 176px ${FACE}`
      ctx.fillText(time, 512, 410)
      texture.needsUpdate = true
    }
  }, [canvas, texture])

  useEffect(() => {
    draw()
  }, [draw])

  useFrame(() => {
    const m = new Date().getMinutes()
    if (m !== lastMin.current) {
      lastMin.current = m
      draw()
    }
  })

  const geom = useMemo(
    () => roundedPlane(DIM.W - DIM.BEZEL * 2, DIM.H - DIM.BEZEL * 2, DIM.R - 0.1),
    [],
  )

  return (
    <group position={[0, 0, z]} rotation={rotation}>
      <mesh geometry={geom} position={[0, 0, -0.004]}>
        <meshStandardMaterial map={wallpaper} roughness={0.28} metalness={0.04} color="#d5dde6" />
      </mesh>
      <mesh geometry={geom}>
        <meshBasicMaterial map={texture} transparent depthWrite={false} />
      </mesh>
    </group>
  )
}
