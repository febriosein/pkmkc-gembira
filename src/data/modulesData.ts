import { Domain, DifficultyLevel } from '../types';

export interface ModuleQuestion {
  id: string;
  difficulty: DifficultyLevel;
  prompt: string;
  speechText: string;
  media?: {
    type: 'emoji' | 'shape' | 'audio_desc' | 'comparison' | 'memory' | 'story';
    value: string;
    extra?: any;
  };
  options: {
    id: string;
    label: string;
    sublabel?: string;
    emoji?: string;
    colorClass?: string;
    isCorrect: boolean;
    explanation?: string;
  }[];
}

export interface ModuleItem {
  id: string;
  moduleNumber: number;
  slug: string;
  title: string;
  subtitle: string;
  domain: Domain;
  icon: string;
  color: string;
  borderColor: string;
  bgLight: string;
  badgeColor: string;
  description: string;
  questions: ModuleQuestion[];
}

export const MODULES_CATALOG: ModuleItem[] = [
  // M1: Mengenal Warna
  {
    id: 'm1-warna',
    moduleNumber: 1,
    slug: 'm1-warna',
    title: 'Mengenal Warna Ceria',
    subtitle: 'Warna Primer, Sekunder & Campuran',
    domain: 'warna-bentuk',
    icon: '🎨',
    color: 'from-pink-500 to-rose-400',
    borderColor: 'border-gempink',
    bgLight: 'bg-pink-50',
    badgeColor: 'bg-pink-100 text-gempink',
    description: 'Kenali warna-warna indah di sekitar kita dari warna primer hingga keajaiban pencampuran warna.',
    questions: [
      // MUDAH (PAUD)
      {
        id: 'q-m1-mudah-1',
        difficulty: 'mudah',
        prompt: 'Warna apakah buah apel matang ini?',
        speechText: 'Warna apakah buah apel matang ini?',
        media: { type: 'emoji', value: '🍎' },
        options: [
          { id: 'o1', label: 'Merah', emoji: '🔴', isCorrect: true, explanation: 'Benar! Apel matang berwarna merah segar.' },
          { id: 'o2', label: 'Biru', emoji: '🔵', isCorrect: false },
          { id: 'o3', label: 'Kuning', emoji: '🟡', isCorrect: false },
        ]
      },
      {
        id: 'q-m1-mudah-2',
        difficulty: 'mudah',
        prompt: 'Warna apakah buah pisang yang sudah manis?',
        speechText: 'Warna apakah buah pisang yang sudah manis?',
        media: { type: 'emoji', value: '🍌' },
        options: [
          { id: 'o1', label: 'Hijau', emoji: '🟢', isCorrect: false },
          { id: 'o2', label: 'Kuning', emoji: '🟡', isCorrect: true, explanation: 'Hebat! Pisang manis berwarna kuning cerah.' },
          { id: 'o3', label: 'Ungu', emoji: '🟣', isCorrect: false },
        ]
      },
      {
        id: 'q-m1-mudah-3',
        difficulty: 'mudah',
        prompt: 'Warna apakah daun pohon yang segar ini?',
        speechText: 'Warna apakah daun pohon yang segar ini?',
        media: { type: 'emoji', value: '🍃' },
        options: [
          { id: 'o1', label: 'Merah', emoji: '🔴', isCorrect: false },
          { id: 'o2', label: 'Hijau', emoji: '🟢', isCorrect: true, explanation: 'Pintar sekali! Daun pohon segar berwarna hijau.' },
          { id: 'o3', label: 'Hitam', emoji: '⚫', isCorrect: false },
        ]
      },
      {
        id: 'q-m1-mudah-4',
        difficulty: 'mudah',
        prompt: 'Warna apakah wortel segar yang disukai kelinci?',
        speechText: 'Warna apakah wortel segar yang disukai kelinci?',
        media: { type: 'emoji', value: '🥕' },
        options: [
          { id: 'o1', label: 'Oranye (Jingga)', emoji: '🟠', isCorrect: true, explanation: 'Tepat! Wortel berwarna oranye jingga cerah.' },
          { id: 'o2', label: 'Biru', emoji: '🔵', isCorrect: false },
          { id: 'o3', label: 'Hitam', emoji: '⚫', isCorrect: false },
        ]
      },

      // SEDANG (SD FASE A)
      {
        id: 'q-m1-sedang-1',
        difficulty: 'sedang',
        prompt: 'Warna apakah sayur terong ungu yang lezat ini?',
        speechText: 'Warna apakah sayur terong ungu ini?',
        media: { type: 'emoji', value: '🍆' },
        options: [
          { id: 'o1', label: 'Ungu', emoji: '🟣', isCorrect: true, explanation: 'Benar! Terong memiliki kulit berwarna ungu tua.' },
          { id: 'o2', label: 'Kuning', emoji: '🟡', isCorrect: false },
          { id: 'o3', label: 'Merah', emoji: '🔴', isCorrect: false },
          { id: 'o4', label: 'Hijau', emoji: '🟢', isCorrect: false },
        ]
      },
      {
        id: 'q-m1-sedang-2',
        difficulty: 'sedang',
        prompt: 'Warna apakah biji kopi atau batang pohon cokelat?',
        speechText: 'Warna apakah batang pohon cokelat?',
        media: { type: 'emoji', value: '🪵' },
        options: [
          { id: 'o1', label: 'Biru', emoji: '🔵', isCorrect: false },
          { id: 'o2', label: 'Cokelat', emoji: '🟤', isCorrect: true, explanation: 'Hebat! Batang kayu dan tanah subur berwarna cokelat.' },
          { id: 'o3', label: 'Kuning', emoji: '🟡', isCorrect: false },
          { id: 'o4', label: 'Merah Muda', emoji: '🌸', isCorrect: false },
        ]
      },
      {
        id: 'q-m1-sedang-3',
        difficulty: 'sedang',
        prompt: 'Warna apakah gumpalan awan cerah di langit siang hari?',
        speechText: 'Warna apakah gumpalan awan cerah di langit?',
        media: { type: 'emoji', value: '☁️' },
        options: [
          { id: 'o1', label: 'Putih Bersih', emoji: '⚪', isCorrect: true, explanation: 'Tepat! Awan di cuaca cerah berwarna putih bersih.' },
          { id: 'o2', label: 'Hitam', emoji: '⚫', isCorrect: false },
          { id: 'o3', label: 'Merah', emoji: '🔴', isCorrect: false },
          { id: 'o4', label: 'Cokelat', emoji: '🟤', isCorrect: false },
        ]
      },

      // SULIT / TANTANGAN (SD FASE B-C)
      {
        id: 'q-m1-sulit-1',
        difficulty: 'sulit',
        prompt: 'Jika warna MERAH dicampur dengan warna KUNING, akan menghasilkan warna apa?',
        speechText: 'Jika warna merah dicampur dengan kuning, akan menghasilkan warna apa?',
        media: { type: 'emoji', value: '🔴 + 🟡 = ?' },
        options: [
          { id: 'o1', label: 'Oranye (Jingga)', emoji: '🟠', isCorrect: true, explanation: 'Luar biasa! Merah dan kuning bercampur menjadi warna oranye!' },
          { id: 'o2', label: 'Hijau', emoji: '🟢', isCorrect: false },
          { id: 'o3', label: 'Ungu', emoji: '🟣', isCorrect: false },
          { id: 'o4', label: 'Hitam', emoji: '⚫', isCorrect: false },
        ]
      },
      {
        id: 'q-m1-sulit-2',
        difficulty: 'sulit',
        prompt: 'Jika warna BIRU dicampur dengan warna KUNING, akan menghasilkan warna apa?',
        speechText: 'Jika warna biru dicampur dengan kuning, akan menghasilkan warna apa?',
        media: { type: 'emoji', value: '🔵 + 🟡 = ?' },
        options: [
          { id: 'o1', label: 'Ungu', emoji: '🟣', isCorrect: false },
          { id: 'o2', label: 'Hijau Segar', emoji: '🟢', isCorrect: true, explanation: 'Sangat pintar! Biru dicampur kuning menghasilkan warna hijau.' },
          { id: 'o3', label: 'Merah', emoji: '🔴', isCorrect: false },
          { id: 'o4', label: 'Cokelat', emoji: '🟤', isCorrect: false },
        ]
      },
      {
        id: 'q-m1-sulit-3',
        difficulty: 'sulit',
        prompt: 'Jika warna MERAH dicampur dengan warna BIRU, akan menghasilkan warna apa?',
        speechText: 'Jika warna merah dicampur dengan biru, akan menghasilkan warna apa?',
        media: { type: 'emoji', value: '🔴 + 🔵 = ?' },
        options: [
          { id: 'o1', label: 'Ungu Elegan', emoji: '🟣', isCorrect: true, explanation: 'Tepat sekali! Merah dan biru membentuk warna ungu yang indah.' },
          { id: 'o2', label: 'Oranye', emoji: '🟠', isCorrect: false },
          { id: 'o3', label: 'Hijau', emoji: '🟢', isCorrect: false },
          { id: 'o4', label: 'Kuning', emoji: '🟡', isCorrect: false },
        ]
      }
    ]
  },

  // M2: Bentuk Geometri
  {
    id: 'm2-geometri',
    moduleNumber: 2,
    slug: 'm2-geometri',
    title: 'Bentuk Geometri Seru',
    subtitle: 'Lingkaran, Bangun Datar & Sudut',
    domain: 'warna-bentuk',
    icon: '📐',
    color: 'from-amber-500 to-yellow-400',
    borderColor: 'border-gemyellow',
    bgLight: 'bg-amber-50',
    badgeColor: 'bg-amber-100 text-amber-800',
    description: 'Temukan bentuk-bentuk geometri dasar, atribut sudut, dan benda nyata di sekitar kita.',
    questions: [
      // MUDAH
      {
        id: 'q-m2-mudah-1',
        difficulty: 'mudah',
        prompt: 'Benda manakah yang berbentuk Lingkaran bulat?',
        speechText: 'Benda manakah yang berbentuk Lingkaran bulat?',
        media: { type: 'shape', value: '⭕ Lingkaran' },
        options: [
          { id: 'o1', label: 'Roda Sepeda', emoji: '🛞', isCorrect: true, explanation: 'Tepat! Roda sepeda bulat melingkar.' },
          { id: 'o2', label: 'Buku Tulis', emoji: '📖', isCorrect: false },
          { id: 'o3', label: 'Papan Tulis', emoji: '📋', isCorrect: false },
        ]
      },
      {
        id: 'q-m2-mudah-2',
        difficulty: 'mudah',
        prompt: 'Benda manakah yang berbentuk Persegi (kotak sama sisi)?',
        speechText: 'Benda manakah yang berbentuk Persegi kotak sama sisi?',
        media: { type: 'shape', value: '🟩 Persegi' },
        options: [
          { id: 'o1', label: 'Dadu Mainan', emoji: '🎲', isCorrect: true, explanation: 'Hebat! Sisi-sisi dadu berbentuk persegi kotak.' },
          { id: 'o2', label: 'Bola Kaki', emoji: '⚽', isCorrect: false },
          { id: 'o3', label: 'Telur Ayam', emoji: '🥚', isCorrect: false },
        ]
      },
      {
        id: 'q-m2-mudah-3',
        difficulty: 'mudah',
        prompt: 'Benda manakah yang memiliki bentuk Segitiga dengan 3 sudut?',
        speechText: 'Benda manakah yang memiliki bentuk Segitiga?',
        media: { type: 'shape', value: '🔺 Segitiga' },
        options: [
          { id: 'o1', label: 'Potongan Pizza', emoji: '🍕', isCorrect: true, explanation: 'Yum! Potongan pizza membentuk segitiga.' },
          { id: 'o2', label: 'Koin Logam', emoji: '🪙', isCorrect: false },
          { id: 'o3', label: 'Bantal Tidur', emoji: '🛌', isCorrect: false },
        ]
      },

      // SEDANG
      {
        id: 'q-m2-sedang-1',
        difficulty: 'sedang',
        prompt: 'Pintu rumah dan papan tulis kelas memiliki bentuk apa?',
        speechText: 'Pintu rumah dan papan tulis memiliki bentuk apa?',
        media: { type: 'shape', value: '🚪 Pintu Rumah' },
        options: [
          { id: 'o1', label: 'Persegi Panjang', emoji: '🚪', isCorrect: true, explanation: 'Benar! Memiliki 2 pasang sisi sejajar yang berbeda panjang.' },
          { id: 'o2', label: 'Lingkaran', emoji: '⭕', isCorrect: false },
          { id: 'o3', label: 'Segitiga', emoji: '🔺', isCorrect: false },
          { id: 'o4', label: 'Bintang', emoji: '⭐', isCorrect: false },
        ]
      },
      {
        id: 'q-m2-sedang-2',
        difficulty: 'sedang',
        prompt: 'Bentuk apakah telur ayam dan cermin hias yang lonjong?',
        speechText: 'Bentuk apakah telur ayam yang lonjong?',
        media: { type: 'shape', value: '🥚 Telur Lonjong' },
        options: [
          { id: 'o1', label: 'Oval (Lonjong)', emoji: '🥚', isCorrect: true, explanation: 'Pintar! Bentuk lonjong seperti telur disebut oval.' },
          { id: 'o2', label: 'Persegi', emoji: '🟩', isCorrect: false },
          { id: 'o3', label: 'Segitiga', emoji: '🔺', isCorrect: false },
          { id: 'o4', label: 'Balok', emoji: '🧱', isCorrect: false },
        ]
      },

      // SULIT
      {
        id: 'q-m2-sulit-1',
        difficulty: 'sulit',
        prompt: 'Berapa banyak sisi dan titik sudut yang dimiliki oleh bangun Segitiga?',
        speechText: 'Berapa banyak sisi dan titik sudut yang dimiliki bangun Segitiga?',
        media: { type: 'shape', value: '🔺 Analisis Sudut' },
        options: [
          { id: 'o1', label: '3 Sisi & 3 Titik Sudut', emoji: '3️⃣', isCorrect: true, explanation: 'Luar biasa! Segitiga selalu memiliki 3 sisi dan 3 titik sudut.' },
          { id: 'o2', label: '4 Sisi & 4 Sudut', emoji: '4️⃣', isCorrect: false },
          { id: 'o3', label: '5 Sisi & 5 Sudut', emoji: '5️⃣', isCorrect: false },
          { id: 'o4', label: '0 Sudut', emoji: '0️⃣', isCorrect: false },
        ]
      },
      {
        id: 'q-m2-sulit-2',
        difficulty: 'sulit',
        prompt: 'Bangun datar manakah yang TIDAK memiliki sudut sama sekali (0 sudut)?',
        speechText: 'Bangun datar manakah yang tidak memiliki sudut sama sekali?',
        media: { type: 'shape', value: '❓ 0 Titik Sudut' },
        options: [
          { id: 'o1', label: 'Lingkaran Bulat', emoji: '⭕', isCorrect: true, explanation: 'Tepat sekali! Lingkaran dibentuk dari satu garis lengkung tanpa sudut.' },
          { id: 'o2', label: 'Persegi', emoji: '🟩', isCorrect: false },
          { id: 'o3', label: 'Persegi Panjang', emoji: '🚪', isCorrect: false },
          { id: 'o4', label: 'Segitiga', emoji: '🔺', isCorrect: false },
        ]
      }
    ]
  },

  // M3: Hitung Hewan Melompat
  {
    id: 'm3-hitung-hewan',
    moduleNumber: 3,
    slug: 'm3-hitung-hewan',
    title: 'Hitung Hewan Melompat',
    subtitle: 'Berhitung Cepat & Kuantitas Satwa',
    domain: 'numerasi',
    icon: '🐸',
    color: 'from-emerald-500 to-green-400',
    borderColor: 'border-gemgreen',
    bgLight: 'bg-emerald-50',
    badgeColor: 'bg-emerald-100 text-gemgreen',
    description: 'Hitung lompatan katak, kelinci, dan satwa lucu melintasi bebatuan sungai.',
    questions: [
      // MUDAH
      {
        id: 'q-m3-mudah-1',
        difficulty: 'mudah',
        prompt: 'Katak melompat 3 kali, lalu melompat lagi 2 kali. Berapa total lompatannya?',
        speechText: 'Katak melompat tiga kali, lalu dua kali lagi. Berapa totalnya?',
        media: { type: 'emoji', value: '🐸 🪨🪨🪨 + 🪨🪨' },
        options: [
          { id: 'o1', label: '5 Lompatan', emoji: '5️⃣', isCorrect: true, explanation: 'Benar! 3 + 2 = 5 lompatan.' },
          { id: 'o2', label: '4 Lompatan', emoji: '4️⃣', isCorrect: false },
          { id: 'o3', label: '6 Lompatan', emoji: '6️⃣', isCorrect: false },
        ]
      },
      {
        id: 'q-m3-mudah-2',
        difficulty: 'mudah',
        prompt: 'Ada 4 kelinci melompat di kebun, datang lagi 3 kelinci. Berapa semua kelinci?',
        speechText: 'Ada empat kelinci, datang lagi tiga kelinci. Berapa jumlahnya?',
        media: { type: 'emoji', value: '🐰🐰🐰🐰 + 🐰🐰🐰' },
        options: [
          { id: 'o1', label: '7 Kelinci', emoji: '7️⃣', isCorrect: true, explanation: 'Hebat! 4 + 3 = 7 kelinci.' },
          { id: 'o2', label: '6 Kelinci', emoji: '6️⃣', isCorrect: false },
          { id: 'o3', label: '8 Kelinci', emoji: '8️⃣', isCorrect: false },
        ]
      },

      // SEDANG
      {
        id: 'q-m3-sedang-1',
        difficulty: 'sedang',
        prompt: 'Ada 12 katak di danau, 4 katak melompat menyelam ke air. Berapa katak yang masih di atas batu?',
        speechText: 'Ada dua belas katak, empat katak menyelam. Berapa yang tersisa?',
        media: { type: 'emoji', value: '🐸 12 - 4 = ?' },
        options: [
          { id: 'o1', label: '8 Katak', emoji: '8️⃣', isCorrect: true, explanation: 'Pintar! 12 dikurang 4 sama dengan 8.' },
          { id: 'o2', label: '7 Katak', emoji: '7️⃣', isCorrect: false },
          { id: 'o3', label: '9 Katak', emoji: '9️⃣', isCorrect: false },
          { id: 'o4', label: '6 Katak', emoji: '6️⃣', isCorrect: false },
        ]
      },
      {
        id: 'q-m3-sedang-2',
        difficulty: 'sedang',
        prompt: 'Kelinci melompat 8 langkah ke depan, lalu melompat 7 langkah lagi. Berapa total langkahnya?',
        speechText: 'Kelinci melompat delapan langkah, lalu tujuh langkah lagi. Berapa total langkahnya?',
        media: { type: 'emoji', value: '🐰 8 + 7 = ?' },
        options: [
          { id: 'o1', label: '15 Langkah', emoji: '1️⃣5️⃣', isCorrect: true, explanation: 'Luar biasa! 8 + 7 = 15 langkah.' },
          { id: 'o2', label: '14 Langkah', emoji: '1️⃣4️⃣', isCorrect: false },
          { id: 'o3', label: '16 Langkah', emoji: '1️⃣6️⃣', isCorrect: false },
          { id: 'o4', label: '13 Langkah', emoji: '1️⃣3️⃣', isCorrect: false },
        ]
      },

      // SULIT
      {
        id: 'q-m3-sulit-1',
        difficulty: 'sulit',
        prompt: 'Ada 4 pohon di hutan. Di setiap pohon ada 5 tupai melompat. Berapa jumlah seluruh tupai?',
        speechText: 'Ada empat pohon. Di setiap pohon ada lima tupai. Berapa total tupai?',
        media: { type: 'emoji', value: '🐿️ 4 Pohon × 5 Tupai' },
        options: [
          { id: 'o1', label: '20 Tupai (4 × 5)', emoji: '2️⃣0️⃣', isCorrect: true, explanation: 'Sangat cerdas! 4 dikali 5 sama dengan 20 tupai.' },
          { id: 'o2', label: '18 Tupai', emoji: '1️⃣8️⃣', isCorrect: false },
          { id: 'o3', label: '24 Tupai', emoji: '2️⃣4️⃣', isCorrect: false },
          { id: 'o4', label: '16 Tupai', emoji: '1️⃣6️⃣', isCorrect: false },
        ]
      }
    ]
  },

  // M4: Dongeng Nilai Moral
  {
    id: 'm4-dongeng-moral',
    moduleNumber: 4,
    slug: 'm4-dongeng-moral',
    title: 'Dongeng Nilai Moral',
    subtitle: 'Karakter, Kejujuran & Budi Pekerti',
    domain: 'sosial-emosional',
    icon: '📖',
    color: 'from-purple-500 to-indigo-400',
    borderColor: 'border-gempurple',
    bgLight: 'bg-purple-50',
    badgeColor: 'bg-purple-100 text-gempurple',
    description: 'Cerita interaktif tentang sikap jujur, tolong-menolong, antre, dan menghargai teman.',
    questions: [
      // MUDAH
      {
        id: 'q-m4-mudah-1',
        difficulty: 'mudah',
        prompt: 'Kancil menemukan pensil milik teman di lantai kelas. Apa yang sebaiknya dilakukan Kancil?',
        speechText: 'Kancil menemukan pensil milik teman di lantai kelas. Apa yang sebaiknya dilakukan?',
        media: { type: 'story', value: '✏️ Pensil Tercecer' },
        options: [
          { id: 'o1', label: 'Mengembalikan ke teman pemiliknya', emoji: '🤝', isCorrect: true, explanation: 'Hebat! Sikap jujur dan mengembalikan barang orang lain adalah perbuatan terpuji.' },
          { id: 'o2', label: 'Menyimpan ke dalam tas sendiri', emoji: '🎒', isCorrect: false },
          { id: 'o3', label: 'Membiarkan terinjak di lantai', emoji: '🚶', isCorrect: false },
        ]
      },
      {
        id: 'q-m4-mudah-2',
        difficulty: 'mudah',
        prompt: 'Ketika adik ingin meminjam mobil-mobilan kesayanganmu, tindakan apa yang paling baik?',
        speechText: 'Ketika adik ingin meminjam mainanmu, apa tindakan yang paling baik?',
        media: { type: 'story', value: '🧸 Berbagi Mainan' },
        options: [
          { id: 'o1', label: 'Berbagi dan bermain bersama adik', emoji: '🤗', isCorrect: true, explanation: 'Bagus sekali! Berbagi mainan membuat suasana rumah ceria dan penuh kasih sayang.' },
          { id: 'o2', label: 'Berteriak memarahi adik', emoji: '😠', isCorrect: false },
          { id: 'o3', label: 'Menyembunyikan mainan', emoji: '📦', isCorrect: false },
        ]
      },

      // SEDANG
      {
        id: 'q-m4-sedang-1',
        difficulty: 'sedang',
        prompt: 'Di kantin sekolah banyak teman yang ingin membeli makanan. Sikap terpuji apa yang harus ditunjukkan?',
        speechText: 'Di kantin sekolah, sikap terpuji apa yang harus ditunjukkan?',
        media: { type: 'story', value: '🚶‍♂️ Antre Tertib' },
        options: [
          { id: 'o1', label: 'Mengantre dengan sabar dan tertib', emoji: '🧍', isCorrect: true, explanation: 'Tepat! Budaya antre menunjukkan sikap adil dan menghormati hak orang lain.' },
          { id: 'o2', label: 'Menyerobot antrean teman lain', emoji: '🏃', isCorrect: false },
          { id: 'o3', label: 'Mendorong teman di depan', emoji: '💥', isCorrect: false },
        ]
      },
      {
        id: 'q-m4-sedang-2',
        difficulty: 'sedang',
        prompt: 'Kamu tidak sengaja menumpahkan air minum di meja belajar teman. Apa yang harus kamu katakan dan lakukan?',
        speechText: 'Kamu tidak sengaja menumpahkan air di meja teman. Apa yang harus kamu lakukan?',
        media: { type: 'story', value: '💧 Tanggung Jawab' },
        options: [
          { id: 'o1', label: 'Minta maaf tulus dan bantu mengelap meja', emoji: '🧻', isCorrect: true, explanation: 'Luar biasa! Berani minta maaf dan bertanggung jawab membersihkannya adalah tanda anak berani dan berkarakter.' },
          { id: 'o2', label: 'Pura-pura tidak tahu dan lari', emoji: '🙈', isCorrect: false },
          { id: 'o3', label: 'Menyalahkan teman lain', emoji: '👉', isCorrect: false },
        ]
      },

      // SULIT
      {
        id: 'q-m4-sulit-1',
        difficulty: 'sulit',
        prompt: 'Saat istirahat, kamu melihat seorang teman baru diejek karena logat bicaranya yang berbeda. Sikap terbaikmu adalah:',
        speechText: 'Kamu melihat teman baru diejek karena perbedaan logat bicara. Sikap terbaikmu adalah:',
        media: { type: 'story', value: '🤝 Bhinneka Tunggal Ika' },
        options: [
          { id: 'o1', label: 'Mengajak berteman dan mengingatkan agar saling menghargai', emoji: '🌟', isCorrect: true, explanation: 'Hebat sekali! Menghargai perbedaan dan menolak perundungan adalah wujud profil pelajar Pancasila sejati.' },
          { id: 'o2', label: 'Ikut menertawakan teman baru', emoji: '😆', isCorrect: false },
          { id: 'o3', label: 'Menjauhi teman baru tersebut', emoji: '🚶', isCorrect: false },
        ]
      }
    ]
  },

  // M5: Tebak Suara Satwa
  {
    id: 'm5-suara-satwa',
    moduleNumber: 5,
    slug: 'm5-suara-satwa',
    title: 'Tebak Suara Satwa',
    subtitle: 'Dunia Fauna, Suara & Fakta Unik',
    domain: 'pengetahuan-alam',
    icon: '🦁',
    color: 'from-orange-500 to-amber-400',
    borderColor: 'border-gemorange',
    bgLight: 'bg-orange-50',
    badgeColor: 'bg-orange-100 text-gemorange',
    description: 'Dengarkan suara khas satwa liar dan peliharaan, serta pelajari fakta sainsnya.',
    questions: [
      // MUDAH
      {
        id: 'q-m5-mudah-1',
        difficulty: 'mudah',
        prompt: 'Suara siapa ini: "Kukuruyuk...!" di pagi hari saat fajar?',
        speechText: 'Suara siapa ini: Kukuruyuk, kukuruyuk di pagi hari?',
        media: { type: 'audio_desc', value: '🔊 "Kukuruyuk...!"' },
        options: [
          { id: 'o1', label: 'Ayam Jantan', emoji: '🐓', isCorrect: true, explanation: 'Benar! Ayam jantan berkokok kukuruyuk menyambut fajar.' },
          { id: 'o2', label: 'Kucing', emoji: '🐱', isCorrect: false },
          { id: 'o3', label: 'Sapi', emoji: '🐄', isCorrect: false },
        ]
      },
      {
        id: 'q-m5-mudah-2',
        difficulty: 'mudah',
        prompt: 'Suara siapa ini: "Mooo... Mooo..." pemakan rumput penghasil susu?',
        speechText: 'Suara siapa ini: Mooo, Mooo penghasil susu segar?',
        media: { type: 'audio_desc', value: '🔊 "Mooo... Mooo..."' },
        options: [
          { id: 'o1', label: 'Sapi Perah', emoji: '🐄', isCorrect: true, explanation: 'Tepat! Sapi bersuara mooo dan menghasilkan susu bergizi.' },
          { id: 'o2', label: 'Bebek', emoji: '🦆', isCorrect: false },
          { id: 'o3', label: 'Kuda', emoji: '🐴', isCorrect: false },
        ]
      },

      // SEDANG
      {
        id: 'q-m5-sedang-1',
        difficulty: 'sedang',
        prompt: 'Suara mengaum keras bergetar di hutan rimba: "ROAAARRRR...!" Siapakah raja hutan ini?',
        speechText: 'Suara mengaum keras di hutan rimba: Roarrr, siapakah raja hutan ini?',
        media: { type: 'audio_desc', value: '🔊 "ROAAARRR...!"' },
        options: [
          { id: 'o1', label: 'Singa Raja Hutan', emoji: '🦁', isCorrect: true, explanation: 'Hebat! Auman singa jantan bisa terdengar hingga jarak 8 kilometer.' },
          { id: 'o2', label: 'Kambing', emoji: '🐐', isCorrect: false },
          { id: 'o3', label: 'Kelinci', emoji: '🐰', isCorrect: false },
          { id: 'o4', label: 'Tikus', emoji: '🐭', isCorrect: false },
        ]
      },
      {
        id: 'q-m5-sedang-2',
        difficulty: 'sedang',
        prompt: 'Suara belalai melengking keras seperti terompet: "TRUUUUMMPP...!". Siapakah mamalia darat terbesar ini?',
        speechText: 'Suara belalai melengking seperti terompet. Siapakah mamalia darat terbesar ini?',
        media: { type: 'audio_desc', value: '🔊 Terompet Belalai' },
        options: [
          { id: 'o1', label: 'Gajah Belalai Panjang', emoji: '🐘', isCorrect: true, explanation: 'Pintar! Gajah menggunakan belalainya untuk bersuara, minum, dan menyapa kawanannya.' },
          { id: 'o2', label: 'Jerapah', emoji: '🦒', isCorrect: false },
          { id: 'o3', label: 'Zebra', emoji: '🦓', isCorrect: false },
          { id: 'o4', label: 'Badak', emoji: '🦏', isCorrect: false },
        ]
      },

      // SULIT
      {
        id: 'q-m5-sulit-1',
        difficulty: 'sulit',
        prompt: 'Mamalia cerdas di lautan yang bersiul dengan gelombang klik sonar untuk berkomunikasi adalah:',
        speechText: 'Mamalia cerdas di lautan yang bersiul dengan gelombang klik sonar adalah:',
        media: { type: 'audio_desc', value: '🔊 Siulan Gelombang Laut' },
        options: [
          { id: 'o1', label: 'Lumba-Lumba Cerdas', emoji: '🐬', isCorrect: true, explanation: 'Luar biasa! Lumba-lumba menggunakan ekolokasi sonar klik dan siulan untuk bernavigasi di samudra.' },
          { id: 'o2', label: 'Ikan Hiu', emoji: '🦈', isCorrect: false },
          { id: 'o3', label: 'Kepiting', emoji: '🦀', isCorrect: false },
          { id: 'o4', label: 'Penyu', emoji: '🐢', isCorrect: false },
        ]
      }
    ]
  },

  // M6: Hitung Buah Segar
  {
    id: 'm6-hitung-buah',
    moduleNumber: 6,
    slug: 'm6-hitung-buah',
    title: 'Hitung Buah Segar',
    subtitle: 'Perbandingan & Selisih Kuantitas',
    domain: 'numerasi',
    icon: '🍎',
    color: 'from-red-500 to-rose-400',
    borderColor: 'border-gempink',
    bgLight: 'bg-red-50',
    badgeColor: 'bg-red-100 text-red-600',
    description: 'Bandingkan keranjang buah, hitung kuantitas, dan tentukan selisih buah.',
    questions: [
      // MUDAH
      {
        id: 'q-m6-mudah-1',
        difficulty: 'mudah',
        prompt: 'Keranjang manakah yang memiliki buah LEBIH BANYAK?',
        speechText: 'Keranjang manakah yang memiliki buah lebih banyak?',
        media: { type: 'comparison', value: 'Keranjang A (5 Apel) vs Keranjang B (3 Apel)' },
        options: [
          { id: 'o1', label: 'Keranjang A (5 Apel 🍎🍎🍎🍎🍎)', emoji: '🧺', isCorrect: true, explanation: 'Tepat! 5 apel lebih banyak daripada 3 apel.' },
          { id: 'o2', label: 'Keranjang B (3 Apel 🍎🍎🍎)', emoji: '🧺', isCorrect: false },
        ]
      },
      {
        id: 'q-m6-mudah-2',
        difficulty: 'mudah',
        prompt: 'Piring manakah yang memiliki buah LEBIH SEDIKIT?',
        speechText: 'Piring manakah yang memiliki buah lebih sedikit?',
        media: { type: 'comparison', value: 'Piring X (2 Jeruk) vs Piring Y (6 Jeruk)' },
        options: [
          { id: 'o1', label: 'Piring X (2 Jeruk 🍊🍊)', emoji: '🍽️', isCorrect: true, explanation: 'Benar! 2 jeruk lebih sedikit daripada 6 jeruk.' },
          { id: 'o2', label: 'Piring Y (6 Jeruk 🍊🍊🍊🍊🍊🍊)', emoji: '🍽️', isCorrect: false },
        ]
      },

      // SEDANG
      {
        id: 'q-m6-sedang-1',
        difficulty: 'sedang',
        prompt: 'Keranjang Merah ada 8 stroberi 🍓. Keranjang Biru ada 11 stroberi 🍓. Berapa selisih banyaknya stroberi?',
        speechText: 'Keranjang Merah delapan stroberi, Keranjang Biru sebelas stroberi. Berapa selisihnya?',
        media: { type: 'comparison', value: '11 Stroberi - 8 Stroberi = ?' },
        options: [
          { id: 'o1', label: 'Selisih 3 Stroberi', emoji: '3️⃣', isCorrect: true, explanation: 'Hebat! 11 dikurang 8 adalah 3 stroberi.' },
          { id: 'o2', label: 'Selisih 2 Stroberi', emoji: '2️⃣', isCorrect: false },
          { id: 'o3', label: 'Selisih 4 Stroberi', emoji: '4️⃣', isCorrect: false },
        ]
      },

      // SULIT
      {
        id: 'q-m6-sulit-1',
        difficulty: 'sulit',
        prompt: 'Di Keranjang A ada 7 pisang. Agar jumlah pisang di Keranjang A menjadi sama dengan Keranjang B yang berisi 15 pisang, berapa pisang yang harus ditambahkan?',
        speechText: 'Ada tujuh pisang. Berapa pisang harus ditambah agar menjadi lima belas?',
        media: { type: 'comparison', value: '7 + ? = 15' },
        options: [
          { id: 'o1', label: 'Harus Ditambah 8 Pisang', emoji: '8️⃣', isCorrect: true, explanation: 'Luar biasa! 15 - 7 = 8 pisang yang perlu ditambahkan.' },
          { id: 'o2', label: 'Ditambah 6 Pisang', emoji: '6️⃣', isCorrect: false },
          { id: 'o3', label: 'Ditambah 9 Pisang', emoji: '9️⃣', isCorrect: false },
        ]
      }
    ]
  },

  // M7: Memori Kartu Satwa
  {
    id: 'm7-memori-kartu',
    moduleNumber: 7,
    slug: 'm7-memori-kartu',
    title: 'Memori Kartu Satwa',
    subtitle: 'Daya Ingat & Konsentrasi Pasangan',
    domain: 'memori',
    icon: '🃏',
    color: 'from-blue-600 to-indigo-500',
    borderColor: 'border-gemblue',
    bgLight: 'bg-blue-50',
    badgeColor: 'bg-blue-100 text-gemblue',
    description: 'Latih daya ingat dan konsentrasi menemukan pasangan gambar satwa kembar.',
    questions: [
      // MUDAH
      {
        id: 'q-m7-mudah-1',
        difficulty: 'mudah',
        prompt: 'Di kartu nomor 1 ada Singa 🦁 dan di nomor 3 ada Singa 🦁. Di nomor berapakah letak pasangan Singa kembar?',
        speechText: 'Di nomor berapakah letak pasangan Singa kembar?',
        media: { type: 'memory', value: 'Papan 4 Kartu (2 Pasang)' },
        options: [
          { id: 'o1', label: 'Kartu 1 dan Kartu 3 🦁', emoji: '🦁', isCorrect: true, explanation: 'Hebat! Kamu mengingat posisi gambar dengan sangat baik.' },
          { id: 'o2', label: 'Kartu 2 dan Kartu 4 🐱', emoji: '🐱', isCorrect: false },
        ]
      },

      // SEDANG
      {
        id: 'q-m7-sedang-1',
        difficulty: 'sedang',
        prompt: 'Papan 6 kartu (3 pasang). Panda 🐼 terletak di Baris Atas Kiri dan Baris Bawah Kanan. Pilih letak Panda yang benar:',
        speechText: 'Pilih letak Panda kembar yang benar pada papan enam kartu:',
        media: { type: 'memory', value: 'Papan 6 Kartu (3 Pasang)' },
        options: [
          { id: 'o1', label: 'Atas Kiri & Bawah Kanan (Panda 🐼)', emoji: '🐼', isCorrect: true, explanation: 'Pintar! Konsentrasi ingatanmu luar biasa tajam.' },
          { id: 'o2', label: 'Atas Tengah & Bawah Tengah (Kelinci 🐰)', emoji: '🐰', isCorrect: false },
          { id: 'o3', label: 'Atas Kanan & Bawah Kiri (Gajah 🐘)', emoji: '🐘', isCorrect: false },
        ]
      },

      // SULIT
      {
        id: 'q-m7-sulit-1',
        difficulty: 'sulit',
        prompt: 'Papan 8 kartu (4 pasang). Jika Kartu #2 adalah Jerapah 🦒 dan Kartu #7 adalah Jerapah 🦒, pasangan manakah yang tepat?',
        speechText: 'Pilih pasangan kartu Jerapah yang tepat pada papan delapan kartu:',
        media: { type: 'memory', value: 'Papan 8 Kartu (4 Pasang)' },
        options: [
          { id: 'o1', label: 'Kartu #2 dan Kartu #7 (Jerapah 🦒)', emoji: '🦒', isCorrect: true, explanation: 'Juara memori sejati! Kamu sukses menaklukkan tantangan 8 kartu!' },
          { id: 'o2', label: 'Kartu #1 dan Kartu #8 (Singa 🦁)', emoji: '🦁', isCorrect: false },
          { id: 'o3', label: 'Kartu #3 dan Kartu #5 (Zebra 🦓)', emoji: '🦓', isCorrect: false },
        ]
      }
    ]
  },

  // M8: Emosi dan Perasaan Kita
  {
    id: 'm8-emosi',
    moduleNumber: 8,
    slug: 'm8-emosi',
    title: 'Emosi & Perasaan Kita',
    subtitle: 'Pengenalan Diri & Regulasi Emosi',
    domain: 'sosial-emosional',
    icon: '😊',
    color: 'from-emerald-600 to-teal-500',
    borderColor: 'border-gemgreen',
    bgLight: 'bg-emerald-50',
    badgeColor: 'bg-emerald-100 text-gemgreen',
    description: 'Kenali perasaan senang, sedih, marah, tenang, serta cara mengelola emosi dengan bijak.',
    questions: [
      // MUDAH
      {
        id: 'q-m8-mudah-1',
        difficulty: 'mudah',
        prompt: 'Ketika kamu merayakan ulang tahun dan bermain dengan teman tersayang, perasaan apa yang dirasakan?',
        speechText: 'Ketika merayakan ulang tahun bersama teman, perasaan apa yang dirasakan?',
        media: { type: 'emoji', value: '🎂 Pesta Ceria' },
        options: [
          { id: 'o1', label: 'Senang & Gembira', emoji: '😄', isCorrect: true, explanation: 'Tentu saja! Berkumpul gembira membuat hati kita senang.' },
          { id: 'o2', label: 'Marah & Kesal', emoji: '😡', isCorrect: false },
          { id: 'o3', label: 'Takut', emoji: '😨', isCorrect: false },
        ]
      },
      {
        id: 'q-m8-mudah-2',
        difficulty: 'mudah',
        prompt: 'Ketika boneka atau mainan kesayanganmu tidak sengaja hilang, perasaan apa yang wajar dirasakan?',
        speechText: 'Ketika mainan kesayangan hilang, perasaan apa yang dirasakan?',
        media: { type: 'emoji', value: '🧸 Mainan Hilang' },
        options: [
          { id: 'o1', label: 'Sedih', emoji: '😢', isCorrect: true, explanation: 'Wajar merasa sedih saat kehilangan barang kesayangan. Kamu bisa cerita ke ayah dan ibu.' },
          { id: 'o2', label: 'Tertawa Gembira', emoji: '😆', isCorrect: false },
          { id: 'o3', label: 'Bangga', emoji: '🤩', isCorrect: false },
        ]
      },

      // SEDANG
      {
        id: 'q-m8-sedang-1',
        difficulty: 'sedang',
        prompt: 'Setelah giat belajar dan berhasil menyelesaikan teka-teki sulit, perasaan apa yang muncul di hatimu?',
        speechText: 'Setelah berhasil menyelesaikan teka-teki sulit, perasaan apa yang muncul?',
        media: { type: 'emoji', value: '🏆 Prestasi Belajar' },
        options: [
          { id: 'o1', label: 'Bangga & Percaya Diri', emoji: '🤩', isCorrect: true, explanation: 'Hebat! Usaha keras menghasilkan rasa bangga dan percaya diri.' },
          { id: 'o2', label: 'Takut', emoji: '😨', isCorrect: false },
          { id: 'o3', label: 'Iri Hati', emoji: '😒', isCorrect: false },
        ]
      },
      {
        id: 'q-m8-sedang-2',
        difficulty: 'sedang',
        prompt: 'Duduk santai di bawah pohon rindang sambil mendengarkan kicau burung membuat perasaan menjadi:',
        speechText: 'Duduk santai sambil mendengarkan kicau burung membuat perasaan menjadi apa?',
        media: { type: 'emoji', value: '🌳 Udara Segar' },
        options: [
          { id: 'o1', label: 'Tenang & Damai', emoji: '😌', isCorrect: true, explanation: 'Tepat! Suasana alam membantu tubuh dan pikiran rileks serta tenang.' },
          { id: 'o2', label: 'Marah Meluap', emoji: '😡', isCorrect: false },
          { id: 'o3', label: 'Panik', emoji: '😱', isCorrect: false },
        ]
      },

      // SULIT
      {
        id: 'q-m8-sulit-1',
        difficulty: 'sulit',
        prompt: 'Ketika kamu merasa sangat marah atau kesal, cara terbaik dan paling sehat untuk menenangkan diri adalah:',
        speechText: 'Ketika merasa sangat marah, cara terbaik untuk menenangkan diri adalah:',
        media: { type: 'emoji', value: '🧘 Regulasi Emosi' },
        options: [
          { id: 'o1', label: 'Tarik napas dalam, minum air, dan berbicara tenang', emoji: '🫁', isCorrect: true, explanation: 'Sangat bijak! Mengatur napas mengaktifkan ketenangan tubuh sehingga kita bisa berpikir jernih.' },
          { id: 'o2', label: 'Membanting barang dan berteriak', emoji: '💥', isCorrect: false },
          { id: 'o3', label: 'Memukul benda di sekitar', emoji: '👊', isCorrect: false },
        ]
      }
    ]
  }
];
