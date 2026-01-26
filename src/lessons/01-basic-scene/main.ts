import * as THREE from "three";

/**
 * Lesson 01: Basic Scene
 * 
 * Học cách tạo một scene Three.js cơ bản với:
 * - Scene: Container chứa tất cả objects
 * - Camera: PerspectiveCamera để render 3D
 * - Renderer: WebGLRenderer để vẽ lên canvas
 * - Mesh: Cube với MeshStandardMaterial
 * - Lights: AmbientLight + DirectionalLight
 * - Animation Loop: Rotating cube với Clock
 * - Responsive: Handle window resize
 */

// ===== SCENE =====
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x1a1a2e);

// ===== CAMERA =====
const camera = new THREE.PerspectiveCamera(
  75,                                     // FOV (Field of View)
  window.innerWidth / window.innerHeight, // Aspect ratio
  0.1,                                    // Near clipping plane
  1000                                    // Far clipping plane
);
camera.position.z = 5;

// ===== RENDERER =====
const renderer = new THREE.WebGLRenderer({ 
  antialias: true,  // Smooth edges
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Limit for performance

// Mount canvas to DOM
const app = document.getElementById("app");
if (app) {
  app.appendChild(renderer.domElement);
}

// ===== GEOMETRY & MATERIAL =====
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshStandardMaterial({ 
  color: 0x6c5ce7,      // Purple color
  roughness: 0.4,
  metalness: 0.3,
});
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

// ===== LIGHTS =====
// Ambient light: Soft overall illumination
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

// Directional light: Sun-like directional light with shadows
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

// ===== HELPERS (for debugging) =====
const axesHelper = new THREE.AxesHelper(3); // Red=X, Green=Y, Blue=Z
scene.add(axesHelper);

const gridHelper = new THREE.GridHelper(10, 10, 0x444444, 0x333333);
scene.add(gridHelper);

// ===== ANIMATION LOOP =====
const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);
  
  // Get time delta for frame-rate independent animation
  const delta = clock.getDelta();
  const elapsed = clock.getElapsedTime();
  
  // Rotate cube
  cube.rotation.x += delta * 0.5;
  cube.rotation.y += delta * 0.8;
  
  // Optional: Add subtle floating motion
  cube.position.y = Math.sin(elapsed) * 0.2;
  
  // Render scene
  renderer.render(scene, camera);
}

// Start animation
animate();

// ===== RESPONSIVE RESIZE =====
window.addEventListener("resize", () => {
  // Update camera aspect ratio
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  
  // Update renderer size
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

// ===== CLEANUP (for React/SPA) =====
export function dispose() {
  geometry.dispose();
  material.dispose();
  renderer.dispose();
}
