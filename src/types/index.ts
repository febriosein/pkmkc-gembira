export type AgeBand = 'paud' | 'sd-fase-a' | 'sd-fase-b' | 'sd-fase-c';

export type Domain = 
  | 'numerasi' 
  | 'literasi' 
  | 'warna-bentuk' 
  | 'sosial-emosional' 
  | 'pengetahuan-alam' 
  | 'memori';

export type GameId = 
  | 'letus-balon' 
  | 'tebak-kata' 
  | 'tangkap-buah'
  | 'orkestra-musik'
  | 'cocok-bayangan'
  | 'labirin-satwa'
  | 'm1-warna' 
  | 'm2-geometri' 
  | 'm3-hitung-hewan' 
  | 'm4-dongeng-moral' 
  | 'm5-suara-satwa' 
  | 'm6-hitung-buah' 
  | 'm7-memori-kartu' 
  | 'm8-emosi';

export type NavigationTab = 'peta' | 'game' | 'materi' | 'leaderboard' | 'ortu';

export interface EquippedAccessories {
  hat?: string;
  glasses?: string;
  badge?: string;
  aura?: string;
}

export interface AccessoryItem {
  id: string;
  category: 'hat' | 'glasses' | 'badge' | 'aura';
  name: string;
  icon: string;
  price: number;
  description: string;
  rarity: 'biasa' | 'langka' | 'legendaris';
}

export interface ChildProfile {
  id: string;
  parentId: string;
  nickname: string;
  avatar: string;
  ageBand: AgeBand;
  birthYear?: number;
  coinsBalance: number;
  dailyLimitMin: number;
  createdAt: string;
  starsTotal: number;
  lastPlayedAt?: string;
  equipped?: EquippedAccessories;
  ownedItemIds?: string[];
  buddyHappiness?: number; // 0 - 100 Tamagotchi-style Happiness meter
}

export interface ParentAccount {
  id: string;
  email: string;
  pin: string;
  parentConsent: boolean;
  consentAt: string;
  activeChildId: string;
  createdAt: string;
}

export type DifficultyLevel = 'mudah' | 'sedang' | 'sulit';

export interface QuestionMedia {
  type: 'emoji' | 'shape' | 'audio' | 'image' | 'color';
  value: string;
  color?: string;
}

export interface Question {
  id: string;
  gameId: GameId;
  domain: Domain;
  cpCode?: string; // Capaian Pembelajaran Kurikulum Merdeka
  ageBand: AgeBand;
  difficulty: 1 | 2 | 3;
  difficultyLevel?: DifficultyLevel;
  prompt: string;
  speechText?: string;
  options: (string | number)[];
  correctAnswer: string | number;
  hint?: string;
  explanation?: string;
  media?: QuestionMedia;
  meta?: Record<string, any>;
}

export interface Attempt {
  id: string;
  sessionId: string;
  childId: string;
  questionId: string;
  domain: Domain;
  userAnswer: string | number;
  isCorrect: boolean;
  responseMs: number;
  clientEventId: string;
  createdAt: string;
}

export interface Session {
  id: string;
  childId: string;
  gameId: GameId;
  domain: Domain;
  startedAt: string;
  endedAt?: string;
  status: 'in_progress' | 'completed' | 'abandoned';
  score: number;
  stars: number; // 1 - 3
  coinsEarned: number;
  totalQuestions: number;
  correctCount: number;
}

export interface CoinLedgerEntry {
  id: string;
  childId: string;
  sessionId?: string;
  delta: number;
  reason: string;
  createdAt: string;
}

export type SkillStatus = 'unggul' | 'berkembang' | 'perlu-perhatian' | 'data-kurang';

export interface SkillSnapshot {
  domain: Domain;
  title: string;
  icon: string;
  accuracy: number; // 0 - 100
  attemptsCount: number;
  avgResponseMs: number;
  trend: 'up' | 'down' | 'stable';
  status: SkillStatus;
  statusText: string;
  recommendations: string[];
}

export interface LeaderboardEntry {
  id: string;
  nickname: string;
  avatar: string;
  weeklyCoins: number;
  totalSessions: number;
  isCurrentChild?: boolean;
}

export type PhygitalCategory = 'eksplorasi' | 'kebaikan' | 'kesehatan' | 'numerasi_nyata' | 'kreativitas';

export interface PhygitalQuest {
  id: string;
  title: string;
  category: PhygitalCategory;
  emoji: string;
  difficulty: 'mudah' | 'sedang' | 'menantang';
  description: string;
  actionPrompt: string;
  parentGuidance: string;
  rewardCoins: number;
  happinessBonus: number;
  badgeReward: {
    name: string;
    icon: string;
  };
}

export interface CompletedPhygitalQuest {
  id: string;
  childId: string;
  questId: string;
  questTitle: string;
  category: PhygitalCategory;
  badgeName: string;
  badgeIcon: string;
  rewardCoins: number;
  completedAt: string;
  verifiedByParent: boolean;
  parentNote?: string;
}
