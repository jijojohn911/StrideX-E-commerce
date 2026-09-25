import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

const clearCookie = (res: NextResponse) => {
  res.cookies.set("token", "", { maxAge: 0, path: "/" });
  return res;
};

export const GET = async (request: NextRequest) => {
  const authUser = getAuthUser(request);

  if (!authUser) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  await connectDB();
  const user = await User.findById(authUser.userId);

  if (!user) {
    return clearCookie(
      NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      )
    );
  }

  if (user.isBlocked) {
    return clearCookie(
      NextResponse.json(
        {
          success: false,
          blocked: true,
          message: user.blockedReason
            ? `Your account has been blocked: ${user.blockedReason}`
            : "Your account has been blocked, please contact support team.",
        },
        { status: 403 }
      )
    );
  }

  return NextResponse.json({
    success: true,
    user: {
      id: user._id,
      email: user.email,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
    },
  });
};