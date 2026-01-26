import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import useGameStore from '../stores/useGameStore'

const useProximity = (threshold = 4) => {
  const setNearestPainting = useGameStore((state) => state.setNearestPainting)
  const lastNearestId = useRef<string | null>(null)

  useFrame(() => {
    const state = useGameStore.getState()
    const { paintings, character } = state
    const charPos = character.position

    let minDistance = Infinity
    let nearest = null

    paintings.forEach((painting) => {
      // Calculate 2D distance on XZ plane
      const dx = charPos.x - painting.position.x
      const dz = charPos.z - painting.position.z
      const distance = Math.sqrt(dx * dx + dz * dz)
      
      if (distance < threshold && distance < minDistance) {
        minDistance = distance
        nearest = painting
      }
    })

    const nearestId = nearest ? (nearest as any).id : null

    if (nearestId !== lastNearestId.current) {
      lastNearestId.current = nearestId
      setNearestPainting(nearest)
    }
  })
}

export default useProximity
