import { useThree } from '@react-three/fiber'
import { Bloom, EffectComposer, Noise, Select, Selection, Vignette } from '@react-three/postprocessing'
import { BlendFunction, KernelSize } from 'postprocessing'

/**
 * Post-processing Effects Component
 * Includes: Bloom, Noise, Vignette, and Outline for selected objects
 */
const Effects = () => {
    const { size } = useThree()

    return (
        <EffectComposer
            multisampling={4}
            stencilBuffer={true}
        >
            {/* Bloom for lights */}
            <Bloom
                intensity={0.3}
                luminanceThreshold={0.8}
                luminanceSmoothing={0.9}
                kernelSize={KernelSize.MEDIUM}
            />

            {/* Subtle noise for artistic feel */}
            <Noise
                opacity={0.02}
                blendFunction={BlendFunction.OVERLAY}
            />

            {/* Vignette for focus */}
            <Vignette
                offset={0.3}
                darkness={0.5}
                blendFunction={BlendFunction.NORMAL}
            />
        </EffectComposer>
    )
}

export { Effects, Select, Selection }
export default Effects
