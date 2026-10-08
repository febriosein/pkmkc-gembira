import { useState, useEffect, useRef } from 'react';
import { Volume2, X, Sparkles, HelpCircle, CheckCircle } from 'lucide-react';
import { ChildProfile, DifficultyLevel } from '../types';
import { WORD_BANK, WordItem } from '../data/wordQuestions';
import { storage } from '../services/storage';
import { audio } from '../services/audio';
import { questionPool } from '../services/questionPool';
import { ResultSummaryModal } from '../components/game/ResultSummaryModal';

interface TebakKataGameProps {
  child: ChildProfile;
  difficulty?: DifficultyLevel;
  onExit: () => void;
  onCoinsUpdated: (newCoins: number) => void;
}

export const TebakKataGame: React.FC<TebakKataGameProps> = ({
  child,
  difficulty = 'mudah',
  onExit,
  onCoinsUpdated,
}) => {
  const getCandidateWords = (): WordItem[] => {
    let pool = WORD_BANK;
    if (difficulty === 'mudah') {
      pool = WORD_BANK.filter(w => w.word.length <= 4);
    } else if (difficulty === 'sedang') {
      pool = WORD_BANK.filter(w => w.word.length >= 5 && w.word.length <= 6);
    } else {
      pool = WORD_BANK.filter(w => w.word.length >= 7);
    }
    if (pool.length < 6) pool = WORD_BANK;
    return questionPool.getFreshQuestions(pool, child.id, `kata_${difficulty}`, 6);
  };

  // Select 6 fresh words for this session
  const [sessionWords, setSessionWords] = useState<WordItem[]>(() => getCandidateWords());
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [missingIndex, setMissingIndex] = useState<number>(0);
  const [letterOptions, setLetterOptions] = useState<string[]>([]);
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);
  const [isCorrectFeedback, setIsCorrectFeedback] = useState<boolean | null>(null);
  const [score, setScore] = useState<number>(0);
  const [correctCount, setCorrectCount] = useState<number>(0);
  const [coinsEarned, setCoinsEarned] = useState<number>(0);
  const [sessionId] = useState<string>(() => 'sess-kata-' + Date.now());
  const [isFinished, setIsFinished] = useState<boolean>(false);

  const questionStartTimeRef = useRef<number>(Date.now());
  const currentWord = sessionWords[currentIndex];

  // Setup current word missing letter and choices
  useEffect(() => {
    if (!currentWord) return;

    // Pick missing letter index
    const len = currentWord.word.length;
    const missing = Math.floor(Math.random() * len);
    setMissingIndex(missing);

    const targetLetter = currentWord.word[missing];

    // Generate 3 distractors
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    const distractors = new Set<string>();
    while (distractors.size < 3) {
      const char = alphabet[Math.floor(Math.random() * alphabet.length)];
      if (char !== targetLetter) {
        distractors.add(char);
      }
    }

    const options = Array.from(distractors);
    options.splice(Math.floor(Math.random() * 4), 0, targetLetter);
    setLetterOptions(options);
    setSelectedLetter(null);
    setIsCorrectFeedback(null);
    questionStartTimeRef.current = Date.now();

    // Narrate word clue in Indonesian
    audio.speak(`Tebak kata: ${currentWord.clue}. Huruf apa yang hilang?`);

    return () => {
      audio.stopSpeech();
    };
  }, [currentIndex, currentWord]);

  const multiplier = questionPool.getDifficultyMultiplier(difficulty);
  const diffInfo = questionPool.getDifficultyInfo(difficulty);

  const handleSelectLetter = (letter: string) => {
    if (selectedLetter !== null || isFinished) return;

    // Phonetic speech feedback for letter
    audio.speak(letter);

    const responseMs = Date.now() - questionStartTimeRef.current;
    const targetLetter = currentWord.word[missingIndex];
    const isCorrect = letter === targetLetter;

    setSelectedLetter(letter);

    // Record attempt for Parent Diagnostic Engine
    storage.recordAttempt({
      sessionId,
      childId: child.id,
      questionId: currentWord.id,
      domain: 'literasi',
      userAnswer: letter,
      isCorrect,
      responseMs,
      clientEventId: 'evt-' + Date.now() + '-' + letter,
    });

    if (isCorrect) {
      setIsCorrectFeedback(true);
      audio.playSuccess();
      setScore(prev => prev + 15);
      setCorrectCount(prev => prev + 1);

      // Award coins scaled by difficulty multiplier
      const baseCoins = 10;
      const coinReward = Math.round(baseCoins * multiplier);
      if (storage.canRewardQuestion(sessionId, currentWord.id)) {
        const newBalance = storage.recordCoinDelta(child.id, coinReward, `Tebak Kata (${diffInfo.label}): Jawaban Benar`, sessionId);
        setCoinsEarned(prev => prev + coinReward);
        onCoinsUpdated(newBalance);
      }

      // Voice pronounce the full word with celebration
      setTimeout(() => {
        audio.speak(`${currentWord.word}! Hebat sekali!`);
      }, 350);

      // Advance to next word
      setTimeout(() => {
        if (currentIndex + 1 >= sessionWords.length) {
          finishSession();
        } else {
          setCurrentIndex(prev => prev + 1);
        }
      }, 1600);
    } else {
      setIsCorrectFeedback(false);
      audio.playGentleBoing();
      setTimeout(() => {
        setSelectedLetter(null);
        setIsCorrectFeedback(null);
      }, 800);
    }
  };

  const finishSession = () => {
    setIsFinished(true);
    // Completion bonus (+30 coins scaled by multiplier per PRD FR-COIN-02)
    const completionBonus = Math.round(30 * multiplier);
    const newBalance = storage.recordCoinDelta(child.id, completionBonus, `Bonus Selesai Tebak Kata (${diffInfo.label})`, sessionId);
    setCoinsEarned(prev => prev + completionBonus);
    onCoinsUpdated(newBalance);

    const accuracy = sessionWords.length > 0 ? (correctCount / sessionWords.length) : 0;
    let stars = 1;
    if (accuracy >= 0.8) stars = 3;
    else if (accuracy >= 0.6) stars = 2;

    storage.recordCompletedSession({
      childId: child.id,
      gameId: 'tebak-kata',
      domain: 'literasi',
      startedAt: new Date(Date.now() - 40000).toISOString(),
      score,
      stars,
      coinsEarned: coinsEarned + completionBonus,
      totalQuestions: sessionWords.length,
      correctCount,
    });
  };

  const handlePlayAgain = () => {
    const nextWords = getCandidateWords();
    setSessionWords(nextWords);
    setCurrentIndex(0);
    setScore(0);
    setCorrectCount(0);
    setCoinsEarned(0);
    setIsFinished(false);
  };

  if (!currentWord) return null;

  return (
    <div className="max-w-4xl mx-auto w-full flex-1 flex flex-col justify-between py-2">
      {/* Header Bar */}
      <div className="bg-white/95 rounded-3xl p-4 border-2 border-gemblue/30 shadow-md flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              audio.playClick();
              onExit();
            }}
            className="w-9 h-9 rounded-2xl bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center transition-colors"
            title="Keluar"
          >
            <X className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-black text-sm sm:text-base text-gemdark flex items-center gap-1.5">
                <span>🔤 Susun Kata Nusantara Deluxe</span>
              </h3>
              <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${diffInfo.badge}`}>
                {diffInfo.label} • ×{multiplier}
              </span>
            </div>
            <span className="text-[10px] text-gray-500 font-bold">
              Kata {currentIndex + 1} dari {sessionWords.length} • {currentWord.category}
            </span>
          </div>
        </div>

        <div className="bg-amber-50 text-amber-900 border border-amber-200 px-3.5 py-1.5 rounded-2xl font-black text-xs flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" /> {score} Poin
        </div>
      </div>

      {/* Main Game Card */}
      <div className="flex-1 bg-gradient-to-b from-sky-50 via-indigo-50/40 to-purple-50 rounded-3xl border-4 border-white shadow-xl p-6 sm:p-8 flex flex-col items-center justify-between text-center relative">
        {/* Top clue badge with speaker */}
        <div className="flex items-center gap-2 bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl border-2 border-indigo-100 shadow-sm">
          <span className="text-xs font-bold text-gray-700">{currentWord.clue}</span>
          <button
            onClick={() => audio.speak(`Petunjuk: ${currentWord.clue}`)}
            className="p-1 rounded-full bg-indigo-50 hover:bg-indigo-100 text-gemblue transition-colors"
            title="Dengarkan Petunjuk"
          >
            <Volume2 className="w-4 h-4" />
          </button>
        </div>

        {/* Word Illustration Avatar */}
        <div className="my-4">
          <div className="w-24 h-24 sm:w-28 sm:h-28 bg-white rounded-3xl border-4 border-purple-200 flex items-center justify-center text-6xl sm:text-7xl shadow-lg mx-auto animate-float">
            {currentWord.emoji}
          </div>
          <button
            onClick={() => audio.speak(currentWord.word)}
            className="mt-2 text-xs font-bold text-gemblue hover:underline flex items-center justify-center gap-1 mx-auto"
          >
            <Volume2 className="w-3.5 h-3.5" /> Dengarkan Pelafalan Kata
          </button>
        </div>

        {/* Word Display with Missing Letter Box */}
        <div className="flex flex-wrap justify-center gap-2 sm:gap-3 my-4">
          {currentWord.word.split('').map((char, idx) => {
            const isMissing = idx === missingIndex;
            const isSolved = isMissing && isCorrectFeedback;

            return (
              <div
                key={idx}
                className={`w-12 h-14 sm:w-14 sm:h-16 rounded-2xl border-3 flex items-center justify-center font-black text-2xl sm:text-3xl transition-all shadow-md ${
                  isSolved
                    ? 'border-gemgreen bg-emerald-100 text-gemgreen scale-110 shadow-lg ring-2 ring-emerald-300'
                    : isMissing
                    ? 'border-dashed border-gempurple bg-purple-50 text-gempurple animate-pulse'
                    : 'border-gray-200 bg-white text-gemdark'
                }`}
              >
                {isSolved ? char : isMissing ? (selectedLetter || '?') : char}
              </div>
            );
          })}
        </div>

        {/* Feedback Alert */}
        {isCorrectFeedback !== null && (
          <div className={`text-xs font-black px-4 py-1.5 rounded-full mb-3 flex items-center gap-1.5 ${
            isCorrectFeedback ? 'bg-emerald-100 text-gemgreen' : 'bg-red-100 text-red-600 animate-wiggle'
          }`}>
            {isCorrectFeedback ? (
              <>
                <CheckCircle className="w-4 h-4" /> Hebat Sekali! Kata Terangkai Lengkap (+10 Koin)
              </>
            ) : (
              <>
                <HelpCircle className="w-4 h-4" /> Belum pas, dengarkan bunyinya dan coba huruf lain!
              </>
            )}
          </div>
        )}

        {/* Letter Choice Buttons with phonetic sounds */}
        <div className="w-full max-w-md">
          <span className="block text-xs font-bold text-gray-500 mb-2">Sentuh huruf yang tepat untuk melengkapi kata:</span>
          <div className="grid grid-cols-4 gap-3">
            {letterOptions.map((letter, idx) => {
              const isSelected = selectedLetter === letter;
              return (
                <button
                  key={idx}
                  onClick={() => handleSelectLetter(letter)}
                  disabled={selectedLetter !== null && isCorrectFeedback === true}
                  className={`py-3.5 rounded-2xl font-black text-2xl shadow-md border-3 transition-all gem-card-hover gem-btn-press ${
                    isSelected && isCorrectFeedback
                      ? 'bg-gemgreen border-emerald-600 text-white scale-105'
                      : isSelected && !isCorrectFeedback
                      ? 'bg-red-500 border-red-700 text-white animate-wiggle'
                      : 'bg-white hover:bg-purple-50 border-purple-200 text-gemdark hover:border-gempurple active:scale-95'
                  }`}
                >
                  {letter}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Result Modal */}
      <ResultSummaryModal
        isOpen={isFinished}
        gameTitle="Susun Kata Nusantara Deluxe"
        score={score}
        stars={correctCount >= 5 ? 3 : correctCount >= 3 ? 2 : 1}
        coinsEarned={coinsEarned}
        correctCount={correctCount}
        totalQuestions={sessionWords.length}
        onPlayAgain={handlePlayAgain}
        onBackToMap={onExit}
      />
    </div>
  );
};
