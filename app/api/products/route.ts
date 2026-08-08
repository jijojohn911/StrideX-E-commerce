import { NextRequest, NextResponse } from "next/server";
import Product from "@/models/Product";
import { createProductSchema } from "@/validations/product";
import { connectDB } from "@/lib/mongodb";

export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();

    const result = createProductSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          errors: result.error.issues,
        },
        { status: 400 },
      );
    }

    await connectDB();

    const existingProduct = await Product.findOne({ slug: result.data.slug });

    if (existingProduct) {
      return NextResponse.json(
        {
          success: false,
          message: "Product with this slug already exists",
        },
        { status: 409 },
      );
    }

    const product = await Product.create(result.data);

    return NextResponse.json(
      {
        success: true,
       message: "Product created successfully",
        product,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error",
      },
      { status: 500 },
    );
  }
};

export const GET = async () => {
  try {
    await connectDB();

    const products = await Product.find({
      isActive: true,
    }).sort({ createdAt: -1 });

    return NextResponse.json(
      {
        success: true,
        count: products.length,
        products,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error",
      },
      { status: 500 },
    );
  }
};
