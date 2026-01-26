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

        // Background - very dark grey
        ctx.fillStyle = '#111111'
        ctx.fillRect(0, 0, size, size)

        // Subtle noise/grain
        for (let i = 0; i < 5000; i++) {
            const x = Math.random() * size
            const y = Math.random() * size
            const alpha = Math.random() * 0.05
            ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`
            ctx.fillRect(x, y, 1, 1)
        }

        // Slab lines (cleaner than the grid)
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)'
        ctx.lineWidth = 1

        const slabSize = 128
        for (let i = 0; i <= size; i += slabSize) {
            ctx.beginPath()
            ctx.moveTo(i, 0); ctx.lineTo(i, size); ctx.stroke()
            ctx.beginPath()
            ctx.moveTo(0, i); ctx.lineTo(size, i); ctx.stroke()
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
