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
            // Body bobbing - happens twice per full step cycle (one per foot)
            const bob = Math.abs(Math.sin(time * walkSpeed))
            group.current.position.y = -0.55 + bob * 0.06

            // Head bobbing matching body
            if (head.current) {
                head.current.position.y = 0.8 + bob * 0.015
            }

            // Limb movement
            const angle = Math.sin(time * walkSpeed) * walkAmplitude

            if (leftLeg.current) leftLeg.current.rotation.x = angle
            if (rightLeg.current) rightLeg.current.rotation.x = -angle

            // Arms move opposite to legs
            if (leftArm.current) leftArm.current.rotation.x = -angle * 1.3
            if (rightArm.current) rightArm.current.rotation.x = angle * 1.3
        } else {
            // Idle state
            group.current.position.y = -0.55
            const idleSpeed = 2
            if (head.current) {
                head.current.position.y = 0.8 + Math.sin(time * idleSpeed) * 0.005
            }

            // Reset limbs
            if (leftLeg.current) leftLeg.current.rotation.x = THREE.MathUtils.lerp(leftLeg.current.rotation.x, 0, 0.1)
            if (rightLeg.current) rightLeg.current.rotation.x = THREE.MathUtils.lerp(rightLeg.current.rotation.x, 0, 0.1)
            if (leftArm.current) leftArm.current.rotation.x = THREE.MathUtils.lerp(leftArm.current.rotation.x, 0.2, 0.1)
            if (rightArm.current) rightArm.current.rotation.x = THREE.MathUtils.lerp(rightArm.current.rotation.x, 0.2, 0.1)
        }
        // Shadow dynamic behavior
        if (shadowRef.current) {
            const bodyY = group.current.position.y
            const heightFactor = 1.0 - (bodyY + 0.6) * 1.5
            shadowRef.current.scale.setScalar(1.0 * heightFactor)
            if (shadowRef.current.material instanceof THREE.MeshBasicMaterial) {
                shadowRef.current.material.opacity = 0.15 * heightFactor
            }
        }
    })

    return (
        <group ref={group} scale={0.75} position={[0, -0.55, 0]}>
            {/* Head & Neck */}
            <group ref={head} position={[0, 0.85, 0]}>
                <mesh material={material}>
                    <sphereGeometry args={[0.22, 16, 16]} />
                </mesh>
                <mesh position={[0, -0.2, 0]} material={material}>
                    <cylinderGeometry args={[0.035, 0.04, 0.08, 8]} />
                </mesh>
            </group>

            {/* Torso */}
            <mesh position={[0, 0.52, 0]} material={material}>
                <capsuleGeometry args={[0.16, 0.2, 4, 10]} />
            </mesh>

            {/* Hips */}
            <mesh position={[0, 0.38, 0]} material={material}>
                <sphereGeometry args={[0.15, 12, 12]} />
            </mesh>

            {/* Arms - Lengthened to 0.25 */}
            <group ref={leftArm} position={[-0.2, 0.62, 0]}>
                <mesh position={[0, -0.18, 0]} material={material}>
                    <capsuleGeometry args={[0.05, 0.25, 4, 8]} />
                </mesh>
            </group>

            <group ref={rightArm} position={[0.2, 0.62, 0]}>
                <mesh position={[0, -0.18, 0]} material={material}>
                    <capsuleGeometry args={[0.05, 0.25, 4, 8]} />
                </mesh>
            </group>


            <group ref={leftLeg} position={[-0.08, 0.3, 0]}>
                <mesh position={[0, -0.2, 0]} material={material}>
                    <capsuleGeometry args={[0.07, 0.35, 4, 8]} />
                </mesh>
            </group>

            <group ref={rightLeg} position={[0.08, 0.3, 0]}>
                <mesh position={[0, -0.2, 0]} material={material}>
                    <capsuleGeometry args={[0.07, 0.35, 4, 8]} />
                </mesh>
            </group>

            {/* Shadow */}
            <mesh
                ref={shadowRef as any}
                position={[0, -0.45, 0]}
                rotation={[-Math.PI / 2, 0, 0]}
            >
                <circleGeometry args={[0.3, 32]} />
                <meshBasicMaterial color="black" transparent opacity={0.15} depthWrite={false} />
            </mesh>
        </group>
    )
}

export default CustomCharacterModel
