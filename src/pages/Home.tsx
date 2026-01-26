import { Html, useProgress } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { Suspense, useCallback, useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import HUD from '../components/ui/HUD'
import NavigationMenu from '../components/ui/NavigationMenu'
import HomeScene from '../scenes/HomeScene'

interface LoadingScreenProps {
    onLoaded: () => void
}

const LoadingScreen = ({ onLoaded }: LoadingScreenProps) => {
    const { progress, active } = useProgress()
    const hasCalledLoaded = useRef(false)

    useEffect(() => {
        // Call onLoaded when progress reaches 100 or when loading becomes inactive
        if ((progress === 100 || !active) && !hasCalledLoaded.current) {
            hasCalledLoaded.current = true
            // Small delay for smoother transition
            setTimeout(onLoaded, 300)
        }
    }, [progress, active, onLoaded])

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

const Home = () => {
    const [hasStarted, setHasStarted] = useState(false)
    const mountedRef = useRef(false)

    // Handle case when assets are already cached (no Suspense fallback shown)
    useEffect(() => {
        mountedRef.current = true

        // If after a short delay we still haven't started, force start
        // This handles the case when assets are cached and Suspense doesn't suspend
        const timer = setTimeout(() => {
            if (mountedRef.current && !hasStarted) {
                setHasStarted(true)
            }
        }, 100)

        return () => {
            mountedRef.current = false
            clearTimeout(timer)
        }
    }, []) // Only run on mount

    const handleLoaded = useCallback(() => {
        // Give a moment for the scene to be fully rendered
        requestAnimationFrame(() => {
            setHasStarted(true)
        })
    }, [])

    return (
        <div className="relative w-full h-screen bg-[#0a0a0a]">
            {/* Three.js Canvas Container */}
            <div className={`fixed inset-0 z-0 transition-opacity duration-700 ${hasStarted ? 'opacity-100' : 'opacity-0'}`}>
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
                    <Suspense fallback={<LoadingScreen onLoaded={handleLoaded} />}>
                        <HomeScene />
                    </Suspense>
                </Canvas>
            </div>

            {/* UI Overlay */}
            <div className={`fixed inset-0 pointer-events-none z-10 transition-opacity duration-700 ${hasStarted ? 'opacity-100' : 'opacity-0'}`}>
                <HUD />
                <NavigationMenu />
            </div>
        </div>
    )
}

export default Home

