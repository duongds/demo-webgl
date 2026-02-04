import { Info, X } from 'lucide-react'
import { useState } from 'react'
import { Link, useLocation } from 'react-router'
import useAudioManager from '../../hooks/useAudioManager'

interface NavLinkProps {
    to: string
    children: React.ReactNode
    onClick?: () => void
    onHover?: () => void
}

const NavLink = ({ to, children, onClick, onHover }: NavLinkProps) => {
    const location = useLocation()
    const isActive = location.pathname === to

    return (
        <Link
            to={to}
            onClick={onClick}
            onMouseEnter={onHover}
            className={`
                relative px-6 py-3 text-sm uppercase tracking-[0.3em] 
                transition-all duration-300 group
                ${isActive ? 'text-white' : 'text-white/50 hover:text-white'}
            `}
        >
            {children}
            {/* Active indicator */}
            <span
                className={`
                    absolute bottom-0 left-1/2 -translate-x-1/2 h-px bg-white
                    transition-all duration-300
                    ${isActive ? 'w-full opacity-100' : 'w-0 opacity-0 group-hover:w-1/2 group-hover:opacity-50'}
                `}
            />
        </Link>
    )
}

interface NavigationMenuProps {
    /** Show menu as floating button (default) or inline */
    variant?: 'floating' | 'inline'
}

const NavigationMenu = ({ variant = 'floating' }: NavigationMenuProps) => {
    const [isOpen, setIsOpen] = useState(false)
    const { playSfx } = useAudioManager()

    const handleHover = () => playSfx('uiHover')
    const handleClick = () => playSfx('uiClick')

    if (variant === 'inline') {
        return (
            <nav className="flex items-center gap-2">
                <NavLink to="/" onHover={handleHover} onClick={handleClick}>Gallery</NavLink>
                <NavLink to="/story" onHover={handleHover} onClick={handleClick}>Story</NavLink>
                <NavLink to="/about" onHover={handleHover} onClick={handleClick}>About</NavLink>
            </nav>
        )
    }

    return (
        <>
            {/* Floating Menu Button */}
            <button
                onClick={() => {
                    setIsOpen(true)
                    handleClick()
                }}
                onMouseEnter={handleHover}
                className="
                    fixed top-6 right-6 z-50 
                    w-12 h-12 rounded-full 
                    bg-white/5 backdrop-blur-xl border border-white/10
                    flex items-center justify-center
                    hover:bg-white/10 hover:border-white/20
                    transition-all duration-300
                    pointer-events-auto
                "
                aria-label="Open navigation menu"
            >
                <Info className="w-5 h-5 text-white/80" />
            </button>

            {/* Full Screen Menu Overlay */}
            <div
                className={`
                    fixed inset-0 z-[100] 
                    bg-black/90 backdrop-blur-xl
                    flex flex-col items-center justify-center
                    transition-all duration-500
                    ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
                `}
            >
                {/* Close Button */}
                <button
                    onClick={() => {
                        setIsOpen(false)
                        handleClick()
                    }}
                    onMouseEnter={handleHover}
                    className="
                        absolute top-6 right-6
                        w-12 h-12 rounded-full
                        bg-white/5 border border-white/10
                        flex items-center justify-center
                        hover:bg-white/10 hover:border-white/20
                        transition-all duration-300
                    "
                    aria-label="Close navigation menu"
                >
                    <X className="w-5 h-5 text-white" />
                </button>

                {/* Logo */}
                <div className="mb-16">
                    <h2 className="text-3xl font-extralight tracking-[0.5em] uppercase text-white/80">
                        Gallery
                    </h2>
                </div>

                {/* Navigation Links */}
                <nav className="flex flex-col items-center gap-2">
                    <Link
                        to="/"
                        onClick={() => {
                            setIsOpen(false)
                            handleClick()
                        }}
                        onMouseEnter={handleHover}
                        className="
                            text-4xl md:text-5xl font-extralight tracking-[0.2em] uppercase
                            text-white/40 hover:text-white
                            transition-all duration-300
                            hover:tracking-[0.3em]
                            py-4
                        "
                    >
                        Home
                    </Link>
                    <Link
                        to="/story"
                        onClick={() => {
                            setIsOpen(false)
                            handleClick()
                        }}
                        onMouseEnter={handleHover}
                        className="
                            text-4xl md:text-5xl font-extralight tracking-[0.2em] uppercase
                            text-white/40 hover:text-white
                            transition-all duration-300
                            hover:tracking-[0.3em]
                            py-4
                        "
                    >
                        Story
                    </Link>
                    <Link
                        to="/about"
                        onClick={() => {
                            setIsOpen(false)
                            handleClick()
                        }}
                        onMouseEnter={handleHover}
                        className="
                            text-4xl md:text-5xl font-extralight tracking-[0.2em] uppercase
                            text-white/40 hover:text-white
                            transition-all duration-300
                            hover:tracking-[0.3em]
                            py-4
                        "
                    >
                        About
                    </Link>
                </nav>

                {/* Footer */}
                <div className="absolute bottom-8 text-xs text-white/20 tracking-widest uppercase">
                    Press ESC or click X to close
                </div>
            </div>
        </>
    )
}

export default NavigationMenu
