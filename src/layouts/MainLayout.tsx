import { Outlet, useLocation } from "react-router-dom";
import { useLocalStorage, useMediaQuery } from "usehooks-ts";

import { Header } from "./components/Header";
import { Sidebar } from "./components/Sidebar";
import { SmallSidebar } from "./components/SmallSidebar";

import { cn } from "@/lib/utils";
import { useEffect } from "react";

const MainLayout = () => {
  const [isOpen, setIsOpen] = useLocalStorage("sidebar-open", true);
  const isMediumScreen = useMediaQuery("(max-width: 1024px)");
  const isSmallScreen = useMediaQuery("(max-width: 640px)");
  const { pathname } = useLocation();

  const isWatchPage = pathname.split("/")[1] === "watch";

  const toggleSidebar = () => {
    setIsOpen((prev) => !prev);
  };

  useEffect(() => {
    isMediumScreen ? setIsOpen(false) : setIsOpen(true);
  }, [isMediumScreen]);

  return (
    <main className="min-h-screen">
      <Header onClick={toggleSidebar} />
      <div
        className={cn("min-h-screen transition-all duration-150 ease-out", {
          "grid grid-cols-[250px_1fr]":
            isOpen && !isSmallScreen && !isWatchPage,
          "grid grid-cols-[120px_1fr]":
            !isOpen && !isSmallScreen && !isWatchPage,
        })}
      >
        {!isSmallScreen &&
          !isWatchPage &&
          (isOpen ? <Sidebar /> : <SmallSidebar />)}
        <div className="">
          <Outlet />
        </div>
      </div>
    </main>
  );
};

export default MainLayout;
