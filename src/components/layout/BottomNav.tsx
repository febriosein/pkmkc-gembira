import React from 'react';
import { Compass, Gamepad2, BookOpen, Trophy, ShieldCheck } from 'lucide-react';
import { NavigationTab } from '../../types';
import { audio } from '../../services/audio';

interface BottomNavProps {
  currentTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentTab, onSelectTab }) => {
  const items = [
    { id: 'peta', label: 'Peta', icon: Compass, activeColor: 'text-gemblue' },
    { id: 'game', label: 'Game', icon: Gamepad2, activeColor: 'text-gempink' },
    { id: 'materi', label: 'Materi', icon: BookOpen, activeColor: 'text-gemgreen' },
    { id: 'leaderboard', label: 'Juara', icon: Trophy, activeColor: 'text-gemyellow' },
    { id: 'ortu', label: 'Ortu', icon: ShieldCheck, activeColor: 'text-gempurple' },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t-2 border-gray-200/80 px-2 py-1 shadow-lg pb-safe">
      <div className="grid grid-cols-5 gap-1 max-w-md mx-auto">
        {items.map(item => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                audio.playClick();
                onSelectTab(item.id as NavigationTab);
              }}
              className={`min-h-[50px] py-1.5 rounded-2xl flex flex-col items-center justify-center transition-all ${
                isActive
                  ? 'bg-purple-50 text-gemdark font-black scale-102'
                  : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              <Icon className={`w-5 h-5 mb-0.5 ${isActive ? item.activeColor : 'text-gray-400'}`} />
              <span className={`text-[10px] ${isActive ? 'font-black text-gemdark' : 'font-semibold'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
