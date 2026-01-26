import { useCallback, useEffect, useRef, useState } from 'react'
import useGameStore from '../../stores/useGameStore'
import './VirtualJoystick.css'

interface JoystickState {
    active: boolean
    x: number // -1 to 1
    y: number // -1 to 1
}

/**
 * VirtualJoystick - Touch-based joystick for mobile devices
 * Appears on touch devices and controls character movement
 */
const VirtualJoystick = () => {
    const containerRef = useRef<HTMLDivElement>(null)
    const [joystick, setJoystick] = useState<JoystickState>({
        active: false,
        x: 0,
        y: 0,
    })
    const [isMobile, setIsMobile] = useState(false)
    const touchIdRef = useRef<number | null>(null)
    const centerRef = useRef({ x: 0, y: 0 })

    // Detect mobile device
    useEffect(() => {
        const checkMobile = () => {
            const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0
            const isSmallScreen = window.innerWidth <= 1024
            setIsMobile(hasTouch && isSmallScreen)
        }
        checkMobile()
        window.addEventListener('resize', checkMobile)
        return () => window.removeEventListener('resize', checkMobile)
    }, [])

    // Update game store with joystick input
    useEffect(() => {
        if (!joystick.active) return

        const updateMovement = () => {
            const { x, y } = joystick
            // Convert joystick to key states
            const keys = useGameStore.getState().keys

            // Simulate key presses based on joystick position
            const threshold = 0.3
            useGameStore.setState({
                keys: {
                    ...keys,
                    forward: y < -threshold,
                    backward: y > threshold,
                    left: x < -threshold,
                    right: x > threshold,
                }
            })
        }

        updateMovement()
    }, [joystick])

    // Reset keys when joystick is released
    useEffect(() => {
        if (!joystick.active) {
            useGameStore.setState({
                keys: {
                    forward: false,
                    backward: false,
                    left: false,
                    right: false,
                    sprint: false,
                }
            })
        }
    }, [joystick.active])

    const handleTouchStart = useCallback((e: React.TouchEvent) => {
        if (touchIdRef.current !== null) return

        const touch = e.touches[0]
        const container = containerRef.current
        if (!container) return

        const rect = container.getBoundingClientRect()
        centerRef.current = {
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height / 2,
        }

        touchIdRef.current = touch.identifier
        setJoystick({
            active: true,
            x: 0,
            y: 0,
        })
    }, [])

    const handleTouchMove = useCallback((e: React.TouchEvent) => {
        if (touchIdRef.current === null) return

        const touch = Array.from(e.touches).find(t => t.identifier === touchIdRef.current)
        if (!touch) return

        const container = containerRef.current
        if (!container) return

        const rect = container.getBoundingClientRect()
        const radius = rect.width / 2 - 20 // Inner knob radius offset

        // Calculate delta from center
        let deltaX = touch.clientX - centerRef.current.x
        let deltaY = touch.clientY - centerRef.current.y

        // Clamp to circle
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)
        if (distance > radius) {
            deltaX = (deltaX / distance) * radius
            deltaY = (deltaY / distance) * radius
        }

        // Normalize to -1 to 1
        setJoystick({
            active: true,
            x: deltaX / radius,
            y: deltaY / radius,
        })
    }, [])

    const handleTouchEnd = useCallback((e: React.TouchEvent) => {
        const touch = Array.from(e.changedTouches).find(t => t.identifier === touchIdRef.current)
        if (touch) {
            touchIdRef.current = null
            setJoystick({
                active: false,
                x: 0,
                y: 0,
            })
        }
    }, [])

    if (!isMobile) return null

    const knobStyle = {
        transform: `translate(${joystick.x * 35}px, ${joystick.y * 35}px)`,
    }

    return (
        <div className="virtual-joystick-container">
            <div
                ref={containerRef}
                className={`virtual-joystick ${joystick.active ? 'active' : ''}`}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                onTouchCancel={handleTouchEnd}
            >
                <div className="joystick-base">
                    <div className="joystick-knob" style={knobStyle} />
                </div>
            </div>
            <div className="joystick-hint">
                Move
            </div>
        </div>
    )
}

export default VirtualJoystick
