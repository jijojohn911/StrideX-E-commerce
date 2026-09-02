import { NextResponse, NextRequest } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Address from "@/models/Address";

interface Params {
  params: Promise<{ id: string }>;
}

// PUT — update an address 
export const PUT = async (request: NextRequest, { params }: Params) => {
  const authUser = getAuthUser(request);

  if (!authUser) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 },
    );
  }

  await connectDB();

  const { id } = await params;
  const address = await Address.findOne({ _id: id, user: authUser.userId });

  if (!address) {
    return NextResponse.json(
      { success: false, message: "Address not found" },
      { status: 404 },
    );
  }

  const body = await request.json();

  if (body.isDefault) {
    await Address.updateMany(
      { user: authUser.userId },
      { $set: { isDefault: false } },
    );
  }

  Object.assign(address, body);
  await address.save();

  return NextResponse.json({ success: true, address });
};

// DELETE — remove an address
export const DELETE = async (request: NextRequest, { params }: Params) => {
  const authUser = getAuthUser(request);

  if (!authUser) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 },
    );
  }

  await connectDB();

  const { id } = await params;
  const address = await Address.findOneAndDelete({
    _id: id,
    user: authUser.userId,
  });

  if (!address) {
    return NextResponse.json(
      { success: false, message: "Address not found" },
      { status: 404 },
    );
  }

  return NextResponse.json({ success: true, message: "addres deleted" });
};
