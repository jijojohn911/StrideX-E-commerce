import { NextResponse } from "next/server";

export const POST = async () => {
  const response = NextResponse.json({
    success: true,
    message: "logged out succesfully",
  });

  response.cookies.delete("token");
  return response;
};
