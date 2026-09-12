import { RoundedBox } from '@react-three/drei'
import { DIM, homeSlots } from '../../lib/geom'
import { SlotBadge } from './SlotBadge'

export function HomeSlots({ panel }: { panel: 'left' | 'right' }) {
  const z = DIM.T / 2 + 0.036
  const items = homeSlots().filter((s) => s.panel === panel)
  return (
    <group>
      {panel === 'right' ? (
        <RoundedBox args={[1.42, 5.85, 0.03]} radius={0.7} smoothness={8} position={[3.14, -0.14, z - 0.02]}>
          <meshPhysicalMaterial
            color="#f4f4f6"
            transparent
            opacity={0.55}
            roughness={0.2}
            metalness={0.05}
          />
        </RoundedBox>
      ) : null}
      {items.map((s) => (
        <SlotBadge key={s.id} id={s.id} x={s.x} y={s.y} w={s.w} h={s.h} z={z} kind={s.kind} />
      ))}
    </group>
  )
}
