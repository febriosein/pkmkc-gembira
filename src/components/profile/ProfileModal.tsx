import React, { useState } from 'react';
import { X, UserPlus, Check, Trash2, Coins, Star, Users } from 'lucide-react';
import { ChildProfile } from '../../types';
import { storage } from '../../services/storage';
import { audio } from '../../services/audio';
import { AddChildModal } from './AddChildModal';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeChild: ChildProfile;
  onSelectChild: (child: ChildProfile) => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  activeChild,
  onSelectChild,
}) => {
  const [children, setChildren] = useState<ChildProfile[]>(() => storage.getChildren());
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  if (!isOpen) return null;

  const refreshChildren = () => {
    const updated = storage.getChildren();
    setChildren(updated);
  };

  const handleSelect = (child: ChildProfile) => {
    audio.playClick();
    storage.setActiveChildId(child.id);
    onSelectChild(child);
    onClose();
  };

  const handleDelete = (childId: string) => {
    audio.playClick();
    try {
      storage.deleteChild(childId);
      refreshChildren();
      const newActive = storage.getActiveChild();
      onSelectChild(newActive);
      setDeleteConfirmId(null);
    } catch (err: any) {
      alert(err.message || 'Gagal menghapus profil.');
    }
  };

  const getAgeBandLabel = (band: ChildProfile['ageBand']) => {
    switch (band) {
      case 'paud': return 'PAUD (4–6 Thn)';
      case 'sd-fase-a': return 'SD Fase A (7–8)';
      case 'sd-fase-b': return 'SD Fase B (9–10)';
      case 'sd-fase-c': return 'SD Fase C (11–12)';
      default: return 'Anak';
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
        <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border-4 border-gempurple relative">
          <button
            onClick={() => {
              audio.playClick();
              onClose();
            }}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-full p-1.5 transition-colors"
            title="Tutup"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="text-center mb-5">
            <div className="w-14 h-14 bg-purple-100 text-gempurple rounded-2xl mx-auto flex items-center justify-center text-3xl shadow-inner mb-2 animate-float">
              <Users className="w-7 h-7 text-gempurple" />
            </div>
            <h3 className="text-2xl font-black text-gemdark">Pilih Profil Petualang</h3>
            <p className="text-xs text-gray-500 font-medium">Ganti pemain untuk memuat koin, bintang, dan riwayat belajar masing-masing.</p>
          </div>

          <div className="space-y-3 mb-5 max-h-72 overflow-y-auto pr-1">
            {children.map(child => {
              const isActive = child.id === activeChild.id;
              return (
                <div
                  key={child.id}
                  onClick={() => handleSelect(child)}
                  className={`p-3.5 rounded-2xl border-2 flex items-center justify-between cursor-pointer transition-all gem-card-hover ${
                    isActive
                      ? 'border-gempurple bg-purple-50/60 ring-2 ring-gempurple/20 shadow-sm'
                      : 'border-gray-200 bg-white hover:border-purple-200 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-white border border-gray-200 flex items-center justify-center text-2xl shadow-sm">
                      {child.avatar}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-black text-gemdark text-sm">{child.nickname}</span>
                        {isActive && (
                          <span className="bg-gempurple text-white text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-1">
                            <Check className="w-3 h-3" /> Aktif
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-xs text-gray-500 mt-0.5">
                        <span className="bg-gray-100 px-2 py-0.5 rounded-md font-bold text-[10px]">
                          {getAgeBandLabel(child.ageBand)}
                        </span>
                        <span className="flex items-center gap-1 font-bold text-amber-600">
                          <Coins className="w-3 h-3" /> {child.coinsBalance}
                        </span>
                        <span className="flex items-center gap-1 font-bold text-yellow-600">
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" /> {child.starsTotal}
                        </span>
                      </div>
                    </div>
                  </div>

                  {children.length > 1 && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        audio.playClick();
                        setDeleteConfirmId(child.id);
                      }}
                      className="text-gray-300 hover:text-red-500 p-2 rounded-xl transition-colors"
                      title="Hapus profil ini"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          {/* Delete confirmation modal overlay */}
          {deleteConfirmId && (
            <div className="p-3 bg-red-50 border-2 border-red-200 rounded-2xl mb-4 text-center">
              <p className="text-xs font-bold text-red-700 mb-2">
                Yakin ingin menghapus profil ini? Riwayat belajarnya akan terhapus.
              </p>
              <div className="flex justify-center gap-2">
                <button
                  type="button"
                  onClick={() => setDeleteConfirmId(null)}
                  className="px-3 py-1 bg-white border border-gray-300 rounded-xl text-xs font-bold text-gray-700"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(deleteConfirmId)}
                  className="px-3 py-1 bg-red-600 rounded-xl text-xs font-bold text-white shadow-sm"
                >
                  Ya, Hapus
                </button>
              </div>
            </div>
          )}

          {children.length < 4 ? (
            <button
              type="button"
              onClick={() => {
                audio.playClick();
                setIsAddOpen(true);
              }}
              className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gemdark font-black rounded-2xl text-xs transition-colors flex items-center justify-center gap-2"
            >
              <UserPlus className="w-4 h-4 text-gempurple" /> + Tambah Profil Petualang Baru (Maks 4)
            </button>
          ) : (
            <p className="text-[11px] text-gray-400 text-center italic">
              Batas maksimum 4 profil telah tercapai.
            </p>
          )}
        </div>
      </div>

      <AddChildModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onAdded={(newChild) => {
          refreshChildren();
          onSelectChild(newChild);
        }}
      />
    </>
  );
};
