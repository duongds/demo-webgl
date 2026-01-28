import { PerspectiveCamera } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import * as THREE from 'three'
import useGameStore from '../../stores/useGameStore'

interface CameraBounds {
    minX: number
    maxX: number
    minY: number
    maxY: number
    minZ: number
    maxZ: number
}

interface FollowCameraProps {
    offset?: [number, number, number]
    lookAtOffset?: [number, number, number]
    smoothness?: number
    /** Room boundaries - camera will be constrained within these limits */
    bounds?: CameraBounds
    /** Distance from wall at which camera starts adjusting */
    wallPadding?: number
    /** Enable dynamic height adjustment when near walls */
    enableDynamicHeight?: boolean
}

const DEFAULT_BOUNDS: CameraBounds = {
    minX: -14,
    maxX: 14,
    minY: 2,
    maxY: 7.5,
    minZ: -14,
    maxZ: 14,
}

const FollowCamera = ({
    offset = [0, 4, 8],
    lookAtOffset = [0, 0, 0],
    smoothness = 5,
    bounds = DEFAULT_BOUNDS,
    wallPadding = 3,
    enableDynamicHeight = true,
}: FollowCameraProps) => {
    const cameraRef = useRef<THREE.PerspectiveCamera>(null)

    const targetPosition = useRef(new THREE.Vector3())
    const currentPosition = useRef(new THREE.Vector3(offset[0], offset[1], offset[2]))
    const lookAtTarget = useRef(new THREE.Vector3())
    const adjustedOffset = useRef(new THREE.Vector3(offset[0], offset[1], offset[2]))

    /**
     * Clamp a value within min/max bounds
     */
    const clamp = (value: number, min: number, max: number): number => {
        return Math.max(min, Math.min(max, value))
    }

    /**
     * Calculate proximity factor (0-1) based on distance to wall
     * 0 = far from wall, 1 = at wall edge
     */
    const getWallProximity = (pos: number, min: number, max: number): number => {
        const distToMin = pos - min
        const distToMax = max - pos
        const closestDist = Math.min(distToMin, distToMax)

        if (closestDist >= wallPadding) return 0
        return 1 - (closestDist / wallPadding)
    }

    /**
     * Adjust camera offset based on room constraints
     * - Reduces Z offset when near back wall to prevent clipping
     * - Adjusts height when constrained
     */
    const calculateConstrainedOffset = (charPos: THREE.Vector3): THREE.Vector3 => {
        let adjustedX = offset[0]
        let adjustedY = offset[1]
        let adjustedZ = offset[2]

        // Check if camera would go beyond back wall (positive Z)
        const projectedZ = charPos.z + offset[2]
        if (projectedZ > bounds.maxZ - 1) {
            // Reduce Z offset progressively
            const overflow = projectedZ - (bounds.maxZ - 1)
            adjustedZ = offset[2] - overflow * 0.8
            adjustedZ = Math.max(adjustedZ, 2) // Minimum Z offset

            // Compensate with height when pulling camera closer
            if (enableDynamicHeight) {
                const compressionFactor = 1 - (adjustedZ / offset[2])
                adjustedY = offset[1] + compressionFactor * 2
            }
        }

        // Check front wall (negative Z)
        const projectedFrontZ = charPos.z + (adjustedZ < 0 ? adjustedZ : -2)
        if (projectedFrontZ < bounds.minZ + 1) {
            // Character is near front wall, camera behind
            adjustedZ = Math.max(adjustedZ, bounds.minZ + 1 - charPos.z + 2)
        }

        // Check side walls and adjust X
        const projectedX = charPos.x + offset[0]
        if (projectedX < bounds.minX + 1) {
            adjustedX = bounds.minX + 1 - charPos.x
        } else if (projectedX > bounds.maxX - 1) {
            adjustedX = bounds.maxX - 1 - charPos.x
        }

        // Dynamic height based on wall proximity
        if (enableDynamicHeight) {
            const xProximity = getWallProximity(charPos.x, bounds.minX, bounds.maxX)
            const zProximity = getWallProximity(charPos.z, bounds.minZ, bounds.maxZ)
            const maxProximity = Math.max(xProximity, zProximity)

            // Increase height when near walls for better visibility
            adjustedY += maxProximity * 1.5
        }

        // Clamp final height
        adjustedY = clamp(adjustedY, bounds.minY, bounds.maxY)

        return new THREE.Vector3(adjustedX, adjustedY, adjustedZ)
    }

    useFrame((state, delta) => {
        if (!cameraRef.current) return

        // Get latest character position and selected painting from store
        const { character, selectedPainting } = useGameStore.getState()
        const characterPosition = character.position
        const clampedDelta = Math.min(delta, 0.1)

        if (selectedPainting) {
            // ZOOMED MODE: Focus on painting
            // Calculate a position in front of the painting
            const zoomDistance = 3.5
            // Create a vector pointing outward from the painting's surface
            const offsetDir = new THREE.Vector3(0, 0, 1).applyEuler(selectedPainting.rotation)

            targetPosition.current.copy(selectedPainting.position).add(offsetDir.multiplyScalar(zoomDistance))
            // Ensure camera is at a good height
            targetPosition.current.y = selectedPainting.position.y

            lookAtTarget.current.copy(selectedPainting.position)

            // Speed up movement during zoom for snappiness
            const zoomSmoothness = smoothness * 1.5
            currentPosition.current.lerp(targetPosition.current, zoomSmoothness * clampedDelta)
        } else {
            // NORMAL MODE: Follow character

            // Calculate constrained offset based on character position
            const newOffset = calculateConstrainedOffset(characterPosition)

            // Smooth the offset changes for fluid camera movement
            adjustedOffset.current.lerp(newOffset, smoothness * clampedDelta * 0.5)

            // Calculate target camera position (character position + constrained offset)
            targetPosition.current.set(
                characterPosition.x + adjustedOffset.current.x,
                characterPosition.y + adjustedOffset.current.y,
                characterPosition.z + adjustedOffset.current.z
            )

            // Apply final boundary constraints to target position
            targetPosition.current.x = clamp(targetPosition.current.x, bounds.minX, bounds.maxX)
            targetPosition.current.y = clamp(targetPosition.current.y, bounds.minY, bounds.maxY)
            targetPosition.current.z = clamp(targetPosition.current.z, bounds.minZ, bounds.maxZ)

            // Smooth camera movement using lerp
            currentPosition.current.lerp(targetPosition.current, smoothness * clampedDelta)

            // Calculate look-at target (always follows character)
            lookAtTarget.current.set(
                characterPosition.x + lookAtOffset[0],
                characterPosition.y + lookAtOffset[1],
                characterPosition.z + lookAtOffset[2]
            )
        }

        // Update camera position
        cameraRef.current.position.copy(currentPosition.current)

        // Make camera look at target
        cameraRef.current.lookAt(lookAtTarget.current)

        // Sync main camera
        state.camera.position.copy(cameraRef.current.position)
        state.camera.lookAt(lookAtTarget.current)
    })

    return (
        <PerspectiveCamera
            ref={cameraRef as any}
            makeDefault
            fov={50}
            near={0.1}
            far={1000}
            position={[offset[0], offset[1], offset[2]]}
        />
    )
}

export default FollowCamera
