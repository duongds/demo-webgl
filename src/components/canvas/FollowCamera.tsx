import { PerspectiveCamera } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import * as THREE from 'three'
import useGameStore from '../../stores/useGameStore'

interface FollowCameraProps {
    offset?: [number, number, number]
    lookAtOffset?: [number, number, number]
    smoothness?: number
}

const FollowCamera = ({
    offset = [0, 4, 8],
    lookAtOffset = [0, 0, 0],
    smoothness = 5,
}: FollowCameraProps) => {
    const cameraRef = useRef<THREE.PerspectiveCamera>(null)

    const targetPosition = useRef(new THREE.Vector3())
    const currentPosition = useRef(new THREE.Vector3(offset[0], offset[1], offset[2]))
    const lookAtTarget = useRef(new THREE.Vector3())

    useFrame((state, delta) => {
        if (!cameraRef.current) return

        // Get latest character position from store directly to avoid stale closures
        const characterPosition = useGameStore.getState().character.position

        const clampedDelta = Math.min(delta, 0.1)

        // Calculate target camera position (character position + offset)
        targetPosition.current.set(
            characterPosition.x + offset[0],
            characterPosition.y + offset[1],
            characterPosition.z + offset[2]
        )

        // Smooth camera movement using lerp
        currentPosition.current.lerp(targetPosition.current, smoothness * clampedDelta)

        // Update camera position
        cameraRef.current.position.copy(currentPosition.current)

        // Calculate look-at target
        lookAtTarget.current.set(
            characterPosition.x + lookAtOffset[0],
            characterPosition.y + lookAtOffset[1],
            characterPosition.z + lookAtOffset[2]
        )

        // Make camera look at character
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
