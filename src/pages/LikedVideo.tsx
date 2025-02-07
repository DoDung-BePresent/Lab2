import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';

interface Video {
  id: string;
  snippet: {
    title: string;
    thumbnails: {
      medium: {
        url: string;
      };
    };
    channelTitle: string;
    publishedAt: string;
    description: string;
  };
  statistics?: {
    viewCount: string;
    likeCount: string;
  };
}

const LikedVideo = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleGoogleLogin = () => {
    const clientId = '119593802377-4urliv6puqjse49crlpt72uk08tlu2i5.apps.googleusercontent.com';
    const redirectUri = window.location.origin + '/liked-videos';
    const scope = 'https://www.googleapis.com/auth/youtube.readonly';
    
    const state = Math.random().toString(36).substring(7);
    localStorage.setItem('oauth_state', state);
    
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=${clientId}` +
      `&redirect_uri=${encodeURIComponent(redirectUri)}` +
      `&response_type=token` +
      `&scope=${encodeURIComponent(scope)}` +
      `&state=${state}` +
      `&prompt=consent`;
    
    window.location.href = authUrl;
  };

  useEffect(() => {
    const fetchLikedVideos = async () => {
      try {
        const hash = window.location.hash;
        let accessToken = localStorage.getItem('youtube_access_token');
        
        if (hash && hash.includes('access_token')) {
          const params = new URLSearchParams(hash.substring(1));
          const newToken = params.get('access_token');
          const state = params.get('state');
          
          if (state !== localStorage.getItem('oauth_state')) {
            throw new Error('Invalid state parameter');
          }
          
          if (newToken) {
            accessToken = newToken;
            localStorage.setItem('youtube_access_token', newToken);
            localStorage.removeItem('oauth_state');
            window.location.hash = '';
            setIsAuthenticated(true);
          }
        }

        if (!accessToken) {
          setLoading(false);
          return;
        }

        // Lấy video đã thích
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/videos`,
          {
            params: {
              part: 'snippet,statistics',
              myRating: 'like',
              maxResults: 50,
            },
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        
        if (response.data.items && response.data.items.length > 0) {
          setVideos(response.data.items);
          setIsAuthenticated(true);
        }
        setLoading(false);
      } catch (err) {
        if (axios.isAxiosError(err) && err.response?.status === 401) {
          localStorage.removeItem('youtube_access_token');
          setIsAuthenticated(false);
          setError('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
        } else {
          setError('Không thể tải video đã thích. Vui lòng thử lại sau.');
        }
        setLoading(false);
      }
    };

    fetchLikedVideos();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-56px)]">
        <h2 className="text-xl mb-4">Đăng nhập để xem video đã thích</h2>
        <button 
          onClick={handleGoogleLogin}
          className="bg-red-600 text-white px-6 py-2 rounded-full hover:bg-red-700 transition-colors"
        >
          Đăng nhập bằng Google
        </button>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center p-4">{error}</div>;
  }

  const formatViews = (viewCount: string) => {
    const count = parseInt(viewCount);
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}Tr lượt xem`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}N lượt xem`;
    }
    return `${count} lượt xem`;
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Video đã thích</h1>
      {videos.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {videos.map((video) => (
            <Link
              to={`/watch/${video.id}`}
              key={video.id}
              className="flex flex-col md:flex-row gap-4 bg-white rounded-lg overflow-hidden hover:bg-gray-50 transition-colors"
            >
              <div className="relative md:w-[360px] aspect-video">
                <img
                  src={video.snippet.thumbnails.medium.url}
                  alt={video.snippet.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                  <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </div>
              </div>
              <div className="flex-1 p-4">
                <h2 className="font-semibold text-lg mb-2 line-clamp-2 hover:text-blue-600">
                  {video.snippet.title}
                </h2>
                <div className="flex items-center text-sm text-gray-600 mb-2">
                  <span className="hover:text-black">{video.snippet.channelTitle}</span>
                  <span className="mx-1">•</span>
                  {video.statistics && (
                    <>
                      <span>{formatViews(video.statistics.viewCount)}</span>
                      <span className="mx-1">•</span>
                    </>
                  )}
                  <span>
                    {formatDistanceToNow(new Date(video.snippet.publishedAt), {
                      addSuffix: true,
                      locale: vi
                    })}
                  </span>
                </div>
                <p className="text-sm text-gray-600 line-clamp-2">
                  {video.snippet.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12">
          <p className="text-lg text-gray-600 mb-4">Chưa có video nào trong danh sách yêu thích</p>
          <Link 
            to="/"
            className="bg-red-600 text-white px-6 py-2 rounded-full hover:bg-red-700 transition-colors"
          >
            Khám phá video
          </Link>
        </div>
      )}
    </div>
  );
};

export default LikedVideo;
