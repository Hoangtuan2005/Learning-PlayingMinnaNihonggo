import { UserProgress, LessonData } from '../types/lesson';
import { soundFX } from './soundEffects';

const STORAGE_KEY = 'minna_n5_quest_progress_v1';

export function calculateLevel(xp: number): { level: number; currentLevelXp: number; nextLevelXp: number; progressPercent: number } {
  // Level curve: Level N requires N * 100 total XP
  // E.g. Level 1: 0-99, Level 2: 100-249, Level 3: 250-449, etc.
  let level = 1;
  let threshold = 100;
  let prevThreshold = 0;

  while (xp >= threshold) {
    level++;
    prevThreshold = threshold;
    threshold += level * 100;
  }

  const currentLevelXp = xp - prevThreshold;
  const nextLevelXp = threshold - prevThreshold;
  const progressPercent = Math.min(100, Math.round((currentLevelXp / nextLevelXp) * 100));

  return { level, currentLevelXp, nextLevelXp, progressPercent };
}

export function getInitialProgress(): UserProgress {
  const defaultProgress: UserProgress = {
    masteredVocabIds: [],
    masteredKanjiIds: [],
    masteredGrammarIds: [],
    masteredCompoundIds: [],
    completedLessons: [],
    highScore: 0,
    streakDays: 1,
    lastStudyDate: new Date().toISOString().split('T')[0],
    level: 1,
    xp: 0
  };

  if (typeof window === 'undefined') return defaultProgress;

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      saveProgress(defaultProgress);
      return defaultProgress;
    }

    const parsed: UserProgress = JSON.parse(raw);
    const today = new Date().toISOString().split('T')[0];

    // Check streak
    if (parsed.lastStudyDate) {
      const last = new Date(parsed.lastStudyDate);
      const curr = new Date(today);
      const diffDays = Math.floor((curr.getTime() - last.getTime()) / (1000 * 3600 * 24));

      if (diffDays === 1) {
        parsed.streakDays = (parsed.streakDays || 0) + 1;
        parsed.lastStudyDate = today;
      } else if (diffDays > 1) {
        parsed.streakDays = 1;
        parsed.lastStudyDate = today;
      }
    } else {
      parsed.lastStudyDate = today;
      parsed.streakDays = 1;
    }

    // Recalculate level based on XP
    const { level } = calculateLevel(parsed.xp || 0);
    parsed.level = level;

    return parsed;
  } catch {
    return defaultProgress;
  }
}

export function saveProgress(progress: UserProgress): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (e) {
    console.error("Failed to save progress to localStorage", e);
  }
}

export function toggleItemMastery(
  progress: UserProgress,
  type: 'vocab' | 'kanji' | 'grammar' | 'compound',
  id: string
): { updatedProgress: UserProgress; isMastered: boolean; leveledUp: boolean } {
  const currentKey: keyof UserProgress = type === 'vocab' 
    ? 'masteredVocabIds' 
    : type === 'kanji' 
      ? 'masteredKanjiIds' 
      : type === 'grammar'
        ? 'masteredGrammarIds'
        : 'masteredCompoundIds';

  const list = [...((progress[currentKey] as string[]) || [])];
  const existsIndex = list.indexOf(id);
  let isMastered = false;
  let xpDiff = 0;

  const xpReward = type === 'vocab' ? 10 : type === 'kanji' ? 15 : type === 'compound' ? 15 : 20;

  if (existsIndex >= 0) {
    // Unmaster
    list.splice(existsIndex, 1);
    isMastered = false;
    xpDiff = -xpReward;
  } else {
    // Master
    list.push(id);
    isMastered = true;
    xpDiff = xpReward;
    soundFX.playMastered();
  }

  const oldLevel = progress.level;
  const newXp = Math.max(0, (progress.xp || 0) + xpDiff);
  const { level: newLevel } = calculateLevel(newXp);
  const leveledUp = newLevel > oldLevel;

  if (leveledUp) {
    setTimeout(() => soundFX.playLevelUp(), 300);
  }

  const updatedProgress: UserProgress = {
    ...progress,
    [currentKey]: list,
    xp: newXp,
    level: newLevel,
    lastStudyDate: new Date().toISOString().split('T')[0]
  };

  saveProgress(updatedProgress);
  return { updatedProgress, isMastered, leveledUp };
}

export function addGameScore(progress: UserProgress, score: number): { updatedProgress: UserProgress; isNewHigh: boolean } {
  const isNewHigh = score > (progress.highScore || 0);
  const newHigh = Math.max(progress.highScore || 0, score);
  // Award 1 XP per 2 game points scored
  const earnedXp = Math.floor(score / 2);
  const newXp = (progress.xp || 0) + earnedXp;
  const { level } = calculateLevel(newXp);

  const updated: UserProgress = {
    ...progress,
    highScore: newHigh,
    xp: newXp,
    level
  };

  saveProgress(updated);
  return { updatedProgress: updated, isNewHigh };
}

export function addFishingGameScore(progress: UserProgress, score: number): { updatedProgress: UserProgress; isNewHigh: boolean } {
  const currentHigh = progress.fishingHighScore || 0;
  const isNewHigh = score > currentHigh;
  const newHigh = Math.max(currentHigh, score);
  const earnedXp = Math.floor(score / 2);
  const newXp = (progress.xp || 0) + earnedXp;
  const { level } = calculateLevel(newXp);

  const updated: UserProgress = {
    ...progress,
    fishingHighScore: newHigh,
    xp: newXp,
    level,
  };

  saveProgress(updated);
  return { updatedProgress: updated, isNewHigh };
}

// Calculate completion of a lesson
export function getLessonCompletion(lessonData: LessonData, progress: UserProgress): {
  vocabCompleted: number;
  vocabTotal: number;
  kanjiCompleted: number;
  kanjiTotal: number;
  grammarCompleted: number;
  grammarTotal: number;
  percentage: number;
  stars: number;
} {
  const vocabTotal = lessonData.vocabulary.length;
  const kanjiTotal = lessonData.kanji.length;
  const grammarTotal = lessonData.grammar.length;
  const total = vocabTotal + kanjiTotal + grammarTotal;

  if (total === 0) {
    return {
      vocabCompleted: 0, vocabTotal: 0,
      kanjiCompleted: 0, kanjiTotal: 0,
      grammarCompleted: 0, grammarTotal: 0,
      percentage: 0, stars: 0
    };
  }

  const vocabCompleted = lessonData.vocabulary.filter(v => progress.masteredVocabIds.includes(v.id)).length;
  const kanjiCompleted = lessonData.kanji.filter(k => progress.masteredKanjiIds.includes(k.id)).length;
  const grammarCompleted = lessonData.grammar.filter(g => progress.masteredGrammarIds.includes(g.id)).length;
  const completed = vocabCompleted + kanjiCompleted + grammarCompleted;

  const percentage = Math.round((completed / total) * 100);
  let stars = 0;
  if (percentage >= 100) stars = 3;
  else if (percentage >= 65) stars = 2;
  else if (percentage >= 30) stars = 1;

  return {
    vocabCompleted,
    vocabTotal,
    kanjiCompleted,
    kanjiTotal,
    grammarCompleted,
    grammarTotal,
    percentage,
    stars
  };
}
