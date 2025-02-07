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

  const formatViews = (viewCount: string) => {
    const count = parseInt(viewCount);
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}Tr lượt xem`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}N lượt xem`;
    }
    return `${count} lượt xem`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-56px)]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-56px)] bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-sm max-w-md w-full text-center">
          <h2 className="text-xl font-semibold mb-4">Đăng nhập để xem video đã thích</h2>
          <p className="text-gray-600 mb-6">Đăng nhập để xem danh sách video bạn đã thích trên YouTube</p>
          <button 
            onClick={handleGoogleLogin}
            className="inline-flex items-center justify-center gap-2 bg-red-600 text-white px-6 py-2.5 rounded-full hover:bg-red-700 transition-colors font-medium"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"/>
            </svg>
            Đăng nhập bằng Google
          </button>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-56px)] bg-gray-50">
        <div className="bg-white p-6 rounded-lg shadow-sm max-w-md w-full text-center">
          <div className="text-red-500 mb-2">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-gray-800 font-medium">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1280px] mx-auto px-4 py-6">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center">
          <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
        </div>
        <div>
          <h1 className="text-2xl font-bold">Video đã thích</h1>
          <p className="text-sm text-gray-600">{videos.length} video</p>
        </div>
      </div>

      {videos.length > 0 ? (
        <div className="grid grid-cols-1 gap-3">
          {videos.map((video) => (
            <Link
              to={`/watch/${video.id}`}
              key={video.id}
              className="flex flex-col md:flex-row gap-4 p-2 rounded-xl hover:bg-gray-100 transition-colors"
            >
              <div className="relative md:w-[360px] aspect-video rounded-xl overflow-hidden">
                <img
                  src={video.snippet.thumbnails.medium.url}
                  alt={video.snippet.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/0 hover:bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-all">
                  <svg className="w-12 h-12 text-white drop-shadow-lg" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </div>
              </div>
              <div className="flex-1 min-w-0 py-1">
                <h2 className="text-lg font-medium mb-1 line-clamp-2 text-gray-900 hover:text-blue-600 transition-colors">
                  {video.snippet.title}
                </h2>
                <div className="flex items-center gap-1 text-sm text-gray-600 mb-2">
                  <span className="font-medium hover:text-gray-900 transition-colors">
                    {video.snippet.channelTitle}
                  </span>
                  <span>•</span>
                  {video.statistics && (
                    <>
                      <span>{formatViews(video.statistics.viewCount)}</span>
                      <span>•</span>
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
        <div className="flex flex-col items-center justify-center py-16 bg-gray-50 rounded-2xl">
          <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mb-4">
            <svg className="w-12 h-12 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
          </div>
          <p className="text-lg font-medium text-gray-900 mb-2">Chưa có video nào trong danh sách yêu thích</p>
          <p className="text-gray-600 mb-6">Các video bạn thích sẽ xuất hiện tại đây</p>
          <Link 
            to="/"
            className="bg-red-600 text-white px-6 py-2.5 rounded-full hover:bg-red-700 transition-colors font-medium"
          >
            Khám phá video
          </Link>
        </div>
      )}
    </div>
  );
};

export default LikedVideo;
