import { MeshReflectorMaterial } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'

interface WaterPlaneProps {
    position?: [number, number, number]
    rotation?: [number, number, number]
    width?: number
    height?: number
    color?: string
}

/**
 * WaterPlane - Reflective water surface with ripples
 * Generates procedural noise for distortion to create wave effects
 */
const WaterPlane = ({
    position = [0, -5, 0],
    rotation = [-Math.PI / 2, 0, 0],
    width = 100,
    height = 100,
    color = "#103050"
}: WaterPlaneProps) => {
    // Generate a procedural noise texture for ripples
    const distortionMap = useMemo(() => {
        const canvas = document.createElement('canvas')
        const size = 512
        canvas.width = size
        canvas.height = size
        const ctx = canvas.getContext('2d')!

        ctx.fillStyle = 'white'
        ctx.fillRect(0, 0, size, size)

        // Draw random noise
        for (let i = 0; i < 20000; i++) {
            const x = Math.random() * size
            const y = Math.random() * size
            const radius = Math.random() * 20 + 5
            const grey = Math.floor(Math.random() * 255)

            ctx.beginPath()
            ctx.arc(x, y, radius, 0, Math.PI * 2)
            ctx.fillStyle = `rgba(${grey}, ${grey}, ${grey}, 0.1)`
            ctx.fill()
        }

        const texture = new THREE.CanvasTexture(canvas)
        texture.wrapS = THREE.RepeatWrapping
        texture.wrapT = THREE.RepeatWrapping
        texture.repeat.set(4, 4)
        return texture
    }, [])

    const materialRef = useRef<any>(null)

    useFrame((state) => {
        if (distortionMap) {
            // Animate texture offset to simulate flow
            distortionMap.offset.x = state.clock.elapsedTime * 0.05
            distortionMap.offset.y = state.clock.elapsedTime * 0.03
        }
    })

    return (
        <mesh
            position={position}
            rotation={rotation}
            receiveShadow
        >
            <planeGeometry args={[width, height]} />
            <MeshReflectorMaterial
                ref={materialRef}
                blur={[300, 100]}
                resolution={1024}
                mixBlur={1}
                mixStrength={40}
                roughness={1}
                depthScale={1.2}
                minDepthThreshold={0.4}
                maxDepthThreshold={1.4}
                color={color}
                metalness={0.6}
                mirror={0.7}
                distortion={1}
                distortionMap={distortionMap}
            />
        </mesh>
    )
}

export default WaterPlane
