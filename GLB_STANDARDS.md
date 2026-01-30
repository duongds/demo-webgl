# GLB Character Standards (Robot Benchmark)

This document defines the 3D model standards for the project, based on the successful integration of the **Robot** character. Following these guidelines ensures seamless compatibility with the `GLBCharacterModel` system.

## 1. Geometry & Origin
*   **Format**: `.glb` (Binary glTF).
*   **Coordinate System**: **Y-Up** (Y+ is up, Z+ is forward).
*   **Origin Point (0,0,0)**: The model's origin/pivot MUST be at the **bottom center of the feet**.
    *   *Reference*: The Robot stands firmly on the floor. While the code attempts to auto-center, setting the origin correctly in the file prevents "floating" or "sinking" artifacts.
*   **Orientation**: Character must face **Positive Z (+Z)** in their rest pose.

## 2. Scale & Dimensions
*   **Units**: **Meters** (1.0 unit = 1 meter).
*   **Target Height**:
    *   **Standard Character**: ~1.5m to 1.8m.
    *   **Small/Chibi**: ~0.5m to 1.0m.
    *   *Note*: The project currently scales the Robot (0.2 scale) to fit the scene. For best results, export your model at **1:1 scale** (approx 1.5m tall) to avoid needing manual scale adjustments in code.

## 3. Animations (Critical)
The system uses name-matching to trigger animations. The Robot benchmark relies on **"Walk"** for stable movement.

### Required Tracks:
1.  **Idle**
    *   **Keywords**: `idle`, `stand`, `wait`
    *   **Behavior**: Minimal movement, breathing, looking around.
    *   **Loop**: Yes.

2.  **Walk** (Primary Movement)
    *   **Keywords**: `walk`, `move`
    *   **Behavior**: A steady, balanced walk cycle.
    *   **Constraint**: **MUST BE IN-PLACE**. The root bone/hips must strictly stay at (0,0,0) on X and Z axes. The code handles world movement.
    *   *Note*: The Robot's "Walk" is preferred over "Run" because it prevents the "falling backward" visual effect caused by exaggerated leaning in run cycles.

3.  **Run** (Optional)
    *   **Keywords**: `run`, `sprint`
    *   **Behavior**: Faster movement.
    *   **Constraint**: In-place. Avoid excessive backward/forward leaning which may look unnatural at lower movement speeds.

## 4. Technical Checklist for Artists
- [ ] **Single Root**: The scene should have one root node (or one Armature ratio).
- [ ] **Embedded Media**: Textures must be embedded in the GLB.
- [ ] **Shadows**: Geometry should be closed/watertight to cast proper shadows on the floor.
- [ ] **Clean Hierarchy**: Avoid nesting the character inside multiple empty transforms/groups if possible.

## 5. Integration Notes based on Robot
*   **Vertical Offset**: The generic character system currently lifts models by **0.5m**. Since standard models have feet at 0, a **-0.5 vertical offset** is applied in code to ground them. This is normal and handled by the developer, not the artist.
*   **Footprints**: Footprint markers are generated based on the character's width. If your character is significantly wider or narrower than the Robot, the `footprintOffset` in code may need tuning.
