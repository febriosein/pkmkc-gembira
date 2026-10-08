import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { X, Mic, MicOff, Sparkles, Volume2, ArrowRight, RotateCcw, Award } from 'lucide-react';
import { ChildProfile } from '../../types';
import { VOICE_CHALLENGES } from '../../data/voiceChallenges';
import { AvatarDisplay } from '../avatar/AvatarDisplay';
import { speechRecognition } from '../../services/speechRecognition';
import { storage } from '../../services/storage';
import { audio } from '../../services/audio';
import { scaffolding } from '../../services/scaffolding';

interface VoiceChallengeModalProps {
  isOpen: boolean;
  child: ChildProfile;
  onClose: () => void;
  onChildUpdated: (updated: ChildProfile) => void;
}

export const VoiceChallengeModal: React.FC<VoiceChallengeModalProps> = ({
  isOpen,
  child,
  onClose,
  onChildUpdated,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [heardText, setHeardText] = useState<string | null>(null);
  const [statusState, setStatusState] = useState<'idle' | 'listening' | 'success' | 'retry'>('idle');
  const [feedbackMessage, setFeedbackMessage] = useState<string>('');
  const [totalCoinsEarned, setTotalCoinsEarned] = useState(0);
  const [solvedIds, setSolvedIds] = useState<Set<string>>(() => new Set());

  const stopListeningRef = useRef<(() => void) | null>(null);
  const currentChallenge = VOICE_CHALLENGES[currentIndex];

  useEffect(() => {
    if (!isOpen) {
      if (stopListeningRef.current) {
        stopListeningRef.current();
        stopListeningRef.current = null;
      }
      setIsListening(false);
      setStatusState('idle');
      setHeardText(null);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!currentChallenge || !isOpen) return;

    setHeardText(null);
    setStatusState('idle');
    setFeedbackMessage(currentChallenge.prompt);
    audio.speak(currentChallenge.prompt);

    return () => {
      if (stopListeningRef.current) {
        stopListeningRef.current();
        stopListeningRef.current = null;
      }
    };
  }, [currentIndex, isOpen, currentChallenge]);

  if (!isOpen || !currentChallenge) return null;

  const isMicSupported = speechRecognition.isSupported();

  const handleStartListening = () => {
    if (isListening) {
      if (stopListeningRef.current) {
        stopListeningRef.current();
        stopListeningRef.current = null;
      }
      setIsListening(false);
      setStatusState('idle');
      return;
    }

    audio.playClick();
    setIsListening(true);
    setStatusState('listening');
    setHeardText(null);
    setFeedbackMessage('Sahabat sedang mendengarkan... Bicaralah sekarang!');

    const stopFn = speechRecognition.startListening(
      currentChallenge.acceptedVariations,
      (result) => {
        setIsListening(false);
        setHeardText(result.transcript);

        if (result.isMatch) {
          handleSuccess(result.transcript);
        } else {
          handleRetry(result.transcript);
        }
      },
      (errorMsg) => {
        setIsListening(false);
        setStatusState('retry');
        setFeedbackMessage(errorMsg);
      },
      () => {
        setIsListening(false);
      }
    );

    stopListeningRef.current = stopFn;
  };

  const handleSimulateVoice = () => {
    audio.playClick();
    setIsListening(true);
    setStatusState('listening');
    setFeedbackMessage(`Mendengar suara: "${currentChallenge.targetWord}"...`);

    setTimeout(() => {
      setIsListening(false);
      setHeardText(currentChallenge.targetWord);
      handleSuccess(currentChallenge.targetWord);
    }, 1000);
  };

  const handleSuccess = (_spoken?: string) => {
    setStatusState('success');
    audio.playSuccess();
    audio.playFanfare();

    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.6 },
    });

    const isFirstTime = !solvedIds.has(currentChallenge.id);
    let reward = currentChallenge.coinsReward;

    if (isFirstTime) {
      setSolvedIds(prev => new Set([...prev, currentChallenge.id]));
      setTotalCoinsEarned(prev => prev + reward);
      const newBalance = storage.recordCoinDelta(
        child.id,
        reward,
        `Tantangan Suara: ${currentChallenge.targetWord}`
      );
      // Boost buddy happiness by 5%
      const updatedChild = storage.petBuddy(child.id);
      onChildUpdated({ ...updatedChild, coinsBalance: newBalance });
    }

    const cheers = [
      `Luar biasa, ${child.nickname}! Pelafalan kata "${currentChallenge.targetWord}" sangat jelas dan percaya diri! 🌟`,
      `Hebat sekali! Suaramu merdu dan lantang! Sahabatmu makin bangga! 🥳`,
      `Wah, artikulasi suaramu mantap! Kamu mendapat +${reward} koin! 🎉`,
    ];
    const pickedCheers = cheers[Math.floor(Math.random() * cheers.length)];
    setFeedbackMessage(pickedCheers);
    audio.speak(pickedCheers);
  };

  const handleRetry = (spoken: string) => {
    setStatusState('retry');
    audio.playGentleBoing();

    const encouragement = scaffolding.getEncouragement();
    setFeedbackMessage(
      `Kamu mengucapkan "${spoken}". Sedikit lagi! ${encouragement}`
    );
    audio.speak(`Kamu mengucapkan ${spoken}. Ayo coba lagi bersama sahabat!`);
  };

  const handleNextChallenge = () => {
    audio.playClick();
    if (currentIndex + 1 < VOICE_CHALLENGES.length) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setCurrentIndex(0); // loop back
    }
  };

  const handlePrevChallenge = () => {
    audio.playClick();
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-gemdark/60 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[92vh] flex flex-col shadow-2xl border-4 border-indigo-400 overflow-hidden relative">
        {/* Header Bar */}
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 p-4 sm:p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-3xl shadow-md border border-white/30 animate-float">
              🎙️
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-white/20 text-yellow-200 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider inline-flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-yellow-300" /> PKM-KC Voice Engine
                </span>
                <span className="text-xs text-purple-200 font-bold">
                  Tantangan {currentIndex + 1} dari {VOICE_CHALLENGES.length}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight">
                Tantangan Suara Sahabat Cilik
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="bg-black/20 backdrop-blur-md px-3 py-1.5 rounded-2xl border border-white/20 text-xs font-black text-yellow-300 flex items-center gap-1">
              <span>🪙 +{totalCoinsEarned}</span>
            </div>
            <button
              type="button"
              onClick={() => {
                audio.playClick();
                onClose();
              }}
              className="w-10 h-10 rounded-2xl bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-all"
              title="Tutup"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Challenge Stage Body */}
        <div className="p-3.5 sm:p-7 flex-1 overflow-y-auto flex flex-col items-center justify-between text-center bg-gradient-to-b from-indigo-50/50 via-white to-purple-50/50">
          {/* Top Companion Mascot with Speech */}
          <div className="flex items-center gap-2 bg-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-2xl border-2 border-indigo-200 shadow-sm max-w-md w-full justify-center">
            <AvatarDisplay avatar={child.avatar} equipped={child.equipped} size="sm" />
            <div className="text-left text-xs font-bold leading-tight">
              <span className="text-indigo-900 block font-black">{child.nickname} & Sahabat Avatar</span>
              <span className="text-gray-500 text-[10px] sm:text-[11px]">Latih keberanian berbicara lantang!</span>
            </div>
          </div>

          {/* Target Word Hero Display */}
          <div className="my-2 sm:my-4 flex flex-col items-center">
            <div className="w-20 h-20 sm:w-32 sm:h-32 rounded-2xl sm:rounded-3xl bg-white shadow-xl border-3 sm:border-4 border-indigo-300 flex items-center justify-center text-5xl sm:text-7xl mb-2 sm:mb-3 animate-float">
              {currentChallenge.emoji}
            </div>

            <div className="inline-flex items-center gap-1.5 sm:gap-2 bg-indigo-100 text-indigo-900 px-3 sm:px-3.5 py-1 rounded-full text-[11px] sm:text-xs font-black uppercase tracking-wider mb-1.5 sm:mb-2">
              <span>Target Lafal:</span>
              <span className="text-pink-600 font-black text-xs sm:text-sm tracking-widest">{currentChallenge.targetWord}</span>
              <button
                type="button"
                onClick={() => audio.speak(currentChallenge.targetWord)}
                className="p-1 rounded-full hover:bg-indigo-200 text-indigo-700 transition-colors"
                title="Dengarkan Contoh Lafal"
              >
                <Volume2 className="w-3.5 h-3.5" />
              </button>
            </div>

            <h3 className="text-base sm:text-xl font-black text-gemdark max-w-md">
              "{currentChallenge.prompt}"
            </h3>

            <p className="text-[11px] sm:text-xs text-gray-500 font-medium max-w-sm mt-0.5 sm:mt-1">
              💡 {currentChallenge.funFact}
            </p>
          </div>

          {/* Feedback & Recognition Status */}
          <div className="w-full max-w-md my-1.5 sm:my-2">
            {statusState === 'listening' && (
              <div className="bg-indigo-600 text-white p-3 sm:p-3.5 rounded-2xl shadow-lg border-2 border-indigo-400 flex items-center justify-center gap-3 animate-pulse">
                <div className="flex gap-1 items-center">
                  <span className="w-2 h-4 sm:h-5 bg-yellow-300 rounded-full animate-bounce"></span>
                  <span className="w-2 h-6 sm:h-8 bg-yellow-300 rounded-full animate-bounce delay-100"></span>
                  <span className="w-2 h-3 sm:h-4 bg-yellow-300 rounded-full animate-bounce delay-200"></span>
                </div>
                <span className="font-black text-xs sm:text-sm">
                  Sedang Mendengarkan... Bicara Sekarang!
                </span>
              </div>
            )}

            {statusState === 'success' && (
              <div className="bg-emerald-100 text-emerald-800 p-3 sm:p-3.5 rounded-2xl border-2 border-emerald-300 shadow-sm animate-in zoom-in-95 duration-200">
                <div className="flex items-center justify-center gap-2 font-black text-xs sm:text-sm mb-1">
                  <Award className="w-4 h-4 text-emerald-600" />
                  <span>Pelafalan Tepat Sekali!</span>
                </div>
                <p className="text-[11px] sm:text-xs font-semibold leading-relaxed">
                  {feedbackMessage}
                </p>
                {heardText && (
                  <span className="text-[10px] text-emerald-700 bg-white/70 px-2.5 py-0.5 rounded-full inline-block mt-1 font-bold">
                    Kamu bersuara: "{heardText}"
                  </span>
                )}
              </div>
            )}

            {statusState === 'retry' && (
              <div className="bg-amber-100 text-amber-900 p-3 sm:p-3.5 rounded-2xl border-2 border-amber-300 shadow-sm animate-wiggle">
                <p className="text-[11px] sm:text-xs font-bold leading-relaxed">
                  {feedbackMessage}
                </p>
                <div className="mt-1 flex items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={handleStartListening}
                    className="text-[11px] font-black text-amber-800 underline hover:text-amber-900"
                  >
                    Coba Ucapkan Sekali Lagi
                  </button>
                </div>
              </div>
            )}

            {statusState === 'idle' && (
              <div className="bg-gray-100 text-gray-600 p-2 sm:p-2.5 rounded-2xl border border-gray-200 text-[11px] sm:text-xs font-semibold">
                Tekan tombol mikrofon di bawah dan katakan <strong>"{currentChallenge.targetWord}"</strong> dengan lantang!
              </div>
            )}
          </div>

          {/* Microphone Main Interactive Button */}
          <div className="my-2 sm:my-3 flex flex-col items-center gap-1.5 sm:gap-2">
            <button
              type="button"
              onClick={handleStartListening}
              className={`w-16 h-16 sm:w-24 sm:h-24 rounded-full flex flex-col items-center justify-center shadow-xl border-3 sm:border-4 transition-all gem-btn-press relative ${
                isListening
                  ? 'bg-gradient-to-tr from-rose-500 to-pink-500 border-white text-white scale-110 shadow-pink-300'
                  : statusState === 'success'
                  ? 'bg-gradient-to-tr from-emerald-500 to-teal-400 border-white text-white shadow-emerald-200'
                  : 'bg-gradient-to-tr from-indigo-500 to-purple-600 border-white text-white hover:scale-105 shadow-indigo-200'
              }`}
              title={isListening ? 'Hentikan Mikrofon' : 'Mulai Bicara'}
            >
              {isListening ? (
                <Mic className="w-7 h-7 sm:w-10 sm:h-10 animate-bounce" />
              ) : (
                <Mic className="w-7 h-7 sm:w-10 sm:h-10" />
              )}
              <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-wider mt-0.5">
                {isListening ? 'Mendengar' : 'Bicara'}
              </span>

              {/* Pulsing rings when listening */}
              {isListening && (
                <span className="absolute inset-0 rounded-full border-4 border-pink-400 animate-ping pointer-events-none opacity-75"></span>
              )}
            </button>

            {/* Simulated Voice fallback for devices without mic support */}
            <div className="flex items-center gap-2 mt-2">
              <button
                type="button"
                onClick={handleSimulateVoice}
                className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl text-[11px] font-bold transition-colors flex items-center gap-1"
                title="Gunakan simulasi suara jika mikrofon tidak tersedia"
              >
                <span>🗣️ Ucapkan Otomatis (Simulasi)</span>
              </button>
              {!isMicSupported && (
                <span className="text-[10px] text-amber-600 font-bold flex items-center gap-1">
                  <MicOff className="w-3 h-3" /> Mic browser belum aktif
                </span>
              )}
            </div>
          </div>

          {/* Navigation Controls: Prev vs Next */}
          <div className="flex items-center justify-between w-full max-w-md pt-3 border-t border-gray-200 mt-2">
            <button
              type="button"
              onClick={handlePrevChallenge}
              disabled={currentIndex === 0}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1 ${
                currentIndex === 0
                  ? 'text-gray-300 cursor-not-allowed'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
            >
              <RotateCcw className="w-3.5 h-3.5" /> Sebelumnya
            </button>

            <span className="text-xs font-black text-amber-700 bg-amber-100 px-3 py-1 rounded-xl">
              Hadiah: +{currentChallenge.coinsReward} Koin 🪙
            </span>

            <button
              type="button"
              onClick={handleNextChallenge}
              className="px-5 py-2 rounded-xl text-xs font-black text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-95 shadow-md flex items-center gap-1 gem-btn-press"
            >
              <span>Tantangan Lanjut</span> <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
