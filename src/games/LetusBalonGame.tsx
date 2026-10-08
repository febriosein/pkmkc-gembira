import React, { useState, useEffect, useRef } from 'react';
import { Volume2, Pause, Play, X, Clock, Sparkles, Flame } from 'lucide-react';
import { ChildProfile, DifficultyLevel } from '../types';
import { MathQuestion, generateMathQuestion, getBalloonColor } from '../data/mathQuestions';
import { storage } from '../services/storage';
import { audio } from '../services/audio';
import { questionPool } from '../services/questionPool';
import { scaffolding } from '../services/scaffolding';
import { ResultSummaryModal } from '../components/game/ResultSummaryModal';
import { ScaffoldingBuddyBanner } from '../components/game/ScaffoldingBuddyBanner';

interface LetusBalonGameProps {
  child: ChildProfile;
  difficulty?: DifficultyLevel;
  onExit: () => void;
  onCoinsUpdated: (newCoins: number) => void;
}

export const LetusBalonGame: React.FC<LetusBalonGameProps> = ({
  child,
  difficulty = 'mudah',
  onExit,
  onCoinsUpdated,
}) => {
  // Game Mode: 'timed' (45 detik) or 'zen' (santai tanpa timer)
  const [gameMode, setGameMode] = useState<'timed' | 'zen'>('zen');
  const [timeLeft, setTimeLeft] = useState<number>(45);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [currentQuestion, setCurrentQuestion] = useState<MathQuestion>(() => generateMathQuestion(difficulty));
  const [questionCount, setQuestionCount] = useState<number>(1);
  const [score, setScore] = useState<number>(0);
  const [correctCount, setCorrectCount] = useState<number>(0);
  const [coinsEarned, setCoinsEarned] = useState<number>(0);
  const [sessionId] = useState<string>(() => 'sess-balon-' + Date.now());
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [poppedIndex, setPoppedIndex] = useState<number | null>(null);
  const [wrongIndex, setWrongIndex] = useState<number | null>(null);

  // Deluxe features: Streak & Combo
  const [streak, setStreak] = useState<number>(0);
  const [comboBanner, setComboBanner] = useState<string | null>(null);

  // Scaffolding & Growth Mindset States
  const [scaffoldingState, setScaffoldingState] = useState<{
    isOpen: boolean;
    message: string;
    isHintUsed: boolean;
  } | null>(null);
  const [eliminatedIndices, setEliminatedIndices] = useState<number[]>([]);

  const questionStartTimeRef = useRef<number>(Date.now());
  const timerRef = useRef<any>(null);

  // Read question narration when question changes & reset per-question scaffolding
  useEffect(() => {
    questionStartTimeRef.current = Date.now();
    setScaffoldingState(null);
    setEliminatedIndices([]);
    audio.speak(currentQuestion.speechText);
    return () => {
      audio.stopSpeech();
    };
  }, [currentQuestion]);

  // Hesitation detection (PKM-KC Dynamic Scaffolding: >9s without answer)
  useEffect(() => {
    if (poppedIndex !== null || isFinished || isPaused) return;
    const timer = setTimeout(() => {
      if (!scaffoldingState?.isOpen && poppedIndex === null) {
        setScaffoldingState({
          isOpen: true,
          message: scaffolding.getEncouragement(),
          isHintUsed: eliminatedIndices.length > 0,
        });
      }
    }, 9000);
    return () => clearTimeout(timer);
  }, [currentQuestion, poppedIndex, isFinished, isPaused, scaffoldingState, eliminatedIndices.length]);

  const handleEliminateBalloon = () => {
    const wrongOptions = currentQuestion.options
      .map((val, idx) => ({ val, idx }))
      .filter(item => item.val !== currentQuestion.correctAnswer && !eliminatedIndices.includes(item.idx));

    if (wrongOptions.length > 0) {
      const target = wrongOptions[Math.floor(Math.random() * wrongOptions.length)];
      setEliminatedIndices(prev => [...prev, target.idx]);
      const newBalance = scaffolding.awardEffortReward(child.id, 'Semangat Balon Pantang Menyerah');
      onCoinsUpdated(newBalance);
      setCoinsEarned(prev => prev + 3);
      setScaffoldingState(prev => (prev ? { ...prev, isHintUsed: true } : null));
    }
  };

  // Timer effect for timed mode
  useEffect(() => {
    if (gameMode === 'timed' && !isPaused && !isFinished) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            finishSession();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameMode, isPaused, isFinished]);

  const handleSelectOption = (chosen: number, idx: number) => {
    if (poppedIndex !== null || isFinished) return;

    const responseMs = Date.now() - questionStartTimeRef.current;
    const isCorrect = chosen === currentQuestion.correctAnswer;

    // Record attempt to storage for parent diagnostic engine
    storage.recordAttempt({
      sessionId,
      childId: child.id,
      questionId: currentQuestion.id,
      domain: 'numerasi',
      userAnswer: chosen,
      isCorrect,
      responseMs,
      clientEventId: 'evt-' + Date.now() + '-' + idx,
    });

    if (isCorrect) {
      audio.playPop();
      audio.playSuccess();
      setPoppedIndex(idx);

      const nextStreak = streak + 1;
      setStreak(nextStreak);

      // Combo banner message
      if (nextStreak === 2) {
        setComboBanner('🔥 2x COMBO! Hebat!');
      } else if (nextStreak === 3) {
        setComboBanner('⚡ 3x COMBO! Luar Biasa!');
      } else if (nextStreak >= 4) {
        setComboBanner('🌟 SUPER COMBO! Juara Sejati!');
      }

      setScore(prev => prev + 10 + (nextStreak >= 3 ? 5 : 0));
      setCorrectCount(prev => prev + 1);

      // Award coins scaled by difficulty multiplier + bonus for streak
      if (storage.canRewardQuestion(sessionId, currentQuestion.id)) {
        const mult = questionPool.getDifficultyMultiplier(difficulty);
        const bonus = nextStreak >= 3 ? 2 : 0;
        const rewardDelta = Math.round((5 + bonus) * mult);
        const newBalance = storage.recordCoinDelta(child.id, rewardDelta, 'Letus Balon Deluxe: Jawaban Benar', sessionId);
        setCoinsEarned(prev => prev + rewardDelta);
        onCoinsUpdated(newBalance);
      }

      // Next question after pop animation
      setTimeout(() => {
        setPoppedIndex(null);
        setWrongIndex(null);
        setComboBanner(null);
        if (questionCount >= 10 && gameMode === 'zen') {
          finishSession();
        } else {
          setQuestionCount(prev => prev + 1);
          setCurrentQuestion(generateMathQuestion(difficulty));
        }
      }, 650);
    } else {
      audio.playGentleBoing();
      setWrongIndex(idx);
      setStreak(0); // Reset streak on mistake
      setComboBanner(null);
      setScaffoldingState({
        isOpen: true,
        message: scaffolding.getEncouragement(),
        isHintUsed: eliminatedIndices.length > 0,
      });
      setTimeout(() => {
        setWrongIndex(null);
      }, 600);
    }
  };

  const finishSession = () => {
    setIsFinished(true);
    // Completion bonus (+50 coins per PRD FR-COIN-02)
    const completionBonus = 50;
    const newBalance = storage.recordCoinDelta(child.id, completionBonus, 'Bonus Selesai Game Letus Balon', sessionId);
    setCoinsEarned(prev => prev + completionBonus);
    onCoinsUpdated(newBalance);

    // Calculate stars
    const accuracy = questionCount > 0 ? (correctCount / questionCount) : 0;
    let stars = 1;
    if (accuracy >= 0.8) stars = 3;
    else if (accuracy >= 0.6) stars = 2;

    storage.recordCompletedSession({
      childId: child.id,
      gameId: 'letus-balon',
      domain: 'numerasi',
      startedAt: new Date(Date.now() - 45000).toISOString(),
      score,
      stars,
      coinsEarned: coinsEarned + completionBonus,
      totalQuestions: questionCount,
      correctCount,
    });
  };

  const handlePlayAgain = () => {
    setTimeLeft(45);
    setScore(0);
    setCorrectCount(0);
    setCoinsEarned(0);
    setQuestionCount(1);
    setStreak(0);
    setComboBanner(null);
    setIsFinished(false);
    setPoppedIndex(null);
    setCurrentQuestion(generateMathQuestion(difficulty));
  };

  const diffInfo = questionPool.getDifficultyLabel(difficulty);

  return (
    <div className="max-w-4xl mx-auto w-full flex-1 flex flex-col justify-between py-2">
      {/* Game Header Bar */}
      <div className="bg-white/95 rounded-3xl p-4 border-2 border-gempink/30 shadow-md flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => {
              audio.playClick();
              onExit();
            }}
            className="w-9 h-9 rounded-2xl bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center transition-colors"
            title="Keluar ke Menu"
          >
            <X className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="font-black text-sm sm:text-base text-gemdark">
                🎈 Letus Balon Deluxe
              </h3>
              <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${diffInfo.color}`}>
                {diffInfo.badge}
              </span>
            </div>
            <span className="text-[10px] text-gray-500 font-bold">Soal {questionCount} {gameMode === 'zen' ? '/ 10' : ''}</span>
          </div>
        </div>

        {/* Mode Selector Pill */}
        <div className="flex bg-gray-100 p-1 rounded-2xl text-xs font-bold">
          <button
            onClick={() => setGameMode('zen')}
            className={`px-3 py-1 rounded-xl transition-all ${
              gameMode === 'zen' ? 'bg-white text-gempink shadow-sm' : 'text-gray-500'
            }`}
          >
            Mode Santai
          </button>
          <button
            onClick={() => setGameMode('timed')}
            className={`px-3 py-1 rounded-xl transition-all ${
              gameMode === 'timed' ? 'bg-white text-gempink shadow-sm' : 'text-gray-500'
            }`}
          >
            Timer (45s)
          </button>
        </div>

        {/* Stats on top right */}
        <div className="flex items-center gap-2">
          {gameMode === 'timed' && (
            <div className={`flex items-center gap-1 px-3 py-1 rounded-2xl font-black text-xs ${
              timeLeft <= 10 ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-blue-50 text-gemblue'
            }`}>
              <Clock className="w-3.5 h-3.5" /> {timeLeft}s
            </div>
          )}
          <button
            onClick={() => {
              audio.playClick();
              setIsPaused(prev => !prev);
            }}
            className="w-8 h-8 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 flex items-center justify-center transition-colors"
            title={isPaused ? "Lanjutkan" : "Jeda"}
          >
            {isPaused ? <Play className="w-4 h-4 fill-gray-700" /> : <Pause className="w-4 h-4" />}
          </button>
          <div className="bg-amber-50 text-amber-900 border border-amber-200 px-3 py-1 rounded-2xl font-black text-xs flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" /> {score}
          </div>
        </div>
      </div>

      {/* Main Balloon Arena */}
      <div className="flex-1 bg-gradient-to-b from-sky-100 via-sky-50 to-emerald-50 rounded-3xl border-4 border-white shadow-xl p-6 flex flex-col items-center justify-between relative overflow-hidden min-h-[440px]">
        {/* Floating clouds in background */}
        <div className="absolute top-4 left-6 text-3xl opacity-40 select-none animate-float">☁️</div>
        <div className="absolute top-10 right-10 text-4xl opacity-35 select-none animate-float" style={{ animationDelay: '1.5s' }}>☁️</div>

        {/* Streak banner */}
        {comboBanner && (
          <div className="absolute top-3 z-20 bg-gradient-to-r from-amber-400 to-orange-500 text-white font-black text-xs px-4 py-1.5 rounded-full shadow-lg animate-bounce-short flex items-center gap-1.5">
            <Flame className="w-4 h-4 text-yellow-200" /> {comboBanner}
          </div>
        )}

        {/* Math Question Banner with Indonesian voice speaker */}
        <div className="relative z-10 w-full max-w-md bg-white/95 backdrop-blur-md rounded-3xl p-4 sm:p-5 border-3 border-purple-200 shadow-lg text-center mt-2">
          <div className="flex items-center justify-center gap-2 mb-1">
            <span className="text-xs font-black uppercase text-purple-600 tracking-wider">Hitung Soal Berikut:</span>
            <button
              onClick={() => audio.speak(currentQuestion.speechText)}
              className="p-1 rounded-full bg-purple-100 hover:bg-purple-200 text-gempurple transition-colors"
              title="Dengarkan Soal"
            >
              <Volume2 className="w-4 h-4" />
            </button>
          </div>
          <div className="text-4xl sm:text-5xl font-black text-gemdark tracking-wider py-1">
            {currentQuestion.expression} = ?
          </div>
          <p className="text-xs text-gray-500 font-semibold mt-1">Pilih balon dengan jawaban yang benar!</p>
        </div>

        {/* Dynamic Scaffolding & Growth Mindset Buddy Banner */}
        {scaffoldingState?.isOpen && (
          <ScaffoldingBuddyBanner
            child={child}
            message={scaffoldingState.message}
            onEliminateWrongOption={
              eliminatedIndices.length < currentQuestion.options.length - 1
                ? handleEliminateBalloon
                : undefined
            }
            isHintUsed={scaffoldingState.isHintUsed}
            onDismiss={() => setScaffoldingState(null)}
          />
        )}

        {/* Four floating balloons to pop */}
        <div className="relative z-10 w-full max-w-2xl grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 my-6">
          {currentQuestion.options.map((val, idx) => {
            const color = getBalloonColor(idx);
            const isPopped = poppedIndex === idx;
            const isWrong = wrongIndex === idx;
            const isEliminated = eliminatedIndices.includes(idx);

            return (
              <div key={idx} className="flex flex-col items-center">
                <button
                  type="button"
                  onClick={() => !isEliminated && handleSelectOption(val, idx)}
                  disabled={isPopped || isEliminated}
                  className={`w-28 h-36 sm:w-32 sm:h-40 rounded-[50%/60%_60%_40%_40%] flex flex-col items-center justify-center font-black shadow-xl border-4 transition-all gem-card-hover select-none relative ${color.bg} ${color.border} ${color.text} ${
                    isPopped
                      ? 'scale-0 opacity-0 duration-300'
                      : isEliminated
                      ? 'opacity-25 grayscale scale-75 cursor-not-allowed pointer-events-none'
                      : 'animate-float'
                  } ${isWrong ? 'animate-wiggle border-red-500' : ''}`}
                  style={{ animationDelay: `${idx * 0.4}s` }}
                >
                  {/* Balloon reflection shine */}
                  <span className="absolute top-3 left-4 w-4 h-7 bg-white/35 rounded-full rotate-[-25deg] pointer-events-none"></span>
                  
                  {/* Answer Number */}
                  <span className="relative z-10 text-3xl sm:text-4xl drop-shadow-sm">{val}</span>

                  {/* PAUD visual assistance dots (if val <= 8) */}
                  {val > 0 && val <= 8 && child.ageBand === 'paud' && (
                    <div className="flex gap-1 mt-1 z-10 opacity-75">
                      {Array.from({ length: val }).map((_, dotIdx) => (
                        <span key={dotIdx} className="w-1.5 h-1.5 rounded-full bg-white"></span>
                      ))}
                    </div>
                  )}
                  
                  {/* Balloon knot */}
                  <span className={`absolute -bottom-2 w-4 h-3 rounded-full ${color.bg} border-2 ${color.border}`}></span>
                </button>
                {/* Balloon string */}
                <div className="w-0.5 h-10 bg-gray-400/80 mt-1"></div>
              </div>
            );
          })}
        </div>

        <div className="text-xs text-gray-500 font-bold bg-white/80 px-4 py-1.5 rounded-full border border-gray-200">
          💡 Setiap jawaban benar mendapat <strong className="text-amber-600">+5 Koin</strong> & bonus combo streak beruntun!
        </div>
      </div>

      {/* Result Modal */}
      <ResultSummaryModal
        isOpen={isFinished}
        gameTitle="Letus Balon Matematika Deluxe"
        score={score}
        stars={correctCount >= 8 ? 3 : correctCount >= 5 ? 2 : 1}
        coinsEarned={coinsEarned}
        correctCount={correctCount}
        totalQuestions={questionCount}
        onPlayAgain={handlePlayAgain}
        onBackToMap={onExit}
      />
    </div>
  );
};
