import { Link, useSearchParams } from "react-router-dom";

import { cn } from "@/lib/utils";
import { categories } from "@/constants";

interface CategoriesProps {
  className?: string;
}

export const Categories = ({ className }: CategoriesProps) => {
  const [searchParams] = useSearchParams();
  const currentCategory = searchParams.get("category") || "";

  return (
    <div className={cn("flex min-h-14 items-center gap-3", className)}>
      {categories.map((category) => (
        <Link
          className={cn("category", {
            "bg-white text-black":
              category.categoryId === currentCategory ||
              (category.categoryId === "" && currentCategory === ""),
          })}
          key={category.title}
          to={category.url}
        >
          {category.title}
        </Link>
      ))}
    </div>
  );
};
