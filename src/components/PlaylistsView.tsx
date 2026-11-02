import React, { useState } from 'react';
import { useVideo } from '../context/VideoContext';
import { ListVideo, Plus, Film, Trash2 } from 'lucide-react';
import { VideoCard } from './VideoCard';

export const PlaylistsView: React.FC = () => {
  const { playlists, createPlaylist, videos } = useVideo();
  const [activePlaylistId, setActivePlaylistId] = useState<string>(playlists[0]?.id || '');
  const [newTitle, setNewTitle] = useState('');

  const currentPlaylist = playlists.find(p => p.id === activePlaylistId) || playlists[0];
  const playlistVideos = currentPlaylist
    ? videos.filter(v => currentPlaylist.videoIds.includes(v.id))
    : [];

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    createPlaylist(newTitle.trim());
    setNewTitle('');
  };

  return (
    <div className="flex-1 flex flex-col p-4 md:p-6 bg-zinc-950 min-h-[calc(100vh-3.5rem)]">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-zinc-800">
        <div className="flex items-center gap-3">
          <ListVideo className="w-6 h-6 text-red-500" />
          <h1 className="text-xl font-bold text-white">Playlist Tersimpan</h1>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left: Playlist Tabs & Creator */}
        <div className="w-full lg:w-80 space-y-4 shrink-0">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 space-y-3">
            <h3 className="text-sm font-bold text-white">Daftar Playlist</h3>
            <div className="space-y-1">
              {playlists.map(p => (
                <button
                  key={p.id}
                  onClick={() => setActivePlaylistId(p.id)}
                  className={`flex items-center justify-between w-full px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                    currentPlaylist?.id === p.id
                      ? 'bg-red-600 text-white shadow-lg shadow-red-600/20'
                      : 'bg-zinc-800/50 text-zinc-300 hover:bg-zinc-800 hover:text-white'
                  }`}
                >
                  <span className="truncate">{p.title}</span>
                  <span className="text-[10px] opacity-80">{p.videoIds.length} video</span>
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleCreate} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 space-y-3">
            <h3 className="text-sm font-bold text-white">Buat Playlist Baru</h3>
            <input
              type="text"
              placeholder="Judul playlist..."
              value={newTitle}
              onChange={e => setNewTitle(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500"
            />
            <button
              type="submit"
              className="flex items-center justify-center gap-2 w-full py-2 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Buat Playlist</span>
            </button>
          </form>
        </div>

        {/* Right: Videos in Current Playlist */}
        <div className="flex-1 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white">
              {currentPlaylist ? currentPlaylist.title : 'Playlist'}
            </h2>
            <span className="text-xs text-zinc-400">{playlistVideos.length} video tersimpan</span>
          </div>

          {playlistVideos.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center bg-zinc-900/40 border border-zinc-800 rounded-3xl">
              <Film className="w-12 h-12 text-zinc-600 mb-3" />
              <h3 className="text-base font-semibold text-white">Playlist Kosong</h3>
              <p className="text-xs text-zinc-400 mt-1 max-w-xs">
                Tambahkan video ke playlist ini dengan mengklik tombol "Simpan" pada halaman tonton video.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {playlistVideos.map(video => (
                <VideoCard key={video.id} video={video} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
