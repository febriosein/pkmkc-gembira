import React, { useState, useEffect } from 'react';
import { Volume2, X, Sparkles, CheckCircle2 } from 'lucide-react';
import { ChildProfile, DifficultyLevel } from '../types';
import { storage } from '../services/storage';
import { audio } from '../services/audio';
import { questionPool } from '../services/questionPool';
import { ResultSummaryModal } from '../components/game/ResultSummaryModal';

interface CocokBayanganGameProps {
  child: ChildProfile;
  difficulty?: DifficultyLevel;
  onExit: () => void;
  onCoinsUpdated: (newCoins: number) => void;
}

interface ShadowItem {
  id: string;
  name: string;
  emoji: string;
  category: string;
}

const SHADOW_BANK: ShadowItem[] = [
  // Hewan
  { id: 'sb_gajah', name: 'Gajah Belalai', emoji: '🐘', category: 'Hewan' },
  { id: 'sb_singa', name: 'Singa Berani', emoji: '🦁', category: 'Hewan' },
  { id: 'sb_kucing', name: 'Kucing Imut', emoji: '🐱', category: 'Hewan' },
  { id: 'sb_kelinci', name: 'Kelinci Putih', emoji: '🐰', category: 'Hewan' },
  { id: 'sb_kupu', name: 'Kupu-Kupu', emoji: '🦋', category: 'Hewan' },
  { id: 'sb_katak', name: 'Katak Hijau', emoji: '🐸', category: 'Hewan' },
  { id: 'sb_jerapah', name: 'Jerapah Tinggi', emoji: '🦒', category: 'Hewan' },
  { id: 'sb_lumba', name: 'Lumba-Lumba', emoji: '🐬', category: 'Hewan' },
  { id: 'sb_burunghantu', name: 'Burung Hantu', emoji: '🦉', category: 'Hewan' },
  { id: 'sb_paus', name: 'Paus Biru', emoji: '🐋', category: 'Hewan' },
  { id: 'sb_pinguin', name: 'Pinguin Lucu', emoji: '🐧', category: 'Hewan' },
  { id: 'sb_koala', name: 'Koala Pohon', emoji: '🐨', category: 'Hewan' },

  // Kendaraan
  { id: 'sb_pesawat', name: 'Pesawat Terbang', emoji: '✈️', category: 'Kendaraan' },
  { id: 'sb_kapal', name: 'Kapal Layar', emoji: '⛵', category: 'Kendaraan' },
  { id: 'sb_mobil', name: 'Mobil Balap', emoji: '🏎️', category: 'Kendaraan' },
  { id: 'sb_roket', name: 'Roket Angkasa', emoji: '🚀', category: 'Kendaraan' },
  { id: 'sb_kereta', name: 'Kereta Api', emoji: '🚂', category: 'Kendaraan' },
  { id: 'sb_sepeda', name: 'Sepeda Gowes', emoji: '🚲', category: 'Kendaraan' },
  { id: 'sb_helikopter', name: 'Helikopter', emoji: '🚁', category: 'Kendaraan' },
  { id: 'sb_bus', name: 'Bus Sekolah', emoji: '🚌', category: 'Kendaraan' },

  // Benda Alam & Langit
  { id: 'sb_matahari', name: 'Bunga Matahari', emoji: '🌻', category: 'Alam' },
  { id: 'sb_bintang', name: 'Bintang Kejora', emoji: '⭐', category: 'Alam' },
  { id: 'sb_pohon', name: 'Pohon Kelapa', emoji: '🌴', category: 'Alam' },
  { id: 'sb_pelangi', name: 'Pelangi Indah', emoji: '🌈', category: 'Alam' },
  { id: 'sb_bulan', name: 'Bulan Sabit', emoji: '🌙', category: 'Alam' },
  { id: 'sb_jamur', name: 'Jamur Hutan', emoji: '🍄', category: 'Alam' },
  { id: 'sb_gunung', name: 'Gunung Berapi', emoji: '🌋', category: 'Alam' },
  { id: 'sb_api', name: 'Api Unggun', emoji: '🔥', category: 'Alam' },

  // Buah, Alat & Mainan
  { id: 'sb_apel', name: 'Apel Merah', emoji: '🍎', category: 'Buah' },
  { id: 'sb_pisang', name: 'Pisang Manis', emoji: '🍌', category: 'Buah' },
  { id: 'sb_gitar', name: 'Gitar Musik', emoji: '🎸', category: 'Alat Musik' },
  { id: 'sb_terompet', name: 'Terompet Kuningan', emoji: '🎺', category: 'Alat Musik' },
  { id: 'sb_payung', name: 'Payung Warna', emoji: '☂️', category: 'Benda' },
  { id: 'sb_kunci', name: 'Kunci Rahasia', emoji: '🗝️', category: 'Benda' },
  { id: 'sb_lonceng', name: 'Lonceng Emas', emoji: '🔔', category: 'Benda' },
  { id: 'sb_mahkota', name: 'Mahkota Raja', emoji: '👑', category: 'Benda' },
];

export const CocokBayanganGame: React.FC<CocokBayanganGameProps> = ({
  child,
  difficulty = 'mudah',
  onExit,
  onCoinsUpdated,
}) => {
  const multiplier = questionPool.getDifficultyMultiplier(difficulty);
  const diffInfo = questionPool.getDifficultyInfo(difficulty);

  const itemsPerSet = difficulty === 'mudah' ? 3 : difficulty === 'sedang' ? 4 : 5;
  const totalSets = 3;
  const totalItemsNeeded = itemsPerSet * totalSets;

  const getCandidateSets = (): ShadowItem[][] => {
    const freshItems = questionPool.getFreshQuestions(SHADOW_BANK, child.id, `shadow_${difficulty}`, totalItemsNeeded);
    const setsList: ShadowItem[][] = [];
    for (let i = 0; i < totalSets; i++) {
      setsList.push(freshItems.slice(i * itemsPerSet, (i + 1) * itemsPerSet));
    }
    return setsList;
  };

  const [sets, setSets] = useState<ShadowItem[][]>(() => getCandidateSets());
  const [currentSetIndex, setCurrentSetIndex] = useState(0);
  const [matchedIds, setMatchedIds] = useState<string[]>([]);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [coinsEarned, setCoinsEarned] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [sessionId] = useState(() => 'sess-bayangan-' + Date.now());

  const currentSet = sets[currentSetIndex] || [];

  useEffect(() => {
    setMatchedIds([]);
    setSelectedCardId(null);
    audio.speak('Cocokkan objek warna-warni dengan siluet bayangannya yang pas!');
  }, [currentSetIndex]);

  const handleMatch = (shadowItem: ShadowItem) => {
    if (!selectedCardId || matchedIds.includes(shadowItem.id)) return;

    const isMatch = selectedCardId === shadowItem.id;

    // Record attempt
    storage.recordAttempt({
      sessionId,
      childId: child.id,
      questionId: 'shadow-' + shadowItem.id,
      domain: 'warna-bentuk',
      userAnswer: shadowItem.name,
      isCorrect: isMatch,
      responseMs: 2500,
      clientEventId: 'evt-shadow-' + Date.now(),
    });

    if (isMatch) {
      audio.playSnapMatch();
      audio.playSuccess();
      const nextMatched = [...matchedIds, shadowItem.id];
      setMatchedIds(nextMatched);
      setSelectedCardId(null);
      setScore(prev => prev + 20);

      // Reward coins scaled by difficulty multiplier
      const coinReward = Math.round(10 * multiplier);
      if (storage.canRewardQuestion(sessionId, shadowItem.id)) {
        const newBalance = storage.recordCoinDelta(child.id, coinReward, `Cocok Bayangan (${diffInfo.label}): Tepat`, sessionId);
        setCoinsEarned(prev => prev + coinReward);
        onCoinsUpdated(newBalance);
      }

      // Check if all shadows in this set are matched
      if (nextMatched.length === currentSet.length) {
        setTimeout(() => {
          if (currentSetIndex + 1 >= sets.length) {
            finishSession();
          } else {
            setCurrentSetIndex(prev => prev + 1);
          }
        }, 1200);
      }
    } else {
      audio.playGentleBoing();
    }
  };

  const finishSession = () => {
    setIsFinished(true);
    const bonus = Math.round(40 * multiplier);
    const newBalance = storage.recordCoinDelta(child.id, bonus, `Bonus Selesai Cocok Bayangan (${diffInfo.label})`, sessionId);
    setCoinsEarned(prev => prev + bonus);
    onCoinsUpdated(newBalance);

    storage.recordCompletedSession({
      childId: child.id,
      gameId: 'cocok-bayangan',
      domain: 'warna-bentuk',
      startedAt: new Date(Date.now() - 40000).toISOString(),
      score: score + 20,
      stars: 3,
      coinsEarned: coinsEarned + bonus,
      totalQuestions: totalItemsNeeded,
      correctCount: totalItemsNeeded,
    });
  };

  const handlePlayAgain = () => {
    const nextSets = getCandidateSets();
    setSets(nextSets);
    setCurrentSetIndex(0);
    setMatchedIds([]);
    setSelectedCardId(null);
    setScore(0);
    setCoinsEarned(0);
    setIsFinished(false);
  };

  const gridColsClass = itemsPerSet === 3 ? 'grid-cols-3' : itemsPerSet === 4 ? 'grid-cols-4' : 'grid-cols-5';

  return (
    <div className="max-w-4xl mx-auto w-full flex-1 flex flex-col justify-between py-2">
      {/* Header Bar */}
      <div className="bg-white/95 rounded-3xl p-4 border-2 border-amber-300 shadow-md flex items-center justify-between mb-4">
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
                <span>🧩 Cocok Bayangan Ajaib</span>
              </h3>
              <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${diffInfo.badge}`}>
                {diffInfo.label} • ×{multiplier}
              </span>
            </div>
            <span className="text-[10px] text-gray-500 font-bold">
              Set {currentSetIndex + 1} dari {totalSets} • Terpasang {matchedIds.length} / {itemsPerSet}
            </span>
          </div>
        </div>

        <div className="bg-amber-50 text-amber-900 border border-amber-200 px-3.5 py-1.5 rounded-2xl font-black text-xs flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" /> {score} Poin
        </div>
      </div>

      {/* Main Matching Area */}
      <div className="flex-1 bg-gradient-to-b from-amber-50 via-orange-50/40 to-yellow-50 rounded-3xl border-4 border-white shadow-xl p-5 sm:p-7 flex flex-col items-center justify-between text-center relative">
        <div className="bg-white/95 backdrop-blur-md px-5 py-2.5 rounded-2xl border-2 border-amber-200 shadow-sm max-w-md w-full mb-3 flex items-center justify-between">
          <span className="text-xs font-black uppercase text-amber-700 tracking-wider">
            {selectedCardId ? '👉 Sekarang Ketuk Bayangan yang Pas!' : '1. Pilih salah satu kartu warna di bawah'}
          </span>
          <button
            onClick={() => audio.speak('Cocokkan objek warna-warni dengan siluet bayangannya yang pas!')}
            className="p-1 rounded-full bg-amber-100 hover:bg-amber-200 text-amber-800 transition-colors"
            title="Dengarkan Petunjuk"
          >
            <Volume2 className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Top Shadows Target Row */}
        <div className={`w-full max-w-2xl grid ${gridColsClass} gap-3 sm:gap-4 my-2`}>
          {currentSet.map(item => {
            const isMatched = matchedIds.includes(item.id);
            return (
              <div
                key={item.id}
                onClick={() => handleMatch(item)}
                className={`p-3 sm:p-5 rounded-3xl border-4 flex flex-col items-center justify-center transition-all cursor-pointer shadow-md select-none ${
                  isMatched
                    ? 'bg-amber-100 border-amber-400 ring-4 ring-amber-300 scale-102'
                    : selectedCardId
                    ? 'bg-gray-800 border-dashed border-amber-400 hover:scale-105 animate-pulse'
                    : 'bg-gray-800 border-gray-600'
                }`}
              >
                {isMatched ? (
                  <div className="text-4xl sm:text-5xl animate-bounce-short">
                    {item.emoji}
                  </div>
                ) : (
                  <div className="text-4xl sm:text-5xl filter grayscale brightness-0 opacity-40">
                    {item.emoji}
                  </div>
                )}
                <span className={`text-[10px] font-black mt-1.5 uppercase tracking-wider truncate w-full ${
                  isMatched ? 'text-amber-900' : 'text-gray-400'
                }`}>
                  {isMatched ? item.name : 'Bayangan ?'}
                </span>
              </div>
            );
          })}
        </div>

        {/* Bottom Colorful Source Cards */}
        <div className="w-full max-w-2xl pt-4 border-t-2 border-amber-200/60">
          <span className="block text-xs font-bold text-gray-500 mb-2">Pilihan Objek Berwarna:</span>
          <div className={`grid ${gridColsClass} gap-2.5 sm:gap-3`}>
            {currentSet.map(item => {
              const isMatched = matchedIds.includes(item.id);
              const isSelected = selectedCardId === item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    audio.playClick();
                    setSelectedCardId(item.id);
                  }}
                  disabled={isMatched}
                  className={`p-2.5 sm:p-3.5 rounded-2xl border-3 flex flex-col items-center justify-center font-black transition-all shadow-sm select-none ${
                    isMatched
                      ? 'bg-gray-100 border-gray-200 opacity-40 cursor-not-allowed'
                      : isSelected
                      ? 'bg-amber-200 border-amber-500 ring-4 ring-amber-300 scale-105'
                      : 'bg-white hover:bg-amber-50 border-gray-200 hover:border-amber-400'
                  }`}
                >
                  <span className="text-3xl sm:text-4xl mb-1">{item.emoji}</span>
                  <span className="text-[11px] sm:text-xs text-gemdark truncate w-full">{item.name}</span>
                  {isMatched && (
                    <span className="text-[9px] text-emerald-600 font-bold flex items-center gap-0.5 mt-0.5">
                      <CheckCircle2 className="w-3 h-3" /> Cocok
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Result Modal */}
      <ResultSummaryModal
        isOpen={isFinished}
        gameTitle="Cocok Bayangan Ajaib"
        score={score}
        stars={3}
        coinsEarned={coinsEarned}
        correctCount={totalItemsNeeded}
        totalQuestions={totalItemsNeeded}
        onPlayAgain={handlePlayAgain}
        onBackToMap={onExit}
      />
    </div>
  );
};
