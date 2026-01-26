import { useProgress } from '@react-three/drei'
import { useEffect, useRef, useState } from 'react'

interface LoadingScreenProps {
    onComplete: () => void
}

/**
 * Premium Loading Screen with modern animations
 * Features: Glitch text, animated progress bar, floating particles, smooth transitions
 */
const LoadingScreen = ({ onComplete }: LoadingScreenProps) => {
    const { progress, active } = useProgress()
    const hasCalledComplete = useRef(false)
    const [displayProgress, setDisplayProgress] = useState(0)
    const [isExiting, setIsExiting] = useState(false)

    // Smooth progress animation
    useEffect(() => {
        const targetProgress = Math.round(progress)
        if (displayProgress < targetProgress) {
            const timer = setTimeout(() => {
                setDisplayProgress(prev => Math.min(prev + 1, targetProgress))
            }, 20)
            return () => clearTimeout(timer)
        }
    }, [progress, displayProgress])

    // Handle completion
    useEffect(() => {
        if ((progress === 100 || !active) && !hasCalledComplete.current) {
            hasCalledComplete.current = true
            setDisplayProgress(100)
            // Start exit animation
            setTimeout(() => {
                setIsExiting(true)
            }, 500)
            // Complete after exit animation
            setTimeout(onComplete, 1500)
        }
    }, [progress, active, onComplete])

    return (
        <div
            className={`fixed inset-0 z-50 overflow-hidden transition-opacity duration-1000 ${isExiting ? 'opacity-0' : 'opacity-100'
                }`}
            style={{ background: 'linear-gradient(135deg, #0a0a12 0%, #1a1a2e 50%, #0a0a12 100%)' }}
        >
            {/* Animated background grid */}
            <div className="absolute inset-0 opacity-20">
                <div
                    className="absolute inset-0"
                    style={{
                        backgroundImage: `
                            linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
                        `,
                        backgroundSize: '50px 50px',
                        animation: 'gridMove 20s linear infinite',
                    }}
                />
            </div>

            {/* Floating particles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(20)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute rounded-full bg-white/10"
                        style={{
                            width: `${Math.random() * 4 + 2}px`,
                            height: `${Math.random() * 4 + 2}px`,
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animation: `floatParticle ${Math.random() * 10 + 10}s ease-in-out infinite`,
                            animationDelay: `${Math.random() * 5}s`,
                        }}
                    />
                ))}
            </div>

            {/* Gradient orbs */}
            <div
                className="absolute w-[600px] h-[600px] rounded-full blur-[120px] opacity-20"
                style={{
                    background: 'radial-gradient(circle, rgba(99,102,241,0.4) 0%, transparent 70%)',
                    left: '-200px',
                    top: '-200px',
                    animation: 'orbFloat 15s ease-in-out infinite',
                }}
            />
            <div
                className="absolute w-[500px] h-[500px] rounded-full blur-[100px] opacity-15"
                style={{
                    background: 'radial-gradient(circle, rgba(236,72,153,0.4) 0%, transparent 70%)',
                    right: '-150px',
                    bottom: '-150px',
                    animation: 'orbFloat 12s ease-in-out infinite reverse',
                }}
            />

            {/* Main content */}
            <div className="relative z-10 flex flex-col items-center justify-center h-full">
                {/* Logo container with glow */}
                <div className="relative mb-16">
                    {/* Glow effect */}
                    <div
                        className="absolute inset-0 blur-3xl opacity-50"
                        style={{
                            background: 'linear-gradient(90deg, #6366f1, #ec4899, #6366f1)',
                            backgroundSize: '200% 100%',
                            animation: 'shimmer 3s ease-in-out infinite',
                        }}
                    />

                    {/* Main title with glitch effect */}
                    <h1
                        className="relative text-6xl md:text-8xl font-extralight tracking-[0.3em] uppercase text-white"
                        style={{
                            textShadow: '0 0 40px rgba(99, 102, 241, 0.5)',
                        }}
                    >
                        <span className="relative inline-block" style={{ animation: 'glitchText 5s ease-in-out infinite' }}>
                            Gallery
                        </span>
                    </h1>

                    {/* Subtitle */}
                    <p className="text-center text-white/40 text-sm tracking-[0.5em] uppercase mt-4 font-light">
                        Virtual Experience
                    </p>
                </div>

                {/* Progress section */}
                <div className="w-80 md:w-96">
                    {/* Progress bar container */}
                    <div className="relative h-[2px] bg-white/10 rounded-full overflow-hidden mb-6">
                        {/* Progress bar fill */}
                        <div
                            className="absolute inset-y-0 left-0 rounded-full transition-all duration-300 ease-out"
                            style={{
                                width: `${displayProgress}%`,
                                background: 'linear-gradient(90deg, #6366f1, #8b5cf6, #ec4899)',
                                boxShadow: '0 0 20px rgba(99, 102, 241, 0.5), 0 0 40px rgba(236, 72, 153, 0.3)',
                            }}
                        />

                        {/* Animated shine effect */}
                        <div
                            className="absolute inset-0"
                            style={{
                                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                                animation: 'progressShine 2s ease-in-out infinite',
                            }}
                        />
                    </div>

                    {/* Progress info */}
                    <div className="flex justify-between items-center text-white/50 text-xs tracking-widest uppercase">
                        <span className="font-mono">Loading Assets</span>
                        <span className="font-mono tabular-nums">{displayProgress}%</span>
                    </div>

                    {/* Loading dots animation */}
                    <div className="flex justify-center gap-2 mt-8">
                        {[0, 1, 2].map((i) => (
                            <div
                                key={i}
                                className="w-2 h-2 rounded-full bg-white/30"
                                style={{
                                    animation: 'loadingDot 1.4s ease-in-out infinite',
                                    animationDelay: `${i * 0.2}s`,
                                }}
                            />
                        ))}
                    </div>
                </div>

                {/* Bottom hint */}
                <div className="absolute bottom-12 text-white/20 text-xs tracking-widest uppercase animate-pulse">
                    Preparing your experience
                </div>
            </div>

            {/* Corner decorations */}
            <div className="absolute top-8 left-8 w-16 h-16 border-l border-t border-white/10" />
            <div className="absolute top-8 right-8 w-16 h-16 border-r border-t border-white/10" />
            <div className="absolute bottom-8 left-8 w-16 h-16 border-l border-b border-white/10" />
            <div className="absolute bottom-8 right-8 w-16 h-16 border-r border-b border-white/10" />

            {/* Inline styles for animations */}
            <style>{`
                @keyframes gridMove {
                    0% { transform: translate(0, 0); }
                    100% { transform: translate(50px, 50px); }
                }
                
                @keyframes floatParticle {
                    0%, 100% { 
                        transform: translateY(0) translateX(0);
                        opacity: 0.3;
                    }
                    50% { 
                        transform: translateY(-100px) translateX(20px);
                        opacity: 0.8;
                    }
                }
                
                @keyframes orbFloat {
                    0%, 100% { transform: translate(0, 0) scale(1); }
                    50% { transform: translate(50px, 30px) scale(1.1); }
                }
                
                @keyframes shimmer {
                    0% { background-position: 200% 0; }
                    100% { background-position: -200% 0; }
                }
                
                @keyframes glitchText {
                    0%, 90%, 100% { 
                        transform: translate(0);
                        text-shadow: 0 0 40px rgba(99, 102, 241, 0.5);
                    }
                    92% { 
                        transform: translate(-2px, 1px);
                        text-shadow: 2px 0 #ec4899, -2px 0 #6366f1, 0 0 40px rgba(99, 102, 241, 0.5);
                    }
                    94% { 
                        transform: translate(2px, -1px);
                        text-shadow: -2px 0 #ec4899, 2px 0 #6366f1, 0 0 40px rgba(99, 102, 241, 0.5);
                    }
                    96% { 
                        transform: translate(-1px, 2px);
                        text-shadow: 1px 0 #ec4899, -1px 0 #6366f1, 0 0 40px rgba(99, 102, 241, 0.5);
                    }
                    98% { 
                        transform: translate(1px, -2px);
                        text-shadow: -1px 0 #ec4899, 1px 0 #6366f1, 0 0 40px rgba(99, 102, 241, 0.5);
                    }
                }
                
                @keyframes progressShine {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(100%); }
                }
                
                @keyframes loadingDot {
                    0%, 80%, 100% { 
                        transform: scale(0.8);
                        opacity: 0.3;
                    }
                    40% { 
                        transform: scale(1.2);
                        opacity: 1;
                    }
                }
            `}</style>
        </div>
    )
}

export default LoadingScreen
