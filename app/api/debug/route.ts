import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";

export const GET = async () => {
  const result: Record<string, unknown> = {
    hasMongoUri: Boolean(process.env.MONGODB_URI),
    hasJwtSecret: Boolean(process.env.JWT_SECRET),
    nodeEnv: process.env.NODE_ENV,
  };

  try {
    await connectDB();
    result.db = "connected";
  } catch (error) {
    result.db = "failed";
    result.error = error instanceof Error ? error.message : String(error);
  }

  return NextResponse.json(result);
};