import React, { useState, useEffect } from 'react';
import { useVideo } from '../context/VideoContext';
import { ThumbsUp, ThumbsDown, Share2, Download, Bookmark, CheckCircle2, MessageSquare, Send, Sparkles, X } from 'lucide-react';
import { VideoCard } from './VideoCard';

export const VideoWatchView: React.FC = () => {
  const {
    activeVideo,
    videos,
    subscriptions,
    toggleSubscription,
    likedVideos,
    toggleLikeVideo,
    playlists,
    addToPlaylist,
    createPlaylist,
    setSelectedChannelId,
    setViewState,
    setActiveVideo,
  } = useVideo();

  const [isExpanded, setIsExpanded] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [commentsList, setCommentsList] = useState(activeVideo?.comments || []);
  const [showPlaylistModal, setShowPlaylistModal] = useState(false);
  const [newPlaylistTitle, setNewPlaylistTitle] = useState('');
  const [shareCopied, setShareCopied] = useState(false);

  // Automatically scroll to top when watching a video
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeVideo]);

  if (!activeVideo) return null;

  const subscribed = subscriptions.includes(activeVideo.channelId);
  const liked = likedVideos.includes(activeVideo.id);

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    const newComment = {
      id: 'c_' + Date.now(),
      author: 'Anda (Pengguna)',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80',
      text: commentText.trim(),
      timestamp: 'Baru saja',
      likes: 0,
    };
    setCommentsList([newComment, ...commentsList]);
    setCommentText('');
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setShareCopied(true);
    setTimeout(() => setShareCopied(false), 2000);
  };

  const relatedVideos = videos.filter(v => v.id !== activeVideo.id);

  const handleClose = () => {
    setActiveVideo(null);
    setViewState('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="flex-1 flex flex-col lg:flex-row gap-6 p-4 md:p-6 bg-zinc-950 min-h-[calc(100vh-3.5rem)] pb-24 md:pb-6 relative">
      {/* Top Close / Back Button */}
      <div className="absolute top-4 right-4 z-20">
        <button
          onClick={handleClose}
          className="flex items-center gap-2 px-3.5 py-2 bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-700 text-white rounded-full shadow-xl transition-all cursor-pointer backdrop-blur"
          title="Tutup (Kembali ke Beranda)"
        >
          <X className="w-4 h-4 text-zinc-300" />
          <span className="text-xs font-semibold">Tutup</span>
        </button>
      </div>

      {/* Left Column: Player & Metadata */}
      <div className="flex-1 flex flex-col gap-4 min-w-0 pt-2">
        {/* YouTube Video Player Iframe */}
        <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-black shadow-2xl border border-zinc-800">
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${activeVideo.id}?autoplay=1&modestbranding=1&rel=0`}
            title={activeVideo.title}
            className="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>

        {/* Video Title */}
        <h1 className="text-lg md:text-xl font-bold text-white leading-snug">
          {activeVideo.title}
        </h1>

        {/* Channel Info & Action Buttons */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
          {/* Channel Info */}
          <div className="flex items-center gap-3">
            <div
              onClick={() => {
                setSelectedChannelId(activeVideo.channelId);
                setViewState('channel');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="cursor-pointer shrink-0"
            >
              <img
                src={activeVideo.channelAvatar}
                alt={activeVideo.channelTitle}
                className="w-11 h-11 rounded-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <div
                onClick={() => {
                  setSelectedChannelId(activeVideo.channelId);
                  setViewState('channel');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="flex items-center gap-1.5 font-bold text-sm text-white hover:text-red-400 cursor-pointer w-fit"
              >
                <span>{activeVideo.channelTitle}</span>
                <CheckCircle2 className="w-4 h-4 text-zinc-400 fill-zinc-700" />
              </div>
              <p className="text-xs text-zinc-400">{activeVideo.subscribers} subscriber</p>
            </div>
            <button
              onClick={() => toggleSubscription(activeVideo.channelId)}
              className={`ml-4 px-4 py-2 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
                subscribed
                  ? 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                  : 'bg-white text-zinc-950 hover:bg-zinc-200'
              }`}
            >
              {subscribed ? 'Disubscribe' : 'Subscribe'}
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Like / Dislike */}
            <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-full overflow-hidden">
              <button
                onClick={() => toggleLikeVideo(activeVideo.id)}
                className={`flex items-center gap-2 px-4 py-2 text-xs font-medium transition-colors hover:bg-zinc-800 border-r border-zinc-800 ${
                  liked ? 'text-red-500 font-bold' : 'text-zinc-300'
                }`}
              >
                <ThumbsUp className={`w-4 h-4 ${liked ? 'fill-red-500' : ''}`} />
                <span>{activeVideo.likes}</span>
              </button>
              <button
                onClick={() => alert('Terima kasih masukan Anda!')}
                className="px-3 py-2 text-zinc-300 hover:bg-zinc-800 transition-colors"
              >
                <ThumbsDown className="w-4 h-4" />
              </button>
            </div>

            {/* Share */}
            <button
              onClick={handleShare}
              className="flex items-center gap-2 px-4 py-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-full text-xs font-medium text-zinc-300 transition-colors"
            >
              <Share2 className="w-4 h-4" />
              <span>{shareCopied ? 'Tautan Disalin!' : 'Bagikan'}</span>
            </button>

            {/* Save to Playlist */}
            <button
              onClick={() => setShowPlaylistModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-full text-xs font-medium text-zinc-300 transition-colors"
            >
              <Bookmark className="w-4 h-4" />
              <span>Simpan</span>
            </button>

            {/* Download */}
            <button
              onClick={() => alert('Simpan offline berhasil! Video dapat ditonton tanpa koneksi.')}
              className="hidden sm:flex items-center gap-2 px-4 py-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-full text-xs font-medium text-zinc-300 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Download</span>
            </button>
          </div>
        </div>

        {/* Description Box */}
        <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-4 text-sm text-zinc-300 space-y-2">
          <div className="flex items-center gap-3 text-xs font-semibold text-zinc-400">
            <span>{activeVideo.views}</span>
            <span>•</span>
            <span>{activeVideo.timestamp}</span>
            <span className="px-2 py-0.5 bg-red-500/10 text-red-400 rounded-md font-mono">{activeVideo.category}</span>
          </div>
          <p className={`whitespace-pre-line leading-relaxed text-zinc-200 ${!isExpanded ? 'line-clamp-2' : ''}`}>
            {activeVideo.description}
          </p>
          <button
            onClick={() => setIsExpanded(prev => !prev)}
            className="text-xs font-semibold text-white hover:underline cursor-pointer pt-1"
          >
            {isExpanded ? 'Tampilkan Lebih Sedikit' : '...selengkapnya'}
          </button>
        </div>

        {/* Comments Section */}
        <div className="mt-4 space-y-4">
          <div className="flex items-center gap-2 text-white font-bold text-base">
            <MessageSquare className="w-5 h-5 text-red-500" />
            <span>{commentsList.length} Komentar</span>
          </div>

          {/* Add Comment Form */}
          <form onSubmit={handleAddComment} className="flex gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 text-white font-bold flex items-center justify-center shrink-0">
              ST
            </div>
            <div className="flex-1 flex flex-col gap-2">
              <input
                type="text"
                placeholder="Tambahkan komentar publik..."
                value={commentText}
                onChange={e => setCommentText(e.target.value)}
                className="w-full bg-transparent border-b border-zinc-700 pb-1 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-red-500"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setCommentText('')}
                  className="px-4 py-1.5 text-xs font-medium text-zinc-400 hover:text-white rounded-lg transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={!commentText.trim()}
                  className="flex items-center gap-1.5 px-4 py-1.5 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Kirim</span>
                </button>
              </div>
            </div>
          </form>

          {/* Comments List */}
          <div className="space-y-4 pt-2">
            {commentsList.map(comment => (
              <div key={comment.id} className="flex items-start gap-3">
                <img
                  src={comment.avatar}
                  alt={comment.author}
                  className="w-9 h-9 rounded-full object-cover shrink-0"
                  referrerPolicy="no-referrer"
                />
                <div className="flex-1 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-zinc-200 text-xs">{comment.author}</span>
                    <span className="text-[10px] text-zinc-500">{comment.timestamp}</span>
                  </div>
                  <p className="text-zinc-300 text-xs mt-1 leading-relaxed">{comment.text}</p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-zinc-400">
                    <button className="flex items-center gap-1 hover:text-white">
                      <ThumbsUp className="w-3.5 h-3.5" />
                      <span>{comment.likes}</span>
                    </button>
                    <button className="hover:text-white">Balas</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Column: Related Videos Sidebar */}
      <div className="w-full lg:w-96 flex flex-col gap-4 shrink-0">
        <div className="text-sm font-bold text-white flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-red-500" />
          <span>Video Terkait</span>
        </div>
        <div className="space-y-4">
          {relatedVideos.map(video => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>
      </div>

      {/* Save to Playlist Modal */}
      {showPlaylistModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-sm p-6 shadow-2xl relative text-zinc-100">
            <h3 className="text-lg font-bold mb-4">Simpan ke Playlist</h3>
            <div className="space-y-2 mb-4 max-h-60 overflow-y-auto">
              {playlists.map(playlist => {
                const isInside = playlist.videoIds.includes(activeVideo.id);
                return (
                  <div
                    key={playlist.id}
                    onClick={() => {
                      if (isInside) {
                        // already in
                      } else {
                        addToPlaylist(playlist.id, activeVideo.id);
                        alert(`Berhasil ditambahkan ke playlist "${playlist.title}"`);
                        setShowPlaylistModal(false);
                      }
                    }}
                    className="flex items-center justify-between p-3 rounded-xl bg-zinc-800/50 hover:bg-zinc-800 cursor-pointer transition-colors"
                  >
                    <span className="text-sm font-medium">{playlist.title}</span>
                    <span className="text-xs text-zinc-400">
                      {isInside ? '✔ Tersimpan' : `${playlist.videoIds.length} video`}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="border-t border-zinc-800 pt-4 space-y-3">
              <label className="block text-xs font-medium text-zinc-400">Buat Playlist Baru</label>
              <input
                type="text"
                placeholder="Nama playlist baru..."
                value={newPlaylistTitle}
                onChange={e => setNewPlaylistTitle(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-red-500"
              />
              <button
                onClick={() => {
                  if (!newPlaylistTitle.trim()) return;
                  createPlaylist(newPlaylistTitle.trim(), activeVideo.id);
                  setNewPlaylistTitle('');
                  setShowPlaylistModal(false);
                  alert('Playlist baru berhasil dibuat dan video disimpan!');
                }}
                className="w-full py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-xl transition-colors"
              >
                Buat & Simpan
              </button>
            </div>
            <button
              onClick={() => setShowPlaylistModal(false)}
              className="mt-4 w-full py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold rounded-xl transition-colors"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
