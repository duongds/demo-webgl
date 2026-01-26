# 🎮 Three.js WebGL Learning Project - Implementation Plan

> Build an interactive 3D portfolio/gallery inspired by [TheVertMenthe](https://thevertmenthe.dault-lafon.fr/)

## 📋 Project Overview

### Reference Website Analysis
Website mẫu có các đặc điểm chính sau:

![Homepage với nhân vật 3D trong phòng trưng bày](C:/Users/buidu/.gemini/antigravity/brain/79e06b36-bfe3-46a2-bed3-0649ca9b0f90/homepage_loaded_1769139203623.png)

![Gallery với side-scrolling 3D](C:/Users/buidu/.gemini/antigravity/brain/79e06b36-bfe3-46a2-bed3-0649ca9b0f90/gallery_page_view_1769139363978.png)

### Key Features Identified:
1. **3D Character** - Nhân vật điều khiển bằng bàn phím (Arrow keys)
2. **3D Environment** - Phòng trưng bày 3D với tranh treo tường
3. **Camera System** - Camera theo nhân vật
4. **Proximity Interactions** - Hiển thị nút tương tác khi nhân vật đến gần tranh
5. **Custom Shaders** - Hiệu ứng vẽ tay/sketch style
6. **Scene Transitions** - Chuyển cảnh mượt mà giữa các trang

---

## 🛠️ Technology Stack

| Category | Technology |
|----------|------------|
| **Framework** | React + Vite |
| **3D Engine** | Three.js |
| **React 3D** | @react-three/fiber + @react-three/drei |
| **Animation** | GSAP + Framer Motion |
| **State** | Zustand |
| **Routing** | React Router DOM |
| **UI Library** | shadcn/ui (Radix UI + Tailwind) |

---

## 📂 Project Structure

```
demo-midu/
├── public/
│   ├── models/          # 3D models (.glb, .gltf)
│   ├── textures/        # Textures for materials
│   └── images/          # Gallery images
├── src/
│   ├── components/
│   │   ├── canvas/      # Three.js components
│   │   │   ├── Character.tsx
│   │   │   ├── Gallery.tsx
│   │   │   ├── Painting.tsx
│   │   │   ├── Floor.tsx
│   │   │   └── Lights.tsx
│   │   └── ui/          # React UI components
│   │       ├── Menu.tsx
│   │       ├── HUD.tsx
│   │       └── Controls.tsx
│   ├── hooks/           # Custom hooks
│   │   ├── useKeyboard.ts
│   │   ├── useCharacterMovement.ts
│   │   └── useProximity.ts
│   ├── scenes/          # Scene compositions
│   │   ├── HomeScene.tsx
│   │   └── GalleryScene.tsx
│   ├── shaders/         # Custom GLSL shaders
│   │   ├── sketch.vert
│   │   └── sketch.frag
│   ├── stores/          # Zustand stores
│   │   └── useGameStore.ts
│   ├── pages/           # Page components
│   │   ├── Home.tsx
│   │   ├── Gallery.tsx
│   │   └── Detail.tsx
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── package.json
├── vite.config.ts
└── tsconfig.json
```

---

## 🎯 Learning Phases & Milestones

### Phase 1: Foundation (Week 1)
> **Goal**: Setup project và làm quen với Three.js cơ bản

#### Step 1.1: Project Setup
- [x] Initialize React + Vite với TypeScript
- [x] Install dependencies: three, @react-three/fiber, @react-three/drei
- [x] Setup basic Three.js canvas
- [x] Create simple rotating cube demo

#### Step 1.2: Basic 3D Scene
- [x] Create floor plane with material
- [x] Add ambient + directional lighting
- [x] Setup OrbitControls (temporary for development)
- [x] Add simple geometry objects (boxes, spheres)

#### Step 1.3: Camera Basics
- [x] Understand PerspectiveCamera
- [x] Implement follow camera concept
- [x] Learn useFrame hook for animations

---

### Phase 2: Character & Controls (Week 2)
> **Goal**: Implement character movement system

#### Step 2.1: Keyboard Input System
- [x] Create useKeyboard hook
- [x] Handle multiple simultaneous keys
- [x] Manage key states (pressed/released)

#### Step 2.2: Character Controller
- [x] Create basic character (box/sphere initially)
- [x] Implement WASD/Arrow movement
- [x] Add movement physics (velocity, friction)
- [x] Add rotation based on movement direction

#### Step 2.3: Third-Person Camera
- [x] Camera follows character position
- [x] Smooth camera transitions (lerp)
- [ ] Camera constraints and boundaries

---

### Phase 3: Environment & Gallery (Week 3)
> **Goal**: Build the 3D gallery environment

#### Step 3.1: Room Construction
- [x] Create walls using planes/boxes
- [x] Apply materials and textures
- [x] Setup proper lighting for art gallery feel

#### Step 3.2: Paintings/Art Display
- [x] Load images as textures
- [x] Create frame geometry
- [x] Position paintings on walls
- [x] Add spotlight for each painting

#### Step 3.3: Collision Detection
- [x] Implement basic boundary checking
- [x] Prevent character from walking through walls
- [x] Create invisible collision barriers (Basic clamping implemented)

---

### Phase 4: Interactions & UI (Week 4)
- [x] UI System Setup (shadcn/ui)
- [x] Proximity Detection
- [x] Interactive UI (Press Enter, Dialog View)

### Phase 5: Advanced Features & Polish (Week 5)
> **Goal**: Add professional 3D assets, custom shaders, and final polish

#### Step 5.1: Character Model & Animations
- [x] Load GLB/GLTF character model
- [x] Implement skeletal animations (Idle, Walk, Run)
- [x] Transition animations based on movement state

#### Step 5.2: Technical Art (Shaders)
- [x] Implement a custom "Sketch" or "Hatching" shader (Tested, simplified per feedback)
- [x] Apply post-processing (Bloom, Color Grading) - [x] Initial setup done
- [x] Add particle effects for atmosphere (Dust motes)

#### Step 5.3: Scene Transitions & Polish
- [x] Implement smooth scene fade-in/out
- [x] Add sound effects (Footsteps)
- [x] Optimization for mobile and low-end devices (DPR adjusted)

---

### Phase 5: Advanced Features (Week 5-6)
> **Goal**: Polish and advanced effects

#### Step 5.1: Custom Shaders
- [ ] Learn GLSL basics
- [ ] Create sketch/pencil style shader
- [ ] Apply to character and environment

#### Step 5.2: Model Loading
- [ ] Load 3D character model (.glb)
- [ ] Add character animations
- [ ] Implement animation blending (idle, walk)

#### Step 5.3: Scene Transitions
- [ ] Page routing with React Router
- [ ] 3D scene transitions
- [ ] Loading states between scenes

#### Step 5.4: Polish
- [ ] Add sound effects
- [ ] Footstep particles/effects
- [ ] Menu and navigation
- [ ] Mobile touch controls (optional)

---

## 📦 Dependencies

```json
{
  "dependencies": {
    "react": "^18.x",
    "react-dom": "^18.x",
    "three": "^0.170.x",
    "@react-three/fiber": "^8.x",
    "@react-three/drei": "^9.x",
    "@react-three/postprocessing": "^2.x",
    "gsap": "^3.x",
    "zustand": "^4.x",
    "react-router-dom": "^6.x"
  },
  "devDependencies": {
    "@types/three": "^0.170.x",
    "typescript": "^5.x",
    "vite": "^5.x"
  }
}
```

---

## ✅ Verification Plan

### Each Phase Completion Checklist:
1. **Visual Verification**: Browser test confirming expected behavior
2. **Code Review**: Clean, well-documented code
3. **Performance Check**: Smooth 60fps on target devices

### Key Milestones Demo:
- Phase 1: Rotating cube + basic scene
- Phase 2: Moving character with camera follow
- Phase 3: Complete gallery environment
- Phase 4: Interactive paintings with detail view
- Phase 5: Full polished experience

---

## 🚀 Getting Started

Khi bạn approve kế hoạch này, tôi sẽ bắt đầu với **Phase 1: Foundation**:

1. Initialize React + Vite + TypeScript project
2. Install Three.js dependencies
3. Create basic Three.js canvas với rotating cube demo
4. Setup project structure

> [!IMPORTANT]
> **Bạn có muốn điều chỉnh gì trong kế hoạch này không?**
> - Thêm/bớt features?
> - Thay đổi timeline?
> - Focus vào kỹ thuật cụ thể nào?
