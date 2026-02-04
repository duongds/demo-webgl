import { Music, Music2, Volume2, VolumeX } from 'lucide-react'
import { useState } from 'react'
import useAudioManager from '../../hooks/useAudioManager'
import useAudioStore from '../../stores/useAudioStore'

/**
 * Audio Controls Component
 * Provides UI for controlling audio settings
 */
const AudioControls = () => {
    const [isExpanded, setIsExpanded] = useState(false)
    const { playSfx } = useAudioManager()
    const {
        masterVolume,
        musicVolume,
        sfxVolume,
        isMuted,
        isMusicPlaying,
        setMasterVolume,
        setMusicVolume,
        setSfxVolume,
        toggleMute,
        toggleMusic,
    } = useAudioStore()

    return (
        <div className="fixed bottom-8 right-8 z-40 pointer-events-auto">
            {/* Expanded Panel */}
            <div
                className={`absolute bottom-14 right-0 w-64 transition-all duration-300 ease-out ${isExpanded
                    ? 'opacity-100 translate-y-0 pointer-events-auto'
                    : 'opacity-0 translate-y-4 pointer-events-none'
                    }`}
            >
                <div className="bg-black/80 backdrop-blur-xl rounded-2xl border border-white/10 p-5 shadow-2xl">
                    <h3 className="text-white/90 text-sm font-medium tracking-wider uppercase mb-4">
                        Audio Settings
                    </h3>

                    {/* Master Volume */}
                    <div className="mb-4">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-white/60 text-xs uppercase tracking-wide">Master</span>
                            <span className="text-white/40 text-xs font-mono">{Math.round(masterVolume * 100)}%</span>
                        </div>
                        <input
                            type="range"
                            min="0"
                            max="100"
                            value={masterVolume * 100}
                            onChange={(e) => setMasterVolume(Number(e.target.value) / 100)}
                            className="w-full h-1 bg-white/10 rounded-full appearance-none cursor-pointer
                                       [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 
                                       [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full 
                                       [&::-webkit-slider-thumb]:bg-gradient-to-r [&::-webkit-slider-thumb]:from-indigo-500 
                                       [&::-webkit-slider-thumb]:to-pink-500 [&::-webkit-slider-thumb]:cursor-pointer
                                       [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:shadow-indigo-500/50"
                        />
                    </div>

                    {/* Music Volume */}
                    <div className="mb-4">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-white/60 text-xs uppercase tracking-wide">Music</span>
                            <span className="text-white/40 text-xs font-mono">{Math.round(musicVolume * 100)}%</span>
                        </div>
                        <input
                            type="range"
                            min="0"
                            max="100"
                            value={musicVolume * 100}
                            onChange={(e) => setMusicVolume(Number(e.target.value) / 100)}
                            className="w-full h-1 bg-white/10 rounded-full appearance-none cursor-pointer
                                       [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 
                                       [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full 
                                       [&::-webkit-slider-thumb]:bg-gradient-to-r [&::-webkit-slider-thumb]:from-purple-500 
                                       [&::-webkit-slider-thumb]:to-blue-500 [&::-webkit-slider-thumb]:cursor-pointer"
                        />
                    </div>

                    {/* SFX Volume */}
                    <div className="mb-5">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-white/60 text-xs uppercase tracking-wide">Effects</span>
                            <span className="text-white/40 text-xs font-mono">{Math.round(sfxVolume * 100)}%</span>
                        </div>
                        <input
                            type="range"
                            min="0"
                            max="100"
                            value={sfxVolume * 100}
                            onChange={(e) => setSfxVolume(Number(e.target.value) / 100)}
                            className="w-full h-1 bg-white/10 rounded-full appearance-none cursor-pointer
                                       [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 
                                       [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full 
                                       [&::-webkit-slider-thumb]:bg-gradient-to-r [&::-webkit-slider-thumb]:from-green-500 
                                       [&::-webkit-slider-thumb]:to-teal-500 [&::-webkit-slider-thumb]:cursor-pointer"
                        />
                    </div>

                    {/* Toggle Buttons */}
                    <div className="flex gap-2">
                        <button
                            onClick={() => {
                                toggleMusic()
                                playSfx('uiClick')
                            }}
                            onMouseEnter={() => playSfx('uiHover')}
                            className={`flex-1 py-2 px-3 rounded-lg text-xs uppercase tracking-wide transition-all duration-200 flex items-center justify-center gap-2 ${isMusicPlaying
                                ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                                : 'bg-white/5 text-white/40 border border-white/10 hover:bg-white/10'
                                }`}
                        >
                            {isMusicPlaying ? <Music2 size={14} /> : <Music size={14} />}
                            Music
                        </button>
                    </div>
                </div>
            </div>

            {/* Toggle Button */}
            <button
                onClick={() => {
                    setIsExpanded(!isExpanded)
                    playSfx('uiClick')
                }}
                onMouseEnter={() => playSfx('uiHover')}
                onDoubleClick={() => {
                    toggleMute()
                    playSfx('uiClick')
                }}
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300
                           backdrop-blur-xl border shadow-lg ${isMuted
                        ? 'bg-red-500/20 border-red-500/30 text-red-400'
                        : 'bg-black/60 border-white/10 text-white/80 hover:bg-black/80 hover:border-white/20'
                    }`}
                title="Click to expand, double-click to mute"
            >
                {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </button>
        </div>
    )
}

export default AudioControls
