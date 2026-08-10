import { NextResponse, NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import { updateProductSchema } from "@/validations/product";
import { success } from "zod";


//Get one product
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

    return NextResponse.json(
      {
        success: true,
        product,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        meessage: "Internal Server Error",
      },
      { status: 500 },
    );
  }
};



//update product
export const PUT = async (
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) => {
  try {
    const { slug } = await params;

    const body = await req.json();

    const result = updateProductSchema.safeParse(body);

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

    const product = await Product.findOneAndUpdate(
      {
        slug,
        isActive: true,
      },
      result.data,
      {
        new: true,
        runValidators: true,
      },
    );

    if (!product) {
      return NextResponse.json(
        {
          success: false,
          message: "Product not found",
        },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Product updated successfully",
        product,
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

//Soft Delete Product
export const DELETE = async (
  req:NextRequest,
  {params}:{params:Promise<{slug:string}>}
)=>{

  try {
    const {slug} = await params
    await connectDB();

    const product = await Product.findOneAndUpdate(
      {
        slug,
        isActive:true,
      },
      {
        isActive:false,
      },
      {
        new:true
      },
    );
    if(!product){
      return NextResponse.json({
        success:false,
        message:"Product not found"
      },
    {status:404})
    }

    return NextResponse.json(
      {
        success:true,
        message:"Product deleted sucessfully"
      },
      {status:200}
    )
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
}


