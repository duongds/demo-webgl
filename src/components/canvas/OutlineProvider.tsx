import { EffectComposer, Outline, Select, Selection, Vignette } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'
import { ReactNode, createContext, useContext, useRef } from 'react'
import * as THREE from 'three'

// Context to share outline selection
interface OutlineContextType {
    addToSelection: (mesh: THREE.Object3D) => void
    removeFromSelection: (mesh: THREE.Object3D) => void
}

const OutlineContext = createContext<OutlineContextType | null>(null)

export const useOutlineSelection = () => {
    const context = useContext(OutlineContext)
    if (!context) {
        throw new Error('useOutlineSelection must be used within OutlineProvider')
    }
    return context
}

interface OutlineProviderProps {
    children: ReactNode
    enabled?: boolean
    outlineColor?: string
}

/**
 * OutlineProvider - ULTRA LIGHTWEIGHT version
 * Only Outline effect + subtle Vignette for maximum performance
 */
export const OutlineProvider = ({
    children,
    enabled = true,
    outlineColor = '#6366f1',
}: OutlineProviderProps) => {
    const selectionRef = useRef<Set<THREE.Object3D>>(new Set())

    const addToSelection = (mesh: THREE.Object3D) => {
        selectionRef.current.add(mesh)
    }

    const removeFromSelection = (mesh: THREE.Object3D) => {
        selectionRef.current.delete(mesh)
    }

    // Completely disable effects for maximum performance
    if (!enabled) {
        return <>{children}</>
    }

    return (
        <OutlineContext.Provider value={{ addToSelection, removeFromSelection }}>
            <Selection>
                {children}

                {/* ULTRA LIGHTWEIGHT: No multisampling, minimal effects */}
                <EffectComposer
                    multisampling={0}
                    stencilBuffer={true}
                    frameBufferType={THREE.HalfFloatType}
                >
                    {/* Simple Outline - no blur, minimal processing */}
                    <Outline
                        edgeStrength={1.5}
                        width={256}
                        visibleEdgeColor={new THREE.Color(outlineColor).getHex()}
                        hiddenEdgeColor={0x000000}
                    />

                    {/* Very subtle Vignette */}
                    <Vignette
                        offset={0.5}
                        darkness={0.25}
                        blendFunction={BlendFunction.NORMAL}
                    />
                </EffectComposer>
            </Selection>
        </OutlineContext.Provider>
    )
}

// Re-export Select for convenience
export { Select }

export default OutlineProvider


