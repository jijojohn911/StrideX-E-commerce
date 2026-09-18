export type TrendDirection = "up" | "down";

export interface StatItem {
  id: string;
  label: string;
  value: string;
  change: number;
  direction: TrendDirection;
  hint: string;
}

export type RevenueRange = "daily" | "weekly" | "monthly";

export interface RevenuePoint {
  label: string;
  revenue: number;
}

export type PaymentStatus = "paid" | "pending" | "refunded" | "failed";
export type OrderStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled" | "confirmed";

export interface OrderRow {
  id: string;
  customer: string;
  email: string;
  date: string;
  items: number;
  amount: number;
  payment: PaymentStatus;
  status: OrderStatus;
}

export interface TopProduct {
  id: string;
  name: string;
  brand: string;
  unitsSold: number;
  revenue: number;
  initials: string;
}

export type StockStatus = "in-stock" | "low-stock" | "out-of-stock";

export interface StockItem {
  id: string;
  name: string;
  size: string;
  stock: number;
  status: StockStatus;
}

export interface DashboardData {
  stats: StatItem[];
  revenueSeries: Record<RevenueRange, RevenuePoint[]>;
  revenueSummary: Record<RevenueRange, { total: string; change: number; caption: string }>;
  recentOrders: OrderRow[];
  topProducts: TopProduct[];
  lowStockItems: StockItem[];
}