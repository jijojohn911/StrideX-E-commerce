import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { getAuthUser } from "@/lib/auth";
import Order from "@/models/Order";
import Product from "@/models/Product";
import User from "@/models/User";




// Add these types near the top of the file, below the imports
interface PopulatedUser {
  _id: string;
  username?: string;
  email?: string;
}

interface OrderItemDoc {
  product: string;
  title: string;
  size?: string;
  color?: string;
  quantity: number;
  price: number;
}

interface OrderLean {
  _id: string;
  orderNumber: string;
  user: PopulatedUser | null;
  items: OrderItemDoc[];
  shippingAddress?: { fullName?: string };
  totalAmount: number;
  payment?: { status: string };
  orderStatus: string;
  createdAt: Date;
}

interface ProductLean {
  _id: string;
  title: string;
  brand: string;
  stock: number;
}

interface TopProductAgg {
  _id: string;
  title: string;
  unitsSold: number;
  revenue: number;
}

type RevenueRange = "daily" | "weekly" | "monthly";

const inr = (n: number) =>
  `₹${new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(n)}`;

function pctChange(current: number, prior: number) {
  if (prior === 0) return current > 0 ? 100 : 0;
  return Math.round(((current - prior) / prior) * 1000) / 10;
}

function startOfDay(d: Date) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

export const GET = async (req: NextRequest) => {
  try {
    const authUser = getAuthUser(req);
    if (authUser?.role !== "admin") {
      return NextResponse.json(
        { success: false, message: authUser ? "Forbidden" : "Unauthorized" },
        { status: authUser ? 403 : 401 },
      );
    }

    await connectDB();

    const now = new Date();
    const today = startOfDay(now);
    const start30 = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const start60 = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const start180 = new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000);

    // ---------- Stats ----------
    const [
      revLast30, revPrior30, ordersLast30, ordersPrior30,
      customersLast30, customersPrior30, totalCustomers,
      totalProducts, productsThisMonth, totalRevenueAgg, totalOrders,
    ] = await Promise.all([
      Order.aggregate([
        { $match: { createdAt: { $gte: start30 }, orderStatus: { $ne: "cancelled" } } },
        { $group: { _id: null, total: { $sum: "$totalAmount" } } },
      ]),
      Order.aggregate([
        { $match: { createdAt: { $gte: start60, $lt: start30 }, orderStatus: { $ne: "cancelled" } } },
        { $group: { _id: null, total: { $sum: "$totalAmount" } } },
      ]),
      Order.countDocuments({ createdAt: { $gte: start30 } }),
      Order.countDocuments({ createdAt: { $gte: start60, $lt: start30 } }),
      User.countDocuments({ role: "user", createdAt: { $gte: start30 } }),
      User.countDocuments({ role: "user", createdAt: { $gte: start60, $lt: start30 } }),
      User.countDocuments({ role: "user" }),
      Product.countDocuments({ isActive: true }),
      Product.countDocuments({ createdAt: { $gte: startOfMonth } }),
      Order.aggregate([
        { $match: { orderStatus: { $ne: "cancelled" } } },
        { $group: { _id: null, total: { $sum: "$totalAmount" } } },
      ]),
      Order.countDocuments({}),
    ]);

    const revenue30 = revLast30[0]?.total ?? 0;
    const revenuePrior30 = revPrior30[0]?.total ?? 0;
    const revenueChange = pctChange(revenue30, revenuePrior30);
    const ordersChange = pctChange(ordersLast30, ordersPrior30);
    const customersChange = pctChange(customersLast30, customersPrior30);
    const totalRevenue = totalRevenueAgg[0]?.total ?? 0;

    const stats = [
      { id: "revenue", label: "Total Revenue", value: inr(totalRevenue),
        change: Math.abs(revenueChange), direction: revenueChange >= 0 ? "up" : "down",
        hint: "vs last 30 days" },
      { id: "orders", label: "Total Orders", value: totalOrders.toLocaleString("en-IN"),
        change: Math.abs(ordersChange), direction: ordersChange >= 0 ? "up" : "down",
        hint: "vs last 30 days" },
      { id: "customers", label: "Total Customers", value: totalCustomers.toLocaleString("en-IN"),
        change: Math.abs(customersChange), direction: customersChange >= 0 ? "up" : "down",
        hint: "vs last 30 days" },
      { id: "products", label: "Total Products", value: totalProducts.toLocaleString("en-IN"),
        change: 0, direction: "up", hint: `${productsThisMonth} added this month` },
    ];

    // ---------- Revenue series (bucketed in JS from one 180-day query) ----------
 const recentRevenueOrders = await Order.find({
  createdAt: { $gte: start180 },
  orderStatus: { $ne: "cancelled" },
})
  .select("totalAmount createdAt")
  .lean<{ totalAmount: number; createdAt: Date }[]>();

    const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const monthLabels = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

    const dayBuckets = Array.from({ length: 7 }).map((_, i) => {
      const date = new Date(today);
      date.setDate(date.getDate() - (6 - i));
      return { start: date, end: new Date(date.getTime() + 86400000) };
    });
    const daily = dayBuckets.map((b) => ({
      label: dayLabels[b.start.getDay()],
      revenue: recentRevenueOrders.filter((o) => o.createdAt >= b.start && o.createdAt < b.end)
        .reduce((sum, o) => sum + o.totalAmount, 0),
    }));

    const weekBuckets = Array.from({ length: 6 }).map((_, i) => {
      const end = new Date(today.getTime() - (5 - i) * 7 * 86400000);
      const start = new Date(end.getTime() - 7 * 86400000);
      return { start, end };
    });
    const weekly = weekBuckets.map((b, i) => ({
      label: `W${i + 1}`,
      revenue: recentRevenueOrders.filter((o) => o.createdAt >= b.start && o.createdAt < b.end)
        .reduce((sum, o) => sum + o.totalAmount, 0),
    }));

    const monthBuckets = Array.from({ length: 6 }).map((_, i) => {
      const start = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
      const end = new Date(now.getFullYear(), now.getMonth() - (5 - i) + 1, 1);
      return { start, end };
    });
    const monthly = monthBuckets.map((b) => ({
      label: monthLabels[b.start.getMonth()],
      revenue: recentRevenueOrders.filter((o) => o.createdAt >= b.start && o.createdAt < b.end)
        .reduce((sum, o) => sum + o.totalAmount, 0),
    }));

    const revenueSeries: Record<RevenueRange, { label: string; revenue: number }[]> = { daily, weekly, monthly };
    const sumRange = (arr: { revenue: number }[]) => arr.reduce((s, p) => s + p.revenue, 0);

    const dailyPriorSum = recentRevenueOrders.filter((o) =>
      o.createdAt >= new Date(dayBuckets[0].start.getTime() - 7 * 86400000) && o.createdAt < dayBuckets[0].start
    ).reduce((s, o) => s + o.totalAmount, 0);
    const weeklyPriorSum = recentRevenueOrders.filter((o) =>
      o.createdAt >= new Date(weekBuckets[0].start.getTime() - 6 * 7 * 86400000) && o.createdAt < weekBuckets[0].start
    ).reduce((s, o) => s + o.totalAmount, 0);
    const monthlyPriorSum = recentRevenueOrders.filter((o) =>
      o.createdAt >= new Date(monthBuckets[0].start.getFullYear(), monthBuckets[0].start.getMonth() - 6, 1) && o.createdAt < monthBuckets[0].start
    ).reduce((s, o) => s + o.totalAmount, 0);

    const revenueSummary: Record<RevenueRange, { total: string; change: number; caption: string }> = {
      daily: { total: inr(sumRange(daily)), change: pctChange(sumRange(daily), dailyPriorSum), caption: "Last 7 days" },
      weekly: { total: inr(sumRange(weekly)), change: pctChange(sumRange(weekly), weeklyPriorSum), caption: "Last 6 weeks" },
      monthly: { total: inr(sumRange(monthly)), change: pctChange(sumRange(monthly), monthlyPriorSum), caption: "Last 6 months" },
    };

    // ---------- Recent orders ----------
    const recentOrdersRaw = await Order.find({})
      .sort({ createdAt: -1 })
      .limit(5)
      .populate<{ user: PopulatedUser | null }>("user", "username email")
      .lean<OrderLean[]>();

    const recentOrders = recentOrdersRaw.map((o) => ({
      id: o.orderNumber,
      customer: o.user?.username || o.shippingAddress?.fullName || "Unknown",
      email: o.user?.email || "",
      date: new Date(o.createdAt).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      items: o.items.reduce((s, it) => s + it.quantity, 0),
      amount: o.totalAmount,
      payment: o.payment?.status ?? "pending",
      status: o.orderStatus,
    }));

    // ---------- Top products (this calendar month) ----------
    const topAgg = await Order.aggregate<TopProductAgg>([
      { $match: { createdAt: { $gte: startOfMonth }, orderStatus: { $ne: "cancelled" } } },
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.product",
          title: { $first: "$items.title" },
          unitsSold: { $sum: "$items.quantity" },
          revenue: { $sum: { $multiply: ["$items.price", "$items.quantity"] } },
        },
      },
      { $sort: { unitsSold: -1 } },
      { $limit: 5 },
    ]);

    const topProductIds = topAgg.map((p) => p._id).filter(Boolean);
    const topProductDocs = await Product.find({ _id: { $in: topProductIds } })
      .select("brand title")
      .lean<ProductLean[]>();
    const brandMap = Object.fromEntries(
      topProductDocs.map((p) => [p._id.toString(), p.brand]),
    );

    const topProducts = topAgg.map((p) => {
      const initials = p.title
        .split(" ")
        .slice(0, 2)
        .map((w) => w[0]?.toUpperCase() ?? "")
        .join("");
      return {
        id: p._id?.toString() ?? p.title,
        name: p.title,
        brand: brandMap[p._id?.toString()] ?? "—",
        unitsSold: p.unitsSold,
        revenue: p.revenue,
        initials,
      };
    });

    // ---------- Low stock ----------
    const lowStockDocs = await Product.find({ isActive: true, stock: { $lte: 10 } })
      .sort({ stock: 1 })
      .limit(5)
      .select("title brand stock")
      .lean<ProductLean[]>();

    const lowStockItems = lowStockDocs.map((p) => ({
      id: p._id.toString(),
      name: p.title,
      size: p.brand,
      stock: p.stock,
      status: p.stock === 0 ? "out-of-stock" : p.stock < 5 ? "low-stock" : "in-stock",
    }));

    return NextResponse.json({
      success: true, stats, revenueSeries, revenueSummary,
      recentOrders, topProducts, lowStockItems,
    });
  } catch (error) {
    console.error("Admin dashboard error:", error);
    return NextResponse.json({ success: false, message: "Something went wrong" }, { status: 500 });
  }
};