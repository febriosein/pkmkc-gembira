import { DifficultyLevel } from '../types';

export interface MathQuestion {
  id: string;
  expression: string;
  num1: number;
  num2: number;
  operator: '+' | '-' | '×';
  correctAnswer: number;
  options: number[];
  speechText: string;
}

const BALLOON_COLORS = [
  { bg: 'bg-[#FF6B8B]', border: 'border-[#e05372]', text: 'text-white' }, // gempink
  { bg: 'bg-[#118AB2]', border: 'border-[#0c6b8c]', text: 'text-white' }, // gemblue
  { bg: 'bg-[#06D6A0]', border: 'border-[#04ab80]', text: 'text-white' }, // gemgreen
  { bg: 'bg-[#FFD166]', border: 'border-[#d4a843]', text: 'text-gemdark' }, // gemyellow
  { bg: 'bg-[#8338EC]', border: 'border-[#6622c7]', text: 'text-white' }, // gempurple
  { bg: 'bg-[#FB8500]', border: 'border-[#c76900]', text: 'text-white' }, // gemorange
];

export function getBalloonColor(index: number) {
  return BALLOON_COLORS[index % BALLOON_COLORS.length];
}

export function generateMathQuestion(difficulty: DifficultyLevel = 'mudah'): MathQuestion {
  let num1 = 1;
  let num2 = 1;
  let operator: '+' | '-' | '×' = '+';
  let correctAnswer = 2;
  let speechText = '';

  if (difficulty === 'mudah') {
    // Penjumlahan sederhana 1-5 (total max 10)
    num1 = Math.floor(Math.random() * 5) + 1;
    num2 = Math.floor(Math.random() * 5) + 1;
    operator = '+';
    correctAnswer = num1 + num2;
    speechText = `Berapa ${num1} ditambah ${num2}?`;
  } else if (difficulty === 'sedang') {
    // Penjumlahan & Pengurangan 1-25
    const isSub = Math.random() > 0.5;
    if (isSub) {
      num1 = Math.floor(Math.random() * 12) + 8;
      num2 = Math.floor(Math.random() * 7) + 1;
      operator = '-';
      correctAnswer = num1 - num2;
      speechText = `Berapa ${num1} dikurang ${num2}?`;
    } else {
      num1 = Math.floor(Math.random() * 12) + 3;
      num2 = Math.floor(Math.random() * 10) + 3;
      operator = '+';
      correctAnswer = num1 + num2;
      speechText = `Berapa ${num1} ditambah ${num2}?`;
    }
  } else {
    // SD Fase B & C: Termasuk perkalian dasar
    const rand = Math.random();
    if (rand < 0.4) {
      // Perkalian dasar 2 - 9
      num1 = Math.floor(Math.random() * 7) + 2;
      num2 = Math.floor(Math.random() * 6) + 2;
      operator = '×';
      correctAnswer = num1 * num2;
      speechText = `Berapa ${num1} dikali ${num2}?`;
    } else if (rand < 0.7) {
      num1 = Math.floor(Math.random() * 20) + 10;
      num2 = Math.floor(Math.random() * 15) + 5;
      operator = '-';
      correctAnswer = num1 - num2;
      speechText = `Berapa ${num1} dikurang ${num2}?`;
    } else {
      num1 = Math.floor(Math.random() * 25) + 10;
      num2 = Math.floor(Math.random() * 25) + 10;
      operator = '+';
      correctAnswer = num1 + num2;
      speechText = `Berapa ${num1} ditambah ${num2}?`;
    }
  }

  // Generate 3 unique distractors close to answer
  const distractors = new Set<number>();
  while (distractors.size < 3) {
    const delta = (Math.random() > 0.5 ? 1 : -1) * (Math.floor(Math.random() * 3) + 1);
    const candidate = correctAnswer + delta;
    if (candidate > 0 && candidate !== correctAnswer) {
      distractors.add(candidate);
    }
  }

  // Combine and shuffle options
  const options = Array.from(distractors);
  const insertIndex = Math.floor(Math.random() * 4);
  options.splice(insertIndex, 0, correctAnswer);

  return {
    id: 'math-' + Date.now() + '-' + Math.random().toString(36).substring(2, 5),
    expression: `${num1} ${operator} ${num2}`,
    num1,
    num2,
    operator,
    correctAnswer,
    options,
    speechText,
  };
}
