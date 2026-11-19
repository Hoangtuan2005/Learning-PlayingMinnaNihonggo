import React, { useState, useMemo } from 'react';
import { KanjiItem, UserProgress } from '../../types/lesson';
import { playJapaneseAudio } from '../../utils/audio';
import { soundFX } from '../../utils/soundEffects';
import { Volume2, Check, Sparkles, BookOpen } from 'lucide-react';

interface KanjiTabProps {
  kanji: KanjiItem[];
  progress: UserProgress;
  onToggleMastered: (id: string) => void;
}

export const KanjiTab: React.FC<KanjiTabProps> = ({
  kanji,
  progress,
  onToggleMastered,
}) => {
  const [filter, setFilter] = useState<'all' | 'unmastered' | 'mastered'>('all');

  const masteredSet = useMemo(() => new Set(progress.masteredKanjiIds), [progress.masteredKanjiIds]);

  const filteredItems = useMemo(() => {
    return kanji.filter((item) => {
      const isMastered = masteredSet.has(item.id);
      if (filter === 'unmastered' && isMastered) return false;
      if (filter === 'mastered' && !isMastered) return false;
      return true;
    });
  }, [kanji, masteredSet, filter]);

  const masteredCount = kanji.filter(k => masteredSet.has(k.id)).length;

  if (kanji.length === 0) {
    return (
      <div className="pixel-box p-10 text-center bg-[#FFFDF7] border-2 border-retro-charcoal space-y-2">
        <BookOpen className="w-12 h-12 mx-auto text-slate-300" />
        <p className="font-vi text-base font-bold text-slate-600">
          Bài học này không có chữ Kanji
        </p>
        <p className="text-xs text-slate-400 font-vi">
          Phần Kanji được để trống theo nội dung bài học.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filter bar */}
      <div className="pixel-box p-3 bg-[#FFFDF7] flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            onClick={() => {
              soundFX.playClick();
              setFilter('all');
            }}
            className={`px-3 py-1.5 text-xs font-vi font-black uppercase tracking-wide border-2 border-retro-charcoal transition-all ${
              filter === 'all'
                ? 'bg-retro-charcoal text-white shadow-pixel-sm'
                : 'bg-parchment hover:bg-parchment-dark text-retro-charcoal'
            }`}
          >
            TẤT CẢ KANJI ({kanji.length})
          </button>

          <button
            onClick={() => {
              soundFX.playClick();
              setFilter('unmastered');
            }}
            className={`px-3 py-1.5 text-xs font-vi font-black uppercase tracking-wide border-2 border-retro-charcoal transition-all ${
              filter === 'unmastered'
                ? 'bg-sakura text-white shadow-pixel-sm'
                : 'bg-parchment hover:bg-parchment-dark text-retro-charcoal'
            }`}
          >
            CHƯA THUỘC ({kanji.length - masteredCount})
          </button>

          <button
            onClick={() => {
              soundFX.playClick();
              setFilter('mastered');
            }}
            className={`px-3 py-1.5 text-xs font-vi font-black uppercase tracking-wide border-2 border-retro-charcoal transition-all ${
              filter === 'mastered'
                ? 'bg-matcha text-white shadow-pixel-sm'
                : 'bg-parchment hover:bg-parchment-dark text-retro-charcoal'
            }`}
          >
            ĐÃ THUỘC ({masteredCount})
          </button>
        </div>

        <div className="text-xs font-retro text-slate-600">
          Chữ Hán chuẩn N5 có âm On/Kun & Hán Việt
        </div>
      </div>

      {/* Grid of Square Pixel Kanji Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredItems.map((item) => {
          const isMastered = masteredSet.has(item.id);

          return (
            <div
              key={item.id}
              className={`pixel-box p-4 flex flex-col justify-between transition-all ${
                isMastered
                  ? 'bg-emerald-50/70 border-emerald-900/80'
                  : 'bg-[#FFFDF7] hover:-translate-y-0.5'
              }`}
            >
              <div>
                {/* Header: Han Viet & Audio */}
                <div className="flex items-center justify-between mb-3 border-b-2 border-retro-charcoal pb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="font-vi text-xs text-sakura-dark font-black tracking-wider bg-rose-50 px-2.5 py-0.5 border border-retro-charcoal">
                      {item.hanViet}
                    </span>
                    {isMastered && (
                      <span className="p-0.5 bg-matcha text-white border border-retro-charcoal">
                        <Sparkles className="w-3 h-3" />
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => playJapaneseAudio(item.character)}
                    className="p-1.5 bg-parchment border-2 border-retro-charcoal hover:bg-coin active:translate-y-0.5 shadow-pixel-sm transition-colors"
                    title="Phát âm chữ Hán"
                  >
                    <Volume2 className="w-4 h-4 text-retro-charcoal" />
                  </button>
                </div>

                {/* Central Gridded Square Box for Kanji */}
                <div className="flex items-center justify-center my-3">
                  <div className="w-24 h-24 kanji-grid-bg border-3 border-retro-charcoal shadow-pixel flex items-center justify-center relative select-none">
                    <span className="font-jp text-5xl font-black text-retro-charcoal hover:scale-105 transition-transform">
                      {item.character}
                    </span>
                  </div>
                </div>

                {/* Meaning */}
                <div className="text-center font-vi font-bold text-sm text-retro-charcoal mb-3">
                  {item.meaning}
                </div>

                {/* Onyomi & Kunyomi Tags */}
                <div className="space-y-1.5 bg-parchment-card p-2.5 border-2 border-retro-charcoal mb-3 text-xs">
                  {/* On */}
                  <div className="flex items-start gap-2">
                    <span className="font-pixel text-[9px] bg-sakura text-white px-1.5 py-0.5 border border-retro-charcoal shrink-0">
                      ON
                    </span>
                    <span className="font-jp text-slate-800 font-medium">
                      {item.onyomi.length > 0 ? item.onyomi.join('、 ') : '—'}
                    </span>
                  </div>

                  {/* Kun */}
                  <div className="flex items-start gap-2">
                    <span className="font-pixel text-[9px] bg-matcha text-white px-1.5 py-0.5 border border-retro-charcoal shrink-0">
                      KUN
                    </span>
                    <span className="font-jp text-slate-800 font-medium">
                      {item.kunyomi.length > 0 ? item.kunyomi.join('、 ') : '—'}
                    </span>
                  </div>
                </div>

                {/* Example Compound Words */}
                {item.examples && item.examples.length > 0 && (
                  <div className="mb-3">
                    <div className="font-vi text-[11px] font-black uppercase tracking-wider text-slate-700 mb-1.5 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 bg-slate-700 inline-block" />
                      <span>TỪ GHÉP VÍ DỤ:</span>
                    </div>
                    <div className="space-y-1.5">
                      {item.examples.map((ex, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between text-xs p-1.5 bg-[#FFFDF7] border border-retro-charcoal group/ex hover:bg-amber-50"
                        >
                          <div className="flex items-baseline gap-1.5 font-jp">
                            <span className="font-bold text-retro-charcoal">{ex.word}</span>
                            <span className="text-[11px] text-slate-500">({ex.reading})</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-[11px] text-slate-700 font-vi text-right">
                              {ex.meaning}
                            </span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                playJapaneseAudio(ex.word);
                              }}
                              className="opacity-60 group-hover/ex:opacity-100 hover:text-sakura-dark p-0.5"
                              title="Nghe từ ghép"
                            >
                              <Volume2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Mastered Button Footer */}
              <div className="pt-2 border-t border-slate-200 flex justify-end">
                <button
                  onClick={() => onToggleMastered(item.id)}
                  className={`w-full pixel-btn-sm py-1.5 text-xs font-vi font-bold flex items-center justify-center gap-1.5 transition-colors ${
                    isMastered
                      ? 'bg-matcha text-white'
                      : 'bg-parchment hover:bg-parchment-dark text-slate-700'
                  }`}
                >
                  <Check className={`w-3.5 h-3.5 ${isMastered ? 'stroke-[3]' : ''}`} />
                  <span>{isMastered ? 'Đã thuộc chữ này ✓' : 'Đánh dấu đã thuộc'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredItems.length === 0 && (
        <div className="pixel-box p-8 text-center bg-[#FFFDF7]">
          <BookOpen className="w-10 h-10 mx-auto text-slate-400 mb-2" />
          <p className="font-vi text-sm font-bold text-retro-charcoal mb-1">
            Không có chữ Kanji nào!
          </p>
          <p className="text-xs text-slate-500 font-vi">
            Bài này chưa có dữ liệu Kanji hoặc đã được lọc hết.
          </p>
        </div>
      )}
    </div>
  );
};
