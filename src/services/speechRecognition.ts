// Web Speech Recognition Engine for Indonesian Language (PKM-KC Voice Challenge)

export interface VoiceRecognitionResult {
  transcript: string;
  isMatch: boolean;
  targetWord: string;
  similarity: number; // 0 to 1
}

export class SpeechRecognitionService {
  private recognition: any = null;
  private isListening: boolean = false;

  public isSupported(): boolean {
    if (typeof window === 'undefined') return false;
    return Boolean(
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    );
  }

  // Normalize Indonesian text (remove punctuation, lowercasing, trims)
  public normalizeText(text: string): string {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9\s]/gi, '')
      .trim();
  }

  // Calculate similarity between child spoken word and target word (fuzzy matching for young kids)
  public calculateSimilarity(spoken: string, target: string): number {
    const s = this.normalizeText(spoken);
    const t = this.normalizeText(target);

    if (s === t) return 1.0;
    if (s.includes(t) || t.includes(s)) return 0.85;

    // Simple Levenshtein distance
    const track = Array(t.length + 1)
      .fill(null)
      .map(() => Array(s.length + 1).fill(null));

    for (let i = 0; i <= s.length; i += 1) track[0][i] = i;
    for (let j = 0; j <= t.length; j += 1) track[j][0] = j;

    for (let j = 1; j <= t.length; j += 1) {
      for (let i = 1; i <= s.length; i += 1) {
        const indicator = s[i - 1] === t[j - 1] ? 0 : 1;
        track[j][i] = Math.min(
          track[j][i - 1] + 1, // deletion
          track[j - 1][i] + 1, // insertion
          track[j - 1][i - 1] + indicator // substitution
        );
      }
    }

    const distance = track[t.length][s.length];
    const maxLength = Math.max(s.length, t.length);
    if (maxLength === 0) return 1.0;
    return Math.max(0, 1 - distance / maxLength);
  }

  // Check if spoken words match any accepted target words (similarity >= 0.65 threshold)
  public checkMatch(spoken: string, acceptedWords: string[]): { isMatch: boolean; matchedWord: string; similarity: number } {
    let bestMatch = { isMatch: false, matchedWord: acceptedWords[0] || '', similarity: 0 };

    for (const target of acceptedWords) {
      const similarity = this.calculateSimilarity(spoken, target);
      if (similarity > bestMatch.similarity) {
        bestMatch = {
          isMatch: similarity >= 0.65,
          matchedWord: target,
          similarity,
        };
      }
    }

    return bestMatch;
  }

  // Start listening to the microphone for Indonesian speech
  public startListening(
    acceptedWords: string[],
    onResult: (result: VoiceRecognitionResult) => void,
    onError: (errorMessage: string) => void,
    onEnd?: () => void
  ): () => void {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      onError('Browser belum mendukung mikrofon otomatis. Kamu bisa menggunakan mode simulasi suara!');
      return () => {};
    }

    try {
      if (this.recognition) {
        this.recognition.abort();
      }

      this.recognition = new SpeechRecognition();
      this.recognition.lang = 'id-ID';
      this.recognition.continuous = false;
      this.recognition.interimResults = false;
      this.recognition.maxAlternatives = 3;

      this.recognition.onstart = () => {
        this.isListening = true;
      };

      this.recognition.onresult = (event: any) => {
        const results = event.results;
        if (!results || results.length === 0) return;

        let bestResult: VoiceRecognitionResult = {
          transcript: '',
          isMatch: false,
          targetWord: acceptedWords[0] || '',
          similarity: 0,
        };

        // Check top alternatives
        for (let i = 0; i < results[0].length; i++) {
          const transcript = results[0][i].transcript;
          const matchCheck = this.checkMatch(transcript, acceptedWords);

          if (matchCheck.similarity > bestResult.similarity) {
            bestResult = {
              transcript,
              isMatch: matchCheck.isMatch,
              targetWord: matchCheck.matchedWord,
              similarity: matchCheck.similarity,
            };
          }
        }

        onResult(bestResult);
      };

      this.recognition.onerror = (event: any) => {
        this.isListening = false;
        let msg = 'Gagal mendengar suara. Yuk coba lagi!';
        if (event.error === 'not-allowed') {
          msg = 'Izin mikrofon belum diberikan. Silakan izinkan akses mikrofon di browser.';
        } else if (event.error === 'no-speech') {
          msg = 'Belum terdengar suara. Bicaralah lebih dekat ke mikrofon!';
        }
        onError(msg);
      };

      this.recognition.onend = () => {
        this.isListening = false;
        if (onEnd) onEnd();
      };

      this.recognition.start();

      return () => {
        if (this.recognition) {
          try {
            this.recognition.abort();
          } catch {
            // ignore
          }
          this.isListening = false;
        }
      };
    } catch (e: any) {
      onError('Terjadi kendala saat menyalakan mikrofon.');
      return () => {};
    }
  }

  public stopListening() {
    if (this.recognition && this.isListening) {
      try {
        this.recognition.abort();
      } catch {
        // ignore
      }
      this.isListening = false;
    }
  }
}

export const speechRecognition = new SpeechRecognitionService();
