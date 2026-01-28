import { useCallback, useEffect, useRef } from 'react';
import useGameStore from '../stores/useGameStore';

interface KeyState {
  [key: string]: boolean
}

interface UseKeyboardReturn {
  isKeyPressed: (key: string) => boolean
  getMovementVector: () => { x: number; z: number }
}

const useKeyboard = (): UseKeyboardReturn => {
  const keysPressed = useRef<KeyState>({})

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    // Ignore Enter key in general movement hook to let HUD handle it
    if (event.key === 'Enter') return;

    // Prevent default for arrow keys to avoid page scrolling
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'w', 'a', 's', 'd'].includes(event.key.toLowerCase()) || 
        ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
      event.preventDefault()
    }
    keysPressed.current[event.key.toLowerCase()] = true
  }, [])

  const handleKeyUp = useCallback((event: KeyboardEvent) => {
    if (event.key === 'Enter') return;
    keysPressed.current[event.key.toLowerCase()] = false
  }, [])

  // Handle window blur - reset all keys when window loses focus
  const handleBlur = useCallback(() => {
    keysPressed.current = {}
  }, [])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    window.addEventListener('blur', handleBlur)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
      window.removeEventListener('blur', handleBlur)
    }
  }, [handleKeyDown, handleKeyUp, handleBlur])

  const isKeyPressed = useCallback((key: string): boolean => {
    // Check key from GameStore (VirtualJoystick)
    const storeKeys = useGameStore.getState().keys
    if (key === 'w' && storeKeys.forward) return true
    if (key === 's' && storeKeys.backward) return true
    if (key === 'a' && storeKeys.left) return true
    if (key === 'd' && storeKeys.right) return true
    if (key === 'shift' && storeKeys.sprint) return true

    return keysPressed.current[key.toLowerCase()] || false
  }, [])

  const getMovementVector = useCallback((): { x: number; z: number } => {
    let x = 0
    let z = 0
    
    // Get store keys (Virtual Joystick)
    const storeKeys = useGameStore.getState().keys

    // Forward/Backward (W/S or ArrowUp/ArrowDown or Joystick)
    if (keysPressed.current['w'] || keysPressed.current['arrowup'] || storeKeys.forward) {
      z -= 1
    }
    if (keysPressed.current['s'] || keysPressed.current['arrowdown'] || storeKeys.backward) {
      z += 1
    }

    // Left/Right (A/D or ArrowLeft/ArrowRight or Joystick)
    if (keysPressed.current['a'] || keysPressed.current['arrowleft'] || storeKeys.left) {
      x -= 1
    }
    if (keysPressed.current['d'] || keysPressed.current['arrowright'] || storeKeys.right) {
      x += 1
    }

    // Normalize diagonal movement
    if (x !== 0 && z !== 0) {
      const length = Math.sqrt(x * x + z * z)
      x /= length
      z /= length
    }

    return { x, z }
  }, [])

  return { isKeyPressed, getMovementVector }
}

export default useKeyboard
