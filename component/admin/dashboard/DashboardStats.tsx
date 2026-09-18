import { IndianRupee, Package, ShoppingBag, Users } from "lucide-react";
import type { StatItem } from "@/types/admin-dashboard";
import { StatCard } from "./StatCard";

const icons = {
  revenue: IndianRupee,
  orders: ShoppingBag,
  customers: Users,
  products: Package,
} as const;

export function DashboardStats({ stats }: { stats: StatItem[] }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => (
        <StatCard
          key={stat.id}
          stat={stat}
          icon={icons[stat.id as keyof typeof icons] ?? IndianRupee}
        />
      ))}
    </div>
  );
}