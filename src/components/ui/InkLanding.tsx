import { useEffect, useState } from 'react'
import useAudioManager from '../../hooks/useAudioManager'

interface InkLandingProps {
    onStart: () => void
    isVisible: boolean
}

/**
 * InkLanding - 2D ink-style landing overlay with "boiling" effect
 * Inspired by the Torii gate from Mousham Folio
 */
const InkLanding = ({ onStart, isVisible }: InkLandingProps) => {
    const [isAnimating, setIsAnimating] = useState(true)
    const { playSfx, startMusic } = useAudioManager()

    useEffect(() => {
        // Start boiling animation after mount
        const timer = setTimeout(() => setIsAnimating(true), 100)
        return () => clearTimeout(timer)
    }, [])

    const handleClick = () => {
        playSfx('uiClick')
        startMusic()
        setIsAnimating(false)
        setTimeout(onStart, 300)
    }

    return (
        <div
            className={`
                fixed inset-0 flex flex-col items-center justify-center
                transition-all duration-1000
                ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}
            `}
            style={{
                zIndex: 100,
                background: 'linear-gradient(to bottom, #f5f0e6 0%, #e8e0d0 100%)',
            }}
        >
            {/* Ink Splatters Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(8)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute rounded-full bg-black/5"
                        style={{
                            width: `${Math.random() * 100 + 50}px`,
                            height: `${Math.random() * 100 + 50}px`,
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            filter: 'blur(20px)',
                        }}
                    />
                ))}
            </div>

            {/* Main Illustration Container */}
            <div className={`relative ${isAnimating ? 'animate-boil' : ''}`}>
                {/* Stylized Character/Logo SVG */}
                <svg
                    viewBox="0 0 400 500"
                    className="w-64 md:w-80 h-auto"
                    style={{ filter: 'drop-shadow(0 4px 20px rgba(0,0,0,0.1))' }}
                >
                    {/* Torii Gate Inspired Shape */}
                    <g className="ink-stroke" stroke="#1a1a1a" strokeWidth="4" fill="none">
                        {/* Top beam */}
                        <path
                            d="M 50 120 Q 200 100 350 120"
                            className={isAnimating ? 'animate-ink-draw' : ''}
                            strokeLinecap="round"
                        />
                        {/* Second beam */}
                        <path
                            d="M 70 160 L 330 160"
                            className={isAnimating ? 'animate-ink-draw-delay' : ''}
                            strokeLinecap="round"
                        />
                        {/* Left pillar */}
                        <path
                            d="M 100 160 L 100 400"
                            className={isAnimating ? 'animate-ink-draw-delay-2' : ''}
                            strokeLinecap="round"
                        />
                        {/* Right pillar */}
                        <path
                            d="M 300 160 L 300 400"
                            className={isAnimating ? 'animate-ink-draw-delay-2' : ''}
                            strokeLinecap="round"
                        />
                    </g>

                    {/* Red accent on gate */}
                    <rect
                        x="90" y="110" width="220" height="15"
                        fill="#c41e3a"
                        rx="2"
                        className={isAnimating ? 'animate-fade-in' : ''}
                    />

                    {/* Character silhouette in the gate */}
                    <g fill="#1a1a1a" className={isAnimating ? 'animate-character-appear' : ''}>
                        {/* Head */}
                        <ellipse cx="200" cy="280" rx="25" ry="28" />
                        {/* Body */}
                        <ellipse cx="200" cy="350" rx="35" ry="45" />
                        {/* Arms */}
                        <ellipse cx="155" cy="340" rx="12" ry="35" transform="rotate(-15 155 340)" />
                        <ellipse cx="245" cy="340" rx="12" ry="35" transform="rotate(15 245 340)" />
                    </g>

                    {/* Water reflection effect */}
                    <g opacity="0.3" transform="translate(0, 80) scale(1, -0.3)">
                        <path d="M 100 400 L 100 300" stroke="#1a1a1a" strokeWidth="3" />
                        <path d="M 300 400 L 300 300" stroke="#1a1a1a" strokeWidth="3" />
                    </g>
                </svg>

                {/* Floating particles */}
                {isAnimating && (
                    <div className="absolute inset-0 overflow-visible pointer-events-none">
                        {[...Array(12)].map((_, i) => (
                            <div
                                key={i}
                                className="absolute w-1 h-1 bg-black/20 rounded-full animate-float-particle"
                                style={{
                                    left: `${Math.random() * 100}%`,
                                    top: `${Math.random() * 100}%`,
                                    animationDelay: `${Math.random() * 3}s`,
                                    animationDuration: `${3 + Math.random() * 2}s`,
                                }}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Title */}
            <h1
                className="mt-8 text-3xl md:text-4xl font-light text-[#1a1a1a] tracking-[0.5em] uppercase"
                style={{ fontFamily: 'serif' }}
            >
                Story
            </h1>

            {/* Start Button */}
            <button
                onClick={handleClick}
                onMouseEnter={() => playSfx('uiHover')}
                className="
                    mt-12 px-8 py-3 
                    border-2 border-[#1a1a1a] rounded-full
                    text-[#1a1a1a] uppercase tracking-[0.3em] text-sm
                    hover:bg-[#1a1a1a] hover:text-[#f5f0e6]
                    transition-all duration-300
                    hover:scale-105 active:scale-95
                "
            >
                Start Your Journey
            </button>

            {/* Scroll hint */}
            <div className="absolute bottom-8 flex flex-col items-center gap-2 text-[#1a1a1a]/50">
                <span className="text-xs uppercase tracking-widest">or scroll down</span>
                <div className="w-5 h-8 border-2 border-current rounded-full flex justify-center pt-1">
                    <div className="w-1 h-2 bg-current rounded-full animate-bounce" />
                </div>
            </div>

            {/* Boiling Animation Styles */}
            <style>{`
                @keyframes boil {
                    0%, 100% { transform: translate(0, 0) rotate(0deg); }
                    25% { transform: translate(0.5px, -0.5px) rotate(0.2deg); }
                    50% { transform: translate(-0.5px, 0.5px) rotate(-0.2deg); }
                    75% { transform: translate(0.5px, 0.5px) rotate(0.1deg); }
                }
                
                .animate-boil {
                    animation: boil 0.15s infinite;
                }
                
                @keyframes ink-draw {
                    from { stroke-dashoffset: 400; }
                    to { stroke-dashoffset: 0; }
                }
                
                .animate-ink-draw {
                    stroke-dasharray: 400;
                    animation: ink-draw 1.5s ease-out forwards;
                }
                
                .animate-ink-draw-delay {
                    stroke-dasharray: 300;
                    stroke-dashoffset: 300;
                    animation: ink-draw 1s ease-out 0.3s forwards;
                }
                
                .animate-ink-draw-delay-2 {
                    stroke-dasharray: 250;
                    stroke-dashoffset: 250;
                    animation: ink-draw 0.8s ease-out 0.6s forwards;
                }
                
                @keyframes fade-in {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                
                .animate-fade-in {
                    opacity: 0;
                    animation: fade-in 0.5s ease-out 0.8s forwards;
                }
                
                @keyframes character-appear {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                
                .animate-character-appear {
                    opacity: 0;
                    animation: character-appear 0.8s ease-out 1s forwards;
                }
                
                @keyframes float-particle {
                    0%, 100% { transform: translate(0, 0) rotate(0deg); opacity: 0.3; }
                    50% { transform: translate(10px, -15px) rotate(180deg); opacity: 0.6; }
                }
                
                .animate-float-particle {
                    animation: float-particle 4s ease-in-out infinite;
                }
            `}</style>
        </div>
    )
}

export default InkLanding
