import { cn } from "@/lib/utils";

interface LabelProps {
  className?: string;
  icon: React.ReactNode;
  title: string;
}

export const Label = ({ className, icon, title }: LabelProps) => {
  return (
    <div
      className={cn(
        "flex w-fit items-center gap-2 rounded-full bg-white/10 p-1.5 px-4 transition-colors duration-200 ease-in hover:bg-white/25",
        className,
      )}
    >
      {icon}
      <h1 className="hidden font-medium sm:block">{title}</h1>
    </div>
  );
};
