import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { X, Sparkles, Heart, ShoppingBag, Check, RotateCcw } from 'lucide-react';
import { ChildProfile, AccessoryItem } from '../../types';
import { ACCESSORY_CATALOG } from '../../data/accessoryItems';
import { AvatarDisplay } from './AvatarDisplay';
import { storage } from '../../services/storage';
import { audio } from '../../services/audio';

interface AvatarClosetModalProps {
  isOpen: boolean;
  child: ChildProfile;
  onClose: () => void;
  onChildUpdated: (updated: ChildProfile) => void;
}

type CategoryTab = 'all' | 'hat' | 'glasses' | 'badge' | 'aura';

export const AvatarClosetModal: React.FC<AvatarClosetModalProps> = ({
  isOpen,
  child,
  onClose,
  onChildUpdated,
}) => {
  const [activeTab, setActiveTab] = useState<CategoryTab>('all');
  const [activeSpeech, setActiveSpeech] = useState<string>(
    `Halo ${child.nickname}! Yuk dandani aku dengan aksesori keren menggunakan koin belajarmu!`
  );
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const happiness = child.buddyHappiness ?? 75;
  const ownedIds = child.ownedItemIds || [];
  const equipped = child.equipped || {};

  const filteredItems = ACCESSORY_CATALOG.filter(item => {
    if (activeTab === 'all') return true;
    return item.category === activeTab;
  });

  const handlePetBuddy = () => {
    audio.playPop();
    const updated = storage.petBuddy(child.id);
    onChildUpdated(updated);

    const phrases = [
      `Hihi geli! Sayang banget sama kamu, ${child.nickname}! ❤️`,
      `Semangat belajarmu hari ini bikin aku makin bahagia! ✨`,
      `Terima kasih sudah merawatku! Ayo belajar lagi bersama! 🚀`,
      `Kamu adalah sahabat terbaikku, ${child.nickname}! 🌟`,
    ];
    const picked = phrases[Math.floor(Math.random() * phrases.length)];
    setActiveSpeech(picked);
    audio.speak(picked);

    confetti({
      particleCount: 25,
      spread: 40,
      origin: { y: 0.4 },
    });
  };

  const handleBuy = (item: AccessoryItem) => {
    setErrorMsg(null);
    try {
      const updated = storage.buyAccessory(child.id, item);
      audio.playSuccess();
      onChildUpdated(updated);

      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.5 },
      });

      const speech = `Wah, ${item.name} ini keren sekali! Aku suka banget, terima kasih ${child.nickname}!`;
      setActiveSpeech(speech);
      audio.speak(speech);
    } catch (err: any) {
      audio.playGentleBoing();
      setErrorMsg(err.message || 'Gagal membeli aksesori.');
    }
  };

  const handleEquipToggle = (item: AccessoryItem) => {
    setErrorMsg(null);
    audio.playClick();
    const isCurrentlyEquipped = equipped[item.category] === item.icon;
    const nextIcon = isCurrentlyEquipped ? undefined : item.icon;

    const updated = storage.equipAccessory(child.id, item.category, nextIcon);
    onChildUpdated(updated);

    if (nextIcon) {
      const speech = `Asyik, sekarang aku memakai ${item.name}!`;
      setActiveSpeech(speech);
      audio.speak(speech);
    }
  };

  const handleUnequipAll = () => {
    audio.playClick();
    let updated = storage.equipAccessory(child.id, 'hat', undefined);
    updated = storage.equipAccessory(child.id, 'glasses', undefined);
    updated = storage.equipAccessory(child.id, 'badge', undefined);
    updated = storage.equipAccessory(child.id, 'aura', undefined);
    onChildUpdated(updated);
    setActiveSpeech(`Semua aksesori sudah dilepas!`);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl border-4 border-yellow-300 relative overflow-hidden">
        {/* Header Bar */}
        <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 text-white p-4 sm:p-5 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-2xl shadow-inner">
              👑
            </div>
            <div>
              <h3 className="font-black text-base sm:text-lg leading-tight">
                Ruang Ganti & Toko Sahabat Cilik
              </h3>
              <p className="text-[11px] text-purple-100 font-semibold">
                Dandani sahabat avatarmu dengan koin prestasi belajarmu!
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="bg-black/25 backdrop-blur-md px-3 py-1.5 rounded-2xl border border-white/20 font-black text-xs text-yellow-300 flex items-center gap-1.5 shadow-xs">
              <span className="text-base leading-none">🪙</span>
              <span>{child.coinsBalance}</span>
            </div>
            <button
              onClick={() => {
                audio.playClick();
                onClose();
              }}
              className="w-8 h-8 rounded-xl bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors"
              title="Tutup"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Companion Stage Preview & Tamagotchi Care */}
        <div className="p-4 sm:p-5 bg-gradient-to-b from-purple-50 via-pink-50/50 to-amber-50/40 border-b-2 border-purple-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Avatar Stage */}
          <div className="flex flex-col items-center">
            <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl bg-white border-4 border-purple-200 shadow-xl flex items-center justify-center relative group p-2">
              <AvatarDisplay
                avatar={child.avatar}
                equipped={child.equipped}
                size="xl"
                onClick={handlePetBuddy}
              />
              <span className="absolute -bottom-2.5 bg-yellow-400 text-gemdark text-[9px] font-black px-2.5 py-0.5 rounded-full shadow-xs uppercase tracking-wider flex items-center gap-1">
                <Heart className="w-2.5 h-2.5 fill-red-500 text-red-500" /> Ketuk untuk Elus
              </span>
            </div>
          </div>

          {/* Avatar Speech Bubble & Tamagotchi Happiness Meter */}
          <div className="flex-1 w-full space-y-3">
            {/* Speech bubble */}
            <div className="bg-white rounded-2xl p-3 border-2 border-purple-200 shadow-sm relative">
              <div className="flex items-start gap-2">
                <span className="text-xl">💬</span>
                <p className="text-xs sm:text-sm font-bold text-gray-700 leading-snug">
                  "{activeSpeech}"
                </p>
              </div>
              <div className="absolute -left-2 top-4 w-3 h-3 bg-white border-b-2 border-l-2 border-purple-200 rotate-45 hidden sm:block"></div>
            </div>

            {/* Love / Happiness Meter */}
            <div className="bg-white/90 p-3 rounded-2xl border border-pink-200 shadow-xs flex items-center justify-between gap-3">
              <div className="flex-1">
                <div className="flex justify-between items-center text-[10px] font-black text-gray-600 mb-1">
                  <span className="flex items-center gap-1 text-pink-600">
                    <Heart className="w-3 h-3 fill-pink-500 text-pink-500 animate-pulse" /> Kebahagiaan Sahabat
                  </span>
                  <span>{happiness}%</span>
                </div>
                <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden border border-gray-200">
                  <div
                    className="bg-gradient-to-r from-pink-500 via-rose-400 to-amber-400 h-full rounded-full transition-all duration-500"
                    style={{ width: `${happiness}%` }}
                  ></div>
                </div>
              </div>

              <button
                type="button"
                onClick={handlePetBuddy}
                className="px-3 py-1.5 bg-pink-500 hover:bg-pink-600 active:scale-95 text-white font-black text-xs rounded-xl shadow-xs transition-all flex items-center gap-1"
                title="Beri Kasih Sayang"
              >
                <Heart className="w-3.5 h-3.5 fill-white" /> Sayangi ❤️
              </button>
            </div>
          </div>
        </div>

        {/* Error message banner */}
        {errorMsg && (
          <div className="mx-4 mt-3 p-2.5 rounded-xl bg-red-100 text-red-700 text-xs font-bold text-center border border-red-300 animate-wiggle">
            {errorMsg}
          </div>
        )}

        {/* Category Tabs */}
        <div className="px-4 pt-3 pb-2 flex items-center justify-between gap-2 overflow-x-auto border-b border-gray-200 bg-gray-50/80">
          <div className="flex items-center gap-1.5">
            {[
              { id: 'all', label: 'Semua 🌟' },
              { id: 'hat', label: 'Topi 🤠' },
              { id: 'glasses', label: 'Kacamata 👓' },
              { id: 'badge', label: 'Lencana 🏅' },
              { id: 'aura', label: 'Aura ✨' },
            ].map(tab => (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  audio.playClick();
                  setActiveTab(tab.id as CategoryTab);
                }}
                className={`px-3 py-1.5 rounded-xl font-black text-xs transition-all ${
                  activeTab === tab.id
                    ? 'bg-gempurple text-white shadow-sm'
                    : 'bg-white text-gray-600 hover:bg-purple-100 border border-gray-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={handleUnequipAll}
            className="text-[10px] font-bold text-gray-500 hover:text-red-500 transition-colors flex items-center gap-1 flex-shrink-0"
            title="Lepas Semua Aksesori"
          >
            <RotateCcw className="w-3 h-3" /> Lepas Semua
          </button>
        </div>

        {/* Accessory Store & Inventory Grid */}
        <div className="p-4 overflow-y-auto flex-1 max-h-96">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {filteredItems.map(item => {
              const isOwned = ownedIds.includes(item.id);
              const isEquipped = equipped[item.category] === item.icon;
              const canAfford = child.coinsBalance >= item.price;

              return (
                <div
                  key={item.id}
                  className={`p-3 rounded-2xl border-2 flex items-center justify-between gap-3 transition-all ${
                    isEquipped
                      ? 'bg-purple-50 border-gempurple shadow-sm ring-2 ring-purple-200'
                      : isOwned
                      ? 'bg-emerald-50/50 border-emerald-300'
                      : 'bg-white border-gray-200 hover:border-purple-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-white border border-gray-200 shadow-sm flex items-center justify-center text-3xl">
                      {item.icon}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="font-black text-xs text-gemdark">{item.name}</h4>
                        <span
                          className={`text-[8px] font-black uppercase px-1.5 py-0.2 rounded-full ${
                            item.rarity === 'legendaris'
                              ? 'bg-amber-100 text-amber-800 border border-amber-300'
                              : item.rarity === 'langka'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {item.rarity}
                        </span>
                      </div>
                      <p className="text-[10px] text-gray-500 leading-tight mt-0.5 line-clamp-1">
                        {item.description}
                      </p>
                      {!isOwned && (
                        <span className="text-xs font-black text-amber-700 flex items-center gap-0.5 mt-0.5">
                          🪙 {item.price} Koin
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex-shrink-0">
                    {isEquipped ? (
                      <button
                        type="button"
                        onClick={() => handleEquipToggle(item)}
                        className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-black text-xs shadow-xs transition-all flex items-center gap-1"
                      >
                        <Check className="w-3.5 h-3.5" /> Dipakai
                      </button>
                    ) : isOwned ? (
                      <button
                        type="button"
                        onClick={() => handleEquipToggle(item)}
                        className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-black text-xs shadow-xs transition-all"
                      >
                        Pakai 👕
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleBuy(item)}
                        disabled={!canAfford}
                        className={`px-3 py-1.5 rounded-xl font-black text-xs shadow-xs transition-all flex items-center gap-1 ${
                          canAfford
                            ? 'bg-gradient-to-r from-yellow-400 to-amber-500 text-gemdark hover:from-yellow-300 hover:to-amber-400'
                            : 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
                        }`}
                      >
                        <ShoppingBag className="w-3 h-3" /> Beli
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer info */}
        <div className="bg-gray-50 p-3 border-t border-gray-200 text-center">
          <p className="text-[11px] text-gray-500 font-bold flex items-center justify-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Kumpulkan lebih banyak koin dengan menyelesaikan game & modul materi di Peta Petualangan!
          </p>
        </div>
      </div>
    </div>
  );
};
