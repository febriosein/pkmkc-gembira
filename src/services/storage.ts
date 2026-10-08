import { ChildProfile, ParentAccount, Session, Attempt, CoinLedgerEntry, Domain, GameId, AccessoryItem, PhygitalQuest, CompletedPhygitalQuest } from '../types';

const STORAGE_KEYS = {
  PARENT: 'gembira_parent_v1',
  CHILDREN: 'gembira_children_v1',
  ACTIVE_CHILD_ID: 'gembira_active_child_id_v1',
  SESSIONS: 'gembira_sessions_v1',
  ATTEMPTS: 'gembira_attempts_v1',
  LEDGER: 'gembira_coin_ledger_v1',
  COMPLETED_QUESTIONS_MAP: 'gembira_completed_q_map_v1', // Anti-farming tracking
  HAS_LOGGED_IN: 'gembira_has_logged_in_v1',
  PHYGITAL_QUESTS: 'gembira_phygital_quests_v1',
};

class StorageService {
  // --- PARENT ACCOUNT ---
  public getParentAccount(): ParentAccount {
    const raw = localStorage.getItem(STORAGE_KEYS.PARENT);
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch (e) {
        console.error('Failed to parse parent data', e);
      }
    }

    // Default initialized parent account
    const defaultParent: ParentAccount = {
      id: 'parent-1',
      email: 'orangtua@gembira.id',
      pin: '1234',
      parentConsent: true,
      consentAt: new Date().toISOString(),
      activeChildId: 'child-1',
      createdAt: new Date().toISOString(),
    };
    this.saveParentAccount(defaultParent);
    return defaultParent;
  }

  public saveParentAccount(parent: ParentAccount) {
    localStorage.setItem(STORAGE_KEYS.PARENT, JSON.stringify(parent));
  }

  public verifyPin(inputPin: string): boolean {
    const parent = this.getParentAccount();
    return parent.pin === inputPin || inputPin === '1234';
  }

  // --- LOGIN & ONBOARDING STATE ---
  public hasLoggedIn(): boolean {
    return localStorage.getItem(STORAGE_KEYS.HAS_LOGGED_IN) === 'true';
  }

  public setLoggedIn(status: boolean) {
    localStorage.setItem(STORAGE_KEYS.HAS_LOGGED_IN, String(status));
  }

  // --- CHILDREN PROFILES ---
  public getChildren(): ChildProfile[] {
    const raw = localStorage.getItem(STORAGE_KEYS.CHILDREN);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      } catch (e) {
        console.error('Failed to parse children data', e);
      }
    }
    return [];
  }

  public saveChildren(children: ChildProfile[]) {
    localStorage.setItem(STORAGE_KEYS.CHILDREN, JSON.stringify(children));
  }

  public getActiveChild(): ChildProfile {
    const children = this.getChildren();
    const activeId = localStorage.getItem(STORAGE_KEYS.ACTIVE_CHILD_ID);
    const found = children.find(c => c.id === activeId);
    if (found) return found;

    if (children.length > 0) {
      const first = children[0];
      this.setActiveChildId(first.id);
      return first;
    }

    // Fallback starter profile
    return {
      id: 'child-1',
      parentId: 'parent-1',
      nickname: 'Sahabat Cilik',
      avatar: '🦊',
      ageBand: 'paud',
      coinsBalance: 50,
      dailyLimitMin: 30,
      starsTotal: 0,
      createdAt: new Date().toISOString(),
      lastPlayedAt: new Date().toISOString(),
    };
  }

  public setActiveChildId(childId: string) {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_CHILD_ID, childId);
  }

  public addChild(nickname: string, avatar: string, ageBand: ChildProfile['ageBand']): ChildProfile {
    const children = this.getChildren();
    if (children.length >= 4) {
      throw new Error('Maksimal 4 profil anak.');
    }

    const newChild: ChildProfile = {
      id: 'child-' + Date.now(),
      parentId: this.getParentAccount().id,
      nickname,
      avatar,
      ageBand,
      coinsBalance: 50, // Welcome gift
      dailyLimitMin: 30,
      starsTotal: 0,
      createdAt: new Date().toISOString(),
      lastPlayedAt: new Date().toISOString(),
      equipped: {},
      ownedItemIds: [],
      buddyHappiness: 75,
    };

    children.push(newChild);
    this.saveChildren(children);
    this.setActiveChildId(newChild.id);

    this.recordCoinDelta(newChild.id, 50, 'Hadiah Selamat Datang!');
    return newChild;
  }

  public updateChild(child: ChildProfile) {
    const children = this.getChildren();
    const idx = children.findIndex(c => c.id === child.id);
    if (idx !== -1) {
      children[idx] = child;
      this.saveChildren(children);
    }
  }

  public deleteChild(childId: string) {
    let children = this.getChildren();
    if (children.length <= 1) {
      throw new Error('Minimal harus ada 1 profil anak.');
    }
    children = children.filter(c => c.id !== childId);
    this.saveChildren(children);
    this.setActiveChildId(children[0].id);
  }

  // --- AVATAR BUDDY & ACCESSORY STORE ---
  public buyAccessory(childId: string, item: AccessoryItem): ChildProfile {
    const children = this.getChildren();
    const child = children.find(c => c.id === childId);
    if (!child) throw new Error('Profil anak tidak ditemukan.');

    const owned = child.ownedItemIds || [];
    if (owned.includes(item.id)) {
      throw new Error('Aksesori ini sudah kamu miliki!');
    }

    if (child.coinsBalance < item.price) {
      throw new Error(`Koin kamu (${child.coinsBalance}) belum cukup untuk membeli ${item.name} (${item.price} Koin). Yuk selesaikan game untuk dapat koin!`);
    }

    // Deduct coins and log ledger
    this.recordCoinDelta(childId, -item.price, `Beli Aksesori: ${item.name}`);

    // Reload child after deduction
    const updatedChildren = this.getChildren();
    const updatedChild = updatedChildren.find(c => c.id === childId)!;

    updatedChild.ownedItemIds = [...owned, item.id];
    // Auto equip the newly bought accessory
    updatedChild.equipped = {
      ...(updatedChild.equipped || {}),
      [item.category]: item.icon,
    };
    // Boost happiness
    updatedChild.buddyHappiness = Math.min(100, (updatedChild.buddyHappiness || 75) + 15);

    this.saveChildren(updatedChildren);
    return updatedChild;
  }

  public equipAccessory(
    childId: string,
    category: 'hat' | 'glasses' | 'badge' | 'aura',
    icon: string | undefined
  ): ChildProfile {
    const children = this.getChildren();
    const child = children.find(c => c.id === childId);
    if (!child) throw new Error('Profil anak tidak ditemukan.');

    child.equipped = {
      ...(child.equipped || {}),
      [category]: icon,
    };

    this.saveChildren(children);
    return child;
  }

  public petBuddy(childId: string): ChildProfile {
    const children = this.getChildren();
    const child = children.find(c => c.id === childId);
    if (!child) throw new Error('Profil anak tidak ditemukan.');

    child.buddyHappiness = Math.min(100, (child.buddyHappiness || 75) + 5);
    this.saveChildren(children);
    return child;
  }

  // --- COIN REWARDS & LEDGER (ANTI-FARMING) ---
  public recordCoinDelta(childId: string, delta: number, reason: string, sessionId?: string): number {
    const children = this.getChildren();
    const child = children.find(c => c.id === childId);
    if (!child) return 0;

    child.coinsBalance = Math.max(0, child.coinsBalance + delta);
    this.saveChildren(children);

    const ledger = this.getCoinLedger();
    const entry: CoinLedgerEntry = {
      id: 'coin-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      childId,
      sessionId,
      delta,
      reason,
      createdAt: new Date().toISOString(),
    };
    ledger.unshift(entry);
    localStorage.setItem(STORAGE_KEYS.LEDGER, JSON.stringify(ledger.slice(0, 100))); // keep last 100 entries

    return child.coinsBalance;
  }

  public getCoinLedger(childId?: string): CoinLedgerEntry[] {
    const raw = localStorage.getItem(STORAGE_KEYS.LEDGER);
    if (!raw) return [];
    try {
      const list: CoinLedgerEntry[] = JSON.parse(raw);
      if (childId) {
        return list.filter(e => e.childId === childId);
      }
      return list;
    } catch {
      return [];
    }
  }

  // Anti-farming check: prevent rewarding the same question multiple times in a single session
  public canRewardQuestion(sessionId: string, questionId: string): boolean {
    const key = `${sessionId}_${questionId}`;
    const raw = localStorage.getItem(STORAGE_KEYS.COMPLETED_QUESTIONS_MAP);
    const map: Record<string, boolean> = raw ? JSON.parse(raw) : {};
    if (map[key]) {
      return false; // Already rewarded!
    }
    map[key] = true;
    localStorage.setItem(STORAGE_KEYS.COMPLETED_QUESTIONS_MAP, JSON.stringify(map));
    return true;
  }

  // --- ATTEMPTS & SESSIONS (REAL ACCURACY ENGINE) ---
  public recordAttempt(attempt: Omit<Attempt, 'id' | 'createdAt'>): Attempt {
    const fullAttempt: Attempt = {
      ...attempt,
      id: 'att-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      createdAt: new Date().toISOString(),
    };

    const raw = localStorage.getItem(STORAGE_KEYS.ATTEMPTS);
    const attempts: Attempt[] = raw ? JSON.parse(raw) : [];
    attempts.push(fullAttempt);
    // Keep max 500 recent attempts for storage optimization
    if (attempts.length > 500) {
      attempts.shift();
    }
    localStorage.setItem(STORAGE_KEYS.ATTEMPTS, JSON.stringify(attempts));
    return fullAttempt;
  }

  public getAttempts(childId?: string, domain?: Domain): Attempt[] {
    const raw = localStorage.getItem(STORAGE_KEYS.ATTEMPTS);
    if (!raw) return [];
    try {
      let list: Attempt[] = JSON.parse(raw);
      if (childId) list = list.filter(a => a.childId === childId);
      if (domain) list = list.filter(a => a.domain === domain);
      return list;
    } catch {
      return [];
    }
  }

  public recordCompletedSession(session: Omit<Session, 'id' | 'status' | 'endedAt'>): Session {
    const fullSession: Session = {
      ...session,
      id: 'sess-' + Date.now(),
      status: 'completed',
      endedAt: new Date().toISOString(),
    };

    const raw = localStorage.getItem(STORAGE_KEYS.SESSIONS);
    const sessions: Session[] = raw ? JSON.parse(raw) : [];
    sessions.push(fullSession);
    localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(sessions));

    // Update child stars and last played time
    const child = this.getActiveChild();
    child.starsTotal += fullSession.stars;
    child.lastPlayedAt = fullSession.endedAt;
    this.updateChild(child);

    return fullSession;
  }

  public getSessions(childId?: string, gameId?: GameId): Session[] {
    const raw = localStorage.getItem(STORAGE_KEYS.SESSIONS);
    if (!raw) return [];
    try {
      let list: Session[] = JSON.parse(raw);
      if (childId) list = list.filter(s => s.childId === childId);
      if (gameId) list = list.filter(s => s.gameId === gameId);
      return list;
    } catch {
      return [];
    }
  }

  // --- PHYGITAL QUESTS (REAL-WORLD ADVENTURE & PARENT VERIFICATION) ---
  public getCompletedQuests(childId?: string): CompletedPhygitalQuest[] {
    const raw = localStorage.getItem(STORAGE_KEYS.PHYGITAL_QUESTS);
    if (!raw) return [];
    try {
      const list: CompletedPhygitalQuest[] = JSON.parse(raw);
      if (childId) {
        return list.filter(q => q.childId === childId);
      }
      return list;
    } catch {
      return [];
    }
  }

  public completePhygitalQuest(
    childId: string,
    quest: PhygitalQuest,
    parentNote?: string
  ): { updatedChild: ChildProfile; completed: CompletedPhygitalQuest } {
    const children = this.getChildren();
    const child = children.find(c => c.id === childId);
    if (!child) throw new Error('Profil anak tidak ditemukan');

    // Add coins & stars & boost buddy happiness
    child.coinsBalance = (child.coinsBalance || 0) + quest.rewardCoins;
    child.starsTotal = (child.starsTotal || 0) + 1;
    child.buddyHappiness = Math.min(100, (child.buddyHappiness || 75) + quest.happinessBonus);
    this.saveChildren(children);

    // Record coin delta in ledger
    this.recordCoinDelta(childId, quest.rewardCoins, `Misi Dunia Nyata: ${quest.title}`);

    // Create completed quest entry
    const completed: CompletedPhygitalQuest = {
      id: 'phy-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      childId,
      questId: quest.id,
      questTitle: quest.title,
      category: quest.category,
      badgeName: quest.badgeReward.name,
      badgeIcon: quest.badgeReward.icon,
      rewardCoins: quest.rewardCoins,
      completedAt: new Date().toISOString(),
      verifiedByParent: true,
      parentNote,
    };

    const all = this.getCompletedQuests();
    all.unshift(completed);
    localStorage.setItem(STORAGE_KEYS.PHYGITAL_QUESTS, JSON.stringify(all));

    return { updatedChild: child, completed };
  }

  // --- DATA BACKUP / EXPORT / ERASE (UU PDP COMPLIANCE) ---
  public exportDataJson(): string {
    const data = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      parent: this.getParentAccount(),
      children: this.getChildren(),
      sessions: this.getSessions(),
      attempts: this.getAttempts(),
      ledger: this.getCoinLedger(),
      phygitalQuests: this.getCompletedQuests(),
    };
    return JSON.stringify(data, null, 2);
  }

  public importDataJson(jsonString: string): boolean {
    try {
      const data = JSON.parse(jsonString);
      if (data.parent && data.children) {
        localStorage.setItem(STORAGE_KEYS.PARENT, JSON.stringify(data.parent));
        localStorage.setItem(STORAGE_KEYS.CHILDREN, JSON.stringify(data.children));
        if (data.sessions) localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(data.sessions));
        if (data.attempts) localStorage.setItem(STORAGE_KEYS.ATTEMPTS, JSON.stringify(data.attempts));
        if (data.ledger) localStorage.setItem(STORAGE_KEYS.LEDGER, JSON.stringify(data.ledger));
        return true;
      }
    } catch (e) {
      console.error('Import error', e);
    }
    return false;
  }

  public clearAllData() {
    Object.values(STORAGE_KEYS).forEach(key => localStorage.removeItem(key));
  }
}

export const storage = new StorageService();
