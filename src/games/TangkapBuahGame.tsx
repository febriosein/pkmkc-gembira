import { useState, useEffect, useRef } from 'react';
import { Volume2, X, Sparkles, ArrowLeft, ArrowRight } from 'lucide-react';
import { ChildProfile, DifficultyLevel } from '../types';
import { storage } from '../services/storage';
import { audio } from '../services/audio';
import { questionPool } from '../services/questionPool';
import { ResultSummaryModal } from '../components/game/ResultSummaryModal';

interface TangkapBuahGameProps {
  child: ChildProfile;
  difficulty?: DifficultyLevel;
  onExit: () => void;
  onCoinsUpdated: (newCoins: number) => void;
}

interface FallingFruit {
  id: string;
  lane: 0 | 1 | 2; // 0: Kiri, 1: Tengah, 2: Kanan
  value: number;
  emoji: string;
  y: number; // 0 to 100%
  isTarget: boolean;
}

const FRUIT_EMOJIS = ['🍎', '🍊', '🍓', '🍇', '🍌', '🍉'];

export const TangkapBuahGame: React.FC<TangkapBuahGameProps> = ({
  child,
  difficulty = 'mudah',
  onExit,
  onCoinsUpdated,
}) => {
  const [basketLane, setBasketLane] = useState<0 | 1 | 2>(1); // starts in center lane
  const [targetNum, setTargetNum] = useState<number>(5);
  const [questionText, setQuestionText] = useState<string>('3 + 2');
  const [fallingFruits, setFallingFruits] = useState<FallingFruit[]>([]);
  const [score, setScore] = useState<number>(0);
  const [caughtCount, setCaughtCount] = useState<number>(0);
  const [coinsEarned, setCoinsEarned] = useState<number>(0);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [sessionId] = useState<string>(() => 'sess-buah-' + Date.now());

  const animationFrameRef = useRef<any>(null);
  const lastSpawnTimeRef = useRef<number>(Date.now());
  const questionStartTimeRef = useRef<number>(Date.now());

  // Generate new math target based on difficulty
  const generateNewTarget = () => {
    let n1 = 2;
    let n2 = 2;
    let sum = 4;
    let text = '2 + 2';

    if (difficulty === 'mudah') {
      n1 = Math.floor(Math.random() * 4) + 1;
      n2 = Math.floor(Math.random() * 4) + 1;
      sum = n1 + n2;
      text = `${n1} + ${n2}`;
    } else if (difficulty === 'sedang') {
      const isSub = Math.random() > 0.5;
      if (isSub) {
        n1 = Math.floor(Math.random() * 10) + 7;
        n2 = Math.floor(Math.random() * 6) + 1;
        sum = n1 - n2;
        text = `${n1} - ${n2}`;
      } else {
        n1 = Math.floor(Math.random() * 8) + 3;
        n2 = Math.floor(Math.random() * 8) + 2;
        sum = n1 + n2;
        text = `${n1} + ${n2}`;
      }
    } else {
      // Sulit: Perkalian atau angka hingga 30
      const isMult = Math.random() > 0.4;
      if (isMult) {
        n1 = Math.floor(Math.random() * 5) + 2;
        n2 = Math.floor(Math.random() * 4) + 2;
        sum = n1 * n2;
        text = `${n1} × ${n2}`;
      } else {
        n1 = Math.floor(Math.random() * 15) + 10;
        n2 = Math.floor(Math.random() * 12) + 5;
        sum = n1 + n2;
        text = `${n1} + ${n2}`;
      }
    }

    setTargetNum(sum);
    setQuestionText(text);
    audio.speak(`Ayo tangkap buah yang bernilai ${text}!`);
    questionStartTimeRef.current = Date.now();
  };

  useEffect(() => {
    generateNewTarget();
  }, []);

  // Game animation loop
  useEffect(() => {
    if (isFinished) return;

    const gameLoop = () => {
      const now = Date.now();

      // Spawn a wave of fruits every 2.8 seconds
      if (now - lastSpawnTimeRef.current > 2800) {
        lastSpawnTimeRef.current = now;

        const targetLane = Math.floor(Math.random() * 3) as 0 | 1 | 2;
        const newWave: FallingFruit[] = [];

        [0, 1, 2].forEach(laneIdx => {
          const isTarget = laneIdx === targetLane;
          const val = isTarget ? targetNum : targetNum + (Math.random() > 0.5 ? 1 : -1) * (Math.floor(Math.random() * 2) + 1);
          newWave.push({
            id: 'fruit-' + Date.now() + '-' + laneIdx,
            lane: laneIdx as 0 | 1 | 2,
            value: Math.max(1, val),
            emoji: FRUIT_EMOJIS[Math.floor(Math.random() * FRUIT_EMOJIS.length)],
            y: 0,
            isTarget,
          });
        });

        setFallingFruits(prev => [...prev, ...newWave]);
      }

      // Move fruits downwards
      setFallingFruits(prev => {
        const nextList: FallingFruit[] = [];

        for (const fruit of prev) {
          const speed = difficulty === 'mudah' ? 0.8 : difficulty === 'sedang' ? 1.2 : 1.7;
          const nextY = fruit.y + speed; // falling speed

          // Check catch collision near bottom (y >= 85%)
          if (nextY >= 82 && nextY <= 90 && fruit.lane === basketLane) {
            handleFruitCatch(fruit);
            continue; // Caught, remove from screen
          }

          if (nextY < 100) {
            nextList.push({ ...fruit, y: nextY });
          }
        }

        return nextList;
      });

      animationFrameRef.current = requestAnimationFrame(gameLoop);
    };

    animationFrameRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [basketLane, targetNum, isFinished]);

  const handleFruitCatch = (fruit: FallingFruit) => {
    const responseMs = Date.now() - questionStartTimeRef.current;
    const isCorrect = fruit.value === targetNum;

    // Record attempt for parent diagnostic
    storage.recordAttempt({
      sessionId,
      childId: child.id,
      questionId: 'fruit-catch-' + targetNum,
      domain: 'numerasi',
      userAnswer: fruit.value,
      isCorrect,
      responseMs,
      clientEventId: 'evt-catch-' + Date.now(),
    });

    if (isCorrect) {
      audio.playCatchFruit();
      audio.playSuccess();
      setScore(prev => prev + 15);
      const nextCount = caughtCount + 1;
      setCaughtCount(nextCount);

      // Reward coins scaled by difficulty multiplier
      if (storage.canRewardQuestion(sessionId, 'catch-' + nextCount)) {
        const mult = questionPool.getDifficultyMultiplier(difficulty);
        const rewardDelta = Math.round(8 * mult);
        const newBalance = storage.recordCoinDelta(child.id, rewardDelta, 'Tangkap Buah: Jawaban Tepat', sessionId);
        setCoinsEarned(prev => prev + rewardDelta);
        onCoinsUpdated(newBalance);
      }

      if (nextCount >= 7) {
        finishSession();
      } else {
        generateNewTarget();
      }
    } else {
      audio.playGentleBoing();
    }
  };

  const finishSession = () => {
    setIsFinished(true);
    const bonus = Math.round(40 * questionPool.getDifficultyMultiplier(difficulty));
    const newBalance = storage.recordCoinDelta(child.id, bonus, 'Bonus Selesai Game Tangkap Buah', sessionId);
    setCoinsEarned(prev => prev + bonus);
    onCoinsUpdated(newBalance);

    storage.recordCompletedSession({
      childId: child.id,
      gameId: 'tangkap-buah',
      domain: 'numerasi',
      startedAt: new Date(Date.now() - 40000).toISOString(),
      score: score + 15,
      stars: 3,
      coinsEarned: coinsEarned + bonus,
      totalQuestions: 7,
      correctCount: caughtCount + 1,
    });
  };

  const handlePlayAgain = () => {
    setScore(0);
    setCaughtCount(0);
    setCoinsEarned(0);
    setFallingFruits([]);
    setIsFinished(false);
    generateNewTarget();
  };

  const diffInfo = questionPool.getDifficultyLabel(difficulty);

  return (
    <div className="max-w-4xl mx-auto w-full flex-1 flex flex-col justify-between py-2">
      {/* Header Bar */}
      <div className="bg-white/95 rounded-3xl p-4 border-2 border-emerald-300 shadow-md flex items-center justify-between mb-4">
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
            <div className="flex items-center gap-1.5">
              <h3 className="font-black text-sm sm:text-base text-gemdark">
                🍎 Tangkap Buah Matematika
              </h3>
              <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${diffInfo.color}`}>
                {diffInfo.badge}
              </span>
            </div>
            <span className="text-[10px] text-gray-500 font-bold">
              Berhasil Ditangkap: {caughtCount} / 7 Buah
            </span>
          </div>
        </div>

        <div className="bg-amber-50 text-amber-900 border border-amber-200 px-3.5 py-1.5 rounded-2xl font-black text-xs flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" /> {score} Poin
        </div>
      </div>

      {/* Main Falling Fruits Canvas */}
      <div className="flex-1 bg-gradient-to-b from-sky-100 via-emerald-50 to-green-100 rounded-2xl sm:rounded-3xl border-3 sm:border-4 border-white shadow-xl p-3 sm:p-4 flex flex-col justify-between relative overflow-hidden min-h-[400px] sm:min-h-[460px]">
        {/* Top Target Equation Banner with voice speaker */}
        <div className="relative z-10 w-full max-w-sm mx-auto bg-white/95 backdrop-blur-md rounded-2xl p-2.5 sm:p-3 border-2 border-emerald-200 shadow-md text-center">
          <div className="flex items-center justify-center gap-1.5 mb-0.5">
            <span className="text-[10px] font-black uppercase text-emerald-700 tracking-wider">Tangkap Buah Berangka:</span>
            <button
              onClick={() => audio.speak(`Ayo tangkap buah yang bernilai ${questionText}`)}
              className="p-1 rounded-full bg-emerald-50 hover:bg-emerald-100 text-gemgreen transition-colors"
              title="Dengarkan Soal"
            >
              <Volume2 className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-gemdark tracking-wider">
            {questionText} = <span className="text-emerald-600 underline">?</span>
          </div>
        </div>

        {/* 3 Fall Lanes Visualization */}
        <div className="absolute inset-0 pt-16 sm:pt-20 pb-20 grid grid-cols-3 pointer-events-none">
          <div className="border-r border-dashed border-emerald-200/60 flex justify-center"></div>
          <div className="border-r border-dashed border-emerald-200/60 flex justify-center"></div>
          <div className="flex justify-center"></div>
        </div>

        {/* Falling Fruits rendered by percentage y */}
        <div className="absolute inset-0 pt-16 sm:pt-20 pb-24 pointer-events-none">
          {fallingFruits.map(fruit => {
            const leftPercent = fruit.lane === 0 ? '16.6%' : fruit.lane === 1 ? '50%' : '83.3%';
            return (
              <div
                key={fruit.id}
                className="absolute transform -translate-x-1/2 flex flex-col items-center animate-bounce-short"
                style={{
                  left: leftPercent,
                  top: `${fruit.y}%`,
                  transition: 'top 0.05s linear',
                }}
              >
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white/95 border-2 border-amber-300 rounded-2xl flex flex-col items-center justify-center shadow-lg">
                  <span className="text-xl sm:text-2xl leading-none">{fruit.emoji}</span>
                  <span className="text-xs sm:text-sm font-black text-gemdark leading-none mt-0.5">{fruit.value}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Moving Basket */}
        <div className="relative z-10 w-full grid grid-cols-3 pt-6 pb-2">
          {[0, 1, 2].map(lane => (
            <div
              key={lane}
              onClick={() => {
                audio.playClick();
                setBasketLane(lane as 0 | 1 | 2);
              }}
              className="flex justify-center items-end cursor-pointer h-20"
            >
              {basketLane === lane && (
                <div className="w-20 h-14 sm:w-24 sm:h-16 bg-amber-700 border-3 sm:border-4 border-amber-900 rounded-b-3xl rounded-t-lg flex flex-col items-center justify-center text-white shadow-xl animate-float">
                  <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider">🧺 Keranjang</span>
                  <span className="text-base sm:text-lg leading-none">🧺</span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Lane Controller Buttons for Touch Devices */}
        <div className="relative z-20 flex justify-center gap-2 sm:gap-4 bg-white/90 backdrop-blur-md p-1.5 sm:p-2 rounded-2xl border border-gray-200 max-w-xs mx-auto w-full">
          <button
            type="button"
            onClick={() => {
              audio.playClick();
              setBasketLane(prev => (prev > 0 ? (prev - 1) as any : 0));
            }}
            disabled={basketLane === 0}
            className="flex-1 min-h-[44px] py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 disabled:opacity-40 text-white font-black text-xs flex items-center justify-center gap-1 shadow-sm active:scale-95"
          >
            <ArrowLeft className="w-4 h-4" /> Kiri
          </button>
          <button
            type="button"
            onClick={() => {
              audio.playClick();
              setBasketLane(1);
            }}
            className="px-3 sm:px-4 min-h-[44px] py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-black text-xs active:scale-95"
          >
            Tengah
          </button>
          <button
            type="button"
            onClick={() => {
              audio.playClick();
              setBasketLane(prev => (prev < 2 ? (prev + 1) as any : 2));
            }}
            disabled={basketLane === 2}
            className="flex-1 min-h-[44px] py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 disabled:opacity-40 text-white font-black text-xs flex items-center justify-center gap-1 shadow-sm active:scale-95"
          >
            Kanan <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Result Modal */}
      <ResultSummaryModal
        isOpen={isFinished}
        gameTitle="Tangkap Buah Matematika"
        score={score}
        stars={3}
        coinsEarned={coinsEarned}
        correctCount={caughtCount}
        totalQuestions={7}
        onPlayAgain={handlePlayAgain}
        onBackToMap={onExit}
      />
    </div>
  );
};
