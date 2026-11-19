import { LessonData } from '../../types/lesson';
import { LESSONS_INDEX } from '../lessonsIndex';
import lesson01 from './lesson_01.json';
import lesson02 from './lesson_02.json';
import lesson03 from './lesson_03.json';
import lesson04 from './lesson_04.json';
import lesson05 from './lesson_05.json';
import lesson06 from './lesson_06.json';
import lesson07 from './lesson_07.json';
import lesson08 from './lesson_08.json';
import lesson09 from './lesson_09.json';
import lesson10 from './lesson_10.json';
import lesson11 from './lesson_11.json';
import lesson12 from './lesson_12.json';
import lesson13 from './lesson_13.json';
import lesson14 from './lesson_14.json';
import lesson15 from './lesson_15.json';
import lesson16 from './lesson_16.json';
import lesson17 from './lesson_17.json';
import lesson18 from './lesson_18.json';
import lesson19 from './lesson_19.json';
import lesson20 from './lesson_20.json';
import lesson21 from './lesson_21.json';
import lesson22 from './lesson_22.json';
import lesson23 from './lesson_23.json';
import lesson24 from './lesson_24.json';
import lesson25 from './lesson_25.json';

// Re-export helper from storage for convenience
export { getLessonCompletion } from '../../utils/storage';

export const lesson00: LessonData = {
  lessonNumber: 0,
  titleJp: "ひらがな & カタカナ",
  titleVi: "Bài 0: Bảng chữ cái Hiragana & Katakana",
  vocabulary: [],
  kanji: [],
  grammar: []
};

// All lessons 0 to 25 registered
const loadedLessons: Record<number, LessonData> = {
  0: lesson00,
  1: lesson01 as LessonData,
  2: lesson02 as LessonData,
  3: lesson03 as LessonData,
  4: lesson04 as LessonData,
  5: lesson05 as LessonData,
  6: lesson06 as LessonData,
  7: lesson07 as LessonData,
  8: lesson08 as LessonData,
  9: lesson09 as LessonData,
  10: lesson10 as LessonData,
  11: lesson11 as LessonData,
  12: lesson12 as LessonData,
  13: lesson13 as LessonData,
  14: lesson14 as LessonData,
  15: lesson15 as LessonData,
  16: lesson16 as LessonData,
  17: lesson17 as LessonData,
  18: lesson18 as LessonData,
  19: lesson19 as LessonData,
  20: lesson20 as LessonData,
  21: lesson21 as LessonData,
  22: lesson22 as LessonData,
  23: lesson23 as LessonData,
  24: lesson24 as LessonData,
  25: lesson25 as LessonData,
};

// Get lesson data by lesson number
export function getLessonData(lessonNumber: number): LessonData {
  if (loadedLessons[lessonNumber]) {
    return loadedLessons[lessonNumber];
  }

  const indexMeta = LESSONS_INDEX.find(l => l.lessonNumber === lessonNumber);
  const titleJp = indexMeta ? indexMeta.title_jp : `第${lessonNumber}課`;
  const titleVi = indexMeta ? indexMeta.title_vi : `Bài ${lessonNumber}`;

  return {
    lessonNumber,
    titleJp,
    titleVi,
    vocabulary: [],
    kanji: [],
    grammar: []
  };
}

// Get aggregate vocabulary and kanji across a range of lessons (e.g., Lessons 1 to 5 for mini-game)
export function getLessonsRangeData(startLesson: number, endLesson: number): {
  vocabulary: LessonData['vocabulary'];
  kanji: LessonData['kanji'];
} {
  const min = Math.min(startLesson, endLesson);
  const max = Math.max(startLesson, endLesson);

  const vocabulary: LessonData['vocabulary'] = [];
  const kanji: LessonData['kanji'] = [];

  for (let num = min; num <= max; num++) {
    const data = getLessonData(num);
    vocabulary.push(...data.vocabulary);
    kanji.push(...data.kanji);
  }

  return { vocabulary, kanji };
}
