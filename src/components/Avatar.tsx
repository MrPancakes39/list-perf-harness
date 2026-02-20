import { User as UserIcon } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../utils";

const avatarVariants = cva(
  "flex h-9 w-9 shrink-0 items-center justify-center rounded-full",
  {
    variants: {
      gender: {
        Man: "bg-blue-500",
        Woman: "bg-fuchsia-500",
        "Non-Binary": "bg-purple-500",
      },
    },
  }
);

interface AvatarProps extends VariantProps<typeof avatarVariants> {
  className?: string;
}

export function Avatar({ gender, className }: AvatarProps) {
  return (
    <div className={cn(avatarVariants({ gender }), className)}>
      <UserIcon className="h-5 w-5 text-white" />
    </div>
  );
}
