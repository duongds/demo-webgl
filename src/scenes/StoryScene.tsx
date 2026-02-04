import { Environment } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import CherryBlossomTree from '@/components/canvas/CherryBlossomTree'
import PetalParticles from '@/components/canvas/PetalParticles'
import ProjectCarousel from '@/components/canvas/ProjectCarousel'
import ScrollCamera from '@/components/canvas/ScrollCamera'
import StoryCharacter from '@/components/canvas/StoryCharacter'
import StoryIsland from '@/components/canvas/StoryIsland'
import WaterPlane from '@/components/canvas/WaterPlane'

interface StorySceneProps {
    scrollProgress: number
}

/**
 * StoryScene - Main 3D scene for the character story page
 * Features floating island, cherry blossoms, and scroll-driven camera
 */
const StoryScene = ({ scrollProgress }: StorySceneProps) => {
    const groupRef = useRef<THREE.Group>(null)

    // Gentle floating animation for the island
    useFrame((state) => {
        if (groupRef.current) {
            groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.15
            groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.02
        }
    })

    // Project data for carousel
    const projects = useMemo(() => [
        {
            id: '1',
            title: '3D Gallery',
            description: 'Interactive WebGL art gallery',
            image: 'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=400&h=300&fit=crop',
            color: '#6366f1'
        },
        {
            id: '2',
            title: 'Portfolio',
            description: 'Personal developer portfolio',
            image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop',
            color: '#ec4899'
        },
        {
            id: '3',
            title: 'Dashboard',
            description: 'Analytics visualization',
            image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop',
            color: '#10b981'
        },
        {
            id: '4',
            title: 'E-Commerce',
            description: 'Online shopping experience',
            image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=300&fit=crop',
            color: '#f59e0b'
        },
    ], [])

    return (
        <>
            {/* Scroll-driven camera */}
            <ScrollCamera scrollProgress={scrollProgress} />

            {/* Lighting */}
            <ambientLight intensity={0.4} />
            <directionalLight
                position={[10, 20, 10]}
                intensity={1.2}
                castShadow
                shadow-mapSize={[2048, 2048]}
            />
            <pointLight position={[-10, 10, -10]} intensity={0.5} color="#ffd1dc" />
            <pointLight position={[10, 5, 10]} intensity={0.3} color="#87ceeb" />

            {/* Main floating island group */}
            <group ref={groupRef} position={[0, -2, 0]}>
                {/* Floating Island Platform */}
                <StoryIsland />

                {/* Character on the island */}
                <group position={[0, 2.5, 1]} rotation={[0, Math.PI, 0]}>
                    <StoryCharacter />
                </group>

                {/* Cherry Blossom Tree */}
                <CherryBlossomTree position={[0, 2.5, 0]} />

                {/* Project Carousel - Only visible after scroll progress */}
                <ProjectCarousel
                    projects={projects}
                    visible={scrollProgress > 0.5}
                    radius={8}
                />

                {/* Rune Circle on the island */}
                <mesh position={[0, 2.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                    <ringGeometry args={[3, 3.5, 64]} />
                    <meshBasicMaterial
                        color="#00ffff"
                        transparent
                        opacity={0.3 + Math.sin(scrollProgress * Math.PI * 2) * 0.2}
                        side={THREE.DoubleSide}
                    />
                </mesh>
            </group>

            {/* Water plane below the island */}
            <WaterPlane />

            {/* Falling petal particles */}
            <PetalParticles count={150} />

            {/* Environment for reflections */}
            <Environment preset="sunset" />

            {/* Stars in the background */}
            <mesh position={[0, 0, -50]}>
                <planeGeometry args={[200, 100]} />
                <meshBasicMaterial color="#0a0a1a" />
            </mesh>
        </>
    )
}

export default StoryScene
