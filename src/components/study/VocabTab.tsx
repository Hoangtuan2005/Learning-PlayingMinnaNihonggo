import React, { useState, useMemo } from 'react';
import { VocabItem } from '../../types/lesson';
import { playJapaneseAudio } from '../../utils/audio';
import { soundFX } from '../../utils/soundEffects';
import { Volume2, Search, Layers, BookOpen } from 'lucide-react';

interface VocabTabProps {
  vocabulary: VocabItem[];
  onOpenFlashcard: (items: VocabItem[]) => void;
}

const JAPAN_THEMED_ICONS = [
  { icon: '🌸', name: 'Hoa anh đào (Sakura)' },
  { icon: '⛩️', name: 'Cổng Torii Thần đạo' },
  { icon: '🗻', name: 'Núi Phú Sĩ (Fuji)' },
  { icon: '🍵', name: 'Trà đạo Matcha' },
  { icon: '🍙', name: 'Cơm nắm Onigiri' },
  { icon: '🏮', name: 'Đèn lồng đỏ Chōchin' },
  { icon: '🎏', name: 'Cờ cá chép Koinobori' },
  { icon: '🍡', name: 'Bánh Dango ba màu' },
  { icon: '🪭', name: 'Quạt giấy Sensu' },
  { icon: '🍣', name: 'Món ngon Sushi' },
  { icon: '🎋', name: 'Cây trúc ước nguyện Tanabata' },
  { icon: '🐱', name: 'Mèo chiêu tài Maneki-neko' },
  { icon: '🏯', name: 'Thành cổ Lâu đài Nhật Bản' },
  { icon: '🥋', name: 'Võ phục Võ đạo Nhật' },
  { icon: '🍱', name: 'Cơm hộp Bento' },
  { icon: '🍜', name: 'Mì Ramen Nhật Bản' },
  { icon: '🎐', name: 'Chuông gió Furin mùa hè' },
  { icon: '🎌', name: 'Cờ đôi Nhật Bản' }
];

function getJapanIcon(id: string, index: number) {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash << 5) - hash + id.charCodeAt(i);
    hash |= 0;
  }
  const idx = Math.abs(hash + index) % JAPAN_THEMED_ICONS.length;
  return JAPAN_THEMED_ICONS[idx];
}

export const VocabTab: React.FC<VocabTabProps> = ({
  vocabulary,
  onOpenFlashcard,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredItems = useMemo(() => {
    return vocabulary.filter((item) => {
      if (!searchTerm) return true;
      const term = searchTerm.toLowerCase();
      return (
        item.kana.toLowerCase().includes(term) ||
        (item.kanji && item.kanji.toLowerCase().includes(term)) ||
        item.meaning.toLowerCase().includes(term)
      );
    });
  }, [vocabulary, searchTerm]);

  return (
    <div className="space-y-4">
      
      {/* Control bar: Search & Flashcard button */}
      <div className="pixel-box p-3 bg-[#FFFDF7] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm từ vựng, kanji, nghĩa..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8 pr-8 py-1.5 text-xs font-vi border-2 border-retro-charcoal bg-parchment focus:bg-white focus:outline-none"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 font-bold"
              title="Xóa tìm kiếm"
            >
              ✕
            </button>
          )}
        </div>

        {/* Right side: Count & Flashcard Toggle */}
        <div className="flex items-center justify-between sm:justify-end gap-3">
          <span className="text-xs font-retro text-slate-600">
            {searchTerm
              ? `Tìm thấy ${filteredItems.length} / ${vocabulary.length} từ`
              : `${vocabulary.length} từ vựng trong bài`}
          </span>

          <button
            onClick={() => {
              soundFX.playClick();
              onOpenFlashcard(filteredItems.length > 0 ? filteredItems : vocabulary);
            }}
            className="pixel-btn-sm bg-coin hover:bg-coin-light text-retro-charcoal px-3 py-1.5 text-xs font-pixel flex items-center gap-1.5 whitespace-nowrap font-bold"
            title="Luyện tập Flashcard"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>FLASHCARD</span>
          </button>
        </div>

      </div>

      {/* Grid of Vocabulary Pixel Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3.5">
        {filteredItems.map((item, index) => {
          const jpStamp = getJapanIcon(item.id, index);

          return (
            <div
              key={item.id}
              className="pixel-box p-4 transition-all relative group bg-[#FFFDF7] hover:-translate-y-0.5 flex flex-col justify-between"
            >
              <div>
                {/* Type tag & Audio */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    {item.type && (
                      <span className="font-vi font-bold text-[10px] px-2 py-0.5 bg-amber-100 border border-retro-charcoal text-retro-charcoal">
                        {item.type}
                      </span>
                    )}
                  </div>

                  {/* Audio button */}
                  <button
                    onClick={() => playJapaneseAudio(item.kanji || item.kana, item.audioUrl)}
                    className="p-1.5 bg-parchment border-2 border-retro-charcoal hover:bg-coin hover:text-retro-charcoal active:translate-y-0.5 shadow-pixel-sm transition-colors"
                    title="Nghe phát âm"
                  >
                    <Volume2 className="w-4 h-4 text-retro-charcoal" />
                  </button>
                </div>

                {/* Japanese Kana & Kanji */}
                <div className="flex items-baseline gap-2 mb-2">
                  {item.kanji ? (
                    <>
                      <span className="font-jp text-2xl font-black text-retro-charcoal tracking-tight">
                        {item.kanji}
                      </span>
                      <span className="font-jp text-sm text-slate-500 font-bold">
                        【{item.kana}】
                      </span>
                    </>
                  ) : (
                    <span className="font-jp text-2xl font-black text-retro-charcoal">
                      {item.kana}
                    </span>
                  )}
                </div>

                {/* Vietnamese Meaning */}
                <div className="text-sm font-vi text-slate-800 font-medium mb-3 leading-relaxed border-t border-dashed border-slate-200 pt-2">
                  {item.meaning}
                </div>
              </div>

              {/* Card Footer: Japanese Cultural Stamp */}
              <div className="flex items-center justify-between pt-1">
                <div 
                  className="flex items-center gap-1.5 text-xs text-slate-500 font-vi select-none group/stamp cursor-default"
                  title={jpStamp.name}
                >
                  <span className="text-base transition-transform group-hover/stamp:scale-125 inline-block">
                    {jpStamp.icon}
                  </span>
                  <span className="text-[10px] font-vi font-semibold text-slate-400 group-hover/stamp:text-retro-charcoal transition-colors">
                    #{index + 1}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredItems.length === 0 && (
        <div className="pixel-box p-8 text-center bg-[#FFFDF7]">
          <BookOpen className="w-10 h-10 mx-auto text-slate-400 mb-2" />
          <p className="font-vi text-sm font-bold text-retro-charcoal mb-1">
            Không có từ vựng nào!
          </p>
          <p className="text-xs text-slate-500 font-vi">
            {searchTerm ? 'Không tìm thấy kết quả phù hợp với từ khóa.' : 'Hãy chuyển bộ lọc hoặc nạp thêm dữ liệu bài học.'}
          </p>
        </div>
      )}

    </div>
  );
};
