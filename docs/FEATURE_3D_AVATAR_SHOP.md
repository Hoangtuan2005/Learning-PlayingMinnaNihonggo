# ⛩️ TÀI LIỆU THIẾT KẾ: ĐỔI ĐIỂM PHỤ KIỆN VÀ NHÂN VẬT 3D (NINJA AVATAR & SHOP)

> **Mã kích hoạt (Trigger Prompt):** `Đổi điểm phụ kiện và nhân vật 3D`  
> *Khi người dùng gửi câu lệnh trên, trợ lý AI sẽ tự động đọc tài liệu này và triển khai toàn bộ tính năng theo thiết kế dưới đây.*

---

## 1. Mục tiêu tính năng
- Cho phép người chơi dùng điểm tích lũy (sau khi học từ vựng/kanji/ngữ pháp và chơi mini-game) để quy đổi thành **Đồng Ryo (両) 🪙**.
- Xây dựng **Nhân vật 3D Voxel / Low-Poly (Three.js / WebGL)** xoay 360°, có animation thở (idle) và vung kiếm.
- Mở **Tiệm Rèn / Tiệm Đồ Ninja** để mua sắm, thay đổi trang bị:
  1. Nón / Mũ / Phụ kiện đầu (Headgear)
  2. Trang phục / Áo giáp (Outfit / Armor)
  3. Vũ khí / Cầm tay (Weapons: Katana, Bokken...)
  4. Thú cưng / Hào quang (Aura / Pet)
- Khóa trang bị theo tiến độ bài học (ví dụ: cần đạt Bài 5, Bài 10 mới mở khóa đồ huyền thoại).

---

## 2. Kiến trúc dữ liệu (`src/types/character.ts` & `localStorage`)

```typescript
export interface ShopItem {
  id: string;
  name: string;
  slot: 'head' | 'body' | 'weapon' | 'aura';
  priceRyo: number;
  requiredLesson?: number; // Khóa theo tiến độ bài học
  description: string;
  colorHex?: string;
  modelType: string;
}

export interface CharacterCustomization {
  skinColor: string;
  hairColor: string;
  equippedHead?: string;
  equippedBody?: string;
  equippedWeapon?: string;
  equippedAura?: string;
}

export interface ExtendedUserProgress extends UserProgress {
  ryo: number; // Tiền tệ tích lũy
  unlockedShopItemIds: string[];
  character: CharacterCustomization;
}
```

---

## 3. Các thành phần cần triển khai khi kích hoạt
1. **Thư viện 3D:** Cài đặt `three` và `@types/three`.
2. **Component 3D Canvas:** `src/components/character/VoxelCharacter3D.tsx` (Render WebGL nhân vật 3D, điều khiển xoay chuột 360 độ).
3. **Component Cửa Hàng:** `src/components/shop/NinjaShopModal.tsx` (Thử đồ thời gian thực, mua đồ, trừ tiền).
4. **Tích hợp:** Hiển thị nhân vật 3D tại `RpgRightPanel.tsx` và Header.
