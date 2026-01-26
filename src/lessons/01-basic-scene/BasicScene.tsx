import { OrbitControls, Stats } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import { useControls } from 'leva';
import { useRef } from 'react';
import * as THREE from 'three';

function RotatingBox() {
    const meshRef = useRef<THREE.Mesh>(null);

    // Leva controls for interactive debugging
    const { color, wireframe, speed } = useControls('Box', {
        color: '#6366f1',
        wireframe: false,
        speed: { value: 1, min: 0, max: 5, step: 0.1 },
    });

    // Animation loop - runs every frame
    useFrame((state, delta) => {
        if (meshRef.current) {
            meshRef.current.rotation.x += delta * speed * 0.5;
            meshRef.current.rotation.y += delta * speed;
        }
    });

    return (
        <mesh ref={meshRef}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color={color} wireframe={wireframe} />
        </mesh>
    );
}

function BasicScene() {
    return (
        <Canvas
            camera={{ position: [3, 3, 3], fov: 50 }}
            style={{ background: '#0a0a0f' }}
        >
            {/* Lighting */}
            <ambientLight intensity={0.5} />
            <directionalLight position={[5, 5, 5]} intensity={1} />

            {/* Our rotating box */}
            <RotatingBox />

            {/* Grid helper for reference */}
            <gridHelper args={[10, 10, '#333', '#222']} />

            {/* Camera controls */}
            <OrbitControls enableDamping dampingFactor={0.05} />

            {/* Performance stats */}
            <Stats />
        </Canvas>
    );
}

export default BasicScene;
