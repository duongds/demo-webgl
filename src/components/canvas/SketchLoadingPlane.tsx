import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'

/**
 * Sketch Loading Animation Shader Material
 * Creates a hand-drawn/pencil sketch effect for loading screens
 */

const vertexShader = `
varying vec2 vUv;

void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`

const fragmentShader = `
uniform float uTime;
uniform float uProgress;
uniform vec3 uPaperColor;
uniform vec3 uInkColor;
uniform vec2 uResolution;

varying vec2 vUv;

// Pseudo-random function
float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

// Value noise
float noise(vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);
    
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));
    
    vec2 u = f * f * (3.0 - 2.0 * f);
    
    return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}

// Cross-hatching function
float hatch(vec2 uv, float density) {
    float jitter = noise(uv * 50.0) * 0.03;
    vec2 jitteredUV = uv + jitter;
    
    // Animated diagonal lines
    float line1 = abs(sin((jitteredUV.x + jitteredUV.y) * density + uTime * 0.5));
    float line2 = abs(sin((jitteredUV.x - jitteredUV.y) * density * 1.3 - uTime * 0.3));
    
    float result = smoothstep(0.3, 0.5, line1) * smoothstep(0.2, 0.5, line2);
    
    return result;
}

// Paper texture
float paperTexture(vec2 uv) {
    float paper = noise(uv * 300.0) * 0.08;
    paper += noise(uv * 600.0) * 0.04;
    return paper;
}

// Circular progress indicator with sketch style
float sketchCircle(vec2 uv, float progress) {
    vec2 center = vec2(0.5);
    float dist = distance(uv, center);
    
    // Ring parameters
    float ringRadius = 0.15;
    float ringThickness = 0.02;
    
    // Calculate angle
    float angle = atan(uv.y - center.y, uv.x - center.x);
    float normalizedAngle = (angle + 3.14159) / (2.0 * 3.14159);
    
    // Ring shape with wobbly edge (hand-drawn effect)
    float wobble = noise(vec2(angle * 5.0, uTime)) * 0.008;
    float ring = smoothstep(ringRadius - ringThickness - wobble, ringRadius - ringThickness + 0.005, dist) *
                 (1.0 - smoothstep(ringRadius + ringThickness - 0.005, ringRadius + ringThickness + wobble, dist));
    
    // Progress arc
    float progressMask = step(normalizedAngle, progress);
    
    // Combine ring with progress
    return ring * progressMask;
}

// Animated sketch lines background
float sketchBackground(vec2 uv) {
    float lines = 0.0;
    
    // Multiple layers of hatching at different angles
    for (float i = 0.0; i < 3.0; i++) {
        float angle = i * 0.5 + uTime * 0.05;
        vec2 rotatedUV = vec2(
            uv.x * cos(angle) - uv.y * sin(angle),
            uv.x * sin(angle) + uv.y * cos(angle)
        );
        
        float density = 30.0 + i * 10.0;
        float line = abs(sin(rotatedUV.x * density + uTime * (0.2 + i * 0.1)));
        lines += smoothstep(0.9, 0.95, line) * 0.1;
    }
    
    return lines;
}

void main() {
    vec2 uv = vUv;
    
    // Paper base with texture
    float paper = paperTexture(uv);
    vec3 baseColor = uPaperColor + paper;
    
    // Background sketch lines
    float bgLines = sketchBackground(uv);
    
    // Progress circle
    float circle = sketchCircle(uv, uProgress);
    
    // Cross-hatching around circle
    float hatchPattern = hatch(uv * 3.0, 25.0);
    float hatchMask = 1.0 - smoothstep(0.1, 0.25, distance(uv, vec2(0.5)));
    float hatchEffect = (1.0 - hatchPattern) * hatchMask * 0.3;
    
    // Combine all effects
    float inkAmount = bgLines + circle + hatchEffect;
    inkAmount = clamp(inkAmount, 0.0, 1.0);
    
    // Final color
    vec3 finalColor = mix(baseColor, uInkColor, inkAmount);
    
    // Slight vignette
    float vignette = 1.0 - length(uv - 0.5) * 0.5;
    finalColor *= vignette;
    
    gl_FragColor = vec4(finalColor, 1.0);
}
`

interface SketchLoadingPlaneProps {
    progress: number
    paperColor?: string
    inkColor?: string
}

/**
 * SketchLoadingPlane - A plane with animated sketch shader for loading screens
 */
const SketchLoadingPlane = ({
    progress,
    paperColor = '#f5f5f0',
    inkColor = '#1a1a2e',
}: SketchLoadingPlaneProps) => {
    const meshRef = useRef<THREE.Mesh>(null)

    const uniforms = useMemo(() => ({
        uTime: { value: 0 },
        uProgress: { value: 0 },
        uPaperColor: { value: new THREE.Color(paperColor) },
        uInkColor: { value: new THREE.Color(inkColor) },
        uResolution: { value: new THREE.Vector2(1920, 1080) },
    }), [paperColor, inkColor])

    useFrame((state) => {
        if (meshRef.current) {
            const material = meshRef.current.material as THREE.ShaderMaterial
            material.uniforms.uTime.value = state.clock.elapsedTime
            material.uniforms.uProgress.value = progress / 100
        }
    })

    return (
        <mesh ref={meshRef} position={[0, 0, 0]}>
            <planeGeometry args={[4, 4]} />
            <shaderMaterial
                uniforms={uniforms}
                vertexShader={vertexShader}
                fragmentShader={fragmentShader}
                transparent={false}
            />
        </mesh>
    )
}

export default SketchLoadingPlane
