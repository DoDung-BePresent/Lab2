import { AlignJustifyIcon, YoutubeIcon } from "@/components/icon";
import {
  Sheet,
  SheetContent,
  SheetPrimitive,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Sidebar } from "./Sidebar";
import { Link } from "react-router-dom";

export const MobileSidebar = () => {
  return (
    <Sheet>
      <SheetTrigger>
        <AlignJustifyIcon className="icon" />
      </SheetTrigger>
      <SheetContent className="w-60 border-none p-0" side="left">
        <div className="mx-5 my-2 flex items-center gap-4">
          <SheetPrimitive.Close>
            <AlignJustifyIcon className="icon" />
          </SheetPrimitive.Close>
          <Link to="/">
            <YoutubeIcon />
          </Link>
        </div>
        <Sidebar className="top-0 h-full" />
      </SheetContent>
    </Sheet>
  );
};
