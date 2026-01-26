import { useFrame } from '@react-three/fiber'
import { Select } from '@react-three/postprocessing'
import { useRef } from 'react'
import * as THREE from 'three'
import useCharacterMovement from '../../hooks/useCharacterMovement'
import useFootsteps from '../../hooks/useFootsteps'
import useGameStore from '../../stores/useGameStore'

import PlayerModel from './PlayerModel'

const Character = () => {
    const groupRef = useRef<THREE.Group>(null)
    // Initialize movement, but use store directly in useFrame for absolute sync
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
            groupRef.current.position.set(storePos.x, 0.6, storePos.z)
            groupRef.current.rotation.y = storeState.character.rotation
        }
    })

    return (
        <group ref={groupRef}>
            {/* Wrap with Select for outline effect */}
            <Select enabled>
                <PlayerModel />
            </Select>
        </group>
    )
}

export default Character

