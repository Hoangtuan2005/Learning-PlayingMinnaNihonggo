export interface VocabItem {
  id: string;
  kana: string;
  kanji?: string;
  meaning: string;
  type?: string;
  audioUrl?: string;
}

export interface KanjiItem {
  id: string;
  character: string;
  hanViet: string;
  onyomi: string[];
  kunyomi: string[];
  meaning: string;
  examples: { word: string; reading: string; meaning: string }[];
}

export interface GrammarItem {
  id: string;
  pattern: string;
  explanation: string;
  note?: string;
  examples: { jp: string; vi: string }[];
}

export interface LessonData {
  lessonNumber: number;
  titleJp: string;
  titleVi: string;
  vocabulary: VocabItem[];
  kanji: KanjiItem[];
  grammar: GrammarItem[];
}

export interface LessonIndexItem {
  id: number;
  lessonNumber: number;
  title_jp: string;
  title_vi: string;
  description?: string;
}

export interface UserProgress {
  masteredVocabIds: string[];
  masteredKanjiIds: string[];
  masteredGrammarIds: string[];
  masteredCompoundIds?: string[];
  completedLessons: number[];
  highScore: number;
  fishingHighScore?: number;
  streakDays: number;
  lastStudyDate: string;
  level: number;
  xp: number;
}
