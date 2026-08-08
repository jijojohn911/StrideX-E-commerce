import { NextResponse, NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import { updateProductSchema } from "@/validations/product";

export const GET = async (
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) => {
  try {
    const { slug } = await params;
    await connectDB();
    const product = await Product.findOne({
      slug,
      isActive: true,
    });

    if (!product) {
      return NextResponse.json(
        {
          success: true,
          message: "product not found",
        },
        { status: 404 },
      );
    }

    return NextResponse.json({
        success:true,
        product,
    },
{status:200})
  } catch (error) {
    console.error(error)

    return NextResponse.json({
        success:false,
        meessage:"Internal Server Error"
    },
{status:500})
  }
};


export const PUT = async (
    req:NextRequest,
    {params}:{params:Promise<{slug:string}>}
) =>{
    try {
        
    } catch (error) {
        
    }
}