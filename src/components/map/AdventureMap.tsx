import React from 'react';
import { Play, Sparkles, Star, ArrowRight } from 'lucide-react';
import { ChildProfile, GameId } from '../../types';
import { audio } from '../../services/audio';
import { AvatarDisplay } from '../avatar/AvatarDisplay';

interface AdventureMapProps {
  child: ChildProfile;
  onLaunchGame: (gameId: GameId) => void;
  onGoToMateri: () => void;
  onOpenPhygitalQuests?: () => void;
}

export const AdventureMap: React.FC<AdventureMapProps> = ({
  child,
  onLaunchGame,
  onGoToMateri,
  onOpenPhygitalQuests,
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
    {
      id: 'misi-nyata' as GameId,
      title: 'Pulau Detektif Nyata',
      subtitle: 'Phygital Quests di Rumah',
      domain: 'Dunia Fisik & Keluarga',
      emoji: '🏡',
      color: 'from-amber-500 to-orange-400',
      borderColor: 'border-amber-400',
      textColor: 'text-amber-700',
      desc: 'Kerjakan misi fisik di rumah bersama Ayah dan Bunda (cari bentuk, hidup sehat, peluk keluarga) & raih stempel emas!',
      stars: 3,
      coinsReward: '+30-50 Koin/misi',
      action: onOpenPhygitalQuests || (() => {}),
    },
  ];

  return (
    <div className="space-y-6 w-full">
      {/* Quick Resume Hero Card */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white rounded-2xl sm:rounded-3xl p-4 sm:p-7 shadow-xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-5">
        <div className="relative z-10 text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider mb-1.5 sm:mb-2">
            <Sparkles className="w-3.5 h-3.5 text-yellow-300" /> Peta Petualangan Belajar
          </div>
          <h2 className="text-xl sm:text-3xl font-black">
            Jelajahi Kepulauan Pengetahuan, {child.nickname}!
          </h2>
          <p className="text-xs sm:text-sm text-purple-100 max-w-md mt-1 font-medium">
            Kumpulkan bintang dan koin di setiap pulau untuk menjadi Juara Mingguan di Papan Peringkat.
          </p>
        </div>

        {/* Quick action buttons & companion display */}
        <div className="relative z-10 flex flex-col sm:flex-row items-center gap-2.5 sm:gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2.5 bg-black/20 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-white/20 w-full sm:w-auto justify-center sm:justify-start">
            <AvatarDisplay avatar={child.avatar} equipped={child.equipped} size="sm" />
            <div className="text-left text-xs font-bold leading-tight">
              <span className="block text-yellow-300 font-black">Sahabat Belajar</span>
              <span className="text-[11px] text-pink-200">❤️ {child.buddyHappiness ?? 80}% Senang</span>
            </div>
          </div>

          <button
            onClick={() => {
              audio.playClick();
              onLaunchGame('letus-balon');
            }}
            className="w-full sm:w-auto px-5 sm:px-6 py-3 sm:py-3.5 bg-yellow-400 hover:bg-yellow-300 active:scale-98 text-gemdark font-black rounded-2xl text-xs sm:text-sm shadow-lg transition-all flex items-center justify-center gap-2 gem-btn-press"
          >
            <Play className="w-4 h-4 fill-gemdark" /> Lanjutkan Main Balon
          </button>
        </div>

        {/* Decorative background blurs */}
        <div className="absolute -right-8 -bottom-10 w-44 h-44 bg-pink-400/20 rounded-full blur-xl pointer-events-none"></div>
      </div>

      {/* Islands Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {islands.map(island => (
          <div
            key={island.id}
            className={`bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-6 border-3 ${island.borderColor} shadow-md flex flex-col justify-between gem-card-hover relative overflow-hidden`}
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
