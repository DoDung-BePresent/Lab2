import { Link, useLocation } from "react-router-dom";
import { useMediaQuery } from "usehooks-ts";

import {
  AlignJustifyIcon,
  BellIcon,
  CameraIcon,
  YoutubeIcon,
} from "@/components/icon";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MobileSidebar } from "./MobileSidebar";
import { SearchBar } from "@/components/SearchBar";

interface HeaderProps {
  onClick: () => void;
}

export const Header = ({ onClick }: HeaderProps) => {
  const isSmallScreen = useMediaQuery("(max-width: 640px)");

  const { pathname } = useLocation();

  const isWatchPage = pathname.split("/")[1] === "watch";

  return (
    <header className="sticky top-0 z-50 flex h-14 items-center justify-between bg-background px-4">
      <div className="flex items-center gap-4">
        {isSmallScreen || isWatchPage ? (
          <MobileSidebar />
        ) : (
          <div onClick={onClick}>
            <AlignJustifyIcon className="icon" />
          </div>
        )}
        <Link to="/">
          <YoutubeIcon />
        </Link>
      </div>

      <div className="hidden md:block md:min-w-[300px] lg:min-w-[500px]">
        <SearchBar />
      </div>

      <div className="flex items-center gap-2">
        <CameraIcon className="icon" />
        <Badge count={100}>
          <BellIcon className="icon" />
        </Badge>
        <Avatar className="ml-2 cursor-pointer">
          <AvatarImage src="https://lh3.googleusercontent.com/a/ACg8ocI-ANweFu2tNdY8eqic_0tC1CQ9FrhBaQQNcxVldQki6KQ63yKS=s360-c-no" />
          <AvatarFallback>D</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
};
