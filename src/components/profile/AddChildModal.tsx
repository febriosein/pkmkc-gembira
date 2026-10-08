import React, { useState } from 'react';
import { X, Sparkles, UserPlus } from 'lucide-react';
import { ChildProfile, AgeBand } from '../../types';
import { storage } from '../../services/storage';
import { audio } from '../../services/audio';

interface AddChildModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdded: (child: ChildProfile) => void;
}

const AVATAR_OPTIONS = ['🦊', '🐱', '🐼', '🦁', '🐰', '🐶', '🦄', '🦖', '🐻', '🐸', '🐵', '🐨'];

export const AddChildModal: React.FC<AddChildModalProps> = ({ isOpen, onClose, onAdded }) => {
  const [nickname, setNickname] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('🦊');
  const [ageBand, setAgeBand] = useState<AgeBand>('paud');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nickname.trim()) {
      setError('Masukkan nama panggilan anak.');
      return;
    }

    try {
      const newChild = storage.addChild(nickname.trim(), selectedAvatar, ageBand);
      audio.playSuccess();
      onAdded(newChild);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Gagal menambahkan profil.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border-4 border-gemgreen relative">
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
          <div className="w-14 h-14 bg-emerald-100 text-gemgreen rounded-2xl mx-auto flex items-center justify-center text-3xl shadow-inner mb-2 animate-float">
            <UserPlus className="w-7 h-7 text-gemgreen" />
          </div>
          <h3 className="text-2xl font-black text-gemdark">Tambah Profil Petualang</h3>
          <p className="text-xs text-gray-500 font-medium">Buat profil baru untuk adik atau kakak agar progres terpisah.</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 border border-red-200 text-xs font-bold rounded-2xl p-3 mb-4 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-black uppercase text-gray-600 mb-1.5">
              Pilih Avatar Karakter
            </label>
            <div className="grid grid-cols-6 gap-2 bg-gray-50 p-2.5 rounded-2xl border border-gray-200">
              {AVATAR_OPTIONS.map(emoji => (
                <button
                  type="button"
                  key={emoji}
                  onClick={() => {
                    audio.playClick();
                    setSelectedAvatar(emoji);
                  }}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl transition-all ${
                    selectedAvatar === emoji
                      ? 'bg-emerald-500 text-white scale-110 shadow-md ring-2 ring-emerald-300'
                      : 'bg-white hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-black uppercase text-gray-600 mb-1.5">
              Nama Panggilan Anak
            </label>
            <input
              type="text"
              value={nickname}
              onChange={e => {
                setNickname(e.target.value);
                setError('');
              }}
              placeholder="Contoh: Siti / Rian"
              maxLength={20}
              className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 focus:border-gemgreen focus:outline-none font-bold text-gemdark text-sm bg-gray-50 focus:bg-white transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-black uppercase text-gray-600 mb-1.5">
              Kelompok Usia & Tingkat Belajar
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'paud', label: 'PAUD (4–6 Thn)', desc: 'Usia Dini' },
                { id: 'sd-fase-a', label: 'SD Kelas 1–2', desc: 'Fase A (7–8 Thn)' },
                { id: 'sd-fase-b', label: 'SD Kelas 3–4', desc: 'Fase B (9–10 Thn)' },
                { id: 'sd-fase-c', label: 'SD Kelas 5–6', desc: 'Fase C (11–12 Thn)' },
              ].map(item => (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => {
                    audio.playClick();
                    setAgeBand(item.id as AgeBand);
                  }}
                  className={`p-2.5 rounded-2xl text-left border-2 transition-all ${
                    ageBand === item.id
                      ? 'border-gemgreen bg-emerald-50 text-gemgreen'
                      : 'border-gray-200 bg-white hover:border-gray-300 text-gray-700'
                  }`}
                >
                  <div className="font-black text-xs">{item.label}</div>
                  <div className="text-[10px] text-gray-500 font-medium">{item.desc}</div>
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-gemgreen hover:bg-emerald-600 active:scale-98 text-white font-black rounded-2xl text-sm shadow-lg shadow-gemgreen/30 transition-all flex items-center justify-center gap-2 mt-2"
          >
            <Sparkles className="w-4 h-4" /> Simpan & Mulai Petualangan (+50 Koin)
          </button>
        </form>
      </div>
    </div>
  );
};
