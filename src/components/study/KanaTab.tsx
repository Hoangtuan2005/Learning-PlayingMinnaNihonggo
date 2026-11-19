import React, { useState } from 'react';
import { KANA_SEION_ROWS, KANA_DAKUON_ROWS, KANA_YOON_ROWS, KanaChar } from '../../data/kanaData';
import { playJapaneseAudio } from '../../utils/audio';
import { soundFX } from '../../utils/soundEffects';
import { Volume2, Search, Lightbulb } from 'lucide-react';

export const KanaTab: React.FC = () => {
  const [alphabet, setAlphabet] = useState<'hiragana' | 'katakana'>('hiragana');
  const [section, setSection] = useState<'seion' | 'dakuon' | 'yoon'>('seion');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeChar, setActiveChar] = useState<KanaChar | null>(null);

  const currentRows = section === 'seion' 
    ? KANA_SEION_ROWS 
    : section === 'dakuon' 
      ? KANA_DAKUON_ROWS 
      : KANA_YOON_ROWS;

  const handlePlayKana = (char: KanaChar) => {
    soundFX.playClick();
    setActiveChar(char);
    // Play audio pronunciation of the kana
    playJapaneseAudio(char.hiragana);
  };

  return (
    <div className="space-y-5">
      
      {/* 1. Header & Alphabet Mode Selector */}
      <div className="pixel-box p-4 bg-[#FFFDF7] flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        
        {/* Toggle Hiragana / Katakana */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              soundFX.playClick();
              setAlphabet('hiragana');
            }}
            className={`pixel-btn px-4 py-2.5 text-xs sm:text-sm font-vi font-black uppercase tracking-wider transition-all flex items-center gap-2 ${
              alphabet === 'hiragana'
                ? 'bg-sakura text-white shadow-pixel -translate-y-0.5'
                : 'bg-parchment hover:bg-parchment-dark text-retro-charcoal'
            }`}
          >
            <span>🌸</span>
            <span>HIRAGANA (CHỮ MỀM)</span>
          </button>

          <button
            onClick={() => {
              soundFX.playClick();
              setAlphabet('katakana');
            }}
            className={`pixel-btn px-4 py-2.5 text-xs sm:text-sm font-vi font-black uppercase tracking-wider transition-all flex items-center gap-2 ${
              alphabet === 'katakana'
                ? 'bg-coin text-retro-charcoal shadow-pixel -translate-y-0.5'
                : 'bg-parchment hover:bg-parchment-dark text-retro-charcoal'
            }`}
          >
            <span>⚡</span>
            <span>KATAKANA (CHỮ CỨNG)</span>
          </button>
        </div>

        {/* Search Kana */}
        <div className="relative w-full md:w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm Romaji (a, ka, shi...)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value.toLowerCase())}
            className="w-full pl-9 pr-3 py-2 text-xs font-vi border-2 border-retro-charcoal bg-parchment focus:bg-white focus:outline-none"
          />
        </div>

      </div>

      {/* 2. Section Selector: Âm cơ bản / Âm đục / Âm ghép */}
      <div className="flex items-center gap-2 border-b-3 border-retro-charcoal pb-2 flex-wrap">
        <button
          onClick={() => {
            soundFX.playClick();
            setSection('seion');
          }}
          className={`pixel-btn-sm px-3.5 py-1.5 text-xs font-vi font-bold uppercase tracking-wide transition-all ${
            section === 'seion'
              ? 'bg-retro-charcoal text-white shadow-pixel-sm'
              : 'bg-[#FFFDF7] hover:bg-parchment text-retro-charcoal'
          }`}
        >
          1. ÂM CƠ BẢN (46 KÝ TỰ)
        </button>

        <button
          onClick={() => {
            soundFX.playClick();
            setSection('dakuon');
          }}
          className={`pixel-btn-sm px-3.5 py-1.5 text-xs font-vi font-bold uppercase tracking-wide transition-all ${
            section === 'dakuon'
              ? 'bg-matcha text-white shadow-pixel-sm'
              : 'bg-[#FFFDF7] hover:bg-parchment text-retro-charcoal'
          }`}
        >
          2. ÂM ĐỤC & BÁN ĐỤC (25 KÝ TỰ)
        </button>

        <button
          onClick={() => {
            soundFX.playClick();
            setSection('yoon');
          }}
          className={`pixel-btn-sm px-3.5 py-1.5 text-xs font-vi font-bold uppercase tracking-wide transition-all ${
            section === 'yoon'
              ? 'bg-coin text-retro-charcoal shadow-pixel-sm'
              : 'bg-[#FFFDF7] hover:bg-parchment text-retro-charcoal'
          }`}
        >
          3. ÂM GHÉP (33 KÝ TỰ)
        </button>
      </div>

      {/* 3. Guide & Audio hint */}
      <div className="bg-amber-50 border-2 border-retro-charcoal p-3 flex items-center justify-between text-xs font-vi text-amber-900 gap-3">
        <div className="flex items-center gap-2">
          <Lightbulb className="w-4 h-4 text-amber-600 shrink-0" />
          <span>
            Nhấn vào bất kỳ ô chữ nào để <strong>nghe phát âm chuẩn giọng Nhật</strong>!
          </span>
        </div>
        <div className="text-[11px] font-bold text-slate-500 hidden sm:block">
          {alphabet === 'hiragana' ? '🌸 Bảng chữ mềm thuần Nhật' : '⚡ Bảng chữ cứng phiên âm từ mượn'}
        </div>
      </div>

      {/* 4. Kana Grid Table */}
      <div className="space-y-4">
        {currentRows.map((row, rIdx) => {
          // Check if row has matching search items
          const hasSearchMatch = !searchTerm || row.items.some(
            it => it && (
              it.romaji.includes(searchTerm) ||
              it.hiragana.includes(searchTerm) ||
              it.katakana.includes(searchTerm)
            )
          );

          if (!hasSearchMatch) return null;

          return (
            <div key={rIdx} className="pixel-box p-3 sm:p-4 bg-[#FFFDF7]">
              
              {/* Row Header */}
              <div className="font-vi text-xs font-black uppercase tracking-wider text-slate-700 mb-2.5 flex items-center gap-2 border-b-2 border-dashed border-slate-200 pb-1">
                <span className="w-2 h-2 bg-retro-charcoal inline-block" />
                <span>{row.rowName}</span>
              </div>

              {/* Character Cards Row */}
              <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-5 lg:grid-cols-5 gap-2 sm:gap-3">
                {row.items.map((char, cIdx) => {
                  if (!char) {
                    return (
                      <div
                        key={cIdx}
                        className="h-24 sm:h-28 bg-parchment/40 border border-dashed border-slate-300 flex items-center justify-center opacity-40 select-none"
                      >
                        <span className="text-slate-300 font-retro text-sm">—</span>
                      </div>
                    );
                  }

                  const isMatch = !searchTerm || (
                    char.romaji.includes(searchTerm) ||
                    char.hiragana.includes(searchTerm) ||
                    char.katakana.includes(searchTerm)
                  );

                  const displayChar = alphabet === 'hiragana' ? char.hiragana : char.katakana;
                  const alternateChar = alphabet === 'hiragana' ? char.katakana : char.hiragana;
                  const isActive = activeChar?.id === char.id;

                  return (
                    <button
                      key={char.id}
                      onClick={() => handlePlayKana(char)}
                      className={`h-24 sm:h-28 pixel-box p-2 flex flex-col items-center justify-between transition-all group relative cursor-pointer ${
                        !isMatch ? 'opacity-30' : ''
                      } ${
                        isActive
                          ? 'bg-amber-100 border-retro-charcoal shadow-pixel -translate-y-1'
                          : 'bg-[#FFFDF7] hover:bg-parchment hover:-translate-y-0.5'
                      }`}
                      title={`Nhấp để nghe phát âm: ${char.romaji}`}
                    >
                      {/* Top: Romaji & Volume */}
                      <div className="w-full flex items-center justify-between text-[11px] font-vi">
                        <span className="font-bold text-slate-700 bg-parchment px-1.5 py-0.2 border border-retro-charcoal">
                          {char.romaji}
                        </span>
                        <Volume2 className="w-3.5 h-3.5 text-slate-400 group-hover:text-retro-charcoal transition-colors" />
                      </div>

                      {/* Main Character: Giant & Bold */}
                      <div className="font-jp text-3xl sm:text-4xl font-black text-retro-charcoal group-hover:scale-105 transition-transform">
                        {displayChar}
                      </div>

                      {/* Bottom: Alternate alphabet equivalent */}
                      <div className="text-[10px] font-jp font-semibold text-slate-400 flex items-center justify-between w-full">
                        <span>{alternateChar}</span>
                        {char.note && (
                          <span className="text-[8px] bg-rose-100 text-rose-800 px-1 border border-rose-300">
                            ★
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
};
