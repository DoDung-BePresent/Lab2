import PlaylistItem from "@/components/PlaylistItem";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

const Playlists = () => {
  const {
    data: playlists,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["playlists"],
    queryFn: async () => {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/playlists?part=snippet%2CcontentDetails&channelId=UCW_4e6sUTMWHxlF06aErH9w&maxResults=25&key=${import.meta.env.VITE_API_KEY}`,
      );
      const data = await response.json();
      return data;
    },
    staleTime: 30 * 60 * 1000,
  });

  if (isError) {
    toast.error("Đã xảy ra lỗi khi tải danh sách phát!");
  }

  if (isLoading) {
    return <p>Loading</p>;
  }
  
  return (
    <div className="p-6">
      <h1 className="mb-6 text-2xl font-bold text-white">Danh sách phát</h1>
      <div className="grid grid-cols-1 gap-4 gap-y-10 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {playlists.items.map((playlist: any) => (
          <PlaylistItem
            key={playlist.id}
            id={playlist.id}
            title={playlist.snippet.title}
            channelTitle={playlist.snippet.channelTitle}
            thumbnails={
              playlist.snippet.thumbnails?.maxres?.url ||
              playlist.snippet.thumbnails?.default?.url
            }
            videoCount={playlist.contentDetails.itemCount}
          />
        ))}
      </div>
    </div>
  );
};

export default Playlists;
