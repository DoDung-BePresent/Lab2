export interface Video {
  id: string;
  channelId: string;
  thumbnail: string;
  avatar: string;
  title: string;
  channelTitle: string;
  viewCount: number;
  duration: string;
  publishedAt: string;
  subscribers: number;
  relatedVideos: {
    id: string;
    channelId: string;
    thumbnail: string;
    avatar: string;
    title: string;
    channelTitle: string;
    viewCount: number;
    duration: string;
    publishedAt: string;
    subscribers: number;
  }[];
}
