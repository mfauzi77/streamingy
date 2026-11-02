import React from 'react';
import { useVideo } from '../context/VideoContext';
import { Compass } from 'lucide-react';
import { VideoCard } from './VideoCard';

export const SubscriptionsView: React.FC = () => {
  const { subscriptions, videos } = useVideo();

  const subscribedVideos = videos.filter(v => subscriptions.includes(v.channelId));

  return (
    <div className="flex-1 flex flex-col p-4 md:p-6 bg-zinc-950 min-h-[calc(100vh-3.5rem)]">
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-zinc-800">
        <Compass className="w-6 h-6 text-red-500" />
        <h1 className="text-xl font-bold text-white">Subskripsi Terbaru</h1>
      </div>

      {subscribedVideos.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500 mb-4">
            📡
          </div>
          <h3 className="text-lg font-semibold text-white">Belum Ada Subskripsi</h3>
          <p className="text-sm text-zinc-400 mt-1 max-w-sm">
            Klik tombol Subscribe pada video pilihan untuk melihat pembaruan terbaru di feed subskripsi Anda.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {subscribedVideos.map(video => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>
      )}
    </div>
  );
};
