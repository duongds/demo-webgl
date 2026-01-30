import { useAnimations, useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import useGameStore from '../../stores/useGameStore'

const PikachuModel = () => {
    const group = useRef<THREE.Group>(null)
    const shadowRef = useRef<THREE.Mesh>(null)
    const { scene, animations } = useGLTF('/models/robot.glb')
    const { actions, names } = useAnimations(animations, group)

    const isMoving = useGameStore((state) => state.character.isMoving)
    const isRunning = useGameStore((state) => state.character.isRunning)

    useEffect(() => {
        // Try to find idle and walk animations
        const idleAnim = names.find(n => n.toLowerCase().includes('idle')) || names[0]
        const walkAnim = names.find(n => n.toLowerCase().includes('walk') || n.toLowerCase().includes('run')) || names[1]

        if (isMoving) {
            if (actions[idleAnim]) actions[idleAnim].fadeOut(0.2)
            if (actions[walkAnim]) {
                actions[walkAnim].reset().fadeIn(0.2).play()
                actions[walkAnim].timeScale = isRunning ? 1.5 : 1.0
            }
        } else {
            if (actions[walkAnim]) actions[walkAnim].fadeOut(0.2)
            if (actions[idleAnim]) actions[idleAnim].reset().fadeIn(0.2).play()
        }
    }, [isMoving, isRunning, actions, names])

    // Procedural bobbing if no animations are found or as an extra layer
    useFrame((state) => {
        if (!group.current) return
        const time = state.clock.elapsedTime

        // Procedural bobbing if no animations
        if (names.length === 0) {
            // Basic procedural movement if no animations
            if (isMoving) {
                const speed = isRunning ? 15 : 10
                group.current.position.y = -0.5 + Math.abs(Math.sin(time * speed)) * 0.1
                group.current.rotation.z = Math.sin(time * speed) * 0.05
            } else {
                group.current.position.y = -0.5 + Math.sin(time * 2) * 0.05
                group.current.rotation.z = 0
            }
        }

        if (shadowRef.current) {
            const bodyY = group.current.position.y
            const heightFactor = 1.0 - (bodyY + 0.5) * 1.5
            shadowRef.current.scale.setScalar(0.8 * heightFactor)
        }
    })

    return (
        <group ref={group} dispose={null} scale={0.6} position={[0, -0.5, 0]}>
            <primitive object={scene} />

            {/* Shadow */}
            <mesh ref={shadowRef as any} position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <circleGeometry args={[0.5, 32]} />
                <meshBasicMaterial color="black" transparent opacity={0.15} depthWrite={false} />
            </mesh>
        </group>
    )
}

useGLTF.preload('/models/robot.glb')

export default PikachuModel
