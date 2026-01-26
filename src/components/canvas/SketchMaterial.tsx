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
  varying vec2 vUv;

  float hatch(float brightness, vec2 uv) {
    float density = 20.0;
    float thickness = 0.5;
    
    // Diagonal lines
    float line1 = step(thickness, fract((uv.x + uv.y) * density + uTime * 0.1));
    float line2 = step(thickness, fract((uv.x - uv.y) * density - uTime * 0.1));
    
    float res = 1.0;
    if (brightness < 0.8) res *= line1;
    if (brightness < 0.4) res *= line2;
    
    return res;
  }

  void main() {
    vec4 tex = texture2D(uMap, vUv);
    float brightness = (tex.r + tex.g + tex.b) / 3.0;
    
    float sketch = hatch(brightness, vUv * 10.0);
    
    vec3 finalColor = mix(uStrokeColor, tex.rgb, sketch);
    
    gl_FragColor = vec4(finalColor, uOpacity);
  }
  `
)

extend({ SketchMaterialImpl })

export default SketchMaterialImpl
