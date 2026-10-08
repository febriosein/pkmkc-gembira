import { Domain, SkillSnapshot, SkillStatus } from '../types';
import { storage } from './storage';

interface DomainMetadata {
  title: string;
  icon: string;
  offlineTip: string;
}

const DOMAIN_METADATA: Record<Domain, DomainMetadata> = {
  'numerasi': {
    title: 'Numerasi & Hitung Cepat',
    icon: '🔢',
    offlineTip: 'Ajak anak menghitung jumlah sendok saat menyiapkan meja makan atau mengelompokkan mainan berdasarkan jumlah 1–10.',
  },
  'literasi': {
    title: 'Literasi & Kosakata',
    icon: '📖',
    offlineTip: 'Bacakan buku cerita bergambar 10–15 menit sebelum tidur dan tanyakan nama-nama tokoh atau benda dalam cerita.',
  },
  'warna-bentuk': {
    title: 'Warna & Geometri',
    icon: '🎨',
    offlineTip: 'Bermain detektif bentuk di rumah: cari 3 benda berbentuk lingkaran dan 3 benda berbentuk kotak di sekitar ruangan.',
  },
  'sosial-emosional': {
    title: 'Sosial, Emosional & Karakter',
    icon: '🤝',
    offlineTip: 'Diskusikan perasaan anak setelah beraktivitas: "Bagaimana perasaanmu hari ini? Apa yang membuatmu tersenyum?"',
  },
  'pengetahuan-alam': {
    title: 'Pengetahuan Alam & Satwa',
    icon: '🌿',
    offlineTip: 'Amati hewan di sekitar rumah (kucing, burung, semut) dan diskusikan suara serta makanan favorit mereka.',
  },
  'memori': {
    title: 'Daya Ingat & Konsentrasi',
    icon: '🧩',
    offlineTip: 'Bermain tebak ingatan: letakkan 4 mainan di meja, tutup mata anak, ambil 1 mainan, lalu tebak mainan apa yang hilang.',
  },
};

export class DiagnosticService {
  public calculateSkillSnapshots(childId: string): SkillSnapshot[] {
    const domains: Domain[] = [
      'numerasi',
      'literasi',
      'warna-bentuk',
      'sosial-emosional',
      'pengetahuan-alam',
      'memori',
    ];

    return domains.map(domain => {
      const attempts = storage.getAttempts(childId, domain);
      const meta = DOMAIN_METADATA[domain];

      // Rolling last 20 attempts
      const recentAttempts = attempts.slice(-20);
      const count = recentAttempts.length;

      if (count < 3) {
        return {
          domain,
          title: meta.title,
          icon: meta.icon,
          accuracy: 0,
          attemptsCount: count,
          avgResponseMs: 0,
          trend: 'stable',
          status: 'data-kurang' as SkillStatus,
          statusText: 'Data Belum Cukup',
          recommendations: ['Mainkan minimal 3 soal pada bidang ini untuk melihat indikator akurasi.'],
        };
      }

      const correctCount = recentAttempts.filter(a => a.isCorrect).length;
      const accuracy = Math.round((correctCount / count) * 100);

      const totalMs = recentAttempts.reduce((sum, a) => sum + (a.responseMs || 3000), 0);
      const avgResponseMs = Math.round(totalMs / count);

      // Trend calculation: compare first half with second half
      let trend: 'up' | 'down' | 'stable' = 'stable';
      if (count >= 6) {
        const half = Math.floor(count / 2);
        const firstHalfAcc = recentAttempts.slice(0, half).filter(a => a.isCorrect).length / half;
        const secondHalfAcc = recentAttempts.slice(half).filter(a => a.isCorrect).length / (count - half);
        if (secondHalfAcc > firstHalfAcc + 0.1) trend = 'up';
        else if (secondHalfAcc < firstHalfAcc - 0.1) trend = 'down';
      }

      let status: SkillStatus = 'berkembang';
      let statusText = 'Berkembang Baik';
      const recommendations: string[] = [];

      if (accuracy >= 80) {
        status = 'unggul';
        statusText = 'Unggul / Sangat Mahir';
        recommendations.push(`Anak menunjukkan pemahaman luar biasa pada ${meta.title}! Berikan tantangan tingkat lanjut untuk memperkaya rasa ingin tahunya.`);
      } else if (accuracy < 60) {
        status = 'perlu-perhatian';
        statusText = 'Perlu Pendampingan';
        recommendations.push(meta.offlineTip);
      } else {
        status = 'berkembang';
        statusText = 'Berkembang Sesuai Harapan';
        recommendations.push(`Pemahaman anak berkembang konsisten. Lanjutkan sesi belajar 5–10 menit secara teratur.`);
      }

      return {
        domain,
        title: meta.title,
        icon: meta.icon,
        accuracy,
        attemptsCount: count,
        avgResponseMs,
        trend,
        status,
        statusText,
        recommendations,
      };
    });
  }
}

export const diagnostic = new DiagnosticService();
