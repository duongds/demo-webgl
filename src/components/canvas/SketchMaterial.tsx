import { shaderMaterial } from '@react-three/drei'
import { extend } from '@react-three/fiber'
import * as THREE from 'three'

/**
 * A custom shader material that creates a "Sketch/Hand-drawn" effect.
 * It uses simple cross-hatching logic based on brightness.
 */
const SketchMaterialImpl = shaderMaterial(
  {
    uMap: null,
    uOpacity: 1,
    uColor: new THREE.Color(1, 1, 1),
    uStrokeColor: new THREE.Color(0, 0, 0),
    uResolution: new THREE.Vector2(1, 1),
    uTime: 0,
    uJitter: 0.05,
  },
  // Vertex Shader
  `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
  `,
  // Fragment Shader
  `
  uniform sampler2D uMap;
  uniform float uOpacity;
  uniform vec3 uColor;
  uniform vec3 uStrokeColor;
  uniform vec2 uResolution;
  uniform float uTime;
  uniform float uJitter;
  varying vec2 vUv;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  float hatch(float brightness, vec2 uv) {
    float density = 20.0;
    float thickness = 0.5;
    
    // Add jitter
    float speed = 10.0;
    float time = floor(uTime * speed);
    vec2 jUv = uv + (vec2(hash(uv + time), hash(uv + time + 1.0)) - 0.5) * uJitter;
    
    // Diagonal lines
    float line1 = step(thickness, fract((jUv.x + jUv.y) * density));
    float line2 = step(thickness, fract((jUv.x - jUv.y) * density));
    
    float res = 1.0;
    if (brightness < 0.8) res *= line1;
    if (brightness < 0.4) res *= line2;
    
    return res;
  }

  void main() {
    // Boiling effect for the texture lookup too
    float speed = 12.0;
    float time = floor(uTime * speed);
    vec2 jitteredUv = vUv + (vec2(hash(vUv + time), hash(vUv + time + 123.4)) - 0.5) * (uJitter * 0.1);

    vec4 tex = texture2D(uMap, jitteredUv);
    float brightness = (tex.r + tex.g + tex.b) / 3.0;
    
    float sketch = hatch(brightness, jitteredUv * 10.0);
    
    vec3 finalColor = mix(uStrokeColor, tex.rgb, sketch);
    
    gl_FragColor = vec4(finalColor, uOpacity);
  }
  `
)

extend({ SketchMaterialImpl })

export default SketchMaterialImpl
