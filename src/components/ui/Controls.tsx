const Controls = () => {
    return (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 flex gap-4 py-4 px-8 bg-black/60 backdrop-blur-md rounded-2xl border border-white/10">
            <div className="flex flex-col items-center gap-2">
                <div className="w-10 h-10 flex items-center justify-center bg-white/10 border border-white/20 rounded-lg text-sm font-medium">🖱️</div>
                <span className="text-xs opacity-60">Rotate</span>
            </div>
            <div className="flex flex-col items-center gap-2">
                <div className="w-10 h-10 flex items-center justify-center bg-white/10 border border-white/20 rounded-lg text-sm font-medium">⚙️</div>
                <span className="text-xs opacity-60">Scroll to Zoom</span>
            </div>
            <div className="flex flex-col items-center gap-2">
                <div className="w-10 h-10 flex items-center justify-center bg-white/10 border border-white/20 rounded-lg text-sm font-medium">⌨️</div>
                <span className="text-xs opacity-60">WASD - Move (Soon)</span>
            </div>
        </div>
    )
}

export default Controls
