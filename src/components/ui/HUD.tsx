import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { useEffect } from 'react'
import useAudioManager from '../../hooks/useAudioManager'
import useGameStore from '../../stores/useGameStore'

const HUD = () => {
    const isMoving = useGameStore((state) => state.character.isMoving)
    const nearestPainting = useGameStore((state) => state.nearestPainting)
    const selectedPainting = useGameStore((state) => state.selectedPainting)
    const setSelectedPainting = useGameStore((state) => state.setSelectedPainting)
    const paintings = useGameStore((state) => state.paintings)
    const characterType = useGameStore((state) => state.characterType)
    const setCharacterType = useGameStore((state) => state.setCharacterType)

    const { playSfx } = useAudioManager()

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.code === 'Enter' || e.key === 'Enter') && nearestPainting && !selectedPainting) {
                e.preventDefault()
                setSelectedPainting(nearestPainting)
                playSfx('uiClick')
            }

            if (selectedPainting) {
                if (e.key === 'ArrowRight') {
                    handleNext()
                } else if (e.key === 'ArrowLeft') {
                    handlePrev()
                } else if (e.key === 'Escape') {
                    setSelectedPainting(null)
                    playSfx('uiClick')
                }
            }
        }

        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [nearestPainting, selectedPainting, setSelectedPainting, paintings, playSfx])

    const handleNext = () => {
        playSfx('uiClick')
        if (!selectedPainting || paintings.length === 0) return
        const currentIndex = paintings.findIndex(p => p.id === selectedPainting.id)
        const nextIndex = (currentIndex + 1) % paintings.length
        setSelectedPainting(paintings[nextIndex])
    }

    const handlePrev = () => {
        playSfx('uiClick')
        if (!selectedPainting || paintings.length === 0) return
        const currentIndex = paintings.findIndex(p => p.id === selectedPainting.id)
        const prevIndex = (currentIndex - 1 + paintings.length) % paintings.length
        setSelectedPainting(paintings[prevIndex])
    }

    const handlePromptClick = () => {
        if (nearestPainting) {
            playSfx('uiClick')
            console.log('Opening painting via CLICK:', nearestPainting.title)
            setSelectedPainting(nearestPainting)
        }
    }

    return (
        <>
            {/* Interaction Prompt */}
            {nearestPainting && !selectedPainting && (
                <div
                    onClick={handlePromptClick}
                    onMouseEnter={() => playSfx('uiHover')}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[120px] flex flex-col items-center gap-2 animate-in fade-in zoom-in duration-300 cursor-pointer group pointer-events-auto"
                >
                    <div className="bg-white text-black px-6 py-3 rounded-full font-bold text-sm shadow-2xl flex items-center gap-3 group-hover:scale-110 transition-transform">
                        <kbd className="px-2 py-1 bg-black/10 rounded text-xs">ENTER</kbd>
                        <span>View {nearestPainting.title}</span>
                    </div>
                    <span className="text-white/60 text-[10px] uppercase tracking-widest font-medium">Click or Press Enter</span>
                </div>
            )}

            {/* Painting Detail View */}
            <Dialog open={!!selectedPainting} onOpenChange={(open) => {
                if (!open) {
                    setSelectedPainting(null)
                    playSfx('uiClick')
                }
            }}>
                <DialogContent className="max-w-3xl bg-slate-950/90 border-slate-800 text-white">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-light tracking-tight">{selectedPainting?.title}</DialogTitle>
                        <DialogDescription className="text-slate-400">
                            Viewing artwork details from the digital gallery.
                        </DialogDescription>
                    </DialogHeader>
                    {selectedPainting && (
                        <div className="relative">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
                                <div className="group relative aspect-[4/3] rounded-lg overflow-hidden border border-slate-800 bg-black/50">
                                    <img
                                        key={selectedPainting.id}
                                        src={selectedPainting.url}
                                        alt={selectedPainting.title}
                                        className="w-full h-full object-cover transition-all duration-700 animate-in fade-in slide-in-from-right-4"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                                        <p className="text-[10px] font-mono text-white/60 tracking-widest uppercase">HD View Active</p>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-4">
                                    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 delay-150">
                                        <h4 className="text-sm font-medium text-slate-500 uppercase tracking-wider">Description</h4>
                                        <p className="mt-2 text-slate-300 leading-relaxed">
                                            This is a placeholder description for <strong>{selectedPainting.title}</strong>.
                                            In a real application, this would contain information about the artist,
                                            technique, and history of the piece.
                                        </p>
                                    </div>
                                    <div className="mt-auto pt-4 border-t border-slate-800 flex justify-between items-center">
                                        <p className="text-xs text-slate-500 font-mono">
                                            ID: {selectedPainting.id}
                                        </p>
                                        <div className="flex items-center gap-1 text-[10px] text-slate-500">
                                            <kbd className="px-1.5 py-0.5 bg-slate-800 rounded">ESC</kbd>
                                            <span>to close</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Navigation Arrows inside Dialog */}
                            <div className="flex justify-between items-center mt-6 pt-4 border-t border-slate-800/50">
                                <button
                                    onClick={handlePrev}
                                    onMouseEnter={() => playSfx('uiHover')}
                                    className="px-4 py-2 flex items-center gap-2 text-sm text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors group"
                                >
                                    <span className="group-hover:-translate-x-1 transition-transform">←</span>
                                    <span>Previous</span>
                                </button>
                                <div className="flex gap-1">
                                    {paintings.map((p) => (
                                        <div
                                            key={p.id}
                                            className={`h-1 w-4 rounded-full transition-all ${p.id === selectedPainting.id ? 'bg-white w-8' : 'bg-slate-800'}`}
                                        />
                                    ))}
                                </div>
                                <button
                                    onClick={handleNext}
                                    onMouseEnter={() => playSfx('uiHover')}
                                    className="px-4 py-2 flex items-center gap-2 text-sm text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors group"
                                >
                                    <span>Next</span>
                                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                                </button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* Controls hint */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-sm px-6 py-3 rounded-2xl border border-white/10 pointer-events-none">
                <div className="flex items-center gap-6 text-white/80 text-sm">
                    <div className="flex items-center gap-2">
                        <div className="flex gap-1">
                            <kbd className="px-2 py-1 bg-white/10 rounded text-xs font-mono">W</kbd>
                        </div>
                        <div className="flex gap-1">
                            <kbd className="px-2 py-1 bg-white/10 rounded text-xs font-mono">A</kbd>
                            <kbd className="px-2 py-1 bg-white/10 rounded text-xs font-mono">S</kbd>
                            <kbd className="px-2 py-1 bg-white/10 rounded text-xs font-mono">D</kbd>
                        </div>
                    </div>
                    <span className="text-white/40">to move</span>
                    <div className="w-px h-4 bg-white/10" />
                    <div className="flex items-center gap-2">
                        <kbd className="px-2 py-1 bg-white/10 rounded text-xs font-mono">ENTER</kbd>
                        <span className="text-white/40">to view art</span>
                    </div>
                </div>
            </div>

            {/* Status & Character Selector */}
            <div className="absolute top-4 left-4 flex flex-col gap-3">
                <div className="bg-black/60 backdrop-blur-sm px-4 py-2 rounded-full border border-white/10 text-white/70 text-[10px] font-mono flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${isMoving ? 'bg-green-500 animate-pulse' : 'bg-blue-500'}`} />
                    {isMoving ? 'EXPLORING' : 'IDLE'}
                </div>

                {/* Character Selection */}
                <div className="bg-black/60 backdrop-blur-md px-2 py-2 rounded-2xl border border-white/10 flex flex-col gap-2 pointer-events-auto">
                    <p className="text-[10px] text-white/40 font-mono text-center uppercase tracking-widest px-2">Character</p>
                    <div className="flex gap-1">
                        <button
                            onClick={() => {
                                setCharacterType('human')
                                playSfx('uiClick')
                            }}
                            onMouseEnter={() => playSfx('uiHover')}
                            className={`flex-1 px-4 py-2 rounded-xl text-[10px] font-bold transition-all ${characterType === 'human' ? 'bg-white text-black underline underline-offset-4' : 'text-white/60 hover:bg-white/5'}`}
                        >
                            HUMAN
                        </button>
                        <button
                            onClick={() => {
                                setCharacterType('bear')
                                playSfx('uiClick')
                            }}
                            onMouseEnter={() => playSfx('uiHover')}
                            className={`flex-1 px-4 py-2 rounded-xl text-[10px] font-bold transition-all ${characterType === 'bear' ? 'bg-white text-black underline underline-offset-4' : 'text-white/60 hover:bg-white/5'}`}
                        >
                            BEAR
                        </button>
                        <button
                            onClick={() => {
                                setCharacterType('robot')
                                playSfx('uiClick')
                            }}
                            onMouseEnter={() => playSfx('uiHover')}
                            className={`flex-1 px-4 py-2 rounded-xl text-[10px] font-bold transition-all ${characterType === 'robot' ? 'bg-white text-black underline underline-offset-4' : 'text-white/60 hover:bg-white/5'}`}
                        >
                            ROBOT
                        </button>
                    </div>
                </div>

                {nearestPainting && (
                    <div className="bg-amber-500/20 backdrop-blur-sm px-4 py-1 rounded-full border border-amber-500/30 text-amber-200 text-[9px] font-bold animate-pulse">
                        NEAR: {nearestPainting.title.toUpperCase()}
                    </div>
                )}
            </div>

            {/* Title */}
            <div className="absolute top-6 right-6 text-right">
                <h1 className="text-white/90 text-lg font-extralight tracking-[0.2em] uppercase">
                    Virtual Gallery
                </h1>
                <div className="h-px w-24 bg-gradient-to-l from-white/40 to-transparent ml-auto mt-2" />
            </div>
        </>
    )
}

export default HUD
