import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { useEffect } from 'react'
import useGameStore from '../../stores/useGameStore'

const HUD = () => {
    const isMoving = useGameStore((state) => state.character.isMoving)
    const nearestPainting = useGameStore((state) => state.nearestPainting)
    const selectedPainting = useGameStore((state) => state.selectedPainting)
    const setSelectedPainting = useGameStore((state) => state.setSelectedPainting)

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Using e.code 'Enter' is more robust than e.key
            if ((e.code === 'Enter' || e.key === 'Enter') && nearestPainting && !selectedPainting) {
                e.preventDefault() // Prevent any default action
                console.log('Action: Opening painting via ENTER key')
                setSelectedPainting(nearestPainting)
            }
        }

        // Ensure window is focused to capture keys
        window.focus()

        window.addEventListener('keydown', handleKeyDown, true) // Added capture phase
        return () => window.removeEventListener('keydown', handleKeyDown, true)
    }, [nearestPainting, selectedPainting, setSelectedPainting])

    const handlePromptClick = () => {
        if (nearestPainting) {
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
            <Dialog open={!!selectedPainting} onOpenChange={(open) => !open && setSelectedPainting(null)}>
                <DialogContent className="max-w-3xl bg-slate-950/90 border-slate-800 text-white">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-light tracking-tight">{selectedPainting?.title}</DialogTitle>
                        <DialogDescription className="text-slate-400">
                            Viewing artwork details from the digital gallery.
                        </DialogDescription>
                    </DialogHeader>
                    {selectedPainting && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
                            <div className="aspect-[4/3] rounded-lg overflow-hidden border border-slate-800 bg-black/50">
                                <img
                                    src={selectedPainting.url}
                                    alt={selectedPainting.title}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="flex flex-col gap-4">
                                <div>
                                    <h4 className="text-sm font-medium text-slate-500 uppercase tracking-wider">Description</h4>
                                    <p className="mt-2 text-slate-300">
                                        This is a placeholder description for <strong>{selectedPainting.title}</strong>.
                                        In a real application, this would contain information about the artist,
                                        technique, and history of the piece.
                                    </p>
                                </div>
                                <div className="mt-auto pt-4 border-t border-slate-800">
                                    <p className="text-xs text-slate-500 font-mono">
                                        ID: {selectedPainting.id}
                                    </p>
                                </div>
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

            {/* Simple status indicator instead of full debug info */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
                <div className="bg-black/60 backdrop-blur-sm px-4 py-2 rounded-full border border-white/10 text-white/70 text-[10px] font-mono flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${isMoving ? 'bg-green-500 animate-pulse' : 'bg-blue-500'}`} />
                    {isMoving ? 'EXPLORING' : 'IDLE'}
                </div>
                {nearestPainting && (
                    <div className="bg-amber-500/20 backdrop-blur-sm px-4 py-1 rounded-full border border-amber-500/30 text-amber-200 text-[9px] font-bold animate-pulse">
                        NEAR: {nearestPainting.title.toUpperCase()}
                    </div>
                )}
            </div>

            {/* Title */}
            <div className="absolute top-6 right-6 text-right">
                <h1 className="text-white/90 text-2xl font-extralight tracking-[0.2em] uppercase">
                    Virtual Gallery
                </h1>
                <div className="h-px w-24 bg-gradient-to-l from-white/40 to-transparent ml-auto mt-2" />
            </div>
        </>
    )
}

export default HUD
