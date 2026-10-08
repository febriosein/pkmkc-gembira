import React from 'react';
import { Compass, Gamepad2, BookOpen, Trophy, ShieldCheck, Volume2, VolumeX } from 'lucide-react';
import { ChildProfile, NavigationTab } from '../../types';
import { audio } from '../../services/audio';

interface NavbarProps {
  currentTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
  activeChild: ChildProfile;
  onOpenProfileModal: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  activeChild,
  onOpenProfileModal,
  isMuted,
  onToggleMute,
}) => {
  const navItems = [
    { id: 'peta', label: 'Peta Petualangan', icon: Compass, color: 'text-gemblue' },
    { id: 'game', label: 'Arena Game', icon: Gamepad2, color: 'text-gempink' },
    { id: 'materi', label: '8 Modul Belajar', icon: BookOpen, color: 'text-gemgreen' },
    { id: 'leaderboard', label: 'Peringkat Juara', icon: Trophy, color: 'text-gemyellow' },
    { id: 'ortu', label: 'Laporan Ortu', icon: ShieldCheck, color: 'text-gempurple' },
  ];

  return (
    <header className="bg-white/95 backdrop-blur-md border-b-2 border-gempurple/15 sticky top-0 z-40 px-3 sm:px-6 py-2.5 shadow-sm">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        {/* Brand identity */}
        <div
          onClick={() => {
            audio.playClick();
            onSelectTab('peta');
          }}
          className="flex items-center gap-2.5 cursor-pointer select-none group"
        >
          <div className="w-11 h-11 bg-gradient-to-tr from-gempink/20 to-purple-100 rounded-2xl flex items-center justify-center text-2xl shadow-inner animate-float group-hover:scale-105 transition-transform">
            🎈
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-black text-gemdark tracking-tight">GEMBIRA</span>
              <span className="hidden sm:inline-block bg-gempink text-white text-[9px] font-black px-1.5 py-0.5 rounded-full uppercase">
                v1.0
              </span>
            </div>
            <p className="text-[11px] text-gempurple font-bold hidden sm:block">Tanpa Buku, Asyik Bermain!</p>
          </div>
        </div>

        {/* Desktop Nav Items */}
        <nav className="hidden md:flex items-center gap-1 bg-gray-100/90 p-1 rounded-2xl border border-gray-200/80">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  audio.playClick();
                  onSelectTab(item.id as NavigationTab);
                }}
                className={`px-3.5 py-2 rounded-xl text-xs font-black flex items-center gap-2 transition-all ${
                  isActive
                    ? 'bg-white text-gemdark shadow-sm ring-1 ring-black/5 scale-102'
                    : 'text-gray-500 hover:text-gemdark hover:bg-white/50'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? item.color : 'text-gray-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right side controls: Coins, Audio Mute, Child Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Audio toggle button */}
          <button
            type="button"
            onClick={onToggleMute}
            className={`w-9 h-9 rounded-2xl flex items-center justify-center transition-all ${
              isMuted
                ? 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                : 'bg-emerald-50 text-gemgreen hover:bg-emerald-100 border border-emerald-200'
            }`}
            title={isMuted ? 'Nyalakan Suara' : 'Matikan Suara'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* Live Coin balance badge */}
          <div className="bg-gradient-to-r from-amber-50 to-yellow-100 border-2 border-gemyellow/80 text-amber-900 px-3 py-1.5 rounded-2xl font-black text-xs flex items-center gap-1.5 shadow-sm">
            <span className="text-base leading-none">🪙</span>
            <span>{activeChild.coinsBalance}</span>
          </div>

          {/* Active child profile button */}
          <button
            type="button"
            onClick={() => {
              audio.playClick();
              onOpenProfileModal();
            }}
            className="flex items-center gap-2 pl-2 pr-3 py-1 bg-purple-50 hover:bg-purple-100 border-2 border-gempurple/30 rounded-2xl transition-all text-left gem-card-hover"
            title="Ganti Profil Anak"
          >
            <div className="w-7 h-7 rounded-xl bg-white flex items-center justify-center text-lg shadow-sm border border-purple-200">
              {activeChild.avatar}
            </div>
            <div className="hidden sm:block leading-tight">
              <span className="block font-black text-xs text-gemdark max-w-[85px] truncate">
                {activeChild.nickname}
              </span>
              <span className="text-[10px] text-gempurple font-bold uppercase tracking-wider">
                Ganti Profil
              </span>
            </div>
          </button>
        </div>
      </div>
    </header>
  );
};
