"use client";

import { useEffect, useState } from "react";
import { DashboardStats } from "@/component/admin/dashboard/DashboardStats";
import { RevenueChart } from "@/component/admin/dashboard/RevenueChart";
import { RecentOrders } from "@/component/admin/dashboard/RecentOrders";
import { TopProducts } from "@/component/admin/dashboard/TopProducts";
import { LowStockProducts } from "@/component/admin/dashboard/LowStockProducts";
import type { DashboardData } from "@/types/admin-dashboard";

export default function AdminDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/admin/dashboard", { credentials: "include" });
        const json = await res.json();
        if (!res.ok || !json.success) {
          setError(json.message || "Failed to load dashboard");
          return;
        }
        setData(json);
      } catch (err) {
        console.error(err);
        setError("Network error");
      }
    }
    load();
  }, []);

  if (error) {
    return <p className="px-5 py-6 text-sm text-destructive">{error}</p>;
  }

  if (!data) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-ink" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <DashboardStats stats={data.stats} />
      <RevenueChart revenueSeries={data.revenueSeries} revenueSummary={data.revenueSummary} />
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <RecentOrders orders={data.recentOrders} />
        </div>
        <div className="space-y-6">
          <TopProducts products={data.topProducts} />
          <LowStockProducts items={data.lowStockItems} />
        </div>
      </div>
    </div>
  );
}