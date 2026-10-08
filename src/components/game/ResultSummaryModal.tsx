import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, Star, RotateCcw, Compass, Sparkles } from 'lucide-react';
import { audio } from '../../services/audio';

interface ResultSummaryModalProps {
  isOpen: boolean;
  gameTitle: string;
  score: number;
  stars: number;
  coinsEarned: number;
  correctCount: number;
  totalQuestions: number;
  onPlayAgain: () => void;
  onBackToMap: () => void;
}

export const ResultSummaryModal: React.FC<ResultSummaryModalProps> = ({
  isOpen,
  gameTitle,
  score,
  stars,
  coinsEarned,
  correctCount,
  totalQuestions,
  onPlayAgain,
  onBackToMap,
}) => {
  useEffect(() => {
    if (isOpen) {
      audio.playFanfare();
      // Burst celebratory confetti
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FF6B8B', '#FFD166', '#06D6A0', '#118AB2', '#8338EC'],
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border-4 border-gemyellow text-center relative">
        {/* Celebration Trophy Icon */}
        <div className="w-16 h-16 bg-amber-100 text-amber-700 rounded-3xl mx-auto flex items-center justify-center text-3xl shadow-inner mb-3 animate-float border-2 border-amber-300">
          <Trophy className="w-9 h-9 text-amber-600" />
        </div>

        <h3 className="text-2xl font-black text-gemdark">Hore! Selesai! 🎉</h3>
        <p className="text-xs text-gray-500 font-bold mt-0.5 mb-4">{gameTitle}</p>

        {/* Stars row */}
        <div className="flex justify-center items-center gap-2 mb-5">
          {[1, 2, 3].map(s => {
            const isFilled = s <= stars;
            return (
              <div
                key={s}
                className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
                  isFilled
                    ? 'bg-amber-50 border-2 border-gemyellow text-amber-500 scale-110 shadow-sm'
                    : 'bg-gray-100 border-2 border-gray-200 text-gray-300'
                }`}
              >
                <Star className={`w-7 h-7 ${isFilled ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`} />
              </div>
            );
          })}
        </div>

        {/* Stats card */}
        <div className="bg-amber-50/70 border-2 border-amber-200/80 rounded-2xl p-4 mb-5 grid grid-cols-2 gap-3 text-left">
          <div>
            <span className="block text-[10px] font-black uppercase text-amber-700">Skor Akhir</span>
            <span className="text-xl font-black text-gemdark">{score} Poin</span>
          </div>
          <div>
            <span className="block text-[10px] font-black uppercase text-amber-700">Akurasi Jawaban</span>
            <span className="text-xl font-black text-gemdark">{correctCount} / {totalQuestions}</span>
          </div>
          <div className="col-span-2 pt-2 border-t border-amber-200/60 flex items-center justify-between">
            <span className="text-xs font-bold text-gray-700 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Koin Didapatkan:
            </span>
            <span className="text-base font-black text-amber-800">🪙 +{coinsEarned} Koin</span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="space-y-2">
          <button
            onClick={() => {
              audio.playClick();
              onPlayAgain();
            }}
            className="w-full py-3 bg-gemgreen hover:bg-emerald-600 text-white font-black rounded-2xl text-xs shadow-md transition-all flex items-center justify-center gap-2 gem-btn-press"
          >
            <RotateCcw className="w-4 h-4" /> Main Lagi
          </button>
          <button
            onClick={() => {
              audio.playClick();
              onBackToMap();
            }}
            className="w-full py-2.5 bg-gray-100 hover:bg-gray-200 text-gemdark font-black rounded-2xl text-xs transition-colors flex items-center justify-center gap-2"
          >
            <Compass className="w-4 h-4 text-gemblue" /> Kembali ke Peta
          </button>
        </div>
      </div>
    </div>
  );
};
