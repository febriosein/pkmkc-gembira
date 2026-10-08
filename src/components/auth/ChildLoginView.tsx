import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, Play, Volume2, UserCheck, Star } from 'lucide-react';
import { ChildProfile, AgeBand } from '../../types';
import { storage } from '../../services/storage';
import { audio } from '../../services/audio';

interface ChildLoginViewProps {
  onLoginSuccess: (child: ChildProfile) => void;
}

interface AnimalOption {
  emoji: string;
  name: string;
  title: string;
}

const ANIMAL_AVATARS: AnimalOption[] = [
  { emoji: '🦊', name: 'Rubah', title: 'Rubah Pintar' },
  { emoji: '🦁', name: 'Singa', title: 'Singa Berani' },
  { emoji: '🐼', name: 'Panda', title: 'Panda Ceria' },
  { emoji: '🐰', name: 'Kelinci', title: 'Kelinci Lucu' },
  { emoji: '🐱', name: 'Kucing', title: 'Kucing Manis' },
  { emoji: '🐶', name: 'Anjing', title: 'Anjing Setia' },
  { emoji: '🐵', name: 'Monyet', title: 'Monyet Lincah' },
  { emoji: '🐨', name: 'Koala', title: 'Koala Santun' },
  { emoji: '🐬', name: 'Lumba', title: 'Lumba Pintar' },
  { emoji: '🦉', name: 'Burung Hantu', title: 'Burung Bijak' },
  { emoji: '🐸', name: 'Katak', title: 'Katak Lompat' },
  { emoji: '🐯', name: 'Harimau', title: 'Harimau Tangguh' },
  { emoji: '🦒', name: 'Jerapah', title: 'Jerapah Ramah' },
  { emoji: '🐘', name: 'Gajah', title: 'Gajah Sahabat' },
  { emoji: '🐧', name: 'Pinguin', title: 'Pinguin Ceria' },
  { emoji: '🦄', name: 'Kuda Ajaib', title: 'Kuda Ajaib' },
];

export const ChildLoginView: React.FC<ChildLoginViewProps> = ({ onLoginSuccess }) => {
  const [nickname, setNickname] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState<AnimalOption>(ANIMAL_AVATARS[0]);
  const [selectedAgeBand, setSelectedAgeBand] = useState<AgeBand>('paud');
  const [existingChildren, setExistingChildren] = useState<ChildProfile[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const children = storage.getChildren();
    setExistingChildren(children);

    // Friendly speech greeting on load
    const timer = setTimeout(() => {
      audio.speak('Halo sahabat cilik! Selamat datang di GEMBIRA! Tulis namamu dan pilih avatar hewan kesukaanmu ya!');
    }, 600);

    return () => clearTimeout(timer);
  }, []);

  const handleSelectAvatar = (animal: AnimalOption) => {
    audio.playPop();
    setSelectedAvatar(animal);
    audio.speak(`Kamu memilih avatar ${animal.title}!`);
  };

  const handleSelectAgeBand = (band: AgeBand) => {
    audio.playClick();
    setSelectedAgeBand(band);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = nickname.trim();

    if (!trimmed) {
      setError('Yuk tulis nama panggilanmu dulu ya!');
      audio.playGentleBoing();
      audio.speak('Tulis nama panggilanmu dulu ya!');
      return;
    }

    if (trimmed.length < 2) {
      setError('Nama panggilan minimal 2 huruf ya!');
      audio.playGentleBoing();
      return;
    }

    setError('');

    // Trigger celebratory confetti
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });

    audio.playSuccess();

    // Create child profile
    const newChild = storage.addChild(trimmed, selectedAvatar.emoji, selectedAgeBand);
    storage.setActiveChildId(newChild.id);
    storage.setLoggedIn(true);

    audio.speak(`Halo ${trimmed}! Selamat berpetualang di dunia GEMBIRA!`);

    setTimeout(() => {
      onLoginSuccess(newChild);
    }, 600);
  };

  const handleQuickLogin = (child: ChildProfile) => {
    audio.playClick();
    audio.playSuccess();
    storage.setActiveChildId(child.id);
    storage.setLoggedIn(true);

    confetti({
      particleCount: 60,
      spread: 60,
      origin: { y: 0.6 },
    });

    audio.speak(`Selamat datang kembali, ${child.nickname}!`);

    setTimeout(() => {
      onLoginSuccess(child);
    }, 400);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 text-white flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      {/* Decorative Floating Background Elements */}
      <div className="absolute top-10 left-10 w-64 h-64 bg-pink-500/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-yellow-400/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute top-1/2 left-1/4 w-48 h-48 bg-blue-500/20 rounded-full blur-2xl pointer-events-none"></div>

      <div className="max-w-2xl w-full bg-white/95 backdrop-blur-md rounded-2xl sm:rounded-3xl p-4 xs:p-5 sm:p-8 shadow-2xl border-4 border-yellow-300 text-gemdark relative z-10 my-3 sm:my-4">
        {/* Header Branding */}
        <div className="flex flex-col items-center text-center mb-4 sm:mb-6">
          <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-2xl sm:rounded-3xl overflow-hidden border-3 sm:border-4 border-gempurple/30 shadow-xl mb-2 sm:mb-3 animate-float bg-white p-1">
            <img
              src="/logo.jpg"
              alt="Logo GEMBIRA"
              className="w-full h-full object-contain rounded-xl sm:rounded-2xl"
            />
          </div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-3xl font-black text-gemdark tracking-tight">
              Selamat Datang di <span className="text-gempurple">GEMBIRA</span>!
            </h1>
          </div>
          <p className="text-[11px] sm:text-sm text-gray-600 font-bold mt-0.5 sm:mt-1 max-w-md">
            Petualangan Belajar Interaktif Ramah Anak Usia Dini & SD
          </p>
        </div>

        {/* Live Child ID Card Preview */}
        <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-amber-400 rounded-2xl sm:rounded-3xl p-3 sm:p-4 text-white shadow-lg mb-4 sm:mb-6 flex items-center justify-between gap-2.5 sm:gap-3 border-2 border-white/60">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white/20 backdrop-blur-md rounded-xl sm:rounded-2xl border-2 border-white/40 flex items-center justify-center text-3xl sm:text-4xl shadow-md animate-bounce-short flex-shrink-0">
              {selectedAvatar.emoji}
            </div>
            <div>
              <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-purple-100 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-yellow-300" /> Kartu Petualang
              </span>
              <h3 className="text-base sm:text-xl font-black leading-tight truncate max-w-[130px] xs:max-w-[180px] sm:max-w-xs">
                {nickname.trim() ? nickname.trim() : 'Petualang Cilik'}
              </h3>
              <span className="text-[10px] sm:text-[11px] font-bold text-yellow-200">
                Sahabat {selectedAvatar.title}
              </span>
            </div>
          </div>

          <div className="bg-black/20 backdrop-blur-md px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl sm:rounded-2xl border border-white/30 text-right flex-shrink-0">
            <span className="block text-[8px] sm:text-[9px] text-purple-100 font-bold uppercase">Hadiah Sambutan</span>
            <span className="text-[11px] sm:text-sm font-black text-yellow-300 flex items-center justify-end gap-1">
              🪙 +50 Koin
            </span>
          </div>
        </div>

        {/* Returning Children Section (If Any Exist) */}
        {existingChildren.length > 0 && (
          <div className="mb-6 pb-5 border-b-2 border-gray-100">
            <span className="block text-xs font-black uppercase text-gray-500 tracking-wider mb-2 flex items-center gap-1.5">
              <UserCheck className="w-3.5 h-3.5 text-gempurple" /> Sudah Pernah Bermain? Pilih Karaktermu:
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {existingChildren.map(child => (
                <button
                  type="button"
                  key={child.id}
                  onClick={() => handleQuickLogin(child)}
                  className="p-2.5 rounded-2xl border-2 border-purple-200 hover:border-gempurple bg-purple-50/50 hover:bg-purple-100 transition-all flex items-center gap-2 text-left gem-card-hover gem-btn-press shadow-xs"
                >
                  <span className="text-2xl">{child.avatar}</span>
                  <div className="overflow-hidden">
                    <span className="block text-xs font-black text-gemdark truncate">{child.nickname}</span>
                    <span className="text-[10px] text-amber-700 font-bold">🪙 {child.coinsBalance}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Main Login / Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="bg-red-50 text-red-600 border border-red-200 text-xs font-bold rounded-2xl p-3 text-center animate-wiggle">
              {error}
            </div>
          )}

          {/* 1. Name Input */}
          <div>
            <label className="block text-xs font-black uppercase text-gray-700 mb-1.5 flex items-center justify-between">
              <span>1. Siapa Nama Panggilanmu?</span>
              {nickname.trim() && (
                <button
                  type="button"
                  onClick={() => audio.speak(`Halo ${nickname.trim()}!`)}
                  className="text-[11px] text-gempurple hover:underline flex items-center gap-1 font-bold"
                >
                  <Volume2 className="w-3.5 h-3.5" /> Dengarkan
                </button>
              )}
            </label>
            <input
              type="text"
              value={nickname}
              onChange={e => {
                setNickname(e.target.value);
                if (error) setError('');
              }}
              maxLength={18}
              placeholder="Ketik nama panggilanmu (contoh: Budi, Aisyah, Raka)..."
              className="w-full px-4 py-3 rounded-2xl border-3 border-purple-200 focus:border-gempurple focus:outline-none focus:ring-4 focus:ring-purple-100 font-black text-base text-gemdark placeholder:text-gray-400 placeholder:font-semibold transition-all shadow-inner"
              autoFocus
            />
          </div>

          {/* 2. Animal Avatar Picker */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-black uppercase text-gray-700">
                2. Pilih Sahabat Avatar Hewanmu:
              </label>
              <span className="text-[11px] font-black text-gempurple bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200">
                {selectedAvatar.emoji} {selectedAvatar.title}
              </span>
            </div>

            <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 bg-purple-50/60 p-3 rounded-2xl border-2 border-purple-100">
              {ANIMAL_AVATARS.map(animal => {
                const isSelected = selectedAvatar.emoji === animal.emoji;
                return (
                  <button
                    type="button"
                    key={animal.emoji}
                    onClick={() => handleSelectAvatar(animal)}
                    className={`aspect-square rounded-2xl flex flex-col items-center justify-center p-1.5 transition-all gem-btn-press ${
                      isSelected
                        ? 'bg-gradient-to-tr from-purple-500 to-pink-500 text-white scale-110 shadow-lg ring-4 ring-yellow-300'
                        : 'bg-white hover:bg-purple-100/70 border-2 border-purple-200 hover:border-purple-400 text-gemdark shadow-xs'
                    }`}
                    title={animal.title}
                  >
                    <span className="text-3xl sm:text-2xl">{animal.emoji}</span>
                    <span className={`text-[8px] font-black truncate w-full text-center mt-0.5 ${
                      isSelected ? 'text-white' : 'text-gray-500'
                    }`}>
                      {animal.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. School / Age Level */}
          <div>
            <label className="block text-xs font-black uppercase text-gray-700 mb-1.5">
              3. Pilih Tingkat Belajarmu:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <button
                type="button"
                onClick={() => handleSelectAgeBand('paud')}
                className={`p-3 rounded-2xl border-3 flex items-center gap-2.5 transition-all text-left ${
                  selectedAgeBand === 'paud'
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-900 ring-2 ring-emerald-300 shadow-sm'
                    : 'border-gray-200 bg-white hover:bg-gray-50 text-gray-700'
                }`}
              >
                <span className="text-2xl">🟢</span>
                <div>
                  <span className="block text-xs font-black">PAUD / TK</span>
                  <span className="text-[10px] text-gray-500 font-bold">Usia 4–6 Tahun</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleSelectAgeBand('sd-fase-a')}
                className={`p-3 rounded-2xl border-3 flex items-center gap-2.5 transition-all text-left ${
                  selectedAgeBand === 'sd-fase-a'
                    ? 'border-blue-500 bg-blue-50 text-blue-900 ring-2 ring-blue-300 shadow-sm'
                    : 'border-gray-200 bg-white hover:bg-gray-50 text-gray-700'
                }`}
              >
                <span className="text-2xl">🔵</span>
                <div>
                  <span className="block text-xs font-black">SD Kelas 1–2</span>
                  <span className="text-[10px] text-gray-500 font-bold">Usia 7–8 Tahun</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleSelectAgeBand('sd-fase-b')}
                className={`p-3 rounded-2xl border-3 flex items-center gap-2.5 transition-all text-left ${
                  selectedAgeBand === 'sd-fase-b'
                    ? 'border-purple-500 bg-purple-50 text-purple-900 ring-2 ring-purple-300 shadow-sm'
                    : 'border-gray-200 bg-white hover:bg-gray-50 text-gray-700'
                }`}
              >
                <span className="text-2xl">🟣</span>
                <div>
                  <span className="block text-xs font-black">SD Kelas 3–6</span>
                  <span className="text-[10px] text-gray-500 font-bold">Usia 9–12 Tahun</span>
                </div>
              </button>
            </div>
          </div>

          {/* Submit Action Button */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-4 rounded-3xl bg-gradient-to-r from-yellow-400 via-amber-400 to-orange-400 hover:from-yellow-300 hover:to-orange-300 active:scale-98 text-gemdark font-black text-base sm:text-lg shadow-xl hover:shadow-2xl transition-all flex items-center justify-center gap-2 border-3 border-amber-500/30 gem-btn-press"
            >
              <Play className="w-5 h-5 fill-gemdark" />
              Mulai Petualangan Seru! 🚀
            </button>
          </div>
        </form>

        <div className="text-center mt-4">
          <p className="text-[11px] text-gray-400 font-bold flex items-center justify-center gap-1">
            <Star className="w-3 h-3 text-amber-400 fill-amber-400" /> GEMBIRA • PKM-KC 2026 • Tanpa Iklan & Aman untuk Anak
          </p>
        </div>
      </div>
    </div>
  );
};
