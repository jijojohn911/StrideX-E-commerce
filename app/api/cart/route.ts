import { NextResponse, NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Cart from "@/models/Cart";
import Product from "@/models/Product";
import { getAuthUser } from "@/lib/auth";
import { Types } from "mongoose";
import {
  addItemSchema,
  updateItemSchema,
  deleteItemSchema,
} from "@/validations/cart.validator";

interface CartItemDoc {
  product: Types.ObjectId;
  size: string;
  color: string;
  quantity: number;
}

const findItemIndex = (
  items: CartItemDoc[],
  productId: string,
  size: string,
  color: string,
) =>
  items.findIndex(
    (item) =>
      item.product.toString() === productId &&
      item.size === size &&
      item.color === color,
  );

// GET
export const GET = async (req: NextRequest) => {
  try {
    await connectDB();

    const user = await getAuthUser(req);

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    const cart = await Cart.findOne({ user: user.userId }).populate(
      "items.product",
    );

    return NextResponse.json({
      success: true,
      cart: cart || { user: user.userId, items: [] },
    });
  } catch (error) {
    console.error("Cart GET error:", error);
    return NextResponse.json(
      { success: false, message: "Something went wrong" },
      { status: 500 },
    );
  }
};

// POST
export const POST = async (req: NextRequest) => {
  try {
    await connectDB();

    const user = await getAuthUser(req);

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    const body = await req.json();
    const parsed = addItemSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid input",
          errors: parsed.error.flatten(),
        },
        { status: 400 },
      );
    }

    const { productId, size, color, quantity } = parsed.data;

    const product = await Product.findById(productId);

    if (!product || !product.isActive) {
      return NextResponse.json(
        { success: false, message: "Product not found or unavailable" },
        { status: 404 },
      );
    }

    if (!product.sizes.includes(size)) {
      return NextResponse.json(
        { success: false, message: "Selected size is not available" },
        { status: 400 },
      );
    }

    if (!product.colors.includes(color)) {
      return NextResponse.json(
        { success: false, message: "Selected color is not available" },
        { status: 400 },
      );
    }

    if (product.stock < quantity) {
      return NextResponse.json(
        { success: false, message: "Not enough stock available" },
        { status: 400 },
      );
    }

    let cart = await Cart.findOne({ user: user.userId });

    if (!cart) {
      cart = await Cart.create({
        user: user.userId,
        items: [{ product: productId, size, color, quantity }],
      });
    } else {
      const index = findItemIndex(cart.items, productId, size, color);

      if (index !== -1) {
        const newQuantity = cart.items[index].quantity + quantity;

        if (newQuantity > product.stock) {
          return NextResponse.json(
            { success: false, message: "Not enough stock available" },
            { status: 400 },
          );
        }

        cart.items[index].quantity = newQuantity;
      } else {
        cart.items.push({ product: productId, size, color, quantity });
      }

      await cart.save();
    }

    const populatedCart = await cart.populate("items.product");

    return NextResponse.json({
      success: true,
      message: "Item added to cart",
      cart: populatedCart,
    });
  } catch (error) {
    console.error("Cart POST error:", error);
    return NextResponse.json(
      { success: false, message: "Something went wrong" },
      { status: 500 },
    );
  }
};

// PATCH
export const PATCH = async (req: NextRequest) => {
  try {
    await connectDB();
    const user = await getAuthUser(req);

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    const body = await req.json();
    const parsed = updateItemSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid input",
          errors: parsed.error.flatten(),
        },
        { status: 400 },
      );
    }

    const { productId, size, color, quantity } = parsed.data;

    const product = await Product.findById(productId);

    if (!product || !product.isActive) {
      return NextResponse.json(
        { success: false, message: "Product not found or unavailable" },
        { status: 404 },
      );
    }

    if (quantity > product.stock) {
      return NextResponse.json(
        { success: false, message: "Not enough stock available" },
        { status: 400 },
      );
    }

    const cart = await Cart.findOne({ user: user.userId });

    if (!cart) {
      return NextResponse.json(
        { success: false, message: "Cart not found" },
        { status: 404 },
      );
    }

    const index = findItemIndex(cart.items, productId, size, color);

    if (index === -1) {
      return NextResponse.json(
        { success: false, message: "Cart item not found" },
        { status: 404 },
      );
    }

    cart.items[index].quantity = quantity;

    await cart.save();

    const populatedCart = await cart.populate("items.product");

    return NextResponse.json({
      success: true,
      message: "Cart updated",
      cart: populatedCart,
    });
  } catch (error) {
    console.error("Cart PATCH error:", error);
    return NextResponse.json(
      { success: false, message: "Something went wrong" },
      { status: 500 },
    );
  }
};

// DELETE
export const DELETE = async (req: NextRequest) => {
  try {
    await connectDB();
    const user = await getAuthUser(req);

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    const { searchParams } = new URL(req.url);
    const parsed = deleteItemSchema.safeParse({
      productId: searchParams.get("productId"),
      size: searchParams.get("size"),
      color: searchParams.get("color"),
    });

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          message: "productId, size, and color are required",
          errors: parsed.error.flatten(),
        },
        { status: 400 },
      );
    }

    const { productId, size, color } = parsed.data;
    const cart = await Cart.findOne({ user: user.userId });

    if (!cart) {
      return NextResponse.json(
        { success: false, message: "Cart not found" },
        { status: 404 },
      );
    }

    const index = findItemIndex(cart.items, productId, size, color);
    if (index === -1) {
      return NextResponse.json(
        { success: false, message: "Cart item not found" },
        { status: 404 },
      );
    }

    cart.items.splice(index, 1);
    await cart.save();

    const populatedCart = await cart.populate("items.product");

    return NextResponse.json({
      success: true,
      message: "Item removed from cart",
      cart: populatedCart,
    });
  } catch (error) {
    console.error("Cart DELETE error:", error);
    return NextResponse.json(
      { success: false, message: "Something went wrong" },
      { status: 500 },
    );
  }
};