# 🌸 MINNA NO NIHONGO N5 QUEST & ZEN GARDEN 🌸
### Ứng Dụng Học Tiếng Nhật N5 Toàn Diện Kết Hợp Retro RPG, Vườn Thiền 3D & Mini-Games

Dự án web ứng dụng học tiếng Nhật theo giáo trình **Minna no Nihongo (Trọn bộ 25 bài N5)** kết hợp phong cách **16-bit Pixel Art Retro RPG**, **Vườn Thiền 3D thư giãn (Three.js)** và hệ thống **Sảnh Mini-Games** (Ninja Chém Chữ & Bắt Cá Koi N5).

---

## 🌟 TÍNH NĂNG NỔI BẬT

### 1. 📚 Học Tập Trọn Bộ 25 Bài Học Minna no Nihongo
- **Từ Vựng (Vocabulary):** Đầy đủ từ vựng cả 25 bài kèm chữ Kana, Kanji, nghĩa tiếng Việt, loại từ. Hỗ trợ phát âm chuẩn giọng Nhật (Web Speech API) với tốc độ bản xứ tự nhiên (`1.15x`).
- **Chữ Hán (Kanji & Từ Ghép):** Hơn 118 chữ Hán N5 và hơn 450 từ ghép Kanji phong phú (âm On, Kun, nghĩa Hán Việt, phân loại nét, từ ví dụ thực tế).
- **Ngữ Pháp (Grammar):** Tổng hợp công thức, giải thích cấu trúc ngữ pháp chi tiết, bảng mẫu câu song ngữ Nhật - Việt kèm âm thanh.
- **Thẻ lật Flashcard:** Chế độ lật thẻ học nhanh trực quan.
- **Hệ thống RPG Status:** Cày Level, tích lũy EXP kinh nghiệm khi hoàn thành bài học, theo dõi Daily Streak, xếp hạng sao (1 - 3 ⭐).

### 2. 🍵 Vườn Thiền Nhật Bản 3D (Zen Garden 3D)
- Không gian 3D tương tác sống động xây dựng bằng **Three.js** và WebGL.
- Các mô hình 3D truyền thống Nhật Bản: Chùa cổ Kyoto (`kyoto_japan.glb`), Cầu gỗ, Bonsai (`bonsai_garden.glb`), Lầu ngắm cảnh (`retro_pavilion.glb`).
- Nhân vật Chibi tương tác 3D (`zenitsu_chibi.glb`, `sora_chibi.glb`) với hiệu ứng điều khiển camera, di chuyển, nhảy lên (`Space`).
- Trình phát nhạc Lo-Fi thư giãn hỗ trợ tập trung học tập & xả stress.
- Hiệu ứng môi trường hoa anh đào rơi, cá bơi, thời tiết thanh bình.

### 3. 🎮 Sảnh Trò Chơi (Mini-Games Hub)
Truy cập nhanh từ thanh công cụ Header qua nút **🎮 TRÒ CHƠI**:
- **⚔️ Ninja Chém Chữ Nhật (Kanji Ninja):**
  - Chém bia gỗ mang chữ Kana, Kanji, Nghĩa từ vựng bay trên màn hình theo phong cách Fruit Ninja 60 FPS.
  - Vết chém phát sáng Sakura Glow, âm thanh 8-bit retro sinh động.
- **🎣 Bắt Cá Koi N5 (N5 Pixel Audio Fishing):**
  - Game câu cá bên hồ nước phong cách Pixel Art thư thái.
  - Điều khiển phao câu bằng cụm phím **W-A-S-D** hoặc **Mũi tên ↑ ↓ ← →** hoặc **Click chuột**, bấm **SPACE** để giật cần khi cá cắn câu.
  - **3 Chế độ chơi chuyên sâu:**
    - 🎧 **Luyện Nghe:** Hệ thống phát âm giọng Nhật bản xứ (tốc độ `1.15x`), câu hỏi để trống `_ _ _ _` bí mật, người chơi nghe âm thanh và câu đúng chú cá.
    - 📖 **Từ Vựng:** Hiển thị câu hỏi nghĩa tiếng Việt, người chơi tư duy và bắt chú cá mang từ tiếng Nhật tương ứng.
    - ⛩️ **Kanji & Từ Ghép:** Luyện tập hơn 118 chữ Hán và hơn 450 từ ghép Kanji từ 25 bài học Minna. Thẻ cá hiển thị chữ Hán thuần túy không lộ nghĩa.
  - Nút đổi nhanh hiển thị chữ trên cá (**Hiragana N5** / **Kanji + Furigana** / **Kèm Dịch TV**) và điều chỉnh tốc độ đọc (**1.15x Bản xứ** / **1.25x Nhanh** / **1.0x Chuẩn**).

---

## 🚀 HƯỚNG DẪN CÀI ĐẶT & CHẠY DỰ ÁN

Bất kỳ ai tải code về đều có thể chạy mượt mà theo các bước đơn giản sau:

### 1. Yêu cầu môi trường
- [Node.js](https://nodejs.org/) phiên bản **18.x** trở lên.
- Trình duyệt hiện đại (Chrome, Edge, Firefox, Brave) có hỗ trợ WebGL và Web Audio API.

### 2. Cài đặt các thư viện phụ thuộc
Mở terminal tại thư mục gốc của dự án và chạy:
```bash
npm install
```

### 3. Khởi động môi trường phát triển (Dev Server)
```bash
npm run dev
```
Sau đó mở trình duyệt và truy cập vào đường dẫn hiển thị (thường là `http://localhost:5173/`).

### 4. Đóng gói bản Production (Build)
```bash
npm run build
```
Thư mục `dist/` sẽ được tạo ra với toàn bộ mã nguồn đã được tối ưu hóa sẵn sàng đưa lên hosting/Vercel/Netlify/GitHub Pages.

---

## 📂 CẤU TRÚC DỰ ÁN

```text
WebN5/
├── public/                    # Tài nguyên 3D (.glb) và tài sản đồ họa
│   ├── kyoto_japan.glb        # Mô hình 3D Chùa Kyoto
│   ├── bonsai_garden.glb      # Mô hình 3D Vườn Bonsai
│   ├── retro_pavilion.glb     # Mô hình 3D Lầu ngắm cảnh
│   ├── sora_chibi.glb         # Nhân vật Chibi Sora
│   └── zenitsu_chibi.glb      # Nhân vật Chibi Zenitsu
├── src/
│   ├── components/
│   │   ├── game/              # Mini-games (KoiFishingGame, KanjiNinjaGame, MiniGamesHubModal)
│   │   ├── layout/            # Giao diện chính (TopHudHeader, LessonSidebar, RpgRightPanel)
│   │   ├── study/             # Các tab học (VocabTab, KanjiTab, GrammarTab, FlashcardModal)
│   │   └── zen/               # Vườn thiền 3D (ZenGarden3D, YouTubeZenPlayer)
│   ├── data/
│   │   ├── lessons/           # Trọn bộ dữ liệu 25 bài Minna no Nihongo (lesson_01.json -> 25)
│   │   └── lessonsIndex.ts    # Metadata chỉ mục các bài học
│   ├── utils/
│   │   ├── audio.ts           # Phát âm tiếng Nhật Web Speech API (tốc độ bản xứ linh hoạt)
│   │   ├── soundEffects.ts    # Giả lập hiệu ứng âm thanh 8-bit Web Audio API
│   │   └── storage.ts         # Lưu trữ Level, EXP, Streak, High Scores vào localStorage
│   ├── types/
│   │   └── lesson.ts          # Định nghĩa TypeScript Types & Interfaces
│   ├── App.tsx                # Component gốc liên kết các phân hệ
│   └── main.tsx               # Entry point
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

---

## 🛠️ CÔNG NGHỆ SỬ DỤNG
- **Frontend Core:** React 18, TypeScript, Vite
- **3D Graphics:** Three.js, WebGL
- **Styling:** Tailwind CSS, Custom Retro Pixel Art CSS
- **Audio & Sound:** Web Speech API (Phát âm tiếng Nhật chuẩn Tokyo), Web Audio API (Tổng hợp âm thanh Retro FX)
- **Icons:** Lucide React

---
Chúc bạn có những giờ phút vừa học tiếng Nhật hiệu quả vừa thư giãn tuyệt vời! 🎏🌸
