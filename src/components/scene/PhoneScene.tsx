import { Suspense, useEffect, useRef } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import { CameraControls, ContactShadows, Environment } from '@react-three/drei'
import * as THREE from 'three'
import { DIM } from '../../lib/geom'
import { useAuction } from '../../store/auction'
import type { Pose } from '../../types'
import { IPhoneDuo } from './IPhoneDuo'

function phoneBox(pose: Pose) {
  const box = new THREE.Box3()
  if (pose === 'inner') {
    box.min.set(-DIM.W, -DIM.H / 2, -2)
    box.max.set(DIM.W, DIM.H / 2, 2)
  } else {
    box.min.set(-DIM.W / 2, -DIM.H / 2, -2)
    box.max.set(DIM.W / 2, DIM.H / 2, 2)
  }
  return box
}

function Rig() {
  const pose = useAuction((s) => s.pose)
  const controls = useRef<CameraControls>(null)
  const size = useThree((s) => s.size)
  const first = useRef(true)

  useEffect(() => {
    const cam = controls.current
    if (!cam) return
    const animate = !first.current
    first.current = false
    void cam
      .fitToBox(phoneBox(pose), animate, {
        cover: false,
        paddingTop: 2.6,
        paddingBottom: 3.2,
        paddingLeft: 2.4,
        paddingRight: 2.4,
      })
      .then(() => {
        const d = cam.distance
        cam.minDistance = d
        cam.maxDistance = d * 2.2
      })
  }, [pose, size.width, size.height])

  return (
    <CameraControls
      ref={controls}
      minDistance={14}
      maxDistance={56}
      polarRotateSpeed={0.32}
      azimuthRotateSpeed={0.4}
      truckSpeed={0}
      dollySpeed={0.3}
      minPolarAngle={Math.PI / 2 - 0.38}
      maxPolarAngle={Math.PI / 2 + 0.28}
      smoothTime={0.45}
    />
  )
}

function Lights() {
  return (
    <>
      <ambientLight intensity={0.85} />
      <directionalLight position={[5, 12, 10]} intensity={1.7} color="#ffffff" castShadow />
      <directionalLight position={[-6, 6, 8]} intensity={0.55} color="#f2f4f8" />
      <Environment preset="studio" environmentIntensity={0.55} />
    </>
  )
}

export function PhoneScene() {
  return (
    <Canvas
      className="h-full w-full touch-none"
      camera={{ position: [0, 0.4, 36], fov: 32, near: 0.1, far: 160 }}
      shadows
      dpr={[1, 1.75]}
      gl={{
        antialias: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.08,
        alpha: true,
      }}
    >
      <color attach="background" args={['#ffffff']} />
      <Suspense fallback={null}>
        <Lights />
        <IPhoneDuo />
        <ContactShadows position={[0, -7.8, 0]} opacity={0.16} scale={28} blur={3.2} far={16} color="#1d1d1f" />
        <Rig />
      </Suspense>
    </Canvas>
  )
}
