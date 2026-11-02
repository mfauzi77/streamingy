import React from 'react';
import { useVideo } from '../context/VideoContext';
import { History as HistoryIcon, Trash2 } from 'lucide-react';
import { VideoCard } from './VideoCard';

export const HistoryView: React.FC = () => {
  const { history, clearHistory } = useVideo();

  return (
    <div className="flex-1 flex flex-col p-4 md:p-6 bg-zinc-950 min-h-[calc(100vh-3.5rem)]">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-zinc-800">
        <div className="flex items-center gap-3">
          <HistoryIcon className="w-6 h-6 text-red-500" />
          <h1 className="text-xl font-bold text-white">Riwayat Tontonan</h1>
        </div>
        {history.length > 0 && (
          <button
            onClick={() => {
              if (window.confirm('Hapus seluruh riwayat tontonan?')) {
                clearHistory();
              }
            }}
            className="flex items-center gap-2 px-4 py-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer"
          >
            <Trash2 className="w-4 h-4 text-red-500" />
            <span>Hapus Semua Riwayat</span>
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500 mb-4">
            🕒
          </div>
          <h3 className="text-lg font-semibold text-white">Belum Ada Riwayat Tontonan</h3>
          <p className="text-sm text-zinc-400 mt-1 max-w-sm">
            Video yang Anda tonton akan otomatis tersimpan di sini untuk memudahkan penelusuran kembali.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {history.map(video => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>
      )}
    </div>
  );
};
