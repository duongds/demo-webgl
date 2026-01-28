import { Text, useTexture } from '@react-three/drei';
import { useEffect, useMemo } from 'react';
import * as THREE from 'three';
import useGameStore from '../../stores/useGameStore';

interface PaintingProps {
    id: string
    url: string
    position: [number, number, number]
    rotation: [number, number, number]
    size?: [number, number]
    title?: string
}

const Painting = ({ id, url, position, rotation, size = [2, 1.5], title = "Untitled" }: PaintingProps) => {
    const texture = useTexture(url)
    const registerPainting = useGameStore((state) => state.registerPainting)

    const worldPosition = useMemo(() => new THREE.Vector3(...position), [position])
    const worldRotation = useMemo(() => new THREE.Euler(...rotation), [rotation])

    useEffect(() => {
        registerPainting({
            id,
            position: worldPosition,
            rotation: worldRotation,
            title,
            url,
        })
    }, [id, worldPosition, worldRotation, title, url, registerPainting])

    return (
        <group position={position} rotation={rotation}>
            {/* Frame */}
            <mesh castShadow>
                <boxGeometry args={[size[0] + 0.2, size[1] + 0.2, 0.1]} />
                <meshStandardMaterial color="#2d1c10" roughness={0.4} metalness={0.2} />
            </mesh>

            {/* Canvas */}
            <mesh position={[0, 0, 0.06]}>
                <planeGeometry args={[size[0], size[1]]} />
                <meshStandardMaterial
                    map={texture}
                    roughness={0.1}
                    metalness={0.05}
                    emissive={new THREE.Color('#ffffff')}
                    emissiveIntensity={0.1}
                />
            </mesh>

            {/* Local Glow for the painting */}
            <pointLight position={[0, 0, 1.5]} intensity={0.8} distance={5} color="#fff" />


            {/* Title plate */}
            {title && (
                <Text
                    position={[0, -size[1] / 2 - 0.3, 0.1]}
                    fontSize={0.15}
                    color="white"
                    anchorX="center"
                    anchorY="middle"
                >
                    {title}
                </Text>
            )}

            {/* Interaction Circle on the floor */}
            <mesh
                position={[0, -position[1] + 0.02, 1.5]}
                rotation={[-Math.PI / 2, 0, 0]}
            >
                <ringGeometry args={[0.45, 0.5, 32]} />
                <meshBasicMaterial
                    color="white"
                    transparent
                    opacity={0.3}
                    depthWrite={false}
                />
            </mesh>
            <mesh
                position={[0, -position[1] + 0.02, 1.5]}
                rotation={[-Math.PI / 2, 0, 0]}
            >
                <circleGeometry args={[0.05, 16]} />
                <meshBasicMaterial
                    color="white"
                    transparent
                    opacity={0.5}
                    depthWrite={false}
                />
            </mesh>
        </group>
    )
}

export default Painting
