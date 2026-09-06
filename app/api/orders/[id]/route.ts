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
   console.log("Authenticated user:", user);
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    const { id: orderId } = await params;
console.log("orderId from params:", orderId);
    const order = await Order.findOne({
      _id: orderId,
      user: user.userId,
    });
console.log("Order found:", order);
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
      {
        success: false,
        message: "Somthing went wrong",
      },
      { status: 500 },
    );
  }
};
