import { useFrame } from '@react-three/fiber'
import useGameStore from '../../stores/useGameStore'

const Footprints = () => {
    const footprints = useGameStore((state) => state.footprints)
    const updateFootprints = useGameStore((state) => state.updateFootprints)

    // Update opacity and remove old footprints
    useFrame((_, delta) => {
        updateFootprints(delta)
    })

    return (
        <group>
            {footprints.map((footprint, index) => (
                <mesh
                    key={footprint.id}
                    position={[footprint.position.x, 0.012, footprint.position.z]}
                    rotation={[-Math.PI / 2, 0, footprint.rotation + (index % 2 === 0 ? 0.2 : -0.2)]}
                    scale={0.5 + (index % 3) * 0.1}
                >
                    <circleGeometry args={[0.2, 12]} />
                    <meshBasicMaterial
                        transparent
                        opacity={footprint.opacity * 0.4}
                        color="#222"
                        depthWrite={false}
                    />
                </mesh>
            ))}
        </group>
    )
}

export default Footprints
