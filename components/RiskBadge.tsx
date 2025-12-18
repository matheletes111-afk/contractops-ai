// Color-coded risk badge component
import { RiskLevel } from "@/types/contract";

interface RiskBadgeProps {
  risk: RiskLevel | "Unknown";
  size?: "sm" | "md" | "lg";
}

export default function RiskBadge({ risk, size = "md" }: RiskBadgeProps) {
  const sizeClasses = {
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-1.5 text-sm",
    lg: "px-4 py-2 text-base",
  };

  const colorClasses = {
    Low: "bg-green-100 text-green-800 border-green-200",
    Medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
    High: "bg-red-100 text-red-800 border-red-200",
    Unknown: "bg-gray-100 text-gray-800 border-gray-200",
  };

  return (
    <span
      className={`inline-flex items-center font-semibold rounded-md border ${sizeClasses[size]} ${colorClasses[risk]}`}
    >
      {risk} Risk
    </span>
  );
}

