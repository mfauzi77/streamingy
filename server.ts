import express from 'express';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';

dotenv.config();

const YOUTUBE_API_KEYS = [
  'AIzaSyBujGAkfUSWrRBzKBg9QADZgMDRc2YdS2w', // Kunci utama
  'AIzaSyC7vsUuSEwOw1KFuWTpIHAn4WPI5F4EAa0'  // Kunci cadangan
];

async function fetchWithKeyRotation(urlBuilder: (key: string) => string) {
  let lastError: any = null;
  for (const key of YOUTUBE_API_KEYS) {
    try {
      const url = urlBuilder(key);
      const res = await fetch(url);
      const data = await res.json();
      if (res.ok && !data.error) {
        return data;
      }
      lastError = data.error || data;
      console.warn(`YouTube API key failed, trying next... Error:`, data.error?.message || data);
    } catch (err) {
      lastError = err;
      console.warn(`YouTube API fetch exception with key, trying next...`, err);
    }
  }
  throw lastError || new Error('All YouTube API keys failed');
}

// Fetch real channel avatars from YouTube Channels API
async function enrichItemsWithRealChannelAvatars(items: any[], apiKey: string) {
  try {
    const channelIds = Array.from(new Set(items.map((item: any) => item.snippet?.channelId).filter(Boolean)));
    if (channelIds.length === 0) return items;

    const channelRes = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?part=snippet&id=${channelIds.join(',')}&key=${apiKey}`
    );
    const channelData = await channelRes.json();
    
    const avatarMap: Record<string, string> = {};
    if (channelData.items) {
      for (const ch of channelData.items) {
        const thumb = ch.snippet?.thumbnails?.high?.url || ch.snippet?.thumbnails?.medium?.url || ch.snippet?.thumbnails?.default?.url;
        if (thumb) {
          avatarMap[ch.id] = thumb;
        }
      }
    }

    return items.map((item: any) => {
      const chId = item.snippet?.channelId;
      const realAvatar = avatarMap[chId] || item.snippet?.thumbnails?.high?.url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80';
      return {
        ...item,
        realChannelAvatar: realAvatar
      };
    });
  } catch (err) {
    console.warn('Failed to fetch real channel avatars from YouTube:', err);
    return items;
  }
}

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json());

  const formatItems = (items: any[]) => {
    return (items || []).map((item: any) => {
      const videoId = item.id?.videoId || item.id;
      const snippet = item.snippet || {};
      const channelTitle = snippet.channelTitle || 'Channel YouTube';
      return {
        id: videoId,
        title: snippet.title || 'Video YouTube',
        description: snippet.description || 'Tidak ada deskripsi tersedia.',
        thumbnailUrl: snippet.thumbnails?.high?.url || snippet.thumbnails?.medium?.url || snippet.thumbnails?.default?.url || '',
        channelTitle: channelTitle,
        channelAvatar: item.realChannelAvatar || snippet.thumbnails?.high?.url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        channelId: snippet.channelId || 'channel-id',
        subscribers: '1.5 Juta',
        views: '250rb ditonton',
        timestamp: snippet.publishedAt ? new Date(snippet.publishedAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Baru saja',
        duration: '15:20',
        category: 'Teknologi',
        likes: '15rb',
        comments: [
          {
            id: 'c1',
            author: 'Penonton Setia',
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80',
            text: 'Video berkualitas tinggi dari YouTube!',
            timestamp: 'Baru saja',
            likes: 10
          }
        ]
      };
    });
  };

  // 1. Trending Videos
  app.get('/api/youtube/trending', async (req, res) => {
    try {
      let usedKey = YOUTUBE_API_KEYS[0];
      const data = await fetchWithKeyRotation(key => {
        usedKey = key;
        return `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&chart=mostPopular&regionCode=ID&maxResults=24&key=${key}`;
      });
      const enriched = await enrichItemsWithRealChannelAvatars(data.items || [], usedKey);
      const items = formatItems(enriched);
      res.json({ items });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to fetch trending videos' });
    }
  });

  // 2. Search Videos
  app.get('/api/youtube/search', async (req, res) => {
    try {
      const { q, live } = req.query;
      const query = String(q || 'berita live indonesia');
      let urlPath = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&q=${encodeURIComponent(query)}&maxResults=24`;
      if (live === 'true') {
        urlPath += `&eventType=live`;
      }
      let usedKey = YOUTUBE_API_KEYS[0];
      const data = await fetchWithKeyRotation(key => {
        usedKey = key;
        return `${urlPath}&key=${key}`;
      });
      const enriched = await enrichItemsWithRealChannelAvatars(data.items || [], usedKey);
      const items = formatItems(enriched);
      res.json({ items });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to search YouTube' });
    }
  });

  // 3. Channel Videos
  app.get('/api/youtube/channel', async (req, res) => {
    try {
      const { channelId } = req.query;
      const chId = String(channelId || '');
      let usedKey = YOUTUBE_API_KEYS[0];
      const data = await fetchWithKeyRotation(key => {
        usedKey = key;
        return `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&channelId=${encodeURIComponent(chId)}&maxResults=24&key=${key}`;
      });
      const enriched = await enrichItemsWithRealChannelAvatars(data.items || [], usedKey);
      const items = formatItems(enriched);
      res.json({ items });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to fetch channel videos' });
    }
  });

  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });

  app.use(vite.middlewares);

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT} with authentic YouTube channel avatars.`);
  });
}

startServer();
