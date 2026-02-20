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
    <div className="flex h-[58px] items-center gap-4 border-b border-gray-200 py-0">
      <div className="w-10 shrink-0 text-right text-xs tabular-nums text-gray-400">
        {rowNumber}
      </div>
      <div className="flex min-w-0 flex-[1.4] items-center gap-3">
        <Avatar gender={employee.Gender} />
        <span className="truncate font-medium text-gray-900">
          {employee.Employees}
        </span>
      </div>
      <div className="min-w-0 flex-[0.75] truncate text-gray-600">
        {employee.Designation}
      </div>
      <div className="min-w-0 flex-[0.95] truncate text-xs text-gray-600">
        {employee.Mail}
      </div>
      <div className="flex min-w-0 flex-[0.95] items-center gap-1.5 text-gray-600">
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
      <div className="min-w-0 flex-1 text-gray-600">
        {currencyFormatter.format(employee.CurrentSalary)}
      </div>
      <div className="min-w-0 flex-1 truncate text-xs text-gray-600">
        {employee.Address}
      </div>
    </div>
  );
}
