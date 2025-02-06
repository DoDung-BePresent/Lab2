import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode | JSX.Element;
  count: number;
}

export const Badge = ({ children, count }: BadgeProps) => {
  return (
    <div className="relative">
      {children}
      {count > 0 && (
        <div
          className={cn(
            "absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-700 p-1 text-xs text-white",
            {
              "right-0 w-fit px-1": count > 9,
            },
          )}
        >
          {count > 9 ? `${9}+` : count}
        </div>
      )}
    </div>
  );
};
