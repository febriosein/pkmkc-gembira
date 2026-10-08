import React, { useState } from 'react';
import { 
  ShieldCheck, 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  Clock, 
  AlertCircle, 
  Download, 
  Lock, 
  Lightbulb, 
  CheckCircle2, 
  Timer,
  Award
} from 'lucide-react';
import { ChildProfile, SkillSnapshot } from '../../types';
import { storage } from '../../services/storage';
import { diagnostic } from '../../services/diagnostic';
import { audio } from '../../services/audio';

interface ParentDashboardProps {
  child: ChildProfile;
  onLockParentMode: () => void;
  onChildUpdated: (updated: ChildProfile) => void;
  onOpenAchievementModal?: () => void;
}

export const ParentDashboard: React.FC<ParentDashboardProps> = ({
  child,
  onLockParentMode,
  onChildUpdated,
  onOpenAchievementModal,
}) => {
  const snapshots = diagnostic.calculateSkillSnapshots(child.id);
  const [dailyLimit, setDailyLimit] = useState<number>(child.dailyLimitMin || 30);
  const [newPin, setNewPin] = useState<string>('');
  const [pinMessage, setPinMessage] = useState<string>('');
  const [isExportSuccess, setIsExportSuccess] = useState<boolean>(false);

  const parent = storage.getParentAccount();
  const sessions = storage.getSessions(child.id);
  const totalAttempts = storage.getAttempts(child.id).length;
  const completedQuests = storage.getCompletedQuests(child.id);

  const handleUpdateLimit = (val: number) => {
    setDailyLimit(val);
    const updated = { ...child, dailyLimitMin: val };
    storage.updateChild(updated);
    onChildUpdated(updated);
  };

  const handleChangePin = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPin.length !== 4 || isNaN(Number(newPin))) {
      setPinMessage('PIN harus berupa 4 angka.');
      return;
    }

    const updatedParent = { ...parent, pin: newPin };
    storage.saveParentAccount(updatedParent);
    audio.playSuccess();
    setPinMessage('PIN berhasil diperbarui!');
    setNewPin('');
    setTimeout(() => setPinMessage(''), 3000);
  };

  const handleExportData = () => {
    audio.playClick();
    const dataJson = storage.exportDataJson();
    const blob = new Blob([dataJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `GEMBIRA_Data_Anak_${child.nickname}_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setIsExportSuccess(true);
    setTimeout(() => setIsExportSuccess(false), 3000);
  };

  const getStatusBadge = (status: SkillSnapshot['status']) => {
    switch (status) {
      case 'unggul':
        return <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 text-[10px] font-black px-2.5 py-0.5 rounded-full flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-emerald-600" /> Unggul (≥80%)</span>;
      case 'berkembang':
        return <span className="bg-blue-100 text-blue-800 border border-blue-300 text-[10px] font-black px-2.5 py-0.5 rounded-full">Berkembang Baik</span>;
      case 'perlu-perhatian':
        return <span className="bg-rose-100 text-rose-800 border border-rose-300 text-[10px] font-black px-2.5 py-0.5 rounded-full flex items-center gap-1"><AlertCircle className="w-3 h-3 text-rose-600" /> Perlu Perhatian (&lt;60%)</span>;
      default:
        return <span className="bg-gray-100 text-gray-600 border border-gray-300 text-[10px] font-black px-2.5 py-0.5 rounded-full">Data Belum Cukup</span>;
    }
  };

  const getTrendIcon = (trend: SkillSnapshot['trend']) => {
    if (trend === 'up') return <span className="text-emerald-600 flex items-center gap-0.5 text-xs font-bold"><TrendingUp className="w-3.5 h-3.5" /> Naik</span>;
    if (trend === 'down') return <span className="text-rose-600 flex items-center gap-0.5 text-xs font-bold"><TrendingDown className="w-3.5 h-3.5" /> Turun</span>;
    return <span className="text-gray-400 flex items-center gap-0.5 text-xs font-bold"><Minus className="w-3.5 h-3.5" /> Stabil</span>;
  };

  return (
    <div className="space-y-6 w-full max-w-5xl mx-auto">
      {/* Top Header Card */}
      <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 border-3 border-gempurple/30 shadow-md flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 text-center sm:text-left">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl sm:rounded-3xl bg-purple-100 text-gempurple flex items-center justify-center text-2xl sm:text-3xl shadow-inner border-2 border-purple-200 flex-shrink-0">
            <ShieldCheck className="w-8 h-8 sm:w-9 sm:h-9 text-gempurple" />
          </div>
          <div>
            <div className="flex items-center gap-2 justify-center sm:justify-start">
              <h2 className="text-xl sm:text-2xl font-black text-gemdark">Dashboard Orang Tua & Wali</h2>
              <span className="bg-purple-100 text-gempurple text-[9px] sm:text-[10px] font-black px-2 py-0.5 rounded-full">
                Terverifikasi
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-gray-500 font-semibold mt-0.5">
              Analisis akurasi riil profil <strong className="text-gemdark">{child.nickname}</strong> ({child.ageBand.toUpperCase()}). Email: {parent.email}
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full md:w-auto">
          <button
            type="button"
            onClick={() => {
              audio.playClick();
              if (onOpenAchievementModal) onOpenAchievementModal();
            }}
            className="w-full sm:w-auto px-4 py-2.5 sm:py-2 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 active:scale-95 text-white font-black rounded-xl sm:rounded-2xl text-xs transition-all shadow-md flex items-center justify-center gap-1.5 gem-btn-press"
          >
            <Award className="w-4 h-4 text-yellow-100" /> Cetak Kartu Prestasi Juara
          </button>

          <button
            onClick={() => {
              audio.playClick();
              onLockParentMode();
            }}
            className="w-full sm:w-auto px-4 py-2.5 sm:py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-black rounded-xl sm:rounded-2xl text-xs transition-colors flex items-center justify-center gap-1.5"
            title="Kunci kembali sesi orang tua"
          >
            <Lock className="w-4 h-4 text-gray-500" /> Kunci Sesi Ortu
          </button>
        </div>
      </div>

      {/* Activity Overview Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white rounded-3xl p-4 border-2 border-gray-100 shadow-sm">
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider block mb-1">Sesi Selesai</span>
          <div className="text-2xl font-black text-gemdark">{sessions.length} Sesi</div>
          <span className="text-[10px] text-gray-500 font-semibold">Tercatat di perangkat</span>
        </div>

        <div className="bg-white rounded-3xl p-4 border-2 border-gray-100 shadow-sm">
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider block mb-1">Total Soal Dijawab</span>
          <div className="text-2xl font-black text-gemdark">{totalAttempts} Attempt</div>
          <span className="text-[10px] text-gray-500 font-semibold">Numerasi, literasi, modul</span>
        </div>

        <div className="bg-white rounded-3xl p-4 border-2 border-gray-100 shadow-sm">
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider block mb-1">Koin Terkumpul</span>
          <div className="text-2xl font-black text-amber-600">🪙 {child.coinsBalance}</div>
          <span className="text-[10px] text-gray-500 font-semibold">Ledger anti-farming</span>
        </div>

        <div className="bg-white rounded-3xl p-4 border-2 border-gray-100 shadow-sm">
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider block mb-1">Bintang Petualang</span>
          <div className="text-2xl font-black text-yellow-500">⭐ {child.starsTotal}</div>
          <span className="text-[10px] text-gray-500 font-semibold">Prestasi permainan</span>
        </div>
      </div>

      {/* Diagnostik Akurasi Riil Per Domain */}
      <div className="bg-white rounded-3xl p-6 border-3 border-purple-100 shadow-md">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-xl font-black text-gemdark">Diagnostik Akurasi Riil per Domain</h3>
            <p className="text-xs text-gray-500 font-medium mt-0.5">
              Dihitung secara akurat dari 20 percobaan (*attempts*) terakhir, bukan simulasi sesi.
            </p>
          </div>
          <span className="hidden sm:inline-block bg-purple-50 text-gempurple border border-purple-200 text-xs font-bold px-3 py-1 rounded-full">
            Kurikulum Merdeka CP
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {snapshots.map(snap => (
            <div
              key={snap.domain}
              className="p-4 rounded-2xl border-2 border-gray-100 bg-gray-50/60 hover:bg-white hover:border-purple-200 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{snap.icon}</span>
                    <div>
                      <h4 className="font-black text-sm text-gemdark">{snap.title}</h4>
                      <span className="text-[10px] text-gray-400 font-semibold">{snap.attemptsCount} percobaan tercatat</span>
                    </div>
                  </div>
                  <div>{getStatusBadge(snap.status)}</div>
                </div>

                {/* Accuracy progress bar */}
                <div className="my-3">
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span className="text-gray-500">Akurasi Jawaban</span>
                    <span className="text-gemdark font-black">{snap.accuracy}%</span>
                  </div>
                  <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 ${
                        snap.accuracy >= 80 ? 'bg-emerald-500' : snap.accuracy >= 60 ? 'bg-blue-500' : 'bg-rose-500'
                      }`}
                      style={{ width: `${snap.accuracy}%` }}
                    ></div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                  <span className="flex items-center gap-1 font-semibold">
                    <Clock className="w-3.5 h-3.5" /> Respons: {snap.avgResponseMs > 0 ? (snap.avgResponseMs / 1000).toFixed(1) + 's' : '-'}
                  </span>
                  <div>{getTrendIcon(snap.trend)}</div>
                </div>
              </div>

              {/* Offline Stimulation Recommendation Tip */}
              {snap.recommendations.length > 0 && (
                <div className="mt-2 pt-2 border-t border-gray-200/70 text-[11px] text-gray-700 bg-amber-50/60 p-2.5 rounded-xl border border-amber-200/60 flex items-start gap-2">
                  <Lightbulb className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                  <div className="leading-relaxed font-medium">
                    <strong className="text-amber-900 font-bold">Rekomendasi di Rumah: </strong>
                    {snap.recommendations[0]}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Disclaimer per PRD FR-DASH-06 */}
        <div className="mt-5 p-3.5 bg-blue-50/70 rounded-2xl border border-blue-200 flex items-start gap-2.5 text-xs text-blue-900">
          <AlertCircle className="w-4 h-4 text-gemblue flex-shrink-0 mt-0.5" />
          <p className="leading-relaxed font-medium">
            <strong>Catatan untuk Orang Tua:</strong> Laporan ini dirancang sebagai indikator kemajuan belajar dan stimulasi interaktif anak di rumah. Laporan ini <strong>bukan diagnosis klinis</strong> (seperti disleksia atau diskalkulia).
          </p>
        </div>
      </div>

      {/* Phygital Real-World Quest Activity Log for Parents */}
      <div className="bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-yellow-500/10 rounded-3xl p-6 border-3 border-amber-300 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center text-2xl shadow-md">
              🏡
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black text-gemdark">
                  Misi Dunia Nyata (Phygital Quests) & Kedekatan Keluarga
                </h3>
                <span className="bg-amber-100 text-amber-800 text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
                  PKM-KC Inovasi
                </span>
              </div>
              <p className="text-xs text-gray-500 font-medium">
                Catatan aktivitas eksplorasi fisik, budi pekerti, dan interaksi nyata anak bersama keluarga di rumah.
              </p>
            </div>
          </div>

          <div className="bg-white px-4 py-2 rounded-2xl border border-amber-300 shadow-xs flex items-center gap-2 self-start sm:self-auto">
            <Award className="w-5 h-5 text-amber-600" />
            <div className="text-left text-xs">
              <span className="font-black text-amber-800 block">{completedQuests.length} Misi Selesai</span>
              <span className="text-[10px] text-gray-500 font-bold">Terverifikasi Orang Tua</span>
            </div>
          </div>
        </div>

        {completedQuests.length === 0 ? (
          <div className="bg-white/80 rounded-2xl p-5 border border-amber-200 text-center">
            <p className="text-xs text-gray-600 font-semibold mb-1">
              Belum ada misi dunia nyata yang diselesaikan bersama anak.
            </p>
            <p className="text-[11px] text-gray-500">
              Ajak anak membuka <strong>Pulau Detektif Nyata 🏡</strong> di Peta Petualangan untuk melakukan misi mencari bentuk lingkaran, minum air putih sehat, merapikan mainan, atau memeluk Ayah/Bunda!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {completedQuests.map((q) => (
              <div
                key={q.id}
                className="bg-white rounded-2xl p-3.5 border-2 border-amber-200 shadow-xs flex items-start gap-3"
              >
                <span className="text-2xl p-2 rounded-xl bg-amber-50 border border-amber-200 flex-shrink-0">
                  {q.badgeIcon}
                </span>
                <div className="min-w-0 flex-1">
                  <h4 className="font-black text-xs text-gemdark truncate">{q.questTitle}</h4>
                  <span className="text-[10px] font-bold text-amber-700 block">
                    {q.badgeName} • +{q.rewardCoins}🪙
                  </span>
                  <span className="text-[9px] text-gray-400 block mt-0.5">
                    Diverifikasi: {new Date(q.completedAt).toLocaleDateString('id-ID')}
                  </span>
                  {q.parentNote && (
                    <p className="text-[10px] text-gray-600 italic mt-1 bg-amber-50/70 p-1 rounded border border-amber-100">
                      "{q.parentNote}"
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Parental Controls & Settings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Playtime Limit & PIN */}
        <div className="bg-white rounded-3xl p-6 border-3 border-gray-100 shadow-md space-y-4">
          <h3 className="text-lg font-black text-gemdark flex items-center gap-2">
            <Timer className="w-5 h-5 text-gempurple" /> Pengaturan Batas Bermain
          </h3>

          <div>
            <div className="flex justify-between items-center text-xs font-bold text-gray-700 mb-1.5">
              <span>Batas Waktu Main Harian Anak:</span>
              <span className="text-gempurple font-black text-sm">{dailyLimit} Menit / Hari</span>
            </div>
            <input
              type="range"
              min="15"
              max="90"
              step="15"
              value={dailyLimit}
              onChange={(e) => handleUpdateLimit(Number(e.target.value))}
              className="w-full accent-gempurple cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-gray-400 font-bold mt-1">
              <span>15 mnt</span>
              <span>30 mnt</span>
              <span>45 mnt</span>
              <span>60 mnt</span>
              <span>90 mnt</span>
            </div>
          </div>

          <form onSubmit={handleChangePin} className="pt-3 border-t border-gray-100 space-y-2">
            <label className="block text-xs font-black uppercase text-gray-600">
              Ubah PIN Orang Tua (Saat ini: {parent.pin})
            </label>
            <div className="flex gap-2">
              <input
                type="password"
                maxLength={4}
                value={newPin}
                onChange={(e) => setNewPin(e.target.value)}
                placeholder="4 digit angka baru"
                className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-xl text-xs font-bold focus:border-gempurple focus:outline-none"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-gempurple hover:bg-purple-700 text-white font-black text-xs rounded-xl shadow-sm transition-colors"
              >
                Simpan PIN
              </button>
            </div>
            {pinMessage && (
              <span className="text-[11px] font-bold text-emerald-600 block">{pinMessage}</span>
            )}
          </form>
        </div>

        {/* Data Ownership & Export (UU PDP) */}
        <div className="bg-white rounded-3xl p-6 border-3 border-gray-100 shadow-md flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-black text-gemdark flex items-center gap-2 mb-2">
              <Download className="w-5 h-5 text-gemgreen" /> Cadangan & Privasi Data Anak (UU PDP)
            </h3>
            <p className="text-xs text-gray-600 font-medium leading-relaxed mb-4">
              Sesuai UU No. 27 Tahun 2022 tentang Pelindungan Data Pribadi, seluruh data anak (riwayat soal, attempt, dan koin) disimpan secara lokal di perangkat Anda. Anda dapat mengunduh seluruh data dalam format JSON kapan saja.
            </p>
          </div>

          <div>
            {isExportSuccess && (
              <div className="text-xs font-bold text-emerald-600 mb-2 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> Berkas data anak berhasil diunduh!
              </div>
            )}
            <button
              onClick={handleExportData}
              className="w-full py-3 bg-gemgreen hover:bg-emerald-600 text-white font-black rounded-2xl text-xs shadow-md transition-all flex items-center justify-center gap-2 gem-btn-press"
            >
              <Download className="w-4 h-4" /> Unduh Cadangan Data Anak (.JSON)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
