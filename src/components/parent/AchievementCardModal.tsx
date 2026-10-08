import React, { useRef, useState } from 'react';
import confetti from 'canvas-confetti';
import { X, Download, Printer, Sparkles, Award } from 'lucide-react';
import { ChildProfile } from '../../types';
import { AvatarDisplay } from '../avatar/AvatarDisplay';
import { storage } from '../../services/storage';
import { audio } from '../../services/audio';

interface AchievementCardModalProps {
  isOpen: boolean;
  child: ChildProfile;
  onClose: () => void;
}

export const AchievementCardModal: React.FC<AchievementCardModalProps> = ({
  isOpen,
  child,
  onClose,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  if (!isOpen) return null;

  const completedQuests = storage.getCompletedQuests(child.id);
  const sessions = storage.getSessions(child.id);
  const currentDateFormatted = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const certNumber = `GEMBIRA/PKMKC/2026/${child.id.substring(0, 6).toUpperCase()}-${new Date().getFullYear()}`;

  // Draw certificate to Canvas and trigger PNG download
  const handleDownloadPng = async () => {
    audio.playClick();
    setIsGenerating(true);

    try {
      const canvas = document.createElement('canvas');
      const width = 1200;
      const height = 820;
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');

      if (!ctx) throw new Error('Canvas context not available');

      // 1. Background gradient
      const bgGrad = ctx.createLinearGradient(0, 0, width, height);
      bgGrad.addColorStop(0, '#FFFBEB'); // amber-50
      bgGrad.addColorStop(0.5, '#FFFFFF');
      bgGrad.addColorStop(1, '#FEF3C7'); // amber-100
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // 2. Ornate Border
      ctx.strokeStyle = '#F59E0B'; // amber-500
      ctx.lineWidth = 14;
      ctx.strokeRect(20, 20, width - 40, height - 40);

      ctx.strokeStyle = '#B45309'; // amber-700
      ctx.lineWidth = 4;
      ctx.strokeRect(36, 36, width - 72, height - 72);

      // 3. Top Ribbon & Badges
      ctx.fillStyle = '#6D28D9'; // purple-700
      ctx.font = 'bold 22px Poppins, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('PROGRAM KREATIVITAS MAHASISWA - KARSA CIPTA (PKM-KC 2026)', width / 2, 80);

      ctx.fillStyle = '#92400E';
      ctx.font = 'bold 16px Poppins, sans-serif';
      ctx.fillText(`No. Sertifikat: ${certNumber}`, width / 2, 108);

      // 4. Main Title
      ctx.fillStyle = '#1E1B4B';
      ctx.font = '900 42px Poppins, sans-serif';
      ctx.fillText('SERTIFIKAT PRESTASI PETUALANG CILIK', width / 2, 165);

      ctx.fillStyle = '#4B5563';
      ctx.font = 'italic 18px Poppins, sans-serif';
      ctx.fillText('Dianugerahkan dengan bangga dan rasa hormat kepada:', width / 2, 205);

      // 5. Child Nickname
      ctx.fillStyle = '#D97706'; // amber-600
      ctx.font = '900 52px Poppins, sans-serif';
      ctx.fillText(child.nickname.toUpperCase(), width / 2, 275);

      // 6. Title of Honor
      ctx.fillStyle = '#4C1D95';
      ctx.font = 'bold 20px Poppins, sans-serif';
      ctx.fillText('★ Bintang Pembelajar Tangguh & Sahabat Hebat Keluarga ★', width / 2, 315);

      // Decorative divider line
      ctx.strokeStyle = '#D97706';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(width / 2 - 250, 335);
      ctx.lineTo(width / 2 + 250, 335);
      ctx.stroke();

      // 7. Citation Text
      ctx.fillStyle = '#374151';
      ctx.font = '500 17px Poppins, sans-serif';
      ctx.fillText(
        'Telah membuktikan semangat pantang menyerah, keberanian mencoba tanpa takut keliru,',
        width / 2,
        375
      );
      ctx.fillText(
        'serta aktif menyelesaikan misi kebaikan dan eksplorasi nyata di rumah bersama keluarga.',
        width / 2,
        405
      );

      // 8. Stat Cards Row (Boxes)
      const stats = [
        { label: 'Koin Belajar', val: `🪙 ${child.coinsBalance}` },
        { label: 'Bintang Prestasi', val: `⭐ ${child.starsTotal}` },
        { label: 'Misi Nyata Selesai', val: `🏡 ${completedQuests.length} Aksi` },
        { label: 'Kebahagiaan Sahabat', val: `❤️ ${child.buddyHappiness ?? 85}%` },
      ];

      const boxWidth = 210;
      const boxHeight = 85;
      const startX = (width - (stats.length * boxWidth + (stats.length - 1) * 20)) / 2;
      const boxY = 445;

      stats.forEach((st, i) => {
        const x = startX + i * (boxWidth + 20);

        // Box background
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.roundRect(x, boxY, boxWidth, boxHeight, 16);
        ctx.fill();

        ctx.strokeStyle = '#FCD34D';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(x, boxY, boxWidth, boxHeight, 16);
        ctx.stroke();

        // Box texts
        ctx.fillStyle = '#92400E';
        ctx.font = '900 24px Poppins, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(st.val, x + boxWidth / 2, boxY + 42);

        ctx.fillStyle = '#6B7280';
        ctx.font = 'bold 12px Poppins, sans-serif';
        ctx.fillText(st.label.toUpperCase(), x + boxWidth / 2, boxY + 68);
      });

      // 9. Pedagogical Domains Badge List
      ctx.fillStyle = '#4B5563';
      ctx.font = 'bold 14px Poppins, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(
        'Cakupan Kemampuan: Numerasi Tangkas • Literasi Nusantara • Eksplorasi Sensori • Karakter Mulia',
        width / 2,
        575
      );

      // 10. Signatures & Date
      const sigY = 660;

      // Left: Date & Location
      ctx.textAlign = 'left';
      ctx.fillStyle = '#374151';
      ctx.font = 'bold 15px Poppins, sans-serif';
      ctx.fillText(`Diterbitkan pada: ${currentDateFormatted}`, 100, sigY);
      ctx.font = 'normal 14px Poppins, sans-serif';
      ctx.fillText('Platform GEMBIRA (Web & Phygital System)', 100, sigY + 26);
      ctx.fillText('UU No. 27/2022 PDP Terverifikasi', 100, sigY + 50);

      // Center: Golden Seal Badge
      ctx.textAlign = 'center';
      ctx.fillStyle = '#F59E0B';
      ctx.font = '48px sans-serif';
      ctx.fillText('🎖️', width / 2, sigY + 20);
      ctx.fillStyle = '#B45309';
      ctx.font = '900 13px Poppins, sans-serif';
      ctx.fillText('STEMPEL RESMI GEMBIRA', width / 2, sigY + 48);

      // Right: Signature
      ctx.textAlign = 'right';
      ctx.fillStyle = '#374151';
      ctx.font = 'bold 15px Poppins, sans-serif';
      ctx.fillText('Tim Pengembang PKM-KC 2026', width - 100, sigY);
      ctx.font = 'italic 14px Poppins, sans-serif';
      ctx.fillText('Karya Inovasi Teknologi Inklusif', width - 100, sigY + 26);
      ctx.font = 'bold 14px Poppins, sans-serif';
      ctx.fillStyle = '#6D28D9';
      ctx.fillText('GEMBIRA Indonesia', width - 100, sigY + 50);

      // 11. Trigger download
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `Sertifikat_Juara_GEMBIRA_${child.nickname.replace(/\s+/g, '_')}.png`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.6 },
      });

      audio.playSuccess();
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    } catch (e) {
      console.error('Failed to generate certificate', e);
      alert('Gagal membuat gambar sertifikat. Silakan gunakan tombol cetak browser!');
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePrint = () => {
    audio.playClick();
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-gemdark/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[94vh] flex flex-col shadow-2xl border-4 border-amber-400 overflow-hidden relative">
        {/* Modal Controls Header */}
        <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-500 p-4 text-white flex items-center justify-between no-print">
          <div className="flex items-center gap-2.5">
            <Award className="w-6 h-6 text-yellow-200" />
            <div>
              <h3 className="font-black text-sm sm:text-base leading-tight">
                Kartu Prestasi & Sertifikat Juara GEMBIRA
              </h3>
              <p className="text-[11px] text-amber-100 font-medium">
                Dapat diunduh sebagai gambar .PNG beresolusi tinggi atau dicetak langsung!
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleDownloadPng}
              disabled={isGenerating}
              className="px-4 py-2 bg-white text-amber-900 hover:bg-amber-100 active:scale-95 font-black text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 gem-btn-press"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isGenerating ? 'Membuat...' : 'Unduh Gambar (.PNG)'}</span>
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="px-3 py-2 bg-white/20 hover:bg-white/30 text-white font-bold text-xs rounded-xl transition-all flex items-center gap-1"
              title="Cetak via Printer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Cetak</span>
            </button>

            <button
              type="button"
              onClick={() => {
                audio.playClick();
                onClose();
              }}
              className="w-9 h-9 rounded-xl bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-all ml-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Certificate Visual Preview Canvas */}
        <div className="p-4 sm:p-8 overflow-y-auto flex-1 bg-amber-50/50 flex flex-col items-center">
          {downloadSuccess && (
            <div className="w-full max-w-2xl bg-emerald-100 border border-emerald-300 text-emerald-800 p-3 rounded-2xl text-xs font-black text-center mb-4 animate-in fade-in">
              🎉 Sertifikat berhasil diunduh ke perangkat Anda! Silakan simpan dan bagikan kepada keluarga tercinta!
            </div>
          )}

          {/* Printable Visual Certificate Frame */}
          <div
            ref={cardRef}
            className="w-full max-w-3xl bg-gradient-to-b from-amber-50/70 via-white to-yellow-50/60 rounded-3xl p-6 sm:p-10 border-8 border-double border-amber-400 shadow-xl relative text-center"
          >
            {/* Top Official Banner */}
            <div className="mb-4">
              <span className="text-[11px] font-black text-purple-700 tracking-wider uppercase block">
                Program Kreativitas Mahasiswa - Karsa Cipta (PKM-KC 2026)
              </span>
              <span className="text-[10px] text-gray-400 font-bold block mt-0.5">
                No. Registrasi: {certNumber}
              </span>
            </div>

            {/* Certificate Header */}
            <h1 className="text-2xl sm:text-4xl font-black text-gemdark tracking-tight mb-1">
              SERTIFIKAT PRESTASI PETUALANG CILIK
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 italic mb-6">
              Dianugerahkan dengan bangga dan rasa apresiasi mendalam kepada:
            </p>

            {/* Recipient & Avatar */}
            <div className="my-5 flex flex-col items-center">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-white shadow-md border-3 border-amber-300 flex items-center justify-center mb-3">
                <AvatarDisplay avatar={child.avatar} equipped={child.equipped} size="lg" />
              </div>
              <h2 className="text-3xl sm:text-5xl font-black text-amber-600 tracking-tight drop-shadow-sm uppercase">
                {child.nickname}
              </h2>
              <span className="inline-block mt-2 bg-purple-100 text-purple-900 px-4 py-1 rounded-full text-xs sm:text-sm font-black border border-purple-200">
                ★ Juara Pembelajar Tangguh & Sahabat Hebat Keluarga ★
              </span>
            </div>

            {/* Narrative Commendation */}
            <p className="text-xs sm:text-sm text-gray-700 max-w-xl mx-auto leading-relaxed my-5 font-medium">
              Atas dedikasi, rasa ingin tahu, dan semangat pantang menyerah dalam menuntaskan tantangan belajar tanpa rasa takut keliru, serta aktif melaksanakan aksi kebaikan nyata di rumah bersama keluarga tercinta.
            </p>

            {/* Stat Badges Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-6 max-w-2xl mx-auto">
              <div className="bg-white p-3 rounded-2xl border-2 border-amber-200 shadow-xs">
                <span className="text-lg sm:text-xl font-black text-amber-800 block">
                  🪙 {child.coinsBalance}
                </span>
                <span className="text-[10px] text-gray-500 font-bold uppercase">
                  Koin Belajar
                </span>
              </div>

              <div className="bg-white p-3 rounded-2xl border-2 border-amber-200 shadow-xs">
                <span className="text-lg sm:text-xl font-black text-amber-800 block">
                  ⭐ {child.starsTotal}
                </span>
                <span className="text-[10px] text-gray-500 font-bold uppercase">
                  Bintang Prestasi
                </span>
              </div>

              <div className="bg-white p-3 rounded-2xl border-2 border-amber-200 shadow-xs">
                <span className="text-lg sm:text-xl font-black text-amber-800 block">
                  🏡 {completedQuests.length} Aksi
                </span>
                <span className="text-[10px] text-gray-500 font-bold uppercase">
                  Misi Nyata Selesai
                </span>
              </div>

              <div className="bg-white p-3 rounded-2xl border-2 border-amber-200 shadow-xs">
                <span className="text-lg sm:text-xl font-black text-pink-600 block">
                  ❤️ {child.buddyHappiness ?? 85}%
                </span>
                <span className="text-[10px] text-gray-500 font-bold uppercase">
                  Cinta Sahabat
                </span>
              </div>
            </div>

            {/* Domains Endorsement */}
            <div className="text-[11px] text-gray-500 font-bold bg-amber-100/60 p-2.5 rounded-2xl border border-amber-200/60 max-w-xl mx-auto mb-8">
              ✨ Telah mengasah: Numerasi Tangkas • Literasi Nusantara • Eksplorasi Sensori • Karakter Mulia ({sessions.length} sesi belajar tuntas)
            </div>

            {/* Signatures & Stamp Footer */}
            <div className="pt-6 border-t-2 border-amber-200 flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-gray-600">
              <div className="text-center sm:text-left">
                <span className="block font-bold text-gray-800">
                  Diterbitkan: {currentDateFormatted}
                </span>
                <span className="text-[11px] text-gray-500">
                  Platform GEMBIRA Indonesia
                </span>
                <span className="text-[10px] text-emerald-700 block font-bold mt-0.5">
                  ✓ Kepatuhan Privasi Ramah Anak
                </span>
              </div>

              {/* Official Seal Stamp */}
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-300 border-2 border-amber-500 flex items-center justify-center text-3xl shadow-md">
                  🎖️
                </div>
                <span className="text-[10px] font-black uppercase text-amber-800 mt-1">
                  Cap Stempel Resmi
                </span>
              </div>

              <div className="text-center sm:text-right">
                <span className="block font-bold text-purple-900">
                  Tim PKM-KC GEMBIRA 2026
                </span>
                <span className="text-[11px] text-gray-500">
                  Karya Inovasi Teknologi Inklusif
                </span>
                <span className="text-[10px] text-gray-400 block mt-0.5">
                  Belajar Tanpa Rasa Diuji
                </span>
              </div>
            </div>

            {/* Background watermark stars */}
            <div className="absolute top-8 left-8 text-amber-200/40 text-6xl pointer-events-none select-none">
              ★
            </div>
            <div className="absolute bottom-8 right-8 text-amber-200/40 text-6xl pointer-events-none select-none">
              ★
            </div>
          </div>
        </div>

        {/* Bottom Download Action Bar */}
        <div className="p-4 bg-white border-t border-gray-200 flex items-center justify-between no-print">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Format berkas: <strong>Gambar PNG Resolusi Tinggi (1200 × 820 px)</strong></span>
          </div>

          <button
            type="button"
            onClick={handleDownloadPng}
            disabled={isGenerating}
            className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-black text-xs rounded-2xl shadow-md transition-all flex items-center gap-2 gem-btn-press"
          >
            <Download className="w-4 h-4" />
            <span>Unduh Sekarang (.PNG)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
