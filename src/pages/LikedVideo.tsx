import { useEffect, useState } from 'react';
import axios from 'axios';

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
              part: 'snippet',
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

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Video đã thích</h1>
      {videos.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {videos.map((video) => (
            <div
              key={video.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <img
                src={video.snippet.thumbnails.medium.url}
                alt={video.snippet.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h2 className="font-semibold text-lg mb-2 line-clamp-2">
                  {video.snippet.title}
                </h2>
                <p className="text-gray-600 text-sm">
                  {video.snippet.channelTitle}
                </p>
                <p className="text-gray-500 text-xs mt-1">
                  {new Date(video.snippet.publishedAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12">
          <p className="text-lg text-gray-600 mb-4">Chưa có video nào trong danh sách yêu thích</p>
          <a 
            href="/" 
            className="bg-red-600 text-white px-6 py-2 rounded-full hover:bg-red-700 transition-colors"
          >
            Khám phá video
          </a>
        </div>
      )}
    </div>
  );
};

export default LikedVideo;
