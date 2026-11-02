import React from 'react';
import { Home, Compass, History, ListVideo } from 'lucide-react';
import { useVideo } from '../context/VideoContext';
import { ViewState } from '../types';

export const MobileNav: React.FC = () => {
  const { viewState, setViewState, setActiveVideo } = useVideo();

  const handleNav = (view: ViewState) => {
    setActiveVideo(null);
    setViewState(view);
  };

  return (
    <nav aria-label="Navigasi Seluler" className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-zinc-900/95 backdrop-blur border-t border-zinc-800 flex items-center justify-around h-16 px-2">
      <button
        onClick={() => handleNav('home')}
        className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors ${
          viewState === 'home' ? 'text-red-500 font-semibold' : 'text-zinc-400 hover:text-white'
        }`}
      >
        <Home className="w-5 h-5 mb-1" />
        <span className="text-[10px]">Beranda</span>
      </button>

      <button
        onClick={() => handleNav('subscriptions')}
        className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors ${
          viewState === 'subscriptions' ? 'text-red-500 font-semibold' : 'text-zinc-400 hover:text-white'
        }`}
      >
        <Compass className="w-5 h-5 mb-1" />
        <span className="text-[10px]">Subskripsi</span>
      </button>

      <button
        onClick={() => handleNav('history')}
        className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors ${
          viewState === 'history' ? 'text-red-500 font-semibold' : 'text-zinc-400 hover:text-white'
        }`}
      >
        <History className="w-5 h-5 mb-1" />
        <span className="text-[10px]">Riwayat</span>
      </button>

      <button
        onClick={() => handleNav('playlists')}
        className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors ${
          viewState === 'playlists' ? 'text-red-500 font-semibold' : 'text-zinc-400 hover:text-white'
        }`}
      >
        <ListVideo className="w-5 h-5 mb-1" />
        <span className="text-[10px]">Playlist</span>
      </button>
    </nav>
  );
};
