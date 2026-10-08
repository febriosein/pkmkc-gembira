import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { X, Sparkles, Volume2, ShieldCheck, CheckCircle, Award, Compass, Lock } from 'lucide-react';
import { ChildProfile, PhygitalQuest, PhygitalCategory } from '../../types';
import { PHYGITAL_QUEST_CATALOG } from '../../data/phygitalQuests';
import { AvatarDisplay } from '../avatar/AvatarDisplay';
import { storage } from '../../services/storage';
import { audio } from '../../services/audio';

interface PhygitalQuestModalProps {
  isOpen: boolean;
  child: ChildProfile;
  onClose: () => void;
  onChildUpdated: (updated: ChildProfile) => void;
}

type TabMode = 'quests' | 'album';

const CATEGORY_CHIPS: { id: 'all' | PhygitalCategory; label: string; emoji: string }[] = [
  { id: 'all', label: 'Semua Misi', emoji: '🌟' },
  { id: 'eksplorasi', label: 'Eksplorasi Lingkungan', emoji: '🔍' },
  { id: 'kebaikan', label: 'Kebaikan & Kasih', emoji: '❤️' },
  { id: 'kesehatan', label: 'Hidup Bersih & Mandiri', emoji: '💧' },
  { id: 'numerasi_nyata', label: 'Hitung Konkret', emoji: '🔢' },
  { id: 'kreativitas', label: 'Kreativitas & Gerak', emoji: '🎨' },
];

export const PhygitalQuestModal: React.FC<PhygitalQuestModalProps> = ({
  isOpen,
  child,
  onClose,
  onChildUpdated,
}) => {
  const [activeTab, setActiveTab] = useState<TabMode>('quests');
  const [selectedCategory, setSelectedCategory] = useState<'all' | PhygitalCategory>('all');
  const [verifyingQuest, setVerifyingQuest] = useState<PhygitalQuest | null>(null);
  const [parentMathAnswer, setParentMathAnswer] = useState<string>('');
  const [parentNote, setParentNote] = useState<string>('');
  const [stampSuccess, setStampSuccess] = useState<string | null>(null);
  const [verifyError, setVerifyError] = useState<string | null>(null);

  // Math challenge for parent verification (prevent accidental child tap)
  const [mathProblem] = useState(() => {
    const a = Math.floor(Math.random() * 4) + 3;
    const b = Math.floor(Math.random() * 5) + 2;
    return { a, b, answer: a + b };
  });

  if (!isOpen) return null;

  const completedQuests = storage.getCompletedQuests(child.id);
  const completedQuestIds = new Set(completedQuests.map(q => q.questId));

  const filteredQuests = PHYGITAL_QUEST_CATALOG.filter(q => {
    if (selectedCategory === 'all') return true;
    return q.category === selectedCategory;
  });

  const handleSpeakInstruction = (text: string) => {
    audio.speak(text);
  };

  const handleStartVerify = (quest: PhygitalQuest) => {
    audio.playClick();
    setVerifyError(null);
    setParentMathAnswer('');
    setParentNote('');
    setVerifyingQuest(quest);
  };

  const handleConfirmVerification = () => {
    if (!verifyingQuest) return;

    const parentAccount = storage.getParentAccount();
    const isMathCorrect = parseInt(parentMathAnswer.trim(), 10) === mathProblem.answer;
    const isPinCorrect = parentMathAnswer.trim() === parentAccount.pin;

    if (!isMathCorrect && !isPinCorrect) {
      audio.playGentleBoing();
      setVerifyError(`Jawaban verifikasi orang tua belum tepat (${mathProblem.a} + ${mathProblem.b} = ${mathProblem.answer} atau PIN orang tua).`);
      return;
    }

    // Process completion
    audio.playFanfare();
    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.6 },
    });

    const result = storage.completePhygitalQuest(child.id, verifyingQuest, parentNote.trim() || undefined);
    onChildUpdated(result.updatedChild);

    const speech = `Hore! Misi ${verifyingQuest.title} berhasil diselesaikan di dunia nyata! Sahabatmu makin bangga dan sayang padamu!`;
    audio.speak(speech);

    setStampSuccess(verifyingQuest.title);
    setVerifyingQuest(null);

    setTimeout(() => {
      setStampSuccess(null);
    }, 2800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-gemdark/60 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl border-4 border-amber-300 overflow-hidden relative">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 p-4 sm:p-6 text-white relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-3xl shadow-md border border-white/30 animate-float">
                🏡
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="bg-white/20 text-yellow-200 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider inline-flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-yellow-300" /> PKM-KC Phygital Quests
                  </span>
                  <span className="text-xs text-white/80 font-bold hidden sm:inline">
                    {completedQuestIds.size} dari {PHYGITAL_QUEST_CATALOG.length} Selesai
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black tracking-tight drop-shadow-sm">
                  Jurnal Detektif Cilik: Misi Dunia Nyata
                </h2>
                <p className="text-xs text-amber-100 font-medium hidden sm:block">
                  Misi fisik konkret di rumah & lingkungan nyata bersama Ayah dan Bunda!
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              {/* Child avatar & happiness mini card */}
              <div className="hidden sm:flex items-center gap-2 bg-black/20 backdrop-blur-md px-3 py-1.5 rounded-2xl border border-white/20">
                <AvatarDisplay avatar={child.avatar} equipped={child.equipped} size="sm" />
                <div className="text-left text-xs font-bold leading-tight">
                  <span className="text-yellow-300 block font-black">🪙 {child.coinsBalance}</span>
                  <span className="text-pink-200 text-[10px]">❤️ {child.buddyHappiness ?? 80}%</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  audio.playClick();
                  onClose();
                }}
                className="w-10 h-10 rounded-2xl bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-all"
                title="Tutup"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Navigation Sub-Tabs: Quests vs Album */}
          <div className="flex gap-2 mt-4 pt-3 border-t border-white/20">
            <button
              type="button"
              onClick={() => {
                audio.playClick();
                setActiveTab('quests');
              }}
              className={`px-4 py-2 rounded-2xl font-black text-xs transition-all flex items-center gap-2 ${
                activeTab === 'quests'
                  ? 'bg-white text-amber-900 shadow-md scale-102'
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              <Compass className="w-4 h-4 text-amber-600" />
              <span>Papan Misi Detektif</span>
            </button>

            <button
              type="button"
              onClick={() => {
                audio.playClick();
                setActiveTab('album');
              }}
              className={`px-4 py-2 rounded-2xl font-black text-xs transition-all flex items-center gap-2 ${
                activeTab === 'album'
                  ? 'bg-white text-amber-900 shadow-md scale-102'
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              <Award className="w-4 h-4 text-amber-600" />
              <span>Album Stempel Juara ({completedQuestIds.size})</span>
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 bg-amber-50/40">
          {/* TAB 1: QUEST BOARD */}
          {activeTab === 'quests' && (
            <div className="space-y-4">
              {/* Category Chips Filter */}
              <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                {CATEGORY_CHIPS.map(chip => {
                  const isSelected = selectedCategory === chip.id;
                  return (
                    <button
                      key={chip.id}
                      type="button"
                      onClick={() => {
                        audio.playClick();
                        setSelectedCategory(chip.id);
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-black whitespace-nowrap transition-all flex items-center gap-1.5 ${
                        isSelected
                          ? 'bg-amber-500 text-white shadow-sm ring-2 ring-amber-300'
                          : 'bg-white text-gray-600 hover:bg-amber-100 border border-amber-200'
                      }`}
                    >
                      <span>{chip.emoji}</span>
                      <span>{chip.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Quests Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredQuests.map(quest => {
                  const isCompleted = completedQuestIds.has(quest.id);
                  const completedRecord = completedQuests.find(q => q.questId === quest.id);

                  return (
                    <div
                      key={quest.id}
                      className={`rounded-3xl p-5 border-3 transition-all flex flex-col justify-between gem-card-hover relative ${
                        isCompleted
                          ? 'bg-emerald-50/80 border-emerald-300 shadow-sm'
                          : 'bg-white border-amber-200 shadow-md'
                      }`}
                    >
                      {/* Quest Header */}
                      <div>
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <div className="flex items-center gap-3">
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-3xl shadow-sm ${
                              isCompleted ? 'bg-emerald-100 border border-emerald-300' : 'bg-amber-100 border border-amber-300'
                            }`}>
                              {quest.emoji}
                            </div>
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className="text-[10px] font-black uppercase text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                                  {quest.category.replace('_', ' ')}
                                </span>
                                <span className="text-[10px] font-bold text-gray-500">
                                  {quest.difficulty}
                                </span>
                              </div>
                              <h3 className="font-black text-base text-gemdark mt-0.5">
                                {quest.title}
                              </h3>
                            </div>
                          </div>

                          <div className="text-right flex-shrink-0">
                            <span className="block text-xs font-black text-amber-700 bg-amber-100/80 px-2.5 py-1 rounded-xl">
                              🪙 +{quest.rewardCoins}
                            </span>
                            <span className="text-[10px] font-bold text-pink-600 block mt-0.5">
                              ❤️ +{quest.happinessBonus}%
                            </span>
                          </div>
                        </div>

                        {/* Action Prompt with Speaker */}
                        <div className="bg-amber-50/80 rounded-2xl p-3 border border-amber-200/80 my-2.5 relative">
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <span className="text-[10px] font-black uppercase tracking-wider text-amber-800">
                              Misi Detektif:
                            </span>
                            <button
                              type="button"
                              onClick={() => handleSpeakInstruction(quest.actionPrompt)}
                              className="p-1 rounded-full bg-white hover:bg-amber-200 text-amber-800 transition-colors shadow-xs"
                              title="Dengarkan Misi"
                            >
                              <Volume2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <p className="text-xs font-bold text-gemdark leading-relaxed">
                            "{quest.actionPrompt}"
                          </p>
                        </div>

                        {/* Parent Guidance */}
                        <div className="text-[11px] text-gray-500 font-medium px-1 flex items-start gap-1.5">
                          <span className="text-amber-500 font-bold">💡 Peran Orang Tua:</span>
                          <span>{quest.parentGuidance}</span>
                        </div>
                      </div>

                      {/* Bottom Verification Status */}
                      <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                        {isCompleted ? (
                          <div className="flex items-center gap-2 text-emerald-700 font-black text-xs">
                            <CheckCircle className="w-4 h-4 text-emerald-600" />
                            <span>Telah Diverifikasi Orang Tua</span>
                            {completedRecord && (
                              <span className="text-[10px] text-emerald-600/80 font-normal">
                                ({new Date(completedRecord.completedAt).toLocaleDateString('id-ID')})
                              </span>
                            )}
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleStartVerify(quest)}
                            className="w-full py-2.5 px-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 active:scale-98 text-white font-black text-xs rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 gem-btn-press"
                          >
                            <ShieldCheck className="w-4 h-4" /> Minta Cap Stempel Ayah/Bunda
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: DETECTIVE STAMP ALBUM */}
          {activeTab === 'album' && (
            <div className="space-y-6">
              <div className="bg-white rounded-3xl p-5 border-2 border-amber-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-center sm:text-left">
                  <div className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-900 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider mb-1">
                    <Award className="w-3.5 h-3.5 text-amber-600" /> Buku Stempel Petualang Cilik
                  </div>
                  <h3 className="text-xl font-black text-gemdark">
                    Koleksi Lencana Misi Nyata {child.nickname}
                  </h3>
                  <p className="text-xs text-gray-500 font-medium">
                    Setiap aksi kebaikan dan petualangan di dunia nyata diabadikan dengan stempel penghargaan emas!
                  </p>
                </div>

                <div className="text-center bg-gradient-to-tr from-amber-100 to-yellow-100 px-5 py-3 rounded-2xl border border-amber-300 flex-shrink-0">
                  <span className="text-2xl font-black text-amber-800">
                    {completedQuestIds.size} / {PHYGITAL_QUEST_CATALOG.length}
                  </span>
                  <span className="block text-[10px] font-bold text-amber-700 uppercase tracking-wider">
                    Stempel Terkumpul
                  </span>
                </div>
              </div>

              {/* Stamps Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {PHYGITAL_QUEST_CATALOG.map(quest => {
                  const isOwned = completedQuestIds.has(quest.id);
                  const record = completedQuests.find(q => q.questId === quest.id);

                  return (
                    <div
                      key={quest.id}
                      className={`rounded-3xl p-4 text-center border-3 transition-all flex flex-col items-center justify-between relative overflow-hidden ${
                        isOwned
                          ? 'bg-gradient-to-b from-amber-50 to-yellow-100 border-amber-400 shadow-md ring-2 ring-amber-300'
                          : 'bg-gray-50/80 border-dashed border-gray-300 opacity-60'
                      }`}
                    >
                      {/* Stamp Seal Graphic */}
                      <div className="relative my-2">
                        <div className={`w-20 h-20 rounded-full flex items-center justify-center text-4xl shadow-inner border-2 ${
                          isOwned
                            ? 'bg-white border-amber-400 animate-float'
                            : 'bg-gray-100 border-gray-300'
                        }`}>
                          {isOwned ? quest.badgeReward.icon : <Lock className="w-6 h-6 text-gray-400" />}
                        </div>
                        {isOwned && (
                          <div className="absolute -bottom-1 -right-1 bg-amber-500 text-white rounded-full p-1 shadow-sm">
                            <Sparkles className="w-3 h-3 text-white" />
                          </div>
                        )}
                      </div>

                      <div className="mt-1">
                        <h4 className="font-black text-xs text-gemdark truncate max-w-full">
                          {quest.badgeReward.name}
                        </h4>
                        <span className="text-[10px] text-gray-500 font-semibold block truncate">
                          {quest.title}
                        </span>
                      </div>

                      <div className="mt-3 pt-2 border-t border-black/5 w-full">
                        {isOwned ? (
                          <span className="text-[10px] font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full block truncate">
                            Cap: {record ? new Date(record.completedAt).toLocaleDateString('id-ID') : 'Aktif'}
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold text-gray-400 block">
                            Belum Dijalankan
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Success Stamping Banner */}
        {stampSuccess && (
          <div className="absolute inset-0 bg-gemdark/80 backdrop-blur-md flex flex-col items-center justify-center z-50 p-6 text-white text-center animate-in zoom-in duration-300">
            <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-300 flex items-center justify-center text-6xl shadow-2xl border-4 border-white mb-4 animate-bounce">
              🎖️
            </div>
            <span className="bg-amber-400 text-gemdark font-black text-xs px-3 py-1 rounded-full uppercase tracking-wider mb-1">
              Stempel Resmi Diberikan!
            </span>
            <h3 className="text-2xl sm:text-3xl font-black mb-2">
              Luar Biasa, {child.nickname}!
            </h3>
            <p className="text-sm text-amber-100 max-w-md font-medium">
              Misi "{stampSuccess}" telah diverifikasi oleh orang tua. Koin dan kebahagiaan sahabatmu telah bertambah!
            </p>
          </div>
        )}

        {/* Parent Verification Modal Modal-in-Modal */}
        {verifyingQuest && (
          <div className="absolute inset-0 bg-gemdark/70 backdrop-blur-md flex items-center justify-center z-40 p-4">
            <div className="bg-white rounded-3xl p-6 max-w-md w-full border-4 border-amber-400 shadow-2xl animate-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-amber-600" />
                  <h3 className="text-base font-black text-gemdark">
                    Cap Verifikasi Orang Tua
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setVerifyingQuest(null)}
                  className="w-7 h-7 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="bg-amber-50 rounded-2xl p-3 border border-amber-200 mb-4 text-xs font-semibold text-amber-900 leading-relaxed">
                Ayah atau Bunda, apakah <strong>{child.nickname}</strong> telah menyelesaikan misi nyata:
                <div className="font-black text-gemdark mt-1 text-sm">
                  "{verifyingQuest.title}"?
                </div>
              </div>

              {/* Math Security Question for Parents */}
              <div className="space-y-3 mb-4">
                <div>
                  <label className="block text-xs font-black text-gemdark mb-1">
                    Buktikan Anda Orang Tua: Berapa {mathProblem.a} + {mathProblem.b}?
                  </label>
                  <input
                    type="number"
                    value={parentMathAnswer}
                    onChange={e => setParentMathAnswer(e.target.value)}
                    placeholder="Ketik jawaban angka..."
                    className="w-full px-4 py-2.5 rounded-2xl border-2 border-gray-300 focus:border-amber-500 focus:outline-none font-black text-center text-lg tracking-wider"
                  />
                  <span className="text-[10px] text-gray-400 font-medium block mt-1">
                    Atau ketik PIN Orang Tua Anda (default: 1234)
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">
                    Catatan Apresiasi untuk Anak (Opsional):
                  </label>
                  <input
                    type="text"
                    value={parentNote}
                    onChange={e => setParentNote(e.target.value)}
                    placeholder="Contoh: Hebat sekali merapikan sendiri!"
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs font-medium"
                  />
                </div>

                {verifyError && (
                  <div className="text-xs text-red-600 font-bold bg-red-50 p-2.5 rounded-xl border border-red-200">
                    {verifyError}
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setVerifyingQuest(null)}
                  className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 font-bold text-xs text-gray-700 rounded-xl transition-colors"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleConfirmVerification}
                  className="flex-1 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 font-black text-xs text-white rounded-xl shadow-md transition-all gem-btn-press flex items-center justify-center gap-1.5"
                >
                  <Award className="w-4 h-4" /> Berikan Cap Stempel Emas!
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
