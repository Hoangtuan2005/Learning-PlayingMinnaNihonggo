import * as THREE from 'three';

// Procedural high-resolution texture generator for Japanese Zen Garden & Chibi
// Generates beautiful anime-style assets completely offline on Canvas

/**
 * Creates a high-res Zen Garden ground texture with lush grass,
 * concentric raked sand rings, cobblestones, and scattered sakura petals.
 */
export function createGroundTexture(): THREE.CanvasTexture {
  const size = 1024;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  // 1. Base vibrant Japanese garden mossy grass
  const grassGrad = ctx.createRadialGradient(size / 2, size / 2, 50, size / 2, size / 2, size / 2);
  grassGrad.addColorStop(0, '#7eb34d');
  grassGrad.addColorStop(0.7, '#6b9e3f');
  grassGrad.addColorStop(1, '#537d2f');
  ctx.fillStyle = grassGrad;
  ctx.fillRect(0, 0, size, size);

  // Subtle grass texture noise
  ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
  for (let i = 0; i < 4000; i++) {
    const rx = Math.random() * size;
    const ry = Math.random() * size;
    ctx.fillRect(rx, ry, 2, 2);
  }
  ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
  for (let i = 0; i < 3000; i++) {
    const rx = Math.random() * size;
    const ry = Math.random() * size;
    ctx.fillRect(rx, ry, 2, 2);
  }

  // 2. Zen Sand Circle (Raked sand garden)
  const cx = size * 0.45;
  const cy = size * 0.48;
  const sandRadius = size * 0.32;

  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, sandRadius, 0, Math.PI * 2);
  ctx.closePath();

  const sandGrad = ctx.createRadialGradient(cx, cy, 30, cx, cy, sandRadius);
  sandGrad.addColorStop(0, '#f5e4c3');
  sandGrad.addColorStop(0.85, '#edd6b1');
  sandGrad.addColorStop(1, '#dabf96');
  ctx.fillStyle = sandGrad;
  ctx.fill();

  // Concentric circular ripples in the sand
  ctx.strokeStyle = '#d4ba90';
  ctx.lineWidth = 3;
  for (let r = 25; r < sandRadius - 8; r += 14) {
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.stroke();
  }

  // Soft sand border blending
  ctx.strokeStyle = 'rgba(107, 158, 63, 0.5)';
  ctx.lineWidth = 8;
  ctx.stroke();
  ctx.restore();

  // 3. Scattered fallen Sakura petals on grass and sand
  const petalColors = ['#ff9ebb', '#ffaec6', '#ffc2d4', '#ffffff', '#ff8da9'];
  for (let p = 0; p < 350; p++) {
    const px = Math.random() * size;
    const py = Math.random() * size;
    const pRot = Math.random() * Math.PI * 2;
    const pScale = 2.5 + Math.random() * 3;

    ctx.save();
    ctx.translate(px, py);
    ctx.rotate(pRot);
    ctx.fillStyle = petalColors[Math.floor(Math.random() * petalColors.length)];
    ctx.beginPath();
    ctx.ellipse(0, 0, pScale * 2, pScale, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}

/**
 * Creates a fluffy, layered Cherry Blossom cluster texture for the tree canopy.
 */
export function createSakuraBlossomTexture(): THREE.CanvasTexture {
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  ctx.clearRect(0, 0, size, size);

  // Draw a cluster of soft, glowing pink cherry blossoms
  const flowerCount = 45;
  const center = size / 2;

  // Soft background pink aura/glow
  const bgGlow = ctx.createRadialGradient(center, center, 40, center, center, size * 0.45);
  bgGlow.addColorStop(0, 'rgba(255, 175, 195, 0.85)');
  bgGlow.addColorStop(0.5, 'rgba(255, 145, 175, 0.6)');
  bgGlow.addColorStop(0.85, 'rgba(255, 185, 205, 0.2)');
  bgGlow.addColorStop(1, 'rgba(255, 200, 215, 0)');
  ctx.fillStyle = bgGlow;
  ctx.beginPath();
  ctx.arc(center, center, size * 0.45, 0, Math.PI * 2);
  ctx.fill();

  // Helper to draw single 5-petal sakura flower
  const drawSakura = (x: number, y: number, radius: number, rot: number, baseColor: string, centerColor: string) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rot);

    // 5 petals
    for (let i = 0; i < 5; i++) {
      const angle = (i * Math.PI * 2) / 5;
      ctx.save();
      ctx.rotate(angle);

      // Petal shape with notch
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(-radius * 0.6, -radius * 0.6, -radius * 0.5, -radius * 1.2, 0, -radius);
      ctx.bezierCurveTo(radius * 0.5, -radius * 1.2, radius * 0.6, -radius * 0.6, 0, 0);

      const grad = ctx.createLinearGradient(0, 0, 0, -radius);
      grad.addColorStop(0, centerColor);
      grad.addColorStop(0.7, baseColor);
      grad.addColorStop(1, '#ffffff');
      ctx.fillStyle = grad;
      ctx.fill();

      ctx.restore();
    }

    // Flower center pistil / stamens
    ctx.fillStyle = '#ff5e7e';
    ctx.beginPath();
    ctx.arc(0, 0, radius * 0.22, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#ffeaa7';
    ctx.beginPath();
    ctx.arc(0, 0, radius * 0.12, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  };

  // Draw dense cluster of blossoms
  for (let i = 0; i < flowerCount; i++) {
    const dist = Math.random() * (size * 0.35);
    const angle = Math.random() * Math.PI * 2;
    const fx = center + Math.cos(angle) * dist;
    const fy = center + Math.sin(angle) * dist;
    const rad = 28 + Math.random() * 26;
    const rot = Math.random() * Math.PI * 2;

    const baseCols = ['#ff8da9', '#ffa5bc', '#ffb9cc', '#ffcddb', '#ffffff'];
    const col = baseCols[Math.floor(Math.random() * baseCols.length)];
    drawSakura(fx, fy, rad, rot, col, '#ff477e');
  }

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

/**
 * Creates a high-res anime Chibi girl sprite in 4 states:
 * - 'front': Standing front with sparkling eyes and blushing smile
 * - 'walk': Walking front frame with swaying kimono sleeves & stepping sandals
 * - 'back': Rear view showing long flowing dark hair and obi bow
 * - 'sit': Peaceful Seiza sitting posture on red mat with closed smiling eyes ^_^
 */
export function createChibiSpriteTexture(state: 'front' | 'walk' | 'back' | 'sit'): THREE.CanvasTexture {
  const w = 512;
  const h = 512;
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d')!;

  ctx.clearRect(0, 0, w, h);

  const cx = w / 2;

  if (state === 'sit') {
    // ==========================================
    // SEIZA SITTING POSTURE (Blissful Zen Peace)
    // ==========================================
    const cy = 290;

    // 1. Long Dark Hair flowing down back & sides
    ctx.fillStyle = '#261b24';
    // Back hair pool
    ctx.beginPath();
    ctx.ellipse(cx, cy + 20, 115, 110, 0, 0, Math.PI * 2);
    ctx.fill();

    // 2. Kimono Lower Body (Seiza Kneeling on mat)
    // Kimono skirt folded gracefully
    const kimonoGrad = ctx.createLinearGradient(cx - 90, cy + 20, cx + 90, cy + 120);
    kimonoGrad.addColorStop(0, '#fbc5d8');
    kimonoGrad.addColorStop(0.5, '#f48fb1');
    kimonoGrad.addColorStop(1, '#ec407a');
    ctx.fillStyle = kimonoGrad;
    ctx.beginPath();
    ctx.ellipse(cx, cy + 85, 95, 45, 0, 0, Math.PI * 2);
    ctx.fill();

    // Delicate white sakura blossom prints on kimono
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    [
      [cx - 50, cy + 75], [cx + 40, cy + 80], [cx - 20, cy + 100], 
      [cx + 60, cy + 95], [cx, cy + 70]
    ].forEach(([px, py]) => {
      ctx.beginPath();
      ctx.arc(px, py, 6, 0, Math.PI * 2);
      ctx.fill();
    });

    // 3. Kimono Torso
    ctx.fillStyle = '#f8a5c2';
    ctx.beginPath();
    ctx.moveTo(cx - 55, cy + 15);
    ctx.lineTo(cx + 55, cy + 15);
    ctx.lineTo(cx + 65, cy + 70);
    ctx.lineTo(cx - 65, cy + 70);
    ctx.closePath();
    ctx.fill();

    // Kimono V-collar (Right over left)
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(cx - 35, cy + 15);
    ctx.lineTo(cx + 8, cy + 50);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(cx + 35, cy + 15);
    ctx.lineTo(cx - 8, cy + 45);
    ctx.stroke();

    // 4. Crimson Red Obi Sash & Gold cord
    ctx.fillStyle = '#b71540';
    ctx.fillRect(cx - 48, cy + 42, 96, 26);
    // Gold obijime cord
    ctx.strokeStyle = '#ffd32a';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(cx - 48, cy + 55);
    ctx.lineTo(cx + 48, cy + 55);
    ctx.stroke();
    // Gold knot center
    ctx.fillStyle = '#f1c40f';
    ctx.beginPath();
    ctx.arc(cx, cy + 55, 6, 0, Math.PI * 2);
    ctx.fill();

    // 5. Sleeves folded in front with polite hands on lap
    ctx.fillStyle = '#f48fb1';
    // Left sleeve
    ctx.beginPath();
    ctx.ellipse(cx - 55, cy + 45, 24, 38, -0.4, 0, Math.PI * 2);
    ctx.fill();
    // Right sleeve
    ctx.beginPath();
    ctx.ellipse(cx + 55, cy + 45, 24, 38, 0.4, 0, Math.PI * 2);
    ctx.fill();

    // Hands resting gently together in center
    ctx.fillStyle = '#fde2d2';
    ctx.beginPath();
    ctx.ellipse(cx, cy + 62, 18, 12, 0, 0, Math.PI * 2);
    ctx.fill();

    // 6. Cute Head & Fair Skin
    const headY = cy - 65;
    ctx.fillStyle = '#ffe0cf';
    ctx.beginPath();
    ctx.arc(cx, headY, 78, 0, Math.PI * 2);
    ctx.fill();

    // Chubby blushing cheeks
    const blushGradL = ctx.createRadialGradient(cx - 42, headY + 18, 2, cx - 42, headY + 18, 22);
    blushGradL.addColorStop(0, 'rgba(255, 107, 129, 0.7)');
    blushGradL.addColorStop(1, 'rgba(255, 107, 129, 0)');
    ctx.fillStyle = blushGradL;
    ctx.beginPath();
    ctx.arc(cx - 42, headY + 18, 22, 0, Math.PI * 2);
    ctx.fill();

    const blushGradR = ctx.createRadialGradient(cx + 42, headY + 18, 2, cx + 42, headY + 18, 22);
    blushGradR.addColorStop(0, 'rgba(255, 107, 129, 0.7)');
    blushGradR.addColorStop(1, 'rgba(255, 107, 129, 0)');
    ctx.fillStyle = blushGradR;
    ctx.beginPath();
    ctx.arc(cx + 42, headY + 18, 22, 0, Math.PI * 2);
    ctx.fill();

    // 7. Peaceful Closed Smiling Eyes (^ _ ^)
    ctx.strokeStyle = '#3e2723';
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    // Left eye curve
    ctx.beginPath();
    ctx.arc(cx - 32, headY + 8, 16, Math.PI * 1.15, Math.PI * 1.85);
    ctx.stroke();
    // Right eye curve
    ctx.beginPath();
    ctx.arc(cx + 32, headY + 8, 16, Math.PI * 1.15, Math.PI * 1.85);
    ctx.stroke();

    // Gentle sweet smile
    ctx.strokeStyle = '#c0392b';
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.arc(cx, headY + 28, 9, 0.2, Math.PI - 0.2);
    ctx.stroke();

    // 8. Hair Bangs & Twin Side Strands
    ctx.fillStyle = '#261b24';
    // Crown hair
    ctx.beginPath();
    ctx.arc(cx, headY - 15, 82, Math.PI * 0.95, Math.PI * 2.05);
    ctx.fill();

    // Front soft bangs
    ctx.beginPath();
    ctx.moveTo(cx - 75, headY - 20);
    ctx.bezierCurveTo(cx - 40, headY + 15, cx - 20, headY - 5, cx - 10, headY - 2);
    ctx.bezierCurveTo(cx + 10, headY + 12, cx + 30, headY - 10, cx + 75, headY - 20);
    ctx.lineTo(cx + 80, headY - 50);
    ctx.lineTo(cx - 80, headY - 50);
    ctx.closePath();
    ctx.fill();

    // Left long hair lock
    ctx.beginPath();
    ctx.moveTo(cx - 68, headY - 10);
    ctx.bezierCurveTo(cx - 88, headY + 40, cx - 72, headY + 85, cx - 60, headY + 100);
    ctx.bezierCurveTo(cx - 52, headY + 85, cx - 65, headY + 30, cx - 55, headY - 10);
    ctx.fill();

    // Right long hair lock
    ctx.beginPath();
    ctx.moveTo(cx + 68, headY - 10);
    ctx.bezierCurveTo(cx + 88, headY + 40, cx + 72, headY + 85, cx + 60, headY + 100);
    ctx.bezierCurveTo(cx + 52, headY + 85, cx + 65, headY + 30, cx + 55, headY - 10);
    ctx.fill();

    // 9. Sakura Blossom Hairpin with dangling red cord
    const pinX = cx - 55;
    const pinY = headY - 28;
    // Flower petals
    for (let p = 0; p < 5; p++) {
      const rot = (p * Math.PI * 2) / 5;
      ctx.save();
      ctx.translate(pinX, pinY);
      ctx.rotate(rot);
      ctx.fillStyle = '#ff8da9';
      ctx.beginPath();
      ctx.ellipse(0, -14, 8, 14, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
    // Flower center
    ctx.fillStyle = '#ffd32a';
    ctx.beginPath();
    ctx.arc(pinX, pinY, 6, 0, Math.PI * 2);
    ctx.fill();

    // Dangling red ribbon cords
    ctx.strokeStyle = '#e74c3c';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(pinX - 2, pinY + 8);
    ctx.bezierCurveTo(pinX - 10, pinY + 30, pinX - 6, pinY + 45, pinX - 12, pinY + 60);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(pinX + 4, pinY + 8);
    ctx.bezierCurveTo(pinX + 12, pinY + 28, pinX + 8, pinY + 42, pinX + 14, pinY + 55);
    ctx.stroke();

  } else if (state === 'back') {
    // ==========================================
    // BACK VIEW (Walking Away Into the Garden)
    // ==========================================
    const cy = 250;

    // 1. Long Dark Hair draping down the back
    ctx.fillStyle = '#261b24';
    ctx.beginPath();
    ctx.moveTo(cx - 75, cy - 80);
    ctx.bezierCurveTo(cx - 95, cy + 20, cx - 80, cy + 120, cx, cy + 150);
    ctx.bezierCurveTo(cx + 80, cy + 120, cx + 95, cy + 20, cx + 75, cy - 80);
    ctx.closePath();
    ctx.fill();

    // Kimono Bottom
    const kimonoGrad = ctx.createLinearGradient(cx - 70, cy + 60, cx + 70, cy + 170);
    kimonoGrad.addColorStop(0, '#f8a5c2');
    kimonoGrad.addColorStop(1, '#ec407a');
    ctx.fillStyle = kimonoGrad;
    ctx.beginPath();
    ctx.moveTo(cx - 50, cy + 60);
    ctx.lineTo(cx + 50, cy + 60);
    ctx.lineTo(cx + 65, cy + 170);
    ctx.lineTo(cx - 65, cy + 170);
    ctx.closePath();
    ctx.fill();

    // Large Red Obi Bow (Traditional Musubi) on back
    ctx.fillStyle = '#b71540';
    // Left bow loop
    ctx.beginPath();
    ctx.ellipse(cx - 32, cy + 70, 24, 16, -0.3, 0, Math.PI * 2);
    ctx.fill();
    // Right bow loop
    ctx.beginPath();
    ctx.ellipse(cx + 32, cy + 70, 24, 16, 0.3, 0, Math.PI * 2);
    ctx.fill();
    // Bow center knot
    ctx.fillStyle = '#900c3f';
    ctx.beginPath();
    ctx.arc(cx, cy + 70, 12, 0, Math.PI * 2);
    ctx.fill();
    // Golden tassel tails hanging
    ctx.strokeStyle = '#ffd32a';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(cx - 6, cy + 78);
    ctx.lineTo(cx - 15, cy + 115);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(cx + 6, cy + 78);
    ctx.lineTo(cx + 15, cy + 115);
    ctx.stroke();

    // Hair bun / Head
    ctx.fillStyle = '#261b24';
    ctx.beginPath();
    ctx.arc(cx, cy - 75, 78, 0, Math.PI * 2);
    ctx.fill();

    // Hairpin back
    ctx.fillStyle = '#ff8da9';
    ctx.beginPath();
    ctx.arc(cx - 55, cy - 90, 14, 0, Math.PI * 2);
    ctx.fill();

  } else {
    // ==========================================
    // FRONT STANDING / WALKING VIEW
    // ==========================================
    const isWalk = state === 'walk';
    const cy = 250;
    const bob = isWalk ? 6 : 0;

    // 1. Long Hair background silhouette
    ctx.fillStyle = '#261b24';
    ctx.beginPath();
    ctx.ellipse(cx, cy + 20 - bob, 95, 120, 0, 0, Math.PI * 2);
    ctx.fill();

    // 2. Legs / White Tabi socks & Zori sandals
    ctx.fillStyle = '#ffffff';
    const legOffset = isWalk ? 14 : 0;
    // Left leg
    ctx.fillRect(cx - 26, cy + 165 - bob - legOffset, 18, 30);
    // Right leg
    ctx.fillRect(cx + 8, cy + 165 - bob + legOffset, 18, 30);

    // Red zori sandals
    ctx.fillStyle = '#c0392b';
    ctx.fillRect(cx - 28, cy + 192 - bob - legOffset, 22, 8);
    ctx.fillRect(cx + 6, cy + 192 - bob + legOffset, 22, 8);
    // Gold straps
    ctx.fillStyle = '#f1c40f';
    ctx.fillRect(cx - 20, cy + 188 - bob - legOffset, 6, 6);
    ctx.fillRect(cx + 14, cy + 188 - bob + legOffset, 6, 6);

    // 3. Kimono Dress (A-line bell curve)
    const kimonoGrad = ctx.createLinearGradient(cx - 70, cy + 10, cx + 70, cy + 175);
    kimonoGrad.addColorStop(0, '#fbc5d8');
    kimonoGrad.addColorStop(0.5, '#f48fb1');
    kimonoGrad.addColorStop(1, '#ec407a');
    ctx.fillStyle = kimonoGrad;

    ctx.beginPath();
    ctx.moveTo(cx - 45, cy + 15 - bob);
    ctx.lineTo(cx + 45, cy + 15 - bob);
    ctx.lineTo(cx + 68, cy + 170 - bob);
    ctx.lineTo(cx - 68, cy + 170 - bob);
    ctx.closePath();
    ctx.fill();

    // White floral pattern prints on kimono
    ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
    [
      [cx - 35, cy + 85], [cx + 38, cy + 95], [cx - 20, cy + 140], 
      [cx + 30, cy + 148], [cx, cy + 115]
    ].forEach(([px, py]) => {
      ctx.beginPath();
      ctx.arc(px, py - bob, 6, 0, Math.PI * 2);
      ctx.fill();
    });

    // Kimono V-collar
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(cx - 32, cy + 15 - bob);
    ctx.lineTo(cx + 6, cy + 50 - bob);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(cx + 32, cy + 15 - bob);
    ctx.lineTo(cx - 6, cy + 45 - bob);
    ctx.stroke();

    // 4. Crimson Red Obi Sash & Gold cord
    ctx.fillStyle = '#b71540';
    ctx.fillRect(cx - 46, cy + 45 - bob, 92, 26);
    // Gold cord
    ctx.strokeStyle = '#ffd32a';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(cx - 46, cy + 58 - bob);
    ctx.lineTo(cx + 46, cy + 58 - bob);
    ctx.stroke();
    // Center gold jewel knot
    ctx.fillStyle = '#f1c40f';
    ctx.beginPath();
    ctx.arc(cx, cy + 58 - bob, 6, 0, Math.PI * 2);
    ctx.fill();

    // 5. Kimono Sleeves (Fluttering)
    ctx.fillStyle = '#f48fb1';
    const sway = isWalk ? 12 : 0;
    // Left sleeve
    ctx.beginPath();
    ctx.ellipse(cx - 55 - sway, cy + 55 - bob, 22, 42, -0.3, 0, Math.PI * 2);
    ctx.fill();
    // Right sleeve
    ctx.beginPath();
    ctx.ellipse(cx + 55 + sway, cy + 55 - bob, 22, 42, 0.3, 0, Math.PI * 2);
    ctx.fill();

    // Cute little hands peeking out
    ctx.fillStyle = '#ffe0cf';
    ctx.beginPath();
    ctx.arc(cx - 52 - sway, cy + 85 - bob, 9, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(cx + 52 + sway, cy + 85 - bob, 9, 0, Math.PI * 2);
    ctx.fill();

    // 6. Cute Head & Face
    const headY = cy - 65 - bob;
    ctx.fillStyle = '#ffe0cf';
    ctx.beginPath();
    ctx.arc(cx, headY, 78, 0, Math.PI * 2);
    ctx.fill();

    // Rosy blushing cheeks
    const blushL = ctx.createRadialGradient(cx - 42, headY + 18, 2, cx - 42, headY + 18, 24);
    blushL.addColorStop(0, 'rgba(255, 107, 129, 0.8)');
    blushL.addColorStop(1, 'rgba(255, 107, 129, 0)');
    ctx.fillStyle = blushL;
    ctx.beginPath();
    ctx.arc(cx - 42, headY + 18, 24, 0, Math.PI * 2);
    ctx.fill();

    const blushR = ctx.createRadialGradient(cx + 42, headY + 18, 2, cx + 42, headY + 18, 24);
    blushR.addColorStop(0, 'rgba(255, 107, 129, 0.8)');
    blushR.addColorStop(1, 'rgba(255, 107, 129, 0)');
    ctx.fillStyle = blushR;
    ctx.beginPath();
    ctx.arc(cx + 42, headY + 18, 24, 0, Math.PI * 2);
    ctx.fill();

    // 7. Big Sparkly Anime Eyes
    const drawEye = (ex: number, ey: number) => {
      // Dark eye base
      ctx.fillStyle = '#2d142c';
      ctx.beginPath();
      ctx.ellipse(ex, ey, 14, 20, 0, 0, Math.PI * 2);
      ctx.fill();

      // Violet-pink iris gradient
      const irisGrad = ctx.createLinearGradient(ex, ey - 10, ex, ey + 18);
      irisGrad.addColorStop(0, '#511845');
      irisGrad.addColorStop(0.6, '#900c3f');
      irisGrad.addColorStop(1, '#ff6b81');
      ctx.fillStyle = irisGrad;
      ctx.beginPath();
      ctx.ellipse(ex, ey + 4, 12, 14, 0, 0, Math.PI * 2);
      ctx.fill();

      // Big sparkling white highlight
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.ellipse(ex - 4, ey - 4, 5.5, 7, -0.2, 0, Math.PI * 2);
      ctx.fill();

      // Small secondary sparkle
      ctx.beginPath();
      ctx.arc(ex + 4, ey + 8, 3, 0, Math.PI * 2);
      ctx.fill();

      // Cute eyelashes
      ctx.strokeStyle = '#2d142c';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(ex, ey - 10, 16, Math.PI * 1.15, Math.PI * 1.85);
      ctx.stroke();
    };

    drawEye(cx - 30, headY + 4);
    drawEye(cx + 30, headY + 4);

    // Cute mouth
    ctx.fillStyle = '#e84118';
    ctx.beginPath();
    ctx.arc(cx, headY + 28, 6, 0, Math.PI);
    ctx.fill();

    // 8. Hair Bangs & Twin Strands
    ctx.fillStyle = '#261b24';
    // Crown hair
    ctx.beginPath();
    ctx.arc(cx, headY - 15, 82, Math.PI * 0.95, Math.PI * 2.05);
    ctx.fill();

    // Front soft bangs
    ctx.beginPath();
    ctx.moveTo(cx - 75, headY - 20);
    ctx.bezierCurveTo(cx - 40, headY + 15, cx - 20, headY - 5, cx - 10, headY - 2);
    ctx.bezierCurveTo(cx + 10, headY + 12, cx + 30, headY - 10, cx + 75, headY - 20);
    ctx.lineTo(cx + 80, headY - 50);
    ctx.lineTo(cx - 80, headY - 50);
    ctx.closePath();
    ctx.fill();

    // Side hair locks
    ctx.beginPath();
    ctx.moveTo(cx - 68, headY - 10);
    ctx.bezierCurveTo(cx - 88, headY + 40, cx - 72, headY + 85, cx - 60, headY + 110);
    ctx.bezierCurveTo(cx - 52, headY + 95, cx - 65, headY + 30, cx - 55, headY - 10);
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(cx + 68, headY - 10);
    ctx.bezierCurveTo(cx + 88, headY + 40, cx + 72, headY + 85, cx + 60, headY + 110);
    ctx.bezierCurveTo(cx + 52, headY + 95, cx + 65, headY + 30, cx + 55, headY - 10);
    ctx.fill();

    // 9. Sakura Flower Hairpin with dangling red ribbon
    const pinX = cx - 55;
    const pinY = headY - 28;
    for (let p = 0; p < 5; p++) {
      const rot = (p * Math.PI * 2) / 5;
      ctx.save();
      ctx.translate(pinX, pinY);
      ctx.rotate(rot);
      ctx.fillStyle = '#ff8da9';
      ctx.beginPath();
      ctx.ellipse(0, -14, 8, 14, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
    ctx.fillStyle = '#ffd32a';
    ctx.beginPath();
    ctx.arc(pinX, pinY, 6, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#e74c3c';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(pinX - 2, pinY + 8);
    ctx.bezierCurveTo(pinX - 10, pinY + 30, pinX - 6, pinY + 45, pinX - 12, pinY + 60);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(pinX + 4, pinY + 8);
    ctx.bezierCurveTo(pinX + 12, pinY + 28, pinX + 8, pinY + 42, pinX + 14, pinY + 55);
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

/**
 * Creates a soft radial shadow texture to place under the character and props.
 */
export function createSoftShadowTexture(): THREE.CanvasTexture {
  const size = 128;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  const grad = ctx.createRadialGradient(size / 2, size / 2, 4, size / 2, size / 2, size / 2);
  grad.addColorStop(0, 'rgba(30, 20, 10, 0.45)');
  grad.addColorStop(0.5, 'rgba(40, 25, 15, 0.2)');
  grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);

  return new THREE.CanvasTexture(canvas);
}

/**
 * Creates Japanese Garden Flower Bushes texture (blooming daisies & sakura tufts).
 */
export function createFlowerBushTexture(): THREE.CanvasTexture {
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  ctx.clearRect(0, 0, size, size);

  // Draw leafy bush base
  ctx.fillStyle = '#5c8a32';
  for (let i = 0; i < 16; i++) {
    const bx = 60 + Math.random() * 136;
    const by = 90 + Math.random() * 90;
    ctx.beginPath();
    ctx.arc(bx, by, 32 + Math.random() * 20, 0, Math.PI * 2);
    ctx.fill();
  }

  // Draw bright white and pink flowers
  for (let f = 0; f < 28; f++) {
    const fx = 40 + Math.random() * 176;
    const fy = 60 + Math.random() * 120;
    const isPink = Math.random() > 0.4;
    ctx.fillStyle = isPink ? '#ff8da9' : '#ffffff';

    // 5 petals
    for (let p = 0; p < 5; p++) {
      const rot = (p * Math.PI * 2) / 5;
      ctx.beginPath();
      ctx.arc(fx + Math.cos(rot) * 7, fy + Math.sin(rot) * 7, 5, 0, Math.PI * 2);
      ctx.fill();
    }
    // Yellow core
    ctx.fillStyle = '#f1c40f';
    ctx.beginPath();
    ctx.arc(fx, fy, 3.5, 0, Math.PI * 2);
    ctx.fill();
  }

  return new THREE.CanvasTexture(canvas);
}
