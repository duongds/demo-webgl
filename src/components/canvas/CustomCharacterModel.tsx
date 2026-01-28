import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import useGameStore from '../../stores/useGameStore'

const CustomCharacterModel = () => {
    const group = useRef<THREE.Group>(null)
    const head = useRef<THREE.Group>(null)
    const leftArm = useRef<THREE.Group>(null)
    const rightArm = useRef<THREE.Group>(null)
    const leftLeg = useRef<THREE.Group>(null)
    const rightLeg = useRef<THREE.Group>(null)
    const shadowRef = useRef<THREE.Mesh>(null)

    const isMoving = useGameStore((state) => state.character.isMoving)
    const isRunning = useGameStore((state) => state.character.isRunning)

    // Common Sketchy Material for all parts
    const material = useMemo(() => new THREE.ShaderMaterial({
        uniforms: {
            uTime: { value: 0 },
            uJitter: { value: 0.12 }, // Higher jitter for cute hand-drawn look
            uColor: { value: new THREE.Color(0.05, 0.05, 0.05) },
        },
        vertexShader: `
            varying vec2 vUv;
            void main() {
                vUv = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
        fragmentShader: `
            uniform float uTime;
            uniform float uJitter;
            uniform vec3 uColor;
            varying vec2 vUv;

            float hash(vec2 p) {
                return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
            }

            void main() {
                float speed = 15.0;
                float time = floor(uTime * speed);
                float noise = hash(vUv + time);
                
                float alpha = 1.0;
                if (noise < uJitter) alpha = 0.7;
                
                gl_FragColor = vec4(uColor, alpha);
            }
        `,
        transparent: true,
    }), [])

    useFrame((state) => {
        const time = state.clock.elapsedTime
        material.uniforms.uTime.value = time

        if (!group.current) return

        // --- PROCEDURAL ANIMATIONS ---
        const walkSpeed = isRunning ? 15 : 10
        const walkAmplitude = isRunning ? 0.4 : 0.25

        if (isMoving) {
            // Body bobbing
            group.current.position.y = Math.abs(Math.sin(time * walkSpeed)) * 0.1 - 0.6

            // Head bobbing
            if (head.current) {
                head.current.position.y = 0.8 + Math.sin(time * walkSpeed * 1.2) * 0.02
            }

            // Limb movement
            const angle = Math.sin(time * walkSpeed) * walkAmplitude

            if (leftLeg.current) leftLeg.current.rotation.x = angle
            if (rightLeg.current) rightLeg.current.rotation.x = -angle

            if (leftArm.current) leftArm.current.rotation.x = -angle * 1.5
            if (rightArm.current) rightArm.current.rotation.x = angle * 1.5
        } else {
            // Idle breathing
            group.current.position.y = -0.6
            const idleSpeed = 2
            if (head.current) {
                head.current.position.y = 0.8 + Math.sin(time * idleSpeed) * 0.01
            }

            // Reset limbs
            if (leftLeg.current) leftLeg.current.rotation.x = 0
            if (rightLeg.current) rightLeg.current.rotation.x = 0
            if (leftArm.current) leftArm.current.rotation.x = 0
            if (rightArm.current) rightArm.current.rotation.x = 0
        }
        // Shadow dynamic behavior
        if (shadowRef.current) {
            const bodyY = group.current.position.y
            // bodyY goes from -0.6 (idle/low) to -0.5 (bobbing high)
            // Height above floor influence: higher body = smaller shadow
            const heightFactor = 1.0 - (bodyY + 0.6) * 2.0
            const baseScale = isMoving ? 1.1 : 1.0
            const pulseScale = baseScale * (0.95 + Math.sin(time * 5) * 0.05) // Subtle constant pulse

            shadowRef.current.scale.setScalar(pulseScale * heightFactor)
            if (shadowRef.current.material instanceof THREE.MeshBasicMaterial) {
                shadowRef.current.material.opacity = 0.15 * heightFactor
            }
        }
    })

    return (
        <group ref={group} scale={0.7} position={[0, -0.6, 0]}> {/* Scale down for "cute" size */}
            {/* Head & Neck */}
            <group ref={head} position={[0, 0.85, 0]}>
                <mesh material={material}>
                    <sphereGeometry args={[0.26, 16, 16]} />
                </mesh>
                <mesh position={[0, -0.22, 0]} material={material}>
                    <cylinderGeometry args={[0.04, 0.05, 0.1, 8]} />
                </mesh>
            </group>

            {/* Torso (Chest/Shoulders) */}
            <mesh position={[0, 0.55, 0]} material={material}>
                <capsuleGeometry args={[0.16, 0.25, 4, 10]} />
            </mesh>

            {/* Hips */}
            <mesh position={[0, 0.35, 0]} material={material}>
                <sphereGeometry args={[0.15, 12, 12]} />
            </mesh>

            {/* ... Other limbs ... */}
            <group ref={leftArm} position={[-0.2, 0.65, 0]}>
                <mesh position={[0, -0.15, 0]} material={material}>
                    <capsuleGeometry args={[0.05, 0.25, 4, 8]} />
                </mesh>
            </group>

            <group ref={rightArm} position={[0.2, 0.65, 0]}>
                <mesh position={[0, -0.15, 0]} material={material}>
                    <capsuleGeometry args={[0.05, 0.25, 4, 8]} />
                </mesh>
            </group>

            <group ref={leftLeg} position={[-0.08, 0.28, 0]}>
                <mesh position={[0, -0.2, 0]} material={material}>
                    <capsuleGeometry args={[0.07, 0.35, 4, 8]} />
                </mesh>
            </group>

            <group ref={rightLeg} position={[0.08, 0.28, 0]}>
                <mesh position={[0, -0.2, 0]} material={material}>
                    <capsuleGeometry args={[0.07, 0.35, 4, 8]} />
                </mesh>
            </group>

            {/* Dynamic Blob Shadow */}
            <mesh
                ref={shadowRef as any}
                position={[0, -0.6, 0]}
                rotation={[-Math.PI / 2, 0, 0]}
            >
                <circleGeometry args={[0.3, 32]} />
                <meshBasicMaterial
                    color="black"
                    transparent
                    opacity={0.15}
                    depthWrite={false}
                />
            </mesh>
        </group>
    )
}

export default CustomCharacterModel
