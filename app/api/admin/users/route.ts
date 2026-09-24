import { NextRequest, NextResponse } from "next/server";
import User from "@/models/User";
import Order from "@/models/Order";
import { connectDB } from "@/lib/mongodb";
import { getAuthUser } from "@/lib/auth";

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

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status"); // "blocked" | "active"
    const page = Math.max(parseInt(searchParams.get("page") || "1", 10), 1);
    const limit = 10;

    const filter: Record<string, unknown> = { role: "user" };

    if (search) {
      filter.$or = [
        { firstName: { $regex: search, $options: "i" } },
        { lastName: { $regex: search, $options: "i" } },
        { username: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
      ];
    }
    if (status === "blocked") filter.isBlocked = true;
    if (status === "active") filter.isBlocked = { $ne: true };

    const [users, total] = await Promise.all([
      User.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      User.countDocuments(filter),
    ]);

    const stats = await Order.aggregate([
      { $match: { user: { $in: users.map((u) => u._id) } } },
      {
        $group: {
          _id: "$user",
          orders: { $sum: 1 },
          spent: { $sum: "$totalAmount" },
        },
      },
    ]);
    const statMap = new Map(stats.map((s) => [String(s._id), s]));

    const data = users.map((u) => ({
      ...u,
      orders: statMap.get(String(u._id))?.orders ?? 0,
      spent: statMap.get(String(u._id))?.spent ?? 0,
    }));

    return NextResponse.json(
      { success: true, users: data, total, pages: Math.ceil(total / limit) },
      { status: 200 },
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 },
    );
  }
};