import React, { useState, useEffect, useRef } from 'react';
import { UserProgress } from '../../types/lesson';
import { calculateLevel } from '../../utils/storage';
import { soundFX } from '../../utils/soundEffects';
import { setAudioVolume } from '../../utils/audio';
import { Gamepad2, Flame, Trophy, Volume1, Volume2, VolumeX, Menu, Sparkles } from 'lucide-react';

interface TopHudHeaderProps {
  progress: UserProgress;
  onOpenGame: () => void;
  onOpenGamesHub?: () => void;
  onOpenZenGarden?: () => void;
  onToggleSidebar: () => void;
  isSidebarOpen: boolean;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const TopHudHeader: React.FC<TopHudHeaderProps> = ({
  progress,
  onOpenGame,
  onOpenGamesHub,
  onOpenZenGarden,
  onToggleSidebar,
  isMuted,
  onToggleMute,
}) => {
  const { level, currentLevelXp, nextLevelXp, progressPercent } = calculateLevel(progress.xp);

  // Volume slider popover states
  const [isVolumeOpen, setIsVolumeOpen] = useState(false);
  const [volume, setVolume] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('minna_n5_volume');
      if (saved !== null) {
        const parsed = Number(saved);
        if (!isNaN(parsed)) return Math.max(0, Math.min(100, parsed));
      }
    }
    return 80;
  });
  const [prevVolume, setPrevVolume] = useState<number>(80);

  const popoverRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Sync initial volume with soundFX and audio
  useEffect(() => {
    soundFX.setVolume(isMuted ? 0 : volume / 100);
    setAudioVolume(isMuted ? 0 : volume / 100);
  }, []);

  // Handle outside click to close volume popover
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(e.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target as Node)
      ) {
        setIsVolumeOpen(false);
      }
    };

    if (isVolumeOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isVolumeOpen]);

  // Volume slider change handler
  const handleVolumeChange = (newVol: number) => {
    setVolume(newVol);
    localStorage.setItem('minna_n5_volume', String(newVol));
    soundFX.setVolume(newVol / 100);
    setAudioVolume(newVol / 100);

    if (newVol > 0 && isMuted) {
      onToggleMute();
    } else if (newVol === 0 && !isMuted) {
      onToggleMute();
    }
  };

  // Toggle Mute button click (inside popover or main button)
  const handleToggleMuteClick = () => {
    soundFX.playClick();
    if (isMuted || volume === 0) {
      const restore = prevVolume > 0 ? prevVolume : 80;
      setVolume(restore);
      localStorage.setItem('minna_n5_volume', String(restore));
      soundFX.setVolume(restore / 100);
      setAudioVolume(restore / 100);
      if (isMuted) onToggleMute();
    } else {
      setPrevVolume(volume);
      setVolume(0);
      localStorage.setItem('minna_n5_volume', '0');
      soundFX.setVolume(0);
      setAudioVolume(0);
      if (!isMuted) onToggleMute();
    }
  };

  const effectiveVolume = isMuted ? 0 : volume;

  return (
    <header className="sticky top-0 z-30 bg-[#FFFDF7] border-b-4 border-retro-charcoal shadow-pixel px-3 py-2 md:px-6 lg:px-8 select-none">
      <div className="w-full flex items-center justify-between gap-2 md:gap-4 flex-wrap">

        {/* Left: Hamburger (mobile) + Retro Logo */}
        <div className="flex items-center gap-2 md:gap-3">
          <button
            onClick={() => {
              soundFX.playClick();
              onToggleSidebar();
            }}
            className="md:hidden p-1.5 bg-parchment-dark border-2 border-retro-charcoal hover:bg-parchment active:translate-y-0.5"
            aria-label="Toggle menu"
          >
            <Menu className="w-5 h-5 text-retro-charcoal" />
          </button>

          <div className="flex items-center gap-2 cursor-pointer" onClick={() => soundFX.playClick()}>
            <div className="w-9 h-9 md:w-11 md:h-11 bg-sakura border-2 border-retro-charcoal flex items-center justify-center shadow-pixel-sm font-pixel text-lg md:text-xl text-white">
              日本
            </div>
            <div>
              <h1 className="font-pixel text-xs md:text-sm text-retro-charcoal tracking-tight flex items-center gap-1.5">
                <span>MINNA Learning</span>
                <span className="hidden sm:inline-block text-[10px] bg-coin px-1.5 py-0.5 border border-retro-charcoal font-pixel text-retro-charcoal">
                  RPG
                </span>
              </h1>
              <p className="text-[11px] font-vi font-medium text-slate-600 hidden sm:block tracking-wide">
                Hành trình Chinh phục Tiếng Nhật
              </p>
            </div>
          </div>
        </div>

        {/* Center: RPG Stats (Level, XP Bar, Streak, High Score) */}
        <div className="flex items-center gap-2 sm:gap-3 order-3 md:order-2 w-full md:w-auto justify-end md:justify-center pt-1 md:pt-0 border-t md:border-t-0 border-slate-200">

          {/* Level Badge */}
          <div className="flex items-center gap-1 bg-parchment-dark border-2 border-retro-charcoal px-2 py-0.5 shadow-pixel-sm">
            <span className="font-pixel text-xs text-retro-charcoal">LV.{level}</span>
          </div>

          {/* XP Progress Bar */}
          <div className="flex items-center gap-1.5">
            <div className="w-20 sm:w-28 md:w-36 h-4 bg-slate-200 border-2 border-retro-charcoal overflow-hidden shadow-pixel-sm relative">
              <div
                className="h-full bg-gradient-to-r from-coin to-amber-500 transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
              <span className="absolute inset-0 flex items-center justify-center font-pixel text-[8px] sm:text-[9px] text-retro-charcoal font-bold">
                {currentLevelXp}/{nextLevelXp}
              </span>
            </div>
          </div>

          {/* Daily Streak */}
          <div
            className="flex items-center gap-1 bg-amber-50 border-2 border-retro-charcoal px-2 py-1 shadow-pixel-sm"
            title="Chuỗi ngày học liên tục"
          >
            <Flame className="w-4 h-4 text-orange-500 fill-orange-400" />
            <span className="font-pixel text-[11px] text-retro-charcoal font-bold">{progress.streakDays || 1}d</span>
          </div>

          {/* Mini-Game High Score */}
          <div
            className="hidden sm:flex items-center gap-1 bg-yellow-50 border-2 border-retro-charcoal px-2 py-1 shadow-pixel-sm"
            title="Kỷ lục Chém Chữ Nhật"
          >
            <Trophy className="w-4 h-4 text-coin fill-coin" />
            <span className="font-pixel text-[11px] text-retro-charcoal font-bold">{progress.highScore || 0}</span>
          </div>
        </div>

        {/* Right: Sound Slider Control + "Chơi Chém Chữ" Arcade Button */}
        <div className="flex items-center gap-2 order-2 md:order-3">

          {/* Sound Button with Laptop-Style Volume Slider Popover */}
          <div className="relative">
            <button
              ref={buttonRef}
              onClick={() => {
                soundFX.playClick();
                setIsVolumeOpen(prev => !prev);
              }}
              className={`p-1.5 md:p-2 border-2 border-retro-charcoal shadow-pixel-sm active:translate-y-0.5 transition-all ${isVolumeOpen
                ? 'bg-amber-100 border-sakura shadow-pixel'
                : 'bg-parchment hover:bg-parchment-dark'
                }`}
              title={`Âm lượng: ${effectiveVolume}% (Nhấn để chỉnh)`}
            >
              {effectiveVolume === 0 ? (
                <VolumeX className="w-4 h-4 text-rose-500" />
              ) : effectiveVolume <= 50 ? (
                <Volume1 className="w-4 h-4 text-matcha-dark" />
              ) : (
                <Volume2 className="w-4 h-4 text-matcha-dark" />
              )}
            </button>

            {/* Laptop Style Volume Popover */}
            {isVolumeOpen && (
              <div
                ref={popoverRef}
                className="absolute right-0 top-full mt-2 z-50 pixel-box p-3 sm:p-4 bg-[#FFFDF7] border-3 border-retro-charcoal shadow-pixel w-64 sm:w-72 select-none animate-fadeIn"
              >
                {/* Popover Header */}
                <div className="flex items-center justify-between border-b-2 border-retro-charcoal pb-2 mb-3">
                  <div className="flex items-center gap-1.5 font-vi font-black text-xs text-retro-charcoal">
                    <span>🔊</span>
                    <span>ÂM LƯỢNG HỆ THỐNG</span>
                  </div>

                  <span className="font-pixel text-xs font-bold px-2 py-0.5 bg-amber-100 border border-retro-charcoal text-amber-900">
                    {effectiveVolume}%
                  </span>
                </div>

                {/* Slider Row */}
                <div className="flex items-center gap-2.5 mb-3">
                  {/* Quick Mute button */}
                  <button
                    onClick={handleToggleMuteClick}
                    className="p-1.5 bg-parchment hover:bg-parchment-dark border border-retro-charcoal shrink-0 transition-transform hover:scale-105"
                    title={effectiveVolume === 0 ? "Bật âm thanh" : "Tắt tiếng"}
                  >
                    {effectiveVolume === 0 ? (
                      <VolumeX className="w-4 h-4 text-rose-600" />
                    ) : (
                      <Volume2 className="w-4 h-4 text-matcha-dark" />
                    )}
                  </button>

                  {/* Range Slider like Laptop */}
                  <div className="flex-1 flex items-center relative">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="1"
                      value={effectiveVolume}
                      onChange={(e) => handleVolumeChange(Number(e.target.value))}
                      className="pixel-slider"
                    />
                  </div>

                  <Volume2 className="w-4 h-4 text-slate-400 shrink-0" />
                </div>

                {/* Quick Presets Bar */}
                <div className="grid grid-cols-4 gap-1 pt-1 border-t border-dashed border-slate-200">
                  {[
                    { label: 'TẮT', val: 0 },
                    { label: '30%', val: 30 },
                    { label: '70%', val: 70 },
                    { label: '100%', val: 100 },
                  ].map((preset) => (
                    <button
                      key={preset.label}
                      onClick={() => {
                        soundFX.playClick();
                        handleVolumeChange(preset.val);
                      }}
                      className={`text-[10px] font-vi font-bold py-1 border transition-all ${effectiveVolume === preset.val
                        ? 'bg-retro-charcoal text-white border-retro-charcoal font-black'
                        : 'bg-white hover:bg-parchment text-slate-700 border-slate-300'
                        }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>

                {/* Note */}
                <p className="text-[10px] font-vi text-slate-500 text-center mt-2 font-medium">
                  Áp dụng cho hiệu ứng âm thanh & giọng đọc tiếng Nhật
                </p>
              </div>
            )}
          </div>

          {/* Zen Garden 3D Relaxation Button */}
          {onOpenZenGarden && (
            <button
              onClick={() => {
                soundFX.playClick();
                onOpenZenGarden();
              }}
              className="pixel-btn bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 md:px-4 md:py-2 text-xs flex items-center gap-1.5 font-vi font-black tracking-wider group shadow-sm transition-all"
              title="Vào không gian 3D thư giãn phong cách Nhật Bản"
            >
              <Sparkles className="w-4 h-4 text-amber-200 group-hover:rotate-12 transition-transform animate-pulse" />
              <span>🌸 VƯỜN THIỀN</span>
            </button>
          )}

          {/* Mini Games Hub Arcade Button */}
          <button
            onClick={() => {
              soundFX.playClick();
              if (onOpenGamesHub) {
                onOpenGamesHub();
              } else {
                onOpenGame();
              }
            }}
            className="pixel-btn bg-sakura hover:bg-sakura-light text-white px-3 py-1.5 md:px-4 md:py-2 text-xs flex items-center gap-1.5 font-vi font-black tracking-wider group shadow-sm transition-all"
            title="Mở Sảnh Trò Chơi Mini Games N5"
          >
            <Gamepad2 className="w-4 h-4 text-amber-200 group-hover:rotate-12 transition-transform" />
            <span>🎮 TRÒ CHƠI</span>
          </button>

        </div>

      </div>
    </header>
  );
};
