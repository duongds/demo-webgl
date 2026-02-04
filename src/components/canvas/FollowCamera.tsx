import { PerspectiveCamera } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useEffect, useRef } from 'react'
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
    bounds?: CameraBounds
    wallPadding?: number
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
    smoothness = 5,
    bounds = DEFAULT_BOUNDS,
}: FollowCameraProps) => {
    const cameraRef = useRef<THREE.PerspectiveCamera>(null)

    const targetPosition = useRef(new THREE.Vector3())
    const currentPosition = useRef(new THREE.Vector3(0, 4, 8))
    const lookAtTarget = useRef(new THREE.Vector3())
    const currentFov = useRef(50)
    const lastPaintingId = useRef<string | null>(null)

    // 360 Orbit State
    const mouseParams = useRef({
        yaw: 0,
        pitch: 0,
        targetYaw: 0,
        targetPitch: 0,
        distance: 7,
    })

    const isPointerDown = useRef(false)

    // Handle mouse rotation
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            const sensitivity = 0.003

            // Orbiting functionality
            if (isPointerDown.current) {
                mouseParams.current.targetYaw -= e.movementX * sensitivity
                mouseParams.current.targetPitch -= e.movementY * sensitivity

                // Limit pitch to avoid flipping
                mouseParams.current.targetPitch = Math.max(-Math.PI / 2 + 0.1, Math.min(Math.PI / 3, mouseParams.current.targetPitch))
            }
        }

        const handleMouseDown = () => { isPointerDown.current = true }
        const handleMouseUp = () => { isPointerDown.current = false }

        window.addEventListener('mousemove', handleMouseMove)
        window.addEventListener('mousedown', handleMouseDown)
        window.addEventListener('mouseup', handleMouseUp)

        return () => {
            window.removeEventListener('mousemove', handleMouseMove)
            window.removeEventListener('mousedown', handleMouseDown)
            window.removeEventListener('mouseup', handleMouseUp)
        }
    }, [])

    const clamp = (value: number, min: number, max: number): number => {
        return Math.max(min, Math.min(max, value))
    }

    useFrame((state, delta) => {
        if (!cameraRef.current) return

        const { character, selectedPainting } = useGameStore.getState()
        const characterPosition = character.position
        const clampedDelta = Math.min(delta, 0.1)

        if (selectedPainting) {
            // ZOOMED MODE: Focus on painting
            const zoomDistance = 3.5
            const offsetDir = new THREE.Vector3(0, 0, 1).applyEuler(selectedPainting.rotation)

            targetPosition.current.copy(selectedPainting.position).add(offsetDir.multiplyScalar(zoomDistance))
            targetPosition.current.y = selectedPainting.position.y
            lookAtTarget.current.copy(selectedPainting.position)

            const dist = currentPosition.current.distanceTo(targetPosition.current)
            const zoomSmoothness = smoothness * (dist > 1 ? 2.5 : 1.5)

            const targetFov = dist > 0.5 ? 55 : 45
            currentFov.current = THREE.MathUtils.lerp(currentFov.current, targetFov, clampedDelta * 4)

            currentPosition.current.lerp(targetPosition.current, zoomSmoothness * clampedDelta)

            if (lastPaintingId.current !== selectedPainting.id) {
                lastPaintingId.current = selectedPainting.id
                currentFov.current = 65
            }
        } else {
            // 360 ORBIT MODE
            if (lastPaintingId.current) {
                lastPaintingId.current = null
            }
            currentFov.current = THREE.MathUtils.lerp(currentFov.current, 50, clampedDelta * 5)

            // Smoothly interpolate rotation params
            mouseParams.current.yaw = THREE.MathUtils.lerp(mouseParams.current.yaw, mouseParams.current.targetYaw, clampedDelta * smoothness)
            mouseParams.current.pitch = THREE.MathUtils.lerp(mouseParams.current.pitch, mouseParams.current.targetPitch, clampedDelta * smoothness)

            // Calculate position on a sphere around the character
            const distance = mouseParams.current.distance
            const phi = Math.PI / 2 - mouseParams.current.pitch
            const theta = mouseParams.current.yaw

            targetPosition.current.set(
                characterPosition.x + distance * Math.sin(phi) * Math.sin(theta),
                characterPosition.y + distance * Math.cos(phi) + 2.2, // Increased offset for eye level (was 1.2)
                characterPosition.z + distance * Math.sin(phi) * Math.cos(theta)
            )

            // Constraints for room bounds (simple)
            targetPosition.current.x = clamp(targetPosition.current.x, bounds.minX, bounds.maxX)
            targetPosition.current.z = clamp(targetPosition.current.z, bounds.minZ, bounds.maxZ)

            // Smooth camera movement
            currentPosition.current.lerp(targetPosition.current, smoothness * clampedDelta)

            // Look-at target is the character
            lookAtTarget.current.set(
                characterPosition.x,
                characterPosition.y + 2, // Increased look-at height (was 1.0)
                characterPosition.z
            )
        }

        // Update camera position and FOV
        cameraRef.current.position.copy(currentPosition.current)
        cameraRef.current.fov = currentFov.current
        cameraRef.current.updateProjectionMatrix()

        // Make camera look at target
        cameraRef.current.lookAt(lookAtTarget.current)

        // Sync main camera
        state.camera.position.copy(cameraRef.current.position)
        if (state.camera instanceof THREE.PerspectiveCamera) {
            state.camera.fov = cameraRef.current.fov
            state.camera.updateProjectionMatrix()
        }
        state.camera.lookAt(lookAtTarget.current)
    })

    return (
        <PerspectiveCamera
            ref={cameraRef as any}
            makeDefault
            fov={50}
            near={0.1}
            far={1000}
        />
    )
}

export default FollowCamera
