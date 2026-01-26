import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import * as THREE from 'three'

const RotatingCube = () => {
    const meshRef = useRef<THREE.Mesh>(null)

    useFrame((_state, delta) => {
        if (meshRef.current) {
            meshRef.current.rotation.x += delta * 0.5
            meshRef.current.rotation.y += delta * 0.8
        }
    })

    return (
        <mesh ref={meshRef} position={[0, 0, 0]} castShadow>
            <boxGeometry args={[1.5, 1.5, 1.5]} />
            <meshStandardMaterial
                color="#667eea"
                metalness={0.3}
                roughness={0.4}
            />
        </mesh>
    )
}

export default RotatingCube
