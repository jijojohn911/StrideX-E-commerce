import { NextRequest, NextResponse } from "next/server";
import User from "@/models/User";
import { connectDB } from "@/lib/mongodb";
import { getAuthUser, JwtPayload } from "@/lib/auth";

type AuthResult =
  | { ok: true; user: JwtPayload }
  | { ok: false; response: NextResponse };

const clearCookie = (res: NextResponse) => {
  res.cookies.set("token", "", { maxAge: 0, path: "/" });
  return res;
};

export const requireActiveUser = async (
  req: NextRequest,
): Promise<AuthResult> => {
  const payload = getAuthUser(req);

  if (!payload) {
    return {
      ok: false,
      response: NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      ),
    };
  }

  await connectDB();
  const dbUser = await User.findById(payload.userId)
    .select("role isBlocked blockedReason")
    .lean();

  if (!dbUser) {
    return {
      ok: false,
      response: clearCookie(
        NextResponse.json(
          { success: false, message: "Unauthorized" },
          { status: 401 },
        ),
      ),
    };
  }

  if (dbUser.isBlocked) {
    return {
      ok: false,
      response: clearCookie(
        NextResponse.json(
          {
            success: false,
            blocked: true,
            message: dbUser.blockedReason
              ? `Your account has been blocked: ${dbUser.blockedReason}`
              : "Your account has been blocked, please contact support team.",
          },
          { status: 403 },
        ),
      ),
    };
  }

  return { ok: true, user: { ...payload, role: dbUser.role } };
};
