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

    // Palette for Human character
    const colors = {
        skin: new THREE.Color('#FFDBAC'), // Light skin tone
        shirt: new THREE.Color('#5dade2'), // Soft blue
        pants: new THREE.Color('#34495e'), // Dark slate
        hair: new THREE.Color('#2c3e50'), // Dark hair
        features: new THREE.Color('#222222'), // Dark for eyes/nose
        blush: new THREE.Color('#ffb6c1'), // Soft pink
    }

    const createShaderMaterial = (color: THREE.Color) => {
        return new THREE.ShaderMaterial({
            uniforms: {
                uTime: { value: 0 },
                uJitter: { value: 0.12 },
                uColor: { value: color },
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
                float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); }
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
        })
    }

    const materials = useMemo(() => ({
        skin: createShaderMaterial(colors.skin),
        shirt: createShaderMaterial(colors.shirt),
        pants: createShaderMaterial(colors.pants),
        hair: createShaderMaterial(colors.hair),
        features: createShaderMaterial(colors.features),
        blush: createShaderMaterial(colors.blush)
    }), [])

    useFrame((state) => {
        const time = state.clock.elapsedTime
        Object.values(materials).forEach(m => {
            m.uniforms.uTime.value = time
        })

        if (!group.current) return

        const walkSpeed = isRunning ? 15 : 10
        const walkAmplitude = isRunning ? 0.4 : 0.25

        if (isMoving) {
            const bob = Math.abs(Math.sin(time * walkSpeed))
            group.current.position.y = -0.55 + bob * 0.06
            if (head.current) head.current.position.y = 0.82 + bob * 0.015

            const angle = Math.sin(time * walkSpeed) * walkAmplitude
            if (leftLeg.current) leftLeg.current.rotation.x = angle
            if (rightLeg.current) rightLeg.current.rotation.x = -angle
            if (leftArm.current) leftArm.current.rotation.x = -angle * 1.3
            if (rightArm.current) rightArm.current.rotation.x = angle * 1.3
        } else {
            group.current.position.y = -0.55
            const idleSpeed = 2
            if (head.current) head.current.position.y = 0.82 + Math.sin(time * idleSpeed) * 0.005

            if (leftLeg.current) leftLeg.current.rotation.x = THREE.MathUtils.lerp(leftLeg.current.rotation.x, 0, 0.1)
            if (rightLeg.current) rightLeg.current.rotation.x = THREE.MathUtils.lerp(rightLeg.current.rotation.x, 0, 0.1)
            if (leftArm.current) leftArm.current.rotation.x = THREE.MathUtils.lerp(leftArm.current.rotation.x, 0.2, 0.1)
            if (rightArm.current) rightArm.current.rotation.x = THREE.MathUtils.lerp(rightArm.current.rotation.x, 0.2, 0.1)
        }

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
            {/* Head */}
            <group ref={head} position={[0, 0.82, 0]}>
                <mesh material={materials.skin}>
                    <sphereGeometry args={[0.22, 16, 16]} />
                </mesh>
                {/* Hair/Cap - Covers front and back */}
                <mesh position={[0, 0.05, 0]} material={materials.hair}>
                    <sphereGeometry args={[0.23, 24, 24, 0, Math.PI * 2, 0, Math.PI * 0.6]} />
                </mesh>
                <mesh position={[0, -0.18, 0]} material={materials.skin}>
                    <cylinderGeometry args={[0.035, 0.04, 0.08, 8]} />
                </mesh>

                {/* Face Features */}
                {/* Eyes */}
                <mesh position={[-0.08, 0, 0.18]} material={materials.features}>
                    <sphereGeometry args={[0.02, 8, 8]} />
                </mesh>
                <mesh position={[0.08, 0, 0.18]} material={materials.features}>
                    <sphereGeometry args={[0.02, 8, 8]} />
                </mesh>

                {/* Nose */}
                <mesh position={[0, -0.04, 0.2]} material={materials.skin} scale={[1, 0.8, 1]}>
                    <sphereGeometry args={[0.025, 8, 8]} />
                </mesh>

                {/* Blush */}
                <mesh position={[-0.12, -0.05, 0.16]} material={materials.blush} scale={[1.2, 0.6, 0.5]}>
                    <sphereGeometry args={[0.03, 8, 8]} />
                </mesh>
                <mesh position={[0.12, -0.05, 0.16]} material={materials.blush} scale={[1.2, 0.6, 0.5]}>
                    <sphereGeometry args={[0.03, 8, 8]} />
                </mesh>
            </group>

            {/* Torso (Shirt) */}
            <mesh position={[0, 0.52, 0]} material={materials.shirt}>
                <capsuleGeometry args={[0.16, 0.2, 4, 10]} />
            </mesh>

            {/* Hips (Pants) */}
            <mesh position={[0, 0.38, 0]} material={materials.pants}>
                <sphereGeometry args={[0.15, 12, 12]} />
            </mesh>

            {/* Arms - Skin parts and Shirt Sleeves */}
            <group ref={leftArm} position={[-0.2, 0.62, 0]}>
                <mesh position={[0, -0.18, 0]} material={materials.skin}>
                    <capsuleGeometry args={[0.05, 0.25, 4, 8]} />
                </mesh>
                <mesh position={[0, -0.05, 0]} material={materials.shirt}>
                    <capsuleGeometry args={[0.06, 0.1, 4, 8]} />
                </mesh>
            </group>

            <group ref={rightArm} position={[0.2, 0.62, 0]}>
                <mesh position={[0, -0.18, 0]} material={materials.skin}>
                    <capsuleGeometry args={[0.05, 0.25, 4, 8]} />
                </mesh>
                <mesh position={[0, -0.05, 0]} material={materials.shirt}>
                    <capsuleGeometry args={[0.06, 0.1, 4, 8]} />
                </mesh>
            </group>

            {/* Legs (Pants) */}
            <group ref={leftLeg} position={[-0.08, 0.3, 0]}>
                <mesh position={[0, -0.18, 0]} material={materials.pants}>
                    <capsuleGeometry args={[0.07, 0.32, 4, 8]} />
                </mesh>
            </group>

            <group ref={rightLeg} position={[0.08, 0.3, 0]}>
                <mesh position={[0, -0.18, 0]} material={materials.pants}>
                    <capsuleGeometry args={[0.07, 0.32, 4, 8]} />
                </mesh>
            </group>

            {/* Shadow */}
            <mesh ref={shadowRef as any} position={[0, -0.45, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <circleGeometry args={[0.3, 32]} />
                <meshBasicMaterial color="black" transparent opacity={0.15} depthWrite={false} />
            </mesh>
        </group>
    )
}

export default CustomCharacterModel
