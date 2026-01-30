import * as THREE from 'three'
import { create } from 'zustand'

interface CharacterState {
  position: THREE.Vector3
  rotation: number
  velocity: THREE.Vector3
  isMoving: boolean
  isRunning: boolean
}

interface PaintingData {
  id: string
  position: THREE.Vector3
  rotation: THREE.Euler
  title: string
  url: string
}

interface GameState {
  character: CharacterState
  cameraTarget: THREE.Vector3
  isPaused: boolean
  paintings: PaintingData[]
  nearestPainting: PaintingData | null
  selectedPainting: PaintingData | null
  characterType: 'human' | 'bear' | 'robot'
  
  // Input State
  keys: {
    forward: boolean
    backward: boolean
    left: boolean
    right: boolean
    sprint: boolean
  }
  
  // Footprints
  footprints: { id: string; position: THREE.Vector3; rotation: number; opacity: number }[]
  
  // Actions
  setCharacterPosition: (position: THREE.Vector3) => void
  setCharacterRotation: (rotation: number) => void
  setCharacterVelocity: (velocity: THREE.Vector3) => void
  setIsMoving: (isMoving: boolean) => void
  setIsRunning: (isRunning: boolean) => void
  setCameraTarget: (target: THREE.Vector3) => void
  togglePause: () => void
  registerPainting: (painting: PaintingData) => void
  setNearestPainting: (painting: PaintingData | null) => void
  setSelectedPainting: (painting: PaintingData | null) => void
  setCharacterType: (type: 'human' | 'bear' | 'robot') => void
  setKeys: (keys: Partial<GameState['keys']>) => void
  addFootprint: (position: THREE.Vector3, rotation: number) => void
  updateFootprints: (delta: number) => void
}

const useGameStore = create<GameState>((set) => ({
  character: {
    position: new THREE.Vector3(0, 0, 0),
    rotation: 0,
    velocity: new THREE.Vector3(0, 0, 0),
    isMoving: false,
    isRunning: false,
  },
  cameraTarget: new THREE.Vector3(0, 0, 0),
  isPaused: false,
  paintings: [],
  nearestPainting: null,
  selectedPainting: null,
  characterType: 'human',
  keys: {
    forward: false,
    backward: false,
    left: false,
    right: false,
    sprint: false,
  },
  footprints: [],

  setCharacterPosition: (position) =>
    set((state) => ({
      character: { ...state.character, position: position.clone() },
    })),

  setCharacterRotation: (rotation) =>
    set((state) => ({
      character: { ...state.character, rotation },
    })),

  setCharacterVelocity: (velocity) =>
    set((state) => ({
      character: { ...state.character, velocity: velocity.clone() },
    })),

  setIsMoving: (isMoving) =>
    set((state) => ({
      character: { ...state.character, isMoving },
    })),

  setIsRunning: (isRunning) =>
    set((state) => ({
      character: { ...state.character, isRunning },
    })),

  setCameraTarget: (target) =>
    set({ cameraTarget: target.clone() }),

  togglePause: () =>
    set((state) => ({ isPaused: !state.isPaused })),

  registerPainting: (painting) =>
    set((state) => ({
      paintings: [...state.paintings.filter(p => p.id !== painting.id), painting]
    })),

  setNearestPainting: (painting) =>
    set({ nearestPainting: painting }),

  setSelectedPainting: (painting) =>
    set({ selectedPainting: painting }),

  setCharacterType: (type) =>
    set({ characterType: type }),

  setKeys: (keys) =>
    set((state) => ({
      keys: { ...state.keys, ...keys }
    })),

  addFootprint: (position, rotation) =>
    set((state) => ({
      footprints: [
        ...state.footprints,
        {
          id: Math.random().toString(36).substr(2, 9),
          position: position.clone(),
          rotation,
          opacity: 1,
        },
      ].slice(-20), // Keep only last 20 footprints for performance
    })),

  updateFootprints: (delta) =>
    set((state) => ({
      footprints: state.footprints
        .map((f) => ({ ...f, opacity: f.opacity - delta * 0.5 }))
        .filter((f) => f.opacity > 0),
    })),
}))

export default useGameStore
