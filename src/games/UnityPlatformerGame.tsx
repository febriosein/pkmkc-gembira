import React, { useState, useEffect, useRef } from 'react';
import { X, RefreshCw, Star, Sparkles } from 'lucide-react';
import { ChildProfile, DifficultyLevel } from '../types';
import { storage } from '../services/storage';
import { audio } from '../services/audio';

interface UnityPlatformerGameProps {
  child: ChildProfile;
  difficulty?: DifficultyLevel;
  onExit: () => void;
  onCoinsUpdated: (newCoins: number) => void;
}

interface UnitySessionPayload {
  levelId: string;
  coinsEarned: number;
  starsEarned: number;
  attempts: Array<{
    questionId: string;
    isCorrect: boolean;
    responseTimeSeconds: number;
  }>;
}

export const UnityPlatformerGame: React.FC<UnityPlatformerGameProps> = ({
  child,
  difficulty = 'mudah',
  onExit,
  onCoinsUpdated,
}) => {
  const [hasWebGLBuild, setHasWebGLBuild] = useState(false);
  const [coinsEarned, setCoinsEarned] = useState(0);
  const [stars, setStars] = useState(3);
  const [isFinished, setIsFinished] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Cek apakah build WebGL Unity sudah ada di public/games/platformer/index.html
  useEffect(() => {
    fetch('/games/platformer/index.html', { method: 'HEAD' })
      .then((res) => {
        if (res.ok) {
          setHasWebGLBuild(true);
        } else {
          setHasWebGLBuild(false);
        }
      })
      .catch(() => setHasWebGLBuild(false));
  }, []);

  // Dengarkan event dari Unity WebGL via window CustomEvent (dari GembiraBridge.jslib)
  useEffect(() => {
    const handleSessionComplete = (e: Event) => {
      const customEvent = e as CustomEvent<UnitySessionPayload>;
      const detail = customEvent.detail;
      if (!detail) return;

      const earned = detail.coinsEarned || 30;
      setCoinsEarned(earned);
      setStars(detail.starsEarned || 3);
      setIsFinished(true);

      // Tambahkan koin ke profile anak di storage GEMBIRA via recordCoinDelta
      const newBalance = storage.recordCoinDelta(
        child.id,
        earned,
        'Petualangan Lompat Huruf & Angka Selesai'
      );
      onCoinsUpdated(newBalance);

      // Catat sesi bermain
      storage.recordCompletedSession({
        gameId: 'letus-balon',
        domain: 'literasi',
        childId: child.id,
        score: earned * 10,
        stars: detail.starsEarned || 3,
        coinsEarned: earned,
        startedAt: new Date(Date.now() - 60000).toISOString(),
        correctCount: detail.attempts ? detail.attempts.filter((a) => a.isCorrect).length : 5,
        totalQuestions: detail.attempts ? detail.attempts.length : 5,
      });

      audio.playSuccess();
    };

    const handleAttempt = (e: Event) => {
      const customEvent = e as CustomEvent<{ questionId: string; isCorrect: boolean }>;
      const detail = customEvent.detail;
      if (detail && detail.isCorrect) {
        audio.playPop();
      }
    };

    window.addEventListener('gembira_unity_session_complete', handleSessionComplete);
    window.addEventListener('gembira_unity_attempt', handleAttempt);

    return () => {
      window.removeEventListener('gembira_unity_session_complete', handleSessionComplete);
      window.removeEventListener('gembira_unity_attempt', handleAttempt);
    };
  }, [child.id, onCoinsUpdated]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-slate-900 text-white select-none">
      {/* Header Bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-slate-800/90 backdrop-blur border-b border-slate-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gemgreen flex items-center justify-center text-2xl shadow-md">
            🏝️
          </div>
          <div>
            <h2 className="font-bold text-lg text-white leading-tight">
              Petualangan Pulau Kata & Angka
            </h2>
            <p className="text-xs text-slate-300">
              Pemain: <span className="font-bold text-gemyellow">{child.nickname}</span> · Mode: {difficulty}
            </p>
          </div>
        </div>

        <button
          onClick={onExit}
          className="p-2 rounded-xl bg-slate-700 hover:bg-slate-600 active:scale-95 transition-all text-white"
          title="Keluar"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Konten Permainan */}
      <div className="flex-1 relative flex items-center justify-center bg-[#1a233a] overflow-hidden">
        {hasWebGLBuild ? (
          <iframe
            ref={iframeRef}
            src="/games/platformer/index.html"
            title="Unity 2D Platformer"
            className="w-full h-full border-0"
          />
        ) : (
          /* Tampilan Pengantar & Panduan saat build WebGL belum di-export */
          <div className="max-w-xl mx-4 p-6 bg-slate-800/95 border-2 border-dashed border-gemblue/60 rounded-3xl text-center shadow-2xl backdrop-blur">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-tr from-[#118AB2] to-[#06D6A0] flex items-center justify-center text-3xl shadow-lg animate-bounce">
              🎮
            </div>

            <h3 className="text-2xl font-black text-white mb-2">
              Unity 2D Platformer Ready!
            </h3>
            <p className="text-sm text-slate-300 mb-5 leading-relaxed">
              Script C# Unity Engine lengkap telah dibuat di folder{' '}
              <code className="text-gemyellow bg-slate-900 px-2 py-1 rounded font-mono text-xs">
                unity-platformer/
              </code>
              . Game mencakup <span className="text-gemgreen font-bold">Lompat Huruf (Literasi)</span>,{' '}
              <span className="text-gemblue font-bold">Balok Angka (Numerasi)</span>, dan{' '}
              <span className="text-gempink font-bold">WebBridge</span> untuk sinkronisasi koin otomatis.
            </p>

            <div className="bg-slate-900/80 rounded-2xl p-4 text-left mb-6 border border-slate-700 text-xs text-slate-300 space-y-2">
              <div className="font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-gemyellow" />
                Cara Membuka & Menjalankan di Unity Editor:
              </div>
              <ol className="list-decimal list-inside space-y-1 text-slate-300 pl-1">
                <li>Buka <strong>Unity Hub</strong> ➔ Tambahkan folder <code>unity-platformer</code>.</li>
                <li>Buka scene atau buat scene baru dengan template <strong>2D (URP/Built-in)</strong>.</li>
                <li>Pasang script <code>PlayerController2D</code> pada karakter Anda.</li>
                <li>Build ke <strong>WebGL</strong> lalu simpan output ke <code>public/games/platformer/</code>.</li>
              </ol>
            </div>

            {/* Tombol Simulasi Kemenangan untuk Pengujian Integrasi */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => {
                  window.dispatchEvent(
                    new CustomEvent('gembira_unity_session_complete', {
                      detail: {
                        levelId: 'level-1-demo',
                        coinsEarned: 45,
                        starsEarned: 3,
                        attempts: [
                          { questionId: 'word-KUCING', isCorrect: true, responseTimeSeconds: 12 },
                          { questionId: 'math-3+4', isCorrect: true, responseTimeSeconds: 8 },
                        ],
                      },
                    })
                  );
                }}
                className="px-5 py-3 rounded-2xl bg-gradient-to-r from-gemgreen to-[#04ab80] text-white font-bold shadow-lg hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <Sparkles className="w-5 h-5 text-gemyellow" />
                Uji Simulasi Selesai (+45 Koin)
              </button>

              <button
                onClick={onExit}
                className="px-5 py-3 rounded-2xl bg-slate-700 text-slate-200 font-semibold hover:bg-slate-600 transition-all"
              >
                Kembali ke Peta
              </button>
            </div>
          </div>
        )}

        {/* Modal Kemenangan saat sesi selesai */}
        {isFinished && (
          <div className="absolute inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-300">
            <div className="bg-slate-800 border-2 border-gemyellow/50 rounded-3xl p-6 max-w-sm w-full text-center shadow-2xl">
              <div className="text-5xl mb-2 animate-bounce">🏆</div>
              <h3 className="text-2xl font-black text-white mb-1">Hore, Hebat Sekali!</h3>
              <p className="text-sm text-slate-300 mb-4">
                Kamu berhasil menyelesaikan petualangan lompat huruf dan angka!
              </p>

              {/* Bintang */}
              <div className="flex justify-center gap-2 mb-4">
                {[1, 2, 3].map((s) => (
                  <Star
                    key={s}
                    className={`w-9 h-9 ${
                      s <= stars
                        ? 'text-gemyellow fill-gemyellow drop-shadow-[0_0_8px_rgba(255,209,102,0.8)]'
                        : 'text-slate-600'
                    }`}
                  />
                ))}
              </div>

              {/* Koin */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-slate-900/80 border border-gemyellow/40 text-gemyellow font-black text-lg mb-6">
                <span>🪙</span>
                <span>+{coinsEarned} Koin GEMBIRA</span>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setIsFinished(false)}
                  className="flex-1 py-3 rounded-2xl bg-slate-700 text-white font-bold hover:bg-slate-600 transition-all flex items-center justify-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  Main Lagi
                </button>
                <button
                  onClick={onExit}
                  className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-gemgreen to-[#04ab80] text-white font-bold hover:brightness-110 shadow-lg transition-all"
                >
                  Ke Peta
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
