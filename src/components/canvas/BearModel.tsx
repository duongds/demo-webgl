import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import useGameStore from '../../stores/useGameStore'

const BearModel = () => {
    const group = useRef<THREE.Group>(null)
    const head = useRef<THREE.Group>(null)
    const leftArm = useRef<THREE.Group>(null)
    const rightArm = useRef<THREE.Group>(null)
    const leftLeg = useRef<THREE.Group>(null)
    const rightLeg = useRef<THREE.Group>(null)
    const shadowRef = useRef<THREE.Mesh>(null)

    const isMoving = useGameStore((state) => state.character.isMoving)
    const isRunning = useGameStore((state) => state.character.isRunning)

    // Research-based Honey Bear Palette
    const colors = {
        body: new THREE.Color('#E6A756'),
        muzzle: new THREE.Color('#FFF3E0'),
        features: new THREE.Color('#3D2B1F'),
        innerEar: new THREE.Color('#D29145'),
        blush: new THREE.Color('#FFB6C1')
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
        body: createShaderMaterial(colors.body),
        muzzle: createShaderMaterial(colors.muzzle),
        features: createShaderMaterial(colors.features),
        innerEar: createShaderMaterial(colors.innerEar),
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
            group.current.position.y = -0.55 + bob * 0.05

            if (head.current) head.current.position.y = 0.7 + bob * 0.01

            const angle = Math.sin(time * walkSpeed) * walkAmplitude
            if (leftLeg.current) leftLeg.current.rotation.x = angle
            if (rightLeg.current) rightLeg.current.rotation.x = -angle
            if (leftArm.current) leftArm.current.rotation.x = -angle * 1.5
            if (rightArm.current) rightArm.current.rotation.x = angle * 1.5
        } else {
            group.current.position.y = -0.55
            const idleSpeed = 2
            if (head.current) head.current.position.y = 0.7 + Math.sin(time * idleSpeed) * 0.005

            if (leftLeg.current) leftLeg.current.rotation.x = 0
            if (rightLeg.current) rightLeg.current.rotation.x = 0
            if (leftArm.current) leftArm.current.rotation.x = 0.2
            if (rightArm.current) rightArm.current.rotation.x = 0.2
        }

        if (shadowRef.current) {
            const bodyY = group.current.position.y
            const heightFactor = 1.0 - (bodyY + 0.6) * 1.5
            shadowRef.current.scale.setScalar(1.2 * heightFactor)
        }
    })

    return (
        <group ref={group} scale={0.75} position={[0, -0.55, 0]}>
            {/* Round Head */}
            <group ref={head} position={[0, 0.7, 0]}>
                {/* Main Head */}
                <mesh material={materials.body}>
                    <sphereGeometry args={[0.32, 16, 16]} />
                </mesh>

                {/* Ears */}
                <group position={[-0.22, 0.25, 0]}>
                    <mesh material={materials.body}>
                        <sphereGeometry args={[0.1, 8, 8]} />
                    </mesh>
                    <mesh position={[0, 0, 0.02]} material={materials.innerEar}>
                        <sphereGeometry args={[0.06, 8, 8]} />
                    </mesh>
                </group>
                <group position={[0.22, 0.25, 0]}>
                    <mesh material={materials.body}>
                        <sphereGeometry args={[0.1, 8, 8]} />
                    </mesh>
                    <mesh position={[0, 0, 0.02]} material={materials.innerEar}>
                        <sphereGeometry args={[0.06, 8, 8]} />
                    </mesh>
                </group>

                {/* Muzzle */}
                <mesh position={[0, -0.05, 0.26]} material={materials.muzzle} scale={[1.2, 0.9, 0.6]}>
                    <sphereGeometry args={[0.12, 12, 12]} />
                </mesh>

                {/* Eyes - Wide set for custom cuteness */}
                <mesh position={[-0.15, 0.05, 0.28]} material={materials.features}>
                    <sphereGeometry args={[0.025, 8, 8]} />
                </mesh>
                <mesh position={[0.15, 0.05, 0.28]} material={materials.features}>
                    <sphereGeometry args={[0.025, 8, 8]} />
                </mesh>

                {/* Nose */}
                <mesh position={[0, 0, 0.32]} material={materials.features} scale={[1.2, 0.8, 1]}>
                    <sphereGeometry args={[0.035, 8, 8]} />
                </mesh>

                {/* Blush Marks */}
                <mesh position={[-0.2, -0.05, 0.27]} material={materials.blush} scale={[1.2, 0.6, 0.5]}>
                    <sphereGeometry args={[0.04, 8, 8]} />
                </mesh>
                <mesh position={[0.2, -0.05, 0.27]} material={materials.blush} scale={[1.2, 0.6, 0.5]}>
                    <sphereGeometry args={[0.04, 8, 8]} />
                </mesh>
            </group>

            {/* Torso */}
            <group position={[0, 0.35, 0]}>
                <mesh material={materials.body} scale={[1, 1.1, 1]}>
                    <sphereGeometry args={[0.38, 16, 16]} />
                </mesh>
                {/* Belly Patch */}
                <mesh position={[0, -0.05, 0.25]} material={materials.muzzle} scale={[1, 1.2, 0.5]}>
                    <sphereGeometry args={[0.2, 12, 12]} />
                </mesh>
            </group>

            {/* Arms */}
            <group ref={leftArm} position={[-0.3, 0.45, 0]}>
                <mesh position={[0, -0.12, 0]} material={materials.body}>
                    <capsuleGeometry args={[0.08, 0.18, 4, 8]} />
                </mesh>
            </group>
            <group ref={rightArm} position={[0.3, 0.45, 0]}>
                <mesh position={[0, -0.12, 0]} material={materials.body}>
                    <capsuleGeometry args={[0.08, 0.18, 4, 8]} />
                </mesh>
            </group>

            {/* Legs */}
            <group ref={leftLeg} position={[-0.18, 0.15, 0]}>
                <mesh position={[0, -0.15, 0]} material={materials.body}>
                    <capsuleGeometry args={[0.09, 0.22, 4, 8]} />
                </mesh>
            </group>
            <group ref={rightLeg} position={[0.18, 0.15, 0]}>
                <mesh position={[0, -0.15, 0]} material={materials.body}>
                    <capsuleGeometry args={[0.09, 0.22, 4, 8]} />
                </mesh>
            </group>

            {/* Tail */}
            <mesh position={[0, 0.1, -0.32]} material={materials.body}>
                <sphereGeometry args={[0.08, 8, 8]} />
            </mesh>

            {/* Shadow */}
            <mesh ref={shadowRef as any} position={[0, -0.45, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <circleGeometry args={[0.5, 32]} />
                <meshBasicMaterial color="black" transparent opacity={0.15} depthWrite={false} />
            </mesh>
        </group>
    )
}

export default BearModel
