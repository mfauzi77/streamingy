import React, { createContext, useContext, useState, useEffect } from 'react';
import { Video, ViewState, Playlist } from '../types';

interface VideoContextType {
  viewState: ViewState;
  setViewState: (view: ViewState) => void;
  activeVideo: Video | null;
  setActiveVideo: (video: Video | null) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  history: Video[];
  addToHistory: (video: Video) => void;
  clearHistory: () => void;
  removeFromHistory: (videoId: string) => void;
  subscriptions: string[];
  toggleSubscription: (channelId: string) => void;
  isSubscribed: (channelId: string) => boolean;
  likedVideos: string[];
  toggleLikeVideo: (videoId: string) => void;
  isLiked: (videoId: string) => boolean;
  playlists: Playlist[];
  createPlaylist: (title: string, initialVideoId?: string) => void;
  addToPlaylist: (playlistId: string, videoId: string) => void;
  removeFromPlaylist: (playlistId: string, videoId: string) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean | ((prev: boolean) => boolean)) => void;
  selectedChannelId: string | null;
  setSelectedChannelId: (id: string | null) => void;
  videos: Video[];
  isLoading: boolean;
  channelVideos: Video[];
  fetchChannelVideos: (channelId: string) => Promise<void>;
}

const VideoContext = createContext<VideoContextType | undefined>(undefined);

export const VideoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [viewState, setViewState] = useState<ViewState>('home');
  const [activeVideo, setActiveVideo] = useState<Video | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const [selectedChannelId, setSelectedChannelId] = useState<string | null>(null);
  
  const [videos, setVideos] = useState<Video[]>([]);
  const [channelVideos, setChannelVideos] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [history, setHistory] = useState<Video[]>(() => {
    try {
      const saved = localStorage.getItem('streamtube_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [subscriptions, setSubscriptions] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('streamtube_subs');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [likedVideos, setLikedVideos] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('streamtube_likes');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [playlists, setPlaylists] = useState<Playlist[]>(() => {
    try {
      const saved = localStorage.getItem('streamtube_playlists');
      return saved ? JSON.parse(saved) : [
        { id: 'p1', title: 'Tonton Nanti', videoIds: [], createdAt: '2026-03-01' }
      ];
    } catch {
      return [
        { id: 'p1', title: 'Tonton Nanti', videoIds: [], createdAt: '2026-03-01' }
      ];
    }
  });

  // Fetch real YouTube videos on load or when search/category changes
  useEffect(() => {
    let isMounted = true;
    const fetchRealYouTube = async () => {
      setIsLoading(true);
      try {
        let endpoint = '/api/youtube/trending';
        if (searchQuery.trim()) {
          endpoint = `/api/youtube/search?q=${encodeURIComponent(searchQuery)}`;
        } else if (selectedCategory === 'Live') {
          endpoint = `/api/youtube/search?q=${encodeURIComponent('berita live indonesia terkini')}&live=true`;
        } else if (selectedCategory !== 'Semua') {
          endpoint = `/api/youtube/search?q=${encodeURIComponent(selectedCategory + ' indonesia')}`;
        }

        const res = await fetch(endpoint);
        const data = await res.json();
        if (isMounted && data.items) {
          setVideos(data.items);
        }
      } catch (err) {
        console.error('Failed to fetch from real YouTube API:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchRealYouTube();

    return () => {
      isMounted = false;
    };
  }, [searchQuery, selectedCategory]);

  const fetchChannelVideos = async (channelId: string) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/youtube/channel?channelId=${encodeURIComponent(channelId)}`);
      const data = await res.json();
      if (data.items) {
        setChannelVideos(data.items);
      }
    } catch (err) {
      console.error('Failed to fetch channel videos:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (selectedChannelId) {
      fetchChannelVideos(selectedChannelId);
    }
  }, [selectedChannelId]);

  useEffect(() => {
    localStorage.setItem('streamtube_history', JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    localStorage.setItem('streamtube_subs', JSON.stringify(subscriptions));
  }, [subscriptions]);

  useEffect(() => {
    localStorage.setItem('streamtube_likes', JSON.stringify(likedVideos));
  }, [likedVideos]);

  useEffect(() => {
    localStorage.setItem('streamtube_playlists', JSON.stringify(playlists));
  }, [playlists]);

  const addToHistory = (video: Video) => {
    setHistory(prev => {
      const filtered = prev.filter(v => v.id !== video.id);
      return [video, ...filtered].slice(0, 50);
    });
  };

  const clearHistory = () => {
    setHistory([]);
  };

  const removeFromHistory = (videoId: string) => {
    setHistory(prev => prev.filter(v => v.id !== videoId));
  };

  const toggleSubscription = (channelId: string) => {
    setSubscriptions(prev => {
      if (prev.includes(channelId)) {
        return prev.filter(id => id !== channelId);
      } else {
        return [...prev, channelId];
      }
    });
  };

  const isSubscribed = (channelId: string) => subscriptions.includes(channelId);

  const toggleLikeVideo = (videoId: string) => {
    setLikedVideos(prev => {
      if (prev.includes(videoId)) {
        return prev.filter(id => id !== videoId);
      } else {
        return [...prev, videoId];
      }
    });
  };

  const isLiked = (videoId: string) => likedVideos.includes(videoId);

  const createPlaylist = (title: string, initialVideoId?: string) => {
    const newPlaylist: Playlist = {
      id: 'p_' + Date.now(),
      title,
      videoIds: initialVideoId ? [initialVideoId] : [],
      createdAt: new Date().toISOString().split('T')[0],
    };
    setPlaylists(prev => [...prev, newPlaylist]);
  };

  const addToPlaylist = (playlistId: string, videoId: string) => {
    setPlaylists(prev =>
      prev.map(p => {
        if (p.id === playlistId && !p.videoIds.includes(videoId)) {
          return { ...p, videoIds: [...p.videoIds, videoId] };
        }
        return p;
      })
    );
  };

  const removeFromPlaylist = (playlistId: string, videoId: string) => {
    setPlaylists(prev =>
      prev.map(p => {
        if (p.id === playlistId) {
          return { ...p, videoIds: p.videoIds.filter(id => id !== videoId) };
        }
        return p;
      })
    );
  };

  return (
    <VideoContext.Provider
      value={{
        viewState,
        setViewState,
        activeVideo,
        setActiveVideo,
        selectedCategory,
        setSelectedCategory,
        searchQuery,
        setSearchQuery,
        history,
        addToHistory,
        clearHistory,
        removeFromHistory,
        subscriptions,
        toggleSubscription,
        isSubscribed,
        likedVideos,
        toggleLikeVideo,
        isLiked,
        playlists,
        createPlaylist,
        addToPlaylist,
        removeFromPlaylist,
        sidebarOpen,
        setSidebarOpen,
        selectedChannelId,
        setSelectedChannelId,
        videos,
        isLoading,
        channelVideos,
        fetchChannelVideos,
      }}
    >
      {children}
    </VideoContext.Provider>
  );
};

export const useVideo = () => {
  const context = useContext(VideoContext);
  if (!context) {
    throw new Error('useVideo must be used within a VideoProvider');
  }
  return context;
};
