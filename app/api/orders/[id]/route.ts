import { NextResponse, NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { getAuthUser, JwtPayload } from "@/lib/auth";
import Order from "@/models/Order";

// GET — fetch a single order
export const GET = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) => {
  try {
    await connectDB();

    const user: JwtPayload | null = await getAuthUser(req);
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    const { id: orderId } = await params;
    const order = await Order.findOne({
      _id: orderId,
      user: user.userId,
    });

    if (!order) {
      return NextResponse.json(
        { success: false, message: "Order not found" },
        { status: 404 },
      );
    }
    return NextResponse.json({ success: true, order });
  } catch (error) {
    console.error("Order GET (single) error", error);
    return NextResponse.json(
      { success: false, message: "Something went wrong" },
      { status: 500 },
    );
  }
};

// PATCH — admin updates order status
export const PATCH = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) => {
  try {
    await connectDB();

    const user: JwtPayload | null = await getAuthUser(req);
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

   
    if (user.role !== "admin") {
      return NextResponse.json(
        { success: false, message: "Forbidden" },
        { status: 403 },
      );
    }

    const { id: orderId } = await params;
    const { orderStatus } = await req.json(); // frontend ayakkunna key

    const allowedStatuses = [
      "pending",
      "confirmed",
      "shipped",
      "delivered",
      "cancelled",
      "returned",
    ];

    if (!orderStatus || !allowedStatuses.includes(orderStatus)) {
      return NextResponse.json(
        {
          success: false,
          message: `Invalid status "${orderStatus}"`,
        },
        { status: 400 },
      );
    }

    const order = await Order.findByIdAndUpdate(
      orderId,
      { orderStatus },
      { new: true, runValidators: true },
    );

    if (!order) {
      return NextResponse.json(
        { success: false, message: "Order not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, order });
  } catch (error) {
    console.error("Order PATCH error", error);
    return NextResponse.json(
      { success: false, message: "Something went wrong" },
      { status: 500 },
    );
  }
};