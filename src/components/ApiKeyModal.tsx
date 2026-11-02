import React from 'react';
import { X, Key, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl w-full max-w-md p-6 shadow-2xl relative text-zinc-100 space-y-4">
        {/* Top X Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-white rounded-full bg-zinc-800/60 hover:bg-zinc-700 transition-colors cursor-pointer"
          title="Tutup"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 pr-8">
          <div className="w-10 h-10 rounded-xl bg-red-600/20 border border-red-500/30 flex items-center justify-center text-red-500 font-bold shrink-0">
            <Key className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold">Status API Key YouTube</h3>
            <p className="text-xs text-zinc-400">Rotasi Kunci Utama & Cadangan Aktif</p>
          </div>
        </div>

        <div className="space-y-3 pt-2">
          <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-between text-xs">
            <div>
              <p className="font-semibold text-white">Kunci Utama</p>
              <p className="text-zinc-500 font-mono mt-0.5">AIzaSyBujGAkfUSWrRBzKBg9QADZgMDRc2YdS2w</p>
            </div>
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
          </div>

          <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-between text-xs">
            <div>
              <p className="font-semibold text-white">Kunci Cadangan</p>
              <p className="text-zinc-500 font-mono mt-0.5">AIzaSyC7vsUuSEwOw1KFuWTpIHAn4WPI5F4EAa0</p>
            </div>
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
          </div>

          <div className="flex items-center gap-2 p-3 rounded-xl bg-zinc-800/50 border border-zinc-800 text-xs text-zinc-400">
            <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0" />
            <span>Sistem otomatis melakukan rotasi kunci jika salah satu kunci mengalami limit kuota atau gangguan.</span>
          </div>
        </div>

        <div className="pt-2">
          <button
            onClick={onClose}
            className="w-full py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
