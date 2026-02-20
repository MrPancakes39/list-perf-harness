import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "~/lib/utils";

const statusBadgeVariants = cva(
  "inline-flex rounded-full px-2 py-0.5 text-xs font-medium text-center",
  {
    variants: {
      status: {
        Active: "bg-green-100 text-green-800",
        Inactive: "bg-red-100 text-red-800",
        "On Leave": "bg-amber-100 text-amber-800 text-[10px]",
      },
    },
  }
);

interface StatusBadgeProps extends VariantProps<typeof statusBadgeVariants> {
  children: React.ReactNode;
  className?: string;
}

export function StatusBadge({ status, children, className }: StatusBadgeProps) {
  return (
    <span className={cn(statusBadgeVariants({ status }), className)}>
      {children}
    </span>
  );
}
