import { NextRequest, NextResponse } from "next/server";
import Product from "@/models/Product";
import { createProductSchema } from "@/validations/product";
import { connectDB } from "@/lib/mongodb";
import { getAuthUser } from "@/lib/auth";
import { title } from "process";

export const POST = async (req: NextRequest) => {
  try {
    const authUser = getAuthUser(req);
    if (authUser?.role !== "admin") {
      return NextResponse.json(
        { success: false, message: authUser ? "Forbidden" : "Unauthorized" },
        { status: authUser ? 403 : 401 },
      );
    }

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

export const GET = async (req: NextRequest) => {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const featured = searchParams.get("featured");
    const category = searchParams.get("category");
    const gender = searchParams.get("gender");
    const size = searchParams.get("size");
    const sort = searchParams.get("sort"); 
    const search = searchParams.get("search")
    const limit = parseInt(searchParams.get("limit") || "0", 10);

    const query: Record<string, unknown> = { isActive: true };
    if (featured === "true") query.featured = true;
    if (category) query.category = category.toLowerCase();
    if (gender) query.gender = gender;
    if (size) query.sizes = size;
   if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { brand: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } },
      ];
    }

    let sortOption: Record<string, 1 | -1> = { createdAt: -1 }; // default: newest
    if (sort === "price_asc") sortOption = { price: 1 };
    if (sort === "price_desc") sortOption = { price: -1 };
    if (sort === "newest") sortOption = { createdAt: -1 };

    let productsQuery = Product.find(query).sort(sortOption);
    if (limit > 0) productsQuery = productsQuery.limit(limit);

    const products = await productsQuery;

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
      { success: false, message: "Internal Server Error" },
      { status: 500 },
    );
  }
};