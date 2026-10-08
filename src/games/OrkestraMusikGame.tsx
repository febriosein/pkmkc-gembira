import { useState, useEffect, useRef, useMemo } from 'react';
import { X, Sparkles, RotateCcw } from 'lucide-react';
import { ChildProfile, DifficultyLevel } from '../types';
import { storage } from '../services/storage';
import { audio } from '../services/audio';
import { questionPool } from '../services/questionPool';
import { ResultSummaryModal } from '../components/game/ResultSummaryModal';

interface OrkestraMusikGameProps {
  child: ChildProfile;
  difficulty?: DifficultyLevel;
  onExit: () => void;
  onCoinsUpdated: (newCoins: number) => void;
}

interface NoteKey {
  id: number;
  note: string;
  name: string;
  animal: string;
  freq: number;
  color: string;
  activeColor: string;
}

const XYLOPHONE_KEYS: NoteKey[] = [
  { id: 0, note: 'Do', name: 'Kucing Ceria', animal: '🐱', freq: 261.63, color: 'bg-rose-500 border-rose-700', activeColor: 'bg-rose-300 ring-4 ring-rose-300 scale-105' },
  { id: 1, note: 'Re', name: 'Anjing Sahabat', animal: '🐶', freq: 293.66, color: 'bg-amber-500 border-amber-700', activeColor: 'bg-amber-300 ring-4 ring-amber-300 scale-105' },
  { id: 2, note: 'Mi', name: 'Katak Lompat', animal: '🐸', freq: 329.63, color: 'bg-yellow-400 border-yellow-600 text-gemdark', activeColor: 'bg-yellow-200 ring-4 ring-yellow-200 scale-105' },
  { id: 3, note: 'Fa', name: 'Burung Bernyanyi', animal: '🐦', freq: 349.23, color: 'bg-emerald-500 border-emerald-700', activeColor: 'bg-emerald-300 ring-4 ring-emerald-300 scale-105' },
  { id: 4, note: 'Sol', name: 'Singa Berani', animal: '🦁', freq: 392.00, color: 'bg-blue-500 border-blue-700', activeColor: 'bg-blue-300 ring-4 ring-blue-300 scale-105' },
];

export const OrkestraMusikGame: React.FC<OrkestraMusikGameProps> = ({
  child,
  difficulty = 'mudah',
  onExit,
  onCoinsUpdated,
}) => {
  const multiplier = questionPool.getDifficultyMultiplier(difficulty);
  const diffInfo = questionPool.getDifficultyInfo(difficulty);

  const config = useMemo(() => {
    switch (difficulty) {
      case 'sedang':
        return { totalRounds: 5, startLen: 3, tempoMs: 580 };
      case 'sulit':
        return { totalRounds: 6, startLen: 4, tempoMs: 460 };
      case 'mudah':
      default:
        return { totalRounds: 3, startLen: 2, tempoMs: 700 };
    }
  }, [difficulty]);

  const generateRandomSeq = (len: number) => {
    const seq: number[] = [];
    for (let i = 0; i < len; i++) {
      seq.push(Math.floor(Math.random() * XYLOPHONE_KEYS.length));
    }
    return seq;
  };

  const [sequence, setSequence] = useState<number[]>(() => generateRandomSeq(config.startLen));
  const [playerStep, setPlayerStep] = useState<number>(0);
  const [isPlayingSeq, setIsPlayingSeq] = useState<boolean>(false);
  const [activeKeyId, setActiveKeyId] = useState<number | null>(null);
  const [round, setRound] = useState<number>(1);
  const [score, setScore] = useState<number>(0);
  const [coinsEarned, setCoinsEarned] = useState<number>(0);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [sessionId] = useState<string>(() => 'sess-musik-' + Date.now());

  const roundStartTimeRef = useRef<number>(Date.now());

  // Play sequence audio with light highlights
  const playCurrentSequence = (seqToPlay = sequence) => {
    setIsPlayingSeq(true);
    setPlayerStep(0);

    seqToPlay.forEach((keyId, idx) => {
      setTimeout(() => {
        const item = XYLOPHONE_KEYS[keyId];
        setActiveKeyId(keyId);
        audio.playMusicalNote(item.freq, 0.45);

        setTimeout(() => {
          setActiveKeyId(null);
          if (idx === seqToPlay.length - 1) {
            setIsPlayingSeq(false);
            roundStartTimeRef.current = Date.now();
          }
        }, 350);
      }, (idx + 1) * config.tempoMs);
    });
  };

  useEffect(() => {
    // Initial melody greeting
    setTimeout(() => {
      playCurrentSequence(sequence);
    }, 500);
  }, []);

  const handleKeyPress = (keyItem: NoteKey) => {
    if (isPlayingSeq || isFinished) return;

    // Play note audio
    audio.playMusicalNote(keyItem.freq, 0.4);
    setActiveKeyId(keyItem.id);
    setTimeout(() => setActiveKeyId(null), 250);

    // Validate with expected sequence step
    const expectedKey = sequence[playerStep];

    if (keyItem.id === expectedKey) {
      const nextStep = playerStep + 1;
      setPlayerStep(nextStep);

      // Successfully completed the sequence!
      if (nextStep === sequence.length) {
        audio.playSuccess();
        const nextScore = score + 20;
        setScore(nextScore);

        // Record attempt to parent diagnostic
        storage.recordAttempt({
          sessionId,
          childId: child.id,
          questionId: 'musik-round-' + round,
          domain: 'memori',
          userAnswer: sequence.join('-'),
          isCorrect: true,
          responseMs: Date.now() - roundStartTimeRef.current,
          clientEventId: 'evt-music-' + Date.now(),
        });

        // Reward coins scaled by difficulty multiplier
        const roundCoin = Math.round(10 * multiplier);
        if (storage.canRewardQuestion(sessionId, 'round-' + round)) {
          const newBalance = storage.recordCoinDelta(child.id, roundCoin, `Orkestra Melodi (${diffInfo.label}): Ronde Selesai`, sessionId);
          setCoinsEarned(prev => prev + roundCoin);
          onCoinsUpdated(newBalance);
        }

        if (round >= config.totalRounds) {
          finishSession();
        } else {
          // Add one more note to sequence for next round
          const nextNote = Math.floor(Math.random() * XYLOPHONE_KEYS.length);
          const nextSeq = [...sequence, nextNote];
          setSequence(nextSeq);
          setRound(prev => prev + 1);

          setTimeout(() => {
            playCurrentSequence(nextSeq);
          }, 1200);
        }
      }
    } else {
      audio.playGentleBoing();
      // Allow retry current sequence
      setTimeout(() => {
        playCurrentSequence(sequence);
      }, 700);
    }
  };

  const finishSession = () => {
    setIsFinished(true);
    const bonus = Math.round(40 * multiplier);
    const newBalance = storage.recordCoinDelta(child.id, bonus, `Bonus Selesai Orkestra Melodi (${diffInfo.label})`, sessionId);
    setCoinsEarned(prev => prev + bonus);
    onCoinsUpdated(newBalance);

    storage.recordCompletedSession({
      childId: child.id,
      gameId: 'orkestra-musik',
      domain: 'memori',
      startedAt: new Date(Date.now() - 40000).toISOString(),
      score: score + 20,
      stars: 3,
      coinsEarned: coinsEarned + bonus,
      totalQuestions: config.totalRounds,
      correctCount: config.totalRounds,
    });
  };

  const handlePlayAgain = () => {
    const initSeq = generateRandomSeq(config.startLen);
    setSequence(initSeq);
    setRound(1);
    setPlayerStep(0);
    setScore(0);
    setCoinsEarned(0);
    setIsFinished(false);
    setTimeout(() => {
      playCurrentSequence(initSeq);
    }, 500);
  };

  return (
    <div className="max-w-4xl mx-auto w-full flex-1 flex flex-col justify-between py-2">
      {/* Header Bar */}
      <div className="bg-white/95 rounded-3xl p-4 border-2 border-indigo-200 shadow-md flex items-center justify-between mb-4">
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
                <span>🎹 Orkestra Melodi Ajaib</span>
              </h3>
              <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${diffInfo.badge}`}>
                {diffInfo.label} • ×{multiplier}
              </span>
            </div>
            <span className="text-[10px] text-gray-500 font-bold">
              Ronde {round} dari {config.totalRounds} • Ikuti {sequence.length} Nada
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => playCurrentSequence()}
            disabled={isPlayingSeq}
            className="px-3 py-1.5 rounded-2xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-black flex items-center gap-1.5 border border-indigo-200 transition-colors disabled:opacity-50"
            title="Putar Ulang Pola Nada"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Ulang Nada
          </button>
          <div className="bg-amber-50 text-amber-900 border border-amber-200 px-3 py-1.5 rounded-2xl font-black text-xs flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" /> {score} Poin
          </div>
        </div>
      </div>

      {/* Main Musical Xylophone Area */}
      <div className="flex-1 bg-gradient-to-b from-purple-100 via-indigo-50 to-pink-100 rounded-3xl border-4 border-white shadow-xl p-6 sm:p-8 flex flex-col items-center justify-between text-center relative">
        {/* Status prompt */}
        <div className="bg-white/95 backdrop-blur-md px-5 py-3 rounded-2xl border-2 border-indigo-100 shadow-sm max-w-md w-full mb-4">
          <div className="text-xs font-black uppercase text-indigo-600 mb-0.5">
            {isPlayingSeq ? '🎧 Dengarkan & Ingat Nada...' : '👉 Sekarang Giliranmu Menirukan!'}
          </div>
          <p className="text-xs text-gray-600 font-semibold">
            {isPlayingSeq ? 'Perhatikan tuts satwa yang menyala' : `Tekan tuts sesuai urutan (${playerStep}/${sequence.length})`}
          </p>
        </div>

        {/* 5 Xylophone Keys */}
        <div className="w-full max-w-xl grid grid-cols-5 gap-2 sm:gap-4 my-auto h-64 sm:h-72 items-end">
          {XYLOPHONE_KEYS.map((keyItem) => {
            const isActive = activeKeyId === keyItem.id;
            return (
              <button
                key={keyItem.id}
                type="button"
                onClick={() => handleKeyPress(keyItem)}
                disabled={isPlayingSeq}
                className={`h-full rounded-3xl flex flex-col items-center justify-between p-3 text-white font-black shadow-xl border-4 transition-all select-none cursor-pointer gem-btn-press ${
                  keyItem.color
                } ${isActive ? keyItem.activeColor : 'hover:-translate-y-2'}`}
              >
                {/* Animal Emoji Avatar */}
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/30 backdrop-blur-md rounded-2xl flex items-center justify-center text-2xl sm:text-3xl shadow-inner mt-2">
                  {keyItem.animal}
                </div>

                {/* Musical Note Title */}
                <div className="mb-2">
                  <span className="block text-xl sm:text-2xl font-black drop-shadow-sm">{keyItem.note}</span>
                  <span className="text-[10px] font-bold opacity-80 hidden sm:block">{keyItem.name.split(' ')[0]}</span>
                </div>
              </button>
            );
          })}
        </div>

        <div className="text-xs text-gray-500 font-bold bg-white/80 px-4 py-1.5 rounded-full border border-gray-200 mt-4">
          💡 Melatih daya ingat auditori, kepekaan musikal, dan konsentrasi anak!
        </div>
      </div>

      {/* Result Modal */}
      <ResultSummaryModal
        isOpen={isFinished}
        gameTitle="Orkestra Melodi Ajaib"
        score={score}
        stars={3}
        coinsEarned={coinsEarned}
        correctCount={config.totalRounds}
        totalQuestions={config.totalRounds}
        onPlayAgain={handlePlayAgain}
        onBackToMap={onExit}
      />
    </div>
  );
};
