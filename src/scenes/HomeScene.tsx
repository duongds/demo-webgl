import { Environment, Sparkles } from '@react-three/drei'
import Character from '../components/canvas/Character'
import DynamicLights from '../components/canvas/DynamicLights'
import Floor from '../components/canvas/Floor'
import FollowCamera from '../components/canvas/FollowCamera'
import Footprints from '../components/canvas/Footprints'
import Gallery from '../components/canvas/Gallery'
import { OutlineProvider } from '../components/canvas/OutlineProvider'
import useProximity from '../hooks/useProximity'

const HomeScene = () => {
    useProximity(3.5)
    return (
        // DISABLE Post-processing temporarily to fix LAG
        <OutlineProvider enabled={false} outlineColor="#6366f1">
            <DynamicLights enableColorCycle={true} cycleSpeed={0.1} />
            <Gallery />
            <Character />
            <Footprints />
            <Floor />

            {/* Third-person camera that follows the character */}
            <FollowCamera
                offset={[0, 4, 7]}
                lookAtOffset={[0, 0.8, 0]}
                smoothness={5}
            />

            {/* Atmospheric dust motes - drastically reduced */}
            <Sparkles
                count={50}
                scale={[30, 10, 30]}
                size={2}
                speed={0.1}
                opacity={0.1}
                color="#fff"
            />

            {/* Environment map for reflections */}
            <Environment preset="night" />
        </OutlineProvider>
    )
}

export default HomeScene

