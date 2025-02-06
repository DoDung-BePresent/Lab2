import {
  ChannelsIcon,
  HomeIcon,
  ProfileIcon,
  ShortVideoIcon,
} from "@/components/icon";
import { SidebarGroup, SidebarItem } from "@/components/Sidebar";

const mainNav = [
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
  {
    title: "Bạn",
    url: "#",
    icon: ProfileIcon,
  },
];

export const SmallSidebar = () => {
  return (
    <div className="sidebar sticky top-[56px] h-[calc(100vh-56px)] overflow-y-auto bg-background">
      <div className="mx-2">
        <SidebarGroup className="border-none">
          {mainNav.map((item) => (
            <SidebarItem
              key={item.title}
              className="flex-col gap-2 text-center text-xs"
              title={item.title}
              url={item.url}
              icon={<item.icon />}
            />
          ))}
        </SidebarGroup>
      </div>
    </div>
  );
};
