import { PerspectiveCamera } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import * as THREE from 'three'

interface ScrollCameraProps {
    scrollProgress: number
}

/**
 * ScrollCamera - Camera that follows a path based on scroll progress
 * Creates cinematic camera movement through the scene
 */
const ScrollCamera = ({ scrollProgress }: ScrollCameraProps) => {
    const cameraRef = useRef<THREE.PerspectiveCamera>(null)
    const currentPosition = useRef(new THREE.Vector3(0, 15, 30))
    const currentLookAt = useRef(new THREE.Vector3(0, 0, 0))

    useFrame((state, delta) => {
        if (!cameraRef.current) return

        // Define camera path keyframes based on scroll progress
        const keyframes = [
            { progress: 0, pos: [0, 15, 30], lookAt: [0, 0, 0], fov: 60 },
            { progress: 0.2, pos: [0, 8, 20], lookAt: [0, 2, 0], fov: 55 },
            { progress: 0.4, pos: [-10, 5, 15], lookAt: [0, 3, 0], fov: 50 },
            { progress: 0.6, pos: [10, 6, 12], lookAt: [0, 2, 0], fov: 45 },
            { progress: 0.8, pos: [0, 4, 10], lookAt: [0, 3, 0], fov: 50 },
            { progress: 1.0, pos: [0, 5, 8], lookAt: [0, 2, 0], fov: 55 },
        ]

        // Find the two keyframes we're between
        let startFrame = keyframes[0]
        let endFrame = keyframes[1]

        for (let i = 0; i < keyframes.length - 1; i++) {
            if (scrollProgress >= keyframes[i].progress && scrollProgress <= keyframes[i + 1].progress) {
                startFrame = keyframes[i]
                endFrame = keyframes[i + 1]
                break
            }
        }

        // Calculate local progress between keyframes
        const range = endFrame.progress - startFrame.progress
        const localProgress = range > 0
            ? (scrollProgress - startFrame.progress) / range
            : 0

        // Smooth easing
        const eased = easeInOutCubic(localProgress)

        // Interpolate position
        const targetPos = new THREE.Vector3(
            THREE.MathUtils.lerp(startFrame.pos[0], endFrame.pos[0], eased),
            THREE.MathUtils.lerp(startFrame.pos[1], endFrame.pos[1], eased),
            THREE.MathUtils.lerp(startFrame.pos[2], endFrame.pos[2], eased)
        )

        // Interpolate look-at target
        const targetLookAt = new THREE.Vector3(
            THREE.MathUtils.lerp(startFrame.lookAt[0], endFrame.lookAt[0], eased),
            THREE.MathUtils.lerp(startFrame.lookAt[1], endFrame.lookAt[1], eased),
            THREE.MathUtils.lerp(startFrame.lookAt[2], endFrame.lookAt[2], eased)
        )

        // Interpolate FOV
        const targetFov = THREE.MathUtils.lerp(startFrame.fov, endFrame.fov, eased)

        // Smooth camera movement
        const smoothness = 5
        currentPosition.current.lerp(targetPos, delta * smoothness)
        currentLookAt.current.lerp(targetLookAt, delta * smoothness)

        // Apply to camera
        cameraRef.current.position.copy(currentPosition.current)
        cameraRef.current.lookAt(currentLookAt.current)
        cameraRef.current.fov = THREE.MathUtils.lerp(cameraRef.current.fov, targetFov, delta * 3)
        cameraRef.current.updateProjectionMatrix()

        // Sync with R3F camera
        state.camera.position.copy(cameraRef.current.position)
        state.camera.lookAt(currentLookAt.current)
        if (state.camera instanceof THREE.PerspectiveCamera) {
            state.camera.fov = cameraRef.current.fov
            state.camera.updateProjectionMatrix()
        }
    })

    return (
        <PerspectiveCamera
            ref={cameraRef as any}
            makeDefault
            fov={60}
            near={0.1}
            far={200}
            position={[0, 15, 30]}
        />
    )
}

// Easing function for smooth camera movement
function easeInOutCubic(t: number): number {
    return t < 0.5
        ? 4 * t * t * t
        : 1 - Math.pow(-2 * t + 2, 3) / 2
}

export default ScrollCamera
