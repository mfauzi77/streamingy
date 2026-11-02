import React from 'react';
import { Home, Compass, History, ListVideo, ThumbsUp, Flame, Music, Code, Cpu, Tv, BookOpen, Utensils, X, Radio } from 'lucide-react';
import { useVideo } from '../context/VideoContext';
import { ViewState } from '../types';

export const Sidebar: React.FC = () => {
  const {
    sidebarOpen,
    setSidebarOpen,
    viewState,
    setViewState,
    setActiveVideo,
    setSelectedCategory,
  } = useVideo();

  const handleNav = (view: ViewState) => {
    setActiveVideo(null);
    setViewState(view);
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  };

  return (
    <>
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="md:hidden fixed inset-0 z-50 bg-black/75 backdrop-blur-xs transition-opacity"
        />
      )}

      <aside
        className={`fixed md:sticky top-14 left-0 h-[calc(100vh-3.5rem)] bg-zinc-900 border-r border-zinc-800 flex flex-col px-3 py-4 gap-6 shrink-0 z-50 overflow-y-auto transition-transform duration-300 ${
          sidebarOpen
            ? 'translate-x-0 w-64'
            : '-translate-x-full md:translate-x-0 md:w-18'
        }`}
      >
        <div className="flex md:hidden items-center justify-between px-1 pb-2 border-b border-zinc-800">
          <span className="text-sm font-bold text-white">Menu StreamTube</span>
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-1 text-zinc-400 hover:text-white rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Main Nav */}
        <div className="space-y-1">
          <button
            onClick={() => handleNav('home')}
            className={`flex items-center gap-4 w-full px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
              viewState === 'home'
                ? 'bg-zinc-800 text-white font-semibold'
                : 'text-zinc-300 hover:bg-zinc-800/50 hover:text-white'
            }`}
          >
            <Home className="w-5 h-5 text-red-500 shrink-0" />
            <span className={`${!sidebarOpen ? 'md:hidden' : ''}`}>Beranda</span>
          </button>
          <button
            onClick={() => {
              setSelectedCategory('Live');
              handleNav('home');
            }}
            className={`flex items-center gap-4 w-full px-3 py-2.5 rounded-xl text-sm font-medium transition-colors text-zinc-300 hover:bg-zinc-800/50 hover:text-white`}
          >
            <Radio className="w-5 h-5 text-red-500 shrink-0 animate-pulse" />
            <span className={`${!sidebarOpen ? 'md:hidden' : ''}`}>Live</span>
          </button>
        </div>

        <hr className="border-zinc-800 my-1" />

        {/* Library */}
        <div className="space-y-1">
          <div className={`px-3 text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2 ${!sidebarOpen ? 'md:hidden' : ''}`}>
            Koleksi Anda
          </div>
          <button
            onClick={() => handleNav('history')}
            className={`flex items-center gap-4 w-full px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
              viewState === 'history'
                ? 'bg-zinc-800 text-white font-semibold'
                : 'text-zinc-300 hover:bg-zinc-800/50 hover:text-white'
            }`}
          >
            <History className="w-5 h-5 text-zinc-400 shrink-0" />
            <span className={`${!sidebarOpen ? 'md:hidden' : ''}`}>Riwayat Tontonan</span>
          </button>
          <button
            onClick={() => handleNav('playlists')}
            className={`flex items-center gap-4 w-full px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
              viewState === 'playlists'
                ? 'bg-zinc-800 text-white font-semibold'
                : 'text-zinc-300 hover:bg-zinc-800/50 hover:text-white'
            }`}
          >
            <ListVideo className="w-5 h-5 text-zinc-400 shrink-0" />
            <span className={`${!sidebarOpen ? 'md:hidden' : ''}`}>Playlist Disimpan</span>
          </button>
          <button
            onClick={() => handleNav('liked')}
            className={`flex items-center gap-4 w-full px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
              viewState === 'liked'
                ? 'bg-zinc-800 text-white font-semibold'
                : 'text-zinc-300 hover:bg-zinc-800/50 hover:text-white'
            }`}
          >
            <ThumbsUp className="w-5 h-5 text-zinc-400 shrink-0" />
            <span className={`${!sidebarOpen ? 'md:hidden' : ''}`}>Video Disukai</span>
          </button>
        </div>

        <hr className="border-zinc-800 my-1" />

        {/* Explore Categories shortcut */}
        <div className={`${!sidebarOpen ? 'md:hidden' : ''}`}>
          <div className="px-3 text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
            Jelajah Kategori
          </div>
          <div className="space-y-1">
            {[
              { name: 'Live', icon: Radio },
              { name: 'Teknologi', icon: Cpu },
              { name: 'Pemrograman', icon: Code },
              { name: 'Musik Lofi', icon: Music },
              { name: 'Sains & Alam', icon: Flame },
              { name: 'Gaming', icon: Tv },
              { name: 'Edukasi', icon: BookOpen },
              { name: 'Kuliner', icon: Utensils },
            ].map(cat => (
              <button
                key={cat.name}
                onClick={() => {
                  setSelectedCategory(cat.name);
                  setViewState('home');
                  setActiveVideo(null);
                  if (window.innerWidth < 768) setSidebarOpen(false);
                }}
                className="flex items-center gap-4 w-full px-3 py-2 rounded-xl text-xs font-medium text-zinc-300 hover:bg-zinc-800/50 transition-colors"
              >
                <cat.icon className="w-4 h-4 text-zinc-400 shrink-0" />
                <span>{cat.name}</span>
              </button>
            ))}
          </div>
        </div>
      </aside>
    </>
  );
};
