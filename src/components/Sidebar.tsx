import { Link } from "react-router-dom";

import { cn } from "@/lib/utils";

interface SidebarItemProps {
  title: string;
  url: string;
  icon: React.ReactNode;
  className?: string;
}

interface SidebarGroupProps {
  className?: string;
  children: React.ReactNode;
}

const SidebarGroup = ({ children, className }: SidebarGroupProps) => {
  return (
    <div className={cn("border-b border-white/20 py-3", className)}>
      {children}
    </div>
  );
};

const SidebarItem = ({ title, url, icon, className }: SidebarItemProps) => {
  return (
    <Link
      to={url}
      className={cn(
        "flex items-center gap-4 rounded-lg p-2 text-sm hover:bg-white/20",
        className,
      )}
    >
      {icon}
      <h1>{title}</h1>
    </Link>
  );
};

export { SidebarGroup, SidebarItem };
