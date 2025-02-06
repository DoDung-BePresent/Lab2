import { cn } from "@/lib/utils";
import { YoutubeIcon } from "./icon";

export const NotFound = ({ className }: { className?: string }) => {
  return (
    <div
      className={cn(
        "flex h-[calc(100vh-56px)] w-full items-center justify-center gap-2",
        className,
      )}
    >
      <YoutubeIcon />
      <h1 className="border-l-2 p-4 text-4xl font-medium">Not Found</h1>
    </div>
  );
};
