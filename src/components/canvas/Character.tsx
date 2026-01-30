import { useFrame } from '@react-three/fiber'
import { Select } from '@react-three/postprocessing'
import { useRef } from 'react'
import * as THREE from 'three'
import useCharacterMovement from '../../hooks/useCharacterMovement'
import useFootsteps from '../../hooks/useFootsteps'
import useGameStore from '../../stores/useGameStore'

import BearModel from './BearModel'
import CustomCharacterModel from './CustomCharacterModel'
import GLBCharacterModel from './GLBCharacterModel'

const Character = () => {
    const groupRef = useRef<THREE.Group>(null)
    const characterType = useGameStore((state) => state.characterType)

    // Initialize movement
    useCharacterMovement({
        speed: 8,
        friction: 0.88,
        rotationSpeed: 12,
    })
    useFootsteps()

    // Update group position and rotation
    useFrame(() => {
        if (groupRef.current) {
            const storeState = useGameStore.getState()
            const storePos = storeState.character.position
            groupRef.current.position.set(storePos.x, 0.5, storePos.z)
            groupRef.current.rotation.y = storeState.character.rotation
        }
    })

    return (
        <group ref={groupRef}>
            {/* Wrap with Select for outline effect */}
            <Select enabled>
                {characterType === 'human' && <CustomCharacterModel />}
                {characterType === 'bear' && <BearModel />}
                {characterType === 'robot' && (
                    <GLBCharacterModel
                        modelPath="/models/robot.glb"
                        scale={0.2}
                        shadowSize={0.6}
                        verticalOffset={-0.5}
                    />
                )}
            </Select>
        </group>
    )
}

export default Character
