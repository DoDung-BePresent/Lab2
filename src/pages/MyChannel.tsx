import React from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";

// Interface cho dữ liệu playlist
interface Playlist {
  id: string;
  title: string;
  thumbnail: string;
  videoCount: number;
  isPrivate: boolean;
}

// Component chính
const MyChannel: React.FC = () => {
  const { data: playlists, isLoading } = useQuery<Playlist[]>({
    queryKey: ["playlists"],
    queryFn: async () => {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/playlists`);
      if (!response.ok) throw new Error("Failed to fetch playlists");
      return response.json();
    },
    staleTime: 15 * 60 * 1000,
  });

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header hiển thị thông tin kênh */}
      <header className="flex items-center gap-4 border-b border-gray-700 p-6">
        <img
          className="h-16 w-16 rounded-full object-cover"
          src="https://trunganhmedia.com/wp-content/uploads/2021/07/logo-Youtube-PNG.png"
          alt="Profile"
        />
        <div>
          <h1 className="text-2xl font-bold">Vĩnh Hưng Giao (toi ga ac)</h1>
          <p className="text-gray-400">@vinhhunggiao5362 - Xem kênh</p>
          <Link to="#" className="text-blue-400">
            Xem thêm
          </Link>
        </div>
      </header>

      {/* Danh sách phát */}
      <section className="p-6">
        <h2 className="mb-4 text-xl font-bold">Danh sách phát</h2>
        {isLoading ? (
          <Skeleton className="h-40 w-full" />
        ) : (
          <div className="flex gap-4 overflow-x-auto">
            {playlists?.map((playlist) => (
              <div
                key={playlist.id}
                className="min-w-[200px] rounded-lg bg-gray-800 shadow-lg"
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
                    {playlist.isPrivate ? "Riêng tư" : "Công khai"} •{" "}
                    {playlist.videoCount} video
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default MyChannel;
