# 🎮 Three.js Gallery - Implementation Walkthrough

## 🚀 Phase progress: Completed Phases 1-4

Chúng ta đã hoàn thành các giai đoạn thiết lập cơ bản, hệ thống điều khiển nhân vật, xây dựng môi trường phòng trưng bày (Gallery) và hệ thống tương tác UI.

### 1. Hệ thống điều khiển (Phase 2)
- **Keyboard Input**: Hỗ trợ đồng thời các phím WASD và phím mũi tên.
- **Character Physics**: Nhân vật di chuyển với vận tốc (velocity), ma sát (friction) và xoay mượt mà theo hướng di chuyển.
- **Follow Camera**: Camera người thứ 3 (Third-person) tự động theo sát nhân vật bằng kỹ thuật `lerp` để tạo cảm giác mượt mà.

### 2. Môi trường & Gallery (Phase 3)
- **Room Structure**: Một phòng trưng bày rộng 30x30 với tường, sàn có grid texture để dễ định vị.
- **Collision Detection**: Đã implement giới hạn biên (boundaries) ngăn nhân vật đi ra ngoài phòng.
- **Artworks**: Các bức tranh được treo trên tường với khung gỗ, đèn spotlight riêng biệt cho từng tác phẩm.

### 3. Tương tác & UI (Phase 4)
- **shadcn/ui Integration**: Tích hợp hệ thống UI hiện đại bằng Tailwind và Radix UI.
- **Proximity Detection**: Tự động phát hiện khi nhân vật đứng gần tranh (khoảng cách < 3.5 đơn vị).
- **Interactive Prompts**: Hiển thị nút "ENTER" lơ lửng khi ở gần tranh.
- **Detail View**: Sử dụng `Dialog` (Modal) để hiển thị chi tiết bức tranh khi nhấn ENTER.
- **HUD**: Hiển thị hướng dẫn điều khiển và tọa độ debug ở các góc màn hình.

### 4. Hiệu ứng Hình ảnh (Visual Effects)
- **Post-processing**:
  - `Bloom`: Tạo hiệu ứng ánh sáng rực rỡ (glow).
  - `Noise`: Thêm độ nhiễu hạt nhẹ cho cảm giác nghệ thuật.
  - `Vignette`: Làm tối các góc màn hình để tập trung vào trung tâm.

---

## 🛠️ Tech Stack Used
- **Three.js + React Three Fiber**: Core 3D engine.
- **@react-three/drei**: Shorthands cho Camera, Textures, Text, và Environment.
- **Zustand**: Quản lý state toàn cục (vị trí nhân vật, danh sách tranh, tương tác).
- **Tailwind CSS**: Styling UI.
- **shadcn/ui**: Các component UI cao cấp (Button, Dialog).
- **@react-three/postprocessing**: Hiệu ứng hình ảnh nâng cao.

---

## 🎮 Cách tương tác
1.  Sử dụng **WASD** hoặc **Các phím mũi tên** để di chuyển nhân vật.
2.  Tiến lại gần các bức tranh trên tường.
3.  Khi thấy thông báo "Press ENTER", hãy nhấn phím **ENTER** để xem chi tiết tác phẩm.
4.  Nhấn **ESC** hoặc click ra ngoài để đóng xem chi tiết.

---

## ⏭️ Bước tiếp theo: Phase 5
- Thêm nhân vật 3D thực thụ từ file GLB/GLTF.
- Implement animation (Idle, Walking).
- Thêm các hiệu ứng Shader tùy chỉnh (Sketch style).
