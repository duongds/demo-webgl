import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'

interface CherryBlossomTreeProps {
    position?: [number, number, number]
}

/**
 * CherryBlossomTree - Stylized cherry blossom tree with pink foliage
 */
const CherryBlossomTree = ({ position = [0, 0, 0] }: CherryBlossomTreeProps) => {
    const foliageRef = useRef<THREE.Group>(null)
    const bloomsRef = useRef<THREE.InstancedMesh>(null)

    // Generate bloom positions
    const bloomData = useMemo(() => {
        const count = 200
        const positions: THREE.Vector3[] = []
        const scales: number[] = []

        for (let i = 0; i < count; i++) {
            // Distribute in a sphere-ish shape for foliage
            const theta = Math.random() * Math.PI * 2
            const phi = Math.acos(2 * Math.random() - 1)
            const radius = 2 + Math.random() * 2

            const x = radius * Math.sin(phi) * Math.cos(theta)
            const y = 3 + radius * Math.cos(phi) * 0.6 // Flatten vertically
            const z = radius * Math.sin(phi) * Math.sin(theta)

            positions.push(new THREE.Vector3(x, y, z))
            scales.push(0.1 + Math.random() * 0.15)
        }

        return { positions, scales, count }
    }, [])

    // Initialize bloom instances
    useMemo(() => {
        if (!bloomsRef.current) return

        const dummy = new THREE.Object3D()

        bloomData.positions.forEach((pos, i) => {
            dummy.position.copy(pos)
            dummy.scale.setScalar(bloomData.scales[i])
            dummy.rotation.set(
                Math.random() * Math.PI,
                Math.random() * Math.PI,
                Math.random() * Math.PI
            )
            dummy.updateMatrix()
            bloomsRef.current!.setMatrixAt(i, dummy.matrix)
        })

        bloomsRef.current.instanceMatrix.needsUpdate = true
    }, [bloomData])

    // Gentle swaying animation
    useFrame((state) => {
        if (foliageRef.current) {
            foliageRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.05
            foliageRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.5) * 0.02
        }
    })

    return (
        <group position={position}>
            {/* Tree trunk */}
            <mesh castShadow>
                <cylinderGeometry args={[0.3, 0.5, 3, 8]} />
                <meshStandardMaterial
                    color="#4a3728"
                    roughness={0.9}
                />
            </mesh>

            {/* Main branch */}
            <mesh position={[0, 1.5, 0]} rotation={[0, 0, 0.3]} castShadow>
                <cylinderGeometry args={[0.15, 0.25, 2, 6]} />
                <meshStandardMaterial color="#5a4738" roughness={0.85} />
            </mesh>

            {/* Secondary branches */}
            {[
                { pos: [0.8, 2, 0], rot: [0, 0, 0.6], len: 1.5 },
                { pos: [-0.5, 2.2, 0.3], rot: [0.2, 0.5, -0.4], len: 1.2 },
                { pos: [0.3, 2.5, -0.5], rot: [-0.3, 0, 0.3], len: 1 },
            ].map((branch, i) => (
                <mesh
                    key={i}
                    position={branch.pos as [number, number, number]}
                    rotation={branch.rot as [number, number, number]}
                    castShadow
                >
                    <cylinderGeometry args={[0.05, 0.12, branch.len, 5]} />
                    <meshStandardMaterial color="#6a5748" roughness={0.8} />
                </mesh>
            ))}

            {/* Foliage group */}
            <group ref={foliageRef}>
                {/* Main foliage clusters - pink spheres */}
                {[
                    { pos: [0, 4, 0], scale: 2.5 },
                    { pos: [1.5, 3.5, 0], scale: 1.8 },
                    { pos: [-1, 3.8, 0.5], scale: 1.5 },
                    { pos: [0.5, 4.5, -0.5], scale: 1.2 },
                    { pos: [-0.8, 4.2, -0.3], scale: 1.3 },
                ].map((cluster, i) => (
                    <mesh
                        key={i}
                        position={cluster.pos as [number, number, number]}
                        scale={cluster.scale}
                    >
                        <icosahedronGeometry args={[1, 1]} />
                        <meshStandardMaterial
                            color="#ffb7c5"
                            roughness={0.6}
                            transparent
                            opacity={0.9}
                        />
                    </mesh>
                ))}

                {/* Instanced cherry blossoms */}
                <instancedMesh
                    ref={bloomsRef}
                    args={[undefined, undefined, bloomData.count]}
                >
                    <sphereGeometry args={[1, 8, 8]} />
                    <meshStandardMaterial
                        color="#ffc0cb"
                        emissive="#ff69b4"
                        emissiveIntensity={0.1}
                        roughness={0.5}
                    />
                </instancedMesh>
            </group>

            {/* Glow effect at base */}
            <pointLight
                position={[0, 3.5, 0]}
                intensity={0.5}
                color="#ffb7c5"
                distance={8}
            />
        </group>
    )
}

export default CherryBlossomTree
