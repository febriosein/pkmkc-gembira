import React, { useState, useEffect, useCallback } from 'react';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, X, Sparkles, RotateCcw } from 'lucide-react';
import { ChildProfile, DifficultyLevel } from '../types';
import { storage } from '../services/storage';
import { audio } from '../services/audio';
import { questionPool } from '../services/questionPool';
import { ResultSummaryModal } from '../components/game/ResultSummaryModal';

interface LabirinSatwaGameProps {
  child: ChildProfile;
  difficulty?: DifficultyLevel;
  onExit: () => void;
  onCoinsUpdated: (newCoins: number) => void;
}

interface MazeLevel {
  id: string;
  title: string;
  animal: string;
  goalEmoji: string;
  grid: number[][]; // 0 = path, 1 = obstacle, 2 = goal
  start: { r: number; c: number };
  goal: { r: number; c: number };
}

const MUDAH_MAZES: MazeLevel[] = [
  {
    id: 'maze_m1',
    title: 'Kelinci & Kebun Wortel',
    animal: '🐰',
    goalEmoji: '🥕',
    grid: [
      [0, 0, 1, 0, 0],
      [1, 0, 1, 0, 1],
      [0, 0, 0, 0, 0],
      [0, 1, 1, 1, 0],
      [0, 0, 0, 1, 2],
    ],
    start: { r: 0, c: 0 },
    goal: { r: 4, c: 4 },
  },
  {
    id: 'maze_m2',
    title: 'Kucing & Piring Ikan',
    animal: '🐱',
    goalEmoji: '🐟',
    grid: [
      [0, 0, 0, 1, 0],
      [1, 1, 0, 1, 0],
      [0, 0, 0, 0, 0],
      [0, 1, 1, 0, 1],
      [0, 0, 0, 0, 2],
    ],
    start: { r: 0, c: 0 },
    goal: { r: 4, c: 4 },
  },
  {
    id: 'maze_m3',
    title: 'Panda & Rumpun Bambu',
    animal: '🐼',
    goalEmoji: '🎋',
    grid: [
      [0, 0, 1, 0, 0],
      [0, 1, 1, 0, 1],
      [0, 0, 0, 0, 0],
      [1, 0, 1, 1, 0],
      [0, 0, 0, 0, 2],
    ],
    start: { r: 0, c: 0 },
    goal: { r: 4, c: 4 },
  },
  {
    id: 'maze_m4',
    title: 'Koala & Daun Eukaliptus',
    animal: '🐨',
    goalEmoji: '🍃',
    grid: [
      [0, 1, 0, 0, 0],
      [0, 0, 0, 1, 0],
      [1, 1, 0, 0, 0],
      [0, 0, 1, 1, 0],
      [0, 0, 0, 0, 2],
    ],
    start: { r: 0, c: 0 },
    goal: { r: 4, c: 4 },
  },
];

const SEDANG_MAZES: MazeLevel[] = [
  {
    id: 'maze_s1',
    title: 'Monyet & Pisang Manis',
    animal: '🐵',
    goalEmoji: '🍌',
    grid: [
      [0, 0, 0, 1, 0],
      [1, 1, 0, 0, 0],
      [0, 0, 0, 1, 1],
      [0, 1, 0, 0, 0],
      [0, 1, 1, 1, 2],
    ],
    start: { r: 0, c: 0 },
    goal: { r: 4, c: 4 },
  },
  {
    id: 'maze_s2',
    title: 'Anjing & Tulang Lezat',
    animal: '🐶',
    goalEmoji: '🦴',
    grid: [
      [0, 1, 0, 0, 0],
      [0, 1, 0, 1, 0],
      [0, 0, 0, 1, 0],
      [1, 1, 0, 0, 0],
      [0, 0, 1, 1, 2],
    ],
    start: { r: 0, c: 0 },
    goal: { r: 4, c: 4 },
  },
  {
    id: 'maze_s3',
    title: 'Lebah & Bunga Madu',
    animal: '🐝',
    goalEmoji: '🌺',
    grid: [
      [0, 0, 1, 0, 0],
      [1, 0, 0, 0, 1],
      [0, 1, 1, 0, 0],
      [0, 0, 1, 1, 0],
      [1, 0, 0, 0, 2],
    ],
    start: { r: 0, c: 0 },
    goal: { r: 4, c: 4 },
  },
  {
    id: 'maze_s4',
    title: 'Katak & Daun Teratai',
    animal: '🐸',
    goalEmoji: '🪷',
    grid: [
      [0, 1, 0, 0, 0],
      [0, 0, 0, 1, 0],
      [1, 1, 0, 1, 0],
      [0, 0, 0, 0, 0],
      [0, 1, 1, 1, 2],
    ],
    start: { r: 0, c: 0 },
    goal: { r: 4, c: 4 },
  },
];

const SULIT_MAZES: MazeLevel[] = [
  {
    id: 'maze_t1',
    title: 'Singa & Daging Segar',
    animal: '🦁',
    goalEmoji: '🥩',
    grid: [
      [0, 0, 1, 0, 0, 0],
      [1, 0, 1, 0, 1, 0],
      [0, 0, 0, 0, 1, 0],
      [0, 1, 1, 0, 0, 0],
      [0, 0, 1, 1, 1, 0],
      [1, 0, 0, 0, 1, 2],
    ],
    start: { r: 0, c: 0 },
    goal: { r: 5, c: 5 },
  },
  {
    id: 'maze_t2',
    title: 'Beruang & Tempayan Madu',
    animal: '🐻',
    goalEmoji: '🍯',
    grid: [
      [0, 1, 0, 0, 0, 0],
      [0, 0, 0, 1, 1, 0],
      [1, 1, 0, 0, 0, 0],
      [0, 0, 1, 1, 1, 0],
      [0, 1, 0, 0, 0, 0],
      [0, 0, 0, 1, 1, 2],
    ],
    start: { r: 0, c: 0 },
    goal: { r: 5, c: 5 },
  },
  {
    id: 'maze_t3',
    title: 'Tupai & Buah Kenari',
    animal: '🐿️',
    goalEmoji: '🌰',
    grid: [
      [0, 0, 0, 1, 0, 0],
      [1, 1, 0, 1, 0, 1],
      [0, 0, 0, 0, 0, 0],
      [0, 1, 1, 1, 1, 0],
      [0, 0, 0, 0, 1, 0],
      [1, 1, 1, 0, 0, 2],
    ],
    start: { r: 0, c: 0 },
    goal: { r: 5, c: 5 },
  },
  {
    id: 'maze_t4',
    title: 'Burung Hantu & Sarang Pohon',
    animal: '🦉',
    goalEmoji: '🪵',
    grid: [
      [0, 0, 1, 0, 0, 0],
      [0, 1, 1, 0, 1, 0],
      [0, 0, 0, 0, 1, 0],
      [1, 1, 0, 1, 0, 0],
      [0, 0, 0, 1, 0, 1],
      [0, 1, 0, 0, 0, 2],
    ],
    start: { r: 0, c: 0 },
    goal: { r: 5, c: 5 },
  },
];

export const LabirinSatwaGame: React.FC<LabirinSatwaGameProps> = ({
  child,
  difficulty = 'mudah',
  onExit,
  onCoinsUpdated,
}) => {
  const multiplier = questionPool.getDifficultyMultiplier(difficulty);
  const diffInfo = questionPool.getDifficultyInfo(difficulty);

  const getCandidateLevels = (): MazeLevel[] => {
    let pool = MUDAH_MAZES;
    if (difficulty === 'sedang') pool = SEDANG_MAZES;
    else if (difficulty === 'sulit') pool = SULIT_MAZES;

    return questionPool.getFreshQuestions(pool, child.id, `maze_${difficulty}`, 3);
  };

  const [levels, setLevels] = useState<MazeLevel[]>(() => getCandidateLevels());
  const [levelIndex, setLevelIndex] = useState(0);
  const currentLevel = levels[levelIndex] || levels[0];

  const [pos, setPos] = useState<{ r: number; c: number }>(() => currentLevel.start);
  const [pathHistory, setPathHistory] = useState<string[]>(['0,0']);
  const [score, setScore] = useState(0);
  const [coinsEarned, setCoinsEarned] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [sessionId] = useState(() => 'sess-labirin-' + Date.now());

  const handleMove = useCallback((dr: number, dc: number) => {
    if (isFinished || !currentLevel) return;

    const numRows = currentLevel.grid.length;
    const numCols = currentLevel.grid[0].length;

    const nr = pos.r + dr;
    const nc = pos.c + dc;

    // Check bounds
    if (nr < 0 || nr >= numRows || nc < 0 || nc >= numCols) {
      audio.playGentleBoing();
      return;
    }

    // Check obstacle / wall
    if (currentLevel.grid[nr][nc] === 1) {
      audio.playGentleBoing();
      return;
    }

    audio.playClick();
    setPos({ r: nr, c: nc });
    setPathHistory(prev => [...prev, `${nr},${nc}`]);

    // Check if goal reached!
    if (nr === currentLevel.goal.r && nc === currentLevel.goal.c) {
      audio.playSuccess();
      setScore(prev => prev + 25);

      // Reward coins scaled by difficulty multiplier
      const levelCoin = Math.round(12 * multiplier);
      if (storage.canRewardQuestion(sessionId, currentLevel.id)) {
        const newBalance = storage.recordCoinDelta(child.id, levelCoin, `Labirin Satwa (${diffInfo.label}): Level Selesai`, sessionId);
        setCoinsEarned(prev => prev + levelCoin);
        onCoinsUpdated(newBalance);
      }

      // Record attempt for diagnostic
      storage.recordAttempt({
        sessionId,
        childId: child.id,
        questionId: currentLevel.id,
        domain: 'warna-bentuk',
        userAnswer: 'finish',
        isCorrect: true,
        responseMs: 5000,
        clientEventId: 'evt-maze-' + Date.now(),
      });

      setTimeout(() => {
        if (levelIndex + 1 >= levels.length) {
          finishSession();
        } else {
          const nextLvlIndex = levelIndex + 1;
          const nextLvl = levels[nextLvlIndex];
          setLevelIndex(nextLvlIndex);
          setPos(nextLvl.start);
          setPathHistory([`${nextLvl.start.r},${nextLvl.start.c}`]);
        }
      }, 1000);
    }
  }, [pos, currentLevel, isFinished, levelIndex, levels, multiplier, diffInfo, sessionId, child.id, onCoinsUpdated]);

  // Support Arrow keys & WASD for desktop/laptop navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'KeyW'].includes(e.code)) {
        e.preventDefault();
        handleMove(-1, 0);
      } else if (['ArrowDown', 'KeyS'].includes(e.code)) {
        e.preventDefault();
        handleMove(1, 0);
      } else if (['ArrowLeft', 'KeyA'].includes(e.code)) {
        e.preventDefault();
        handleMove(0, -1);
      } else if (['ArrowRight', 'KeyD'].includes(e.code)) {
        e.preventDefault();
        handleMove(0, 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleMove]);

  const finishSession = () => {
    setIsFinished(true);
    const bonus = Math.round(40 * multiplier);
    const newBalance = storage.recordCoinDelta(child.id, bonus, `Bonus Selesai Labirin Satwa (${diffInfo.label})`, sessionId);
    setCoinsEarned(prev => prev + bonus);
    onCoinsUpdated(newBalance);

    storage.recordCompletedSession({
      childId: child.id,
      gameId: 'labirin-satwa',
      domain: 'warna-bentuk',
      startedAt: new Date(Date.now() - 40000).toISOString(),
      score: score + 25,
      stars: 3,
      coinsEarned: coinsEarned + bonus,
      totalQuestions: levels.length,
      correctCount: levels.length,
    });
  };

  const handleResetCurrentLevel = () => {
    setPos(currentLevel.start);
    setPathHistory([`${currentLevel.start.r},${currentLevel.start.c}`]);
  };

  const handlePlayAgain = () => {
    const freshLvls = getCandidateLevels();
    setLevels(freshLvls);
    setLevelIndex(0);
    setPos(freshLvls[0].start);
    setPathHistory([`${freshLvls[0].start.r},${freshLvls[0].start.c}`]);
    setScore(0);
    setCoinsEarned(0);
    setIsFinished(false);
  };

  const gridCols = currentLevel.grid[0].length;
  const gridColsClass = gridCols === 6 ? 'grid-cols-6' : 'grid-cols-5';

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
            <div className="flex items-center gap-2">
              <h3 className="font-black text-sm sm:text-base text-gemdark flex items-center gap-1.5">
                <span>🐾 Labirin Jejak Sahabat</span>
              </h3>
              <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${diffInfo.badge}`}>
                {diffInfo.label} • ×{multiplier}
              </span>
            </div>
            <span className="text-[10px] text-gray-500 font-bold">
              Level {levelIndex + 1} dari {levels.length} • {currentLevel.title}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleResetCurrentLevel}
            className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
            title="Ulang Posisi Awal"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <div className="bg-amber-50 text-amber-900 border border-amber-200 px-3.5 py-1.5 rounded-2xl font-black text-xs flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" /> {score} Poin
          </div>
        </div>
      </div>

      {/* Main Maze Canvas */}
      <div className="flex-1 bg-gradient-to-b from-emerald-50 via-teal-50 to-green-100 rounded-3xl border-4 border-white shadow-xl p-4 sm:p-6 flex flex-col items-center justify-between relative">
        <div className="text-xs font-black text-emerald-800 bg-white/90 px-4 py-1.5 rounded-full border border-emerald-200 shadow-xs mb-3">
          Bantu {currentLevel.animal} menuju ke {currentLevel.goalEmoji} melalui jalan setapak!
        </div>

        {/* Maze Board */}
        <div className={`grid ${gridColsClass} gap-1.5 sm:gap-2 bg-emerald-800/20 p-2.5 sm:p-3 rounded-3xl border-4 border-emerald-700/40 shadow-inner my-auto`}>
          {currentLevel.grid.map((row, r) =>
            row.map((cell, c) => {
              const isHero = pos.r === r && pos.c === c;
              const isGoal = currentLevel.goal.r === r && currentLevel.goal.c === c;
              const isWall = cell === 1;
              const isTrail = pathHistory.includes(`${r},${c}`);

              return (
                <div
                  key={`${r}-${c}`}
                  className={`w-11 h-11 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center font-black transition-all shadow-sm select-none ${
                    isWall
                      ? 'bg-amber-900/80 border-2 border-amber-950 text-amber-200'
                      : isHero
                      ? 'bg-white border-3 border-emerald-500 ring-4 ring-emerald-300 scale-105'
                      : isGoal
                      ? 'bg-yellow-200 border-2 border-yellow-400 animate-pulse'
                      : isTrail
                      ? 'bg-emerald-100/90 border border-emerald-300'
                      : 'bg-white/90 border border-emerald-200/60'
                  }`}
                >
                  {isHero ? (
                    <span className="text-2xl sm:text-3xl animate-bounce-short">{currentLevel.animal}</span>
                  ) : isGoal ? (
                    <span className="text-2xl sm:text-3xl animate-float">{currentLevel.goalEmoji}</span>
                  ) : isWall ? (
                    <span className="text-lg">🪵</span>
                  ) : isTrail ? (
                    <span className="text-xs opacity-50">🐾</span>
                  ) : null}
                </div>
              );
            })
          )}
        </div>

        {/* Direction Controls for Kids */}
        <div className="flex flex-col items-center gap-1.5 mt-3 select-none">
          <button
            onClick={() => handleMove(-1, 0)}
            className="w-14 h-12 rounded-2xl bg-white hover:bg-emerald-100 text-gemdark font-black flex items-center justify-center shadow-md border-2 border-emerald-300 active:scale-95"
            title="Atas (Keyboard: W / ↑)"
          >
            <ArrowUp className="w-6 h-6 text-emerald-700" />
          </button>
          <div className="flex gap-2">
            <button
              onClick={() => handleMove(0, -1)}
              className="w-14 h-12 rounded-2xl bg-white hover:bg-emerald-100 text-gemdark font-black flex items-center justify-center shadow-md border-2 border-emerald-300 active:scale-95"
              title="Kiri (Keyboard: A / ←)"
            >
              <ArrowLeft className="w-6 h-6 text-emerald-700" />
            </button>
            <button
              onClick={() => handleMove(1, 0)}
              className="w-14 h-12 rounded-2xl bg-white hover:bg-emerald-100 text-gemdark font-black flex items-center justify-center shadow-md border-2 border-emerald-300 active:scale-95"
              title="Bawah (Keyboard: S / ↓)"
            >
              <ArrowDown className="w-6 h-6 text-emerald-700" />
            </button>
            <button
              onClick={() => handleMove(0, 1)}
              className="w-14 h-12 rounded-2xl bg-white hover:bg-emerald-100 text-gemdark font-black flex items-center justify-center shadow-md border-2 border-emerald-300 active:scale-95"
              title="Kanan (Keyboard: D / →)"
            >
              <ArrowRight className="w-6 h-6 text-emerald-700" />
            </button>
          </div>
        </div>
      </div>

      {/* Result Modal */}
      <ResultSummaryModal
        isOpen={isFinished}
        gameTitle="Labirin Jejak Sahabat"
        score={score}
        stars={3}
        coinsEarned={coinsEarned}
        correctCount={levels.length}
        totalQuestions={levels.length}
        onPlayAgain={handlePlayAgain}
        onBackToMap={onExit}
      />
    </div>
  );
};
