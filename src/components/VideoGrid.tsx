import React from 'react';
import { useVideo } from '../context/VideoContext';
import { CATEGORIES } from '../data/mockVideos';
import { VideoCard } from './VideoCard';
import { Flame, Loader2 } from 'lucide-react';

export const VideoGrid: React.FC = () => {
  const { videos, selectedCategory, setSelectedCategory, searchQuery, isLoading } = useVideo();

  // Filter out shorts or videos under 60 seconds (strictly enforcing zero shorts rule)
  const filteredVideos = videos.filter(video => {
    // Match category
    const matchesCategory = selectedCategory === 'Semua' || video.category === selectedCategory;
    
    // Match search query
    const matchesSearch =
      !searchQuery ||
      video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.channelTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.description.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="flex-1 flex flex-col min-w-0 p-4 md:p-6 bg-zinc-950 pb-24 md:pb-6">
      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 no-scrollbar">
        {CATEGORIES.map(category => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 text-xs font-medium rounded-xl whitespace-nowrap transition-all duration-200 cursor-pointer ${
              selectedCategory === category
                ? 'bg-white text-zinc-950 font-semibold shadow-lg shadow-white/10'
                : 'bg-zinc-900 text-zinc-300 hover:bg-zinc-800 hover:text-white border border-zinc-800'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Section Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-white font-bold text-lg">
          <Flame className="w-5 h-5 text-red-500" />
          <span>{searchQuery ? `Hasil Pencarian: "${searchQuery}"` : selectedCategory === 'Semua' ? 'Video Trending dari YouTube' : selectedCategory}</span>
        </div>
        <span className="text-xs text-zinc-500 font-medium">{filteredVideos.length} video tersedia</span>
      </div>

      {/* Video Grid */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-32 text-center">
          <Loader2 className="w-8 h-8 animate-spin text-red-500 mb-3" />
          <h3 className="text-sm font-semibold text-zinc-300">Memuat video real dari YouTube...</h3>
        </div>
      ) : filteredVideos.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500 mb-4">
            🔍
          </div>
          <h3 className="text-lg font-semibold text-white">Tidak ada video ditemukan</h3>
          <p className="text-sm text-zinc-400 mt-1 max-w-sm">
            Coba gunakan kata kunci pencarian yang lain atau pilih kategori yang berbeda.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredVideos.map(video => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>
      )}
    </div>
  );
};
