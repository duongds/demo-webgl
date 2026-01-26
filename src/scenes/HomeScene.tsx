import { Environment, Sparkles } from '@react-three/drei'
import Character from '../components/canvas/Character'
import Floor from '../components/canvas/Floor'
import FollowCamera from '../components/canvas/FollowCamera'
import Gallery from '../components/canvas/Gallery'
import Lights from '../components/canvas/Lights'
import useProximity from '../hooks/useProximity'

const HomeScene = () => {
    useProximity(3.5)
    return (
        <>
            <Lights />
            <Gallery />
            <Character />
            <Floor />

            {/* Third-person camera that follows the character */}
            <FollowCamera
                offset={[0, 4, 7]}
                lookAtOffset={[0, 0.8, 0]}
                smoothness={5}
            />

            {/* Atmospheric dust motes */}
            <Sparkles
                count={200}
                scale={[30, 10, 30]}
                size={1.5}
                speed={0.2}
                opacity={0.3}
                color="#fff"
            />

            {/* Environment map for reflections */}
            <Environment preset="night" />
        </>
    )
}

export default HomeScene
