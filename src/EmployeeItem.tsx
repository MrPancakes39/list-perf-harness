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
}

export function EmployeeItem({ employee }: EmployeeItemProps) {
  return (
    <div className="flex items-center gap-4 border-b border-gray-200 py-3">
      <div className="flex min-w-0 shrink-0 items-center gap-3">
        <Avatar gender={employee.Gender} />
        <span className="font-medium text-gray-900">{employee.Employees}</span>
      </div>
      <div className="shrink-0 text-gray-600">{employee.Designation}</div>
      <div className="min-w-0 shrink text-gray-600">{employee.Mail}</div>
      <div className="flex shrink-0 items-center gap-1.5 text-gray-600">
        <MapPinIcon className="h-4 w-4 shrink-0" />
        {employee.Location}
      </div>
      <div className="shrink-0">
        <StatusBadge status={employee.Status}>{employee.Status}</StatusBadge>
      </div>
      <TrustworthinessBadge level={employee.Trustworthiness}>
        {employee.Trustworthiness}
      </TrustworthinessBadge>
      <div className="shrink-0">
        <StarRating rating={employee.Rating} />
      </div>
      <div className="shrink-0">
        <SoftwareProgressBar value={employee.Software} />
      </div>
      <div className="shrink-0 text-gray-600">
        {currencyFormatter.format(employee.CurrentSalary)}
      </div>
      <div className="min-w-0 shrink text-gray-600">{employee.Address}</div>
    </div>
  );
}
