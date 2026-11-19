import React, { useState } from 'react';
import { LESSONS_INDEX } from '../../data/lessonsIndex';
import { UserProgress } from '../../types/lesson';
import { getLessonData, getLessonCompletion } from '../../data/lessons';
import { soundFX } from '../../utils/soundEffects';
import { Star, CheckCircle2, X, Search, Compass } from 'lucide-react';

interface LessonSidebarProps {
  currentLesson: number;
  onSelectLesson: (lessonNum: number) => void;
  progress: UserProgress;
  isOpen: boolean;
  onClose: () => void;
  onSelectKana?: () => void;
  isKanaActive?: boolean;
}

export const LessonSidebar: React.FC<LessonSidebarProps> = ({
  currentLesson,
  onSelectLesson,
  progress,
  isOpen,
  onClose,
  onSelectKana,
  isKanaActive = false,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredLessons = LESSONS_INDEX.filter((item) => {
    if (item.lessonNumber === 0) return false;
    const term = searchTerm.toLowerCase();
    return (
      item.lessonNumber.toString().includes(term) ||
      item.title_vi.toLowerCase().includes(term) ||
      item.title_jp.toLowerCase().includes(term)
    );
  });

  const isKanaSelected = currentLesson === 0 || isKanaActive;

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/40 z-40 md:hidden backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed md:sticky top-14 md:top-[69px] z-40 w-72 md:w-80 h-[calc(100vh-56px)] md:h-[calc(100vh-69px)] bg-[#FAF3E0] border-r-4 border-retro-charcoal flex flex-col transition-transform duration-200 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Sidebar Header */}
        <div className="p-3 bg-parchment-dark border-b-3 border-retro-charcoal flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-sakura-dark" />
            <h2 className="font-vi text-xs text-retro-charcoal font-black tracking-wider uppercase">
              BẢN ĐỒ NHIỆM VỤ
            </h2>
          </div>
          
          <button
            onClick={onClose}
            className="md:hidden p-1 border-2 border-retro-charcoal bg-[#FFFDF7] hover:bg-slate-100"
          >
            <X className="w-4 h-4 text-retro-charcoal" />
          </button>
        </div>

        {/* Search input */}
        <div className="p-2.5 border-b-2 border-retro-charcoal bg-[#FFFDF7]">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm Bài 1 - 25..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-2 py-1 text-xs font-vi border-2 border-retro-charcoal bg-parchment focus:bg-white focus:outline-none"
            />
          </div>
        </div>

        {/* Scrollable Lesson Stages List */}
        <div className="flex-1 overflow-y-auto p-2.5 space-y-2">
          
          {/* Stage 0: Bảng Chữ Cái Kana */}
          {(!searchTerm || 'bảng chữ cái hiragana katakana nhap mon bai 0'.includes(searchTerm.toLowerCase())) && (
            <button
              onClick={() => {
                soundFX.playClick();
                onSelectLesson(0);
                if (onSelectKana) onSelectKana();
                if (window.innerWidth < 768) {
                  onClose();
                }
              }}
              className={`w-full text-left p-2.5 transition-all text-xs font-vi relative block ${
                isKanaSelected
                  ? 'bg-rose-100 border-3 border-retro-charcoal shadow-pixel -translate-y-0.5'
                  : 'bg-rose-50/70 border-2 border-retro-charcoal hover:bg-rose-100'
              }`}
            >
              {isKanaSelected && (
                <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-sakura border-y-2 border-r-2 border-retro-charcoal" />
              )}
              <div className="flex items-center justify-between mb-1">
                <span className="font-vi text-[10px] font-black px-1.5 py-0.5 bg-rose-500 text-white border border-retro-charcoal">
                  BÀI 0: NHẬP MÔN
                </span>
                <span className="text-[10px] font-bold text-rose-700 bg-white/80 px-1 border border-rose-300">
                  🌸 46 Chữ
                </span>
              </div>
              <div className="font-jp font-black text-xs text-retro-charcoal">
                ひらがな & カタカナ
              </div>
              <div className="text-[11px] text-slate-600 truncate mt-0.5 font-medium">
                Bảng chữ cái Hiragana & Katakana
              </div>
            </button>
          )}

          {filteredLessons.map((lesson) => {
            const isSelected = lesson.lessonNumber === currentLesson;
            const lessonData = getLessonData(lesson.lessonNumber);
            const { percentage, stars } = getLessonCompletion(lessonData, progress);
            const isFull = percentage >= 100;

            return (
              <button
                key={lesson.id}
                onClick={() => {
                  soundFX.playClick();
                  onSelectLesson(lesson.lessonNumber);
                  if (window.innerWidth < 768) {
                    onClose();
                  }
                }}
                className={`w-full text-left p-2.5 transition-all text-xs font-vi relative block ${
                  isSelected
                    ? 'bg-amber-100 border-3 border-retro-charcoal shadow-pixel -translate-y-0.5'
                    : 'bg-[#FFFDF7] border-2 border-retro-charcoal hover:bg-parchment hover:border-retro-charcoal'
                }`}
              >
                {/* Active indicator flag */}
                {isSelected && (
                  <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-sakura border-y-2 border-r-2 border-retro-charcoal" />
                )}

                {/* Top line: Lesson Badge & Stars */}
                <div className="flex items-center justify-between mb-1">
                  <span className={`font-vi text-[10px] font-black px-1.5 py-0.5 border border-retro-charcoal ${
                    isSelected ? 'bg-sakura text-white' : 'bg-parchment-dark text-retro-charcoal'
                  }`}>
                    BÀI {lesson.lessonNumber}
                  </span>

                  {/* Stars rating */}
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3].map((starIndex) => (
                      <Star
                        key={starIndex}
                        className={`w-3.5 h-3.5 ${
                          starIndex <= stars
                            ? 'text-coin fill-coin'
                            : 'text-slate-300 fill-slate-200'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Japanese title */}
                <div className="font-jp font-semibold text-xs text-retro-charcoal truncate mb-0.5">
                  {lesson.title_jp}
                </div>

                {/* Vietnamese topic */}
                <div className="text-[11px] text-slate-600 truncate mb-2">
                  {lesson.title_vi.replace(/^Bài \d+:\s*/, '')}
                </div>

                {/* Progress bar footer */}
                <div className="flex items-center justify-between gap-2 text-[10px] font-pixel text-slate-500">
                  <div className="flex-1 h-2 bg-slate-200 border border-retro-charcoal overflow-hidden">
                    <div
                      className={`h-full ${
                        isFull ? 'bg-matcha' : 'bg-coin'
                      }`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="flex items-center gap-1 font-bold">
                    {percentage}%
                    {isFull && <CheckCircle2 className="w-3 h-3 text-matcha" />}
                  </span>
                </div>
              </button>
            );
          })}

          {filteredLessons.length === 0 && (
            <div className="p-4 text-center text-xs text-slate-500 font-retro">
              Không tìm thấy bài học nào phù hợp.
            </div>
          )}
        </div>

        {/* Sidebar Footer info */}
        <div className="p-2.5 bg-parchment-dark border-t-2 border-retro-charcoal text-[11px] font-retro text-slate-600 flex items-center justify-between">
          <span>Minna no Nihongo N5</span>
          <span className="text-sakura-dark font-bold">25 Bài học</span>
        </div>
      </aside>
    </>
  );
};
