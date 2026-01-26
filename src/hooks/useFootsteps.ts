import { useEffect, useRef } from 'react'
import useGameStore from '../stores/useGameStore'

const FOOTSTEP_URL = 'https://assets.mixkit.co/active_storage/sfx/2092/2092-preview.mp3'

const useFootsteps = () => {
  const isMoving = useGameStore((state) => state.character.isMoving)
  const isRunning = useGameStore((state) => state.character.isRunning)
  const audio = useRef<HTMLAudioElement | null>(null)
  const interval = useRef<any>(null)

  useEffect(() => {
    // Preload audio
    audio.current = new Audio(FOOTSTEP_URL)
    audio.current.volume = 0.2
    
    return () => {
      if (interval.current) clearInterval(interval.current)
    }
  }, [])

  useEffect(() => {
    if (isMoving) {
      const pace = isRunning ? 250 : 400
      
      const playFootstep = () => {
        if (audio.current) {
          audio.current.currentTime = 0
          audio.current.play().catch(() => {})
        }
      }

      // Initial step
      playFootstep()
      
      interval.current = setInterval(playFootstep, pace)
    } else {
      if (interval.current) {
        clearInterval(interval.current)
        interval.current = null
      }
    }

    return () => {
      if (interval.current) clearInterval(interval.current)
    }
  }, [isMoving, isRunning])
}

export default useFootsteps
