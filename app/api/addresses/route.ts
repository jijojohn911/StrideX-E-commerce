import { NextResponse, NextRequest } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Address from "@/models/Address";


// GET — list all addresses for the logged-in user
export const GET = async (request: NextRequest) => {
  const authUser = getAuthUser(request);

  if (!authUser) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 },
    );
  }

  await connectDB();

  const addresses = await Address.find({ user: authUser.userId }).sort({
    isDefault: -1,
    createdAt: -1,
  });

  return NextResponse.json({ success: true, addresses });
};

// POST — add a new address
export const POST = async (request: NextRequest) => {
  const authUser = getAuthUser(request);

  if (!authUser) {
    return NextResponse.json(
      {
        success: false,
        message: "Unauthorized",
      },
      {
        status: 401,
      },
    );
  }

  await connectDB();

  const body = await request.json();

  const {
    fullName,
    phone,
    addressLine1,
    addressLine2,
    city,
    state,
    pincode,
    country,
    type,
    isDefault,
  } = body;

  if (!fullName || !phone || !addressLine1 || !city || !state || !pincode) {
    return NextResponse.json(
      { success: false, message: "Missing required address fields" },
      { status: 400 },
    );
  }

  if (isDefault) {
    await Address.updateMany(
      { user: authUser.userId },
      { $set: { isDefault: false } },
    );
  }

  const existingCount = await Address.countDocuments({
    user: authUser.userId,
  });

  const address = await Address.create({
    user: authUser.userId,
    fullName,
    phone,
    addressLine1,
    addressLine2,
    city,
    state,
    pincode,
    country: country || "India",
    type: type || "home",
    isDefault: isDefault || existingCount === 0,
  });

  return NextResponse.json({ success: true, address }, { status: 201 });
};
