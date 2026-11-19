import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { KANJI_COMPOUNDS } from '../../data/kanjiCompounds';
import { playJapaneseAudio } from '../../utils/audio';
import { soundFX } from '../../utils/soundEffects';
import {
  Volume2,
  Search,
  RotateCw,
  Shuffle,
  ChevronLeft,
  ChevronRight,
  Layers,
  BookOpen,
  Filter
} from 'lucide-react';

interface KanjiCompoundTabProps {
  currentLesson: number;
}

export const KanjiCompoundTab: React.FC<KanjiCompoundTabProps> = ({
  currentLesson,
}) => {
  // Mode: list vs flashcard
  const [viewMode, setViewMode] = useState<'list' | 'flashcard'>('list');

  // Filter state
  const [selectedLesson, setSelectedLesson] = useState<number | 'all'>(
    currentLesson >= 1 && currentLesson <= 15 ? currentLesson : 'all'
  );
  const [selectedRootKanji, setSelectedRootKanji] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Sync selectedLesson when user switches lesson in sidebar
  useEffect(() => {
    if (currentLesson >= 1 && currentLesson <= 15) {
      setSelectedLesson(currentLesson);
      setSelectedRootKanji(null);
    } else {
      setSelectedLesson('all');
    }
  }, [currentLesson]);

  // Flashcard specific states
  const [cardIndex, setCardIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [isShuffled, setIsShuffled] = useState<boolean>(false);
  const [shuffledSeed, setShuffledSeed] = useState<number>(0);

  // Available lessons in compound list (1 to 15)
  const availableLessons = useMemo(() => {
    const lessons = Array.from(new Set(KANJI_COMPOUNDS.map(c => c.lesson))).sort((a, b) => a - b);
    return lessons;
  }, []);

  // Filter items by lesson, search, and rootKanji
  const filteredItems = useMemo(() => {
    let items = KANJI_COMPOUNDS;

    // Filter by lesson
    if (selectedLesson !== 'all') {
      items = items.filter(c => c.lesson === selectedLesson);
    }

    // Filter by root Kanji
    if (selectedRootKanji) {
      items = items.filter(c => c.rootKanji.includes(selectedRootKanji));
    }

    // Filter by Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      items = items.filter(
        c =>
          c.word.toLowerCase().includes(q) ||
          c.reading.toLowerCase().includes(q) ||
          c.hanViet.toLowerCase().includes(q) ||
          c.meaning.toLowerCase().includes(q)
      );
    }

    // Apply shuffle if toggled
    if (isShuffled) {
      const copy = [...items];
      // Deterministic shuffle with seed
      for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.abs(Math.sin(shuffledSeed + i)) * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
      }
      return copy;
    }

    return items;
  }, [selectedLesson, selectedRootKanji, searchQuery, isShuffled, shuffledSeed]);

  // Root Kanji list for currently active lesson scope
  const availableRootKanji = useMemo(() => {
    let base = KANJI_COMPOUNDS;
    if (selectedLesson !== 'all') {
      base = base.filter(c => c.lesson === selectedLesson);
    }
    const kanjiSet = new Set<string>();
    base.forEach(c => c.rootKanji.forEach(k => kanjiSet.add(k)));
    return Array.from(kanjiSet);
  }, [selectedLesson]);

  // Reset flashcard index when filtered items change
  useEffect(() => {
    setCardIndex(0);
    setIsFlipped(false);
  }, [selectedLesson, selectedRootKanji, searchQuery, isShuffled]);

  // Current flashcard item
  const currentCard = filteredItems[cardIndex] || null;

  // Flashcard controls
  const handleNextCard = useCallback(() => {
    if (filteredItems.length === 0) return;
    soundFX.playClick();
    setIsFlipped(false);
    setCardIndex(prev => (prev + 1) % filteredItems.length);
  }, [filteredItems.length]);

  const handlePrevCard = useCallback(() => {
    if (filteredItems.length === 0) return;
    soundFX.playClick();
    setIsFlipped(false);
    setCardIndex(prev => (prev - 1 + filteredItems.length) % filteredItems.length);
  }, [filteredItems.length]);

  const handleFlipCard = useCallback(() => {
    soundFX.playClick();
    setIsFlipped(prev => !prev);
  }, []);

  const handleShuffle = () => {
    soundFX.playClick();
    setIsShuffled(prev => !prev);
    setShuffledSeed(Date.now());
  };

  // Keyboard navigation for Flashcard
  useEffect(() => {
    if (viewMode !== 'flashcard') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        handleFlipCard();
      } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        handleNextCard();
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        handlePrevCard();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [viewMode, handleFlipCard, handleNextCard, handlePrevCard]);

  // Total items in current scope
  const totalInScope = selectedLesson === 'all'
    ? KANJI_COMPOUNDS.length
    : KANJI_COMPOUNDS.filter(c => c.lesson === selectedLesson).length;

  return (
    <div className="space-y-4">
      
      {/* 1. TOP CONTROL BAR: Mode switch + Lesson filter + Search */}
      <div className="pixel-box p-3 sm:p-4 bg-[#FFFDF7] space-y-3 border-3 border-retro-charcoal">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 flex-wrap">
          
          {/* View Mode Toggle: List vs Flashcard */}
          <div className="flex items-center gap-1.5 bg-parchment p-1 border-2 border-retro-charcoal shrink-0">
            <button
              onClick={() => {
                soundFX.playClick();
                setViewMode('list');
              }}
              className={`px-3 py-1.5 text-xs font-vi font-black uppercase tracking-wider flex items-center gap-1.5 border-2 transition-all ${
                viewMode === 'list'
                  ? 'bg-retro-charcoal text-white border-retro-charcoal shadow-pixel-sm'
                  : 'bg-transparent text-retro-charcoal border-transparent hover:bg-white/70'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>DANH SÁCH TRA CỨU</span>
            </button>

            <button
              onClick={() => {
                soundFX.playClick();
                setViewMode('flashcard');
              }}
              className={`px-3 py-1.5 text-xs font-vi font-black uppercase tracking-wider flex items-center gap-1.5 border-2 transition-all ${
                viewMode === 'flashcard'
                  ? 'bg-sakura text-white border-retro-charcoal shadow-pixel-sm'
                  : 'bg-transparent text-retro-charcoal border-transparent hover:bg-white/70'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>THẺ FLASHCARD</span>
            </button>
          </div>

          {/* Lesson Selector */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-vi font-bold text-slate-600 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5 text-matcha" />
              Bài học:
            </span>

            <select
              value={selectedLesson}
              onChange={(e) => {
                soundFX.playClick();
                const val = e.target.value === 'all' ? 'all' : Number(e.target.value);
                setSelectedLesson(val);
                setSelectedRootKanji(null);
              }}
              className="pixel-box-parchment text-xs font-vi font-bold px-3 py-1.5 border-2 border-retro-charcoal bg-[#FFFDF7] cursor-pointer outline-none"
            >
              <option value="all">🌟 TẤT CẢ CÁC BÀI (Bài 1 - 15)</option>
              {availableLessons.map((num) => (
                <option key={num} value={num}>
                  📖 Bài {num} ({KANJI_COMPOUNDS.filter(c => c.lesson === num).length} từ ghép)
                </option>
              ))}
            </select>

            {/* Scope count badge */}
            <div className="text-[11px] font-vi font-bold px-2.5 py-1 bg-amber-100 border border-amber-400 text-amber-900">
              <span>Tổng: {totalInScope} từ ghép</span>
            </div>
          </div>
        </div>

        {/* 2. ROOT KANJI FILTER STRIP */}
        {availableRootKanji.length > 0 && (
          <div className="border-t border-dashed border-slate-300 pt-2.5">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[11px] font-vi font-bold text-slate-500 uppercase tracking-wide mr-1">
                Lọc theo chữ:
              </span>

              <button
                onClick={() => {
                  soundFX.playClick();
                  setSelectedRootKanji(null);
                }}
                className={`text-[11px] font-vi font-bold px-2 py-0.5 border transition-all ${
                  selectedRootKanji === null
                    ? 'bg-retro-charcoal text-white border-retro-charcoal shadow-pixel-sm'
                    : 'bg-white text-slate-700 border-slate-300 hover:bg-parchment'
                }`}
              >
                Tất cả ({totalInScope})
              </button>

              {availableRootKanji.map((kanjiChar) => {
                const count = (selectedLesson === 'all' ? KANJI_COMPOUNDS : KANJI_COMPOUNDS.filter(c => c.lesson === selectedLesson))
                  .filter(c => c.rootKanji.includes(kanjiChar)).length;

                return (
                  <button
                    key={kanjiChar}
                    onClick={() => {
                      soundFX.playClick();
                      setSelectedRootKanji(prev => prev === kanjiChar ? null : kanjiChar);
                    }}
                    className={`font-jp text-xs px-2 py-0.5 border transition-all ${
                      selectedRootKanji === kanjiChar
                        ? 'bg-matcha text-white border-retro-charcoal font-bold shadow-pixel-sm'
                        : 'bg-[#FFFDF7] text-retro-charcoal border-slate-300 hover:bg-emerald-50'
                    }`}
                    title={`Lọc từ có chứa chữ ${kanjiChar}`}
                  >
                    {kanjiChar} <span className="text-[10px] opacity-70">({count})</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* 3. SEARCH ROW */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 border-t border-dashed border-slate-300 pt-2.5">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm từ Hán tự, Hiragana, Hán-Việt hoặc nghĩa..."
              className="w-full pl-8 pr-3 py-1.5 text-xs font-vi border-2 border-retro-charcoal bg-white outline-none focus:bg-amber-50/50"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            )}
          </div>

          <span className="text-xs font-retro text-slate-600 shrink-0">
            Hiển thị {filteredItems.length} từ ghép
          </span>
        </div>

      </div>

      {/* 2. CONTENT AREA: LIST VIEW vs FLASHCARD VIEW */}
      {viewMode === 'list' ? (
        
        /* ================= LIST / GRID VIEW ================= */
        <div className="space-y-3">
          {filteredItems.length === 0 ? (
            <div className="pixel-box p-8 bg-[#FFFDF7] text-center space-y-2 border-2 border-retro-charcoal">
              <p className="text-3xl">🔍</p>
              <p className="font-vi font-bold text-sm text-retro-charcoal">Không tìm thấy từ ghép phù hợp</p>
              <p className="text-xs font-vi text-slate-500">
                Hãy thử xóa bớt điều kiện lọc hoặc từ khóa tìm kiếm.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  className="pixel-box p-3.5 bg-[#FFFDF7] border-2 border-retro-charcoal flex flex-col justify-between transition-all hover:-translate-y-0.5 hover:shadow-pixel-sm relative"
                >
                  {/* Top Row: Lesson Badge + Audio */}
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] font-vi font-bold bg-amber-100 text-amber-900 border border-amber-300 px-1.5 py-0.5">
                      Bài {item.lesson}
                    </span>

                    {/* Audio Button */}
                    <button
                      onClick={() => {
                        soundFX.playClick();
                        playJapaneseAudio(item.word);
                      }}
                      className="p-1.5 bg-amber-50 hover:bg-amber-100 border border-retro-charcoal text-retro-charcoal transition-transform hover:scale-110 active:scale-95"
                      title="Nghe phát âm"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                    {/* Word Center */}
                    <div className="space-y-1 mb-2">
                      <div className="flex items-baseline gap-2 flex-wrap">
                        <span className="font-jp text-2xl font-black text-retro-charcoal tracking-wide">
                          {item.word}
                        </span>
                        <span className="font-jp text-sm font-semibold text-rose-700">
                          【{item.reading}】
                        </span>
                      </div>

                      {/* Hán-Việt */}
                      <div className="text-[11px] font-vi font-extrabold uppercase text-amber-800 tracking-wider">
                        {item.hanViet}
                      </div>

                      {/* Vietnamese Meaning */}
                      <p className="text-xs font-vi text-slate-700 font-medium leading-relaxed">
                        {item.meaning}
                      </p>
                    </div>

                    {/* Root Kanji Tags */}
                    {item.rootKanji.length > 0 && (
                      <div className="flex items-center gap-1 pt-2 border-t border-dashed border-slate-200">
                        <span className="text-[10px] font-vi text-slate-400">Kanji:</span>
                        {item.rootKanji.map((k) => (
                          <span
                            key={k}
                            onClick={() => setSelectedRootKanji(k)}
                            className="font-jp text-[11px] font-bold px-1.5 py-0.2 bg-parchment border border-slate-300 text-retro-charcoal hover:bg-amber-100 cursor-pointer"
                            title={`Xem tất cả từ chứa chữ ${k}`}
                          >
                            {k}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
              ))}
            </div>
          )}
        </div>

      ) : (

        /* ================= FLASHCARD VIEW ================= */
        <div className="space-y-4 max-w-2xl mx-auto">
          {filteredItems.length === 0 ? (
            <div className="pixel-box p-8 bg-[#FFFDF7] text-center space-y-2 border-2 border-retro-charcoal">
              <p className="text-3xl">🎴</p>
              <p className="font-vi font-bold text-sm text-retro-charcoal">Không có thẻ nào trong bộ lọc này</p>
              <p className="text-xs font-vi text-slate-500">Hãy chọn bài học khác hoặc bỏ chọn bộ lọc.</p>
            </div>
          ) : (
            <>
              {/* Progress & Quick Controls */}
              <div className="flex items-center justify-between gap-3 text-xs font-vi font-bold px-1">
                <span className="text-slate-600">
                  Thẻ <span className="text-sakura text-sm font-black">{cardIndex + 1}</span> / {filteredItems.length}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleShuffle}
                    className={`px-2.5 py-1 text-xs border border-retro-charcoal flex items-center gap-1 font-vi font-bold ${
                      isShuffled ? 'bg-amber-300 text-retro-charcoal' : 'bg-white hover:bg-parchment text-slate-700'
                    }`}
                    title="Xáo trộn thứ tự thẻ"
                  >
                    <Shuffle className="w-3.5 h-3.5" />
                    <span>Xáo trộn</span>
                  </button>

                  <span className="text-slate-400 hidden sm:inline">• Nhấn Space để lật thẻ</span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full h-2 bg-slate-200 border border-retro-charcoal overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-400 to-sakura transition-all duration-300"
                  style={{ width: `${((cardIndex + 1) / filteredItems.length) * 100}%` }}
                />
              </div>

              {/* 3D Pixel Flip Card */}
              <div
                onClick={handleFlipCard}
                className="w-full min-h-[300px] sm:min-h-[340px] pixel-box p-6 sm:p-8 bg-gradient-to-b from-[#FFFDF7] to-amber-50/40 border-4 border-retro-charcoal shadow-pixel cursor-pointer select-none flex flex-col justify-between transition-transform active:scale-[0.99] relative overflow-hidden"
              >
                {/* Top Corner: Lesson badge + Audio */}
                <div className="flex items-center justify-between w-full">
                  <span className="text-xs font-vi font-black bg-retro-charcoal text-white px-2 py-0.5 border border-retro-charcoal">
                    BÀI {currentCard.lesson}
                  </span>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      soundFX.playClick();
                      playJapaneseAudio(currentCard.word);
                    }}
                    className="p-2 bg-white hover:bg-amber-100 border-2 border-retro-charcoal text-retro-charcoal transition-transform hover:scale-110"
                    title="Nghe phát âm"
                  >
                    <Volume2 className="w-4 h-4 text-retro-charcoal" />
                  </button>
                </div>

                {/* Center Content: Flip animation */}
                <div className="text-center py-6 space-y-3">
                  {!isFlipped ? (
                    /* FRONT OF CARD */
                    <div className="space-y-4 animate-fadeIn">
                      <div className="font-jp text-5xl sm:text-6xl font-black text-retro-charcoal tracking-wider drop-shadow-sm">
                        {currentCard.word}
                      </div>

                      <div className="text-xs font-vi font-bold text-slate-500 uppercase tracking-widest">
                        Hán-Việt: <span className="text-amber-800 font-extrabold">{currentCard.hanViet}</span>
                      </div>

                      <div className="pt-4">
                        <span className="text-xs font-vi font-semibold text-slate-400 bg-white/80 px-3 py-1 border border-dashed border-slate-300 rounded">
                          🔄 Nhấn vào thẻ (hoặc phím Space) để xem cách đọc & nghĩa
                        </span>
                      </div>
                    </div>
                  ) : (
                    /* BACK OF CARD */
                    <div className="space-y-3 animate-fadeIn">
                      <div className="font-jp text-3xl font-black text-slate-700 opacity-80">
                        {currentCard.word}
                      </div>

                      {/* Reading */}
                      <div className="font-jp text-3xl sm:text-4xl font-black text-rose-600 tracking-wide">
                        {currentCard.reading}
                      </div>

                      {/* Han-Viet */}
                      <div className="text-sm font-vi font-black text-amber-800 uppercase tracking-wider bg-amber-100/70 inline-block px-3 py-0.5 border border-amber-300">
                        {currentCard.hanViet}
                      </div>

                      {/* Meaning */}
                      <p className="font-vi text-base sm:text-lg font-bold text-retro-charcoal max-w-md mx-auto pt-1 leading-snug">
                        {currentCard.meaning}
                      </p>

                      {/* Root Kanji Pill Badges */}
                      {currentCard.rootKanji.length > 0 && (
                        <div className="flex items-center justify-center gap-1.5 pt-2">
                          <span className="text-xs font-vi text-slate-400">Các chữ cấu thành:</span>
                          {currentCard.rootKanji.map((k) => (
                            <span
                              key={k}
                              className="font-jp text-xs font-bold px-2 py-0.5 bg-white border border-retro-charcoal text-retro-charcoal"
                            >
                              {k}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Bottom Card Footer */}
                <div className="flex items-center justify-between w-full text-[11px] font-vi font-bold text-slate-400 border-t border-dashed border-slate-200 pt-2">
                  <span>{isFlipped ? 'Mặt sau (Giải nghĩa)' : 'Mặt trước (Hán tự)'}</span>
                  <span className="flex items-center gap-1 text-slate-500">
                    <RotateCw className="w-3 h-3" /> Nhấn để lật lại
                  </span>
                </div>
              </div>

              {/* Navigation Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
                {/* Prev Button */}
                <button
                  onClick={handlePrevCard}
                  className="pixel-btn px-3 py-2.5 text-xs font-vi font-bold flex items-center justify-center gap-1.5 bg-[#FFFDF7] hover:bg-parchment text-retro-charcoal"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Thẻ trước</span>
                </button>

                {/* Flip Button */}
                <button
                  onClick={handleFlipCard}
                  className="pixel-btn px-3 py-2.5 text-xs font-vi font-bold flex items-center justify-center gap-1.5 bg-amber-100 hover:bg-amber-200 text-amber-900 border-2 border-retro-charcoal"
                >
                  <RotateCw className="w-4 h-4" />
                  <span>{isFlipped ? 'Xem lại chữ' : 'Xem nghĩa'}</span>
                </button>

                {/* Next Button */}
                <button
                  onClick={handleNextCard}
                  className="pixel-btn px-3 py-2.5 text-xs font-vi font-bold flex items-center justify-center gap-1.5 bg-[#FFFDF7] hover:bg-parchment text-retro-charcoal"
                >
                  <span>Thẻ tiếp</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </>
          )}
        </div>
      )}

    </div>
  );
};
