import { useAnimations, useGLTF } from '@react-three/drei'
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
