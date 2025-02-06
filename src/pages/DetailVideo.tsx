import { DownloadIcon, EllipsisIcon, ShareIcon } from "@/components/icon";
import { Label } from "@/components/Label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { VideoItem } from "@/components/VideoItem";
import { Categories } from "@/layouts/components/Categories";
import { formatSubscribers } from "@/lib/utils";
import { AvatarImage } from "@radix-ui/react-avatar";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";

const DetailVideo = () => {
  const { videoId } = useParams();

  const {
    data: video,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["video", videoId],
    queryFn: async () => {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/videos?part=snippet,contentDetails,statistics&id=${videoId}&key=${import.meta.env.VITE_API_KEY}`,
      );
      const data = await response.json();
      return data.items[0];
    },
    staleTime: 30 * 60 * 1000,
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (isError) {
    toast.error("Đã xảy ra lỗi khi tải video!");
  }

  if (isLoading) {
    return (
      <div className="mx-5 py-5 xl:mx-20">
        <div className="grid gap-5 lg:grid-cols-[1fr_450px]">
          <div className="">
            <Skeleton className="min-h-[300px] w-full rounded-lg md:min-h-[400px] xl:h-[600px]" />
            <div className="my-4 flex flex-col gap-4">
              <Skeleton className="h-10 w-full" />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="flex flex-col gap-2">
                    <Skeleton className="h-4 w-40" />
                    <Skeleton className="h-2 w-20" />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Skeleton className="h-10 w-20 rounded-full" />
                  <Skeleton className="h-10 w-20 rounded-full" />
                  <Skeleton className="h-10 w-10 rounded-full" />
                </div>
              </div>
              <Skeleton className="h-60 w-full" />
            </div>
          </div>
          <div className="space-y-4">
            <Categories className="categories min-h-fit flex-nowrap overflow-x-auto" />
            {[...Array(5)].map((_, i) => (
              <VideoItem.Skeleton key={i} layout="horizontal" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-5 py-5 xl:mx-20">
      <div className="grid gap-5 lg:grid-cols-[1fr_450px]">
        <div className="">
          <img
            src={video?.snippet.thumbnails.maxres.url}
            alt=""
            className="min-h-[300px] w-full rounded-lg object-cover md:min-h-[400px] xl:h-[600px]"
          />
          <div className="my-4 flex flex-col gap-4">
            <h1 className="text-xl font-medium">{video?.snippet.title}</h1>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={video?.avatar} />
                  <AvatarFallback>N</AvatarFallback>
                </Avatar>
                <div className="">
                  <h1 className="font-medium">{video?.snippet.channelTitle}</h1>
                  <p className="text-xs text-muted-foreground">
                    {video ? formatSubscribers(video?.subscribers) : ""}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Label icon={<ShareIcon />} title="Share" />
                <Label icon={<DownloadIcon />} title="Download" />
                <EllipsisIcon className="icon bg-white/10 hover:bg-white/25" />
              </div>
            </div>
            <div className="rounded-lg bg-white/20 p-3 text-sm">
              Descriptions
            </div>
          </div>
        </div>
        <div className="">
          <Categories className="categories min-h-fit flex-nowrap overflow-x-auto" />
          <div className="my-4 space-y-4"></div>
        </div>
      </div>
    </div>
  );
};

export default DetailVideo;
