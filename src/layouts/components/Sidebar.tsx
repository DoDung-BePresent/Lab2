import {
  ChannelsIcon,
  ClockIcon,
  CourseIcon,
  FlagIcon,
  HelpIcon,
  HistoryIcon,
  HomeIcon,
  LikeIcon,
  MyChannelIcon,
  PlaylistIcon,
  ReportIcon,
  SettingIcon,
  ShortVideoIcon,
  VideoIcon,
} from "@/components/icon";
import { SidebarGroup, SidebarItem } from "@/components/Sidebar";
import { cn } from "@/lib/utils";

const mainNav = {
  home: [
    {
      title: "Trang chủ",
      url: "/",
      icon: HomeIcon,
    },
    {
      title: "Shorts",
      url: "#",
      icon: ShortVideoIcon,
    },
    {
      title: "Kênh đăng ký",
      url: "#",
      icon: ChannelsIcon,
    },
  ],
  activity: [
    {
      title: "Kênh của bạn",
      url: "#",
      icon: MyChannelIcon,
    },
    {
      title: "Video đã xem",
      url: "#",
      icon: HistoryIcon,
    },
    {
      title: "Danh sách phát",
      url: "/feed/playlists",
      icon: PlaylistIcon,
    },
    {
      title: "Video của bạn",
      url: "#",
      icon: VideoIcon,
    },
    {
      title: "Khóa học của bạn",
      url: "#",
      icon: CourseIcon,
    },
    {
      title: "Xem sau",
      url: "/watch-later",
      icon: ClockIcon,
    },
    {
      title: "Video đã thích",
      url: "/liked-videos",
      icon: LikeIcon,
    },
  ],
  action: [
    {
      title: "Cài đặt",
      url: "#",
      icon: SettingIcon,
    },
    {
      title: "Nhật ký báo cáo",
      url: "#",
      icon: FlagIcon,
    },
    {
      title: "Trợ giúp",
      url: "#",
      icon: HelpIcon,
    },
    {
      title: "Gửi ý kiến phản hồi",
      url: "#",
      icon: ReportIcon,
    },
  ],
};

interface SidebarProps {
  className?: string;
}

export const Sidebar = ({ className }: SidebarProps) => {
  return (
    <div
      className={cn(
        "sidebar sticky top-[56px] h-[calc(100vh-56px)] overflow-y-auto bg-background",
        className,
      )}
    >
      <div className="mx-5">
        <SidebarGroup>
          {mainNav.home.map((item) => (
            <SidebarItem
              key={item.title}
              title={item.title}
              url={item.url}
              icon={<item.icon />}
            />
          ))}
        </SidebarGroup>
        <SidebarGroup>
          {mainNav.activity.map((item) => (
            <SidebarItem
              key={item.title}
              title={item.title}
              url={item.url}
              icon={<item.icon />}
            />
          ))}
        </SidebarGroup>
        <SidebarGroup>
          {mainNav.action.map((item) => (
            <SidebarItem
              key={item.title}
              title={item.title}
              url={item.url}
              icon={<item.icon />}
            />
          ))}
        </SidebarGroup>
        <p className="my-2 text-center text-xs text-muted-foreground">
          &#169; 2025 Google LLC{" "}
        </p>
      </div>
    </div>
  );
};
