import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { getAuthUser, JwtPayload } from "@/lib/auth";
import Wishlist from "@/models/Wishlist";


// GET — fetch the logged-in user's wishlist
export const GET = async (req: NextRequest) => {
  try {
    await connectDB();
    const user: JwtPayload | null = await getAuthUser(req);

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    const wishlist = await Wishlist.findOne({ user: user.userId }).populate(
      "products",
    );

    // If user has no wishlist yet, return an empty one
    if (!wishlist) {
      return NextResponse.json({ success: true, products: [] });
    }
    return NextResponse.json({ success: true, products: wishlist.products });
  } catch (error) {
    console.error("wishlist GET error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong",
      },
      { status: 500 },
    );
  }
};

//add a product to the wishlist (toggle-friendly: also removes if already present)

export const POST = async (req: NextRequest) => {
  try {
    await connectDB();

    const user: JwtPayload | null = await getAuthUser(req);

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    const body = await req.json();
    const { productId } = body;

    if (!productId) {
      return NextResponse.json(
        {
          success: false,
          message: "Product ID is required",
        },
        { status: 400 },
      );
    }

    let wishlist = await Wishlist.findOne({ user: user.userId });

    if (!wishlist) {
      wishlist = await Wishlist.create({
        user: user.userId,
        products: [productId],
      });

      return NextResponse.json(
        {
          success: true,
          message: "Added to wishlist",
          isWishlisted: true,
        },
        { status: 201 },
      );
    }

    const alreadyExists = wishlist.products.some(
      (p) => p.toString() === productId,
    );

    if (alreadyExists) {
      wishlist.products = wishlist.products.filter(
        (p) => p.toString() !== productId,
      );

      await wishlist.save();
      return NextResponse.json({
        success: true,
        message: "Removed from wishlist",
        isWishlisted: false,
      });
    }

    // Toggle on — add it

    wishlist.products.push(productId);
    await wishlist.save();
    return NextResponse.json({
      success: true,
      message: "Added to wishlist",
      isWishlisted: true,
    });
  } catch (error) {
    console.error("Wishlist POST error :", error);

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong",
      },
      { status: 500 },
    );
  }
};
