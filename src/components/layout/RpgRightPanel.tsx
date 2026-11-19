import React from 'react';
import { UserProgress, LessonData } from '../../types/lesson';
import { calculateLevel, getLessonCompletion } from '../../utils/storage';
import { Trophy, Flame, Sparkles, BookOpen, ScrollText, Lightbulb, Shield, Award } from 'lucide-react';

interface RpgRightPanelProps {
  progress: UserProgress;
  lessonData: LessonData;
  currentLesson: number;
}

export const RpgRightPanel: React.FC<RpgRightPanelProps> = ({
  progress,
  lessonData,
  currentLesson,
}) => {
  const { level, currentLevelXp, nextLevelXp, progressPercent } = calculateLevel(progress.xp);
  const completion = getLessonCompletion(lessonData, progress);

  // Dynamic RPG Title based on level
  let rankTitle = 'Tân binh N5';
  let rankIcon = '🍃';
  if (level >= 10) {
    rankTitle = 'Đại Tông Sư Minna';
    rankIcon = '👑';
  } else if (level >= 6) {
    rankTitle = 'Ninja Kanji Tinh anh';
    rankIcon = '⛩️';
  } else if (level >= 3) {
    rankTitle = 'Kiếm sĩ N5 Tập sự';
    rankIcon = '⚔️';
  }

  // Quick N5 Tips list that rotates or picks based on current lesson
  const n5Tips = [
    {
      title: "Trợ từ は (wa) & を (o)",
      content: "Chữ は làm trợ từ chủ đề luôn đọc là [wa]. Chữ を làm trợ từ tân ngữ luôn đọc là [o]."
    },
    {
      title: "Phân biệt います & あります",
      content: "Dùng「います」cho sinh vật chuyển động (người, động vật). Dùng「あります」cho đồ vật vô tri và cây cối."
    },
    {
      title: "Mẹo chia thể て (Te-form)",
      content: "い、ち、り biến thành って (Ví dụ: まちます ➔ まって). み、び、に biến thành んで (Ví dụ: のみます ➔ のんで)."
    },
    {
      title: "Xưng hô lịch sự",
      content: "Tuyệt đối không thêm 〜さん sau tên của chính mình. Khi nói chuyện trực tiếp, gọi [Tên + さん] thay vì dùng あなた."
    }
  ];

  const kanaTip = {
    title: "Khởi đầu bảng chữ cái",
    content: "Hãy học chắc 46 chữ cái Hiragana cơ bản trước, sau đó luyện Katakana để đọc các từ mượn tiếng nước ngoài!"
  };

  const currentTip = currentLesson === 0
    ? kanaTip
    : n5Tips[Math.abs(currentLesson - 1) % n5Tips.length];

  return (
    <aside className="hidden xl:flex flex-col w-72 2xl:w-80 h-[calc(100vh-69px)] sticky top-[69px] border-l-4 border-retro-charcoal bg-[#FAF3E0] p-4 overflow-y-auto space-y-4 shrink-0 select-none">
      
      {/* 1. Character Hero Card */}
      <div className="pixel-box p-3.5 bg-[#FFFDF7]">
        <div className="flex items-center gap-3 mb-3 border-b-2 border-retro-charcoal pb-2.5">
          <div className="w-12 h-12 bg-gradient-to-br from-amber-200 to-amber-400 border-2 border-retro-charcoal shadow-pixel-sm flex items-center justify-center text-2xl">
            {rankIcon}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-pixel text-[10px] px-1.5 py-0.5 bg-sakura text-white border border-retro-charcoal font-bold">
                LV.{level}
              </span>
              <span className="font-vi text-xs font-black text-retro-charcoal truncate">
                {rankTitle}
              </span>
            </div>
            <div className="text-[11px] font-vi text-slate-500 font-medium mt-0.5">
              Hiệp sĩ tiếng Nhật N5
            </div>
          </div>
        </div>

        {/* EXP Bar */}
        <div className="space-y-1 mb-2.5">
          <div className="flex justify-between items-center text-[10px] font-pixel text-slate-600">
            <span>KINH NGHIỆM</span>
            <span>{currentLevelXp} / {nextLevelXp} XP</span>
          </div>
          <div className="w-full h-2.5 bg-slate-200 border-2 border-retro-charcoal overflow-hidden p-0.5">
            <div
              className="h-full bg-gradient-to-r from-matcha to-matcha-light transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Mini stats badges */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-1.5 bg-parchment border border-retro-charcoal flex items-center gap-1.5">
            <Flame className="w-4 h-4 text-orange-500 fill-orange-400" />
            <span className="font-vi font-bold text-retro-charcoal text-[11px]">{progress.streakDays || 1} ngày chuỗi</span>
          </div>
          <div className="p-1.5 bg-parchment border border-retro-charcoal flex items-center gap-1.5">
            <Trophy className="w-4 h-4 text-coin fill-coin" />
            <span className="font-vi font-bold text-retro-charcoal text-[11px]">{progress.highScore || 0} điểm</span>
          </div>
        </div>
      </div>

      {/* 2. Quest Status for Current Lesson */}
      <div className="pixel-box p-3.5 bg-[#FFFDF7] space-y-2.5">
        <div className="flex items-center justify-between border-b-2 border-retro-charcoal pb-2">
          <div className="flex items-center gap-1.5">
            <Shield className="w-4 h-4 text-sakura-dark" />
            <span className="font-vi text-xs font-black uppercase tracking-wider text-retro-charcoal">
              {currentLesson === 0 ? 'BÀI 0: NHẬP MÔN KANA' : `TIẾN ĐỘ BÀI ${currentLesson}`}
            </span>
          </div>
          <span className="font-vi text-xs font-black text-sakura-dark">
            {currentLesson === 0 ? '104 ÂM' : `${completion.percentage}%`}
          </span>
        </div>

        {/* Progress Breakdown */}
        {currentLesson === 0 ? (
          <div className="space-y-2 text-xs font-vi">
            <div>
              <div className="flex justify-between items-center text-[11px] mb-0.5 font-bold text-slate-700">
                <span className="flex items-center gap-1">🌸 Hiragana (Chữ mềm)</span>
                <span>104 ký tự</span>
              </div>
              <div className="w-full h-1.5 bg-slate-200 border border-retro-charcoal overflow-hidden">
                <div className="h-full bg-rose-500 w-full" />
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center text-[11px] mb-0.5 font-bold text-slate-700">
                <span className="flex items-center gap-1">⚡ Katakana (Chữ cứng)</span>
                <span>104 ký tự</span>
              </div>
              <div className="w-full h-1.5 bg-slate-200 border border-retro-charcoal overflow-hidden">
                <div className="h-full bg-amber-500 w-full" />
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-2 text-xs font-vi">
            {/* Vocab */}
            <div>
              <div className="flex justify-between items-center text-[11px] mb-0.5 font-bold text-slate-700">
                <span className="flex items-center gap-1">
                  <BookOpen className="w-3.5 h-3.5 text-sakura" /> Từ vựng
                </span>
                <span>{completion.vocabCompleted} / {completion.vocabTotal}</span>
              </div>
              <div className="w-full h-1.5 bg-slate-200 border border-retro-charcoal overflow-hidden">
                <div
                  className="h-full bg-sakura"
                  style={{ width: `${completion.vocabTotal > 0 ? (completion.vocabCompleted / completion.vocabTotal) * 100 : 0}%` }}
                />
              </div>
            </div>

            {/* Kanji */}
            <div>
              <div className="flex justify-between items-center text-[11px] mb-0.5 font-bold text-slate-700">
                <span className="flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-matcha" /> Chữ Hán
                </span>
                <span>{completion.kanjiCompleted} / {completion.kanjiTotal}</span>
              </div>
              <div className="w-full h-1.5 bg-slate-200 border border-retro-charcoal overflow-hidden">
                <div
                  className="h-full bg-matcha"
                  style={{ width: `${completion.kanjiTotal > 0 ? (completion.kanjiCompleted / completion.kanjiTotal) * 100 : 0}%` }}
                />
              </div>
            </div>

            {/* Grammar */}
            <div>
              <div className="flex justify-between items-center text-[11px] mb-0.5 font-bold text-slate-700">
                <span className="flex items-center gap-1">
                  <ScrollText className="w-3.5 h-3.5 text-amber-700" /> Ngữ pháp
                </span>
                <span>{completion.grammarCompleted} / {completion.grammarTotal}</span>
              </div>
              <div className="w-full h-1.5 bg-slate-200 border border-retro-charcoal overflow-hidden">
                <div
                  className="h-full bg-coin"
                  style={{ width: `${completion.grammarTotal > 0 ? (completion.grammarCompleted / completion.grammarTotal) * 100 : 0}%` }}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 3. Pro Tip Scroll */}
      <div className="pixel-box-parchment p-3 bg-amber-50 border-2 border-retro-charcoal space-y-1">
        <div className="flex items-center gap-1.5 text-amber-900 font-vi text-xs font-black uppercase tracking-wide">
          <Lightbulb className="w-4 h-4 text-amber-600" />
          <span>MẸO NHỚ N5:</span>
        </div>
        <div className="font-vi text-[11px] font-bold text-retro-charcoal">
          {currentTip.title}
        </div>
        <p className="text-[11px] font-vi text-slate-700 leading-relaxed font-normal">
          {currentTip.content}
        </p>
      </div>

      {/* Footer RPG Note */}
      <div className="text-center text-[10px] font-retro text-slate-400 pt-1 flex items-center justify-center gap-1">
        <Award className="w-3 h-3 text-coin" />
        <span>Minna Quest v1.0 • RPG Japanese</span>
      </div>

    </aside>
  );
};
