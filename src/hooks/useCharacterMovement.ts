import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import * as THREE from 'three'
import useGameStore from '../stores/useGameStore'
import useKeyboard from './useKeyboard'

interface CharacterMovementConfig {
  speed?: number
  friction?: number
  rotationSpeed?: number
}

interface UseCharacterMovementReturn {
  position: React.RefObject<THREE.Vector3>
  rotation: React.RefObject<number>
}

const useCharacterMovement = (
  config: CharacterMovementConfig = {}
): UseCharacterMovementReturn => {
  const {
    speed = 5,
    friction = 0.85,
    rotationSpeed = 10,
  } = config

  const { getMovementVector, isKeyPressed } = useKeyboard()
  const { setCharacterPosition, setCharacterRotation, setIsMoving, setIsRunning } = useGameStore()

  const position = useRef(new THREE.Vector3(0, 0, 0))
  const velocity = useRef(new THREE.Vector3(0, 0, 0))
  const rotation = useRef(0)
  const targetRotation = useRef(0)

  useFrame((_, delta) => {
    // Clamp delta to prevent large jumps
    const clampedDelta = Math.min(delta, 0.1)

    // Get input
    const input = getMovementVector()
    const isMoving = input.x !== 0 || input.z !== 0
    const isRunning = isMoving && (isKeyPressed('shift'))

    // Apply movement
    if (isMoving) {
      // Calculate target rotation based on movement direction
      targetRotation.current = Math.atan2(input.x, input.z)

      // Apply velocity (extra boost if running)
      const currentSpeed = isRunning ? speed * 1.8 : speed
      velocity.current.x += input.x * currentSpeed * clampedDelta
      velocity.current.z += input.z * currentSpeed * clampedDelta
    }

    // Apply friction
    velocity.current.x *= friction
    velocity.current.z *= friction

    // Update position
    const nextX = position.current.x + velocity.current.x * clampedDelta
    const nextZ = position.current.z + velocity.current.z * clampedDelta

    // Collision detection (Room boundaries)
    // Room is 30x30, character radius ~0.3
    const bound = 14.7 
    position.current.x = Math.max(-bound, Math.min(bound, nextX))
    position.current.z = Math.max(-bound, Math.min(bound, nextZ))

    // Smooth rotation interpolation
    if (isMoving) {
      // Calculate shortest rotation path
      let rotationDiff = targetRotation.current - rotation.current
      
      // Normalize to -PI to PI
      while (rotationDiff > Math.PI) rotationDiff -= Math.PI * 2
      while (rotationDiff < -Math.PI) rotationDiff += Math.PI * 2

      rotation.current += rotationDiff * rotationSpeed * clampedDelta
    }

    // Update store
    setCharacterPosition(position.current)
    setCharacterRotation(rotation.current)
    setIsMoving(isMoving)
    setIsRunning(isRunning)
  })

  return { position, rotation }
}

export default useCharacterMovement
