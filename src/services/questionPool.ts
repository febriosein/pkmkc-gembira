import { DifficultyLevel, AgeBand } from '../types';

class QuestionPoolService {
  private getStorageKey(childId: string, category: string): string {
    return `gembira_seen_${childId}_${category}`;
  }

  public getSeenQuestionIds(childId: string, category: string): string[] {
    const raw = localStorage.getItem(this.getStorageKey(childId, category));
    if (!raw) return [];
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  }

  public markQuestionsSeen(childId: string, category: string, questionIds: string[]) {
    const seen = new Set(this.getSeenQuestionIds(childId, category));
    questionIds.forEach(id => seen.add(id));
    localStorage.setItem(this.getStorageKey(childId, category), JSON.stringify(Array.from(seen)));
  }

  public clearSeenHistory(childId: string, category: string) {
    localStorage.removeItem(this.getStorageKey(childId, category));
  }

  // Fisher-Yates array shuffle
  public shuffleArray<T>(array: T[]): T[] {
    const copy = [...array];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  // Anti-Repetition Selector
  public getFreshQuestions<T extends { id: string }>(
    allQuestions: T[],
    childId: string,
    category: string,
    count: number
  ): T[] {
    if (allQuestions.length === 0) return [];
    if (allQuestions.length <= count) return this.shuffleArray(allQuestions);

    const seenIds = new Set(this.getSeenQuestionIds(childId, category));
    let unseen = allQuestions.filter(q => !seenIds.has(q.id));

    // If unseen questions are exhausted or too few, reset history to cycle naturally
    if (unseen.length < count) {
      this.clearSeenHistory(childId, category);
      unseen = [...allQuestions];
    }

    const shuffled = this.shuffleArray(unseen);
    const selected = shuffled.slice(0, count);

    // Mark as seen
    this.markQuestionsSeen(childId, category, selected.map(q => q.id));

    return selected;
  }

  public mapAgeBandToDifficulty(ageBand: AgeBand): DifficultyLevel {
    switch (ageBand) {
      case 'paud':
        return 'mudah';
      case 'sd-fase-a':
        return 'sedang';
      case 'sd-fase-b':
      case 'sd-fase-c':
        return 'sulit';
      default:
        return 'mudah';
    }
  }

  public getDifficultyMultiplier(difficulty: DifficultyLevel): number {
    switch (difficulty) {
      case 'mudah': return 1;
      case 'sedang': return 1.5;
      case 'sulit': return 2;
      default: return 1;
    }
  }

  public getDifficultyLabel(difficulty: DifficultyLevel): { label: string; badge: string; color: string } {
    switch (difficulty) {
      case 'mudah':
        return { label: 'Tingkat Mudah (PAUD / 4–6 Thn)', badge: '🟢 Mudah', color: 'text-emerald-600 bg-emerald-50 border-emerald-200' };
      case 'sedang':
        return { label: 'Tingkat Sedang (SD Kelas 1–2 / 7–8 Thn)', badge: '🔵 Sedang', color: 'text-blue-600 bg-blue-50 border-blue-200' };
      case 'sulit':
        return { label: 'Tingkat Tantangan (SD Kelas 3–6 / 9–12 Thn)', badge: '🟣 Tantangan', color: 'text-purple-600 bg-purple-50 border-purple-200' };
    }
  }

  public getDifficultyInfo(difficulty: DifficultyLevel = 'mudah'): { label: string; badge: string; color: string } {
    return this.getDifficultyLabel(difficulty);
  }
}

export const questionPool = new QuestionPoolService();
