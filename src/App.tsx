import { useState } from 'react';
import { Navbar } from './components/layout/Navbar';
import { BottomNav } from './components/layout/BottomNav';
import { ProfileModal } from './components/profile/ProfileModal';
import { ParentGateModal } from './components/parent/ParentGateModal';
import { DifficultySelectorModal } from './components/common/DifficultySelectorModal';
import { ChildLoginView } from './components/auth/ChildLoginView';
import { AdventureMap } from './components/map/AdventureMap';
import { GameArenaList } from './components/game/GameArenaList';
import { LetusBalonGame } from './games/LetusBalonGame';
import { TebakKataGame } from './games/TebakKataGame';
import { TangkapBuahGame } from './games/TangkapBuahGame';
import { OrkestraMusikGame } from './games/OrkestraMusikGame';
import { CocokBayanganGame } from './games/CocokBayanganGame';
import { LabirinSatwaGame } from './games/LabirinSatwaGame';
import { MateriList } from './components/materi/MateriList';
import { ModuleRunnerModal } from './games/modules/ModuleRunnerModal';
import { ParentDashboard } from './components/parent/ParentDashboard';
import { WeeklyLeaderboard } from './components/leaderboard/WeeklyLeaderboard';
import { AvatarDisplay } from './components/avatar/AvatarDisplay';
import { AvatarClosetModal } from './components/avatar/AvatarClosetModal';
import { PhygitalQuestModal } from './components/phygital/PhygitalQuestModal';
import { VoiceChallengeModal } from './components/voice/VoiceChallengeModal';
import { AchievementCardModal } from './components/parent/AchievementCardModal';
import { Sparkles } from 'lucide-react';
import { ChildProfile, NavigationTab, GameId, DifficultyLevel } from './types';
import { ModuleItem } from './data/modulesData';
import { storage } from './services/storage';
import { audio } from './services/audio';

const GAME_METADATA: Partial<Record<GameId, { title: string; emoji: string }>> = {
  'letus-balon': { title: 'Letus Balon Matematika Deluxe', emoji: '🎈' },
  'tangkap-buah': { title: 'Tangkap Buah Matematika', emoji: '🍎' },
  'tebak-kata': { title: 'Susun Kata Nusantara Deluxe', emoji: '🔤' },
  'orkestra-musik': { title: 'Orkestra Melodi Ajaib', emoji: '🎹' },
  'cocok-bayangan': { title: 'Cocok Bayangan Ajaib', emoji: '🧩' },
  'labirin-satwa': { title: 'Labirin Jejak Sahabat', emoji: '🐾' },
};

interface LaunchTarget {
  type: 'game' | 'module';
  gameId?: GameId;
  module?: ModuleItem;
  title: string;
  emoji: string;
}

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => storage.hasLoggedIn());
  const [activeChild, setActiveChild] = useState<ChildProfile>(() => storage.getActiveChild());
  const [currentTab, setCurrentTab] = useState<NavigationTab>('peta');
  const [activeGameId, setActiveGameId] = useState<GameId | null>(null);
  const [activeModule, setActiveModule] = useState<ModuleItem | null>(null);
  const [activeDifficulty, setActiveDifficulty] = useState<DifficultyLevel>('mudah');
  const [pendingLaunch, setPendingLaunch] = useState<LaunchTarget | null>(null);

  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isClosetOpen, setIsClosetOpen] = useState(false);
  const [isPhygitalModalOpen, setIsPhygitalModalOpen] = useState(false);
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [isAchievementModalOpen, setIsAchievementModalOpen] = useState(false);
  const [isParentGateOpen, setIsParentGateOpen] = useState(false);
  const [isParentUnlocked, setIsParentUnlocked] = useState(false);
  const [isMuted, setIsMuted] = useState(() => audio.getIsMuted());

  const handleLogout = () => {
    storage.setLoggedIn(false);
    setIsLoggedIn(false);
  };

  // Handle Tab Switch (Protect 'ortu' with Parent Gate)
  const handleSelectTab = (tab: NavigationTab) => {
    setActiveGameId(null);
    setActiveModule(null);
    if (tab === 'ortu') {
      if (!isParentUnlocked) {
        setIsParentGateOpen(true);
        return;
      }
    }
    setCurrentTab(tab);
  };

  const handleParentGateSuccess = () => {
    setIsParentUnlocked(true);
    setIsParentGateOpen(false);
    setCurrentTab('ortu');
  };

  const handleToggleMute = () => {
    const next = !isMuted;
    audio.setMuted(next);
    setIsMuted(next);
    if (!next) {
      audio.playClick();
    }
  };

  const handleChildChanged = (child: ChildProfile) => {
    setActiveChild(child);
  };

  const handleCoinsUpdated = (newCoins: number) => {
    setActiveChild(prev => ({ ...prev, coinsBalance: newCoins }));
  };

  const handleRequestLaunchGame = (gameId: GameId) => {
    const meta = GAME_METADATA[gameId] || { title: 'Game Petualangan', emoji: '🎮' };
    setPendingLaunch({
      type: 'game',
      gameId,
      title: meta.title,
      emoji: meta.emoji,
    });
  };

  const handleRequestLaunchModule = (mod: ModuleItem) => {
    setPendingLaunch({
      type: 'module',
      module: mod,
      title: `Modul ${mod.moduleNumber}: ${mod.title}`,
      emoji: mod.icon,
    });
  };

  const handleConfirmDifficulty = (chosenDifficulty: DifficultyLevel) => {
    if (!pendingLaunch) return;
    setActiveDifficulty(chosenDifficulty);
    if (pendingLaunch.type === 'game' && pendingLaunch.gameId) {
      setActiveGameId(pendingLaunch.gameId);
    } else if (pendingLaunch.type === 'module' && pendingLaunch.module) {
      setActiveModule(pendingLaunch.module);
    }
    setPendingLaunch(null);
  };

  const isPlayingActive = Boolean(activeGameId || activeModule);

  if (!isLoggedIn) {
    return (
      <ChildLoginView
        onLoginSuccess={(child) => {
          setActiveChild(child);
          setIsLoggedIn(true);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen fun-pattern flex flex-col justify-between pb-28 sm:pb-32 md:pb-8 text-gemdark">
      {/* Top Navbar */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={handleSelectTab}
        activeChild={activeChild}
        onOpenProfileModal={() => setIsProfileModalOpen(true)}
        onOpenClosetModal={() => setIsClosetOpen(true)}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
      />

      {/* Main Tab Content Viewport */}
      <main className="max-w-6xl mx-auto w-full px-3 sm:px-4 py-4 sm:py-5 flex-1 flex flex-col">
        {/* Child greeting banner (shown when not playing a game or module) */}
        {!isPlayingActive && (
          <div className="bg-gradient-to-r from-purple-600 via-pink-500 to-amber-500 text-white rounded-3xl p-4 sm:p-6 shadow-xl mb-5 sm:mb-6 relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative z-10 flex flex-col sm:flex-row items-center gap-3.5 sm:gap-4 text-center sm:text-left w-full sm:w-auto">
              <button
                type="button"
                onClick={() => {
                  audio.playClick();
                  setIsClosetOpen(true);
                }}
                className="w-16 h-16 sm:w-20 sm:h-20 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-2xl sm:rounded-3xl flex items-center justify-center shadow-lg animate-float border-2 border-white/40 group transition-all flex-shrink-0"
                title="Buka Lemari Kostum Sahabat"
              >
                <AvatarDisplay
                  avatar={activeChild.avatar}
                  equipped={activeChild.equipped}
                  size="lg"
                />
              </button>
              <div>
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <h2 className="text-xl sm:text-3xl font-black tracking-tight">
                    Halo, {activeChild.nickname}! 👋
                  </h2>
                </div>
                <p className="text-xs sm:text-sm text-purple-100 font-semibold mt-0.5 sm:mt-1 max-w-md">
                  Ayo lanjutkan petualangan bermain sambil belajar hari ini dan rawat sahabatmu!
                </p>
                <button
                  type="button"
                  onClick={() => {
                    audio.playClick();
                    setIsClosetOpen(true);
                  }}
                  className="mt-2 sm:mt-2.5 px-3 py-1 bg-white/25 hover:bg-white/35 active:scale-95 text-white rounded-xl text-xs font-black inline-flex items-center gap-1.5 border border-white/40 backdrop-blur-md transition-all shadow-sm"
                >
                  <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                  <span>Kamar Sahabat & Lemari (❤️{activeChild.buddyHappiness ?? 80}%)</span>
                </button>
              </div>
            </div>

            <div className="relative z-10 flex items-center justify-around sm:justify-start gap-3 bg-black/20 backdrop-blur-md px-4 py-2 sm:py-2.5 rounded-2xl border border-white/20 w-full sm:w-auto">
              <div className="text-center pr-3 border-r border-white/20 flex-1 sm:flex-initial">
                <span className="block text-[10px] text-purple-200 font-bold uppercase tracking-wider">Koin Saya</span>
                <span className="text-lg sm:text-xl font-black text-yellow-300">🪙 {activeChild.coinsBalance}</span>
              </div>
              <div className="text-center pl-1 flex-1 sm:flex-initial">
                <span className="block text-[10px] text-purple-200 font-bold uppercase tracking-wider">Bintang</span>
                <span className="text-lg sm:text-xl font-black text-amber-300">⭐ {activeChild.starsTotal}</span>
              </div>
            </div>

            {/* Decorative background circles */}
            <div className="absolute -right-8 -bottom-10 w-44 h-44 bg-white/10 rounded-full blur-xl pointer-events-none"></div>
            <div className="absolute left-1/3 -top-12 w-32 h-32 bg-yellow-400/20 rounded-full blur-lg pointer-events-none"></div>
          </div>
        )}

        {/* ACTIVE GAME CANVASES */}
        {activeGameId === 'letus-balon' && (
          <LetusBalonGame
            child={activeChild}
            difficulty={activeDifficulty}
            onExit={() => setActiveGameId(null)}
            onCoinsUpdated={handleCoinsUpdated}
          />
        )}

        {activeGameId === 'tebak-kata' && (
          <TebakKataGame
            child={activeChild}
            difficulty={activeDifficulty}
            onExit={() => setActiveGameId(null)}
            onCoinsUpdated={handleCoinsUpdated}
          />
        )}

        {activeGameId === 'tangkap-buah' && (
          <TangkapBuahGame
            child={activeChild}
            difficulty={activeDifficulty}
            onExit={() => setActiveGameId(null)}
            onCoinsUpdated={handleCoinsUpdated}
          />
        )}

        {activeGameId === 'orkestra-musik' && (
          <OrkestraMusikGame
            child={activeChild}
            difficulty={activeDifficulty}
            onExit={() => setActiveGameId(null)}
            onCoinsUpdated={handleCoinsUpdated}
          />
        )}

        {activeGameId === 'cocok-bayangan' && (
          <CocokBayanganGame
            child={activeChild}
            difficulty={activeDifficulty}
            onExit={() => setActiveGameId(null)}
            onCoinsUpdated={handleCoinsUpdated}
          />
        )}

        {activeGameId === 'labirin-satwa' && (
          <LabirinSatwaGame
            child={activeChild}
            difficulty={activeDifficulty}
            onExit={() => setActiveGameId(null)}
            onCoinsUpdated={handleCoinsUpdated}
          />
        )}

        {/* ACTIVE MODULE CANVAS */}
        {activeModule && (
          <ModuleRunnerModal
            child={activeChild}
            module={activeModule}
            difficulty={activeDifficulty}
            onExit={() => setActiveModule(null)}
            onCoinsUpdated={handleCoinsUpdated}
          />
        )}

        {/* TAB CONTENTS (When no game or module is active) */}
        {!isPlayingActive && (
          <>
            {currentTab === 'peta' && (
              <AdventureMap
                child={activeChild}
                onLaunchGame={handleRequestLaunchGame}
                onGoToMateri={() => setCurrentTab('materi')}
                onOpenPhygitalQuests={() => setIsPhygitalModalOpen(true)}
              />
            )}

            {currentTab === 'game' && (
              <GameArenaList
                onSelectGame={handleRequestLaunchGame}
                onOpenVoiceChallenge={() => setIsVoiceModalOpen(true)}
              />
            )}

            {currentTab === 'materi' && (
              <MateriList onSelectModule={handleRequestLaunchModule} />
            )}

            {currentTab === 'leaderboard' && (
              <WeeklyLeaderboard
                currentChild={activeChild}
                onOpenAchievementModal={() => setIsAchievementModalOpen(true)}
              />
            )}

            {currentTab === 'ortu' && (
              <ParentDashboard
                child={activeChild}
                onLockParentMode={() => {
                  setIsParentUnlocked(false);
                  setCurrentTab('peta');
                }}
                onChildUpdated={(c) => setActiveChild(c)}
                onOpenAchievementModal={() => setIsAchievementModalOpen(true)}
              />
            )}
          </>
        )}
      </main>

      {/* Mobile Bottom Bar (hidden while in game or module to prevent accidental touches) */}
      {!isPlayingActive && (
        <BottomNav currentTab={currentTab} onSelectTab={handleSelectTab} />
      )}

      {/* Modals */}
      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        activeChild={activeChild}
        onSelectChild={handleChildChanged}
        onLogout={handleLogout}
      />

      <AvatarClosetModal
        isOpen={isClosetOpen}
        onClose={() => setIsClosetOpen(false)}
        child={activeChild}
        onChildUpdated={handleChildChanged}
      />

      <PhygitalQuestModal
        isOpen={isPhygitalModalOpen}
        onClose={() => setIsPhygitalModalOpen(false)}
        child={activeChild}
        onChildUpdated={handleChildChanged}
      />

      <VoiceChallengeModal
        isOpen={isVoiceModalOpen}
        child={activeChild}
        onClose={() => setIsVoiceModalOpen(false)}
        onChildUpdated={handleChildChanged}
      />

      <AchievementCardModal
        isOpen={isAchievementModalOpen}
        child={activeChild}
        onClose={() => setIsAchievementModalOpen(false)}
      />

      <ParentGateModal
        isOpen={isParentGateOpen}
        onClose={() => setIsParentGateOpen(false)}
        onSuccess={handleParentGateSuccess}
      />

      <DifficultySelectorModal
        isOpen={Boolean(pendingLaunch)}
        title={pendingLaunch?.title || ''}
        itemEmoji={pendingLaunch?.emoji || '🚀'}
        childAgeBand={activeChild.ageBand}
        onClose={() => setPendingLaunch(null)}
        onSelectDifficulty={handleConfirmDifficulty}
      />
    </div>
  );
}
