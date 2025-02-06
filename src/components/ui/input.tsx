import * as React from "react";

import { cn } from "@/lib/utils";
import { Keyboard } from "lucide-react";
import { SearchIcon } from "@/components/icon";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <div
        className={cn(
          "bg-[hsl(0, 0%, 7%)] flex w-full items-center rounded-full border border-white/20 pl-5 focus-within:border-blue-400",
          className,
        )}
      >
        <input
          className="mr-5 w-full border-none bg-transparent outline-none placeholder:text-white/40"
          type={type}
          ref={ref}
          {...props}
        />
        <Keyboard className="mr-3" />
        <div className="cursor-pointer rounded-r-full border-l border-white/20 bg-white/10 p-[7px] px-5">
          <SearchIcon />
        </div>
      </div>
    );
  },
);
Input.displayName = "Input";

export { Input };
