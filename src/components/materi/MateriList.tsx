import React from 'react';
import { Play, Sparkles, BookOpen } from 'lucide-react';
import { MODULES_CATALOG, ModuleItem } from '../../data/modulesData';
import { audio } from '../../services/audio';

interface MateriListProps {
  onSelectModule: (module: ModuleItem) => void;
}

export const MateriList: React.FC<MateriListProps> = ({ onSelectModule }) => {
  return (
    <div className="space-y-6 w-full">
      {/* Header Banner */}
      <div className="text-center max-w-xl mx-auto mb-4">
        <div className="inline-flex items-center gap-1.5 bg-emerald-100 text-gemgreen px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider mb-2">
          <BookOpen className="w-3.5 h-3.5" /> 8 Modul Belajar Usia Dini & SD
        </div>
        <h3 className="text-2xl sm:text-3xl font-black text-gemdark">
          Jelajahi Modul Interaktif Pilihan
        </h3>
        <p className="text-xs sm:text-sm text-gray-500 font-semibold mt-1">
          Semua modul dirancang khusus dengan panduan suara ramah anak dan umpan balik edukatif.
        </p>
      </div>

      {/* Grid of 8 modules */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {MODULES_CATALOG.map(item => (
          <div
            key={item.id}
            className={`bg-white rounded-2xl sm:rounded-3xl p-5 border-3 ${item.borderColor} shadow-md flex flex-col justify-between gem-card-hover relative`}
          >
            <div>
              {/* Top Row: Icon + Module Number */}
              <div className="flex items-center justify-between mb-3">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${item.color} text-white flex items-center justify-center text-2xl shadow-md animate-float`}>
                  {item.icon}
                </div>
                <span className={`text-[10px] font-black px-2.5 py-1 rounded-full ${item.badgeColor} uppercase tracking-wider`}>
                  Modul {item.moduleNumber}
                </span>
              </div>

              <h4 className="text-base font-black text-gemdark mb-0.5 leading-snug">{item.title}</h4>
              <p className="text-[11px] font-bold text-gray-400 mb-2">{item.subtitle}</p>
              <p className="text-xs text-gray-600 font-medium leading-relaxed mb-4">
                {item.description}
              </p>
            </div>

            {/* Bottom: Reward & Start button */}
            <div className="pt-3 border-t border-gray-100">
              <div className="flex items-center justify-between text-[11px] font-bold text-gray-500 mb-2.5">
                <span className="flex items-center gap-1 text-amber-700 font-black">
                  <Sparkles className="w-3 h-3 text-amber-500" /> +15 Koin
                </span>
                <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md font-bold uppercase">
                  {item.domain}
                </span>
              </div>

              <button
                type="button"
                onClick={() => {
                  audio.playClick();
                  onSelectModule(item);
                }}
                className={`w-full py-2.5 rounded-xl font-black text-xs text-white bg-gradient-to-r ${item.color} hover:opacity-95 shadow-sm flex items-center justify-center gap-1.5 gem-btn-press`}
              >
                <Play className="w-3.5 h-3.5 fill-white" /> Buka Modul
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
