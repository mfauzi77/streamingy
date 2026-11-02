import React, { useState } from 'react';
import { Menu, Search, Mic, Video as VideoIcon, Bell, Settings, X } from 'lucide-react';
import { useVideo } from '../context/VideoContext';

interface HeaderProps {
  onOpenSettings: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenSettings }) => {
  const {
    sidebarOpen,
    setSidebarOpen,
    searchQuery,
    setSearchQuery,
    setViewState,
    setActiveVideo,
  } = useVideo();

  const [localQuery, setLocalQuery] = useState(searchQuery);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!localQuery.trim()) return;
    setSearchQuery(localQuery.trim());
    setViewState('home');
    setActiveVideo(null);
    setMobileSearchOpen(false);
  };

  const handleLogoClick = () => {
    setSearchQuery('');
    setLocalQuery('');
    setViewState('home');
    setActiveVideo(null);
  };

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between h-14 px-4 bg-zinc-900/95 backdrop-blur border-b border-zinc-800">
      {/* Left: Menu & Logo */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setSidebarOpen(prev => !prev)}
          className="p-2 text-zinc-300 hover:text-white hover:bg-zinc-800 rounded-full transition-colors cursor-pointer"
          title="Toggle Sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>
        <button
          onClick={handleLogoClick}
          className="flex items-center gap-2 group cursor-pointer focus:outline-none"
        >
          <div className="flex items-center justify-center w-8 h-8 bg-red-600 rounded-xl text-white font-bold shadow-lg shadow-red-600/30 group-hover:scale-105 transition-transform">
            ▶
          </div>
          <span className="text-base md:text-lg font-bold tracking-tight text-white font-sans truncate">
            Stream<span className="text-red-500">Tube</span>
          </span>
        </button>
      </div>

      {/* Center: Search Bar (Desktop) */}
      <div className="hidden md:flex items-center justify-center flex-1 max-w-2xl mx-4">
        <form onSubmit={handleSearchSubmit} className="flex items-center w-full">
          <div className="flex items-center w-full bg-zinc-950 border border-zinc-700 rounded-l-full px-4 py-2 focus-within:border-blue-500 transition-colors">
            <input
              type="text"
              placeholder="Telusuri video (tanpa shorts)..."
              value={localQuery}
              onChange={e => setLocalQuery(e.target.value)}
              className="w-full bg-transparent text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="flex items-center justify-center px-6 py-2 bg-zinc-800 hover:bg-zinc-700 border border-l-0 border-zinc-700 rounded-r-full text-zinc-300 hover:text-white transition-colors cursor-pointer"
            title="Cari"
          >
            <Search className="w-4 h-4" />
          </button>
        </form>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-1 sm:gap-2">
        {/* Mobile Search Toggle Button */}
        <button
          onClick={() => setMobileSearchOpen(true)}
          className="md:hidden p-2 text-zinc-300 hover:text-white hover:bg-zinc-800 rounded-full transition-colors cursor-pointer"
          title="Cari"
        >
          <Search className="w-5 h-5" />
        </button>

        <button
          onClick={() => setShowUploadModal(true)}
          className="p-2 text-zinc-300 hover:text-white hover:bg-zinc-800 rounded-full transition-colors relative"
          title="Buat"
        >
          <VideoIcon className="w-5 h-5" />
        </button>

        <button
          onClick={() => setShowNotifications(prev => !prev)}
          className="p-2 text-zinc-300 hover:text-white hover:bg-zinc-800 rounded-full transition-colors relative"
          title="Notifikasi"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-600 rounded-full"></span>
        </button>

        <button
          onClick={onOpenSettings}
          className="p-2 text-zinc-300 hover:text-white hover:bg-zinc-800 rounded-full transition-colors cursor-pointer"
          title="Pengaturan & API"
        >
          <Settings className="w-5 h-5" />
        </button>
      </div>

      {/* Mobile Search Overlay Modal */}
      {mobileSearchOpen && (
        <div className="absolute inset-0 z-50 flex items-center bg-zinc-900 px-4 md:hidden border-b border-zinc-800">
          <form onSubmit={handleSearchSubmit} className="flex items-center w-full gap-2">
            <div className="flex items-center flex-1 bg-zinc-950 border border-zinc-700 rounded-full px-4 py-2">
              <Search className="w-4 h-4 text-zinc-400 mr-2 shrink-0" />
              <input
                type="text"
                autoFocus
                placeholder="Telusuri video..."
                value={localQuery}
                onChange={e => setLocalQuery(e.target.value)}
                className="w-full bg-transparent text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-full text-xs font-semibold shrink-0 cursor-pointer"
            >
              Cari
            </button>
            <button
              type="button"
              onClick={() => setMobileSearchOpen(false)}
              className="p-2 text-zinc-400 hover:text-white rounded-full shrink-0 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </form>
        </div>
      )}

      {/* Upload Modal Simulation */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl w-full max-w-md p-6 shadow-2xl relative text-zinc-100 space-y-4">
            <button
              onClick={() => setShowUploadModal(false)}
              className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-white rounded-full bg-zinc-800/60 hover:bg-zinc-700 transition-colors cursor-pointer"
              title="Tutup"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold">Upload Video Baru</h3>
            <p className="text-xs text-zinc-400">
              Platform ini dikhususkan untuk video durasi panjang (Tanpa Shorts).
            </p>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">Judul Video</label>
                <input
                  type="text"
                  placeholder="Masukkan judul video..."
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-red-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">ID Video YouTube / URL</label>
                <input
                  type="text"
                  placeholder="Contoh: dQw4w9WgXcQ"
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-red-500 font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">Deskripsi</label>
                <textarea
                  rows={3}
                  placeholder="Deskripsi video..."
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-red-500"
                ></textarea>
              </div>
              <button
                onClick={() => {
                  alert('Video berhasil di-upload ke sistem lokal!');
                  setShowUploadModal(false);
                }}
                className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium rounded-xl transition-colors cursor-pointer text-xs"
              >
                Publikasikan Video
              </button>
              <button
                onClick={() => setShowUploadModal(false)}
                className="w-full py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-medium rounded-xl transition-colors cursor-pointer text-xs"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notifications Dropdown */}
      {showNotifications && (
        <div className="absolute right-16 top-14 w-80 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl p-4 z-50 text-zinc-100">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-800 mb-3">
            <h4 className="font-semibold text-sm">Notifikasi</h4>
            <span className="text-xs text-red-500 font-medium">1 baru</span>
          </div>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-2 rounded-lg bg-zinc-800/50 hover:bg-zinc-800 transition-colors cursor-pointer">
              <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center text-white shrink-0 font-bold">
                ▶
              </div>
              <div>
                <p className="text-xs font-medium text-white">Video baru dari Lofi Girl telah rilis!</p>
                <p className="text-[10px] text-zinc-400 mt-0.5">2 jam yang lalu</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
