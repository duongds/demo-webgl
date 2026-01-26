import { Html, useProgress } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { Suspense, useEffect, useState } from 'react'
import * as THREE from 'three'
import HUD from './components/ui/HUD'
import HomeScene from './scenes/HomeScene'

const LoadingScreen = ({ onStarted }: { onStarted: () => void }) => {
    const { progress } = useProgress()

    useEffect(() => {
        if (progress === 100) {
            setTimeout(onStarted, 500)
        }
    }, [progress, onStarted])

    return (
        <Html center>
            <div className="flex flex-col items-center gap-4 text-white">
                <div className="text-4xl font-extralight tracking-[0.3em] uppercase mb-4">
                    Gallery
                </div>
                <div className="w-64 h-px bg-white/10 relative overflow-hidden">
                    <div
                        className="absolute h-full bg-white transition-all duration-300 ease-out"
                        style={{ width: `${progress}%` }}
                    />
                </div>
                <div className="text-[10px] font-mono tracking-widest text-white/40 uppercase">
                    Loading {Math.round(progress)}%
                </div>
            </div>
        </Html>
    )
}

const App = () => {
    const [hasStarted, setHasStarted] = useState(false)

    return (
        <div className="relative w-full h-screen bg-[#0a0a0a]">
            {/* Three.js Canvas Container */}
            <div className={`fixed inset-0 z-0 transition-opacity duration-1000 ${hasStarted ? 'opacity-100' : 'opacity-0'}`}>
                <Canvas
                    shadows
                    gl={{
                        antialias: true,
                        toneMapping: THREE.ACESFilmicToneMapping,
                        toneMappingExposure: 1.0,
                    }}
                    dpr={[1, 2]}
                >
                    <color attach="background" args={['#0a0a0a']} />
                    <Suspense fallback={<LoadingScreen onStarted={() => setHasStarted(true)} />}>
                        <HomeScene />
                    </Suspense>
                </Canvas>
            </div>

            {/* UI Overlay */}
            <div className={`fixed inset-0 pointer-events-none z-10 transition-opacity duration-1000 delay-500 ${hasStarted ? 'opacity-100' : 'opacity-0'}`}>
                <HUD />
            </div>
        </div>
    )
}

export default App
