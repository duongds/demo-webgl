import { useAnimations, useGLTF } from '@react-three/drei'
import { useFrame, useGraph } from '@react-three/fiber'
import { useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import { SkeletonUtils } from 'three-stdlib'
import useGameStore from '../../stores/useGameStore'

interface GLBCharacterProps {
    modelPath: string
    scale?: number
    rotationOffset?: number // Y-axis rotation correction in radians
    shadowSize?: number
    verticalOffset?: number // Additional vertical shift
}

const GLBCharacterModel = ({
    modelPath,
    scale = 1.0,
    rotationOffset = 0,
    shadowSize = 0.5,
    verticalOffset = 0
}: GLBCharacterProps) => {
    const group = useRef<THREE.Group>(null)
    const shadowRef = useRef<THREE.Mesh>(null)

    // Load GLTF
    const { scene, animations } = useGLTF(modelPath)

    // Clone scene to avoid shared state issues if multiple instances are used
    // Clone scene to avoid shared state issues if multiple instances are used
    const clone = useMemo(() => SkeletonUtils.clone(scene), [scene])
    useGraph(clone)

    // Animation bindings
    const { actions, names } = useAnimations(animations, group)

    // State from store
    const isMoving = useGameStore((state) => state.character.isMoving)
    const isRunning = useGameStore((state) => state.character.isRunning)

    // Vertical offset to ensure feet touch the ground
    const [yOffset, setYOffset] = useState(0)

    // Calculate bounding box and offset on mount
    useEffect(() => {
        if (!clone) return

        // Reset position to calculate bounds correctly
        clone.position.set(0, 0, 0)
        clone.rotation.set(0, 0, 0)
        clone.scale.setScalar(scale)
        clone.updateMatrixWorld(true)

        const box = new THREE.Box3().setFromObject(clone)
        const minY = box.min.y

        // We want the lowest point (minY) to be at y=0 (floor)
        // If minY is -0.5, we need to move up by +0.5.
        // So offset = -minY
        setYOffset(-minY)

        // Log animations for debugging
        console.log(`Animations for ${modelPath}:`, names)

    }, [clone, scale, modelPath, names])

    // Animation Logic
    useEffect(() => {
        if (names.length === 0) return

        // Robust animation search - prioritize keywords order
        const findAnim = (keywords: string[]) => {
            for (const keyword of keywords) {
                const match = names.find(n => n.toLowerCase().includes(keyword))
                if (match) return match
            }
            return null
        }

        const idleAnim = findAnim(['idle', 'stand', 'wait', 'stop']) || names[0]
        const walkAnim = findAnim(['walk', 'run', 'move', 'jog']) || (names.length > 1 ? names[1] : names[0])

        // Default crossfade duration
        const fadeDuration = 0.2

        if (isMoving) {
            if (actions[idleAnim]) actions[idleAnim].fadeOut(fadeDuration)

            if (actions[walkAnim]) {
                const action = actions[walkAnim]
                action.reset().fadeIn(fadeDuration).play()
                action.timeScale = isRunning ? 1.5 : 1.0
            }
        } else {
            if (actions[walkAnim]) actions[walkAnim].fadeOut(fadeDuration)

            if (actions[idleAnim]) {
                const action = actions[idleAnim]
                action.reset().fadeIn(fadeDuration).play()
            }
        }
    }, [isMoving, isRunning, actions, names])

    useFrame((state) => {
        if (!group.current) return
        const time = state.clock.elapsedTime

        // Fallback procedural animation if no animations found
        if (names.length === 0) {
            if (isMoving) {
                const speed = isRunning ? 15 : 10
                group.current.position.y = yOffset + verticalOffset + Math.abs(Math.sin(time * speed)) * 0.1
                group.current.rotation.z = Math.sin(time * speed) * 0.05
            } else {
                group.current.position.y = yOffset + verticalOffset + Math.sin(time * 2) * 0.05
                group.current.rotation.z = 0
            }
        } else {
            // Ensure stable y-pos if animating
            group.current.position.y = yOffset + verticalOffset
        }

        // Apply rotation offset
        // We add this to the group's base rotation. 
        // Note: The parent 'Character' component controls the main Y rotation for movement direction.
        // We only want to apply a *local* correction if the model is facing the wrong way.
        if (clone) {
            clone.rotation.y = rotationOffset
        }

        // Shadow Logic
        if (shadowRef.current) {
            // Simple shadow scaling based on height (mostly for jumping/bobbing)
            // Since we stable the Y offset, this might be subtle unless jumping is added
            shadowRef.current.position.y = 0.01 // floor + epsilon
            shadowRef.current.scale.setScalar(scale * 1.5)
        }
    })

    return (
        <group ref={group} dispose={null}>
            {/* The model itself */}
            <primitive object={clone} scale={scale} />

            {/* Shadow */}
            <mesh ref={shadowRef as any} rotation={[-Math.PI / 2, 0, 0]}>
                <circleGeometry args={[shadowSize, 32]} />
                <meshBasicMaterial color="black" transparent opacity={0.15} depthWrite={false} />
            </mesh>
        </group>
    )
}

// Preload common models? Or let them lazy load?
// useGLTF.preload is good if we know the paths statically
// but here it's dynamic. We can export a preload helper if needed.

export default GLBCharacterModel
