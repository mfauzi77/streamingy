import React, { useState } from 'react';
import { useVideo } from '../context/VideoContext';
import { VideoCard } from './VideoCard';
import { CheckCircle2, Users, Film, ListVideo, Info, ChevronDown, Loader2 } from 'lucide-react';

export const ChannelView: React.FC = () => {
  const { selectedChannelId, channelVideos, videos, subscriptions, toggleSubscription, playlists, isLoading } = useVideo();
  const [activeTab, setActiveTab] = useState<'videos' | 'playlists' | 'about'>('videos');
  const [visibleCount, setVisibleCount] = useState(8);

  const displayVideos = channelVideos.length > 0 ? channelVideos : videos;
  const sampleVideo = displayVideos[0] || videos[0];

  if (!sampleVideo && isLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 bg-zinc-950 min-h-[calc(100vh-3.5rem)] text-white">
        <Loader2 className="w-8 h-8 animate-spin text-red-500 mb-2" />
        <p className="text-sm text-zinc-400">Memuat data channel dari YouTube...</p>
      </div>
    );
  }

  if (!sampleVideo) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 bg-zinc-950 min-h-[calc(100vh-3.5rem)] text-white">
        <h2 className="text-xl font-bold">Channel tidak ditemukan</h2>
      </div>
    );
  }

  const subscribed = subscriptions.includes(sampleVideo.channelId);
  const currentVisibleVideos = displayVideos.slice(0, visibleCount);
  const hasMore = visibleCount < displayVideos.length;

  const handleLoadMore = () => {
    setVisibleCount(prev => prev + 8);
  };

  return (
    <div className="flex-1 flex flex-col bg-zinc-950 min-h-[calc(100vh-3.5rem)] pb-24 md:pb-12">
      {/* Channel Banner */}
      <div className="w-full h-48 md:h-64 bg-gradient-to-r from-red-900/60 via-zinc-900 to-indigo-950 border-b border-zinc-800 relative">
        <div className="absolute inset-0 bg-black/30"></div>
      </div>

      {/* Channel Header Profile */}
      <div className="max-w-7xl mx-auto w-full px-4 md:px-6 -mt-12 relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
        <div className="flex items-center gap-4">
          <img
            src={sampleVideo.channelAvatar}
            alt={sampleVideo.channelTitle}
            className="w-20 h-20 md:w-24 md:h-24 rounded-full object-cover border-4 border-zinc-950 shadow-2xl"
            referrerPolicy="no-referrer"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl md:text-2xl font-bold text-white">{sampleVideo.channelTitle}</h1>
              <CheckCircle2 className="w-5 h-5 text-zinc-400 fill-zinc-700" />
            </div>
            <div className="flex items-center gap-3 text-xs text-zinc-400 mt-1">
              <span>@{selectedChannelId || sampleVideo.channelId}</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Users className="w-3.5 h-3.5" />
                {sampleVideo.subscribers} subscriber
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Film className="w-3.5 h-3.5" />
                {displayVideos.length} video
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={() => toggleSubscription(sampleVideo.channelId)}
          className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-colors cursor-pointer shadow-lg ${
            subscribed
              ? 'bg-zinc-800 text-zinc-200 hover:bg-zinc-700'
              : 'bg-white text-zinc-950 hover:bg-zinc-200'
          }`}
        >
          {subscribed ? 'Disubscribe' : 'Subscribe'}
        </button>
      </div>

      {/* Channel Navigation Tabs */}
      <div className="max-w-7xl mx-auto w-full px-4 md:px-6 pt-4">
        <div className="flex items-center gap-4 border-b border-zinc-800 pb-2">
          <button
            onClick={() => setActiveTab('videos')}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold transition-colors border-b-2 cursor-pointer ${
              activeTab === 'videos'
                ? 'border-red-600 text-white'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Film className="w-4 h-4" />
            <span>Video ({displayVideos.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('playlists')}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold transition-colors border-b-2 cursor-pointer ${
              activeTab === 'playlists'
                ? 'border-red-600 text-white'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <ListVideo className="w-4 h-4" />
            <span>Playlist ({playlists.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('about')}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold transition-colors border-b-2 cursor-pointer ${
              activeTab === 'about'
                ? 'border-red-600 text-white'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Info className="w-4 h-4" />
            <span>Tentang</span>
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-7xl mx-auto w-full px-4 md:px-6 pt-6">
        {activeTab === 'videos' && (
          <div className="space-y-8">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-red-500 mb-2" />
                <p className="text-sm text-zinc-400">Memuat video real dari YouTube...</p>
              </div>
            ) : displayVideos.length === 0 ? (
              <p className="text-sm text-zinc-400">Belum ada video dari channel ini.</p>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {currentVisibleVideos.map(video => (
                    <VideoCard key={video.id} video={video} />
                  ))}
                </div>

                {hasMore && (
                  <div className="flex justify-center pt-4">
                    <button
                      onClick={handleLoadMore}
                      className="flex items-center gap-2 px-6 py-3 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-white font-semibold text-xs rounded-full transition-colors shadow-lg cursor-pointer"
                    >
                      <span>Muat Lebih Banyak Video</span>
                      <ChevronDown className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {activeTab === 'playlists' && (
          <div className="space-y-6">
            <h3 className="text-base font-bold text-white">Playlist Publik & Simpanan</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {playlists.map(playlist => (
                <div key={playlist.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-white text-base">{playlist.title}</h4>
                    <span className="text-xs text-zinc-400 bg-zinc-800 px-2.5 py-1 rounded-lg">
                      {playlist.videoIds.length} video
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400">Dibuat pada {playlist.createdAt}</p>
                  <div className="pt-2">
                    <button
                      onClick={() => alert(`Membuka playlist: ${playlist.title}`)}
                      className="w-full py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                    >
                      Putar Playlist
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'about' && (
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 max-w-2xl space-y-4 text-sm text-zinc-300">
            <h3 className="text-lg font-bold text-white">Tentang {sampleVideo.channelTitle}</h3>
            <p className="leading-relaxed">
              Channel resmi penyedia konten berkualitas tinggi, edukasi mendalam, tutorial pemrograman, dan hiburan pilihan tanpa gangguan durasi pendek (Shorts).
            </p>
            <div className="border-t border-zinc-800 pt-4 space-y-2 text-xs text-zinc-400">
              <p>📍 Lokasi: Indonesia</p>
              <p>👥 Total Subscriber: {sampleVideo.subscribers}</p>
              <p>📊 Total Video Publik: {displayVideos.length} video</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
