import { useCallback, useEffect, useRef } from 'react';

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
    // Prevent default for arrow keys to avoid page scrolling
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'w', 'a', 's', 'd'].includes(event.key.toLowerCase()) || 
        ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
      event.preventDefault()
    }
    keysPressed.current[event.key.toLowerCase()] = true
  }, [])

  const handleKeyUp = useCallback((event: KeyboardEvent) => {
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
    return keysPressed.current[key.toLowerCase()] || false
  }, [])

  const getMovementVector = useCallback((): { x: number; z: number } => {
    let x = 0
    let z = 0

    // Forward/Backward (W/S or ArrowUp/ArrowDown)
    if (keysPressed.current['w'] || keysPressed.current['arrowup']) {
      z -= 1
    }
    if (keysPressed.current['s'] || keysPressed.current['arrowdown']) {
      z += 1
    }

    // Left/Right (A/D or ArrowLeft/ArrowRight)
    if (keysPressed.current['a'] || keysPressed.current['arrowleft']) {
      x -= 1
    }
    if (keysPressed.current['d'] || keysPressed.current['arrowright']) {
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
