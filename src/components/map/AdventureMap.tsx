import React from 'react';
import { Play, Sparkles, Star, ArrowRight } from 'lucide-react';
import { ChildProfile, GameId } from '../../types';
import { audio } from '../../services/audio';

interface AdventureMapProps {
  child: ChildProfile;
  onLaunchGame: (gameId: GameId) => void;
  onGoToMateri: () => void;
}

export const AdventureMap: React.FC<AdventureMapProps> = ({
  child,
  onLaunchGame,
  onGoToMateri,
}) => {
  const islands = [
    {
      id: 'letus-balon' as GameId,
      title: 'Pulau Angka Ajaib',
      subtitle: 'Letus Balon Matematika',
      domain: 'Numerasi & Berhitung',
      emoji: '🎈',
      color: 'from-pink-500 to-rose-400',
      borderColor: 'border-gempink',
      textColor: 'text-gempink',
      desc: 'Letuskan balon dengan jawaban yang tepat. Tersedia mode santai & 45 detik!',
      stars: 3,
      coinsReward: '+5 Koin/soal',
      action: () => onLaunchGame('letus-balon'),
    },
    {
      id: 'tebak-kata' as GameId,
      title: 'Pulau Huruf Nusantara',
      subtitle: 'Tebak Kata Bahasa Indonesia',
      domain: 'Literasi & Kosakata',
      emoji: '🔤',
      color: 'from-blue-500 to-cyan-400',
      borderColor: 'border-gemblue',
      textColor: 'text-gemblue',
      desc: 'Tebak huruf yang hilang untuk melengkapi nama hewan, buah, dan benda sekitar.',
      stars: 3,
      coinsReward: '+10 Koin/soal',
      action: () => onLaunchGame('tebak-kata'),
    },
    {
      id: 'm1-warna' as GameId,
      title: 'Pulau Usia Dini',
      subtitle: '8 Modul Materi Interaktif',
      domain: 'Karakter & Eksplorasi',
      emoji: '🏝️',
      color: 'from-emerald-500 to-teal-400',
      borderColor: 'border-gemgreen',
      textColor: 'text-gemgreen',
      desc: 'Mengenal warna, bentuk, hewan melompat, suara satwa, memori kartu, dan emosi.',
      stars: 3,
      coinsReward: '+15 Koin/modul',
      action: onGoToMateri,
    },
  ];

  return (
    <div className="space-y-6 w-full">
      {/* Quick Resume Hero Card */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white rounded-3xl p-6 sm:p-7 shadow-xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-5">
        <div className="relative z-10 text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-yellow-300" /> Peta Petualangan Belajar
          </div>
          <h2 className="text-2xl sm:text-3xl font-black">
            Jelajahi Kepulauan Pengetahuan, {child.nickname}!
          </h2>
          <p className="text-xs sm:text-sm text-purple-100 max-w-md mt-1 font-medium">
            Kumpulkan bintang dan koin di setiap pulau untuk menjadi Juara Mingguan di Papan Peringkat.
          </p>
        </div>

        {/* Quick play last island button */}
        <div className="relative z-10 flex gap-3 w-full md:w-auto">
          <button
            onClick={() => {
              audio.playClick();
              onLaunchGame('letus-balon');
            }}
            className="flex-1 md:flex-initial px-6 py-3.5 bg-yellow-400 hover:bg-yellow-300 active:scale-98 text-gemdark font-black rounded-2xl text-xs sm:text-sm shadow-lg transition-all flex items-center justify-center gap-2 gem-btn-press"
          >
            <Play className="w-4 h-4 fill-gemdark" /> Lanjutkan Main Balon
          </button>
        </div>

        {/* Decorative background blurs */}
        <div className="absolute -right-8 -bottom-10 w-44 h-44 bg-pink-400/20 rounded-full blur-xl pointer-events-none"></div>
      </div>

      {/* Islands Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {islands.map(island => (
          <div
            key={island.id}
            className={`bg-white rounded-3xl p-6 border-3 ${island.borderColor} shadow-md flex flex-col justify-between gem-card-hover relative overflow-hidden`}
          >
            {/* Top Island Header */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${island.color} text-white flex items-center justify-center text-3xl shadow-md animate-float`}>
                  {island.emoji}
                </div>
                <div className="text-right">
                  <span className="block text-[10px] font-black uppercase tracking-wider text-gray-400">
                    {island.domain}
                  </span>
                  <div className="flex items-center gap-0.5 justify-end mt-0.5">
                    {[1, 2, 3].map(s => (
                      <Star key={s} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                </div>
              </div>

              <h3 className="text-xl font-black text-gemdark">{island.title}</h3>
              <h4 className={`text-xs font-black ${island.textColor} mt-0.5 mb-2`}>{island.subtitle}</h4>
              <p className="text-xs text-gray-600 font-medium leading-relaxed mb-4">
                {island.desc}
              </p>
            </div>

            {/* Bottom Action Area */}
            <div>
              <div className="flex items-center justify-between text-xs font-bold text-gray-500 mb-3 pt-3 border-t border-gray-100">
                <span>Hadiah Permainan:</span>
                <span className="text-amber-600 font-black">🪙 {island.coinsReward}</span>
              </div>

              <button
                type="button"
                onClick={() => {
                  audio.playClick();
                  island.action();
                }}
                className={`w-full py-3 rounded-2xl font-black text-xs text-white bg-gradient-to-r ${island.color} hover:opacity-95 shadow-md flex items-center justify-center gap-2 gem-btn-press`}
              >
                <Play className="w-4 h-4 fill-white" /> Buka Petualangan <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
