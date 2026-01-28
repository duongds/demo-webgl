import { useAnimations, useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import useGameStore from '../../stores/useGameStore'

const MODEL_URL = '/models/robot.glb'

const PlayerModel = () => {
    const group = useRef<THREE.Group>(null)
    const { scene, animations } = useGLTF(MODEL_URL)
    const { actions } = useAnimations(animations, group)
    const [currentAction, setCurrentAction] = useState('Idle')

    const isMoving = useGameStore((state) => state.character.isMoving)
    const isRunning = useGameStore((state) => state.character.isRunning)

    // Apply custom sketch material to all meshes in the model
    useEffect(() => {
        scene.traverse((child) => {
            if (child instanceof THREE.Mesh) {
                child.material = new THREE.ShaderMaterial({
                    uniforms: {
                        uMap: { value: null },
                        uOpacity: { value: 1.0 },
                        uColor: { value: new THREE.Color(0, 0, 0) },
                        uStrokeColor: { value: new THREE.Color(0, 0, 0) },
                        uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
                        uTime: { value: 0 },
                        uJitter: { value: 0.08 },
                    },
                    vertexShader: `
                        varying vec2 vUv;
                        void main() {
                            vUv = uv;
                            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                        }
                    `,
                    fragmentShader: `
                        uniform float uTime;
                        uniform float uJitter;
                        varying vec2 vUv;

                        float hash(vec2 p) {
                            return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
                        }

                        void main() {
                            float speed = 12.0;
                            float time = floor(uTime * speed);
                            // Visual noise for the silhouette
                            float noise = hash(vUv + time);
                            
                            // Ink-like variation
                            float alpha = 1.0;
                            if (noise < uJitter) alpha = 0.8;
                            
                            gl_FragColor = vec4(0.05, 0.05, 0.05, alpha);
                        }
                    `,
                    transparent: true,
                })
            }
        })
    }, [scene])

    // Update uTime uniform
    useFrame((state) => {
        scene.traverse((child) => {
            if (child instanceof THREE.Mesh && child.material.uniforms) {
                child.material.uniforms.uTime.value = state.clock.elapsedTime
            }
        })
    })

    // Handle animations
    useEffect(() => {
        let nextAction = 'Idle'
        if (isRunning) nextAction = 'Running'
        else if (isMoving) nextAction = 'Walking'

        if (currentAction !== nextAction) {
            const prev = actions[currentAction]
            const next = actions[nextAction]

            if (next) {
                next.reset().fadeIn(0.2).play()
                if (prev) prev.fadeOut(0.2)
                setCurrentAction(nextAction)
            }
        }
    }, [isMoving, isRunning, actions, currentAction])

    // Initial animation
    useEffect(() => {
        if (actions['Idle']) {
            actions['Idle'].play()
        }
    }, [actions])

    return (
        <group ref={group} dispose={null} scale={0.4} position={[0, -0.6, 0]}>
            <primitive object={scene} />
        </group>
    )
}

useGLTF.preload(MODEL_URL)

export default PlayerModel
