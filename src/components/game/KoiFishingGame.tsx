import React, { useState, useEffect, useRef, useCallback } from 'react';
import { UserProgress } from '../../types/lesson';
import { getLessonsRangeData } from '../../data/lessons';
import { addFishingGameScore } from '../../utils/storage';
import { soundFX } from '../../utils/soundEffects';
import { playJapaneseAudio } from '../../utils/audio';
import { 
  X, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Volume1,
  Languages,
  Zap
} from 'lucide-react';

interface KoiFishingGameProps {
  progress: UserProgress;
  onUpdateProgress: (progress: UserProgress) => void;
  onClose: () => void;
  initialLesson?: number;
}

export type GameMode = 'listening' | 'vocab' | 'kanji';
export type GameDurationMode = 'timed' | 'zen';
export type ScriptDisplayMode = 'hiragana_kanji' | 'kanji_furigana' | 'hiragana_meaning';

interface KoiFish {
  id: string;
  text: string;
  subText: string;
  vietnamese: string;
  isTarget: boolean;
  x: number;
  y: number;
  vx: number;
  baseVx: number;
  baseY: number;
  targetY: number;
  swimTimer: number;
  colorType: 'kohaku' | 'yamabuki' | 'asagi' | 'shiro';
  scale: number;
  facingRight: boolean;
  state: 'swimming' | 'nibbling' | 'biting' | 'caught' | 'escaping';
  biteTimer: number;
  escapeTimer: number;
  caughtProgress: number; // 0 to 1 for leaping out of water
}

interface WaterRipple {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  alpha: number;
}

interface LilyPad {
  x: number;
  y: number;
  radius: number;
  flower: boolean;
}

interface SakuraPetal {
  x: number;
  y: number;
  vx: number;
  vy: number;
  rotation: number;
  vRot: number;
  scale: number;
}

export const KoiFishingGame: React.FC<KoiFishingGameProps> = ({
  progress,
  onUpdateProgress,
  onClose,
  initialLesson = 1,
}) => {
  // Canvas refs
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Setup / Lobby states
  const [gameState, setGameState] = useState<'menu' | 'playing' | 'gameover'>('menu');
  const [gameMode, setGameMode] = useState<GameMode>('listening');
  const [durationMode, setDurationMode] = useState<GameDurationMode>('timed');
  const [scriptDisplayMode, setScriptDisplayMode] = useState<ScriptDisplayMode>('hiragana_kanji');
  const scriptDisplayModeRef = useRef<ScriptDisplayMode>('hiragana_kanji');
  const [startLesson, setStartLesson] = useState<number>(initialLesson);
  const [endLesson, setEndLesson] = useState<number>(initialLesson);

  // Audio mute and speed states
  const [isAudioMuted, setIsAudioMuted] = useState<boolean>(soundFX.getMuted());
  const [audioSpeed, setAudioSpeedState] = useState<number>(1.15);
  const audioSpeedRef = useRef<number>(1.15);

  // In-Game score states
  const [score, setScore] = useState<number>(0);
  const [combo, setCombo] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(60);
  const [caughtCount, setCaughtCount] = useState<number>(0);
  const [isNewHigh, setIsNewHigh] = useState<boolean>(false);
  const [caughtList, setCaughtList] = useState<Array<{ text: string; subText: string; meaning: string }>>([]);

  // Current Target Word
  const [currentTargetPrompt, setCurrentTargetPrompt] = useState<string>('');
  const [currentTargetAudio, setCurrentTargetAudio] = useState<string>('');
  const [targetFlash, setTargetFlash] = useState<boolean>(false);

  // Notification Banner (when caught)
  const [caughtToast, setCaughtToast] = useState<{ text: string; subText: string; meaning: string } | null>(null);

  // Active items refs for animation loop
  const fishesRef = useRef<KoiFish[]>([]);
  const ripplesRef = useRef<WaterRipple[]>([]);
  const lilyPadsRef = useRef<LilyPad[]>([]);
  const sakuraPetalsRef = useRef<SakuraPetal[]>([]);

  // Movable Bobber Position in Pond
  const bobberPosRef = useRef<{ x: number; y: number; bobY: number }>({ x: 500, y: 310, bobY: 310 });
  const isRodReelingRef = useRef<boolean>(false);
  const lastReelTimeRef = useRef<number>(0);
  const keysPressedRef = useRef<{ [code: string]: boolean }>({});

  // Words bank
  const poolRef = useRef<Array<{ word: string; reading: string; meaning: string; kanji?: string; isCompound?: boolean }>>([]);
  const targetWordRef = useRef<{ word: string; reading: string; meaning: string; kanji?: string; isCompound?: boolean } | null>(null);

  // Toggle Mute
  const toggleMute = () => {
    const next = !isAudioMuted;
    setIsAudioMuted(next);
    soundFX.setMuted(next);
  };

  // Speak Current Target Word (using Japanese Speech Synthesis)
  const playCurrentTargetAudio = useCallback(() => {
    if (currentTargetAudio) {
      playJapaneseAudio(currentTargetAudio, undefined, audioSpeedRef.current);
    }
  }, [currentTargetAudio]);

  // Generate Lily Pads & Petals once per match
  const initPondScenery = useCallback((width: number, height: number) => {
    const pads: LilyPad[] = [];
    const padCoords = [
      { x: 120, y: 150, r: 24, flower: true },
      { x: 150, y: 180, r: 18, flower: false },
      { x: width - 140, y: 130, r: 28, flower: true },
      { x: width - 110, y: 170, r: 20, flower: false },
      { x: 220, y: height - 120, r: 26, flower: false },
      { x: width - 200, y: height - 100, r: 30, flower: true },
    ];
    padCoords.forEach(c => pads.push({ x: c.x, y: c.y, radius: c.r, flower: c.flower }));
    lilyPadsRef.current = pads;

    const petals: SakuraPetal[] = [];
    for (let i = 0; i < 18; i++) {
      petals.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: 0.2 + Math.random() * 0.3,
        vy: 0.1 + Math.random() * 0.2,
        rotation: Math.random() * Math.PI * 2,
        vRot: (Math.random() - 0.5) * 0.02,
        scale: 0.8 + Math.random() * 0.5,
      });
    }
    sakuraPetalsRef.current = petals;
  }, []);

  // Spawn Water Ripple effect
  const createRipple = (x: number, y: number, maxRadius = 35) => {
    ripplesRef.current.push({
      x,
      y,
      radius: 4,
      maxRadius,
      alpha: 0.7,
    });
  };

  // Helper to format fish label (Hiragana / Kanji / Meaning) according to N5 learning preferences
  const formatFishLabels = useCallback((
    item: { word: string; reading: string; meaning: string; kanji?: string; isCompound?: boolean },
    mode: GameMode,
    displayPref: ScriptDisplayMode
  ) => {
    let text = item.reading || item.word;
    let sub = item.kanji && item.kanji !== text ? `(${item.kanji})` : '';

    if (mode === 'kanji') {
      text = item.kanji || item.word;
      // Do NOT show Hán Việt / Vietnamese translation under Kanji characters (prevents spoiler/giveaway)
      if (item.isCompound && displayPref === 'kanji_furigana' && item.reading) {
        sub = `【${item.reading}】`;
      } else {
        sub = '';
      }
    } else if (displayPref === 'kanji_furigana') {
      text = item.kanji || item.reading || item.word;
      sub = (item.kanji && item.reading && item.kanji !== item.reading) ? `【${item.reading}】` : '';
    } else if (displayPref === 'hiragana_meaning') {
      text = item.reading || item.word;
      const cleanMeaning = item.meaning ? item.meaning.split(/[,(]/)[0].trim() : '';
      sub = cleanMeaning ? `(${cleanMeaning})` : '';
    } else {
      // 'hiragana_kanji' (Default for N5):
      // Always displays Hiragana as primary, with Kanji below in brackets if available
      text = item.reading || item.word;
      sub = item.kanji && item.kanji !== text ? `(${item.kanji})` : '';
    }

    return { text, sub };
  }, []);

  // Update fish labels dynamically when user switches display mode mid-game
  const updateFishesDisplay = useCallback((newMode: ScriptDisplayMode) => {
    setScriptDisplayMode(newMode);
    scriptDisplayModeRef.current = newMode;
    soundFX.playClick();

    fishesRef.current.forEach(f => {
      const matched = poolRef.current.find(
        p => p.meaning === f.vietnamese || p.word === f.text || p.reading === f.text || p.kanji === f.text
      );
      if (matched) {
        const { text, sub } = formatFishLabels(matched, gameMode, newMode);
        f.text = text;
        f.subText = sub;
      }
    });
  }, [gameMode, formatFishLabels]);

  // Helper: Pick a new target and respawn fishes
  const pickNewTarget = useCallback(() => {
    const pool = poolRef.current;
    if (pool.length === 0) return;

    // Pick random target word
    const target = pool[Math.floor(Math.random() * pool.length)];
    targetWordRef.current = target;

    const promptText = 
      gameMode === 'listening' ? target.reading || target.word
      : gameMode === 'kanji' ? target.meaning
      : target.meaning;

    const speechText = target.reading || target.word;

    setCurrentTargetPrompt(promptText);
    setCurrentTargetAudio(speechText);
    setTargetFlash(true);
    setTimeout(() => setTargetFlash(false), 600);

    // Speak automatically ONLY in listening mode!
    // In vocab and kanji mode, audio is not played so it doesn't give away the Japanese answer
    if (gameMode === 'listening' && speechText) {
      playJapaneseAudio(speechText, undefined, audioSpeedRef.current);
    }

    // Prepare fish options: 1 target fish + 3-4 distractor fishes
    const otherPool = pool.filter(p => p.word !== target.word);
    const shuffledOthers = [...otherPool].sort(() => Math.random() - 0.5).slice(0, 3);

    const newFishData = [
      { item: target, isTarget: true },
      ...shuffledOthers.map(item => ({ item, isTarget: false })),
    ].sort(() => Math.random() - 0.5);

    // Spawn / reconfigure fishes
    const colorTypes: Array<'kohaku' | 'yamabuki' | 'asagi' | 'shiro'> = ['kohaku', 'yamabuki', 'asagi', 'shiro'];
    const canvas = canvasRef.current;
    const width = canvas ? canvas.width : 960;

    // Fixed distinct swimming lanes in the pond
    const bobberY = bobberPosRef.current.y || 310;
    const distinctLanes = [
      bobberY,       // Lane 0: directly aligns with bobber
      bobberY - 90,  // Lane 1: upper lane (~220)
      bobberY + 80,  // Lane 2: lower lane (~390)
      bobberY + 145, // Lane 3: bottom lane (~455)
    ];

    const spawnedFishes: KoiFish[] = newFishData.map((d, idx) => {
      // The target fish is guaranteed to align with the bobber lane (or steer into it)
      let baseY = distinctLanes[idx % distinctLanes.length];
      if (d.isTarget) {
        baseY = bobberY;
      }

      const fromLeft = idx % 2 === 0;
      // Stagger start X positions by 170px so fishes never bunch up or overlap
      const x = fromLeft ? -100 - idx * 170 : width + 100 + idx * 170;
      // Gentle, readable, relaxing speed
      const baseSpeed = 0.95 + (idx % 2) * 0.15;
      const vx = fromLeft ? baseSpeed : -baseSpeed;

      const { text, sub } = formatFishLabels(d.item, gameMode, scriptDisplayModeRef.current);

      return {
        id: `fish-${Date.now()}-${idx}`,
        text,
        subText: sub,
        vietnamese: d.item.meaning,
        isTarget: d.isTarget,
        x,
        y: baseY,
        vx,
        baseVx: baseSpeed,
        baseY,
        targetY: baseY,
        swimTimer: Math.random() * 10,
        colorType: colorTypes[idx % colorTypes.length],
        scale: 0.95 + (idx % 2) * 0.1,
        facingRight: fromLeft,
        state: 'swimming',
        biteTimer: 0,
        escapeTimer: 0,
        caughtProgress: 0,
      };
    });

    fishesRef.current = spawnedFishes;
  }, [gameMode, formatFishLabels]);

  // Start the Game
  const handleStartGame = () => {
    soundFX.playClick();

    // 1. Load vocabulary and kanji data for selected lessons
    const s = Math.min(startLesson, endLesson);
    const e = Math.max(startLesson, endLesson);
    const { vocabulary, kanji } = getLessonsRangeData(s, e);

    const wordsPool: Array<{ word: string; reading: string; meaning: string; kanji?: string; isCompound?: boolean }> = [];

    if (gameMode === 'kanji') {
      const seenWords = new Set<string>();

      kanji.filter(k => k.character).forEach((k) => {
        // 1. Single Kanji
        if (!seenWords.has(k.character)) {
          seenWords.add(k.character);
          wordsPool.push({
            word: k.character,
            kanji: k.character,
            reading: k.onyomi?.[0] || k.kunyomi?.[0] || '',
            meaning: `${k.hanViet} (${k.meaning})`,
            isCompound: false,
          });
        }

        // 2. Add Kanji compound words (từ ghép của bài học)
        if (k.examples && Array.isArray(k.examples)) {
          k.examples.forEach(ex => {
            if (ex.word && ex.meaning && !seenWords.has(ex.word)) {
              seenWords.add(ex.word);
              wordsPool.push({
                word: ex.word,
                kanji: ex.word,
                reading: ex.reading || '',
                meaning: ex.meaning,
                isCompound: true,
              });
            }
          });
        }
      });

      // Fallback if no kanji in range
      if (wordsPool.length < 5) {
        vocabulary.filter(v => v.kanji || v.kana).forEach((v) => {
          const w = v.kanji || v.kana;
          if (!seenWords.has(w)) {
            seenWords.add(w);
            wordsPool.push({
              word: w,
              kanji: v.kanji,
              reading: v.kana,
              meaning: v.meaning,
              isCompound: true,
            });
          }
        });
      }
    } else {
      vocabulary.filter(v => v.kanji || v.kana).forEach((v) => {
        wordsPool.push({
          word: v.kanji || v.kana,
          reading: v.kana,
          meaning: v.meaning,
          kanji: v.kanji,
          isCompound: false,
        });
      });
    }

    if (wordsPool.length === 0) {
      alert('Không tìm thấy dữ liệu từ vựng trong phạm vi bài học đã chọn!');
      return;
    }

    poolRef.current = wordsPool;
    setScore(0);
    setCombo(0);
    setTimeLeft(60);
    setCaughtCount(0);
    setIsNewHigh(false);
    setCaughtList([]);
    setCaughtToast(null);

    setGameState('playing');
  };

  // Initialize Game on Canvas Ready
  useEffect(() => {
    if (gameState !== 'playing') return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    initPondScenery(canvas.width, canvas.height);
    pickNewTarget();

    // Bobber in center right
    bobberPosRef.current = {
      x: canvas.width * 0.52,
      y: canvas.height * 0.56,
      bobY: canvas.height * 0.56,
    };
  }, [gameState, initPondScenery, pickNewTarget]);

  // Timed Countdown Interval
  useEffect(() => {
    if (gameState !== 'playing' || durationMode === 'zen') return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleGameOver();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState, durationMode]);

  // Handle Game Over
  const handleGameOver = useCallback(() => {
    soundFX.playGameOver();
    const finalScore = score;
    const { updatedProgress, isNewHigh: newHighBool } = addFishingGameScore(progress, finalScore);
    onUpdateProgress(updatedProgress);
    setIsNewHigh(newHighBool);
    setGameState('gameover');
  }, [score, progress, onUpdateProgress]);

  // Player action: Pull Rod (Space or Click)
  const handleReelAction = useCallback(() => {
    if (gameState !== 'playing') return;

    // Cooldown check (prevent rapid button mashing / key repeat)
    const now = Date.now();
    if (now - lastReelTimeRef.current < 350) return;
    lastReelTimeRef.current = now;

    isRodReelingRef.current = true;
    setTimeout(() => {
      isRodReelingRef.current = false;
    }, 350);

    const bobber = bobberPosRef.current;
    createRipple(bobber.x, bobber.y, 45);

    // Only grab a fish that is currently BITING or right on the hook (< 38px)
    const fishes = fishesRef.current;
    let grabbedFish: KoiFish | null = null;

    for (const fish of fishes) {
      if (fish.state === 'caught') continue;
      const dist = Math.hypot(fish.x - bobber.x, fish.y - bobber.y);
      if (fish.state === 'biting' || dist < 38) {
        grabbedFish = fish;
        break;
      }
    }

    if (grabbedFish) {
      soundFX.playReel();

      if (grabbedFish.isTarget) {
        // SUCCESS: Caught target fish!
        soundFX.playCorrect();
        soundFX.playSplash();
        grabbedFish.state = 'caught';
        createRipple(bobber.x, bobber.y, 65);

        const earnedPoints = 100 + combo * 25;
        setScore(prev => prev + earnedPoints);
        setCombo(prev => prev + 1);
        setCaughtCount(prev => prev + 1);

        if (durationMode === 'timed') {
          setTimeLeft(prev => Math.min(99, prev + 3));
        }

        const info = {
          text: grabbedFish.text,
          subText: grabbedFish.subText,
          meaning: grabbedFish.vietnamese,
        };
        setCaughtList(prev => [info, ...prev]);
        setCaughtToast(info);

        // Speak target word congratulation
        playJapaneseAudio(grabbedFish.text, undefined, audioSpeedRef.current);

        // Next round after 1.2s
        setTimeout(() => {
          setCaughtToast(null);
          pickNewTarget();
        }, 1300);
      } else {
        // MISSED: Wrong fish was biting!
        soundFX.playMiss();
        soundFX.playSplash();
        grabbedFish.state = 'escaping';
        grabbedFish.escapeTimer = 0.8;
        // Bounded temporary dart - speed returns to baseVx when escapeTimer finishes
        grabbedFish.vx = (grabbedFish.facingRight ? 1 : -1) * Math.min(1.5, grabbedFish.baseVx * 1.3);
        setCombo(0);
        if (durationMode === 'timed') {
          setTimeLeft(prev => Math.max(0, prev - 3));
        }
      }
    } else {
      // Reeled empty water - fishes keep swimming calmly, ZERO acceleration
      soundFX.playSplash();
    }
  }, [gameState, combo, durationMode, pickNewTarget]);

  // Handle Click / Tap on Canvas: Reel if biting, or cast bobber to target point
  const handleCanvasClick = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (gameState !== 'playing') return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const clickX = (e.clientX - rect.left) * scaleX;
    const clickY = (e.clientY - rect.top) * scaleY;

    // Check if any fish is currently biting or right near bobber
    const bobber = bobberPosRef.current;
    const isBitingOrNear = fishesRef.current.some(
      f => (f.state === 'biting' || Math.hypot(f.x - bobber.x, f.y - bobber.y) < 42) && f.state !== 'caught'
    );

    if (isBitingOrNear) {
      handleReelAction();
    } else {
      // Cast / move bobber to clicked position in the open pond
      const clampedX = Math.max(190, Math.min(canvas.width - 90, clickX));
      const clampedY = Math.max(150, Math.min(canvas.height - 75, clickY));
      bobberPosRef.current.x = clampedX;
      bobberPosRef.current.bobY = clampedY;
      createRipple(clampedX, clampedY, 35);
      soundFX.playSplash();
    }
  }, [gameState, handleReelAction]);

  // Global Keyboard Handler for WASD, Arrow keys, Spacebar & R
  useEffect(() => {
    if (gameState !== 'playing') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent browser scroll when navigating or playing
      if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) {
        e.preventDefault();
      }

      keysPressedRef.current[e.code] = true;

      if (e.code === 'Space') {
        handleReelAction();
      } else if (e.code === 'KeyR' && gameMode === 'listening') {
        playCurrentTargetAudio();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressedRef.current[e.code] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      keysPressedRef.current = {};
    };
  }, [gameState, handleReelAction, playCurrentTargetAudio]);

  // Main Canvas Render Loop
  useEffect(() => {
    if (gameState !== 'playing') return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let lastTime = performance.now();

    const render = (now: number) => {
      const dt = Math.min(0.08, (now - lastTime) / 1000);
      lastTime = now;
      const elapsed = now / 1000;

      const width = canvas.width;
      const height = canvas.height;

      // 1. Draw Pond Deep Water Background
      const waterGrad = ctx.createLinearGradient(0, 0, 0, height);
      waterGrad.addColorStop(0, '#0a303d');
      waterGrad.addColorStop(0.4, '#0e4152');
      waterGrad.addColorStop(1, '#092530');
      ctx.fillStyle = waterGrad;
      ctx.fillRect(0, 0, width, height);

      // Subtle Caustics / Water waves
      ctx.save();
      ctx.strokeStyle = 'rgba(78, 174, 196, 0.08)';
      ctx.lineWidth = 3;
      for (let i = 0; i < 6; i++) {
        ctx.beginPath();
        const yOff = 70 + i * 75 + Math.sin(elapsed * 1.5 + i) * 12;
        ctx.moveTo(0, yOff);
        ctx.bezierCurveTo(
          width * 0.3, yOff - 20,
          width * 0.6, yOff + 20,
          width, yOff
        );
        ctx.stroke();
      }
      ctx.restore();

      // 2. Draw Floating Lily Pads & Lotus Flowers
      lilyPadsRef.current.forEach(pad => {
        ctx.save();
        ctx.translate(pad.x, pad.y);

        // Lily Pad Body
        ctx.fillStyle = '#1b5e3c';
        ctx.beginPath();
        ctx.arc(0, 0, pad.radius, 0.25 * Math.PI, 1.95 * Math.PI);
        ctx.lineTo(0, 0);
        ctx.closePath();
        ctx.fill();

        ctx.strokeStyle = '#278052';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Lotus Flower on some pads
        if (pad.flower) {
          ctx.fillStyle = '#ff7597';
          for (let p = 0; p < 5; p++) {
            ctx.beginPath();
            const angle = (p * Math.PI * 2) / 5;
            ctx.ellipse(Math.cos(angle) * 7, Math.sin(angle) * 7, 5, 8, angle, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.fillStyle = '#ffeaa7';
          ctx.beginPath();
          ctx.arc(0, 0, 3, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      });

      // 3. Draw Water Ripples
      const activeRipples: WaterRipple[] = [];
      ripplesRef.current.forEach(r => {
        r.radius += 35 * dt;
        r.alpha -= 0.65 * dt;

        if (r.alpha > 0.02 && r.radius < r.maxRadius) {
          ctx.save();
          ctx.strokeStyle = `rgba(178, 235, 242, ${r.alpha})`;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.ellipse(r.x, r.y, r.radius * 1.3, r.radius * 0.7, 0, 0, Math.PI * 2);
          ctx.stroke();
          ctx.restore();
          activeRipples.push(r);
        }
      });
      ripplesRef.current = activeRipples;

      // 4. Update Movable Bobber Position (WASD or Arrow Keys)
      const bobber = bobberPosRef.current;
      const keys = keysPressedRef.current;
      const bobMoveSpeed = 340 * dt;
      let bobDx = 0;
      let bobDy = 0;

      if (keys['KeyW'] || keys['ArrowUp']) bobDy -= 1;
      if (keys['KeyS'] || keys['ArrowDown']) bobDy += 1;
      if (keys['KeyA'] || keys['ArrowLeft']) bobDx -= 1;
      if (keys['KeyD'] || keys['ArrowRight']) bobDx += 1;

      if (bobDx !== 0 || bobDy !== 0) {
        const len = Math.hypot(bobDx, bobDy);
        bobber.x += (bobDx / len) * bobMoveSpeed;
        bobber.bobY += (bobDy / len) * bobMoveSpeed;

        // Keep bobber in open pond bounds
        bobber.x = Math.max(190, Math.min(width - 90, bobber.x));
        bobber.bobY = Math.max(150, Math.min(height - 75, bobber.bobY));

        // Create trailing water ripple when moving
        if (Math.random() < 0.25) {
          createRipple(bobber.x, bobber.y, 22);
        }
      }

      // 5. Update & Draw Koi Fishes
      const fishes = fishesRef.current;

      fishes.forEach(fish => {
        fish.swimTimer += dt * 4;

        if (fish.state === 'caught') {
          // Leap upwards out of water!
          fish.caughtProgress = Math.min(1, fish.caughtProgress + dt * 2.2);
          fish.y -= dt * 140;
        } else {
          // Calculate movement speed based on state
          let currentVx = fish.vx;
          if (fish.state === 'biting') {
            // Nibble: slow down to 45% speed
            currentVx = (fish.facingRight ? 1 : -1) * (fish.baseVx * 0.45);
          } else if (fish.state === 'escaping') {
            fish.escapeTimer -= dt;
            if (fish.escapeTimer <= 0) {
              fish.state = 'swimming';
              fish.vx = (fish.facingRight ? 1 : -1) * fish.baseVx;
              currentVx = fish.vx;
            }
          }

          fish.x += currentVx * 60 * dt;

          // If target fish, gently steer into bobber lane when in the central zone
          if (fish.isTarget) {
            if (Math.abs(fish.x - bobber.x) < 220) {
              fish.baseY = fish.baseY + (bobber.y - fish.baseY) * 0.05;
            }
          }

          fish.y = fish.baseY + Math.sin(fish.swimTimer) * 6;

          // Check distance to bobber
          const distToBobber = Math.hypot(fish.x - bobber.x, fish.y - bobber.y);

          // Nibble / Bite logic
          if (distToBobber < 42 && fish.state === 'swimming') {
            fish.state = 'biting';
            fish.biteTimer = 1.8; // Generous 1.8s bite window
            createRipple(bobber.x, bobber.y, 40);
          } else if (fish.state === 'biting') {
            fish.biteTimer -= dt;
            if (fish.biteTimer <= 0) {
              fish.state = 'swimming'; // Bite window closed, resume normal swimming
            }
          }

          // Loop back when passing off screen
          if (fish.vx > 0 && fish.x > width + 150) {
            fish.x = -130;
            fish.state = 'swimming';
            fish.escapeTimer = 0;
            fish.vx = fish.baseVx;
          } else if (fish.vx < 0 && fish.x < -150) {
            fish.x = width + 130;
            fish.state = 'swimming';
            fish.escapeTimer = 0;
            fish.vx = -fish.baseVx;
          }
        }

        // Draw Koi Fish Body (Animated Pixel/Cartoon Fish)
        ctx.save();
        ctx.translate(fish.x, fish.y);
        ctx.scale(fish.facingRight ? fish.scale : -fish.scale, fish.scale);

        // Fish Shadow in deep water
        ctx.fillStyle = 'rgba(0, 0, 0, 0.28)';
        ctx.beginPath();
        ctx.ellipse(0, 16, 44, 14, 0, 0, Math.PI * 2);
        ctx.fill();

        // Color definitions
        let mainColor = '#f5f6fa';
        let spotColor = '#e84118';
        if (fish.colorType === 'yamabuki') {
          mainColor = '#fbc531';
          spotColor = '#e1b12c';
        } else if (fish.colorType === 'asagi') {
          mainColor = '#718093';
          spotColor = '#e84118';
        } else if (fish.colorType === 'shiro') {
          mainColor = '#f5f6fa';
          spotColor = '#2f3640';
        }

        // Tail Wiggle
        const tailAngle = Math.sin(fish.swimTimer * 1.5) * 0.35;
        ctx.save();
        ctx.translate(-36, 0);
        ctx.rotate(tailAngle);
        ctx.fillStyle = spotColor;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(-24, -14);
        ctx.lineTo(-18, 0);
        ctx.lineTo(-24, 14);
        ctx.closePath();
        ctx.fill();
        ctx.restore();

        // Main Koi Body (torpedo shape)
        ctx.fillStyle = mainColor;
        ctx.beginPath();
        ctx.ellipse(0, 0, 38, 17, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#2f3542';
        ctx.lineWidth = 2.5;
        ctx.stroke();

        // Spots / Patterns on back
        ctx.fillStyle = spotColor;
        ctx.beginPath();
        ctx.ellipse(6, -2, 14, 10, 0.2, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.ellipse(-14, 2, 10, 8, -0.2, 0, Math.PI * 2);
        ctx.fill();

        // Cute Eye
        ctx.fillStyle = '#1e272e';
        ctx.beginPath();
        ctx.arc(24, -5, 3.2, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(25, -6, 1.2, 0, Math.PI * 2);
        ctx.fill();

        // Fins
        ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
        ctx.beginPath();
        ctx.ellipse(4, 15, 12, 6, 0.4, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(4, -15, 12, 6, -0.4, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();

        // Draw Floating Wooden Word Tablet above Koi fish
        ctx.save();
        ctx.translate(fish.x, fish.y - 44);

        const hasSub = Boolean(fish.subText && fish.subText.trim().length > 0);
        const maxCharLen = Math.max(fish.text.length, hasSub ? fish.subText.length : 0);
        const plaqueW = Math.max(94, maxCharLen * 18 + 26);
        const plaqueH = hasSub ? 46 : 34;

        // Plaque drop shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
        ctx.beginPath();
        ctx.roundRect(-plaqueW / 2 + 3, -plaqueH / 2 + 4, plaqueW, plaqueH, 10);
        ctx.fill();

        // Plaque Wooden Board
        ctx.fillStyle = '#FAF3E0';
        ctx.beginPath();
        ctx.roundRect(-plaqueW / 2, -plaqueH / 2, plaqueW, plaqueH, 10);
        ctx.fill();

        ctx.strokeStyle = '#6d4c41';
        ctx.lineWidth = 2.5;
        ctx.stroke();

        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        if (hasSub) {
          // Line 1: Main word (Hiragana or prominent Kanji)
          ctx.fillStyle = '#1e293b';
          ctx.font = '900 16px "Noto Sans JP", sans-serif';
          ctx.fillText(fish.text, 0, -9);

          // Line 2: Subtext (Kanji / Furigana / Meaning)
          ctx.fillStyle = '#b45309';
          ctx.font = 'bold 12px "Noto Sans JP", sans-serif';
          ctx.fillText(fish.subText, 0, 11);
        } else {
          // Single line centered
          ctx.fillStyle = '#1e293b';
          ctx.font = '900 17px "Noto Sans JP", sans-serif';
          ctx.fillText(fish.text, 0, 0);
        }

        ctx.restore();
      });

      // Draw Bobber Alert once if any fish is biting
      const bitingFish = fishes.find(f => f.state === 'biting');
      if (bitingFish) {
        ctx.save();
        ctx.translate(bobber.x, bobber.y - 42);

        ctx.fillStyle = '#eb4d4b';
        ctx.beginPath();
        ctx.roundRect(-42, -18, 84, 34, 10);
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 3;
        ctx.stroke();

        ctx.fillStyle = '#ffffff';
        ctx.font = '900 15px "Noto Sans JP", sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('❗ CẮN CÂU!', 0, 0);

        ctx.restore();
      }

      // 5. Draw Wooden Fishing Pier (Dojo Pier on top left)
      ctx.save();
      ctx.fillStyle = '#5d4037';
      ctx.fillRect(0, 0, 180, 140);
      ctx.strokeStyle = '#3e2723';
      ctx.lineWidth = 3;
      ctx.strokeRect(0, 0, 180, 140);

      // Wooden planks lines
      ctx.beginPath();
      for (let p = 25; p < 180; p += 26) {
        ctx.moveTo(p, 0);
        ctx.lineTo(p, 140);
      }
      ctx.stroke();

      // Fishing Bucket
      ctx.fillStyle = '#78909c';
      ctx.beginPath();
      ctx.roundRect(110, 45, 34, 38, 5);
      ctx.fill();
      ctx.strokeStyle = '#37474f';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.fillStyle = '#29b6f6';
      ctx.fillRect(113, 50, 28, 8); // Water in bucket

      // Pixel Character Sitting with Bamboo Fishing Rod
      const charX = 135;
      const charY = 85;

      // Character body
      ctx.fillStyle = '#e11d48';
      ctx.beginPath();
      ctx.roundRect(charX - 12, charY - 6, 24, 30, 8);
      ctx.fill();

      // Head & Kimono Hair
      ctx.fillStyle = '#fed7aa';
      ctx.beginPath();
      ctx.arc(charX, charY - 18, 14, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#312e81';
      ctx.beginPath();
      ctx.arc(charX - 2, charY - 22, 15, Math.PI, Math.PI * 2);
      ctx.fill();

      // Bamboo Fishing Rod (long line extending to bobber)
      const rodTipX = charX + 90;
      const rodTipY = isRodReelingRef.current ? charY - 65 : charY - 30;

      ctx.strokeStyle = '#d79a5b';
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.moveTo(charX + 4, charY + 5);
      ctx.lineTo(rodTipX, rodTipY);
      ctx.stroke();

      // Fishing Line from rod tip to floating bobber
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.65)';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(rodTipX, rodTipY);
      // Slight catenary curve
      const midLineX = (rodTipX + bobber.x) / 2;
      const midLineY = (rodTipY + bobber.y) / 2 + 20;
      ctx.quadraticCurveTo(midLineX, midLineY, bobber.x, bobber.y);
      ctx.stroke();

      ctx.restore();

      // 6. Draw Floating Bobber (Phao câu cá)
      const bobPulse = Math.sin(elapsed * 4) * 3;
      bobber.y = bobber.bobY + (isRodReelingRef.current ? -12 : bobPulse);

      ctx.save();
      ctx.translate(bobber.x, bobber.y);

      // Red/White sphere bobber
      ctx.fillStyle = '#e74c3c';
      ctx.beginPath();
      ctx.arc(0, -4, 9, Math.PI, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#ecf0f1';
      ctx.beginPath();
      ctx.arc(0, -4, 9, 0, Math.PI);
      ctx.fill();

      ctx.strokeStyle = '#2c3e50';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(0, -4, 9, 0, Math.PI * 2);
      ctx.stroke();

      // Antenna on bobber
      ctx.fillStyle = '#f39c12';
      ctx.fillRect(-1.5, -14, 3, 7);

      ctx.restore();

      // Periodic ripple around bobber
      if (Math.random() < 0.04) {
        createRipple(bobber.x, bobber.y + 4, 32);
      }

      // 7. Draw Floating Sakura Petals
      const petals = sakuraPetalsRef.current;
      petals.forEach(p => {
        p.x += p.vx * 40 * dt;
        p.y += p.vy * 40 * dt;
        p.rotation += p.vRot;

        if (p.x > width + 20) p.x = -20;
        if (p.y > height + 20) p.y = -20;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.scale(p.scale, p.scale);

        ctx.fillStyle = 'rgba(255, 183, 197, 0.75)';
        ctx.beginPath();
        ctx.ellipse(0, 0, 7, 4, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [gameState]);

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 select-none animate-fadeIn">
      {/* Game Modal Window */}
      <div className="relative w-full max-w-5xl h-[92vh] max-h-[720px] bg-gradient-to-b from-[#132733] via-[#0d1d28] to-[#07131b] border-3 border-[#26536b] rounded-3xl shadow-[0_25px_60px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col text-white">

        {/* Top Header Bar */}
        <div className="bg-[#0b1c26] px-4 py-2.5 border-b border-[#1f4255] flex items-center justify-between z-20">
          <div className="flex items-center gap-2">
            <span className="text-xl">🎣</span>
            <div>
              <span className="font-vi text-sm sm:text-base font-black text-[#68d8d6] uppercase tracking-wide">
                BẮT CÁ KOI N5
              </span>
              <span className="text-[10px] text-slate-400 font-bold ml-2 hidden sm:inline">
                N5 Pixel Audio Fishing
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Quick Script Display Mode Switcher (Hiragana N5 / Kanji Furigana / Dịch nghĩa TV) */}
            <button
              onClick={() => {
                const nextMode: ScriptDisplayMode = 
                  scriptDisplayMode === 'hiragana_kanji' ? 'kanji_furigana'
                  : scriptDisplayMode === 'kanji_furigana' ? 'hiragana_meaning'
                  : 'hiragana_kanji';
                updateFishesDisplay(nextMode);
              }}
              className="px-2.5 py-1 rounded-lg bg-[#143242] hover:bg-[#1b445a] text-slate-200 text-xs font-bold border border-[#2c617e] transition-all flex items-center gap-1.5 cursor-pointer shadow-sm hover:border-teal-400"
              title="Đổi kiểu chữ trên cá: Hiragana N5 / Kanji+Furigana / Dịch nghĩa TV"
            >
              <Languages className="w-3.5 h-3.5 text-teal-300" />
              <span className="text-[11px] font-vi hidden sm:inline">Hiển thị:</span>
              <span className="text-[11px] font-vi font-black text-amber-300">
                {scriptDisplayMode === 'hiragana_kanji' ? 'Hiragana N5' 
                  : scriptDisplayMode === 'kanji_furigana' ? 'Kanji + Furigana' 
                  : 'Kèm Dịch TV'}
              </span>
            </button>

            {/* Quick Audio Speed Switcher */}
            <button
              onClick={() => {
                const nextSpeed = audioSpeed === 1.15 ? 1.25 : audioSpeed === 1.25 ? 1.0 : 1.15;
                setAudioSpeedState(nextSpeed);
                audioSpeedRef.current = nextSpeed;
                soundFX.playClick();
              }}
              className="px-2 py-1 rounded-lg bg-[#143242] hover:bg-[#1b445a] text-slate-200 text-xs font-bold border border-[#2c617e] transition-all flex items-center gap-1 cursor-pointer shadow-sm hover:border-teal-400"
              title="Đổi tốc độ phát âm: 1.15x (Bản xứ) / 1.25x (Nhanh) / 1.0x (Chuẩn)"
            >
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-[11px] font-vi font-black text-amber-300">
                {audioSpeed}x
              </span>
              <span className="text-[10px] text-slate-300 hidden md:inline">
                {audioSpeed === 1.15 ? 'Bản xứ' : audioSpeed === 1.25 ? 'Nhanh' : 'Chuẩn'}
              </span>
            </button>

            {/* Audio Toggle */}
            <button
              onClick={toggleMute}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 transition-colors"
              title={isAudioMuted ? 'Bật âm thanh' : 'Tắt âm thanh'}
            >
              {isAudioMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-teal-300" />}
            </button>

            {/* Close Button */}
            <button
              onClick={() => {
                soundFX.playClick();
                onClose();
              }}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors"
              title="Đóng game"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Game Canvas & Dynamic Overlays Area */}
        <div className="relative flex-1 w-full h-full overflow-hidden flex items-center justify-center bg-black">
          <canvas
            ref={canvasRef}
            width={960}
            height={540}
            onClick={handleCanvasClick}
            className="w-full h-full object-contain cursor-crosshair"
          />

          {/* Playing In-Game HUD Overlay */}
          {gameState === 'playing' && (
            <div className="absolute inset-0 pointer-events-none p-3 sm:p-5 flex flex-col justify-between">
              
              {/* TOP HUD: Target Banner & Quick Re-listen Button */}
              <div className="flex items-start justify-between gap-3 pointer-events-auto">
                
                {/* Score & Combo */}
                <div className="bg-[#0b1c26]/90 backdrop-blur-md px-3.5 py-2 rounded-2xl border-2 border-[#20495f] shadow-lg">
                  <div className="font-vi font-black text-xs text-amber-300">
                    🪙 ĐIỂM: <span className="text-white text-base font-pixel">{score}</span>
                  </div>
                  {combo > 1 && (
                    <div className="font-vi font-black text-xs text-rose-400 animate-pulse mt-0.5">
                      🔥 COMBO x{combo}!
                    </div>
                  )}
                </div>

                {/* TARGET QUEST SCROLL */}
                <div className={`bg-[#FAF3E0] text-[#2c3e50] border-3 border-[#8c5835] px-5 py-2.5 rounded-2xl shadow-2xl flex items-center gap-3 max-w-md transition-all ${
                  targetFlash ? 'scale-105 ring-4 ring-amber-400' : ''
                }`}>
                  <div className="flex flex-col">
                    <span className="font-vi text-[10px] font-black text-[#b7791f] uppercase tracking-wider">
                      {gameMode === 'listening'
                        ? '🎧 NGHE VÀ CÂU CÁ ĐÚNG:'
                        : gameMode === 'kanji'
                        ? (targetWordRef.current?.isCompound ? '⛩️ BẮT CÁ MANG TỪ GHÉP KANJI:' : '⛩️ BẮT CÁ MANG HÁN TỰ:')
                        : '🎯 BẮT CÁ MANG NGHĨA:'}
                    </span>

                    {gameMode === 'listening' ? (
                      <>
                        <div className="flex items-center gap-2 my-0.5">
                          <span className="font-mono text-xl sm:text-2xl font-black text-[#1e293b] tracking-widest bg-amber-100 px-3 py-0.5 rounded-lg border border-amber-300 shadow-inner">
                            _ _ _ _
                          </span>
                          <span className="text-xs font-vi font-bold text-teal-700 flex items-center gap-1 animate-pulse">
                            <span>🔊</span> <span>Đang phát...</span>
                          </span>
                        </div>
                        <span className="text-[11px] font-vi font-bold text-[#b45309]">
                          Nghe phát âm để chọn cá (Bấm phím R để nghe lại)
                        </span>
                      </>
                    ) : (
                      <>
                        <span className="font-vi text-base sm:text-xl font-black text-[#1e293b] leading-tight my-0.5">
                          "{currentTargetPrompt}"
                        </span>
                        <span className="text-[11px] font-vi font-bold text-[#8c5835]">
                          {gameMode === 'kanji'
                            ? (targetWordRef.current?.isCompound ? 'Tìm chú cá mang từ ghép Kanji tương ứng' : 'Tìm chú cá mang chữ Kanji tương ứng')
                            : 'Tìm và câu chú cá có từ tiếng Nhật tương ứng'}
                        </span>
                      </>
                    )}
                  </div>

                  {/* Re-listen Button ONLY in Listening Mode */}
                  {gameMode === 'listening' && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        playCurrentTargetAudio();
                      }}
                      className="p-2 sm:px-3 sm:py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-900 font-bold transition-transform hover:scale-105 active:scale-95 shadow-md flex items-center gap-1.5 shrink-0 cursor-pointer"
                      title="Bấm để nghe lại phát âm (Phím R)"
                    >
                      <Volume1 className="w-4 h-4 fill-current text-stone-950" />
                      <span className="text-xs font-vi font-black hidden sm:inline">NGHE LẠI</span>
                    </button>
                  )}
                </div>

                {/* Timer & Fish Caught Count */}
                <div className="bg-[#0b1c26]/90 backdrop-blur-md px-3.5 py-2 rounded-2xl border-2 border-[#20495f] shadow-lg text-right">
                  {durationMode === 'timed' ? (
                    <div className="font-vi font-black text-xs text-sky-300">
                      ⏱️ THỜI GIAN:{' '}
                      <span className={`text-base font-pixel ${timeLeft <= 10 ? 'text-rose-400 animate-ping' : 'text-white'}`}>
                        {timeLeft}s
                      </span>
                    </div>
                  ) : (
                    <div className="font-vi font-black text-xs text-emerald-300">
                      🍃 ZEN THƯ THÁI
                    </div>
                  )}
                  <div className="text-[11px] text-slate-300 font-bold mt-0.5">
                    🐟 Đã bắt: <strong className="text-amber-300">{caughtCount}</strong> con
                  </div>
                </div>

              </div>

              {/* SUCCESS TOAST POPUP WHEN CATCHING FISH */}
              {caughtToast && (
                <div className="self-center bg-[#FAF3E0] border-3 border-emerald-600 rounded-2xl px-6 py-3 shadow-2xl text-stone-900 animate-bounce flex items-center gap-3">
                  <span className="text-3xl">🎉</span>
                  <div>
                    <div className="text-xs font-vi font-black text-emerald-800 uppercase tracking-wider">
                      CÂU ĐƯỢC CÁ KOI THÀNH CÔNG! (+100 PTS)
                    </div>
                    <div className="font-vi text-xl font-black text-stone-900">
                      {caughtToast.text} {caughtToast.subText && <span className="text-sm font-bold text-emerald-700 ml-1.5">{caughtToast.subText}</span>}
                    </div>
                    <div className="text-xs font-bold text-stone-600">
                      Nghĩa: {caughtToast.meaning}
                    </div>
                  </div>
                </div>
              )}

              {/* BOTTOM CONTROLS HINT PILL */}
              <div className="self-center bg-[#0b1c26]/90 backdrop-blur-md px-4 py-1.5 rounded-full border border-[#20495f] text-xs text-slate-300 flex items-center gap-3 shadow-lg flex-wrap justify-center">
                <div className="flex items-center gap-1.5">
                  <span className="px-1.5 py-0.5 rounded bg-teal-400 text-stone-950 font-black font-mono text-[10px]">W A S D / ↑ ↓ ← →</span>
                  <span>Di chuyển phao đến vị trí cá</span>
                </div>
                <span className="text-slate-500 hidden sm:inline">|</span>
                <div className="flex items-center gap-1.5">
                  <span className="px-1.5 py-0.5 rounded bg-amber-400 text-stone-950 font-black font-mono text-[10px]">SPACE / Click</span>
                  <span>Giật cần khi cắn câu ❗</span>
                </div>
                {gameMode === 'listening' && (
                  <>
                    <span className="text-slate-500 hidden sm:inline">|</span>
                    <div className="flex items-center gap-1.5">
                      <span className="px-1.5 py-0.5 rounded bg-sky-400 text-stone-950 font-black font-mono text-[10px]">R</span>
                      <span>Nghe lại phát âm</span>
                    </div>
                  </>
                )}
              </div>

            </div>
          )}

          {/* SETUP SCREEN LOBBY OVERLAY */}
          {gameState === 'menu' && (
            <div className="absolute inset-0 bg-gradient-to-b from-[#0a1a24]/95 via-[#0e2433]/95 to-[#07131b]/95 backdrop-blur-md flex flex-col items-center justify-center p-4 sm:p-6 text-center overflow-y-auto">
              
              <div className="flex flex-col items-center mb-4 sm:mb-6">
                <div className="px-4 py-1 rounded-full bg-teal-500/15 border border-teal-400/30 text-xs font-bold text-teal-200 mb-2 tracking-widest uppercase">
                  Luyện nghe & Nhớ nghĩa • 25 Bài Minna no Nihongo
                </div>
                <h1 className="font-vi text-3xl sm:text-5xl font-black text-[#68d8d6] drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)] tracking-wider uppercase py-2 leading-relaxed">
                  BẮT CÁ KOI N5
                </h1>
                <p className="font-vi text-xs sm:text-sm text-slate-300 font-medium max-w-lg mt-1 leading-relaxed">
                  Dùng cụm phím <strong>W-A-S-D</strong> hoặc <strong>4 phím Mũi tên (hoặc Click chuột)</strong> để di chuyển phao câu đón đầu chú cá mang từ đúng, căn nhịp bấm <strong>Space</strong> để giật cần!
                </p>
              </div>

              {/* Options Grid */}
              <div className="w-full max-w-3xl grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4 mb-5 text-left">
                
                {/* 1. Mode Card */}
                <div className="bg-[#122836]/90 border border-[#214b64] p-4 rounded-2xl shadow-lg flex flex-col justify-between">
                  <div>
                    <label className="font-vi text-xs text-teal-300 block mb-2.5 font-black uppercase tracking-wider">
                      1. CHỌN CHẾ ĐỘ ÔN TẬP:
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        onClick={() => setGameMode('listening')}
                        className={`p-2.5 rounded-xl text-xs font-vi font-black border-2 transition-all flex flex-col items-center gap-1 ${
                          gameMode === 'listening'
                            ? 'bg-teal-600 text-white border-teal-300 shadow-md'
                            : 'bg-[#0b1c26] text-slate-300 border-[#1c4056] hover:bg-[#153142]'
                        }`}
                      >
                        <span className="font-black text-xs">🎧 Luyện Nghe</span>
                        <span className="text-[10px] opacity-80 font-normal">Nghe âm ➜ Cá</span>
                      </button>

                      <button
                        onClick={() => setGameMode('vocab')}
                        className={`p-2.5 rounded-xl text-xs font-vi font-black border-2 transition-all flex flex-col items-center gap-1 ${
                          gameMode === 'vocab'
                            ? 'bg-amber-600 text-white border-amber-300 shadow-md'
                            : 'bg-[#0b1c26] text-slate-300 border-[#1c4056] hover:bg-[#153142]'
                        }`}
                      >
                        <span className="font-black text-xs">📖 Từ Vựng</span>
                        <span className="text-[10px] opacity-80 font-normal">Nghĩa ➜ Cá</span>
                      </button>

                      <button
                        onClick={() => setGameMode('kanji')}
                        className={`p-2.5 rounded-xl text-xs font-vi font-black border-2 transition-all flex flex-col items-center gap-1 cursor-pointer ${
                          gameMode === 'kanji'
                            ? 'bg-emerald-600 text-white border-emerald-300 shadow-md'
                            : 'bg-[#0b1c26] text-slate-300 border-[#1c4056] hover:bg-[#153142]'
                        }`}
                      >
                        <span className="font-black text-xs">⛩️ Kanji & Từ Ghép</span>
                        <span className="text-[10px] opacity-80 font-normal">Hán tự & Từ ghép</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* 2. Script Display Format Card */}
                <div className="bg-[#122836]/90 border border-[#214b64] p-4 rounded-2xl shadow-lg flex flex-col justify-between">
                  <div>
                    <label className="font-vi text-xs text-teal-300 block mb-2.5 font-black uppercase tracking-wider">
                      2. HIỂN THỊ CHỮ TRÊN CÁ:
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        onClick={() => {
                          setScriptDisplayMode('hiragana_kanji');
                          scriptDisplayModeRef.current = 'hiragana_kanji';
                        }}
                        className={`p-2.5 rounded-xl text-xs font-vi font-bold border-2 transition-all flex flex-col items-center gap-1 cursor-pointer ${
                          scriptDisplayMode === 'hiragana_kanji'
                            ? 'bg-amber-600 text-white border-amber-300 shadow-md font-black'
                            : 'bg-[#0b1c26] text-slate-300 border-[#1c4056] hover:bg-[#153142]'
                        }`}
                        title="Hiragana N5 to rõ + Kanji nhỏ trong ngoặc (dễ nhận biết nhất cho N5)"
                      >
                        <span className="font-black text-xs">Hiragana N5</span>
                        <span className="text-[10px] opacity-80 font-normal">ざっし (雑誌)</span>
                      </button>

                      <button
                        onClick={() => {
                          setScriptDisplayMode('kanji_furigana');
                          scriptDisplayModeRef.current = 'kanji_furigana';
                        }}
                        className={`p-2.5 rounded-xl text-xs font-vi font-bold border-2 transition-all flex flex-col items-center gap-1 cursor-pointer ${
                          scriptDisplayMode === 'kanji_furigana'
                            ? 'bg-teal-600 text-white border-teal-300 shadow-md font-black'
                            : 'bg-[#0b1c26] text-slate-300 border-[#1c4056] hover:bg-[#153142]'
                        }`}
                        title="Kanji to + phiên âm Furigana Hiragana bên dưới"
                      >
                        <span className="font-black text-xs">Kanji + Furigana</span>
                        <span className="text-[10px] opacity-80 font-normal">雑誌 【ざっし】</span>
                      </button>

                      <button
                        onClick={() => {
                          setScriptDisplayMode('hiragana_meaning');
                          scriptDisplayModeRef.current = 'hiragana_meaning';
                        }}
                        className={`p-2.5 rounded-xl text-xs font-vi font-bold border-2 transition-all flex flex-col items-center gap-1 cursor-pointer ${
                          scriptDisplayMode === 'hiragana_meaning'
                            ? 'bg-sky-600 text-white border-sky-300 shadow-md font-black'
                            : 'bg-[#0b1c26] text-slate-300 border-[#1c4056] hover:bg-[#153142]'
                        }`}
                        title="Hiragana kèm nghĩa tiếng Việt vắn tắt"
                      >
                        <span className="font-black text-xs">Kèm Dịch TV</span>
                        <span className="text-[10px] opacity-80 font-normal">ざっし (Tạp chí)</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* 3. Duration / Play Style */}
                <div className="bg-[#122836]/90 border border-[#214b64] p-4 rounded-2xl shadow-lg flex flex-col justify-between">
                  <div>
                    <label className="font-vi text-xs text-teal-300 block mb-2.5 font-black uppercase tracking-wider">
                      3. THỜI GIAN & LỐI CHƠI:
                    </label>
                    <div className="grid grid-cols-2 gap-2.5">
                      <button
                        onClick={() => setDurationMode('timed')}
                        className={`p-3 rounded-xl text-xs font-vi font-bold border-2 transition-all flex flex-col items-center gap-0.5 cursor-pointer ${
                          durationMode === 'timed'
                            ? 'bg-sky-600 text-white border-sky-300 shadow-md font-black'
                            : 'bg-[#0b1c26] text-slate-300 border-[#1c4056] hover:bg-[#153142]'
                        }`}
                      >
                        <span className="font-black text-xs">⏱️ Thử thách 60 giây</span>
                        <span className="text-[10px] opacity-80">Câu trúng +3s</span>
                      </button>

                      <button
                        onClick={() => setDurationMode('zen')}
                        className={`p-3 rounded-xl text-xs font-vi font-bold border-2 transition-all flex flex-col items-center gap-0.5 cursor-pointer ${
                          durationMode === 'zen'
                            ? 'bg-emerald-600 text-white border-emerald-300 shadow-md font-black'
                            : 'bg-[#0b1c26] text-slate-300 border-[#1c4056] hover:bg-[#153142]'
                        }`}
                      >
                        <span className="font-black text-xs">🍃 Zen Thư Giãn</span>
                        <span className="text-[10px] opacity-80">Không đếm giờ</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* 4. Lesson Range Card (Minna 1 - 25) */}
                <div className="md:col-span-2 bg-[#122836]/90 border border-[#214b64] p-4 rounded-2xl shadow-lg">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                    <label className="font-vi text-xs text-teal-300 font-black uppercase tracking-wider">
                      4. PHẠM VI BÀI HỌC (MINNA NO NIHONGO 1 - 25):
                    </label>

                    {/* Quick Presets */}
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <button
                        onClick={() => {
                          setStartLesson(initialLesson);
                          setEndLesson(initialLesson);
                        }}
                        className="px-2.5 py-1 text-xs bg-[#193749] hover:bg-[#20465c] text-teal-200 rounded-lg border border-[#2d5f7d] font-bold transition-colors cursor-pointer"
                      >
                        Bài {initialLesson}
                      </button>
                      <button
                        onClick={() => {
                          setStartLesson(1);
                          setEndLesson(5);
                        }}
                        className="px-2.5 py-1 text-xs bg-[#193749] hover:bg-[#20465c] text-teal-200 rounded-lg border border-[#2d5f7d] font-bold transition-colors cursor-pointer"
                      >
                        Bài 1 - 5
                      </button>
                      <button
                        onClick={() => {
                          setStartLesson(1);
                          setEndLesson(10);
                        }}
                        className="px-2.5 py-1 text-xs bg-[#193749] hover:bg-[#20465c] text-teal-200 rounded-lg border border-[#2d5f7d] font-bold transition-colors cursor-pointer"
                      >
                        Bài 1 - 10
                      </button>
                      <button
                        onClick={() => {
                          setStartLesson(1);
                          setEndLesson(25);
                        }}
                        className="px-2.5 py-1 text-xs bg-[#193749] hover:bg-[#20465c] text-teal-200 rounded-lg border border-[#2d5f7d] font-bold transition-colors cursor-pointer"
                      >
                        Tất cả 25 bài
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex-1 flex items-center gap-2 bg-[#0b1c26] px-3.5 py-2 rounded-xl border border-[#1c4056]">
                      <span className="text-xs text-slate-300 font-bold shrink-0">Từ bài:</span>
                      <select
                        value={startLesson}
                        onChange={(e) => setStartLesson(Number(e.target.value))}
                        className="w-full bg-transparent text-teal-200 text-xs font-bold focus:outline-none cursor-pointer"
                      >
                        {Array.from({ length: 25 }, (_, i) => i + 1).map((n) => (
                          <option key={n} value={n} className="bg-[#122836] text-white">
                            Bài {n}
                          </option>
                        ))}
                      </select>
                    </div>

                    <span className="text-teal-400 font-black text-sm">➜</span>

                    <div className="flex-1 flex items-center gap-2 bg-[#0b1c26] px-3.5 py-2 rounded-xl border border-[#1c4056]">
                      <span className="text-xs text-slate-300 font-bold shrink-0">Đến bài:</span>
                      <select
                        value={endLesson}
                        onChange={(e) => setEndLesson(Number(e.target.value))}
                        className="w-full bg-transparent text-teal-200 text-xs font-bold focus:outline-none cursor-pointer"
                      >
                        {Array.from({ length: 25 }, (_, i) => i + 1).map((n) => (
                          <option key={n} value={n} className="bg-[#122836] text-white">
                            Bài {n}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* 4. High Score info */}
                <div className="md:col-span-2 flex items-center justify-between gap-3 bg-[#122836]/90 border border-[#214b64] px-4 py-2.5 rounded-2xl text-xs text-teal-200">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-teal-300">KỶ LỤC CÂU CÁ:</span>
                    <span className="text-white font-black">{progress.fishingHighScore || 0} điểm</span>
                  </div>

                  <div className="text-slate-300 text-[11px] hidden sm:block">
                    Căn đúng lúc chú cá bơi qua phao câu và nhấn Space để giật cần!
                  </div>
                </div>

              </div>

              {/* Start Button */}
              <button
                onClick={handleStartGame}
                className="px-10 sm:px-14 py-3.5 sm:py-4 rounded-2xl bg-gradient-to-r from-teal-500 via-sky-600 to-blue-600 hover:from-teal-600 hover:to-blue-700 text-white font-vi font-black text-sm sm:text-base uppercase tracking-wider shadow-xl border-2 border-teal-300 transition-all transform hover:scale-105 active:scale-95 cursor-pointer"
              >
                BẮT ĐẦU BUÔNG CẦN CÂU CÁ
              </button>
            </div>
          )}

          {/* GAME OVER SCREEN OVERLAY */}
          {gameState === 'gameover' && (
            <div className="absolute inset-0 bg-black/85 backdrop-blur-md flex flex-col items-center justify-center p-4 sm:p-6 text-center animate-fadeIn overflow-y-auto">
              
              <div className="text-4xl sm:text-5xl mb-2 animate-bounce">
                🎣
              </div>

              <h2 className="font-vi text-2xl sm:text-4xl font-black text-[#68d8d6] uppercase tracking-wide mb-1">
                KẾT THÚC BUỔI CÂU CÁ!
              </h2>

              <p className="font-vi text-xs sm:text-sm text-slate-300 max-w-md mb-4">
                Bạn đã câu được <strong className="text-amber-300 text-base">{caughtCount}</strong> chú cá Koi mang từ vựng N5!
              </p>

              {/* Score summary card */}
              <div className="bg-[#FAF3E0] text-[#2c3e50] border-3 border-[#8c5835] rounded-2xl p-4 sm:p-5 w-72 sm:w-80 mb-4 shadow-2xl space-y-2">
                <div className="font-vi text-xs text-[#8c5835] font-black uppercase tracking-wider">
                  ĐIỂM TRẬN NÀY:
                </div>
                <div className="font-vi text-3xl sm:text-4xl text-[#0984e3] font-black">
                  {score}
                </div>

                {isNewHigh && (
                  <div className="inline-flex items-center gap-1.5 text-xs font-vi font-black bg-gradient-to-r from-amber-400 to-yellow-400 text-stone-900 px-3 py-1 rounded-full border border-amber-500 shadow-sm animate-pulse">
                    <span>👑</span> <span>KỶ LỤC CÂU CÁ MỚI!</span>
                  </div>
                )}

                <div className="text-xs font-vi font-bold text-emerald-700 pt-2 border-t border-[#d3b28b] flex items-center justify-center gap-1">
                  <span>✨ Thưởng:</span>
                  <span className="font-black text-sm">+{Math.floor(score / 2)} EXP</span>
                  <span>kinh nghiệm</span>
                </div>
              </div>

              {/* Review caught vocabularies */}
              {caughtList.length > 0 && (
                <div className="max-w-md w-full bg-[#122836] border border-[#214b64] rounded-2xl p-3 mb-4 max-h-36 overflow-y-auto text-left">
                  <div className="text-[11px] font-bold text-teal-300 uppercase mb-1.5">
                    Các từ vựng bạn đã câu được trong trận:
                  </div>
                  <div className="space-y-1">
                    {caughtList.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between text-xs bg-[#0b1c26] px-2.5 py-1 rounded-lg">
                        <span className="font-black text-white">{item.text} {item.subText && <span className="text-teal-300 text-[11px] ml-1">{item.subText}</span>}</span>
                        <span className="text-slate-300 text-[11px]">{item.meaning}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center gap-3">
                <button
                  onClick={handleStartGame}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white font-vi font-black text-xs sm:text-sm flex items-center gap-2 uppercase tracking-wide shadow-lg transition-transform hover:scale-105 active:scale-95 border-2 border-teal-300 cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>CÂU TIẾP TRẬN NỮA</span>
                </button>

                <button
                  onClick={() => setGameState('menu')}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-600 hover:to-slate-700 text-white font-vi font-bold text-xs sm:text-sm border-2 border-slate-500 shadow-lg transition-transform hover:scale-105 active:scale-95 cursor-pointer"
                >
                  VỀ MENU CÂU CÁ
                </button>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
