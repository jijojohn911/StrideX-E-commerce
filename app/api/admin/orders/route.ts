import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { getAuthUser } from "@/lib/auth";
import Order from "@/models/Order";

interface PopulatedUser {
  _id: string;
  username?: string;
  email?: string;
}

interface OrderWithUser {
  orderNumber: string;
  user: PopulatedUser | null;
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

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search");
    const status = searchParams.get("status"); // orderStatus filter

    const query: Record<string, unknown> = {};
    if (status) query.orderStatus = status;

    let orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .populate<{ user: PopulatedUser | null }>("user", "username email");

    if (search) {
      const term = search.toLowerCase();
      orders = orders.filter((o: OrderWithUser) =>
        o.orderNumber.toLowerCase().includes(term) ||
        o.user?.username?.toLowerCase().includes(term) ||
        o.user?.email?.toLowerCase().includes(term)
      );
    }

    return NextResponse.json({ success: true, count: orders.length, orders });
  } catch (error) {
    console.error("Admin orders GET error:", error);
    return NextResponse.json({ success: false, message: "Something went wrong" }, { status: 500 });
  }
};