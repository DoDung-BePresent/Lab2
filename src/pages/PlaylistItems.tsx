import { EllipsisIcon, SaveIcon, ShareIcon } from "@/components/icon";
import { useQuery } from "@tanstack/react-query";
import { Play } from "lucide-react";
import moment from "moment";
import { useParams } from "react-router-dom";
import { toast } from "sonner";

const PlaylistItems = () => {
  const { playlistId } = useParams();
  const {
    data: playlistItems,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["playlists"],
    queryFn: async () => {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/playlistItems?part=snippet%2CcontentDetails&playlistId=${playlistId}&maxResults=25&key=${import.meta.env.VITE_API_KEY}`,
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
      <div className="flex gap-2">
        <div className="flex w-96 flex-col gap-2 rounded-2xl bg-gradient-to-b from-slate-100/40 to-slate-100/10 p-6">
          <img
            src={
              playlistItems.items[0].snippet.thumbnails.maxres.url ||
              playlistItems.items[0].snippet.thumbnails.default.url
            }
            alt=""
            className="h-48 rounded-md object-cover"
          />
          <h1 className="text-3xl font-bold">
            {playlistItems.items[0].snippet.title.length > 50
              ? playlistItems.items[0].snippet.title.slice(0, 47) + "..."
              : playlistItems.items[0].snippet.title}
          </h1>
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium">
              {playlistItems.items[0].snippet.channelTitle}
            </span>
          </div>
          <div className="flex items-center gap-1 text-xs">
            <span>Danh sách phát</span>
            <span>•</span>
            <span>{playlistItems.items.length} video</span>
          </div>
          <div className="mt-5 flex items-center gap-3">
            <button className="flex items-center gap-2 rounded-3xl bg-white p-2 px-8 text-black">
              <Play className="h-4 w-4 text-black" />
              <span className="text-sm font-medium">Phát tất cả</span>
            </button>
            <SaveIcon className="icon bg-gray-300/30" />
            <ShareIcon className="icon bg-gray-300/30" />
            <EllipsisIcon className="icon bg-gray-300/30" />
          </div>
        </div>
        <div className="flex-1">
          {playlistItems.items.map((item: any, index: number) => (
            <div key={item.id} className="flex rounded-md p-2 hover:bg-muted">
              <span className="my-auto flex h-8 w-8 items-center justify-center">
                {index + 1}
              </span>
              <div className="flex gap-2">
                <img
                  src={
                    item.snippet.thumbnails.maxres.url ||
                    item.snippet.thumbnails.default.url
                  }
                  alt=""
                  className="h-28 rounded-md object-cover"
                />
                <div className="flex-1 space-y-2">
                  <h1 className="font-medium">{item.snippet.title}</h1>
                  <div className="text-muted-foreground">
                    <div className="flex items-center gap-1 text-xs">
                      <span>{item.snippet.channelTitle}</span>
                      <span>•</span>
                      <span>
                        {moment(item.contentDetails.videoPublishedAt).fromNow()}
                      </span>
                    </div>
                  </div>
                </div>
                <EllipsisIcon className="icon" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PlaylistItems;
