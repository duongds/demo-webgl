import useAudioManager from './hooks/useAudioManager'
import AppRouter from './router'

/**
 * Global audio controller to manage background music and SFX
 * Persists across page navigation
 */
const AudioController = () => {
    useAudioManager()
    return null
}

const App = () => {
    return (
        <>
            <AudioController />
            <AppRouter />
        </>
    )
}

export default App
