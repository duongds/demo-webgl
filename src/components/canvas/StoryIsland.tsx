import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import * as THREE from 'three'

/**
 * StoryIsland - Floating rock island platform
 * Features stone base, grass top, and glowing runes
 */
const StoryIsland = () => {
    const runeRef = useRef<THREE.Mesh>(null)

    // Animate rune glow
    useFrame((state) => {
        if (runeRef.current) {
            const material = runeRef.current.material as THREE.MeshStandardMaterial
            material.emissiveIntensity = 0.5 + Math.sin(state.clock.elapsedTime * 2) * 0.3
        }
    })

    return (
        <group>
            {/* Main island body - Rock base */}
            <mesh position={[0, 0, 0]} castShadow receiveShadow>
                <cylinderGeometry args={[6, 4, 4, 32]} />
                <meshStandardMaterial
                    color="#3d3d3d"
                    roughness={0.9}
                    metalness={0.1}
                />
            </mesh>

            {/* Top grass/moss layer */}
            <mesh position={[0, 2, 0]} receiveShadow>
                <cylinderGeometry args={[6, 6, 0.3, 32]} />
                <meshStandardMaterial
                    color="#2d5a27"
                    roughness={0.8}
                    metalness={0}
                />
            </mesh>

            {/* Stone pillars around the edge */}
            {[0, 1, 2, 3, 4, 5].map((i) => {
                const angle = (i / 6) * Math.PI * 2
                const x = Math.cos(angle) * 5
                const z = Math.sin(angle) * 5
                const height = 1 + Math.random() * 1.5

                return (
                    <group key={i} position={[x, 2, z]}>
                        <mesh castShadow>
                            <cylinderGeometry args={[0.3, 0.4, height, 8]} />
                            <meshStandardMaterial
                                color="#4a4a4a"
                                roughness={0.85}
                            />
                        </mesh>
                        {/* Glowing top */}
                        <mesh position={[0, height / 2 + 0.1, 0]}>
                            <sphereGeometry args={[0.15, 16, 16]} />
                            <meshStandardMaterial
                                color="#00ffff"
                                emissive="#00ffff"
                                emissiveIntensity={1}
                            />
                        </mesh>
                    </group>
                )
            })}

            {/* Center rune circle */}
            <mesh
                ref={runeRef}
                position={[0, 2.02, 0]}
                rotation={[-Math.PI / 2, 0, 0]}
            >
                <ringGeometry args={[1.5, 2, 6]} />
                <meshStandardMaterial
                    color="#00aaff"
                    emissive="#00aaff"
                    emissiveIntensity={0.5}
                    transparent
                    opacity={0.7}
                    side={THREE.DoubleSide}
                />
            </mesh>

            {/* Inner rune pattern */}
            <mesh position={[0, 2.03, 0]} rotation={[-Math.PI / 2, Math.PI / 6, 0]}>
                <ringGeometry args={[0.8, 1.2, 6]} />
                <meshStandardMaterial
                    color="#ff6b9d"
                    emissive="#ff6b9d"
                    emissiveIntensity={0.3}
                    transparent
                    opacity={0.5}
                    side={THREE.DoubleSide}
                />
            </mesh>

            {/* Floating small rocks around the island */}
            {[...Array(8)].map((_, i) => {
                const angle = (i / 8) * Math.PI * 2 + Math.random()
                const distance = 7 + Math.random() * 3
                const x = Math.cos(angle) * distance
                const z = Math.sin(angle) * distance
                const y = -1 + Math.random() * 2
                const scale = 0.3 + Math.random() * 0.5

                return (
                    <mesh key={`rock-${i}`} position={[x, y, z]} scale={scale}>
                        <dodecahedronGeometry args={[1]} />
                        <meshStandardMaterial
                            color="#4a4a4a"
                            roughness={0.9}
                        />
                    </mesh>
                )
            })}
        </group>
    )
}

export default StoryIsland
