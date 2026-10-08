export interface WordItem {
  id: string;
  word: string; // Ejaan baku Bahasa Indonesia
  category: 'Hewan' | 'Buah & Makanan' | 'Kendaraan' | 'Alam & Lingkungan' | 'Benda Sekitar';
  clue: string;
  emoji: string;
  ageBand: 'paud' | 'sd-fase-a' | 'sd-fase-b';
}

export const WORD_BANK: WordItem[] = [
  // Hewan
  { id: 'w-1', word: 'KUCING', category: 'Hewan', clue: 'Hewan berbulu yang suka mengeong', emoji: '🐱', ageBand: 'paud' },
  { id: 'w-2', word: 'KELINCI', category: 'Hewan', clue: 'Hewan bertelinga panjang yang suka wortel', emoji: '🐰', ageBand: 'paud' },
  { id: 'w-3', word: 'GAJAH', category: 'Hewan', clue: 'Hewan bertubuh besar dengan belalai panjang', emoji: '🐘', ageBand: 'paud' },
  { id: 'w-4', word: 'SINGA', category: 'Hewan', clue: 'Raja hutan yang memiliki surai lebat', emoji: '🦁', ageBand: 'paud' },
  { id: 'w-5', word: 'BURUNG', category: 'Hewan', clue: 'Hewan bersayap yang pandai terbang', emoji: '🐦', ageBand: 'paud' },
  { id: 'w-6', word: 'KUDA', category: 'Hewan', clue: 'Hewan gagah yang bisa berlari kencang', emoji: '🐴', ageBand: 'paud' },
  { id: 'w-7', word: 'MONYET', category: 'Hewan', clue: 'Hewan lincah yang suka makan pisang', emoji: '🐵', ageBand: 'paud' },
  { id: 'w-8', word: 'IKAN', category: 'Hewan', clue: 'Hewan bersisik yang berenang di air', emoji: '🐟', ageBand: 'paud' },
  { id: 'w-9', word: 'BEBEK', category: 'Hewan', clue: 'Unggas berkaki dua yang suka berenang', emoji: '🦆', ageBand: 'paud' },
  { id: 'w-10', word: 'JERAPAH', category: 'Hewan', clue: 'Hewan dengan leher sangat panjang', emoji: '🦒', ageBand: 'sd-fase-a' },
  { id: 'w-11', word: 'LUMBA', category: 'Hewan', clue: 'Mamalia cerdas yang hidup di lautan', emoji: '🐬', ageBand: 'sd-fase-a' },
  { id: 'w-12', word: 'KUPU', category: 'Hewan', clue: 'Serangga bersayap indah penuh warna', emoji: '🦋', ageBand: 'paud' },

  // Buah & Makanan
  { id: 'w-13', word: 'APEL', category: 'Buah & Makanan', clue: 'Buah manis berwarna merah atau hijau', emoji: '🍎', ageBand: 'paud' },
  { id: 'w-14', word: 'PISANG', category: 'Buah & Makanan', clue: 'Buah manis berwarna kuning kesukaan monyet', emoji: '🍌', ageBand: 'paud' },
  { id: 'w-15', word: 'JERUK', category: 'Buah & Makanan', clue: 'Buah bulat segar kaya vitamin C', emoji: '🍊', ageBand: 'paud' },
  { id: 'w-16', word: 'ANGGUR', category: 'Buah & Makanan', clue: 'Buah kecil manis bergerombol ungu', emoji: '🍇', ageBand: 'paud' },
  { id: 'w-17', word: 'SEMANGKA', category: 'Buah & Makanan', clue: 'Buah berair manis bergaris hijau', emoji: '🍉', ageBand: 'paud' },
  { id: 'w-18', word: 'MANGGA', category: 'Buah & Makanan', clue: 'Buah manis beraroma harum', emoji: '🥭', ageBand: 'paud' },
  { id: 'w-19', word: 'STROBERI', category: 'Buah & Makanan', clue: 'Buah kecil merah berbintik manis masam', emoji: '🍓', ageBand: 'sd-fase-a' },
  { id: 'w-20', word: 'NANAS', category: 'Buah & Makanan', clue: 'Buah bermahkota daun berduri tajam', emoji: '🍍', ageBand: 'paud' },
  { id: 'w-21', word: 'ALPUKAT', category: 'Buah & Makanan', clue: 'Buah berbiji besar dengan daging lembut', emoji: '🥑', ageBand: 'sd-fase-a' },
  { id: 'w-22', word: 'JAGUNG', category: 'Buah & Makanan', clue: 'Tanaman berbiji kuning manis berklobot', emoji: '🌽', ageBand: 'paud' },

  // Kendaraan
  { id: 'w-23', word: 'MOBIL', category: 'Kendaraan', clue: 'Kendaraan beroda empat di jalan raya', emoji: '🚗', ageBand: 'paud' },
  { id: 'w-24', word: 'KERETA', category: 'Kendaraan', clue: 'Kendaraan panjang yang berjalan di atas rel', emoji: '🚆', ageBand: 'paud' },
  { id: 'w-25', word: 'PESAWAT', category: 'Kendaraan', clue: 'Kendaraan bersayap yang terbang di awan', emoji: '✈️', ageBand: 'paud' },
  { id: 'w-26', word: 'KAPAL', category: 'Kendaraan', clue: 'Kendaraan besar yang berlayar di laut', emoji: '🚢', ageBand: 'paud' },
  { id: 'w-27', word: 'SEPEDA', category: 'Kendaraan', clue: 'Kendaraan beroda dua yang dikayuh kaki', emoji: '🚲', ageBand: 'paud' },
  { id: 'w-28', word: 'HELIKOPTER', category: 'Kendaraan', clue: 'Kendaraan udara dengan baling-baling atas', emoji: '🚁', ageBand: 'sd-fase-a' },
  { id: 'w-29', word: 'PERAHU', category: 'Kendaraan', clue: 'Kendaraan kayu kecil di sungai atau danau', emoji: '🛶', ageBand: 'paud' },
  { id: 'w-30', word: 'BUS', category: 'Kendaraan', clue: 'Kendaraan besar pengangkut banyak penumpang', emoji: '🚌', ageBand: 'paud' },

  // Alam & Lingkungan
  { id: 'w-31', word: 'MATAHARI', category: 'Alam & Lingkungan', clue: 'Bintang terang yang menyinari siang hari', emoji: '☀️', ageBand: 'paud' },
  { id: 'w-32', word: 'BULAN', category: 'Alam & Lingkungan', clue: 'Benda langit yang bercahaya indah di malam hari', emoji: '🌙', ageBand: 'paud' },
  { id: 'w-33', word: 'BINTANG', category: 'Alam & Lingkungan', clue: 'Titik-titik cahaya berkilau di langit malam', emoji: '⭐', ageBand: 'paud' },
  { id: 'w-34', word: 'PELANGI', category: 'Alam & Lingkungan', clue: 'Lengkungan warna-warni setelah hujan', emoji: '🌈', ageBand: 'paud' },
  { id: 'w-35', word: 'GUNUNG', category: 'Alam & Lingkungan', clue: 'Tanah menjulang tinggi dan sejuk', emoji: '⛰️', ageBand: 'paud' },
  { id: 'w-36', word: 'AWAN', category: 'Alam & Lingkungan', clue: 'Gumpalan putih lembut di angkasa', emoji: '☁️', ageBand: 'paud' },
  { id: 'w-37', word: 'HUJAN', category: 'Alam & Lingkungan', clue: 'Tetesan air segar yang turun dari langit', emoji: '🌧️', ageBand: 'paud' },
  { id: 'w-38', word: 'POHON', category: 'Alam & Lingkungan', clue: 'Tumbuhan berbatang kokoh dan berdaun rindang', emoji: '🌳', ageBand: 'paud' },
  { id: 'w-39', word: 'BUNGA', category: 'Alam & Lingkungan', clue: 'Bagian tanaman yang indah dan harum', emoji: '🌸', ageBand: 'paud' },
  { id: 'w-40', word: 'PANTAI', category: 'Alam & Lingkungan', clue: 'Hamparan pasir di tepi lautan luas', emoji: '🏖️', ageBand: 'paud' },

  // Benda Sekitar
  { id: 'w-41', word: 'RUMAH', category: 'Benda Sekitar', clue: 'Tempat tinggal kita bersama keluarga tercinta', emoji: '🏠', ageBand: 'paud' },
  { id: 'w-42', word: 'BUKU', category: 'Benda Sekitar', clue: 'Kumpulan lembaran kertas sumber ilmu', emoji: '📖', ageBand: 'paud' },
  { id: 'w-43', word: 'PENSIL', category: 'Benda Sekitar', clue: 'Alat tulis untuk menulis dan menggambar', emoji: '✏️', ageBand: 'paud' },
  { id: 'w-44', word: 'BOLA', category: 'Benda Sekitar', clue: 'Benda bulat untuk bermain sepak bola', emoji: '⚽', ageBand: 'paud' },
  { id: 'w-45', word: 'MEJA', category: 'Benda Sekitar', clue: 'Perabot berkaki empat tempat menaruh barang', emoji: '🪵', ageBand: 'paud' },
  { id: 'w-46', word: 'KURSI', category: 'Benda Sekitar', clue: 'Tempat duduk yang nyaman', emoji: '🪑', ageBand: 'paud' },
  { id: 'w-47', word: 'SEPATU', category: 'Benda Sekitar', clue: 'Alas kaki untuk melindungi kaki kita', emoji: '👟', ageBand: 'paud' },
  { id: 'w-48', word: 'TOPI', category: 'Benda Sekitar', clue: 'Penutup kepala pelindung sinar terik matahari', emoji: '🧢', ageBand: 'paud' },
  { id: 'w-49', word: 'JAM', category: 'Benda Sekitar', clue: 'Penunjuk waktu detik, menit, dan jam', emoji: '⏰', ageBand: 'paud' },
  { id: 'w-50', word: 'LAMPU', category: 'Benda Sekitar', clue: 'Benda yang menerangi ruangan saat gelap', emoji: '💡', ageBand: 'paud' },
];
