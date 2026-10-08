import React, { useState } from 'react';
import { Trophy, ShieldCheck, RefreshCw, Award } from 'lucide-react';
import { ChildProfile, LeaderboardEntry } from '../../types';
import { audio } from '../../services/audio';
import { AvatarDisplay } from '../avatar/AvatarDisplay';

interface WeeklyLeaderboardProps {
  currentChild: ChildProfile;
  onOpenAchievementModal?: () => void;
}

// Seed mock top learners for healthy gamification
const INITIAL_LEADERBOARD_ENTRIES: LeaderboardEntry[] = [
  { id: 'lb-1', nickname: 'Alika Ceria', avatar: '🐱', weeklyCoins: 285, totalSessions: 14 },
  { id: 'lb-2', nickname: 'Kenzo Hebat', avatar: '🦁', weeklyCoins: 240, totalSessions: 11 },
  { id: 'lb-3', nickname: 'Nara Pintar', avatar: '🐼', weeklyCoins: 195, totalSessions: 9 },
  { id: 'lb-4', nickname: 'Raffa Juara', avatar: '🦖', weeklyCoins: 160, totalSessions: 8 },
  { id: 'lb-5', nickname: 'Zahra Cerdas', avatar: '🐰', weeklyCoins: 145, totalSessions: 7 },
  { id: 'lb-6', nickname: 'Fathan Jago', avatar: '🐶', weeklyCoins: 110, totalSessions: 5 },
  { id: 'lb-7', nickname: 'Mikael Bintang', avatar: '🦄', weeklyCoins: 95, totalSessions: 4 },
];

export const WeeklyLeaderboard: React.FC<WeeklyLeaderboardProps> = ({
  currentChild,
  onOpenAchievementModal,
}) => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Combine mock leaderboard with current child dynamically
  const entries: LeaderboardEntry[] = React.useMemo(() => {
    const list: LeaderboardEntry[] = [
      ...INITIAL_LEADERBOARD_ENTRIES,
      {
        id: currentChild.id,
        nickname: `${currentChild.nickname} (Kamu)`,
        avatar: currentChild.avatar,
        weeklyCoins: currentChild.coinsBalance,
        totalSessions: Math.max(1, Math.floor(currentChild.coinsBalance / 25)),
        isCurrentChild: true,
      },
    ];

    // Sort by weekly coins descending
    list.sort((a, b) => b.weeklyCoins - a.weeklyCoins);
    return list.slice(0, 10);
  }, [currentChild]);

  const currentRank = entries.findIndex(e => e.isCurrentChild) + 1;

  const handleRefresh = () => {
    audio.playClick();
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 600);
  };

  return (
    <div className="space-y-6 w-full max-w-4xl mx-auto">
      {/* Top Banner */}
      <div className="text-center max-w-xl mx-auto mb-4">
        <div className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-800 px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider mb-2">
          <Trophy className="w-3.5 h-3.5 text-amber-600" /> Juara Minggu Ini
        </div>
        <h3 className="text-2xl sm:text-3xl font-black text-gemdark">
          Papan Peringkat Sahabat GEMBIRA
        </h3>
        <p className="text-xs sm:text-sm text-gray-500 font-semibold mt-1">
          Kumpulkan koin dari Letus Balon, Tebak Kata, dan 8 Modul Materi untuk naik ke podium juara!
        </p>
      </div>

      {/* Safety notice (UU PDP Safe Leaderboard) */}
      <div className="bg-emerald-50 border-2 border-emerald-200 rounded-2xl p-3 flex items-center justify-between text-xs text-emerald-900">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-gemgreen flex-shrink-0" />
          <span className="font-semibold">
            <strong>Peringkat Ramah Privasi Anak:</strong> Bebas email orang tua. Posisi kamu saat ini: <span className="text-amber-700 font-black">#{currentRank}</span>
          </span>
        </div>
        <div className="flex items-center gap-2">
          {onOpenAchievementModal && (
            <button
              type="button"
              onClick={() => {
                audio.playClick();
                onOpenAchievementModal();
              }}
              className="px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-yellow-300 active:scale-95 text-gemdark font-black text-xs transition-all shadow-xs flex items-center gap-1.5 gem-btn-press"
            >
              <Award className="w-3.5 h-3.5" />
              <span>Kartu Prestasi</span>
            </button>
          )}
          <button
            onClick={handleRefresh}
            className="p-1.5 rounded-xl bg-white hover:bg-emerald-100 text-gemgreen transition-colors"
            title="Segarkan Peringkat"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Top 3 Podium Cards */}
      <div className="grid grid-cols-3 gap-2 sm:gap-4 items-end pt-6 pb-2">
        {/* Rank 2 (Silver) */}
        {entries[1] && (
          <div className="bg-white rounded-3xl p-3 sm:p-5 border-3 border-slate-300 shadow-md text-center flex flex-col items-center gem-card-hover order-1">
            <div className="w-12 h-12 flex items-center justify-center mb-1">
              <AvatarDisplay
                avatar={entries[1].avatar}
                equipped={entries[1].isCurrentChild ? currentChild.equipped : undefined}
                size="md"
              />
            </div>
            <span className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 font-black text-xs flex items-center justify-center mb-1">
              2
            </span>
            <span className="font-black text-xs sm:text-sm text-gemdark truncate max-w-full">
              {entries[1].nickname}
            </span>
            <span className="text-xs sm:text-sm font-black text-amber-600 mt-1">
              🪙 {entries[1].weeklyCoins}
            </span>
          </div>
        )}

        {/* Rank 1 (Gold) */}
        {entries[0] && (
          <div className="bg-gradient-to-b from-amber-50 to-yellow-100 rounded-3xl p-4 sm:p-6 border-4 border-gemyellow shadow-xl text-center flex flex-col items-center gem-card-hover -translate-y-4 order-2 relative">
            <div className="absolute -top-4 w-8 h-8 rounded-full bg-yellow-400 text-white flex items-center justify-center shadow-md">
              👑
            </div>
            <div className="w-16 h-16 flex items-center justify-center mb-1 animate-float">
              <AvatarDisplay
                avatar={entries[0].avatar}
                equipped={entries[0].isCurrentChild ? currentChild.equipped : undefined}
                size="lg"
              />
            </div>
            <span className="w-7 h-7 rounded-full bg-yellow-400 text-white font-black text-xs flex items-center justify-center mb-1 shadow-sm">
              1
            </span>
            <span className="font-black text-sm sm:text-base text-gemdark truncate max-w-full">
              {entries[0].nickname}
            </span>
            <span className="text-sm sm:text-base font-black text-amber-700 mt-1">
              🪙 {entries[0].weeklyCoins} Koin
            </span>
          </div>
        )}

        {/* Rank 3 (Bronze) */}
        {entries[2] && (
          <div className="bg-white rounded-3xl p-3 sm:p-5 border-3 border-amber-600/40 shadow-md text-center flex flex-col items-center gem-card-hover order-3">
            <div className="w-12 h-12 flex items-center justify-center mb-1">
              <AvatarDisplay
                avatar={entries[2].avatar}
                equipped={entries[2].isCurrentChild ? currentChild.equipped : undefined}
                size="md"
              />
            </div>
            <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-800 font-black text-xs flex items-center justify-center mb-1">
              3
            </span>
            <span className="font-black text-xs sm:text-sm text-gemdark truncate max-w-full">
              {entries[2].nickname}
            </span>
            <span className="text-xs sm:text-sm font-black text-amber-600 mt-1">
              🪙 {entries[2].weeklyCoins}
            </span>
          </div>
        )}
      </div>

      {/* Leaderboard Table / List for Ranks 4 to 10 */}
      <div className="bg-white rounded-3xl p-4 sm:p-6 border-3 border-gray-100 shadow-md space-y-2.5">
        <div className="text-xs font-black uppercase text-gray-400 px-3 flex justify-between">
          <span>Peringkat & Petualang</span>
          <span>Perolehan Koin</span>
        </div>

        {entries.map((entry, idx) => {
          const rank = idx + 1;
          const isMe = entry.isCurrentChild;

          return (
            <div
              key={entry.id}
              className={`p-3 sm:p-3.5 rounded-2xl flex items-center justify-between transition-all ${
                isMe
                  ? 'bg-purple-50/80 border-2 border-gempurple shadow-sm'
                  : 'bg-gray-50/70 hover:bg-gray-100 border border-gray-100'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={`w-7 h-7 rounded-xl font-black text-xs flex items-center justify-center ${
                  rank === 1 ? 'bg-yellow-400 text-white' :
                  rank === 2 ? 'bg-slate-300 text-slate-700' :
                  rank === 3 ? 'bg-amber-600 text-white' :
                  'bg-white text-gray-500 border border-gray-200'
                }`}>
                  #{rank}
                </span>

                <div className="w-10 h-10 rounded-2xl bg-white border border-gray-200 flex items-center justify-center shadow-xs overflow-hidden">
                  <AvatarDisplay
                    avatar={entry.avatar}
                    equipped={isMe ? currentChild.equipped : undefined}
                    size="sm"
                  />
                </div>

                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-black text-sm text-gemdark">{entry.nickname}</span>
                    {isMe && (
                      <span className="bg-gempurple text-white text-[9px] font-black px-1.5 py-0.5 rounded-full uppercase">
                        Kamu
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-gray-400 font-semibold">
                    {entry.totalSessions} sesi petualangan selesai
                  </span>
                </div>
              </div>

              <div className="text-right">
                <span className="font-black text-sm text-amber-600 flex items-center gap-1 justify-end">
                  🪙 {entry.weeklyCoins}
                </span>
                <span className="text-[10px] text-gray-400 font-semibold">Koin Minggu Ini</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Info */}
      <div className="text-center text-xs text-gray-400 font-medium">
        Peringkat direset otomatis setiap hari Senin pukul 00:00 WIB. Teruslah bermain dan raih prestasi!
      </div>
    </div>
  );
};
