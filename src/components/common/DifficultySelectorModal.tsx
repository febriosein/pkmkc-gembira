import { X, Star, Play } from 'lucide-react';
import { DifficultyLevel, AgeBand } from '../../types';
import { questionPool } from '../../services/questionPool';
import { audio } from '../../services/audio';

interface DifficultySelectorModalProps {
  isOpen: boolean;
  title: string;
  itemEmoji: string;
  childAgeBand: AgeBand;
  onClose: () => void;
  onSelectDifficulty: (difficulty: DifficultyLevel) => void;
}

export const DifficultySelectorModal: React.FC<DifficultySelectorModalProps> = ({
  isOpen,
  title,
  itemEmoji,
  childAgeBand,
  onClose,
  onSelectDifficulty,
}) => {
  if (!isOpen) return null;

  const defaultDifficulty = questionPool.mapAgeBandToDifficulty(childAgeBand);

  const levels: {
    id: DifficultyLevel;
    title: string;
    targetAge: string;
    multiplier: string;
    desc: string;
    color: string;
    borderColor: string;
    badgeColor: string;
    icon: string;
  }[] = [
    {
      id: 'mudah',
      title: 'Tingkat Mudah',
      targetAge: 'PAUD (Usia 4–6 Tahun)',
      multiplier: 'Koin ×1.0',
      desc: 'Visual konkret dengan tempo santai dan angka/kata dasar yang ramah anak usia dini.',
      color: 'from-emerald-500 to-green-400',
      borderColor: 'border-emerald-300',
      badgeColor: 'bg-emerald-100 text-emerald-800',
      icon: '🟢',
    },
    {
      id: 'sedang',
      title: 'Tingkat Sedang',
      targetAge: 'SD Kelas 1–2 (Usia 7–8 Tahun)',
      multiplier: 'Koin ×1.5 🪙',
      desc: 'Tantangan seimbang dengan operasi campuran, kosakata variatif, dan rintangan seru.',
      color: 'from-blue-500 to-cyan-400',
      borderColor: 'border-blue-300',
      badgeColor: 'bg-blue-100 text-blue-800',
      icon: '🔵',
    },
    {
      id: 'sulit',
      title: 'Tingkat Tantangan',
      targetAge: 'SD Kelas 3–6 (Usia 9–12 Tahun)',
      multiplier: 'Koin ×2.0 🪙👑',
      desc: 'Asah logika, perkalian/analisis bentuk, dan tempo cepat untuk menjadi Juara Sejati!',
      color: 'from-purple-600 to-indigo-500',
      borderColor: 'border-purple-300',
      badgeColor: 'bg-purple-100 text-purple-800',
      icon: '🟣',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border-4 border-gempurple relative">
        <button
          onClick={() => {
            audio.playClick();
            onClose();
          }}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-full p-1.5 transition-colors"
          title="Tutup"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-5">
          <div className="w-16 h-16 bg-purple-100 text-gempurple rounded-3xl mx-auto flex items-center justify-center text-4xl shadow-inner mb-2 animate-float">
            {itemEmoji}
          </div>
          <h3 className="text-2xl font-black text-gemdark">{title}</h3>
          <p className="text-xs text-gray-500 font-semibold mt-0.5">
            Pilih tingkat tantangan bermain untuk menyesuaikan materi dan hadiah koin.
          </p>
        </div>

        {/* Level Cards */}
        <div className="space-y-3 mb-4">
          {levels.map(lvl => {
            const isRecommended = defaultDifficulty === lvl.id;
            return (
              <div
                key={lvl.id}
                onClick={() => {
                  audio.playClick();
                  onSelectDifficulty(lvl.id);
                }}
                className={`p-4 rounded-2xl border-3 flex items-center justify-between cursor-pointer transition-all gem-card-hover ${lvl.borderColor} bg-white hover:bg-purple-50/50 ${
                  isRecommended ? 'ring-2 ring-gempurple shadow-md' : 'shadow-xs'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{lvl.icon}</span>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-black text-sm text-gemdark">{lvl.title}</h4>
                      {isRecommended && (
                        <span className="bg-gempurple text-white text-[9px] font-black px-2 py-0.5 rounded-full flex items-center gap-0.5">
                          <Star className="w-2.5 h-2.5 fill-white" /> Rekomendasi
                        </span>
                      )}
                    </div>
                    <span className="block text-[11px] font-bold text-gray-500 mt-0.5">{lvl.targetAge}</span>
                    <p className="text-[11px] text-gray-600 font-medium leading-tight mt-1 max-w-xs">
                      {lvl.desc}
                    </p>
                  </div>
                </div>

                <div className="text-right flex flex-col items-end gap-1.5">
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${lvl.badgeColor}`}>
                    {lvl.multiplier}
                  </span>
                  <button className="px-3.5 py-1.5 rounded-xl bg-gemdark text-white font-black text-xs hover:bg-gempurple transition-colors flex items-center gap-1 shadow-xs">
                    <Play className="w-3 h-3 fill-white" /> Mulai
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
