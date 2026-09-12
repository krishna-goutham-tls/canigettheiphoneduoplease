import { RoundedBox } from '@react-three/drei'
import { DIM } from '../../lib/geom'
import type { Colorway } from '../../types'
import { islandColor } from './materials'

function Lens({ x, y, z }: { x: number; y: number; z: number }) {
  return (
    <group position={[x, y, z]}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.92, 0.92, 0.05, 48]} />
        <meshPhysicalMaterial color="#C9D0D8" metalness={1} roughness={0.14} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, -0.012]}>
        <cylinderGeometry args={[0.78, 0.78, 0.04, 48]} />
        <meshPhysicalMaterial color="#0B0E12" metalness={0.96} roughness={0.06} />
      </mesh>
      <mesh rotation={[0, Math.PI, 0]} position={[0, 0, -0.03]}>
        <circleGeometry args={[0.68, 48]} />
        <meshPhysicalMaterial
          color="#121820"
          metalness={1}
          roughness={0.04}
          envMapIntensity={1.6}
          clearcoat={1}
          clearcoatRoughness={0.04}
        />
      </mesh>
      <mesh rotation={[0, Math.PI, 0]} position={[0.1, 0.08, -0.034]}>
        <circleGeometry args={[0.14, 24]} />
        <meshBasicMaterial color="#6F8498" transparent opacity={0.28} />
      </mesh>
    </group>
  )
}

export function CameraIsland({ color }: { color: Colorway }) {
  const w = 6.85
  const h = 2.36
  const d = 0.07
  const x = 0
  const y = DIM.H / 2 - 0.42 - h / 2
  const z = -DIM.T / 2 - d / 2
  const lensZ = z - d / 2 - 0.008
  return (
    <group>
      <RoundedBox args={[w, h, d]} radius={h / 2 - 0.04} smoothness={16} position={[x, y, z]} castShadow>
        <meshPhysicalMaterial
          color={islandColor(color)}
          metalness={0.72}
          roughness={0.22}
          clearcoat={0.5}
          clearcoatRoughness={0.2}
        />
      </RoundedBox>
      <Lens x={x - 1.28} y={y} z={lensZ} />
      <Lens x={x + 0.62} y={y} z={lensZ} />
      <mesh position={[x + 2.12, y + 0.34, lensZ]} rotation={[0, Math.PI, 0]}>
        <circleGeometry args={[0.08, 20]} />
        <meshStandardMaterial color="#0B0E12" metalness={0.7} roughness={0.25} />
      </mesh>
      <mesh position={[x + 2.12, y - 0.3, lensZ]} rotation={[0, Math.PI, 0]}>
        <circleGeometry args={[0.15, 24]} />
        <meshStandardMaterial color="#E8D7B0" emissive="#E8D7B0" emissiveIntensity={0.4} metalness={0.4} roughness={0.2} />
      </mesh>
    </group>
  )
}
