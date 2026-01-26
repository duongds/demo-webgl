import { useCallback, useEffect, useRef } from 'react'
import useAudioStore from '../stores/useAudioStore'

// Free ambient music URLs (royalty-free)
const AMBIENT_TRACKS = [
    'https://assets.mixkit.co/music/preview/mixkit-serene-view-443.mp3', // Calm ambient
]

// Sound effect URLs
const SFX = {
    footstep1: 'https://assets.mixkit.co/active_storage/sfx/2092/2092-preview.mp3',
    footstep2: 'https://assets.mixkit.co/active_storage/sfx/2093/2093-preview.mp3',
    uiClick: 'https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3',
    uiHover: 'https://assets.mixkit.co/active_storage/sfx/2572/2572-preview.mp3',
}

/**
 * Audio Manager Hook
 * Handles all audio playback with volume controls
 */
const useAudioManager = () => {
    const { masterVolume, musicVolume, sfxVolume, isMuted, isMusicPlaying } = useAudioStore()
    
    const bgMusicRef = useRef<HTMLAudioElement | null>(null)
    const sfxPoolRef = useRef<Map<string, HTMLAudioElement>>(new Map())
    const isInitializedRef = useRef(false)

    // Calculate effective volumes
    const effectiveMusicVolume = isMuted ? 0 : masterVolume * musicVolume
    const effectiveSfxVolume = isMuted ? 0 : masterVolume * sfxVolume

    // Initialize audio elements
    useEffect(() => {
        if (isInitializedRef.current) return
        isInitializedRef.current = true

        // Create background music element
        bgMusicRef.current = new Audio(AMBIENT_TRACKS[0])
        bgMusicRef.current.loop = true
        bgMusicRef.current.volume = effectiveMusicVolume

        // Preload SFX
        Object.entries(SFX).forEach(([key, url]) => {
            const audio = new Audio(url)
            audio.preload = 'auto'
            sfxPoolRef.current.set(key, audio)
        })

        return () => {
            bgMusicRef.current?.pause()
            sfxPoolRef.current.forEach(audio => audio.pause())
        }
    }, [])

    // Update music volume
    useEffect(() => {
        if (bgMusicRef.current) {
            bgMusicRef.current.volume = effectiveMusicVolume
        }
    }, [effectiveMusicVolume])

    // Handle music play/pause
    useEffect(() => {
        if (!bgMusicRef.current) return

        if (isMusicPlaying && !isMuted) {
            // Need user interaction first, so we try to play
            bgMusicRef.current.play().catch(() => {
                // Auto-play blocked, will play on first user interaction
            })
        } else {
            bgMusicRef.current.pause()
        }
    }, [isMusicPlaying, isMuted])

    // Play a sound effect
    const playSfx = useCallback((sfxName: keyof typeof SFX) => {
        const audio = sfxPoolRef.current.get(sfxName)
        if (audio && !isMuted) {
            audio.volume = effectiveSfxVolume
            audio.currentTime = 0
            audio.play().catch(() => {})
        }
    }, [effectiveSfxVolume, isMuted])

    // Play footstep with variation
    const playFootstep = useCallback(() => {
        const sfxName = Math.random() > 0.5 ? 'footstep1' : 'footstep2'
        playSfx(sfxName)
    }, [playSfx])

    // Start background music (call after user interaction)
    const startMusic = useCallback(() => {
        if (bgMusicRef.current && isMusicPlaying && !isMuted) {
            bgMusicRef.current.play().catch(() => {})
        }
    }, [isMusicPlaying, isMuted])

    return {
        playSfx,
        playFootstep,
        startMusic,
    }
}

export default useAudioManager
