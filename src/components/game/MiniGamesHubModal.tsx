import React from 'react';
import { UserProgress } from '../../types/lesson';
import { soundFX } from '../../utils/soundEffects';
import { X, Trophy, Sparkles, Swords, Fish, ArrowRight } from 'lucide-react';

interface MiniGamesHubModalProps {
  isOpen: boolean;
  onClose: () => void;
  progress: UserProgress;
  onSelectGame: (gameId: 'ninja' | 'fishing') => void;
}

export const MiniGamesHubModal: React.FC<MiniGamesHubModalProps> = ({
  isOpen,
  onClose,
  progress,
  onSelectGame,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-fadeIn">
      {/* Modal Card */}
      <div className="relative w-full max-w-4xl bg-gradient-to-b from-[#24132c] via-[#1a0e22] to-[#120818] border-3 border-[#6b3582] rounded-3xl shadow-[0_25px_60px_rgba(0,0,0,0.85)] overflow-hidden text-white flex flex-col my-auto">
        
        {/* Top Decorative Sakura & Japanese Style Header */}
        <div className="relative p-5 sm:p-6 pb-4 border-b border-[#4d2460] flex items-start justify-between bg-gradient-to-r from-rose-950/40 via-purple-950/30 to-amber-950/40">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-rose-500/20 border border-rose-400/40 text-[11px] font-vi font-bold text-rose-300 uppercase tracking-widest mb-1.5">
              <Sparkles className="w-3 h-3 text-amber-300" />
              <span>ARCADE DOJO • VỪA HỌC VỪA CHƠI</span>
            </div>
            <h2 className="font-vi text-2xl sm:text-3xl font-black text-[#FFD166] drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] tracking-wide uppercase">
              KHU TRÒ CHƠI MINI GAMES N5
            </h2>
            <p className="font-vi text-xs sm:text-sm text-slate-300 font-medium mt-0.5 max-w-xl leading-relaxed">
              Thư giãn và rèn luyện phản xạ từ vựng, chữ Hán và luyện nghe qua các mini-game Nhật Bản bám sát 25 bài Minna no Nihongo!
            </p>
          </div>

          <button
            onClick={() => {
              soundFX.playClick();
              onClose();
            }}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-all border border-white/10 shrink-0 cursor-pointer ml-3"
            title="Đóng sảnh trò chơi"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Games Grid Container */}
        <div className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 max-h-[75vh] overflow-y-auto">
          
          {/* Game 1: Chém Chữ Nhật (Ready to play) */}
          <div className="group relative bg-[#2a1734] border-2 border-[#6c3483] hover:border-amber-400/80 rounded-2xl p-4 sm:p-5 shadow-xl transition-all duration-200 hover:-translate-y-1 flex flex-col justify-between overflow-hidden">
            {/* Background subtle art glow */}
            <div className="absolute top-0 right-0 w-36 h-36 bg-rose-500/10 rounded-full blur-2xl group-hover:bg-rose-500/20 transition-all pointer-events-none" />

            <div>
              {/* Header tags & badge */}
              <div className="flex items-center justify-between mb-3">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-[10px] font-vi font-black text-emerald-300 uppercase tracking-wider flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  SẴN SÀNG CHƠI
                </span>

                <div className="flex items-center gap-1 bg-[#1a0e22] px-2.5 py-0.5 rounded-full border border-amber-500/30 text-amber-300 text-[11px] font-vi font-black">
                  <Trophy className="w-3.5 h-3.5 text-amber-400" />
                  <span>Kỷ lục: {progress.highScore || 0} điểm</span>
                </div>
              </div>

              {/* Title & Icon */}
              <div className="flex items-center gap-3 mb-2.5">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-600 to-red-700 border-2 border-rose-300 flex items-center justify-center text-2xl shadow-lg shrink-0 group-hover:scale-105 transition-transform">
                  🥷
                </div>
                <div>
                  <h3 className="font-vi text-lg font-black text-white group-hover:text-amber-300 transition-colors uppercase tracking-wide">
                    Chém Chữ Nhật
                  </h3>
                  <span className="text-[11px] text-rose-300 font-bold block">
                    Kanji & Kana Ninja Dojo
                  </span>
                </div>
              </div>

              {/* Description */}
              <p className="font-vi text-xs text-slate-300 leading-relaxed mb-3.5">
                Vung kiếm chém tan các thẻ gỗ từ vựng & Kanji N5 đang bay theo nghĩa tiếng Việt. Tự quan sát, né tránh bom hẹn giờ và duy trì chuỗi Combo cực đỉnh!
              </p>

              {/* Tags */}
              <div className="flex items-center gap-1.5 flex-wrap mb-4">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#1a0e22] text-amber-200 border border-[#4d2460]">
                  ⚡ Phản xạ thị giác
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#1a0e22] text-rose-200 border border-[#4d2460]">
                  🗡️ Chém từ & Kanji
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#1a0e22] text-emerald-200 border border-[#4d2460]">
                  📖 25 bài Minna
                </span>
              </div>
            </div>

            {/* Launch Button */}
            <button
              onClick={() => {
                soundFX.playSlash();
                onSelectGame('ninja');
              }}
              className="w-full py-2.5 sm:py-3 rounded-xl bg-gradient-to-r from-rose-600 via-pink-600 to-rose-700 hover:from-rose-500 hover:to-pink-600 text-white font-vi font-black text-xs sm:text-sm uppercase tracking-wider shadow-lg border-2 border-rose-300 flex items-center justify-center gap-2 transition-transform transform active:scale-95 cursor-pointer"
            >
              <Swords className="w-4 h-4" />
              <span>VÀO ĐẤU TRƯỜNG CHÉM CHỮ</span>
              <ArrowRight className="w-4 h-4 ml-0.5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Game 2: Bắt Cá Koi / Câu Chữ (Ready to play) */}
          <div className="group relative bg-[#1c1d36] border-2 border-[#3d4277] hover:border-sky-400/80 rounded-2xl p-4 sm:p-5 shadow-xl transition-all duration-200 hover:-translate-y-1 flex flex-col justify-between overflow-hidden">
            {/* Background subtle art glow */}
            <div className="absolute top-0 right-0 w-36 h-36 bg-sky-500/10 rounded-full blur-2xl group-hover:bg-sky-500/20 transition-all pointer-events-none" />

            <div>
              {/* Header tags & badge */}
              <div className="flex items-center justify-between mb-3">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-[10px] font-vi font-black text-emerald-300 uppercase tracking-wider flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  SẴN SÀNG CHƠI
                </span>

                <div className="flex items-center gap-1 bg-[#121325] px-2.5 py-0.5 rounded-full border border-sky-500/30 text-sky-200 text-[11px] font-vi font-black">
                  <Trophy className="w-3.5 h-3.5 text-amber-400" />
                  <span>Kỷ lục: {progress.fishingHighScore || 0} điểm</span>
                </div>
              </div>

              {/* Title & Icon */}
              <div className="flex items-center gap-3 mb-2.5">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-sky-500 to-blue-700 border-2 border-sky-300 flex items-center justify-center text-2xl shadow-lg shrink-0 group-hover:scale-105 transition-transform">
                  🎣
                </div>
                <div>
                  <h3 className="font-vi text-lg font-black text-white group-hover:text-sky-300 transition-colors uppercase tracking-wide">
                    Bắt Cá Koi N5
                  </h3>
                  <span className="text-[11px] text-sky-300 font-bold block">
                    N5 Pixel Audio Fishing
                  </span>
                </div>
              </div>

              {/* Description */}
              <p className="font-vi text-xs text-slate-300 leading-relaxed mb-3.5">
                Ngồi buông cần bên bờ hồ pixel thư giãn. Lắng nghe giọng phát âm tiếng Nhật bản xứ, căn đúng nhịp cá bơi qua phao câu để bấm giật cần kéo cá lên!
              </p>

              {/* Tags */}
              <div className="flex items-center gap-1.5 flex-wrap mb-4">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#121325] text-sky-200 border border-[#2d325a]">
                  🎧 Luyện nghe Choukai
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#121325] text-teal-200 border border-[#2d325a]">
                  🎏 Cá bơi theo mặt chữ
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#121325] text-amber-200 border border-[#2d325a]">
                  ☕ 25 Bài Minna
                </span>
              </div>
            </div>

            {/* Launch / Status Button */}
            <button
              onClick={() => {
                soundFX.playSplash();
                onSelectGame('fishing');
              }}
              className="w-full py-2.5 sm:py-3 rounded-xl bg-gradient-to-r from-teal-500 via-sky-600 to-blue-600 hover:from-teal-600 hover:to-blue-700 text-white font-vi font-black text-xs sm:text-sm uppercase tracking-wider shadow-lg border-2 border-sky-300 flex items-center justify-center gap-2 transition-transform transform active:scale-95 cursor-pointer"
            >
              <Fish className="w-4 h-4" />
              <span>BUÔNG CẦN CÂU CÁ NGAY ➜</span>
            </button>
          </div>

        </div>

        {/* Footer Info Banner */}
        <div className="px-5 sm:px-6 py-3.5 bg-[#170a1c] border-t border-[#4d2460] flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-300 font-vi">
          <div className="flex items-center gap-2 text-[11px] text-amber-200">
            <span>✨</span>
            <span>Mỗi trận mini-game đều tích lũy EXP tăng cấp nhân vật và nâng cao phản xạ tiếng Nhật N5 của bạn!</span>
          </div>

          <div className="text-[11px] text-slate-400">
            Kho dữ liệu chuẩn: <strong className="text-white">Minna no Nihongo (Bài 1 - 25)</strong>
          </div>
        </div>

      </div>
    </div>
  );
};
