import { Text } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useMemo, useRef, useState } from 'react'
import * as THREE from 'three'

interface Project {
    id: string
    title: string
    description: string
    image: string
    color: string
}

interface ProjectCarouselProps {
    projects: Project[]
    visible: boolean
    radius?: number
}

/**
 * ProjectCarousel - 3D rotating project cards
 * Cards orbit around the center with hover/click interactions
 */
const ProjectCarousel = ({ projects, visible, radius = 8 }: ProjectCarouselProps) => {
    const groupRef = useRef<THREE.Group>(null)
    const [hoveredId, setHoveredId] = useState<string | null>(null)

    // Auto-rotation
    useFrame((state, delta) => {
        if (groupRef.current && visible) {
            groupRef.current.rotation.y += delta * 0.1
        }
    })

    // Fade in/out based on visibility
    const opacity = visible ? 1 : 0

    return (
        <group
            ref={groupRef}
            visible={visible}
            position={[0, 4, 0]}
        >
            {projects.map((project, i) => {
                const angle = (i / projects.length) * Math.PI * 2
                const x = Math.cos(angle) * radius
                const z = Math.sin(angle) * radius

                return (
                    <ProjectCard3D
                        key={project.id}
                        project={project}
                        position={[x, 0, z]}
                        rotation={[0, -angle + Math.PI / 2, 0]}
                        isHovered={hoveredId === project.id}
                        onHover={() => setHoveredId(project.id)}
                        onUnhover={() => setHoveredId(null)}
                        opacity={opacity}
                    />
                )
            })}
        </group>
    )
}

interface ProjectCard3DProps {
    project: Project
    position: [number, number, number]
    rotation: [number, number, number]
    isHovered: boolean
    onHover: () => void
    onUnhover: () => void
    opacity: number
}

/**
 * ProjectCard3D - Individual 3D project card
 */
const ProjectCard3D = ({
    project,
    position,
    rotation,
    isHovered,
    onHover,
    onUnhover,
    opacity
}: ProjectCard3DProps) => {
    const meshRef = useRef<THREE.Mesh>(null)
    const [hoverScale, setHoverScale] = useState(1)

    // Load project image as texture
    const texture = useMemo(() => {
        const loader = new THREE.TextureLoader()
        const tex = loader.load(project.image)
        tex.colorSpace = THREE.SRGBColorSpace
        return tex
    }, [project.image])

    // Hover animation
    useFrame((_, delta) => {
        const targetScale = isHovered ? 1.15 : 1
        setHoverScale(prev => THREE.MathUtils.lerp(prev, targetScale, delta * 8))
    })

    return (
        <group position={position} rotation={rotation}>
            <group scale={hoverScale}>
                {/* Card background */}
                <mesh
                    ref={meshRef}
                    onPointerEnter={(e) => {
                        e.stopPropagation()
                        onHover()
                        document.body.style.cursor = 'pointer'
                    }}
                    onPointerLeave={() => {
                        onUnhover()
                        document.body.style.cursor = 'default'
                    }}
                    castShadow
                >
                    <planeGeometry args={[3, 2.2]} />
                    <meshStandardMaterial
                        map={texture}
                        transparent
                        opacity={opacity}
                    />
                </mesh>

                {/* Glass frame effect */}
                <mesh position={[0, 0, -0.05]}>
                    <planeGeometry args={[3.2, 2.4]} />
                    <meshStandardMaterial
                        color={project.color}
                        transparent
                        opacity={0.3 * opacity}
                        metalness={0.8}
                        roughness={0.2}
                    />
                </mesh>

                {/* Glow when hovered */}
                {isHovered && (
                    <mesh position={[0, 0, -0.1]}>
                        <planeGeometry args={[3.4, 2.6]} />
                        <meshBasicMaterial
                            color={project.color}
                            transparent
                            opacity={0.2}
                        />
                    </mesh>
                )}

                {/* Project title */}
                <Text
                    position={[0, -1.4, 0.01]}
                    fontSize={0.2}
                    color="white"
                    anchorX="center"
                    anchorY="middle"
                    outlineWidth={0.02}
                    outlineColor="black"
                >
                    {project.title}
                </Text>
            </group>
        </group>
    )
}

export default ProjectCarousel
