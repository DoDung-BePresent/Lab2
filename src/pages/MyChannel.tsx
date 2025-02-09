

import React, { useEffect, useState } from "react";

// Interface cho dữ liệu
interface ChannelInfo {
  title: string;
  customUrl: string;
  avatar: string;
  subscribers: string;
}

interface Playlist {
  id: string;
  title: string;
  thumbnail: string;
  videoCount: number;
}

interface Video {
  id: string;
  title: string;
  thumbnail: string;
}

// Component chính
const MyChannel: React.FC = () => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [channelInfo, setChannelInfo] = useState<ChannelInfo | null>(null);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [watchLater, setWatchLater] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [watchedVideos, setWatchedVideos] = useState<Video[]>([]);
  const [likedVideos, setLikedVideos] = useState<Video[]>([]);

  // Lấy token từ URL hoặc localStorage
  useEffect(() => {
    const params = new URLSearchParams(window.location.hash.substring(1));
    let token = params.get('access_token');

    if (token) {
      // Lưu token vào localStorage để sử dụng cho các lần sau
      localStorage.setItem('access_token', token);
      // Xóa token khỏi URL để bảo mật
      window.history.replaceState({}, document.title, window.location.pathname);
    } else {
      // Nếu không có token trong URL, kiểm tra trong localStorage
      token = localStorage.getItem('access_token');
    }

    if (token) {
      setAccessToken(token);
      fetchData(token);
    } else {
      setIsLoading(false);  // Không có token, không tải dữ liệu
    }
  }, []);

  // Hàm xử lý Google OAuth Login
  const handleGoogleLogin = () => {
    const clientId =
      "356362454055-p7aek6j0lksv1jvsmfj838812ltfa8eu.apps.googleusercontent.com"; // Thay bằng Client ID của bạn
    const redirectUri = window.location.origin + "/my-channel";
    const scope = "https://www.googleapis.com/auth/youtube.readonly";

    const authUrl =
      `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=${clientId}` +
      `&redirect_uri=${encodeURIComponent(redirectUri)}` +
      `&response_type=token` +
      `&scope=${encodeURIComponent(scope)}` +
      `&prompt=consent`;

    window.location.href = authUrl;
  };

  // Hàm fetch dữ liệu từ API
  const fetchData = async (token: string) => {
    setIsLoading(true);

    try {
      // Fetch thông tin kênh
      const channelResponse = await fetch(
        "https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&mine=true",
        { headers: { Authorization: `Bearer ${token}` } },
      );
      const channelData = await channelResponse.json();
      if (channelData.items && channelData.items.length > 0) {
        const channel = channelData.items[0];
        setChannelInfo({
          title: channel.snippet.title,
          customUrl: channel.snippet.customUrl,
          avatar: channel.snippet.thumbnails.default.url,
          subscribers: channel.statistics.subscriberCount,
        });
      }

      // Fetch playlists
      const playlistsResponse = await fetch(
        "https://www.googleapis.com/youtube/v3/playlists?part=snippet,contentDetails&mine=true",
        { headers: { Authorization: `Bearer ${token}` } },
      );
      const playlistsData = await playlistsResponse.json();
      setPlaylists(
        playlistsData.items.map((item: any) => ({
          id: item.id,
          title: item.snippet.title,
          thumbnail: item.snippet.thumbnails.medium.url,
          videoCount: item.contentDetails.itemCount,
        })),
      );

      // Fetch watch later videos
      const watchLaterResponse = await fetch(
        "https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,contentDetails&playlistId=WL",
        { headers: { Authorization: `Bearer ${token}` } },
      );
      const watchLaterData = await watchLaterResponse.json();
      setWatchLater(
        watchLaterData.items.map((item: any) => ({
          id: item.id,
          title: item.snippet.title,
          thumbnail: item.snippet.thumbnails.medium.url,
        })),
      );

      // Fetch watched videos 
      const watchedVideosResponse = await fetch(
        "https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,contentDetails&playlistId=WATCHED",
        { headers: { Authorization: `Bearer ${token}` } },
      );
      const watchedVideosData = await watchedVideosResponse.json();
      setWatchedVideos(
        watchedVideosData.items.map((item: any) => ({
          id: item.id,
          title: item.snippet.title,
          thumbnail: item.snippet.thumbnails.medium.url,
        })),
      );

      // Fetch liked videos
      const likedVideosResponse = await fetch(
        "https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails&myRating=like",
        { headers: { Authorization: `Bearer ${token}` } },
      );
      const likedVideosData = await likedVideosResponse.json();
      setLikedVideos(
        likedVideosData.items.map((item: any) => ({
          id: item.id,
          title: item.snippet.title,
          thumbnail: item.snippet.thumbnails.medium.url,
        })),
      );
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 p-6 text-white">
      <header className="flex items-center gap-4 p-6">
        {!accessToken ? (
          <button
            onClick={handleGoogleLogin}
            className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
          >
            Đăng nhập với Google
          </button>
        ) : channelInfo ? (
          <>
            <img
              src={channelInfo.avatar}
              alt="Channel Avatar"
              className="h-16 w-16 rounded-full object-cover"
            />
            <div>
              <h1 className="text-2xl font-bold">{channelInfo.title}</h1>
              <p className="text-gray-400">@{channelInfo.customUrl}</p>
              <p className="text-sm text-gray-400">
                {channelInfo.subscribers} người đăng ký
              </p>
            </div>
          </>
        ) : (
          <p>Đang tải dữ liệu kênh...</p>
        )}
      </header>

      {accessToken && !isLoading && (
        <>
          {/* Danh sách phát */}
          <section className="mb-6">
            <h2 className="mb-4 text-xl font-bold">Danh sách phát</h2>
            {playlists.length > 0 ? (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                {playlists.map((playlist) => (
                  <div
                    key={playlist.id}
                    className="rounded-lg bg-gray-800 shadow-lg"
                  >
                    <img
                      src={playlist.thumbnail}
                      alt={playlist.title}
                      className="h-40 w-full rounded-t-lg object-cover"
                    />
                    <div className="p-4">
                      <h3 className="line-clamp-2 text-sm font-semibold">
                        {playlist.title}
                      </h3>
                      <p className="text-xs text-gray-400">
                        {playlist.videoCount} video
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400">Không có danh sách phát nào.</p>
            )}
          </section>

          {/* Xem sau */}
          <section>
            <h2 className="mb-4 text-xl font-bold">Xem sau</h2>
            {watchLater.length > 0 ? (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                {watchLater.map((video) => (
                  <div
                    key={video.id}
                    className="rounded-lg bg-gray-800 shadow-lg"
                  >
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="h-40 w-full rounded-t-lg object-cover"
                    />
                    <div className="p-4">
                      <h3 className="line-clamp-2 text-sm font-semibold">
                        {video.title}
                      </h3>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400">
                Không có video trong danh sách xem sau.
              </p>
            )}
          </section>

          {/* Video đã xem */}
          <section>
            <h2 className="mb-4 text-xl font-bold">Video đã xem</h2>
            {watchedVideos.length > 0 ? (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                {watchedVideos.map((video) => (
                  <div
                    key={video.id}
                    className="rounded-lg bg-gray-800 shadow-lg"
                  >
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="h-40 w-full rounded-t-lg object-cover"
                    />
                    <div className="p-4">
                      <h3 className="line-clamp-2 text-sm font-semibold">
                        {video.title}
                      </h3>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400">
                Không có video đã xem.
              </p>
            )}
          </section>

          {/* Video đã thích */}
          <section>
            <h2 className="mb-4 text-xl font-bold">Video đã thích</h2>
            {likedVideos.length > 0 ? (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                {likedVideos.map((video) => (
                  <div
                    key={video.id}
                    className="rounded-lg bg-gray-800 shadow-lg"
                  >
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="h-40 w-full rounded-t-lg object-cover"
                    />
                    <div className="p-4">
                      <h3 className="line-clamp-2 text-sm font-semibold">
                        {video.title}
                      </h3>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400">
                Không có video đã thích.
              </p>
            )}
          </section>
        </>
      )}
    </div>
  );
};

export default MyChannel;
