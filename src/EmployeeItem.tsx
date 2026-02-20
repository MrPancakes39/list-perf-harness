import { MapPinIcon } from "lucide-react";
import { Avatar } from "./components/Avatar";
import { SoftwareProgressBar } from "./components/SoftwareProgressBar";
import { StarRating } from "./components/StarRating";
import { StatusBadge } from "./components/StatusBadge";
import { TrustworthinessBadge } from "./components/TrustworthinessBadge";
import type { Employee } from "./generate-data";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
});

interface EmployeeItemProps {
  employee: Employee;
  rowNumber: number;
}

export function EmployeeItem({ employee, rowNumber }: EmployeeItemProps) {
  return (
    <div className="flex h-[58px] items-center gap-4 border-b border-border py-0">
      <div className="w-10 shrink-0 text-right text-xs tabular-nums text-muted-foreground">
        {rowNumber}
      </div>
      <div className="flex min-w-0 flex-[1.4] items-center gap-3">
        <Avatar gender={employee.Gender} />
        <span className="truncate font-medium text-foreground">
          {employee.Employees}
        </span>
      </div>
      <div className="min-w-0 flex-[0.75] truncate text-muted-foreground">
        {employee.Designation}
      </div>
      <div className="min-w-0 flex-[0.95] truncate text-xs text-muted-foreground">
        {employee.Mail}
      </div>
      <div className="flex min-w-0 flex-[0.95] items-center gap-1.5 text-muted-foreground">
        <MapPinIcon className="h-4 w-4 shrink-0" />
        <span className="truncate">{employee.Location}</span>
      </div>
      <div className="min-w-0 flex-[0.45]">
        <StatusBadge status={employee.Status}>{employee.Status}</StatusBadge>
      </div>
      <div className="min-w-0 flex-1">
        <TrustworthinessBadge level={employee.Trustworthiness}>
          {employee.Trustworthiness}
        </TrustworthinessBadge>
      </div>
      <div className="min-w-0 flex-1">
        <StarRating rating={employee.Rating} />
      </div>
      <div className="min-w-0 flex-1">
        <SoftwareProgressBar value={employee.Software} />
      </div>
      <div className="min-w-0 flex-1 text-muted-foreground">
        {currencyFormatter.format(employee.CurrentSalary)}
      </div>
      <div className="min-w-0 flex-1 truncate text-xs text-muted-foreground">
        {employee.Address}
      </div>
    </div>
  );
}
