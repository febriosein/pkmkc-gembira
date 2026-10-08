import React from 'react';
import { Compass, Gamepad2, BookOpen, Trophy, ShieldCheck, Volume2, VolumeX } from 'lucide-react';
import { ChildProfile, NavigationTab } from '../../types';
import { audio } from '../../services/audio';
import { AvatarDisplay } from '../avatar/AvatarDisplay';

interface NavbarProps {
  currentTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
  activeChild: ChildProfile;
  onOpenProfileModal: () => void;
  onOpenClosetModal: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  activeChild,
  onOpenProfileModal,
  onOpenClosetModal,
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
    <header className="bg-white/95 backdrop-blur-md border-b-2 border-gempurple/15 sticky top-0 z-40 px-2.5 sm:px-6 py-2 sm:py-2.5 shadow-sm">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-2">
        {/* Brand identity */}
        <div
          onClick={() => {
            audio.playClick();
            onSelectTab('peta');
          }}
          className="flex items-center gap-2 sm:gap-3 cursor-pointer select-none group flex-shrink-0"
        >
          <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl overflow-hidden border-2 border-gempurple/20 shadow-md group-hover:scale-105 group-hover:border-gempurple transition-all bg-white flex items-center justify-center p-0.5">
            <img
              src="/logo.jpg"
              alt="Logo GEMBIRA"
              className="w-full h-full object-contain rounded-lg sm:rounded-xl"
            />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-lg sm:text-xl font-black text-gemdark tracking-tight">GEMBIRA</span>
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
        <div className="flex items-center gap-1.5 sm:gap-2.5 flex-shrink-0">
          {/* Audio toggle button */}
          <button
            type="button"
            onClick={onToggleMute}
            className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl sm:rounded-2xl flex items-center justify-center transition-all ${
              isMuted
                ? 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                : 'bg-emerald-50 text-gemgreen hover:bg-emerald-100 border border-emerald-200'
            }`}
            title={isMuted ? 'Nyalakan Suara' : 'Matikan Suara'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* Live Coin balance badge */}
          <div className="bg-gradient-to-r from-amber-50 to-yellow-100 border-2 border-gemyellow/80 text-amber-900 px-2 sm:px-3 py-1 sm:py-1.5 rounded-xl sm:rounded-2xl font-black text-[11px] sm:text-xs flex items-center gap-1 sm:gap-1.5 shadow-sm">
            <span className="text-sm sm:text-base leading-none">🪙</span>
            <span>{activeChild.coinsBalance}</span>
          </div>

          {/* Ruang Sahabat & Lemari Avatar (Tamagotchi Loop) */}
          <button
            type="button"
            onClick={() => {
              audio.playClick();
              onOpenClosetModal();
            }}
            className="flex items-center gap-1.5 sm:gap-2 p-1 sm:pl-2 sm:pr-3 sm:py-1 bg-gradient-to-r from-pink-50 to-purple-50 hover:from-pink-100 hover:to-purple-100 border-2 border-pink-300 rounded-xl sm:rounded-2xl transition-all text-left gem-card-hover"
            title="Buka Ruang Sahabat & Lemari Aksesoris"
          >
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-white flex items-center justify-center shadow-sm border border-pink-200 relative overflow-hidden flex-shrink-0">
              <AvatarDisplay
                avatar={activeChild.avatar}
                equipped={activeChild.equipped}
                size="sm"
              />
            </div>
            <div className="hidden sm:block leading-tight">
              <div className="flex items-center gap-1">
                <span className="font-black text-xs text-pink-700">Sahabat</span>
                <span className="text-[10px] text-pink-500 font-bold">❤️{activeChild.buddyHappiness ?? 80}%</span>
              </div>
              <span className="text-[9px] text-gempurple font-bold uppercase tracking-wider block">
                Lemari & Elus
              </span>
            </div>
          </button>

          {/* Active child profile button */}
          <button
            type="button"
            onClick={() => {
              audio.playClick();
              onOpenProfileModal();
            }}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 bg-gray-100 hover:bg-gray-200 border-2 border-gray-200 rounded-xl sm:rounded-2xl transition-all text-left gem-card-hover"
            title="Ganti Profil Anak"
          >
            <div className="leading-tight">
              <span className="block font-black text-xs text-gemdark max-w-[55px] xs:max-w-[75px] sm:max-w-[85px] truncate">
                {activeChild.nickname}
              </span>
              <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider hidden sm:block">
                Ganti Profil
              </span>
            </div>
          </button>
        </div>
      </div>
    </header>
  );
};
