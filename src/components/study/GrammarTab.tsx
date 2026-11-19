import React, { useMemo } from 'react';
import { GrammarItem, UserProgress } from '../../types/lesson';
import { playJapaneseAudio } from '../../utils/audio';
import { soundFX } from '../../utils/soundEffects';
import { Volume2, Check, AlertTriangle, ScrollText, Sparkles, BookOpen } from 'lucide-react';

interface GrammarTabProps {
  grammar: GrammarItem[];
  progress: UserProgress;
  onToggleMastered: (id: string) => void;
}

export const GrammarTab: React.FC<GrammarTabProps> = ({
  grammar,
  progress,
  onToggleMastered,
}) => {
  const masteredSet = useMemo(() => new Set(progress.masteredGrammarIds), [progress.masteredGrammarIds]);

  return (
    <div className="space-y-6">
      
      {/* Intro info bar */}
      <div className="pixel-box p-3 bg-[#FFFDF7] flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <ScrollText className="w-5 h-5 text-amber-700" />
          <h3 className="font-vi text-xs sm:text-sm text-retro-charcoal font-black uppercase tracking-wider">
            CUỘN GIẤY NGỮ PHÁP ({grammar.length} MẪU CÂU)
          </h3>
        </div>
        <div className="text-xs font-vi text-slate-600 font-medium">
          Học kỹ cấu trúc và nghe cách đọc từng câu ví dụ
        </div>
      </div>

      {/* Stack of RPG Scroll / Dialogue blocks */}
      <div className="space-y-5">
        {grammar.map((item, idx) => {
          const isMastered = masteredSet.has(item.id);

          return (
            <div
              key={item.id}
              className={`pixel-dialogue p-4 md:p-6 transition-all ${
                isMastered ? 'bg-emerald-50/70 border-emerald-900/80' : 'bg-[#FFFDF7]'
              }`}
            >
              {/* Formula Banner Header */}
              <div className="rpg-scroll-header -mx-4 -mt-4 md:-mx-6 md:-mt-6 p-3 md:p-4 mb-4 flex items-center justify-between border-b-3 border-retro-charcoal">
                <div className="flex items-center gap-2 md:gap-3 flex-wrap">
                  <span className="w-7 h-7 bg-retro-charcoal text-white font-pixel text-xs flex items-center justify-center border border-retro-charcoal shadow-pixel-sm shrink-0">
                    {idx + 1}
                  </span>
                  <h4 className="font-jp font-bold text-base md:text-lg text-retro-charcoal tracking-wide">
                    {item.pattern}
                  </h4>
                </div>

                <div className="flex items-center gap-2">
                  {isMastered && (
                    <span className="hidden sm:inline-flex items-center gap-1 font-vi text-[11px] font-black px-2 py-0.5 bg-matcha text-white border border-retro-charcoal">
                      <Sparkles className="w-3 h-3" /> ĐÃ THUỘC
                    </span>
                  )}
                  <button
                    onClick={() => {
                      soundFX.playClick();
                      onToggleMastered(item.id);
                    }}
                    className={`pixel-btn-sm px-3 py-1 text-xs font-vi font-bold flex items-center gap-1.5 transition-colors ${
                      isMastered
                        ? 'bg-matcha text-white'
                        : 'bg-parchment hover:bg-parchment-dark text-slate-800'
                    }`}
                  >
                    <Check className={`w-3.5 h-3.5 ${isMastered ? 'stroke-[3]' : ''}`} />
                    <span className="hidden md:inline">{isMastered ? 'Đã hiểu ✓' : 'Đánh dấu đã hiểu'}</span>
                  </button>
                </div>
              </div>

              {/* Explanation text */}
              <div className="mb-4">
                <div className="font-vi text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-slate-700 inline-block" />
                  <span>GIẢI THÍCH NGỮ NGHĨA:</span>
                </div>
                <p className="text-sm md:text-base font-vi text-slate-800 leading-relaxed font-normal bg-parchment/60 p-3 border-2 border-retro-charcoal whitespace-pre-line">
                  {item.explanation}
                </p>
              </div>

              {/* Note highlight box (if available) */}
              {item.note && (
                <div className="mb-4 p-3 bg-amber-50 border-2 border-amber-600/80 flex items-start gap-2.5">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-vi text-xs font-black uppercase tracking-wider text-amber-800 block mb-1">
                      LƯU Ý QUAN TRỌNG:
                    </span>
                    <p className="text-xs md:text-sm font-vi text-amber-900 leading-relaxed font-medium">
                      {item.note}
                    </p>
                  </div>
                </div>
              )}

              {/* Example Sentences */}
              {item.examples && item.examples.length > 0 && (
                <div className="mt-4 pt-3 border-t-2 border-dashed border-slate-300">
                  <div className="font-vi text-xs font-black uppercase tracking-wider text-slate-700 mb-2 flex items-center gap-1.5">
                    <span className="w-2 h-2 bg-amber-600 inline-block" />
                    <span>CÂU VÍ DỤ MINH HỌA:</span>
                  </div>

                  <div className="space-y-2.5">
                    {item.examples.map((ex, exIdx) => (
                      <div
                        key={exIdx}
                        className="p-3 bg-[#FFFDF7] border-2 border-retro-charcoal hover:bg-amber-50 transition-colors flex items-start justify-between gap-3 group"
                      >
                        <div className="space-y-1 flex-1">
                          {/* Japanese Sentence */}
                          <div className="font-jp text-sm md:text-base font-bold text-retro-charcoal whitespace-pre-line">
                            {ex.jp}
                          </div>
                          {/* Vietnamese Translation */}
                          <div className="font-vi text-xs md:text-sm text-slate-600 whitespace-pre-line">
                            {ex.vi}
                          </div>
                        </div>

                        {/* Audio speaker button */}
                        <button
                          onClick={() => playJapaneseAudio(ex.jp)}
                          className="p-1.5 bg-parchment border-2 border-retro-charcoal hover:bg-coin active:translate-y-0.5 shadow-pixel-sm shrink-0 transition-colors"
                          title="Nghe câu ví dụ"
                        >
                          <Volume2 className="w-4 h-4 text-retro-charcoal" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          );
        })}
      </div>

      {grammar.length === 0 && (
        <div className="pixel-box p-8 text-center bg-[#FFFDF7]">
          <BookOpen className="w-10 h-10 mx-auto text-slate-400 mb-2" />
          <p className="font-vi text-sm font-bold text-retro-charcoal mb-1">
            Không có ngữ pháp nào!
          </p>
          <p className="text-xs text-slate-500 font-vi">
            Bài này chưa có dữ liệu ngữ pháp. Thêm dữ liệu vào JSON để hiển thị.
          </p>
        </div>
      )}

    </div>
  );
};
