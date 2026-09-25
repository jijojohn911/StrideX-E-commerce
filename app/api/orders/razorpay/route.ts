import { NextResponse, NextRequest } from "next/server";
import Razorpay from "razorpay";
import { connectDB } from "@/lib/mongodb";
import { requireActiveUser } from "@/lib/requireActiveUser";
import Cart from "@/models/Cart";
import Product, { IProduct } from "@/models/Product";
void Product;

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export const POST = async (req: NextRequest) => {
  try {
    const auth = await requireActiveUser(req);
    if (!auth.ok) return auth.response;
    const user = auth.user;

    await connectDB();

    // Get cart to calculate the amount
    const cart = await Cart.findOne({ user: user.userId }).populate(
      "items.product"
    );

    if (!cart || cart.items.length === 0) {
      return NextResponse.json(
        { success: false, message: "Your cart is empty" },
        { status: 400 }
      );
    }

    let subtotal = 0;
    for (const item of cart.items) {
      const product = item.product as unknown as IProduct;
      const effectivePrice = product.discountPrice ?? product.price;
      subtotal += effectivePrice * item.quantity;
    }

    const shippingFee = subtotal >= 999 ? 0 : 79;
    const totalAmount = subtotal + shippingFee;

    // Razorpay expects amount in paise
    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(totalAmount * 100),
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    });

    return NextResponse.json({
      success: true,
      razorpayOrder,
      totalAmount,
    });
  } catch (error) {
    console.error("Razorpay order creation error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to initiate payment" },
      { status: 500 }
    );
  }
};