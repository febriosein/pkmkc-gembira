import React, { useState } from 'react';
import { Sparkles, Volume2, X, Lightbulb, Heart } from 'lucide-react';
import { ChildProfile } from '../../types';
import { AvatarDisplay } from '../avatar/AvatarDisplay';
import { audio } from '../../services/audio';

interface ScaffoldingBuddyBannerProps {
  child: ChildProfile;
  message: string;
  onEliminateWrongOption?: () => void;
  isHintUsed?: boolean;
  onDismiss: () => void;
  bonusCoins?: number;
}

export const ScaffoldingBuddyBanner: React.FC<ScaffoldingBuddyBannerProps> = ({
  child,
  message,
  onEliminateWrongOption,
  isHintUsed = false,
  onDismiss,
  bonusCoins = 3,
}) => {
  const [isSpeaking, setIsSpeaking] = useState(false);

  const handleSpeak = () => {
    setIsSpeaking(true);
    audio.speak(message);
    setTimeout(() => setIsSpeaking(false), 3000);
  };

  return (
    <div className="w-full max-w-xl mx-auto my-2 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="bg-gradient-to-r from-purple-600/95 via-indigo-600/95 to-pink-500/95 backdrop-blur-md rounded-2xl p-3.5 sm:p-4 text-white shadow-xl border-2 border-white/30 flex flex-col sm:flex-row items-center gap-3 relative overflow-hidden">
        {/* Avatar Buddy */}
        <div className="flex-shrink-0 flex items-center gap-2">
          <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-inner border border-white/30 relative">
            <AvatarDisplay
              avatar={child.avatar}
              equipped={child.equipped}
              size="sm"
            />
            <div className="absolute -top-1 -right-1 bg-pink-500 rounded-full p-0.5 shadow-sm">
              <Heart className="w-2.5 h-2.5 fill-white text-white" />
            </div>
          </div>
        </div>

        {/* Growth Mindset Speech Bubble */}
        <div className="flex-1 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-1.5 mb-0.5">
            <span className="text-[10px] font-black uppercase tracking-wider text-yellow-300 bg-white/20 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-yellow-300" /> Sahabat Semangat
            </span>
            <button
              type="button"
              onClick={handleSpeak}
              className={`p-1 rounded-full text-white/80 hover:text-white hover:bg-white/20 transition-all ${
                isSpeaking ? 'animate-pulse text-yellow-300' : ''
              }`}
              title="Dengarkan kata sahabat"
            >
              <Volume2 className="w-3.5 h-3.5" />
            </button>
          </div>
          <p className="text-xs sm:text-sm font-bold leading-snug text-white/95 drop-shadow-sm">
            "{message}"
          </p>
        </div>

        {/* Action Buttons: Request Hint (50:50) or Dismiss */}
        <div className="flex items-center gap-1.5 flex-shrink-0 w-full sm:w-auto justify-end">
          {onEliminateWrongOption && !isHintUsed && (
            <button
              type="button"
              onClick={() => {
                audio.playSnapMatch();
                onEliminateWrongOption();
              }}
              className="px-3 py-1.5 bg-yellow-400 hover:bg-yellow-300 active:scale-95 text-gemdark font-black text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 gem-btn-press"
            >
              <Lightbulb className="w-3.5 h-3.5 fill-gemdark" />
              <span>Bantuan (+{bonusCoins}🪙)</span>
            </button>
          )}

          {isHintUsed && (
            <span className="text-[10px] font-black bg-white/20 text-yellow-200 px-2.5 py-1 rounded-xl">
              ✨ Petunjuk Aktif
            </span>
          )}

          <button
            type="button"
            onClick={onDismiss}
            className="w-7 h-7 rounded-xl bg-white/10 hover:bg-white/20 text-white/80 hover:text-white flex items-center justify-center transition-colors ml-1"
            title="Tutup"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
