import { cn } from "@/lib/utils";

export const YoutubeIcon = ({ className }: { className?: string }) => {
  return (
    <div className={cn("flex items-center gap-1", className)}>
      <img src="/youtube-logo.svg" alt="Logo youtube" className="h-7" />
      <span className="text-lg font-medium">Youtube</span>
    </div>
  );
};
