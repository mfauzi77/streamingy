import React from 'react';
import { Video } from '../types';
import { useVideo } from '../context/VideoContext';
import { CheckCircle2 } from 'lucide-react';

interface VideoCardProps {
  video: Video;
}

export const VideoCard: React.FC<VideoCardProps> = ({ video }) => {
  const { setActiveVideo, setViewState, addToHistory, setSelectedChannelId } = useVideo();

  const handleCardClick = () => {
    addToHistory(video);
    setActiveVideo(video);
    setViewState('watch');
  };

  const handleChannelClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedChannelId(video.channelId);
    setViewState('channel');
    setActiveVideo(null);
  };

  return (
    <div
      onClick={handleCardClick}
      className="group flex flex-col gap-3 cursor-pointer"
    >
      {/* Thumbnail Container */}
      <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-zinc-800 shadow-md group-hover:rounded-xl transition-all duration-300">
        <img
          src={video.thumbnailUrl}
          alt={video.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          referrerPolicy="no-referrer"
        />
        {/* Duration Badge */}
        <div className="absolute bottom-2 right-2 px-2 py-0.5 bg-black/80 backdrop-blur-sm text-white text-xs font-semibold rounded-md tracking-wider">
          {video.duration}
        </div>
      </div>

      {/* Meta Information */}
      <div className="flex gap-3 px-1">
        <div
          onClick={handleChannelClick}
          className="shrink-0 cursor-pointer"
        >
          <img
            src={video.channelAvatar}
            alt={video.channelTitle}
            className="w-9 h-9 rounded-full object-cover hover:opacity-95 transition-opacity"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="flex flex-col flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-zinc-100 line-clamp-2 group-hover:text-red-400 transition-colors leading-snug">
            {video.title}
          </h3>
          <div
            onClick={handleChannelClick}
            className="flex items-center gap-1.5 mt-1 text-xs text-zinc-400 hover:text-zinc-200 transition-colors w-fit"
          >
            <span>{video.channelTitle}</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-zinc-400 fill-zinc-700" />
          </div>
          <div className="flex items-center gap-1.5 text-xs text-zinc-500 mt-0.5">
            <span>{video.views}</span>
            <span>•</span>
            <span>{video.timestamp}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
