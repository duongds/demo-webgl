
import Painting from './Painting'

interface WallProps {
    position: [number, number, number]
    rotation: [number, number, number]
    size: [number, number]
}

const Wall = ({ position, rotation, size }: WallProps) => {
    return (
        <mesh position={position} rotation={rotation} receiveShadow>
            <planeGeometry args={[size[0], size[1]]} />
            <meshStandardMaterial color="#1f1f3a" roughness={0.7} metalness={0.1} />
        </mesh>
    )
}

const Gallery = () => {
    const roomSize = 30
    const wallHeight = 8

    return (
        <group>
            {/* Front Wall */}
            <Wall
                position={[0, wallHeight / 2, -roomSize / 2]}
                rotation={[0, 0, 0]}
                size={[roomSize, wallHeight]}
            />

            {/* Back Wall */}
            <Wall
                position={[0, wallHeight / 2, roomSize / 2]}
                rotation={[0, Math.PI, 0]}
                size={[roomSize, wallHeight]}
            />

            {/* Left Wall */}
            <Wall
                position={[-roomSize / 2, wallHeight / 2, 0]}
                rotation={[0, Math.PI / 2, 0]}
                size={[roomSize, wallHeight]}
            />

            {/* Right Wall */}
            <Wall
                position={[roomSize / 2, wallHeight / 2, 0]}
                rotation={[0, -Math.PI / 2, 0]}
                size={[roomSize, wallHeight]}
            />

            {/* Ceiling */}
            <mesh position={[0, wallHeight, 0]} rotation={[Math.PI / 2, 0, 0]}>
                <planeGeometry args={[roomSize, roomSize]} />
                <meshStandardMaterial color="#0a0a1a" roughness={0.9} />
            </mesh>

            {/* Paintings on Front Wall */}
            <Painting
                id="painting-1"
                url="https://picsum.photos/400/300?random=1"
                position={[-5, 2.5, -roomSize / 2 + 0.1]}
                rotation={[0, 0, 0]}
                title="Midnight Serenity"
            />
            <Painting
                id="painting-2"
                url="https://picsum.photos/400/300?random=2"
                position={[0, 2.5, -roomSize / 2 + 0.1]}
                rotation={[0, 0, 0]}
                title="Urban Echoes"
            />
            <Painting
                id="painting-3"
                url="https://picsum.photos/400/300?random=3"
                position={[5, 2.5, -roomSize / 2 + 0.1]}
                rotation={[0, 0, 0]}
                title="Distant Horizons"
            />

            {/* Paintings on Left Wall */}
            <Painting
                id="painting-4"
                url="https://picsum.photos/400/300?random=4"
                position={[-roomSize / 2 + 0.1, 2.5, -5]}
                rotation={[0, Math.PI / 2, 0]}
                title="Abstract Pulse"
            />
            <Painting
                id="painting-5"
                url="https://picsum.photos/400/300?random=5"
                position={[-roomSize / 2 + 0.1, 2.5, 5]}
                rotation={[0, Math.PI / 2, 0]}
                title="Chromatic Flow"
            />

            {/* Paintings on Right Wall */}
            <Painting
                id="painting-6"
                url="https://picsum.photos/400/300?random=6"
                position={[roomSize / 2 - 0.1, 2.5, -5]}
                rotation={[0, -Math.PI / 2, 0]}
                title="Fractured Light"
            />
            <Painting
                id="painting-7"
                url="https://picsum.photos/400/300?random=7"
                position={[roomSize / 2 - 0.1, 2.5, 5]}
                rotation={[0, -Math.PI / 2, 0]}
                title="Veiled Reality"
            />
        </group>
    )
}

export default Gallery
