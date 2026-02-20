import { cva } from "class-variance-authority";
import { cn } from "../utils";

const barVariants = cva("h-full rounded-full", {
  variants: {
    level: {
      high: "bg-green-500",
      low: "bg-red-500",
    },
  },
});

interface SoftwareProgressBarProps {
  value: number;
  className?: string;
}

export function SoftwareProgressBar({
  value,
  className,
}: SoftwareProgressBarProps) {
  const level = value >= 50 ? "high" : "low";

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="h-2 w-20 overflow-hidden rounded-full bg-gray-200">
        <div
          className={barVariants({ level })}
          style={{ width: `${value}%` }}
        />
      </div>
      <span className="text-xs text-gray-600">{value}%</span>
    </div>
  );
}
