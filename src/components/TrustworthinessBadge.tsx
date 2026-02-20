import { Flag as FlagIcon } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "~/lib/utils";

const trustworthinessBadgeVariants = cva("flex items-center gap-1.5", {
  variants: {
    level: {
      Sufficient: "text-blue-600",
      High: "text-green-600",
      Low: "text-red-600",
    },
  },
});

interface TrustworthinessBadgeProps
  extends VariantProps<typeof trustworthinessBadgeVariants> {
  children: React.ReactNode;
  className?: string;
}

export function TrustworthinessBadge({
  level,
  children,
  className,
}: TrustworthinessBadgeProps) {
  return (
    <div className={cn(trustworthinessBadgeVariants({ level }), className)}>
      <FlagIcon className="h-4 w-4 shrink-0" />
      {children}
    </div>
  );
}
