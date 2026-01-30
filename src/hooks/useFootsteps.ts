import { useCallback, useEffect, useRef } from 'react'
import * as THREE from 'three'
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

    const leftStep = useRef(true)

    // Play footstep with round-robin selection
    const playFootstep = useCallback(() => {
        if (audioPool.current.length === 0 || isMuted) return
        
        const audio = audioPool.current[currentIndex.current]
        audio.currentTime = 0
        audio.play().catch(() => {})
        
        // Alternate between sounds
        currentIndex.current = (currentIndex.current + 1) % audioPool.current.length

        // Add visual footprint
        const { position, rotation } = useGameStore.getState().character
        const addFootprint = useGameStore.getState().addFootprint
        
        // Calculate offset for left/right foot
        // Adjusted for small robot scale (0.2 -> 0.4 effective width?)
        // Robot scale 0.2 means it's very small. 0.2 width is huge for it.
        // Let's try 0.08
        const sideOffset = leftStep.current ? -0.08 : 0.08
        const angle = rotation
        const offsetX = Math.cos(angle) * sideOffset
        const offsetZ = -Math.sin(angle) * sideOffset
        
        const footPos = position.clone().add(new THREE.Vector3(offsetX, 0.01, offsetZ))
        addFootprint(footPos, rotation)
        
        leftStep.current = !leftStep.current
    }, [isMuted, currentIndex])

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

