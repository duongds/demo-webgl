import { Canvas } from '@react-three/fiber'
import { Suspense, useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import AudioControls from '../components/ui/AudioControls'
import NavigationMenu from '../components/ui/NavigationMenu'
import StoryScene from '@/scenes/StoryScene'
import InkLanding from '@/components/ui/InkLanding'

/**
 * StoryPage - Scroll-driven 3D character story experience
 * Inspired by Mousham Folio (https://mousham-folio.kryptoninc.co/)
 */
const StoryPage = () => {
    const containerRef = useRef<HTMLDivElement>(null)
    const [scrollProgress, setScrollProgress] = useState(0)
    const [hasStarted, setHasStarted] = useState(false)
    const [showLanding, setShowLanding] = useState(true)

    // Handle scroll to update progress
    useEffect(() => {
        const handleScroll = () => {
            if (!containerRef.current) return

            const scrollTop = containerRef.current.scrollTop
            const scrollHeight = containerRef.current.scrollHeight - containerRef.current.clientHeight
            const progress = Math.min(scrollTop / scrollHeight, 1)

            setScrollProgress(progress)

            // Hide landing after 10% scroll
            if (progress > 0.1) {
                setShowLanding(false)
            }
        }

        const container = containerRef.current
        if (container) {
            container.addEventListener('scroll', handleScroll, { passive: true })
        }

        return () => {
            if (container) {
                container.removeEventListener('scroll', handleScroll)
            }
        }
    }, [])

    const handleStartJourney = () => {
        setHasStarted(true)
        // Smooth scroll to start
        if (containerRef.current) {
            containerRef.current.scrollTo({
                top: 100,
                behavior: 'smooth'
            })
        }
    }

    return (
        <div className="relative w-full h-screen bg-[#0a0a1a] overflow-hidden">
            {/* Scroll Container */}
            <div
                ref={containerRef}
                className="absolute inset-0 overflow-y-auto overflow-x-hidden scroll-smooth"
                style={{ scrollBehavior: 'smooth' }}
            >
                {/* Scroll Space - 5x viewport for animation range */}
                <div className="h-[500vh] relative">
                    {/* Three.js Canvas - Fixed position */}
                    <div className="fixed inset-0 z-0">
                        <Canvas
                            shadows
                            gl={{
                                antialias: true,
                                toneMapping: THREE.ACESFilmicToneMapping,
                                toneMappingExposure: 1.2,
                            }}
                            dpr={[1, 2]}
                        >
                            <color attach="background" args={['#0a0a1a']} />
                            <fog attach="fog" args={['#0a0a1a', 15, 60]} />
                            <Suspense fallback={null}>
                                <StoryScene scrollProgress={scrollProgress} />
                            </Suspense>
                        </Canvas>
                    </div>

                    {/* Scroll Sections - Content Overlays */}
                    <div className="relative z-10 pointer-events-none">
                        {/* Section 1: Intro (0-20%) */}
                        <section className="h-[100vh] flex items-center justify-center">
                            <div
                                className="text-center transition-opacity duration-1000"
                                style={{ opacity: Math.max(0, 1 - scrollProgress * 5) }}
                            >
                                {!hasStarted && showLanding && (
                                    <div className="pointer-events-auto">
                                        <h2 className="text-white/60 text-lg tracking-[0.3em] uppercase mb-4">
                                            Welcome to
                                        </h2>
                                        <h1 className="text-5xl md:text-7xl font-light text-white tracking-tight mb-8">
                                            My Story
                                        </h1>
                                    </div>
                                )}
                            </div>
                        </section>

                        {/* Section 2: About Me (20-40%) */}
                        <section className="h-[100vh] flex items-center justify-start px-8 md:px-16">
                            <div
                                className="max-w-md transition-all duration-700"
                                style={{
                                    opacity: scrollProgress > 0.15 && scrollProgress < 0.35 ? 1 : 0,
                                    transform: `translateX(${scrollProgress > 0.15 && scrollProgress < 0.35 ? 0 : -50}px)`
                                }}
                            >
                                <h2 className="text-3xl font-light text-white mb-4">About Me</h2>
                                <p className="text-white/60 leading-relaxed">
                                    I'm a creative developer passionate about crafting immersive
                                    digital experiences that blend art and technology.
                                </p>
                            </div>
                        </section>

                        {/* Section 3: Skills (40-60%) */}
                        <section className="h-[100vh] flex items-center justify-end px-8 md:px-16">
                            <div
                                className="max-w-md text-right transition-all duration-700"
                                style={{
                                    opacity: scrollProgress > 0.35 && scrollProgress < 0.55 ? 1 : 0,
                                    transform: `translateX(${scrollProgress > 0.35 && scrollProgress < 0.55 ? 0 : 50}px)`
                                }}
                            >
                                <h2 className="text-3xl font-light text-white mb-4">Skills</h2>
                                <div className="flex flex-wrap gap-2 justify-end">
                                    {['Three.js', 'React', 'WebGL', 'TypeScript', 'GLSL'].map(skill => (
                                        <span
                                            key={skill}
                                            className="px-3 py-1 bg-white/10 rounded-full text-white/80 text-sm"
                                        >
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </section>

                        {/* Section 4: Projects (60-80%) */}
                        <section className="h-[100vh] flex items-center justify-center">
                            <div
                                className="text-center transition-all duration-700"
                                style={{
                                    opacity: scrollProgress > 0.55 && scrollProgress < 0.75 ? 1 : 0,
                                    transform: `scale(${scrollProgress > 0.55 && scrollProgress < 0.75 ? 1 : 0.9})`
                                }}
                            >
                                <h2 className="text-4xl font-light text-white mb-8">Featured Projects</h2>
                                <p className="text-white/60">Scroll to explore the gallery</p>
                            </div>
                        </section>

                        {/* Section 5: Contact (80-100%) */}
                        <section className="h-[100vh] flex items-center justify-center">
                            <div
                                className="text-center transition-all duration-700 pointer-events-auto"
                                style={{
                                    opacity: scrollProgress > 0.75 ? 1 : 0,
                                    transform: `translateY(${scrollProgress > 0.75 ? 0 : 30}px)`
                                }}
                            >
                                <h2 className="text-4xl font-light text-white mb-4">Let's Connect</h2>
                                <p className="text-white/60 mb-8">Interested in working together?</p>
                                <a
                                    href="mailto:hello@example.com"
                                    className="inline-block px-8 py-3 bg-white text-black rounded-full hover:scale-105 transition-transform"
                                >
                                    Get in Touch
                                </a>
                            </div>
                        </section>
                    </div>
                </div>
            </div>

            {/* 2D Ink Landing Overlay */}
            {showLanding && (
                <InkLanding
                    onStart={handleStartJourney}
                    isVisible={!hasStarted}
                />
            )}

            {/* Scroll Progress Indicator */}
            <div className="fixed right-6 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-2">
                {[0, 0.2, 0.4, 0.6, 0.8].map((threshold, i) => (
                    <div
                        key={i}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${scrollProgress >= threshold ? 'bg-white scale-125' : 'bg-white/30'
                            }`}
                    />
                ))}
            </div>

            {/* UI Overlay */}
            <div className="fixed inset-0 pointer-events-none z-30">
                <NavigationMenu />
                <AudioControls />
            </div>
        </div>
    )
}

export default StoryPage
