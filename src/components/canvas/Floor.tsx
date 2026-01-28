import { useMemo } from 'react'
import * as THREE from 'three'

const Floor = () => {
    // Create a procedural polished stone texture
    const gridTexture = useMemo(() => {
        const size = 512
        const canvas = document.createElement('canvas')
        canvas.width = size
        canvas.height = size
        const ctx = canvas.getContext('2d')!

        // Background - light paper
        ctx.fillStyle = '#f0f0f0'
        ctx.fillRect(0, 0, size, size)

        // Subtle paper grain
        for (let i = 0; i < 10000; i++) {
            const x = Math.random() * size
            const y = Math.random() * size
            const alpha = Math.random() * 0.1
            const shade = Math.random() * 50 + 200
            ctx.fillStyle = `rgba(${shade}, ${shade}, ${shade}, ${alpha})`
            ctx.fillRect(x, y, 1, 1)
        }

        // Slab lines (sketchy)
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.05)'
        ctx.lineWidth = 1

        const slabSize = 256
        for (let i = 0; i <= size; i += slabSize) {
            ctx.beginPath()
            ctx.moveTo(i + (Math.random() - 0.5) * 5, 0);
            ctx.lineTo(i + (Math.random() - 0.5) * 5, size);
            ctx.stroke()

            ctx.beginPath()
            ctx.moveTo(0, i + (Math.random() - 0.5) * 5);
            ctx.lineTo(size, i + (Math.random() - 0.5) * 5);
            ctx.stroke()
        }

        const texture = new THREE.CanvasTexture(canvas)
        texture.wrapS = THREE.RepeatWrapping
        texture.wrapT = THREE.RepeatWrapping
        texture.repeat.set(20, 20)

        return texture
    }, [])

    return (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
            <planeGeometry args={[100, 100]} />
            <meshStandardMaterial
                map={gridTexture}
                metalness={0.4}
                roughness={0.05}
            />
        </mesh>
    )
}

export default Floor
