import { Select } from '@react-three/postprocessing'
import useGameStore from '../../stores/useGameStore'

import BearModel from './BearModel'
import CustomCharacterModel from './CustomCharacterModel'
import GLBCharacterModel from './GLBCharacterModel'

/**
 * StoryCharacter - Static/Idle character for the Story Page.
 * Doesn't attach movement controls, just renders the current character in idle state.
 */
const StoryCharacter = () => {
    const characterType = useGameStore((state) => state.characterType)

    return (
        <group>
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

export default StoryCharacter
