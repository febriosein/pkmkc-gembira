import React, { useState, useEffect } from 'react';
import { ShieldCheck, Delete, X, KeyRound, Calculator } from 'lucide-react';
import { storage } from '../../services/storage';
import { audio } from '../../services/audio';

interface ParentGateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  title?: string;
}

export const ParentGateModal: React.FC<ParentGateModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  title = "Pintu Verifikasi Orang Tua / Wali"
}) => {
  const [mode, setMode] = useState<'pin' | 'math'>('pin');
  const [pinInput, setPinInput] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  
  // Math challenge state (for parents who haven't set/remembered a PIN)
  const [mathNum1, setMathNum1] = useState<number>(14);
  const [mathNum2, setMathNum2] = useState<number>(27);
  const [mathAnswerInput, setMathAnswerInput] = useState<string>('');

  const generateNewMathChallenge = () => {
    const n1 = Math.floor(Math.random() * 25) + 15;
    const n2 = Math.floor(Math.random() * 25) + 12;
    setMathNum1(n1);
    setMathNum2(n2);
    setMathAnswerInput('');
  };

  useEffect(() => {
    if (isOpen) {
      setPinInput('');
      setErrorMessage('');
      generateNewMathChallenge();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleKeypadPress = (val: string) => {
    audio.playClick();
    setErrorMessage('');
    if (mode === 'pin') {
      if (pinInput.length < 4) {
        const next = pinInput + val;
        setPinInput(next);
        if (next.length === 4) {
          verifyPin(next);
        }
      }
    } else {
      if (mathAnswerInput.length < 3) {
        setMathAnswerInput(prev => prev + val);
      }
    }
  };

  const handleBackspace = () => {
    audio.playClick();
    if (mode === 'pin') {
      setPinInput(prev => prev.slice(0, -1));
    } else {
      setMathAnswerInput(prev => prev.slice(0, -1));
    }
    setErrorMessage('');
  };

  const verifyPin = (pinToTest: string) => {
    if (storage.verifyPin(pinToTest)) {
      audio.playSuccess();
      onSuccess();
    } else {
      audio.playGentleBoing();
      setErrorMessage('PIN salah. Coba lagi atau gunakan tantangan hitung!');
      setPinInput('');
    }
  };

  const verifyMath = () => {
    const expected = mathNum1 + mathNum2;
    if (parseInt(mathAnswerInput, 10) === expected) {
      audio.playSuccess();
      onSuccess();
    } else {
      audio.playGentleBoing();
      setErrorMessage('Jawaban hitung belum tepat. Coba lagi!');
      generateNewMathChallenge();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border-4 border-gempurple relative text-center">
        {/* Close button */}
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

        {/* Icon & Title */}
        <div className="w-14 h-14 bg-purple-100 text-gempurple rounded-2xl mx-auto flex items-center justify-center text-2xl shadow-inner mb-3">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-black text-gemdark">{title}</h3>
        <p className="text-xs text-gray-500 mt-1 mb-4">
          Area ini khusus untuk orang tua. Silakan selesaikan verifikasi di bawah ini.
        </p>

        {/* Mode Selector */}
        <div className="flex bg-gray-100 p-1 rounded-2xl mb-4 text-xs font-bold">
          <button
            type="button"
            onClick={() => {
              audio.playClick();
              setMode('pin');
              setErrorMessage('');
            }}
            className={`flex-1 py-1.5 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
              mode === 'pin' ? 'bg-white text-gempurple shadow-sm' : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            <KeyRound className="w-3.5 h-3.5" /> PIN (Default: 1234)
          </button>
          <button
            type="button"
            onClick={() => {
              audio.playClick();
              setMode('math');
              setErrorMessage('');
            }}
            className={`flex-1 py-1.5 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
              mode === 'math' ? 'bg-white text-gempurple shadow-sm' : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            <Calculator className="w-3.5 h-3.5" /> Hitung Cepat
          </button>
        </div>

        {/* Input Display Area */}
        {mode === 'pin' ? (
          <div className="mb-4">
            <div className="flex justify-center gap-3 my-2">
              {[0, 1, 2, 3].map(idx => (
                <div
                  key={idx}
                  className={`w-10 h-12 rounded-2xl border-2 flex items-center justify-center text-xl font-black transition-all ${
                    pinInput.length > idx
                      ? 'border-gempurple bg-purple-50 text-gempurple'
                      : 'border-gray-200 bg-gray-50 text-gray-400'
                  }`}
                >
                  {pinInput.length > idx ? '●' : ''}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="mb-4">
            <div className="bg-amber-50 border-2 border-gemyellow rounded-2xl p-3 mb-2">
              <span className="text-xs text-amber-800 font-bold block mb-1">Pertanyaan untuk Dewasa:</span>
              <span className="text-2xl font-black text-gemdark">
                {mathNum1} + {mathNum2} = ?
              </span>
            </div>
            <div className="w-28 h-10 mx-auto rounded-xl border-2 border-gempurple bg-purple-50 flex items-center justify-center text-xl font-black text-gemdark">
              {mathAnswerInput || <span className="text-gray-300">...</span>}
            </div>
          </div>
        )}

        {/* Error message */}
        {errorMessage && (
          <div className="text-xs font-bold text-red-500 mb-2 animate-bounce-short">
            {errorMessage}
          </div>
        )}

        {/* Keypad */}
        <div className="grid grid-cols-3 gap-2 max-w-[240px] mx-auto mb-3">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map(num => (
            <button
              key={num}
              onClick={() => handleKeypadPress(num)}
              className="py-2.5 rounded-2xl bg-gray-100 hover:bg-gray-200 active:scale-95 text-lg font-black text-gemdark gem-btn-press"
            >
              {num}
            </button>
          ))}
          <button
            onClick={handleBackspace}
            className="py-2.5 rounded-2xl bg-gray-100 hover:bg-gray-200 active:scale-95 flex items-center justify-center text-gray-600 gem-btn-press"
            title="Hapus"
          >
            <Delete className="w-5 h-5" />
          </button>
          <button
            onClick={() => handleKeypadPress('0')}
            className="py-2.5 rounded-2xl bg-gray-100 hover:bg-gray-200 active:scale-95 text-lg font-black text-gemdark gem-btn-press"
          >
            0
          </button>
          {mode === 'math' ? (
            <button
              onClick={verifyMath}
              className="py-2.5 rounded-2xl bg-gempurple text-white font-black text-sm active:scale-95 shadow-md"
            >
              OK
            </button>
          ) : (
            <div className="py-2.5"></div>
          )}
        </div>
      </div>
    </div>
  );
};
