export interface VoiceChallengeItem {
  id: string;
  category: 'satwa' | 'angka_warna' | 'budi_pekerti';
  targetWord: string;
  acceptedVariations: string[]; // Variations for kid pronunciation
  prompt: string;
  emoji: string;
  difficulty: 'mudah' | 'sedang' | 'menantang';
  coinsReward: number;
  funFact: string;
}

export const VOICE_CHALLENGES: VoiceChallengeItem[] = [
  // Level 1: Satwa Nusantara
  {
    id: 'voice-singa',
    category: 'satwa',
    targetWord: 'SINGA',
    acceptedVariations: ['singa', 'si nga', 'si-nga', 'cinga', 'shinga'],
    prompt: 'Katakan "SINGA" seperti auman raja hutan yang berani!',
    emoji: '🦁',
    difficulty: 'mudah',
    coinsReward: 15,
    funFact: 'Singa hidup berkelompok dan aumannya bisa terdengar sangat jauh lho!',
  },
  {
    id: 'voice-kelinci',
    category: 'satwa',
    targetWord: 'KELINCI',
    acceptedVariations: ['kelinci', 'ke linci', 'klinsi', 'klinci'],
    prompt: 'Katakan "KELINCI" sambil tersenyum manis!',
    emoji: '🐰',
    difficulty: 'mudah',
    coinsReward: 15,
    funFact: 'Kelinci suka melompat tinggi dan memiliki telinga yang sangat peka!',
  },
  {
    id: 'voice-kucing',
    category: 'satwa',
    targetWord: 'KUCING',
    acceptedVariations: ['kucing', 'ku cing', 'kucink'],
    prompt: 'Katakan "KUCING" dengan nada lembut seperti mengeong!',
    emoji: '🐱',
    difficulty: 'mudah',
    coinsReward: 15,
    funFact: 'Kucing bisa mendengkur saat merasa aman dan bahagia di dekatmu!',
  },
  {
    id: 'voice-gajah',
    category: 'satwa',
    targetWord: 'GAJAH',
    acceptedVariations: ['gajah', 'ga jah', 'gajak'],
    prompt: 'Katakan "GAJAH" dengan suara yang mantap dan tegas!',
    emoji: '🐘',
    difficulty: 'mudah',
    coinsReward: 15,
    funFact: 'Gajah adalah hewan darat terbesar dan memiliki belalai yang serbaguna!',
  },

  // Level 2: Angka & Warna
  {
    id: 'voice-delapan',
    category: 'angka_warna',
    targetWord: 'DELAPAN',
    acceptedVariations: ['delapan', 'de lapan', 'lapan'],
    prompt: 'Sebutkan angka "DELAPAN" dengan jelas!',
    emoji: '8️⃣',
    difficulty: 'sedang',
    coinsReward: 20,
    funFact: 'Bentuk angka 8 melambangkan garis yang menyambung tanpa putus!',
  },
  {
    id: 'voice-kuning',
    category: 'angka_warna',
    targetWord: 'KUNING',
    acceptedVariations: ['kuning', 'ku ning', 'kunink'],
    prompt: 'Ucapkan warna "KUNING" seperti warna matahari bersinar!',
    emoji: '☀️',
    difficulty: 'sedang',
    coinsReward: 20,
    funFact: 'Warna kuning memberikan rasa hangat, ceria, dan penuh energi!',
  },
  {
    id: 'voice-pelangi',
    category: 'angka_warna',
    targetWord: 'PELANGI',
    acceptedVariations: ['pelangi', 'pe langi', 'plangi'],
    prompt: 'Katakan "PELANGI" yang indah di langit biru!',
    emoji: '🌈',
    difficulty: 'sedang',
    coinsReward: 20,
    funFact: 'Pelangi terbentuk dari pantulan tetesan air hujan yang disinari matahari!',
  },

  // Level 3: Budi Pekerti & Karakter Mulia
  {
    id: 'voice-terima-kasih',
    category: 'budi_pekerti',
    targetWord: 'TERIMA KASIH',
    acceptedVariations: ['terima kasih', 'terimakasih', 'trima kasih', 'trimakasih', 'terima kasi'],
    prompt: 'Ucapkan kata ajaib: "TERIMA KASIH" dengan tulus!',
    emoji: '🙏',
    difficulty: 'menantang',
    coinsReward: 25,
    funFact: 'Mengucapkan terima kasih membuat hati orang lain dan dirimu merasa bahagia!',
  },
  {
    id: 'voice-tolong',
    category: 'budi_pekerti',
    targetWord: 'TOLONG',
    acceptedVariations: ['tolong', 'to long', 'tolonk'],
    prompt: 'Katakan kata santun: "TOLONG" saat meminta bantuan!',
    emoji: '🤝',
    difficulty: 'sedang',
    coinsReward: 20,
    funFact: 'Kata tolong menunjukkan kerendahan hati dan rasa hormat kepada sesama!',
  },
  {
    id: 'voice-semangat',
    category: 'budi_pekerti',
    targetWord: 'SEMANGAT',
    acceptedVariations: ['semangat', 'se mangat', 'smangat'],
    prompt: 'Serukan kata "SEMANGAT" dengan penuh rasa gembira!',
    emoji: '🔥',
    difficulty: 'mudah',
    coinsReward: 20,
    funFact: 'Semangat pantang menyerah adalah kunci setiap anak hebat meraih impian!',
  },
];
