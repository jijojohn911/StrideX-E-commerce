import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import User from "@/models/User";
import Order from "@/models/Order";
import Address from "@/models/Address";
import { connectDB } from "@/lib/mongodb";
import { getAuthUser } from "@/lib/auth";

type Ctx = { params: Promise<{ id: string }> };

const blockSchema = z.object({
  isBlocked: z.boolean(),
  reason: z.string().max(200).optional(),
});

const deny = (authUser: ReturnType<typeof getAuthUser>) =>
  NextResponse.json(
    { success: false, message: authUser ? "Forbidden" : "Unauthorized" },
    { status: authUser ? 403 : 401 },
  );

export const GET = async (req: NextRequest, { params }: Ctx) => {
  try {
    const authUser = getAuthUser(req);
    if (authUser?.role !== "admin") return deny(authUser);

    await connectDB();
    const { id } = await params;

    const user = await User.findById(id).lean();
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 },
      );
    }

    const [orders, addresses] = await Promise.all([
      Order.find({ user: id })
        .sort({ createdAt: -1 })
        .limit(5)
        .select("orderNumber totalAmount orderStatus createdAt")
        .lean(),
      Address.find({ user: id }).lean(),
    ]);

    return NextResponse.json(
      { success: true, user, orders, addresses },
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

export const PATCH = async (req: NextRequest, { params }: Ctx) => {
  try {
    const authUser = getAuthUser(req);
    if (authUser?.role !== "admin") return deny(authUser);

    const result = blockSchema.safeParse(await req.json());
    if (!result.success) {
      return NextResponse.json(
        { success: false, errors: result.error.issues },
        { status: 400 },
      );
    }

    await connectDB();
    const { id } = await params;

    const user = await User.findById(id);
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 },
      );
    }
    if (user.role === "admin") {
      return NextResponse.json(
        { success: false, message: "Admin-ne block cheyyan pattilla" },
        { status: 400 },
      );
    }

    const { isBlocked, reason } = result.data;
    user.isBlocked = isBlocked;
    user.blockedReason = isBlocked ? reason || "" : "";
    user.blockedAt = isBlocked ? new Date() : undefined;
    await user.save();

    return NextResponse.json(
      { success: true, isBlocked: user.isBlocked },
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