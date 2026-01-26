import { Canvas } from '@react-three/fiber'
import { Suspense, useCallback, useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import AudioControls from '../components/ui/AudioControls'
import HUD from '../components/ui/HUD'
import LoadingScreen from '../components/ui/LoadingScreen'
import NavigationMenu from '../components/ui/NavigationMenu'
import VirtualJoystick from '../components/ui/VirtualJoystick'
import HomeScene from '../scenes/HomeScene'

const Home = () => {
    const [isLoading, setIsLoading] = useState(true)
    const [hasStarted, setHasStarted] = useState(false)
    const mountedRef = useRef(false)

    // Handle case when assets are already cached
    useEffect(() => {
        mountedRef.current = true

        const timer = setTimeout(() => {
            if (mountedRef.current && isLoading) {
                setIsLoading(false)
                setHasStarted(true)
            }
        }, 500)

        return () => {
            mountedRef.current = false
            clearTimeout(timer)
        }
    }, [])

    const handleLoadingComplete = useCallback(() => {
        setIsLoading(false)
        requestAnimationFrame(() => {
            setHasStarted(true)
        })
    }, [])

    return (
        <div className="relative w-full h-screen bg-[#0a0a0a]">
            {/* Loading Screen with Sketch Shader */}
            {isLoading && (
                <LoadingScreen onComplete={handleLoadingComplete} />
            )}

            {/* Three.js Main Scene Canvas */}
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
                    <Suspense fallback={null}>
                        <HomeScene />
                    </Suspense>
                </Canvas>
            </div>

            {/* UI Overlay */}
            <div className={`fixed inset-0 pointer-events-none z-10 transition-opacity duration-700 ${hasStarted ? 'opacity-100' : 'opacity-0'}`}>
                <HUD />
                <NavigationMenu />
                <AudioControls />
            </div>

            {/* Mobile Touch Controls */}
            {hasStarted && <VirtualJoystick />}
        </div>
    )
}

export default Home


