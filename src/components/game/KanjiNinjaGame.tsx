import React, { useState, useEffect, useRef, useCallback } from 'react';
import { UserProgress } from '../../types/lesson';
import { getLessonsRangeData } from '../../data/lessons';
import { addGameScore } from '../../utils/storage';
import { soundFX } from '../../utils/soundEffects';
import { 
  X, 
  RotateCcw, 
  Volume2, 
  VolumeX
} from 'lucide-react';

interface KanjiNinjaGameProps {
  progress: UserProgress;
  onUpdateProgress: (progress: UserProgress) => void;
  onClose: () => void;
  initialLesson?: number;
}

interface FlyingItem {
  id: string;
  type: 'word' | 'bomb';
  text: string;
  subText?: string;
  isCorrect: boolean;
  x: number;
  y: number;
  vx: number;
  vy: number;
  rotation: number;
  vRot: number;
  radius: number;
  width: number;
  height: number;
  sliced: boolean;
  sliceAngle?: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  decay: number;
}

interface SlashPoint {
  x: number;
  y: number;
  time: number;
}

export const KanjiNinjaGame: React.FC<KanjiNinjaGameProps> = ({
  progress,
  onUpdateProgress,
  onClose,
  initialLesson = 1,
}) => {
  // Setup state
  const [startLesson, setStartLesson] = useState<number>(initialLesson);
  const [endLesson, setEndLesson] = useState<number>(Math.min(25, initialLesson));
  const [gameMode, setGameMode] = useState<'vocab' | 'kanji'>('vocab');
  // Speed setting: 'slow' (zen / vừa học vừa chơi), 'normal', 'fast'
  const [gameSpeed, setGameSpeed] = useState<'slow' | 'normal' | 'fast'>('slow');

  // In-game state
  const [gameState, setGameState] = useState<'menu' | 'playing' | 'gameover'>('menu');
  const [score, setScore] = useState<number>(0);
  const [lives, setLives] = useState<number>(3);
  const [combo, setCombo] = useState<number>(0);
  const [currentTargetPrompt, setCurrentTargetPrompt] = useState<string>('');
  const [currentTargetSub, setCurrentTargetSub] = useState<string>('');
  const [isNewHigh, setIsNewHigh] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(soundFX.getMuted());

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // References to keep in sync with 60fps game loop
  const flyingItemsRef = useRef<FlyingItem[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const slashTrailRef = useRef<SlashPoint[]>([]);
  const isPointerDownRef = useRef<boolean>(false);
  const currentTargetItemRef = useRef<{ id: string; targetText: string; subText?: string; promptText: string } | null>(null);
  const scoreRef = useRef<number>(0);
  const livesRef = useRef<number>(3);
  const comboRef = useRef<number>(0);
  const spawnTimerRef = useRef<number>(0);
  const screenShakeRef = useRef<number>(0);
  const animationFrameIdRef = useRef<number | null>(null);
  const speedSettingRef = useRef<'slow' | 'normal' | 'fast'>('slow');

  // Sync state to refs
  scoreRef.current = score;
  livesRef.current = lives;
  comboRef.current = combo;
  speedSettingRef.current = gameSpeed;

  // Sound mute toggle
  const toggleMute = () => {
    const next = !isMuted;
    setIsMuted(next);
    soundFX.setMuted(next);
  };

  // Helper to pick next target prompt
  const pickNewTarget = useCallback(() => {
    const { vocabulary, kanji } = getLessonsRangeData(startLesson, endLesson);

    if (gameMode === 'vocab') {
      const validVocab = vocabulary.filter(v => v.meaning && (v.kanji || v.kana));
      if (validVocab.length === 0) return;
      const chosen = validVocab[Math.floor(Math.random() * validVocab.length)];
      const targetText = chosen.kanji || chosen.kana;
      const subText = chosen.kanji ? chosen.kana : undefined;

      currentTargetItemRef.current = {
        id: chosen.id,
        targetText,
        subText,
        promptText: chosen.meaning
      };
      setCurrentTargetPrompt(chosen.meaning);
      setCurrentTargetSub(chosen.type ? `[${chosen.type}]` : 'Từ vựng N5');
    } else {
      const validKanji = kanji.filter(k => k.character);
      if (validKanji.length === 0) return;
      const chosen = validKanji[Math.floor(Math.random() * validKanji.length)];
      currentTargetItemRef.current = {
        id: chosen.id,
        targetText: chosen.character,
        promptText: `${chosen.hanViet} (${chosen.meaning})`
      };
      setCurrentTargetPrompt(`${chosen.hanViet} (${chosen.meaning})`);
      setCurrentTargetSub('Chữ Hán N5');
    }
  }, [startLesson, endLesson, gameMode]);

  // Spawn flying items (plaques & bombs)
  const spawnItems = useCallback((canvasWidth: number, canvasHeight: number) => {
    if (!currentTargetItemRef.current) return;

    const { vocabulary, kanji } = getLessonsRangeData(startLesson, endLesson);
    const target = currentTargetItemRef.current;

    // Check if target is already flying on screen
    const targetAlreadyOnScreen = flyingItemsRef.current.some(item => item.isCorrect && !item.sliced);
    const spawnTargetNow = !targetAlreadyOnScreen;

    // Spawn 1 or 2 items
    const count = spawnTargetNow ? 1 : (Math.random() < 0.6 ? 1 : 2);

    // Physics parameters based on speed setting
    const speedMode = speedSettingRef.current;
    let baseVy = 9.0;
    let randVy = 1.8;
    let baseVx = 0.8;

    if (speedMode === 'normal') {
      baseVy = 11.2;
      randVy = 2.2;
      baseVx = 1.3;
    } else if (speedMode === 'fast') {
      baseVy = 14.0;
      randVy = 3.0;
      baseVx = 2.0;
    }

    for (let i = 0; i < count; i++) {
      const isBomb = !spawnTargetNow && Math.random() < (speedMode === 'slow' ? 0.15 : 0.22);
      const isTarget = spawnTargetNow && i === 0;

      let text = '';
      let subText: string | undefined = undefined;
      let isCorrect = false;

      if (isBomb) {
        text = '💣';
        isCorrect = false;
      } else if (isTarget) {
        text = target.targetText;
        subText = target.subText;
        isCorrect = true;
      } else {
        // Distractor item
        if (gameMode === 'vocab') {
          const others = vocabulary.filter(v => (v.kanji || v.kana) !== target.targetText);
          const rand = others[Math.floor(Math.random() * (others.length || 1))];
          if (rand) {
            text = rand.kanji || rand.kana;
            subText = rand.kanji ? rand.kana : undefined;
          } else {
            text = 'はい';
          }
        } else {
          const others = kanji.filter(k => k.character !== target.targetText);
          const rand = others[Math.floor(Math.random() * (others.length || 1))];
          text = rand ? rand.character : '日';
        }
        isCorrect = false;
      }

      // Calculate width & height: extra large and spacious for cartoon readability!
      let plaqueWidth = 150;
      let plaqueHeight = 76;

      if (isBomb) {
        plaqueWidth = 68;
        plaqueHeight = 68;
      } else if (gameMode === 'kanji') {
        plaqueWidth = 92;
        plaqueHeight = 92;
      } else {
        // Longer words get wider plaques
        plaqueWidth = Math.max(145, text.length * 30 + 40);
        plaqueHeight = subText ? 82 : 72;
      }

      // Physics: launch from bottom with upward arc
      const margin = 110;
      const x = margin + Math.random() * (canvasWidth - margin * 2);
      const y = canvasHeight + plaqueHeight / 2 + 10;
      const vx = (x < canvasWidth / 2 ? 1 : -1) * (baseVx + Math.random() * 1.2);
      const vy = -(baseVy + Math.random() * randVy);

      flyingItemsRef.current.push({
        id: Math.random().toString(),
        type: isBomb ? 'bomb' : 'word',
        text,
        subText,
        isCorrect,
        x,
        y,
        vx,
        vy,
        rotation: (Math.random() - 0.5) * 0.16, // subtle tilt for easy reading
        vRot: (Math.random() - 0.5) * 0.012,  // very slow rotation
        radius: Math.max(plaqueWidth, plaqueHeight) * 0.48,
        width: plaqueWidth,
        height: plaqueHeight,
        sliced: false,
      });
    }
  }, [startLesson, endLesson, gameMode]);

  // Create pixel & spark particles
  const createParticles = (x: number, y: number, color: string, count = 18) => {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 2 + Math.random() * 6.5;
      particlesRef.current.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 3 + Math.random() * 4,
        color,
        alpha: 1.0,
        decay: 0.02 + Math.random() * 0.025,
      });
    }
  };

  // Start game handler
  const handleStartGame = () => {
    soundFX.playSlash();
    setScore(0);
    setLives(3);
    setCombo(0);
    setIsNewHigh(false);
    flyingItemsRef.current = [];
    particlesRef.current = [];
    slashTrailRef.current = [];
    spawnTimerRef.current = 40; // slight head start
    setGameState('playing');
    pickNewTarget();
  };

  // Game over handler
  const handleGameOver = useCallback(() => {
    setGameState('gameover');
    soundFX.playMiss();
    const finalScore = scoreRef.current;
    const { updatedProgress, isNewHigh: newHighAchieved } = addGameScore(progress, finalScore);
    setIsNewHigh(newHighAchieved);
    onUpdateProgress(updatedProgress);
  }, [progress, onUpdateProgress]);

  // Line segment intersection with circle (for slicing)
  const lineIntersectsCircle = (
    p1: { x: number; y: number },
    p2: { x: number; y: number },
    c: { x: number; y: number; r: number }
  ): boolean => {
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    const lenSq = dx * dx + dy * dy;
    if (lenSq === 0) return false;

    const t = Math.max(0, Math.min(1, ((c.x - p1.x) * dx + (c.y - p1.y) * dy) / lenSq));
    const projX = p1.x + t * dx;
    const projY = p1.y + t * dy;

    const distSq = (c.x - projX) * (c.x - projX) + (c.y - projY) * (c.y - projY);
    return distSq <= c.r * c.r;
  };

  // Main 60fps Game Loop
  useEffect(() => {
    if (gameState !== 'playing') return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let isRunning = true;
    const speedMode = speedSettingRef.current;
    // Base gravity: lower = floatier and longer hang time in the air
    const baseGravity = speedMode === 'slow' ? 0.12 : (speedMode === 'normal' ? 0.18 : 0.25);
    const spawnInterval = speedMode === 'slow' ? 140 : (speedMode === 'normal' ? 110 : 85);

    const gameLoop = () => {
      if (!isRunning) return;

      const width = canvas.width;
      const height = canvas.height;

      // Handle screen shake
      ctx.save();
      if (screenShakeRef.current > 0) {
        const shakeX = (Math.random() - 0.5) * screenShakeRef.current;
        const shakeY = (Math.random() - 0.5) * screenShakeRef.current;
        ctx.translate(shakeX, shakeY);
        screenShakeRef.current *= 0.88;
        if (screenShakeRef.current < 0.5) screenShakeRef.current = 0;
      }

      // 1. Draw Japanese Cartoon Sunset Dojo Background
      const skyGrad = ctx.createLinearGradient(0, 0, 0, height);
      skyGrad.addColorStop(0, '#160F28'); // Deep indigo dusk
      skyGrad.addColorStop(0.45, '#35163A'); // Twilight magenta
      skyGrad.addColorStop(0.8, '#6B2745'); // Sunset crimson
      skyGrad.addColorStop(1, '#943841'); // Warm horizon
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, width, height);

      // Glowing Anime Moon
      ctx.save();
      ctx.shadowColor = '#FFE599';
      ctx.shadowBlur = 30;
      ctx.fillStyle = '#FFF3B0';
      ctx.beginPath();
      ctx.arc(width * 0.78, height * 0.22, 44, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Distant Mount Fuji Silhouette
      ctx.fillStyle = '#20112A';
      ctx.beginPath();
      ctx.moveTo(width * 0.12, height * 0.88);
      ctx.lineTo(width * 0.36, height * 0.44);
      ctx.lineTo(width * 0.44, height * 0.44);
      ctx.lineTo(width * 0.68, height * 0.88);
      ctx.closePath();
      ctx.fill();

      // Fuji Snowcap in twilight pink
      ctx.fillStyle = '#D98298';
      ctx.beginPath();
      ctx.moveTo(width * 0.33, height * 0.50);
      ctx.lineTo(width * 0.36, height * 0.44);
      ctx.lineTo(width * 0.44, height * 0.44);
      ctx.lineTo(width * 0.47, height * 0.50);
      ctx.lineTo(width * 0.43, height * 0.52);
      ctx.lineTo(width * 0.40, height * 0.50);
      ctx.lineTo(width * 0.37, height * 0.52);
      ctx.closePath();
      ctx.fill();

      // Torii Gate silhouette on the left
      ctx.fillStyle = 'rgba(28, 12, 32, 0.75)';
      ctx.fillRect(40, height * 0.38, 12, height * 0.55);
      ctx.fillRect(115, height * 0.38, 12, height * 0.55);
      ctx.fillRect(25, height * 0.42, 118, 10);
      ctx.fillRect(32, height * 0.48, 104, 7);

      // Hanging lanterns on corners
      ctx.save();
      ctx.shadowColor = '#FF9E00';
      ctx.shadowBlur = 15;
      // Left Lantern
      ctx.fillStyle = '#D9383A';
      ctx.fillRect(16, 12, 24, 34);
      ctx.fillStyle = '#FFC107';
      ctx.fillRect(20, 20, 16, 18);
      ctx.fillStyle = '#2A1810';
      ctx.fillRect(14, 10, 28, 4);
      ctx.fillRect(14, 44, 28, 4);
      // Right Lantern
      ctx.fillStyle = '#D9383A';
      ctx.fillRect(width - 40, 12, 24, 34);
      ctx.fillStyle = '#FFC107';
      ctx.fillRect(width - 36, 20, 16, 18);
      ctx.fillStyle = '#2A1810';
      ctx.fillRect(width - 42, 10, 28, 4);
      ctx.fillRect(width - 42, 44, 28, 4);
      ctx.restore();

      // Dojo wooden deck at bottom
      ctx.fillStyle = '#2D1822';
      ctx.fillRect(0, height - 32, width, 32);
      ctx.fillStyle = '#C18C5D';
      ctx.fillRect(0, height - 36, width, 5);

      // Floating Cherry Blossom Sakura Petals
      const nowTime = performance.now() * 0.001;
      ctx.fillStyle = 'rgba(255, 175, 195, 0.7)';
      for (let p = 0; p < 14; p++) {
        const px = (width * 0.08 * p + Math.sin(nowTime + p) * 35 + nowTime * 20) % width;
        const py = (height * 0.12 * p + Math.cos(nowTime + p * 0.7) * 25 + nowTime * 30) % height;
        ctx.beginPath();
        ctx.ellipse(px, py, 6.5, 3.5, Math.PI / 4 + Math.sin(nowTime + p), 0, Math.PI * 2);
        ctx.fill();
      }

      // 2. Spawn manager
      spawnTimerRef.current += 1;
      if (spawnTimerRef.current >= spawnInterval) {
        spawnItems(width, height);
        spawnTimerRef.current = 0;
      }

      // 3. Update & Draw Flying Items
      const remainingItems: FlyingItem[] = [];

      for (let i = 0; i < flyingItemsRef.current.length; i++) {
        const item = flyingItemsRef.current[i];

        // Apex Float Mechanic: when near the peak of flight (|vy| < 1.8),
        // reduce gravity so the player has ample time to read the word!
        let currentGravity = baseGravity;
        if (Math.abs(item.vy) < 1.8) {
          currentGravity = baseGravity * 0.45; // Gentle float at peak
        }

        item.x += item.vx;
        item.y += item.vy;
        item.vy += currentGravity;
        item.rotation += item.vRot;

        // Check if sliced by katana trail
        if (!item.sliced && slashTrailRef.current.length >= 2) {
          const trail = slashTrailRef.current;
          for (let s = 1; s < trail.length; s++) {
            if (lineIntersectsCircle(trail[s - 1], trail[s], { x: item.x, y: item.y, r: item.radius })) {
              item.sliced = true;
              item.sliceAngle = Math.atan2(trail[s].y - trail[s - 1].y, trail[s].x - trail[s - 1].x);

              if (item.type === 'bomb') {
                // Bomb sliced!
                soundFX.playBomb();
                screenShakeRef.current = 20;
                createParticles(item.x, item.y, '#EF4444', 28);
                createParticles(item.x, item.y, '#FFB703', 20);

                const newLives = livesRef.current - 1;
                livesRef.current = newLives;
                setLives(newLives);
                setCombo(0);

                if (newLives <= 0) {
                  handleGameOver();
                  ctx.restore();
                  return;
                }
              } else if (item.isCorrect) {
                // Correct word sliced!
                soundFX.playSlash();
                soundFX.playCorrect();
                createParticles(item.x, item.y, '#52B788', 24);
                createParticles(item.x, item.y, '#FFB703', 20);
                createParticles(item.x, item.y, '#FFFDF7', 16);

                const newCombo = comboRef.current + 1;
                comboRef.current = newCombo;
                setCombo(newCombo);

                const addedScore = 100 * Math.min(newCombo, 5);
                const newScore = scoreRef.current + addedScore;
                scoreRef.current = newScore;
                setScore(newScore);

                // Pick next target prompt!
                pickNewTarget();
              } else {
                // Distractor item sliced
                soundFX.playSlash();
                createParticles(item.x, item.y, '#C18C5D', 12);
                setCombo(0);
              }
              break;
            }
          }
        }

        // Check if item fell below screen
        if (item.y > height + 90) {
          if (item.isCorrect && !item.sliced) {
            soundFX.playMiss();
            const newLives = livesRef.current - 1;
            livesRef.current = newLives;
            setLives(newLives);
            setCombo(0);

            if (newLives <= 0) {
              handleGameOver();
              ctx.restore();
              return;
            }
            pickNewTarget();
          }
          continue;
        }

        // Draw item
        ctx.save();
        ctx.translate(item.x, item.y);
        ctx.rotate(item.rotation);

        if (item.type === 'bomb') {
          // Draw Cartoon Bomb
          ctx.save();
          // Dark cartoon drop shadow
          ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
          ctx.beginPath();
          ctx.arc(4, 6, 32, 0, Math.PI * 2);
          ctx.fill();

          // Bomb body
          ctx.beginPath();
          ctx.arc(0, 0, 32, 0, Math.PI * 2);
          const bombGrad = ctx.createRadialGradient(-8, -8, 4, 0, 0, 32);
          bombGrad.addColorStop(0, '#4B5563');
          bombGrad.addColorStop(0.5, '#1F2937');
          bombGrad.addColorStop(1, '#0B0F19');
          ctx.fillStyle = bombGrad;
          ctx.fill();
          ctx.lineWidth = 4;
          ctx.strokeStyle = '#DC2626';
          ctx.stroke();

          // Cute angry cartoon eyes & brows
          ctx.fillStyle = '#EF4444';
          ctx.font = 'bold 15px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('> <', 0, -2);
          ctx.fillText('💢', 14, -14);

          // Fuse and spark
          ctx.beginPath();
          ctx.arc(14, -26, 14, 0, Math.PI * 0.5);
          ctx.strokeStyle = '#D97706';
          ctx.lineWidth = 3.5;
          ctx.stroke();

          ctx.fillStyle = Math.random() < 0.5 ? '#F59E0B' : '#EF4444';
          ctx.fillRect(22, -32, 9, 9);
          ctx.restore();
        } else {
          // Draw Cartoon Wooden Plaque (Ema style)
          const w = item.width;
          const h = item.height;
          const r = 16; // rounded corner

          if (item.sliced) {
            // Sliced in two halves
            ctx.fillStyle = '#8C5835';
            ctx.fillRect(-w / 2, -h / 2, w / 2 - 6, h);
            ctx.fillRect(6, -h / 2, w / 2 - 6, h);
          } else {
            ctx.save();

            // Standard drop shadow for all flying items
            ctx.shadowColor = 'rgba(0, 0, 0, 0.45)';
            ctx.shadowBlur = 10;

            // Dark drop shadow
            ctx.fillStyle = 'rgba(15, 23, 42, 0.55)';
            ctx.beginPath();
            ctx.roundRect(-w / 2 + 5, -h / 2 + 6, w, h, r);
            ctx.fill();

            // Outer wooden plaque body (Identical for all words - player reads the text!)
            ctx.fillStyle = '#C18C5D';
            ctx.beginPath();
            ctx.roundRect(-w / 2, -h / 2, w, h, r);
            ctx.fill();

            // Thick cartoon outline
            ctx.strokeStyle = '#3E1F12';
            ctx.lineWidth = 3.5;
            ctx.stroke();

            // Inner parchment area (Identical clean paper background)
            ctx.fillStyle = '#FAF3E0';
            ctx.beginPath();
            ctx.roundRect(-w / 2 + 5, -h / 2 + 5, w - 10, h - 10, r - 4);
            ctx.fill();

            // Render Japanese text
            ctx.fillStyle = '#1E1B18';

            if (gameMode === 'kanji') {
              // Huge Kanji
              ctx.font = '900 48px "Noto Sans JP", sans-serif';
              ctx.textAlign = 'center';
              ctx.textBaseline = 'middle';
              ctx.fillText(item.text, 0, 2);
            } else {
              if (item.subText) {
                // Word on top, Reading below
                const fontSize = item.text.length > 5 ? 26 : 30;
                ctx.font = `900 ${fontSize}px "Noto Sans JP", sans-serif`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(item.text, 0, -11);

                // SubText (Kana)
                ctx.fillStyle = '#B45309';
                ctx.font = 'bold 14px "Noto Sans JP", sans-serif';
                ctx.fillText(`【${item.subText}】`, 0, 18);
              } else {
                // Single line
                const fontSize = item.text.length > 5 ? 26 : 32;
                ctx.font = `900 ${fontSize}px "Noto Sans JP", sans-serif`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(item.text, 0, 1);
              }
            }

            ctx.restore();
          }
        }

        ctx.restore();
        remainingItems.push(item);
      }

      flyingItemsRef.current = remainingItems;

      // 4. Update & Draw Particles
      const nextParticles: Particle[] = [];
      for (const p of particlesRef.current) {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.18;
        p.alpha -= p.decay;

        if (p.alpha > 0) {
          ctx.save();
          ctx.globalAlpha = p.alpha;
          ctx.fillStyle = p.color;
          ctx.fillRect(p.x, p.y, p.size, p.size);
          ctx.restore();
          nextParticles.push(p);
        }
      }
      particlesRef.current = nextParticles;

      // 5. Draw Glowing Katana Trail
      const now = performance.now();
      slashTrailRef.current = slashTrailRef.current.filter(pt => now - pt.time < 190);

      if (slashTrailRef.current.length >= 2) {
        const trail = slashTrailRef.current;

        // Outer glow (Sakura neon pink)
        ctx.beginPath();
        ctx.moveTo(trail[0].x, trail[0].y);
        for (let i = 1; i < trail.length; i++) {
          ctx.lineTo(trail[i].x, trail[i].y);
        }
        ctx.strokeStyle = 'rgba(255, 117, 143, 0.85)';
        ctx.lineWidth = 12;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.stroke();

        // Inner blade (Bright diamond white)
        ctx.beginPath();
        ctx.moveTo(trail[0].x, trail[0].y);
        for (let i = 1; i < trail.length; i++) {
          ctx.lineTo(trail[i].x, trail[i].y);
        }
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 4;
        ctx.lineCap = 'round';
        ctx.stroke();
      }

      ctx.restore();
      animationFrameIdRef.current = requestAnimationFrame(gameLoop);
    };

    animationFrameIdRef.current = requestAnimationFrame(gameLoop);

    return () => {
      isRunning = false;
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
    };
  }, [gameState, handleGameOver, spawnItems, pickNewTarget]);

  // Pointer event handlers for slash trail (mouse & touch)
  const addTrailPoint = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const x = (clientX - rect.left) * scaleX;
    const y = (clientY - rect.top) * scaleY;

    slashTrailRef.current.push({ x, y, time: performance.now() });
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    isPointerDownRef.current = true;
    slashTrailRef.current = [];
    addTrailPoint(e.clientX, e.clientY);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isPointerDownRef.current) return;
    addTrailPoint(e.clientX, e.clientY);
  };

  const handlePointerUp = () => {
    isPointerDownRef.current = false;
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 md:p-6 select-none font-vi animate-fadeIn">
      
      {/* Expanded Wide Cartoon Modal Frame */}
      <div className="w-full max-w-5xl xl:max-w-6xl max-h-[94vh] bg-gradient-to-b from-[#2d1b36] via-[#1f1527] to-[#120c18] rounded-3xl border-4 border-[#ff9ebb] shadow-[0_25px_80px_rgba(0,0,0,0.9)] flex flex-col overflow-hidden relative">
        
        {/* Top Japanese Arcade Dojo Header */}
        <div className="bg-gradient-to-r from-[#321738] via-[#26102b] to-[#1c0c20] p-3 sm:p-4 border-b-2 border-[#522562] flex items-center justify-between text-white shadow-md">
          <div className="flex items-center gap-2.5">
            <span className="font-vi font-black text-sm sm:text-base text-amber-300 tracking-wider uppercase">
              CHÉM CHỮ NHẬT
            </span>
            <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full bg-rose-500/20 border border-rose-400/40 text-[11px] font-bold text-rose-200">
              Đấu trường từ vựng & Kanji N5
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={toggleMute}
              className="p-1.5 sm:p-2 bg-[#3e1d47] hover:bg-[#4f255b] border border-[#6b3582] text-amber-200 rounded-xl transition-all shadow-sm"
              title="Bật/Tắt âm thanh"
            >
              {isMuted ? <VolumeX className="w-4 h-4 sm:w-5 sm:h-5 text-rose-300" /> : <Volume2 className="w-4 h-4 sm:w-5 sm:h-5" />}
            </button>
            <button
              onClick={() => {
                soundFX.playClick();
                onClose();
              }}
              className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl border border-rose-400 font-bold text-xs sm:text-sm flex items-center gap-1 shadow-md transition-all hover:scale-105 active:scale-95"
            >
              <X className="w-4 h-4" />
              <span>Đóng</span>
            </button>
          </div>
        </div>

        {/* Game Area Container (Spacious 16:9 Canvas) */}
        <div className="relative w-full aspect-video bg-[#120b18] overflow-hidden flex-1">
          
          {/* Canvas (High-res 960x540) */}
          <canvas
            ref={canvasRef}
            width={960}
            height={540}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
            className="w-full h-full cursor-crosshair touch-none"
          />

          {/* Playing HUD Overlay */}
          {gameState === 'playing' && (
            <div className="absolute inset-x-0 top-0 p-3 sm:p-4 pointer-events-none flex flex-col gap-2">
              <div className="flex items-start justify-between gap-2">
                
                {/* Lives (Cartoon Hearts) */}
                <div className="flex items-center gap-1.5 bg-[#2A1810]/85 backdrop-blur-md px-3.5 py-2 rounded-2xl border-2 border-[#8C5835] shadow-lg shrink-0">
                  <span className="font-vi text-xs font-black text-amber-200 mr-1 hidden sm:inline">SINH LỰC:</span>
                  {[1, 2, 3].map((h) => (
                    <span
                      key={h}
                      className={`text-xl sm:text-2xl ${
                        h <= lives ? 'scale-100 filter drop-shadow' : 'opacity-20 grayscale scale-75'
                      } transition-all`}
                    >
                      ❤️
                    </span>
                  ))}
                </div>

                {/* Target Prompt Scroll - EXTRA LARGE & CLEAR CARTOON BANNER */}
                <div className="relative bg-gradient-to-r from-[#FAF3E0] via-[#FFFDF7] to-[#FAF3E0] text-retro-charcoal px-5 sm:px-8 py-2 rounded-2xl border-3 border-[#8C5835] shadow-[0_8px_20px_rgba(0,0,0,0.6)] max-w-md sm:max-w-xl text-center transform hover:scale-105 transition-all">
                  <div className="flex items-center justify-center gap-2 mb-0.5">
                    <span className="text-xs sm:text-sm font-vi font-black text-rose-600 tracking-wider uppercase flex items-center gap-1">
                      <span>🎯 MỤC TIÊU CẦN CHÉM:</span>
                    </span>
                    {currentTargetSub && (
                      <span className="font-vi text-[10px] font-bold bg-amber-200/80 border border-[#8C5835] px-2 py-0.5 rounded-full text-[#4a2810]">
                        {currentTargetSub}
                      </span>
                    )}
                  </div>
                  <span className="font-vi text-lg sm:text-2xl font-black text-[#2A1810] block leading-snug tracking-tight">
                    "{currentTargetPrompt}"
                  </span>
                </div>

                {/* Score & Combo */}
                <div className="bg-[#2A1810]/85 backdrop-blur-md px-3.5 sm:px-5 py-2 rounded-2xl border-2 border-[#8C5835] shadow-lg text-right shrink-0">
                  <div className="font-vi font-black text-xs sm:text-sm text-amber-300 flex items-center gap-1 justify-end">
                    <span>🪙 ĐIỂM:</span>
                    <span className="text-white text-sm sm:text-lg">{score}</span>
                  </div>
                  {combo > 1 && (
                    <div className="font-vi font-black text-xs text-rose-400 animate-bounce mt-0.5 flex items-center gap-1 justify-end">
                      <span>🔥</span>
                      <span>COMBO x{combo}!</span>
                    </div>
                  )}
                </div>

              </div>
            </div>
          )}

          {/* Menu / Setup Screen Overlay (Clean Anime Dojo Lobby) */}
          {gameState === 'menu' && (
            <div className="absolute inset-0 bg-gradient-to-b from-[#1c0f24]/95 via-[#23122e]/95 to-[#160b1d]/95 backdrop-blur-md flex flex-col items-center justify-center p-3 sm:p-6 text-white text-center overflow-y-auto">
              
              {/* Clean, Non-Clipped Header */}
              <div className="flex flex-col items-center mb-4 sm:mb-6">
                <div className="px-4 py-1 rounded-full bg-rose-500/15 border border-rose-400/30 text-xs font-bold text-rose-200 mb-2 tracking-widest uppercase">
                  Luyện phản xạ • Vừa học vừa chơi
                </div>
                <h1 className="font-vi text-3xl sm:text-5xl font-black text-[#FFD166] drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)] tracking-wider uppercase py-2 leading-relaxed">
                  CHÉM CHỮ NHẬT
                </h1>
                <p className="font-vi text-xs sm:text-sm text-slate-300 font-medium max-w-lg mt-1 leading-relaxed">
                  Đọc nghĩa trên bảng mục tiêu, tự quan sát và chém đúng từ tiếng Nhật đang bay • Tránh xa bom hẹn giờ!
                </p>
              </div>

              {/* Spacious 2-Column Options Grid */}
              <div className="w-full max-w-3xl grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4 mb-5 text-left">
                
                {/* 1. Game Mode Card */}
                <div className="bg-[#2a1733]/90 border border-[#5d3070] p-4 rounded-2xl shadow-lg flex flex-col justify-between">
                  <div>
                    <label className="font-vi text-xs text-amber-300 block mb-2.5 font-black uppercase tracking-wider">
                      1. CHỌN CHẾ ĐỘ CHƠI:
                    </label>
                    <div className="grid grid-cols-2 gap-2.5">
                      <button
                        onClick={() => setGameMode('vocab')}
                        className={`p-3 rounded-xl text-xs font-vi font-black border-2 transition-all flex flex-col items-center gap-1 ${
                          gameMode === 'vocab'
                            ? 'bg-rose-600 text-white border-amber-300 shadow-md'
                            : 'bg-[#1b0d21] text-slate-300 border-[#472255] hover:bg-[#25122e]'
                        }`}
                      >
                        <span className="text-sm font-black">Từ Vựng</span>
                        <span className="text-[11px] opacity-80 font-normal">Nghĩa ➜ Chữ</span>
                      </button>

                      <button
                        onClick={() => setGameMode('kanji')}
                        className={`p-3 rounded-xl text-xs font-vi font-black border-2 transition-all flex flex-col items-center gap-1 ${
                          gameMode === 'kanji'
                            ? 'bg-emerald-600 text-white border-amber-300 shadow-md'
                            : 'bg-[#1b0d21] text-slate-300 border-[#472255] hover:bg-[#25122e]'
                        }`}
                      >
                        <span className="text-sm font-black">Kanji Hán Tự</span>
                        <span className="text-[11px] opacity-80 font-normal">Hán Việt ➜ Mặt Chữ</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* 2. Speed / Difficulty Card */}
                <div className="bg-[#2a1733]/90 border border-[#5d3070] p-4 rounded-2xl shadow-lg flex flex-col justify-between">
                  <div>
                    <label className="font-vi text-xs text-amber-300 block mb-2.5 font-black uppercase tracking-wider">
                      2. TỐC ĐỘ BAY CỦA CHỮ:
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        onClick={() => setGameSpeed('slow')}
                        className={`p-2.5 rounded-xl text-xs font-vi font-bold border-2 transition-all flex flex-col items-center gap-0.5 ${
                          gameSpeed === 'slow'
                            ? 'bg-emerald-600 text-white border-amber-300 shadow-md font-black'
                            : 'bg-[#1b0d21] text-slate-300 border-[#472255] hover:bg-[#25122e]'
                        }`}
                      >
                        <span className="font-black text-xs">Chậm</span>
                        <span className="text-[10px] opacity-80">Dễ học</span>
                      </button>

                      <button
                        onClick={() => setGameSpeed('normal')}
                        className={`p-2.5 rounded-xl text-xs font-vi font-bold border-2 transition-all flex flex-col items-center gap-0.5 ${
                          gameSpeed === 'normal'
                            ? 'bg-amber-500 text-stone-900 border-white shadow-md font-black'
                            : 'bg-[#1b0d21] text-slate-300 border-[#472255] hover:bg-[#25122e]'
                        }`}
                      >
                        <span className="font-black text-xs">Tiêu chuẩn</span>
                        <span className="text-[10px] opacity-80">Vừa phải</span>
                      </button>

                      <button
                        onClick={() => setGameSpeed('fast')}
                        className={`p-2.5 rounded-xl text-xs font-vi font-bold border-2 transition-all flex flex-col items-center gap-0.5 ${
                          gameSpeed === 'fast'
                            ? 'bg-rose-600 text-white border-amber-300 shadow-md font-black'
                            : 'bg-[#1b0d21] text-slate-300 border-[#472255] hover:bg-[#25122e]'
                        }`}
                      >
                        <span className="font-black text-xs">Siêu tốc</span>
                        <span className="text-[10px] opacity-80">Thử thách</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* 3. Lesson Range Card (Full width) */}
                <div className="md:col-span-2 bg-[#2a1733]/90 border border-[#5d3070] p-4 rounded-2xl shadow-lg">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                    <label className="font-vi text-xs text-amber-300 font-black uppercase tracking-wider">
                      3. PHẠM VI BÀI HỌC (MINNA NO NIHONGO 1 - 25):
                    </label>

                    {/* Quick Presets */}
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <button
                        onClick={() => {
                          setStartLesson(initialLesson);
                          setEndLesson(initialLesson);
                        }}
                        className="px-2.5 py-1 text-xs bg-[#40204d] hover:bg-[#522962] text-amber-200 rounded-lg border border-[#6b3582] font-bold transition-colors"
                      >
                        Bài {initialLesson}
                      </button>
                      <button
                        onClick={() => {
                          setStartLesson(1);
                          setEndLesson(5);
                        }}
                        className="px-2.5 py-1 text-xs bg-[#40204d] hover:bg-[#522962] text-amber-200 rounded-lg border border-[#6b3582] font-bold transition-colors"
                      >
                        Bài 1 - 5
                      </button>
                      <button
                        onClick={() => {
                          setStartLesson(1);
                          setEndLesson(10);
                        }}
                        className="px-2.5 py-1 text-xs bg-[#40204d] hover:bg-[#522962] text-amber-200 rounded-lg border border-[#6b3582] font-bold transition-colors"
                      >
                        Bài 1 - 10
                      </button>
                      <button
                        onClick={() => {
                          setStartLesson(1);
                          setEndLesson(25);
                        }}
                        className="px-2.5 py-1 text-xs bg-[#40204d] hover:bg-[#522962] text-amber-200 rounded-lg border border-[#6b3582] font-bold transition-colors"
                      >
                        Tất cả 25 bài
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex-1 flex items-center gap-2 bg-[#1b0d21] px-3.5 py-2 rounded-xl border border-[#472255]">
                      <span className="text-xs text-slate-300 font-bold shrink-0">Từ bài:</span>
                      <select
                        value={startLesson}
                        onChange={(e) => setStartLesson(Number(e.target.value))}
                        className="w-full bg-transparent text-amber-200 text-xs font-bold focus:outline-none cursor-pointer"
                      >
                        {Array.from({ length: 25 }, (_, i) => i + 1).map((n) => (
                          <option key={n} value={n} className="bg-[#24122d] text-white">
                            Bài {n}
                          </option>
                        ))}
                      </select>
                    </div>

                    <span className="text-amber-400 font-black text-sm">➜</span>

                    <div className="flex-1 flex items-center gap-2 bg-[#1b0d21] px-3.5 py-2 rounded-xl border border-[#472255]">
                      <span className="text-xs text-slate-300 font-bold shrink-0">Đến bài:</span>
                      <select
                        value={endLesson}
                        onChange={(e) => setEndLesson(Number(e.target.value))}
                        className="w-full bg-transparent text-amber-200 text-xs font-bold focus:outline-none cursor-pointer"
                      >
                        {Array.from({ length: 25 }, (_, i) => i + 1).map((n) => (
                          <option key={n} value={n} className="bg-[#24122d] text-white">
                            Bài {n}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* 4. High Score & Tip Bar */}
                <div className="md:col-span-2 flex items-center justify-between gap-3 bg-[#1b0d21]/90 border border-[#472255] px-4 py-2.5 rounded-2xl text-xs text-amber-200">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-amber-300">KỶ LỤC HIỆN TẠI:</span>
                    <span className="text-white font-black">{progress.highScore || 0} điểm</span>
                  </div>

                  <div className="text-slate-300 text-[11px] hidden sm:block">
                    Quan sát kỹ chữ tiếng Nhật bay lên và chém đúng mục tiêu để nhận điểm và combo!
                  </div>
                </div>

              </div>

              {/* Clean, Bold Start Button */}
              <button
                onClick={handleStartGame}
                className="px-10 sm:px-14 py-3.5 sm:py-4 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-vi font-black text-sm sm:text-base uppercase tracking-wider shadow-xl border-2 border-rose-300 transition-all transform hover:scale-105 active:scale-95"
              >
                BẮT ĐẦU VÀO ĐẤU TRƯỜNG
              </button>

            </div>
          )}

          {/* Game Over Screen Overlay (Celebration & Retry) */}
          {gameState === 'gameover' && (
            <div className="absolute inset-0 bg-gradient-to-b from-[#1c0f24]/95 via-[#23122e]/95 to-[#160b1d]/95 backdrop-blur-md flex flex-col items-center justify-center p-4 text-white text-center animate-fadeIn">
              
              {/* Star Rating based on score */}
              <div className="flex items-center gap-2 text-3xl sm:text-4xl mb-2 animate-bounce">
                <span className={score >= 100 ? 'text-amber-300 filter drop-shadow' : 'text-slate-600'}>⭐</span>
                <span className={score >= 400 ? 'text-amber-300 filter drop-shadow' : 'text-slate-600'}>⭐</span>
                <span className={score >= 800 ? 'text-amber-300 filter drop-shadow' : 'text-slate-600'}>⭐</span>
              </div>

              <h2 className="font-vi text-3xl sm:text-4xl text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-amber-200 to-yellow-300 mb-1 font-black tracking-wider uppercase filter drop-shadow">
                KẾT THÚC VÒNG ĐẤU!
              </h2>
              <p className="font-vi text-xs sm:text-sm text-slate-300 mb-4 font-medium">
                {score >= 500
                  ? 'Tuyệt vời! Kiếm pháp của bạn rất nhanh nhẹn và chuẩn xác! 🥷✨'
                  : 'Đừng nản lòng! Luyện tập vài ván nữa là nhớ chữ siêu nhanh! 💪'}
              </p>

              {/* Score summary parchment card */}
              <div className="bg-[#FAF3E0] text-[#2A1810] border-3 border-[#8C5835] rounded-2xl p-4 sm:p-5 w-72 sm:w-80 mb-5 shadow-2xl space-y-2.5">
                <div className="font-vi text-xs text-[#8C5835] font-black uppercase tracking-wider">
                  ĐIỂM TRẬN NÀY:
                </div>
                <div className="font-vi text-3xl sm:text-4xl text-[#B91C1C] font-black">
                  {score}
                </div>

                {isNewHigh && (
                  <div className="inline-flex items-center gap-1.5 text-xs font-vi font-black bg-gradient-to-r from-amber-400 to-yellow-400 text-stone-900 px-3 py-1 rounded-full border border-amber-500 shadow-sm animate-pulse">
                    <span>👑</span> <span>KỶ LỤC MỚI!</span>
                  </div>
                )}

                <div className="text-xs font-vi font-bold text-emerald-700 pt-2 border-t border-[#D3B28B] flex items-center justify-center gap-1">
                  <span>✨ Thưởng:</span>
                  <span className="font-black text-sm">+{Math.floor(score / 2)} EXP</span>
                  <span>kinh nghiệm</span>
                </div>
              </div>

              {/* Replay / Exit buttons */}
              <div className="flex items-center gap-3">
                <button
                  onClick={handleStartGame}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-vi font-black text-xs sm:text-sm flex items-center gap-2 uppercase tracking-wide shadow-lg transition-transform hover:scale-105 active:scale-95 border-2 border-emerald-300"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>CHƠI LẠI NGAY</span>
                </button>

                <button
                  onClick={() => setGameState('menu')}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-600 hover:to-slate-700 text-white font-vi font-bold text-xs sm:text-sm border-2 border-slate-500 shadow-lg transition-transform hover:scale-105 active:scale-95"
                >
                  VỀ PHÒNG CHỜ
                </button>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
