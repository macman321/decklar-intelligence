import { Badge } from "@/components/ui/badge";

interface HealthBadgeProps {
  status: string;
  size?: "sm" | "md" | "lg";
}

const styles: Record<string, string> = {
  green: "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-50",
  amber: "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-50",
  red: "bg-red-50 text-red-700 border-red-200 hover:bg-red-50",
};

const labels: Record<string, string> = {
  green: "Healthy",
  amber: "At Risk",
  red: "Critical",
};

export function HealthBadge({ status, size = "sm" }: HealthBadgeProps) {
  const key = status?.toLowerCase() || "green";
  const className = styles[key] || styles.green;
  const label = labels[key] || status;

  return (
    <Badge variant="outline" className={`${className} font-medium`}>
      <span className={`mr-1.5 inline-block rounded-full ${size === "sm" ? "h-1.5 w-1.5" : "h-2 w-2"} ${key === "green" ? "bg-emerald-500" : key === "amber" ? "bg-amber-500" : "bg-red-500"}`} />
      {label}
    </Badge>
  );
}
