import React, { useState, useEffect, useCallback } from 'react';
import { VocabItem } from '../../types/lesson';
import { playJapaneseAudio } from '../../utils/audio';
import { soundFX } from '../../utils/soundEffects';
import { X, ChevronLeft, ChevronRight, Shuffle, RotateCw, Volume2, Layers } from 'lucide-react';

interface FlashcardModalProps {
  items: VocabItem[];
  onClose: () => void;
}

export const FlashcardModal: React.FC<FlashcardModalProps> = ({
  items,
  onClose,
}) => {
  const [deck, setDeck] = useState<VocabItem[]>(items);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    setDeck(items);
    setCurrentIndex(0);
    setIsFlipped(false);
  }, [items]);

  const currentItem = deck[currentIndex];

  const handleFlip = useCallback(() => {
    soundFX.playClick();
    setIsFlipped(prev => !prev);
  }, []);

  const handleNext = useCallback(() => {
    soundFX.playClick();
    setIsFlipped(false);
    setCurrentIndex(prev => (prev + 1) % deck.length);
  }, [deck.length]);

  const handlePrev = useCallback(() => {
    soundFX.playClick();
    setIsFlipped(false);
    setCurrentIndex(prev => (prev - 1 + deck.length) % deck.length);
  }, [deck.length]);

  const handleShuffle = () => {
    soundFX.playClick();
    const shuffled = [...deck].sort(() => Math.random() - 0.5);
    setDeck(shuffled);
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  const handlePlayAudio = useCallback(() => {
    if (!currentItem) return;
    playJapaneseAudio(currentItem.kanji || currentItem.kana, currentItem.audioUrl);
  }, [currentItem]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        handleFlip();
      } else if (e.key === 's' || e.key === 'S') {
        handlePlayAudio();
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev, handleFlip, handlePlayAudio, onClose]);

  if (!currentItem) return null;

  const progressPercent = Math.round(((currentIndex + 1) / deck.length) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-retro-charcoal/85 backdrop-blur-md select-none overflow-y-auto">

      {/* Expanded Modal Window (Almost width of main screen: max-w-5xl) */}
      <div className="w-full max-w-5xl bg-[#FAF3E0] border-4 border-retro-charcoal shadow-pixel-lg p-4 sm:p-6 md:p-8 flex flex-col relative my-auto">

        {/* Header: Title, Progress count, and Quick Actions */}
        <div className="flex items-center justify-between border-b-3 border-retro-charcoal pb-3 sm:pb-4 mb-4 gap-3 flex-wrap">

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 sm:w-9 sm:h-9 bg-coin border-2 border-retro-charcoal flex items-center justify-center shadow-pixel-sm">
              <Layers className="w-4 h-4 sm:w-5 sm:h-5 text-retro-charcoal" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-pixel text-xs text-sakura-dark font-bold">FLASHCARD</span>
                <span className="font-vi font-bold text-sm sm:text-base text-retro-charcoal">
                  Luyện Thẻ Nhớ Tiếng Nhật
                </span>
              </div>
              <p className="text-xs font-vi text-slate-500 font-medium">
                Thẻ số <strong className="text-retro-charcoal">{currentIndex + 1}</strong> / {deck.length} ({progressPercent}%)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShuffle}
              className="pixel-btn-sm px-3 py-1.5 bg-[#FFFDF7] hover:bg-parchment text-retro-charcoal font-vi text-xs font-bold flex items-center gap-1.5"
              title="Xáo trộn ngẫu nhiên thứ tự thẻ"
            >
              <Shuffle className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Xáo thẻ</span>
            </button>

            <button
              onClick={() => {
                soundFX.playClick();
                onClose();
              }}
              className="pixel-btn-sm px-3 py-1.5 bg-sakura hover:bg-sakura-light text-white font-vi text-xs font-bold flex items-center gap-1"
              title="Đóng Flashcard (Esc)"
            >
              <X className="w-4 h-4" />
              <span className="hidden sm:inline">Đóng</span>
            </button>
          </div>

        </div>

        {/* Progress Bar Line */}
        <div className="w-full h-2 bg-slate-200 border-2 border-retro-charcoal overflow-hidden mb-4">
          <div
            className="h-full bg-gradient-to-r from-matcha to-matcha-light transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Huge Interactive 3D Flip Card */}
        <div
          onClick={handleFlip}
          className="w-full min-h-[380px] sm:min-h-[440px] md:min-h-[480px] cursor-pointer relative transition-transform duration-150 flex flex-col"
        >
          <div
            className={`w-full flex-1 pixel-box p-6 sm:p-10 md:p-12 flex flex-col justify-between text-center transition-all ${isFlipped
                ? 'bg-amber-50/90 border-amber-950 shadow-pixel-lg'
                : 'bg-[#FFFDF7] shadow-pixel-lg hover:-translate-y-0.5'
              }`}
          >
            {/* Card Top Banner: Side Label + Audio Speaker */}
            <div className="w-full flex items-center justify-between border-b-2 border-dashed border-slate-300 pb-3">
              <span className="font-vi text-xs sm:text-sm font-bold px-3 py-1 bg-parchment border-2 border-retro-charcoal shadow-pixel-sm text-retro-charcoal">
                {isFlipped ? '📖 MẶT SAU (Ý NGHĨA TIẾNG VIỆT)' : '🇯🇵 MẶT TRƯỚC (TIẾNG NHẬT)'}
              </span>

              {/* Large Audio Speaker */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePlayAudio();
                }}
                className="px-3 py-1.5 bg-parchment border-2 border-retro-charcoal hover:bg-coin active:translate-y-0.5 shadow-pixel-sm flex items-center gap-1.5 font-vi text-xs font-bold text-retro-charcoal transition-colors"
                title="Nghe phát âm (Phím S)"
              >
                <Volume2 className="w-4 h-4 text-retro-charcoal" />
                <span className="hidden sm:inline">Phát âm</span>
              </button>
            </div>

            {/* Central Giant Content (Front / Back) */}
            <div className="my-auto py-6 sm:py-10 flex flex-col items-center justify-center">
              {!isFlipped ? (
                /* FRONT SIDE: Huge Japanese Text */
                <div className="space-y-4">
                  {currentItem.kanji ? (
                    <>
                      <div className="font-jp text-5xl sm:text-7xl md:text-8xl font-black text-retro-charcoal tracking-tight leading-tight select-text">
                        {currentItem.kanji}
                      </div>
                      <div className="font-jp text-2xl sm:text-3xl md:text-4xl text-slate-500 font-bold tracking-wide">
                        【{currentItem.kana}】
                      </div>
                    </>
                  ) : (
                    <div className="font-jp text-5xl sm:text-7xl md:text-8xl font-black text-retro-charcoal tracking-tight leading-tight select-text">
                      {currentItem.kana}
                    </div>
                  )}

                  {currentItem.type && (
                    <div className="pt-2">
                      <span className="font-vi text-xs sm:text-sm font-bold px-3 py-1 bg-amber-100 border-2 border-retro-charcoal text-retro-charcoal shadow-pixel-sm inline-block">
                        {currentItem.type}
                      </span>
                    </div>
                  )}
                </div>
              ) : (
                /* BACK SIDE: Vietnamese Meaning & Clarifications */
                <div className="space-y-4 max-w-2xl mx-auto">
                  <div className="font-vi text-2xl sm:text-4xl md:text-5xl font-black text-retro-charcoal leading-snug sm:leading-normal select-text">
                    {currentItem.meaning}
                  </div>

                  <div className="pt-2 border-t-2 border-dashed border-slate-300">
                    <span className="font-jp text-lg sm:text-2xl font-bold text-slate-600">
                      {currentItem.kanji ? `${currentItem.kanji} 【${currentItem.kana}】` : currentItem.kana}
                    </span>
                  </div>

                  {currentItem.type && (
                    <span className="font-vi text-xs sm:text-sm font-semibold text-slate-500 block">
                      Loại từ: {currentItem.type}
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Card Bottom: Flip hint with keyboard notice */}
            <div className="w-full pt-3 border-t-2 border-dashed border-slate-300 flex items-center justify-center gap-2 text-xs sm:text-sm font-vi text-slate-500">
              <RotateCw className="w-4 h-4 text-coin" />
              <span>Nhấn vào thẻ hoặc bấm <strong>Phím cách (Space)</strong> để lật</span>
            </div>

          </div>
        </div>

        {/* Footer Navigation Bar: Previous & Next Buttons */}
        <div className="flex items-center justify-between gap-3 sm:gap-4 mt-5 pt-3 border-t-3 border-retro-charcoal">

          <button
            onClick={handlePrev}
            className="pixel-btn bg-parchment hover:bg-parchment-dark text-retro-charcoal px-5 sm:px-8 py-3 text-xs sm:text-sm font-vi font-bold flex items-center justify-center gap-2 flex-1 shadow-pixel"
            title="Thẻ trước (Mũi tên trái ←)"
          >
            <ChevronLeft className="w-5 h-5" />
            <span>THẺ TRƯỚC (←)</span>
          </button>

          <button
            onClick={handleFlip}
            className="pixel-btn bg-[#FFFDF7] hover:bg-parchment text-retro-charcoal px-4 sm:px-6 py-3 text-xs sm:text-sm font-vi font-bold hidden md:flex items-center justify-center gap-2 shadow-pixel"
          >
            <RotateCw className="w-4 h-4" />
            <span>LẬT THẺ</span>
          </button>

          <button
            onClick={handleNext}
            className="pixel-btn bg-coin hover:bg-coin-light text-retro-charcoal px-5 sm:px-8 py-3 text-xs sm:text-sm font-vi font-bold flex items-center justify-center gap-2 flex-1 shadow-pixel"
            title="Thẻ tiếp theo (Mũi tên phải →)"
          >
            <span>TIẾP THEO (→)</span>
            <ChevronRight className="w-5 h-5" />
          </button>

        </div>

      </div>
    </div>
  );
};
