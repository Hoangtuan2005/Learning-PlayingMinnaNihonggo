import { useState, useEffect } from 'react';
import { TopHudHeader } from './components/layout/TopHudHeader';
import { LessonSidebar } from './components/layout/LessonSidebar';
import { VocabTab } from './components/study/VocabTab';
import { KanjiTab } from './components/study/KanjiTab';
import { KanjiCompoundTab } from './components/study/KanjiCompoundTab';
import { GrammarTab } from './components/study/GrammarTab';
import { KanaTab } from './components/study/KanaTab';
import { FlashcardModal } from './components/study/FlashcardModal';
import { MiniGamesHubModal } from './components/game/MiniGamesHubModal';
import { KanjiNinjaGame } from './components/game/KanjiNinjaGame';
import { KoiFishingGame } from './components/game/KoiFishingGame';
import { ZenGarden3D } from './components/garden/ZenGarden3D';
import { RpgRightPanel } from './components/layout/RpgRightPanel';
import { getLessonData, getLessonCompletion } from './data/lessons';
import { LESSONS_INDEX } from './data/lessonsIndex';
import { getCompoundsByLesson } from './data/kanjiCompounds';
import { getInitialProgress, toggleItemMastery } from './utils/storage';
import { soundFX } from './utils/soundEffects';
import { UserProgress, VocabItem } from './types/lesson';
import { BookOpen, Sparkles, ScrollText, ChevronLeft, ChevronRight, Star, Languages, Layers } from 'lucide-react';

export function App() {
  const [progress, setProgress] = useState<UserProgress>(getInitialProgress);
  const [currentLesson, setCurrentLesson] = useState<number>(1);
  const [currentTab, setCurrentTab] = useState<'vocab' | 'kanji' | 'grammar' | 'kana' | 'compound'>('vocab');
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [isGamesHubOpen, setIsGamesHubOpen] = useState<boolean>(false);
  const [isGameOpen, setIsGameOpen] = useState<boolean>(false);
  const [isFishingOpen, setIsFishingOpen] = useState<boolean>(false);
  const [isZenGardenOpen, setIsZenGardenOpen] = useState<boolean>(false);
  const [isFlashcardOpen, setIsFlashcardOpen] = useState<boolean>(false);
  const [flashcardItems, setFlashcardItems] = useState<VocabItem[]>([]);
  const [isMuted, setIsMuted] = useState<boolean>(soundFX.getMuted());

  // Current lesson data and completion stats
  const lessonData = getLessonData(currentLesson);
  const lessonMeta = LESSONS_INDEX.find(l => l.lessonNumber === currentLesson);
  const currentLessonCompounds = getCompoundsByLesson(currentLesson);
  const { percentage, stars } = getLessonCompletion(lessonData, progress);

  // Toggle Mute
  const handleToggleMute = () => {
    const next = !isMuted;
    setIsMuted(next);
    soundFX.setMuted(next);
  };

  // Toggle Mastery for items
  const handleToggleVocab = (id: string) => {
    const { updatedProgress } = toggleItemMastery(progress, 'vocab', id);
    setProgress(updatedProgress);
  };

  const handleToggleKanji = (id: string) => {
    const { updatedProgress } = toggleItemMastery(progress, 'kanji', id);
    setProgress(updatedProgress);
  };

  const handleToggleGrammar = (id: string) => {
    const { updatedProgress } = toggleItemMastery(progress, 'grammar', id);
    setProgress(updatedProgress);
  };

  const handleToggleCompound = (id: string) => {
    const { updatedProgress } = toggleItemMastery(progress, 'compound', id);
    setProgress(updatedProgress);
  };

  // Flashcard handler
  const handleOpenFlashcard = (items: VocabItem[]) => {
    setFlashcardItems(items);
    setIsFlashcardOpen(true);
  };

  // Keyboard shortcut for lesson navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isGameOpen || isFishingOpen || isGamesHubOpen || isFlashcardOpen || isZenGardenOpen) return;
      if (e.key === 'PageUp' || (e.altKey && e.key === 'ArrowLeft')) {
        setCurrentLesson(prev => {
          const next = Math.max(0, prev - 1);
          if (next === 0) setCurrentTab('kana');
          return next;
        });
      } else if (e.key === 'PageDown' || (e.altKey && e.key === 'ArrowRight')) {
        setCurrentLesson(prev => {
          const next = Math.min(25, prev + 1);
          if (prev === 0 && next > 0) setCurrentTab('vocab');
          return next;
        });
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isGameOpen, isFlashcardOpen]);

  // If on compound tab and current lesson has no compounds, fallback to vocab
  useEffect(() => {
    if (currentTab === 'compound' && currentLessonCompounds.length === 0) {
      setCurrentTab('vocab');
    }
  }, [currentLesson, currentLessonCompounds.length, currentTab]);

  return (
    <div className="min-h-screen bg-[#FAF3E0] flex flex-col font-vi text-retro-charcoal selection:bg-sakura selection:text-white">
      
      {/* 1. Top RPG Status HUD */}
      <TopHudHeader
        progress={progress}
        onOpenGame={() => setIsGamesHubOpen(true)}
        onOpenGamesHub={() => setIsGamesHubOpen(true)}
        onOpenZenGarden={() => setIsZenGardenOpen(true)}
        onToggleSidebar={() => setIsSidebarOpen(prev => !prev)}
        isSidebarOpen={isSidebarOpen}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
      />

      {/* Main Container: Left Sidebar + Study Workspace + Right RPG Panel */}
      <div className="w-full flex-1 flex">
        
        {/* 2. Left Lesson Sidebar (Lessons 1 - 25) */}
        <LessonSidebar
          currentLesson={currentLesson}
          onSelectLesson={(num) => {
            setCurrentLesson(num);
            if (num === 0) {
              setCurrentTab('kana');
            } else if (currentTab === 'kana') {
              setCurrentTab('vocab');
            }
          }}
          progress={progress}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          onSelectKana={() => {
            setCurrentLesson(0);
            setCurrentTab('kana');
          }}
          isKanaActive={currentLesson === 0}
        />

        {/* 3. Main Study Workspace */}
        <main className="flex-1 p-3 sm:p-5 md:p-6 lg:p-7 overflow-y-auto min-w-0">
          
          {/* Lesson Header Banner */}
          <div className="pixel-box-parchment p-4 md:p-6 mb-5 relative bg-gradient-to-r from-amber-50 to-orange-50 border-3 border-retro-charcoal">
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-3">
              <div>
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="font-vi text-[11px] md:text-xs font-black bg-sakura text-white px-2.5 py-0.5 border border-retro-charcoal">
                    {currentLesson === 0 ? 'BÀI 0: NHẬP MÔN' : `BÀI ${currentLesson} / 25`}
                  </span>
                  
                  {/* Stars / Badge */}
                  {currentLesson === 0 ? (
                    <span className="text-[11px] font-vi font-bold text-rose-700 bg-rose-100 px-2 py-0.5 border border-rose-300">
                      🌸 104 ÂM TIẾNG NHẬT
                    </span>
                  ) : (
                    <>
                      <div className="flex items-center gap-0.5">
                        {[1, 2, 3].map((starIdx) => (
                          <Star
                            key={starIdx}
                            className={`w-4 h-4 ${
                              starIdx <= stars ? 'text-coin fill-coin' : 'text-slate-300 fill-slate-200'
                            }`}
                          />
                        ))}
                      </div>

                      <span className="text-xs font-vi font-semibold text-slate-500 ml-1">
                        {percentage}% hoàn thành
                      </span>
                    </>
                  )}
                </div>

                {/* Lesson Title JP & VI */}
                <h2 className="font-jp text-xl md:text-2xl font-black text-retro-charcoal tracking-wide">
                  {lessonData.titleJp}
                </h2>
                <p className="text-xs md:text-sm font-vi text-slate-700 mt-0.5 font-medium">
                  {lessonMeta ? lessonMeta.title_vi : lessonData.titleVi}
                </p>
              </div>

              {/* Prev / Next Lesson Navigation Buttons */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  disabled={currentLesson <= 0}
                  onClick={() => {
                    soundFX.playClick();
                    const prev = Math.max(0, currentLesson - 1);
                    setCurrentLesson(prev);
                    if (prev === 0) setCurrentTab('kana');
                  }}
                  className={`pixel-btn-sm px-2.5 py-1.5 text-xs font-vi font-bold flex items-center gap-1 ${
                    currentLesson <= 0
                      ? 'opacity-40 cursor-not-allowed bg-slate-200'
                      : 'bg-[#FFFDF7] hover:bg-parchment'
                  }`}
                  title="Bài trước"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Trước</span>
                </button>

                <button
                  disabled={currentLesson >= 25}
                  onClick={() => {
                    soundFX.playClick();
                    const next = Math.min(25, currentLesson + 1);
                    setCurrentLesson(next);
                    if (currentLesson === 0) setCurrentTab('vocab');
                  }}
                  className={`pixel-btn-sm px-2.5 py-1.5 text-xs font-vi font-bold flex items-center gap-1 ${
                    currentLesson >= 25
                      ? 'opacity-40 cursor-not-allowed bg-slate-200'
                      : 'bg-[#FFFDF7] hover:bg-parchment'
                  }`}
                  title="Bài sau"
                >
                  <span className="hidden sm:inline">Sau</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Lesson Description */}
            {lessonMeta?.description && (
              <p className="text-xs font-vi text-slate-600 bg-white/70 p-2.5 border border-retro-charcoal border-dashed leading-relaxed">
                💡 <span className="font-semibold">Mục tiêu bài:</span> {lessonMeta.description}
              </p>
            )}
          </div>

          {/* Core Pixel Study Tabs */}
          <div className="flex items-center gap-2 mb-4 border-b-3 border-retro-charcoal pb-2 flex-wrap">
            {currentLesson === 0 ? (
              <>
                <button
                  className="pixel-btn px-4 py-2 text-xs flex items-center gap-1.5 font-vi font-black uppercase tracking-wider bg-rose-600 text-white shadow-pixel -translate-y-0.5"
                >
                  <Languages className="w-4 h-4" />
                  <span>🌸 BẢNG CHỮ CÁI (HIRAGANA & KATAKANA)</span>
                </button>

                <button
                  onClick={() => {
                    soundFX.playClick();
                    setCurrentLesson(1);
                    setCurrentTab('vocab');
                  }}
                  className="pixel-btn px-4 py-2 text-xs flex items-center gap-1.5 font-vi font-bold uppercase tracking-wider bg-[#FFFDF7] text-retro-charcoal hover:bg-parchment shadow-pixel-sm"
                >
                  <span>TIẾP TỤC SANG BÀI 1 ➔</span>
                </button>
              </>
            ) : (
              <>
                {/* Tab 1: Từ vựng */}
                <button
                  onClick={() => {
                    soundFX.playClick();
                    setCurrentTab('vocab');
                  }}
                  className={`pixel-btn px-3 py-2 text-xs flex items-center gap-1.5 font-vi font-black uppercase tracking-wider transition-transform ${
                    currentTab === 'vocab'
                      ? 'bg-sakura text-white -translate-y-1'
                      : 'bg-[#FFFDF7] text-retro-charcoal hover:bg-parchment'
                  }`}
                >
                  <BookOpen className="w-4 h-4" />
                  <span>TỪ VỰNG ({lessonData.vocabulary.length})</span>
                </button>

                {/* Tab 2: Kanji */}
                <button
                  onClick={() => {
                    soundFX.playClick();
                    setCurrentTab('kanji');
                  }}
                  className={`pixel-btn px-3 py-2 text-xs flex items-center gap-1.5 font-vi font-black uppercase tracking-wider transition-transform ${
                    currentTab === 'kanji'
                      ? 'bg-matcha text-white -translate-y-1'
                      : 'bg-[#FFFDF7] text-retro-charcoal hover:bg-parchment'
                  }`}
                >
                  <Sparkles className="w-4 h-4" />
                  <span>KANJI ({lessonData.kanji.length})</span>
                </button>

                {/* Tab 3: Từ ghép Kanji & Flashcard (Chỉ hiển thị khi bài có Kanji) */}
                {currentLessonCompounds.length > 0 && (
                  <button
                    onClick={() => {
                      soundFX.playClick();
                      setCurrentTab('compound');
                    }}
                    className={`pixel-btn px-3 py-2 text-xs flex items-center gap-1.5 font-vi font-black uppercase tracking-wider transition-transform ${
                      currentTab === 'compound'
                        ? 'bg-amber-600 text-white -translate-y-1'
                        : 'bg-[#FFFDF7] text-retro-charcoal hover:bg-parchment'
                    }`}
                  >
                    <Layers className="w-4 h-4" />
                    <span>TỪ GHÉP & FLASHCARD ({currentLessonCompounds.length})</span>
                  </button>
                )}

                {/* Tab 4: Ngữ pháp */}
                <button
                  onClick={() => {
                    soundFX.playClick();
                    setCurrentTab('grammar');
                  }}
                  className={`pixel-btn px-3 py-2 text-xs flex items-center gap-1.5 font-vi font-black uppercase tracking-wider transition-transform ${
                    currentTab === 'grammar'
                      ? 'bg-coin text-retro-charcoal -translate-y-1'
                      : 'bg-[#FFFDF7] text-retro-charcoal hover:bg-parchment'
                  }`}
                >
                  <ScrollText className="w-4 h-4" />
                  <span>NGỮ PHÁP ({lessonData.grammar.length})</span>
                </button>
              </>
            )}
          </div>

          {/* Tab Contents */}
          <div className="min-h-[450px]">
            {currentTab === 'kana' && (
              <KanaTab />
            )}

            {currentTab === 'vocab' && (
              <VocabTab
                vocabulary={lessonData.vocabulary}
                progress={progress}
                onToggleMastered={handleToggleVocab}
                onOpenFlashcard={handleOpenFlashcard}
              />
            )}

            {currentTab === 'kanji' && (
              <KanjiTab
                kanji={lessonData.kanji}
                progress={progress}
                onToggleMastered={handleToggleKanji}
              />
            )}

            {currentTab === 'compound' && (
              <KanjiCompoundTab
                currentLesson={currentLesson}
                progress={progress}
                onToggleMastered={handleToggleCompound}
              />
            )}

            {currentTab === 'grammar' && (
              <GrammarTab
                grammar={lessonData.grammar}
                progress={progress}
                onToggleMastered={handleToggleGrammar}
              />
            )}
          </div>

        </main>

        {/* 4. Right RPG Companion Panel (Character stats, Pro tips, Quick Launch) */}
        <RpgRightPanel
          progress={progress}
          lessonData={lessonData}
          currentLesson={currentLesson}
          onOpenGame={() => setIsGamesHubOpen(true)}
        />

      </div>

      {/* 4. Flashcard Modal */}
      {isFlashcardOpen && (
        <FlashcardModal
          items={flashcardItems}
          progress={progress}
          onToggleMastered={handleToggleVocab}
          onClose={() => setIsFlashcardOpen(false)}
        />
      )}

      {/* 5. Mini-Games Arcade Hub Modal */}
      <MiniGamesHubModal
        isOpen={isGamesHubOpen}
        onClose={() => setIsGamesHubOpen(false)}
        progress={progress}
        onSelectGame={(gameId) => {
          if (gameId === 'ninja') {
            setIsGamesHubOpen(false);
            setIsGameOpen(true);
          } else if (gameId === 'fishing') {
            setIsGamesHubOpen(false);
            setIsFishingOpen(true);
          }
        }}
      />

      {/* 6. Mini-Game "Chém Chữ Nhật" Modal */}
      {isGameOpen && (
        <KanjiNinjaGame
          progress={progress}
          onUpdateProgress={(newProgress) => setProgress(newProgress)}
          onClose={() => {
            setIsGameOpen(false);
            setIsGamesHubOpen(true);
          }}
          initialLesson={currentLesson || 1}
        />
      )}

      {/* 7. Mini-Game "Bắt Cá Koi N5" Modal */}
      {isFishingOpen && (
        <KoiFishingGame
          progress={progress}
          onUpdateProgress={(newProgress) => setProgress(newProgress)}
          onClose={() => {
            setIsFishingOpen(false);
            setIsGamesHubOpen(true);
          }}
          initialLesson={currentLesson || 1}
        />
      )}

      {/* 8. 3D Zen Garden Japanese Relaxation Space */}
      {isZenGardenOpen && (
        <ZenGarden3D
          progress={progress}
          onClose={() => setIsZenGardenOpen(false)}
        />
      )}

      {/* Footer */}
      <footer className="bg-[#FFFDF7] border-t-3 border-retro-charcoal p-3 text-center text-xs font-retro text-slate-500">
        Minna no Nihongo N5 Quest • 16-bit Pixel Art Japanese Learning • Modular Architecture ready for JSON injection
      </footer>

    </div>
  );
}

export default App;
