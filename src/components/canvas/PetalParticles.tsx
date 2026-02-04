import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'

interface PetalParticlesProps {
    count?: number
}

/**
 * PetalParticles - Falling cherry blossom petals
 * Uses instanced meshes for performance
 */
const PetalParticles = ({ count = 100 }: PetalParticlesProps) => {
    const meshRef = useRef<THREE.InstancedMesh>(null)

    // Particle data
    const particles = useMemo(() => {
        return Array.from({ length: count }, () => ({
            position: new THREE.Vector3(
                (Math.random() - 0.5) * 40,
                Math.random() * 25 + 5,
                (Math.random() - 0.5) * 40
            ),
            velocity: new THREE.Vector3(
                (Math.random() - 0.5) * 0.5,
                -Math.random() * 0.5 - 0.2,
                (Math.random() - 0.5) * 0.5
            ),
            rotation: new THREE.Euler(
                Math.random() * Math.PI,
                Math.random() * Math.PI,
                Math.random() * Math.PI
            ),
            rotationSpeed: new THREE.Vector3(
                (Math.random() - 0.5) * 2,
                (Math.random() - 0.5) * 2,
                (Math.random() - 0.5) * 2
            ),
            scale: 0.1 + Math.random() * 0.15,
        }))
    }, [count])

    // Initialize instances
    useMemo(() => {
        if (!meshRef.current) return

        const dummy = new THREE.Object3D()

        particles.forEach((particle, i) => {
            dummy.position.copy(particle.position)
            dummy.rotation.copy(particle.rotation)
            dummy.scale.setScalar(particle.scale)
            dummy.updateMatrix()
            meshRef.current!.setMatrixAt(i, dummy.matrix)
        })

        meshRef.current.instanceMatrix.needsUpdate = true
    }, [particles])

    // Animate particles
    useFrame((state, delta) => {
        if (!meshRef.current) return

        const dummy = new THREE.Object3D()
        const time = state.clock.elapsedTime

        particles.forEach((particle, i) => {
            // Update position
            particle.position.x += particle.velocity.x * delta
            particle.position.y += particle.velocity.y * delta
            particle.position.z += particle.velocity.z * delta

            // Add wind drift
            particle.position.x += Math.sin(time * 0.5 + i) * 0.01
            particle.position.z += Math.cos(time * 0.3 + i) * 0.01

            // Reset if below ground
            if (particle.position.y < -2) {
                particle.position.y = 25 + Math.random() * 5
                particle.position.x = (Math.random() - 0.5) * 40
                particle.position.z = (Math.random() - 0.5) * 40
            }

            // Update rotation
            particle.rotation.x += particle.rotationSpeed.x * delta
            particle.rotation.y += particle.rotationSpeed.y * delta
            particle.rotation.z += particle.rotationSpeed.z * delta

            // Update matrix
            dummy.position.copy(particle.position)
            dummy.rotation.copy(particle.rotation)
            dummy.scale.setScalar(particle.scale)
            dummy.updateMatrix()
            meshRef.current!.setMatrixAt(i, dummy.matrix)
        })

        meshRef.current.instanceMatrix.needsUpdate = true
    })

    return (
        <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
            {/* Petal shape - flat circle */}
            <circleGeometry args={[1, 5]} />
            <meshStandardMaterial
                color="#ffc0cb"
                emissive="#ff69b4"
                emissiveIntensity={0.2}
                side={THREE.DoubleSide}
                transparent
                opacity={0.8}
            />
        </instancedMesh>
    )
}

export default PetalParticles
