import { useCallback, useEffect, useRef } from 'react'
import useAudioStore from '../stores/useAudioStore'
import useGameStore from '../stores/useGameStore'

// Multiple footstep sounds for variation
const FOOTSTEP_URLS = [
    'https://assets.mixkit.co/active_storage/sfx/2092/2092-preview.mp3',
    'https://assets.mixkit.co/active_storage/sfx/2093/2093-preview.mp3',
]

const useFootsteps = () => {
    const isMoving = useGameStore((state) => state.character.isMoving)
    const isRunning = useGameStore((state) => state.character.isRunning)
    
    const { masterVolume, sfxVolume, isMuted } = useAudioStore()
    
    const audioPool = useRef<HTMLAudioElement[]>([])
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
    const currentIndex = useRef(0)

    // Calculate effective volume
    const effectiveVolume = isMuted ? 0 : masterVolume * sfxVolume * 0.4

    // Initialize audio pool
    useEffect(() => {
        audioPool.current = FOOTSTEP_URLS.map(url => {
            const audio = new Audio(url)
            audio.preload = 'auto'
            return audio
        })

        return () => {
            audioPool.current.forEach(audio => {
                audio.pause()
                audio.src = ''
            })
        }
    }, [])

    // Update volumes
    useEffect(() => {
        audioPool.current.forEach(audio => {
            audio.volume = effectiveVolume
        })
    }, [effectiveVolume])

    // Play footstep with round-robin selection
    const playFootstep = useCallback(() => {
        if (audioPool.current.length === 0 || isMuted) return
        
        const audio = audioPool.current[currentIndex.current]
        audio.currentTime = 0
        audio.play().catch(() => {})
        
        // Alternate between sounds
        currentIndex.current = (currentIndex.current + 1) % audioPool.current.length
    }, [isMuted])

    // Handle movement sound
    useEffect(() => {
        if (isMoving && !isMuted) {
            const pace = isRunning ? 250 : 400

            // Initial step
            playFootstep()

            intervalRef.current = setInterval(playFootstep, pace)
        } else {
            if (intervalRef.current) {
                clearInterval(intervalRef.current)
                intervalRef.current = null
            }
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current)
                intervalRef.current = null
            }
        }
    }, [isMoving, isRunning, isMuted, playFootstep])
}

export default useFootsteps

