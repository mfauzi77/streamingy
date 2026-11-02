export interface Comment {
  id: string;
  author: string;
  avatar: string;
  text: string;
  timestamp: string;
  likes: number;
}

export interface Video {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  channelTitle: string;
  channelAvatar: string;
  channelId: string;
  subscribers: string;
  views: string;
  timestamp: string;
  duration: string; // e.g. "15:42" (must be > 60s, strictly no shorts)
  category: string;
  likes: string;
  comments: Comment[];
  videoUrl?: string; // YouTube embed ID or url
}

export interface Playlist {
  id: string;
  title: string;
  videoIds: string[];
  createdAt: string;
}

export type ViewState = 
  | 'home' 
  | 'watch' 
  | 'history' 
  | 'subscriptions' 
  | 'playlists' 
  | 'liked' 
  | 'channel';
