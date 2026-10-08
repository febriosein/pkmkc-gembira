import { storage } from './storage';
import { audio } from './audio';

export const GROWTH_MINDSET_QUOTES = [
  'Tidak apa-apa, sedikit lagi! Otakmu sedang bertumbuh lebih kuat! 🌱',
  'Hebat sudah berani mencoba! Yuk perhatikan lagi petunjuknya bersama sahabatmu! 💡',
  'Kesalahan adalah batu loncatan untuk belajar hal baru yang hebat! ✨',
  'Ayo tarik napas, tersenyum, dan coba lagi. Kamu pasti bisa! 🌟',
  'Setiap juara hebat pernah keliru, yang terpenting adalah semangat pantang menyerah! 🚀',
  'Belajar itu seru! Pelan-pelan saja, sahabatmu selalu menemanimu di sini! ❤️',
];

export class ScaffoldingService {
  // Evaluates whether adaptive scaffolding / hint should be activated
  public shouldTriggerScaffolding(consecutiveMistakes: number, responseTimeMs: number): boolean {
    return consecutiveMistakes >= 1 || responseTimeMs >= 10000;
  }

  // Returns a random Growth Mindset encouragement quote
  public getEncouragement(): string {
    const idx = Math.floor(Math.random() * GROWTH_MINDSET_QUOTES.length);
    return GROWTH_MINDSET_QUOTES[idx];
  }

  // Identifies incorrect option IDs to eliminate (50:50 help)
  public getEliminatedOptionIds<T extends { id: string; isCorrect?: boolean }>(
    options: T[],
    correctOptionId: string,
    countToEliminate: number = 1
  ): string[] {
    const incorrect = options.filter(opt => opt.id !== correctOptionId);
    if (incorrect.length <= 1) return [];

    // Shuffle and pick
    const shuffled = [...incorrect].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, countToEliminate).map(opt => opt.id);
  }

  // Awards effort-based encouragement coins (Carol Dweck praise of effort, not just perfection)
  public awardEffortReward(childId: string, reason: string = 'Usaha Pantang Menyerah!'): number {
    audio.playSnapMatch();
    return storage.recordCoinDelta(childId, 3, reason);
  }
}

export const scaffolding = new ScaffoldingService();
