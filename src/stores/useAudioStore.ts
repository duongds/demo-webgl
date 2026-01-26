import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AudioState {
    // Volume settings (0-1)
    masterVolume: number
    musicVolume: number
    sfxVolume: number
    
    // Mute states
    isMuted: boolean
    isMusicPlaying: boolean
    
    // Actions
    setMasterVolume: (volume: number) => void
    setMusicVolume: (volume: number) => void
    setSfxVolume: (volume: number) => void
    toggleMute: () => void
    toggleMusic: () => void
}

const useAudioStore = create<AudioState>()(
    persist(
        (set) => ({
            masterVolume: 0.7,
            musicVolume: 0.5,
            sfxVolume: 0.6,
            isMuted: false,
            isMusicPlaying: true,
            
            setMasterVolume: (volume) => set({ masterVolume: Math.max(0, Math.min(1, volume)) }),
            setMusicVolume: (volume) => set({ musicVolume: Math.max(0, Math.min(1, volume)) }),
            setSfxVolume: (volume) => set({ sfxVolume: Math.max(0, Math.min(1, volume)) }),
            toggleMute: () => set((state) => ({ isMuted: !state.isMuted })),
            toggleMusic: () => set((state) => ({ isMusicPlaying: !state.isMusicPlaying })),
        }),
        {
            name: 'gallery-audio-settings',
        }
    )
)

export default useAudioStore
