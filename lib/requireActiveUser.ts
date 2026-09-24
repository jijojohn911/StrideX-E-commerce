import { NextRequest, NextResponse } from "next/server";
import User from "@/models/User";
import { connectDB } from "@/lib/mongodb";
import { getAuthUser, JwtPayload } from "@/lib/auth";

type AuthResult =
  | { ok: true; user: JwtPayload }
  | { ok: false; response: NextResponse };

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

  // user delete aayittundenkil
  if (!dbUser) {
    const res = NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 },
    );
    res.cookies.set("token", "", { maxAge: 0, path: "/" });
    return { ok: false, response: res };
  }

  if (dbUser.isBlocked) {
    const res = NextResponse.json(
      {
        success: false,
        blocked: true,
        message: dbUser.blockedReason
          ? `Ninte account block cheythirikkunnu: ${dbUser.blockedReason}`
          : "Ninte account block cheythirikkunnu. Support-umayi bandhappedu.",
      },
      { status: 403 },
    );
    res.cookies.set("token", "", { maxAge: 0, path: "/" }); // session kalayuka
    return { ok: false, response: res };
  }

 
  return { ok: true, user: { ...payload, role: dbUser.role } };
};