import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { UserProgress } from '../../types/lesson';
import { calculateLevel } from '../../utils/storage';
import { zenAudio } from '../../utils/zenAudio';
import {
  createSoftShadowTexture,
} from './zenTextures';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize2, 
  Minimize2, 
  ArrowLeft, 
  Heart, 
  HelpCircle,
  Sparkles,
  MapPin,
  Tv
} from 'lucide-react';
import { JAPANESE_REALMS } from './realmsData';
import { YouTubeZenPlayer, YouTubeZenPlayerRef } from './YouTubeZenPlayer';
import { soundFX } from '../../utils/soundEffects';

interface ZenGarden3DProps {
  progress: UserProgress;
  onClose: () => void;
}

export const ZenGarden3D: React.FC<ZenGarden3DProps> = ({ progress, onClose }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const { level, progressPercent } = calculateLevel(progress.xp);

  // Realm state
  const [currentRealmId, setCurrentRealmId] = useState<string>('kyoto');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loadProgress, setLoadProgress] = useState<number>(0);
  const [portalPrompt, setPortalPrompt] = useState<string | null>(null);

  // YouTube Zen Audio state
  const ytPlayerRef = useRef<YouTubeZenPlayerRef>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [volume, setVolume] = useState<number>(0.65);
  const [isAudioMuted, setIsAudioMuted] = useState<boolean>(false);
  const [showVideo, setShowVideo] = useState<boolean>(false);

  // Character & Garden states
  const [isSitting, setIsSitting] = useState<boolean>(false);
  const isSittingRef = useRef<boolean>(false);
  const jumpActionRef = useRef<() => void>(() => {});
  const [characterPos, setCharacterPos] = useState<{ x: number; z: number }>({ x: -2, z: -3 });
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [showHelp, setShowHelp] = useState<boolean>(false);

  // Clock
  const [currentTimeStr, setCurrentTimeStr] = useState<string>('17:24');
  const [currentDateStr, setCurrentDateStr] = useState<string>('Thu Nov 13');

  // Double shift detection & keys
  const lastShiftTimeRef = useRef<number>(0);
  const keysPressed = useRef<Record<string, boolean>>({});

  const currentRealm = JAPANESE_REALMS.find(r => r.id === currentRealmId) || JAPANESE_REALMS[0];

  // Update clock
  useEffect(() => {
    const updateTime = () => {
      const d = new Date();
      const hh = String(d.getHours()).padStart(2, '0');
      const mm = String(d.getMinutes()).padStart(2, '0');
      setCurrentTimeStr(`${hh}:${mm}`);
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      setCurrentDateStr(`${days[d.getDay()]} ${months[d.getMonth()]} ${d.getDate()}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  // Toggle fullscreen
  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.().catch(() => {});
      setIsFullscreen(false);
    }
  };

  // Switch Realm handler
  const handleSwitchRealm = (newRealmId: string) => {
    if (newRealmId === currentRealmId) return;
    setIsLoading(true);
    setLoadProgress(0);
    setPortalPrompt(null);
    setCurrentRealmId(newRealmId);
  };

  // Three.js scene setup and game loop
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // --- 1. SCENE, RENDERER & COLOR SPACE ---
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf6d6bd); // Golden hour Kyoto sunset
    scene.fog = new THREE.FogExp2(0xf6d6bd, 0.008);

    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    container.appendChild(renderer.domElement);

    // --- 2. BRIGHT WARM SUNSET LIGHTING ---
    const ambientLight = new THREE.AmbientLight(0xfffaec, 2.0);
    scene.add(ambientLight);

    const hemiLight = new THREE.HemisphereLight(0xfff3e0, 0x8d775f, 1.2);
    scene.add(hemiLight);

    const sunLight = new THREE.DirectionalLight(0xffeedd, 2.2);
    sunLight.position.set(15, 40, 20);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.near = 10;
    sunLight.shadow.camera.far = 120;
    sunLight.shadow.camera.left = -30;
    sunLight.shadow.camera.right = 30;
    sunLight.shadow.camera.top = 30;
    sunLight.shadow.camera.bottom = -30;
    scene.add(sunLight);

    const backFill = new THREE.DirectionalLight(0xffa726, 0.8);
    backFill.position.set(-20, 25, -25);
    scene.add(backFill);

    // Glowing Sun in the sunset sky
    const sunGroup = new THREE.Group();
    sunGroup.position.set(45, 30, -70);
    const sunCore = new THREE.Mesh(
      new THREE.SphereGeometry(8, 32, 32),
      new THREE.MeshBasicMaterial({ color: 0xfff8db })
    );
    sunGroup.add(sunCore);

    const aura = new THREE.Mesh(
      new THREE.RingGeometry(8.2, 16, 32),
      new THREE.MeshBasicMaterial({
        color: 0xffe082,
        transparent: true,
        opacity: 0.35,
        side: THREE.DoubleSide,
      })
    );
    aura.lookAt(0, 0, 0);
    sunGroup.add(aura);
    scene.add(sunGroup);

    // --- 3. LOAD THE SELECTED JAPANESE REALM GLB MODEL ---
    const loader = new GLTFLoader();
    let currentModel: THREE.Group | null = null;
    const raycaster = new THREE.Raycaster();
    const downVector = new THREE.Vector3(0, -1, 0);

    const realmConfig = currentRealm;
    const initPos = realmConfig.initialPos;

    loader.load(
      realmConfig.file,
      (gltf) => {
        currentModel = gltf.scene;

        const box = new THREE.Box3().setFromObject(currentModel);
        const size = box.getSize(new THREE.Vector3());

        const maxDim = Math.max(size.x, size.z);
        const scale = realmConfig.targetScale / maxDim;
        currentModel.scale.set(scale, scale, scale);

        const scaledBox = new THREE.Box3().setFromObject(currentModel);
        const scaledCenter = scaledBox.getCenter(new THREE.Vector3());

        currentModel.position.x = -scaledCenter.x;
        currentModel.position.y = 0;
        currentModel.position.z = -scaledCenter.z;

        currentModel.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });

        scene.add(currentModel);

        // Raycast down to find ground height at initial position
        raycaster.set(new THREE.Vector3(initPos.x, 35, initPos.z), downVector);
        const hits = raycaster.intersectObjects(currentModel.children, true);
        const groundHit = hits.find(h => h.point.y <= 16);
        if (groundHit) {
          chibi.position.set(initPos.x, groundHit.point.y, initPos.z);
        } else {
          chibi.position.set(initPos.x, initPos.y, initPos.z);
        }

        setIsLoading(false);
      },
      (xhr) => {
        if (xhr.total > 0) {
          const pct = Math.round((xhr.loaded / xhr.total) * 100);
          setLoadProgress(pct);
        }
      },
      (error) => {
        console.error('Error loading Japanese realm GLB model:', error);
        setIsLoading(false);
      }
    );

    // --- 4. MAGICAL GLOWING TORII PORTAL TO NEXT REALM ---
    const portalGroup = new THREE.Group();
    // Position portal near edge of path
    const portalPos = { x: 7.0, y: initPos.y, z: -6.0 };
    portalGroup.position.set(portalPos.x, portalPos.y, portalPos.z);
    portalGroup.rotation.y = -Math.PI / 4;

    const portalRedMat = new THREE.MeshLambertMaterial({ color: 0xd63031 });
    const portalBlackMat = new THREE.MeshLambertMaterial({ color: 0x2d3436 });

    // Torii Pillars
    const pPillar1 = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.22, 4.5, 12), portalRedMat);
    pPillar1.position.set(-1.4, 2.25, 0);
    const pPillar2 = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.22, 4.5, 12), portalRedMat);
    pPillar2.position.set(1.4, 2.25, 0);
    portalGroup.add(pPillar1);
    portalGroup.add(pPillar2);

    // Top Beam
    const pKasagi = new THREE.Mesh(new THREE.BoxGeometry(4.2, 0.28, 0.35), portalRedMat);
    pKasagi.position.set(0, 4.4, 0);
    portalGroup.add(pKasagi);
    const pCap = new THREE.Mesh(new THREE.BoxGeometry(4.4, 0.1, 0.4), portalBlackMat);
    pCap.position.set(0, 4.55, 0);
    portalGroup.add(pCap);

    // Glowing Magical Gate Curtain
    const gatePlaneGeo = new THREE.PlaneGeometry(2.4, 4.0);
    const gateMat = new THREE.MeshBasicMaterial({
      color: 0xffa5bc,
      transparent: true,
      opacity: 0.45,
      side: THREE.DoubleSide,
    });
    const gateMesh = new THREE.Mesh(gatePlaneGeo, gateMat);
    gateMesh.position.set(0, 2.1, 0);
    portalGroup.add(gateMesh);

    // Warm Gate Light
    const gateLight = new THREE.PointLight(0xff758f, 2.0, 6);
    gateLight.position.set(0, 2.2, 0);
    portalGroup.add(gateLight);

    scene.add(portalGroup);

    // --- 5. SORA (KINGDOM HEARTS) 3D CHIBI FIGURE MODEL ---
    const chibi = new THREE.Group();
    chibi.position.set(initPos.x, initPos.y, initPos.z);

    const characterAnimGroup = new THREE.Group();
    chibi.add(characterAnimGroup);

    let isCharacterLoaded = false;
    const charLoader = new GLTFLoader();
    charLoader.load(
      '/sora_chibi.glb',
      (gltf) => {
        const rawModel = gltf.scene;

        const box = new THREE.Box3().setFromObject(rawModel);
        const size = box.getSize(new THREE.Vector3());
        // Chibi Sora height ~2.2m (compact cute chibi scale, fits streets, railings & doorways)
        const targetHeight = 2.2;
        const scale = targetHeight / size.y;
        rawModel.scale.set(scale, scale, scale);

        const scaledBox = new THREE.Box3().setFromObject(rawModel);
        const center = scaledBox.getCenter(new THREE.Vector3());

        // Center on X and Z, and place feet exactly at y = 0
        rawModel.position.x = -center.x;
        rawModel.position.z = -center.z;
        rawModel.position.y = -scaledBox.min.y;

        rawModel.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
            const mesh = child as THREE.Mesh;
            const mat = mesh.material as any;
            if (mat && mat.map) {
              mat.map.colorSpace = THREE.SRGBColorSpace;
            }
          }
        });

        characterAnimGroup.add(rawModel);
        isCharacterLoaded = true;
      },
      undefined,
      (err) => console.error('Error loading Sora chibi:', err)
    );

    // Soft Radial Shadow Under Chibi
    const shadowTex = createSoftShadowTexture();
    const shadowGeo = new THREE.PlaneGeometry(1.8, 1.5);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTex,
      transparent: true,
      depthWrite: false,
    });
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.y = 0.03;
    chibi.add(shadowMesh);

    scene.add(chibi);

    // --- 6. 3D FALLING SAKURA PETALS PARTICLE SYSTEM ---
    const petalCount = 450;
    const petalGeo = new THREE.BufferGeometry();
    const petalPositions = new Float32Array(petalCount * 3);
    const petalVelocities: { x: number; y: number; z: number; swayPhase: number }[] = [];

    for (let i = 0; i < petalCount; i++) {
      petalPositions[i * 3 + 0] = (Math.random() - 0.5) * 36;
      petalPositions[i * 3 + 1] = initPos.y + Math.random() * 14;
      petalPositions[i * 3 + 2] = (Math.random() - 0.5) * 36;

      petalVelocities.push({
        x: (Math.random() - 0.3) * 0.022,
        y: -0.026 - Math.random() * 0.032,
        z: (Math.random() - 0.2) * 0.022,
        swayPhase: Math.random() * Math.PI * 2
      });
    }

    petalGeo.setAttribute('position', new THREE.BufferAttribute(petalPositions, 3));

    const petalCanvas = document.createElement('canvas');
    petalCanvas.width = 32;
    petalCanvas.height = 32;
    const pctx = petalCanvas.getContext('2d');
    if (pctx) {
      pctx.fillStyle = '#ffa5bc';
      pctx.beginPath();
      pctx.ellipse(16, 16, 14, 8, Math.PI / 4, 0, Math.PI * 2);
      pctx.fill();
    }
    const petalTex = new THREE.CanvasTexture(petalCanvas);

    const petalMat = new THREE.PointsMaterial({
      size: 0.38,
      map: petalTex,
      transparent: true,
      opacity: 0.9,
      depthWrite: false,
    });

    const petalParticles = new THREE.Points(petalGeo, petalMat);
    scene.add(petalParticles);

    // --- 7. CAMERA & ORBIT CONTROLS LOGIC ---
    let cameraAngle = Math.PI / 4;
    let cameraPitch = 0.42;
    let cameraDistance = 7.2;
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
      // Start YouTube audio if paused/waiting for user gesture
      if (!isPlaying) {
        ytPlayerRef.current?.play();
      }
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - prevMouseX;
      const dy = e.clientY - prevMouseY;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;

      cameraAngle -= dx * 0.008;
      cameraPitch = Math.max(0.08, Math.min(1.15, cameraPitch + dy * 0.008));
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    const onWheel = (e: WheelEvent) => {
      cameraDistance = Math.max(2.8, Math.min(20.0, cameraDistance + e.deltaY * 0.01));
    };

    container.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    container.addEventListener('wheel', onWheel, { passive: true });

    // --- 8. KEYBOARD CONTROLS & JUMP PHYSICS ---
    let isJumping = false;
    let jumpVelocity = 0;
    const JUMP_FORCE = 8.8; // Upward jump velocity in m/s
    const GRAVITY = 22.0;   // Gravity in m/s^2

    const triggerJump = () => {
      if (isSittingRef.current) {
        isSittingRef.current = false;
        setIsSitting(false);
      }
      if (!isJumping) {
        isJumping = true;
        jumpVelocity = JUMP_FORCE;
        soundFX.playJump();
      }
    };
    jumpActionRef.current = triggerJump;

    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement)?.tagName === 'INPUT' || (e.target as HTMLElement)?.tagName === 'TEXTAREA') {
        return;
      }

      keysPressed.current[e.code] = true;

      // Space key triggers character jump
      if (e.code === 'Space') {
        e.preventDefault();
        triggerJump();
      }

      // Double Shift detection for Sitting/Standing
      if (e.key === 'Shift') {
        const now = Date.now();
        if (now - lastShiftTimeRef.current < 360) {
          const nextSitting = !isSittingRef.current;
          isSittingRef.current = nextSitting;
          setIsSitting(nextSitting);
        }
        lastShiftTimeRef.current = now;
      }
    };

    const onKeyUp = (e: KeyboardEvent) => {
      keysPressed.current[e.code] = false;
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);

    // Resize handler
    const onResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', onResize);

    // --- 9. ANIMATION LOOP ---
    let animationFrameId: number;
    let clock = new THREE.Clock();
    let walkTimer = 0;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      // Pulse magical portal glow
      gateMesh.scale.x = 1.0 + Math.sin(elapsed * 3) * 0.05;
      gateMat.opacity = 0.45 + Math.sin(elapsed * 2) * 0.15;

      // 360° Movement Handling
      const moveSpeed = 4.4 * delta;
      let moveX = 0;
      let moveZ = 0;

      const isMovingInput = 
        keysPressed.current['KeyW'] || keysPressed.current['ArrowUp'] ||
        keysPressed.current['KeyS'] || keysPressed.current['ArrowDown'] ||
        keysPressed.current['KeyA'] || keysPressed.current['ArrowLeft'] ||
        keysPressed.current['KeyD'] || keysPressed.current['ArrowRight'];

      if (isMovingInput && isSittingRef.current) {
        isSittingRef.current = false;
        setIsSitting(false);
      }

      if (!isSittingRef.current) {
        const forward = new THREE.Vector3(-Math.sin(cameraAngle), 0, -Math.cos(cameraAngle));
        const right = new THREE.Vector3(Math.cos(cameraAngle), 0, -Math.sin(cameraAngle));

        if (keysPressed.current['KeyW'] || keysPressed.current['ArrowUp']) {
          moveX += forward.x;
          moveZ += forward.z;
        }
        if (keysPressed.current['KeyS'] || keysPressed.current['ArrowDown']) {
          moveX -= forward.x;
          moveZ -= forward.z;
        }
        if (keysPressed.current['KeyD'] || keysPressed.current['ArrowRight']) {
          moveX += right.x;
          moveZ += right.z;
        }
        if (keysPressed.current['KeyA'] || keysPressed.current['ArrowLeft']) {
          moveX -= right.x;
          moveZ -= right.z;
        }
      }

      const isWalking = (moveX !== 0 || moveZ !== 0);

      // Sora 3D Character Animation & 360° Direction
      if (isCharacterLoaded) {
        if (isSittingRef.current) {
          characterAnimGroup.position.y = THREE.MathUtils.lerp(characterAnimGroup.position.y, -0.42, 0.15);
          characterAnimGroup.rotation.x = THREE.MathUtils.lerp(characterAnimGroup.rotation.x, -0.15, 0.15);
          characterAnimGroup.rotation.z = THREE.MathUtils.lerp(characterAnimGroup.rotation.z, 0, 0.15);
        } else if (isJumping) {
          // Dynamic in-air jump pose
          const jumpTilt = THREE.MathUtils.clamp(jumpVelocity * 0.035, -0.18, 0.22);
          characterAnimGroup.rotation.x = THREE.MathUtils.lerp(characterAnimGroup.rotation.x, -jumpTilt, 0.2);
          characterAnimGroup.rotation.z = THREE.MathUtils.lerp(characterAnimGroup.rotation.z, 0, 0.15);
          characterAnimGroup.position.y = THREE.MathUtils.lerp(characterAnimGroup.position.y, 0.08, 0.2);

          if (isWalking) {
            const targetAngle = Math.atan2(moveX, moveZ);
            chibi.rotation.y = THREE.MathUtils.lerp(chibi.rotation.y, targetAngle, 0.2);
          }
        } else if (isWalking) {
          walkTimer += delta * 9;
          // Smooth rotation to face walking direction in 360 degrees
          const targetAngle = Math.atan2(moveX, moveZ);
          chibi.rotation.y = THREE.MathUtils.lerp(chibi.rotation.y, targetAngle, 0.25);

          // Bouncy walking step animation and side-to-side waddle
          characterAnimGroup.position.y = Math.abs(Math.sin(walkTimer)) * 0.12;
          characterAnimGroup.rotation.z = Math.sin(walkTimer) * 0.08;
          characterAnimGroup.rotation.x = 0.08;
        } else {
          // Idle breathing bob
          characterAnimGroup.position.y = Math.sin(elapsed * 2.5) * 0.02;
          characterAnimGroup.rotation.z = THREE.MathUtils.lerp(characterAnimGroup.rotation.z, 0, 0.1);
          characterAnimGroup.rotation.x = THREE.MathUtils.lerp(characterAnimGroup.rotation.x, 0, 0.1);
        }
      }

      if (isWalking) {
        const len = Math.sqrt(moveX * moveX + moveZ * moveZ);
        moveX = (moveX / len) * moveSpeed;
        moveZ = (moveZ / len) * moveSpeed;

        const nextX = chibi.position.x + moveX;
        const nextZ = chibi.position.z + moveZ;
        const distFromCenter = Math.sqrt(nextX * nextX + nextZ * nextZ);

        if (distFromCenter < realmConfig.maxRadius) {
          chibi.position.x = nextX;
          chibi.position.z = nextZ;
          setCharacterPos({ x: nextX, z: nextZ });
        }
      }

      // Continuous Raycast to snap Chibi smoothly to ground terrain / stairs of the active realm
      let currentGroundY = 0;
      if (currentModel) {
        raycaster.set(new THREE.Vector3(chibi.position.x, 35, chibi.position.z), downVector);
        const hits = raycaster.intersectObjects(currentModel.children, true);
        const groundHit = hits.find(h => h.point.y <= 18);
        if (groundHit) {
          currentGroundY = groundHit.point.y;
        }
      }

      // Handle Jump Physics & Gravity
      if (isJumping) {
        jumpVelocity -= GRAVITY * delta;
        chibi.position.y += jumpVelocity * delta;

        // When falling down and reaching terrain
        if (jumpVelocity <= 0 && chibi.position.y <= currentGroundY) {
          chibi.position.y = currentGroundY;
          isJumping = false;
          jumpVelocity = 0;
        }
      } else {
        // Continuous smooth ground snapping while walking
        chibi.position.y = THREE.MathUtils.lerp(chibi.position.y, currentGroundY, 0.25);
      }

      // Check proximity to Magical Torii Portal
      const distToPortal = Math.hypot(chibi.position.x - portalPos.x, chibi.position.z - portalPos.z);
      if (distToPortal < 2.5) {
        // Find next realm in loop
        const currentIdx = JAPANESE_REALMS.findIndex(r => r.id === currentRealmId);
        const nextIdx = (currentIdx + 1) % JAPANESE_REALMS.length;
        const nextRealm = JAPANESE_REALMS[nextIdx];
        setPortalPrompt(nextRealm.name);
      } else {
        setPortalPrompt(null);
      }

      // Update Falling Sakura Petals over the active realm
      const positions = petalGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < petalCount; i++) {
        const vel = petalVelocities[i];
        vel.swayPhase += delta * 1.8;

        positions[i * 3 + 0] += vel.x + Math.sin(vel.swayPhase) * 0.022;
        positions[i * 3 + 1] += vel.y;
        positions[i * 3 + 2] += vel.z + Math.cos(vel.swayPhase) * 0.018;

        if (positions[i * 3 + 1] < (chibi.position.y - 1.0)) {
          positions[i * 3 + 1] = chibi.position.y + 10 + Math.random() * 6;
          positions[i * 3 + 0] = (Math.random() - 0.5) * 34;
          positions[i * 3 + 2] = (Math.random() - 0.5) * 34;
        }
      }
      petalGeo.attributes.position.needsUpdate = true;

      // Camera Follow Chibi up on the terrain
      const targetCamX = chibi.position.x + Math.sin(cameraAngle) * Math.cos(cameraPitch) * cameraDistance;
      const targetCamY = chibi.position.y + 1.6 + Math.sin(cameraPitch) * cameraDistance;
      const targetCamZ = chibi.position.z + Math.cos(cameraAngle) * Math.cos(cameraPitch) * cameraDistance;

      camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetCamX, 0.1);
      camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetCamY, 0.1);
      camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetCamZ, 0.1);

      camera.lookAt(chibi.position.x, chibi.position.y + 1.1, chibi.position.z);

      renderer.render(scene, camera);
    };

    animate();

    zenAudio.pause();

    return () => {
      cancelAnimationFrame(animationFrameId);
      container.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      container.removeEventListener('wheel', onWheel);
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
      zenAudio.pause();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [currentRealmId]);

  // Audio Controls Handlers (interfacing with YouTubeZenPlayer)
  const handleTogglePlay = useCallback(() => {
    ytPlayerRef.current?.togglePlay();
  }, []);

  const handleVolumeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value) / 100;
    setVolume(val);
    ytPlayerRef.current?.setVolume(val);
    if (val > 0 && isAudioMuted) setIsAudioMuted(false);
  }, [isAudioMuted]);

  const handleToggleMute = useCallback(() => {
    if (isAudioMuted) {
      setIsAudioMuted(false);
      ytPlayerRef.current?.unMute();
    } else {
      setIsAudioMuted(true);
      ytPlayerRef.current?.mute();
    }
  }, [isAudioMuted]);

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col select-none overflow-hidden font-vi">
      
      {/* 3D Canvas Mount Point */}
      <div ref={mountRef} className="w-full h-full absolute inset-0 cursor-grab active:cursor-grabbing" />

      {/* ================= LOADING SCREEN ================= */}
      {isLoading && (
        <div className="absolute inset-0 z-50 bg-[#FAF3E0] flex flex-col items-center justify-center p-6 text-center select-none animate-fadeIn">
          <div className="relative mb-5">
            <div className="w-20 h-20 rounded-full border-4 border-dashed border-sakura animate-spin flex items-center justify-center">
              <span className="text-3xl">{currentRealm.icon}</span>
            </div>
            <Sparkles className="w-6 h-6 text-amber-500 absolute -top-2 -right-2 animate-bounce" />
          </div>

          <h3 className="font-vi font-black text-xl text-retro-charcoal tracking-wide mb-1">
            🌸 ĐANG DỊCH CHUYỂN ĐẾN {currentRealm.name.toUpperCase()}...
          </h3>
          <p className="font-vi text-xs text-slate-600 mb-4 max-w-sm">
            {currentRealm.description} ({loadProgress}%)
          </p>

          <div className="w-64 h-3 bg-amber-100 rounded-full overflow-hidden border-2 border-retro-charcoal shadow-sm">
            <div 
              className="h-full bg-gradient-to-r from-sakura to-rose-500 rounded-full transition-all duration-300"
              style={{ width: `${Math.max(10, loadProgress)}%` }}
            />
          </div>
        </div>
      )}

      {/* ================= TOP HUD ROW ================= */}
      <div className="relative z-10 w-full p-3 sm:p-5 flex items-start justify-between pointer-events-none gap-2">
        
        {/* TOP-LEFT: Sora Avatar Profile & Level Badge */}
        <div className="pointer-events-auto flex items-center gap-2.5 bg-[#fdf3e2]/90 backdrop-blur-md px-3.5 py-2 rounded-2xl border-2 border-[#d3b28b] shadow-lg animate-fadeIn">
          <div className="relative w-11 h-11 rounded-full bg-gradient-to-b from-sky-400 via-indigo-500 to-rose-400 border-2 border-white shadow-sm flex items-center justify-center overflow-hidden">
            <span className="text-xl">👑</span>
            <div className="absolute -bottom-1 -right-1 text-xs">🗝️</div>
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-vi font-black text-sm text-[#5d4037] tracking-tight">
                Sora • Lv. {level}
              </span>
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((h) => (
                  <Heart
                    key={h}
                    className="w-3.5 h-3.5 text-rose-500 fill-rose-500 filter drop-shadow-sm"
                  />
                ))}
              </div>
            </div>

            <div className="w-24 sm:w-28 h-2 bg-[#e0ceb5] rounded-full overflow-hidden mt-1 border border-[#bfa588]">
              <div 
                className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* TOP-CENTER: Multi-Realm Fast Travel Selector Pill */}
        <div className="pointer-events-auto flex flex-col items-center gap-1.5">
          {/* Realm Pills */}
          <div className="flex items-center gap-1.5 bg-[#fdf3e2]/95 backdrop-blur-md p-1.5 rounded-2xl border-2 border-[#d3b28b] shadow-xl">
            <div className="flex items-center gap-1 px-2 text-[#8d6e63] font-vi font-black text-xs hidden sm:flex">
              <MapPin className="w-3.5 h-3.5 text-rose-600" />
              <span>ĐỊA ĐIỂM:</span>
            </div>

            {JAPANESE_REALMS.map((realm) => (
              <button
                key={realm.id}
                onClick={() => handleSwitchRealm(realm.id)}
                className={`px-3 py-1.5 rounded-xl font-vi font-black text-xs flex items-center gap-1.5 transition-all ${
                  currentRealmId === realm.id
                    ? 'bg-rose-600 text-white shadow-md scale-105 border border-rose-700'
                    : 'bg-white/80 hover:bg-white text-stone-700 hover:text-stone-900 border border-stone-200'
                }`}
                title={realm.description}
              >
                <span>{realm.icon}</span>
                <span className="hidden md:inline">{realm.name}</span>
              </button>
            ))}
          </div>

          {/* Quick Actions (Back to Lessons & Fullscreen) */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                ytPlayerRef.current?.pause();
                zenAudio.pause();
                onClose();
              }}
              className="flex items-center gap-1.5 px-3 py-1 bg-[#fdf3e2]/90 hover:bg-[#fff9ed] text-[#5d4037] font-vi font-black text-xs rounded-xl border border-[#d3b28b] shadow-sm transition-all hover:scale-105"
              title="Trở về bàn học"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-rose-600" />
              <span>VỀ BÀI HỌC</span>
            </button>

            <button
              onClick={() => setShowHelp(prev => !prev)}
              className="p-1 bg-[#fdf3e2]/90 hover:bg-[#fff9ed] text-[#5d4037] rounded-xl border border-[#d3b28b] shadow-sm transition-all hover:scale-105"
              title="Hướng dẫn phím tắt"
            >
              <HelpCircle className="w-3.5 h-3.5 text-amber-700" />
            </button>

            <button
              onClick={handleToggleFullscreen}
              className="p-1 bg-[#fdf3e2]/90 hover:bg-[#fff9ed] text-[#5d4037] rounded-xl border border-[#d3b28b] shadow-sm transition-all hover:scale-105"
              title="Toàn màn hình"
            >
              {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* TOP-RIGHT: Hanging Wooden Music Board (Lofi Chill YouTube BGM) */}
        <div className="pointer-events-auto relative group">
          <div className="absolute -top-4 left-6 w-1 h-4 bg-[#8d6e63]" />
          <div className="absolute -top-4 right-6 w-1 h-4 bg-[#8d6e63]" />

          <div className="bg-[#8d6e63] p-2.5 sm:p-3 rounded-2xl border-3 border-[#5d4037] shadow-2xl text-amber-50 flex items-center gap-2.5 sm:gap-3.5 min-w-[260px] sm:min-w-[290px]">
            <div className="flex flex-col items-center">
              <span className="text-sm animate-bounce">🎵</span>
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-rose-500 to-amber-500 border border-white flex items-center justify-center text-base shadow-sm">
                🎧
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-0.5">
                <span className="text-xs font-black truncate max-w-[155px] text-amber-100 font-vi">
                  Lofi Chill (Tháp Rơi Tự Do)
                </span>
                <span className="text-[10px] text-amber-200/90 font-bold">
                  {isPlaying ? '▶ Đang phát' : '⏸ Tạm dừng'}
                </span>
              </div>

              <div className="flex items-center justify-between mb-1.5 text-[10px] text-amber-200/70">
                <span className="truncate max-w-[135px]">Nhạc Chill Không Lời</span>
                <button
                  onClick={() => setShowVideo(prev => !prev)}
                  className={`px-1.5 py-0.5 rounded text-[9px] font-bold flex items-center gap-1 transition-all ${
                    showVideo
                      ? 'bg-amber-300 text-stone-900 shadow-sm'
                      : 'bg-[#5d4037] hover:bg-[#4e342e] text-amber-200'
                  }`}
                  title={showVideo ? 'Ẩn màn hình video' : 'Xem video YouTube'}
                >
                  <Tv className="w-2.5 h-2.5" />
                  <span>{showVideo ? 'Ẩn' : 'Video'}</span>
                </button>
              </div>

              <div className="w-full h-1.5 bg-[#5d4037] rounded-full overflow-hidden mb-2">
                <div className={`h-full bg-amber-300 rounded-full ${isPlaying ? 'w-2/3 animate-pulse' : 'w-1/3'}`} />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={handleTogglePlay}
                    className="px-2.5 py-1 bg-amber-400 hover:bg-amber-300 text-stone-900 font-bold text-xs rounded-full flex items-center gap-1 transition-transform hover:scale-105 shadow-sm"
                    title={isPlaying ? 'Tạm dừng nhạc' : 'Phát nhạc YouTube'}
                  >
                    {isPlaying ? (
                      <>
                        <Pause className="w-3 h-3 fill-current" />
                        <span>Dừng</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-3 h-3 fill-current" />
                        <span>Phát</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="flex items-center gap-1.5">
                  <button onClick={handleToggleMute} className="hover:text-amber-300" title={isAudioMuted ? 'Bật âm' : 'Tắt tiếng'}>
                    {isAudioMuted || volume === 0 ? (
                      <VolumeX className="w-3.5 h-3.5 text-rose-300" />
                    ) : (
                      <Volume2 className="w-3.5 h-3.5 text-amber-200" />
                    )}
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={isAudioMuted ? 0 : volume * 100}
                    onChange={handleVolumeChange}
                    className="w-14 sm:w-16 h-1 accent-amber-300 bg-[#5d4037] rounded-lg cursor-pointer"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* ================= PORTAL PROMPT OVERLAY ================= */}
      {portalPrompt && (
        <div className="absolute top-28 left-1/2 -translate-x-1/2 z-30 pointer-events-auto animate-bounce">
          <div className="bg-[#b71540] text-amber-100 font-vi font-black text-xs px-4 py-2 rounded-2xl border-2 border-amber-300 shadow-2xl flex items-center gap-2">
            <span className="text-base animate-pulse">⛩️</span>
            <span>CỔNG THẦN KỲ: BƯỚC VÀO ĐỂ DỊCH CHUYỂN SANG {portalPrompt.toUpperCase()}!</span>
            <button
              onClick={() => {
                const currentIdx = JAPANESE_REALMS.findIndex(r => r.id === currentRealmId);
                const nextIdx = (currentIdx + 1) % JAPANESE_REALMS.length;
                handleSwitchRealm(JAPANESE_REALMS[nextIdx].id);
              }}
              className="ml-2 px-2.5 py-0.5 bg-amber-400 hover:bg-amber-300 text-stone-900 rounded-lg text-[10px] font-black uppercase tracking-wider"
            >
              VÀO NGAY
            </button>
          </div>
        </div>
      )}

      {/* ================= HELP MODAL / OVERLAY ================= */}
      {showHelp && (
        <div className="absolute inset-0 z-40 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#fdf3e2] max-w-md w-full p-5 rounded-2xl border-3 border-[#8d6e63] shadow-2xl text-[#4e342e]">
            <div className="flex items-center justify-between pb-3 border-b border-[#d7ccc8] mb-4">
              <h3 className="font-vi font-black text-base flex items-center gap-2 text-rose-800">
                <span>🌸</span>
                <span>HƯỚNG DẪN DẠO CHƠI THẾ GIỚI NHẬT BẢN 3D</span>
              </h3>
              <button 
                onClick={() => setShowHelp(false)}
                className="w-6 h-6 rounded-full bg-stone-200 hover:bg-stone-300 font-bold text-xs"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs font-medium">
              <div className="flex items-start gap-2.5 bg-amber-50 p-2.5 rounded-xl border border-amber-200">
                <span className="text-base">🕹️</span>
                <div>
                  <strong className="text-stone-900 block font-bold">Di chuyển 360 độ:</strong>
                  Dùng cụm phím <strong>W-A-S-D</strong> hoặc <strong>4 phím Mũi tên (⬆️⬇️⬅️➡️)</strong>. Nhân vật chibi kimono sẽ tự động bám địa hình, leo bậc thang và dạo chơi tự do!
                </div>
              </div>

              <div className="flex items-start gap-2.5 bg-yellow-50 p-2.5 rounded-xl border border-yellow-200">
                <span className="text-base">🦘</span>
                <div>
                  <strong className="text-stone-900 block font-bold">Nhảy lên (Jump):</strong>
                  Nhấn phím <strong>Space (Dấu cách)</strong> để nhân vật nhảy bật lên không trung. Có thể vừa di chuyển W-A-S-D vừa nhảy để nhảy qua bậc thang hoặc vượt chướng ngại vật!
                </div>
              </div>

              <div className="flex items-start gap-2.5 bg-rose-50 p-2.5 rounded-xl border border-rose-200">
                <span className="text-base">⛩️</span>
                <div>
                  <strong className="text-stone-900 block font-bold">Kết nối nhiều địa điểm:</strong>
                  Chọn nhanh 3 địa danh ở thanh trên cùng (<strong>Phố cổ Kyoto</strong>, <strong>Hồ Thủy Tạ</strong>, <strong>Vườn Bonsai</strong>), hoặc đi bộ bước xuyên qua chiếc <strong>Cổng Torii phát sáng</strong> để du ngoạn sang vùng đất mới!
                </div>
              </div>

              <div className="flex items-start gap-2.5 bg-pink-50 p-2.5 rounded-xl border border-pink-200">
                <span className="text-base">🧘‍♀️</span>
                <div>
                  <strong className="text-stone-900 block font-bold">Ngồi thiền (Seiza):</strong>
                  Nhấn nhanh <strong>2 lần phím Shift</strong>. Nhân vật sẽ xếp bằng ngồi thiền ngắm hoa rơi, mỉm cười thanh thản. Nhấn 2 lần Shift lần nữa hoặc bấm phím di chuyển để đứng dậy!
                </div>
              </div>

              <div className="flex items-start gap-2.5 bg-emerald-50 p-2.5 rounded-xl border border-emerald-200">
                <span className="text-base">🎥</span>
                <div>
                  <strong className="text-stone-900 block font-bold">Xoay góc nhìn 360 độ:</strong>
                  Nhấn giữ <strong>chuột trái và kéo</strong> để xoay camera 360°. <strong>Lăn chuột</strong> để phóng to hoặc thu nhỏ góc nhìn.
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowHelp(false)}
              className="w-full mt-4 py-2 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-vi font-black text-xs rounded-xl shadow-md"
            >
              ĐÃ HIỂU, BẮT ĐẦU THƯ GIÃN!
            </button>
          </div>
        </div>
      )}

      {/* Spacer */}
      <div className="flex-1" />

      {/* ================= BOTTOM ROW ================= */}
      <div className="relative z-10 w-full p-3 sm:p-5 flex items-end justify-between pointer-events-none">
        
        {/* BOTTOM-LEFT: Leaves / Coins count & Live Clock */}
        <div className="pointer-events-auto space-y-2">
          <div className="flex items-center gap-2 bg-[#4e342e]/85 backdrop-blur-md px-3.5 py-1.5 rounded-2xl border-2 border-[#8d6e63] text-amber-100 shadow-md">
            <span className="text-base">🍃</span>
            <span className="font-vi font-black text-xs sm:text-sm tracking-wide">
              {((progress.xp || 0) * 10 + 12340).toLocaleString()}
            </span>
          </div>

          <div className="flex items-center gap-2 bg-[#4e342e]/85 backdrop-blur-md px-3.5 py-1.5 rounded-2xl border-2 border-[#8d6e63] text-amber-200 text-xs font-bold shadow-md">
            <span>🕒 {currentTimeStr}</span>
            <span>☀️ {currentDateStr}</span>
          </div>
        </div>

        {/* BOTTOM-CENTER: Floating Controls Guide Pill */}
        <div className="pointer-events-auto hidden md:flex items-center gap-3 bg-[#fdf3e2]/90 backdrop-blur-md px-4 py-2 rounded-2xl border-2 border-[#d3b28b] shadow-xl text-[11px] text-[#5d4037] font-vi font-bold">
          <div className="flex items-center gap-1">
            <span className="px-1.5 py-0.5 bg-stone-200 rounded border border-stone-300 font-mono text-[10px]">W A S D</span>
            <span>Di chuyển 360°</span>
          </div>
          <span className="text-stone-300">|</span>
          <button
            onClick={() => jumpActionRef.current()}
            className="flex items-center gap-1 hover:text-amber-800 transition-colors cursor-pointer"
            title="Nhấn phím Space hoặc bấm vào đây để nhảy"
          >
            <span className="px-1.5 py-0.5 bg-amber-300 text-stone-900 font-black rounded border border-amber-400 font-mono text-[10px] shadow-xs">Space</span>
            <span>Nhảy lên 🦘</span>
          </button>
          <span className="text-stone-300">|</span>
          <div className="flex items-center gap-1">
            <span className="px-1.5 py-0.5 bg-stone-200 rounded border border-stone-300 font-mono text-[10px]">Shift x2</span>
            <span>{isSitting ? 'Đứng dậy' : 'Ngồi thiền'}</span>
          </div>
          <span className="text-stone-300">|</span>
          <div className="flex items-center gap-1">
            <span className="px-1.5 py-0.5 bg-stone-200 rounded border border-stone-300 font-mono text-[10px]">Kéo chuột</span>
            <span>Xoay camera 360°</span>
          </div>
        </div>

        {/* Quick Jump Action Button for mobile touch */}
        <div className="pointer-events-auto md:hidden mr-2 mb-1">
          <button
            onClick={() => jumpActionRef.current()}
            className="w-12 h-12 rounded-full bg-gradient-to-tr from-amber-400 to-rose-400 text-stone-900 border-2 border-white shadow-xl flex items-center justify-center text-lg active:scale-95 transition-transform font-black"
            title="Nhảy lên (Space)"
          >
            🦘
          </button>
        </div>

        {/* BOTTOM-RIGHT: Circular Zen Mini-map */}
        <div className="pointer-events-auto relative w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-[#fdf3e2]/90 backdrop-blur-md border-3 border-[#8d6e63] shadow-2xl p-1 flex items-center justify-center overflow-hidden">
          <div className="absolute top-1 font-vi font-black text-[9px] text-[#8d6e63]">N</div>

          <div className="relative w-full h-full rounded-full bg-[#95c178]/60 border border-[#7fad5e] flex items-center justify-center">
            {/* Active Realm Landmark */}
            <div 
              className="absolute text-[11px]"
              style={{ left: '42%', top: '35%' }}
              title={currentRealm.name}
            >
              {currentRealm.icon}
            </div>

            {/* Torii Portal marker */}
            <div 
              className="absolute text-[9px]"
              style={{ right: '22%', top: '22%' }}
              title="Cổng dịch chuyển Torii"
            >
              ⛩️
            </div>

            {/* Sakura tree marker */}
            <div 
              className="absolute text-[9px]"
              style={{ left: '20%', bottom: '26%' }}
              title="Hoa anh đào"
            >
              🌸
            </div>

            {/* Character Dot */}
            <div 
              className="absolute w-3 h-3 rounded-full bg-rose-600 border-2 border-white shadow-md animate-ping"
              style={{
                left: `${Math.max(10, Math.min(85, 50 + (characterPos.x / currentRealm.maxRadius) * 35))}%`,
                top: `${Math.max(10, Math.min(85, 50 + (characterPos.z / currentRealm.maxRadius) * 35))}%`,
              }}
            />
            <div 
              className="absolute w-2.5 h-2.5 rounded-full bg-rose-600 border border-white shadow-md"
              style={{
                left: `${Math.max(10, Math.min(85, 50 + (characterPos.x / currentRealm.maxRadius) * 35))}%`,
                top: `${Math.max(10, Math.min(85, 50 + (characterPos.z / currentRealm.maxRadius) * 35))}%`,
              }}
            />
          </div>
        </div>

      </div>

      {/* YouTube Zen Audio Player (Background streaming & optional floating video) */}
      <YouTubeZenPlayer
        ref={ytPlayerRef}
        videoId="b-FHfiM8ILo"
        startTime={450}
        title="Nhạc Chill Không Lời - Tháp Rơi Tự Do Lofi Chill"
        volume={volume}
        isMuted={isAudioMuted}
        isPlaying={isPlaying}
        onPlayStateChange={setIsPlaying}
        showVideo={showVideo}
        onCloseVideo={() => setShowVideo(false)}
      />

    </div>
  );
};
