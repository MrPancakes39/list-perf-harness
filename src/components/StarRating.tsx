import { Star as StarIcon } from "lucide-react";
import { cva } from "class-variance-authority";
import { cn } from "../utils";

const starVariants = cva("h-4 w-4", {
  variants: {
    filled: {
      true: "fill-amber-400 text-amber-400",
      false: "text-gray-300",
    },
  },
});

interface StarRatingProps {
  rating: number;
  className?: string;
}

export function StarRating({ rating, className }: StarRatingProps) {
  return (
    <div className={cn("flex gap-0.5", className)}>
      {[1, 2, 3, 4, 5].map((i) => (
        <StarIcon key={i} className={starVariants({ filled: i <= rating })} />
      ))}
    </div>
  );
}
