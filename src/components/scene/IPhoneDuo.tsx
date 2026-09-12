import { a, useSpring } from '@react-spring/three'
import { RoundedBox } from '@react-three/drei'
import { DIM } from '../../lib/geom'
import { useAuction } from '../../store/auction'
import type { Colorway } from '../../types'
import { CameraIsland } from './CameraIsland'
import { HomeSlots } from './HomeSlots'
import { InnerScreen } from './InnerScreen'
import { LockScreen } from './LockScreen'
import { chassisColor, chromeColor } from './materials'

function BodyMat({ color }: { color: Colorway }) {
  return (
    <meshPhysicalMaterial
      color={chassisColor(color)}
      metalness={0.62}
      roughness={0.22}
      clearcoat={0.7}
      clearcoatRoughness={0.16}
      envMapIntensity={1.05}
    />
  )
}

function SideButton({
  position,
  args,
  color,
}: {
  position: [number, number, number]
  args: [number, number, number]
  color: Colorway
}) {
  return (
    <RoundedBox args={args} radius={0.04} smoothness={4} position={position} castShadow>
      <meshPhysicalMaterial color={chromeColor(color)} metalness={0.95} roughness={0.16} />
    </RoundedBox>
  )
}

function CoverPanel({ color }: { color: Colorway }) {
  return (
    <group>
      <RoundedBox args={[DIM.W, DIM.H, DIM.T]} radius={DIM.R} smoothness={12} castShadow receiveShadow>
        <BodyMat color={color} />
      </RoundedBox>
      <LockScreen z={-DIM.T / 2 - 0.014} rotation={[0, Math.PI, 0]} />
      <InnerScreen z={DIM.T / 2 + 0.014} nudgeX={DIM.BEZEL / 2} />
      <HomeSlots panel="left" />
      <SideButton position={[-DIM.W / 2 - 0.04, 2.1, 0]} args={[0.07, 1.15, 0.22]} color={color} />
      <SideButton position={[-DIM.W / 2 - 0.04, 0.7, 0]} args={[0.07, 0.7, 0.22]} color={color} />
    </group>
  )
}

function BackPanel({ color }: { color: Colorway }) {
  return (
    <group>
      <RoundedBox args={[DIM.W, DIM.H, DIM.T]} radius={DIM.R} smoothness={12} castShadow receiveShadow>
        <BodyMat color={color} />
      </RoundedBox>
      <InnerScreen z={DIM.T / 2 + 0.014} nudgeX={-DIM.BEZEL / 2} showStatus />
      <HomeSlots panel="right" />
      <CameraIsland color={color} />
      <SideButton position={[DIM.W / 2 + 0.04, 1.6, 0]} args={[0.08, 1.35, 0.28]} color={color} />
    </group>
  )
}

function Hinge({ color }: { color: Colorway }) {
  return (
    <RoundedBox args={[0.08, DIM.H * 0.94, DIM.T * 0.7]} radius={0.035} smoothness={4} castShadow>
      <meshPhysicalMaterial color={chassisColor(color)} metalness={0.9} roughness={0.16} />
    </RoundedBox>
  )
}

export function IPhoneDuo() {
  const pose = useAuction((s) => s.pose)
  const color = useAuction((s) => s.color)
  const openTarget = pose === 'inner' ? 0.9 : 0
  const rotYTarget = pose === 'back' ? Math.PI : 0
  const { fold, rotY, rotX } = useSpring({
    fold: openTarget,
    rotY: rotYTarget,
    rotX: 0,
    config: { duration: 2000, easing: (t: number) => 0.5 - Math.cos(Math.PI * t) / 2 },
  })

  return (
    <a.group rotation-y={rotY} rotation-x={rotX}>
      <a.group position-x={fold.to((o) => (-(1 - o) * DIM.W) / 2)}>
        <Hinge color={color} />
        <a.group
          rotation-y={fold.to((o) => -(1 - o) * Math.PI)}
          position-z={fold.to((o) => (1 - o) * DIM.T * 0.55)}
        >
          <group position={[-DIM.W / 2 + 0.07, 0, 0]}>
            <CoverPanel color={color} />
          </group>
        </a.group>
        <a.group position-x={DIM.W / 2 - 0.07} position-z={fold.to((o) => -(1 - o) * DIM.T * 0.55)}>
          <BackPanel color={color} />
        </a.group>
      </a.group>
    </a.group>
  )
}
