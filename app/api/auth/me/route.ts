import { getAuthUser } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  try {
    const user = getAuthUser(req);
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Not authenticated" },
        { status: 401 },
      );
    }

    await connectDB();
    const dbUser = await User.findById(user.userId).select("username");

    return NextResponse.json({
      success: true,
      user: {
        ...user, 
        username: dbUser?.username,
      },
    });
  } catch (error) {
    console.error("Auth me error", error);
    return NextResponse.json(
      { success: false, message: "Something went wrong" },
      { status: 500 },
    );
  }
};