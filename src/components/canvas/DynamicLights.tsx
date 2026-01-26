import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'

interface DynamicLightsProps {
    /** Enable time-based color cycling */
    enableColorCycle?: boolean
    /** Speed of color transition (0.1 = slow, 1 = fast) */
    cycleSpeed?: number
    /** Base ambient intensity */
    ambientIntensity?: number
}

/**
 * DynamicLights - Creates atmospheric lighting that changes over time
 * Features:
 * - Slowly cycling accent light colors
 * - Subtle intensity breathing effect
 * - Maintains visibility while adding ambiance
 */
const DynamicLights = ({
    enableColorCycle = true,
    cycleSpeed = 0.15,
    ambientIntensity = 0.4,
}: DynamicLightsProps) => {
    const accentLightRef = useRef<THREE.DirectionalLight>(null)
    const fillLightRef = useRef<THREE.PointLight>(null)

    // Color palette for cycling - gallery mood colors
    const colors = useMemo(() => [
        new THREE.Color('#764ba2'), // Purple
        new THREE.Color('#667eea'), // Indigo
        new THREE.Color('#5a67d8'), // Blue-indigo
        new THREE.Color('#6366f1'), // Primary indigo
        new THREE.Color('#8b5cf6'), // Violet
    ], [])

    useFrame(({ clock }) => {
        if (!enableColorCycle) return

        const time = clock.getElapsedTime() * cycleSpeed

        // Smooth color interpolation between palette colors
        const colorIndex = Math.floor(time) % colors.length
        const nextColorIndex = (colorIndex + 1) % colors.length
        const t = time % 1 // Fraction for lerp

        const currentColor = colors[colorIndex].clone()
        currentColor.lerp(colors[nextColorIndex], t)

        // Apply to accent light
        if (accentLightRef.current) {
            accentLightRef.current.color.copy(currentColor)
            // Subtle breathing effect on intensity
            const breathe = Math.sin(time * 2) * 0.1 + 0.9
            accentLightRef.current.intensity = 0.4 * breathe
        }

        // Fill light with complementary color
        if (fillLightRef.current) {
            const complementary = currentColor.clone()
            complementary.offsetHSL(0.5, 0, 0) // Shift hue by 180 degrees
            fillLightRef.current.color.copy(complementary)
            fillLightRef.current.intensity = 0.15
        }
    })

    return (
        <>
            {/* Soft ambient light - always on */}
            <ambientLight intensity={ambientIntensity} />

            {/* Main directional light (like the sun) */}
            <directionalLight
                position={[5, 8, 5]}
                intensity={1.0}
                castShadow
                shadow-mapSize-width={512}
                shadow-mapSize-height={512}
                shadow-camera-far={50}
                shadow-camera-left={-10}
                shadow-camera-right={10}
                shadow-camera-top={10}
                shadow-camera-bottom={-10}
            />

            {/* Dynamic accent light - color cycles */}
            <directionalLight
                ref={accentLightRef}
                position={[-5, 4, -5]}
                intensity={0.4}
                color="#764ba2"
            />

            {/* Dynamic fill light - complementary color */}
            <pointLight
                ref={fillLightRef}
                position={[0, 3, 0]}
                intensity={0.15}
                color="#48bb78"
                distance={20}
                decay={2}
            />

            {/* Rim light for character visibility */}
            <directionalLight
                position={[0, 5, -8]}
                intensity={0.2}
                color="#e2e8f0"
            />
        </>
    )
}

export default DynamicLights
