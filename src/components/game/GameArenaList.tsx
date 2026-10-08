import React, { useState } from 'react';
import { Play, Sparkles, Gamepad2, Star } from 'lucide-react';
import { GameId } from '../../types';
import { audio } from '../../services/audio';

interface GameArenaListProps {
  onSelectGame: (gameId: GameId) => void;
}

type GameCategory = 'all' | 'math' | 'word' | 'music' | 'puzzle';

interface GameInfo {
  id: GameId;
  title: string;
  subtitle: string;
  category: 'math' | 'word' | 'music' | 'puzzle';
  categoryLabel: string;
  emoji: string;
  ageBand: string;
  color: string;
  borderColor: string;
  textColor: string;
  desc: string;
  reward: string;
}

const ALL_GAMES: GameInfo[] = [
  {
    id: 'letus-balon',
    title: 'Letus Balon Matematika Deluxe',
    subtitle: 'Numerasi & Hitung Cepat',
    category: 'math',
    categoryLabel: 'Hitung & Angka',
    emoji: '🎈',
    ageBand: 'Semua Usia (PAUD - SD)',
    color: 'from-pink-500 to-rose-400',
    borderColor: 'border-gempink',
    textColor: 'text-gempink',
    desc: 'Pecahkan balon jawaban yang tepat dengan efek combo streak beruntun dan bantuan visual untuk usia dini.',
    reward: '+5 Koin/soal (+Combo)',
  },
  {
    id: 'tangkap-buah',
    title: 'Tangkap Buah Matematika',
    subtitle: 'Refleks & Koordinasi Berhitung',
    category: 'math',
    categoryLabel: 'Hitung & Angka',
    emoji: '🍎',
    ageBand: 'PAUD - SD Fase A',
    color: 'from-emerald-500 to-green-400',
    borderColor: 'border-gemgreen',
    textColor: 'text-gemgreen',
    desc: 'Geser keranjang buah ke kiri dan kanan untuk menangkap buah jatuh dengan hasil hitung yang pas!',
    reward: '+8 Koin/tangkap',
  },
  {
    id: 'tebak-kata',
    title: 'Susun Kata Nusantara Deluxe',
    subtitle: 'Literasi & Kosakata Baku',
    category: 'word',
    categoryLabel: 'Bahasa & Kata',
    emoji: '🔤',
    ageBand: 'Semua Usia',
    color: 'from-blue-500 to-cyan-400',
    borderColor: 'border-gemblue',
    textColor: 'text-gemblue',
    desc: 'Rangkai huruf yang hilang dari 50+ kosakata bahasa Indonesia lengkap dengan pelafalan suara per huruf.',
    reward: '+10 Koin/soal',
  },
  {
    id: 'orkestra-musik',
    title: 'Orkestra Melodi Ajaib',
    subtitle: 'Xilofon Nada Satwa (Simon Says)',
    category: 'music',
    categoryLabel: 'Musik & Memori',
    emoji: '🎹',
    ageBand: 'Semua Usia',
    color: 'from-indigo-500 to-purple-400',
    borderColor: 'border-gempurple',
    textColor: 'text-gempurple',
    desc: 'Dengarkan pola tangga nada hewan dan tirukan ketukannya untuk melatih memori auditori dan ritme musik.',
    reward: '+10 Koin/ronde',
  },
  {
    id: 'cocok-bayangan',
    title: 'Cocok Bayangan Ajaib',
    subtitle: 'Persepsi Visual Bentuk & Siluet',
    category: 'puzzle',
    categoryLabel: 'Visual & Spasial',
    emoji: '🧩',
    ageBand: 'PAUD & SD Fase A',
    color: 'from-amber-500 to-yellow-400',
    borderColor: 'border-gemyellow',
    textColor: 'text-amber-800',
    desc: 'Temukan pasangan siluet bayangan hitam hewan dan kendaraan dengan kartu objek berwarna-warni.',
    reward: '+10 Koin/cocok',
  },
  {
    id: 'labirin-satwa',
    title: 'Labirin Jejak Sahabat',
    subtitle: 'Perencanaan Arah Spasial',
    category: 'puzzle',
    categoryLabel: 'Visual & Spasial',
    emoji: '🐾',
    ageBand: 'Semua Usia',
    color: 'from-teal-500 to-emerald-400',
    borderColor: 'border-emerald-500',
    textColor: 'text-emerald-700',
    desc: 'Bantu anak kelinci dan kucing menemukan jalan pulang melalui jalur berpagar menggunakan tombol arah panah.',
    reward: '+12 Koin/level',
  },
];

export const GameArenaList: React.FC<GameArenaListProps> = ({ onSelectGame }) => {
  const [activeCategory, setActiveCategory] = useState<GameCategory>('all');

  const categories: { id: GameCategory; label: string; icon: string }[] = [
    { id: 'all', label: 'Semua Game (6)', icon: '🌟' },
    { id: 'math', label: 'Hitung & Angka', icon: '🔢' },
    { id: 'word', label: 'Bahasa & Kata', icon: '🔤' },
    { id: 'music', label: 'Musik & Memori', icon: '🎹' },
    { id: 'puzzle', label: 'Visual & Spasial', icon: '🧩' },
  ];

  const filteredGames = ALL_GAMES.filter(g => activeCategory === 'all' || g.category === activeCategory);

  return (
    <div className="space-y-6 w-full">
      {/* Header */}
      <div className="text-center max-w-xl mx-auto mb-4">
        <div className="inline-flex items-center gap-1.5 bg-pink-100 text-gempink px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider mb-2">
          <Gamepad2 className="w-3.5 h-3.5" /> 6 Arena Game Edukatif Anak
        </div>
        <h3 className="text-2xl sm:text-3xl font-black text-gemdark">
          Arena Game Belajar Interaktif
        </h3>
        <p className="text-xs sm:text-sm text-gray-500 font-semibold mt-1">
          Pilih permainan favoritmu dan tantang dirimu untuk meraih bintang 3 dan koin emas!
        </p>
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap justify-center gap-2 max-w-2xl mx-auto">
        {categories.map(cat => {
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => {
                audio.playClick();
                setActiveCategory(cat.id);
              }}
              className={`px-4 py-2 rounded-2xl text-xs font-black flex items-center gap-1.5 transition-all gem-btn-press ${
                isActive
                  ? 'bg-gempurple text-white shadow-md scale-102 ring-2 ring-gempurple/20'
                  : 'bg-white hover:bg-gray-100 text-gray-600 border border-gray-200'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Grid of 6 Games */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredGames.map(game => (
          <div
            key={game.id}
            className={`bg-white rounded-3xl p-5 border-3 ${game.borderColor} shadow-md flex flex-col justify-between gem-card-hover relative`}
          >
            <div>
              {/* Top Row: Emoji Icon + Age Badge */}
              <div className="flex items-center justify-between mb-3">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${game.color} text-white flex items-center justify-center text-3xl shadow-md animate-float`}>
                  {game.emoji}
                </div>
                <div className="text-right">
                  <span className="block text-[10px] font-black uppercase text-gray-400">
                    {game.categoryLabel}
                  </span>
                  <span className="inline-block bg-gray-100 text-gray-700 font-bold text-[10px] px-2 py-0.5 rounded-full mt-0.5">
                    {game.ageBand}
                  </span>
                </div>
              </div>

              <h4 className="text-lg font-black text-gemdark mb-0.5 leading-snug">{game.title}</h4>
              <p className={`text-xs font-bold ${game.textColor} mb-2`}>{game.subtitle}</p>
              <p className="text-xs text-gray-600 font-medium leading-relaxed mb-4">
                {game.desc}
              </p>
            </div>

            {/* Bottom: Reward & Start button */}
            <div className="pt-3 border-t border-gray-100">
              <div className="flex items-center justify-between text-xs font-bold text-gray-500 mb-2.5">
                <span className="flex items-center gap-1 text-amber-700 font-black">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" /> {game.reward}
                </span>
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3].map(s => (
                    <Star key={s} className="w-3 h-3 fill-amber-400 text-amber-400" />
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  audio.playClick();
                  onSelectGame(game.id);
                }}
                className={`w-full py-3 rounded-2xl font-black text-xs text-white bg-gradient-to-r ${game.color} hover:opacity-95 shadow-md flex items-center justify-center gap-2 gem-btn-press`}
              >
                <Play className="w-4 h-4 fill-white" /> Mainkan Game
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
