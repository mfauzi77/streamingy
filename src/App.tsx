/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { VideoProvider, useVideo } from './context/VideoContext';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { MobileNav } from './components/MobileNav';
import { VideoGrid } from './components/VideoGrid';
import { VideoWatchView } from './components/VideoWatchView';
import { HistoryView } from './components/HistoryView';
import { SubscriptionsView } from './components/SubscriptionsView';
import { PlaylistsView } from './components/PlaylistsView';
import { ChannelView } from './components/ChannelView';
import { ApiKeyModal } from './components/ApiKeyModal';
import { VideoCard } from './components/VideoCard';

const MainContent: React.FC = () => {
  const { viewState, likedVideos, videos } = useVideo();
  const [settingsOpen, setSettingsOpen] = useState(false);

  const renderLikedView = () => {
    const likedList = videos.filter(v => likedVideos.includes(v.id));
    return (
      <div className="flex-1 flex flex-col p-4 md:p-6 bg-zinc-950 min-h-[calc(100vh-3.5rem)] pb-24 md:pb-6">
        <h1 className="text-xl font-bold text-white mb-6 pb-4 border-b border-zinc-800">Video yang Disukai</h1>
        {likedList.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500 mb-4">
              👍
            </div>
            <h3 className="text-lg font-semibold text-white">Belum Ada Video Disukai</h3>
            <p className="text-sm text-zinc-400 mt-1 max-w-sm">
              Klik ikon Like pada video untuk menyimpannya ke daftar video favorit Anda.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {likedList.map(video => (
              <VideoCard key={video.id} video={video} />
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderView = () => {
    switch (viewState) {
      case 'home':
        return <div className="pb-20 md:pb-0"><VideoGrid /></div>;
      case 'watch':
        return <div className="pb-20 md:pb-0"><VideoWatchView /></div>;
      case 'history':
        return <div className="pb-20 md:pb-0"><HistoryView /></div>;
      case 'subscriptions':
        return <div className="pb-20 md:pb-0"><SubscriptionsView /></div>;
      case 'playlists':
        return <div className="pb-20 md:pb-0"><PlaylistsView /></div>;
      case 'liked':
        return <div className="pb-20 md:pb-0">{renderLikedView()}</div>;
      case 'channel':
        return <div className="pb-20 md:pb-0"><ChannelView /></div>;
      default:
        return <div className="pb-20 md:pb-0"><VideoGrid /></div>;
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans">
      <Header onOpenSettings={() => setSettingsOpen(true)} />
      <div className="flex flex-1 min-h-[calc(100vh-3.5rem)] relative">
        <Sidebar />
        <main className="flex-1 flex flex-col min-w-0">
          {renderView()}
        </main>
      </div>
      <MobileNav />
      <ApiKeyModal isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </div>
  );
};

export default function App() {
  return (
    <VideoProvider>
      <MainContent />
    </VideoProvider>
  );
}
