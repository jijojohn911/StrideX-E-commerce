import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { connectDB } from "@/lib/mongodb";
import { getAuthUser } from "@/lib/auth";
import Cart from "@/models/Cart";
import Order from "@/models/Order";
import Address from "@/models/Address";
import Product, { IProduct } from "@/models/Product";
import { JwtPayload } from "jsonwebtoken";

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
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      addressId,
    } = body;

    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature ||
      !addressId
    ) {
      return NextResponse.json(
        { success: false, message: "Missing payment details" },
        { status: 400 },
      );
    }

    // Verify signature
    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return NextResponse.json(
        { success: false, message: "Payment verification failed" },
        { status: 400 },
      );
    }

    // Signature valid
    const address = await Address.findOne({
      _id: addressId,
      user: user.userId,
    });

    if (!address) {
      return NextResponse.json(
        { success: false, message: "Address not found" },
        { status: 404 },
      );
    }

    const cart = await Cart.findOne({ user: user.userId }).populate(
      "items.product",
    );

    if (!cart || cart.items.length === 0) {
      return NextResponse.json(
        { success: false, message: "Your cart is empty" },
        { status: 400 },
      );
    }

    const orderItems = [];
    let subtotal = 0;

    for (const item of cart.items) {
      const product = item.product as unknown as IProduct;

      if (!product || !product.isActive) {
        return NextResponse.json(
          {
            success: false,
            message: `"${product?.title ?? "A product"}" is no longer available`,
          },
          { status: 400 },
        );
      }

      if (product.stock < item.quantity) {
        return NextResponse.json(
          {
            success: false,
            message: `Not enough stock for "${product.title}"`,
          },
          { status: 400 },
        );
      }

      const effectivePrice = product.discountPrice ?? product.price;

      orderItems.push({
        product: product._id,
        title: product.title,
        size: item.size,
        color: item.color,
        quantity: item.quantity,
        price: effectivePrice,
      });

      subtotal += effectivePrice * item.quantity;
    }

    const shippingFee = subtotal >= 999 ? 0 : 79;
    const totalAmount = subtotal + shippingFee;
    const orderNumber = `SX${Date.now()}${Math.floor(Math.random() * 1000)}`;

    const order = await Order.create({
      user: user.userId,
      orderNumber,
      items: orderItems,
      shippingAddress: {
        fullName: address.fullName,
        phone: address.phone,
        addressLine1: address.addressLine1,
        addressLine2: address.addressLine2,
        city: address.city,
        state: address.state,
        pincode: address.pincode,
        country: address.country,
      },
      subtotal,
      shippingFee,
      totalAmount,
      payment: {
        method: "razorpay",
        status: "paid",
        razorpayOrderId: razorpay_order_id,
        razorpayPaymentId: razorpay_payment_id,
      },
      orderStatus: "confirmed",
    });

    for (const item of cart.items) {
      const product = item.product as unknown as IProduct;
      await Product.findByIdAndUpdate(product._id, {
        $inc: { stock: -item.quantity },
      });
    }

    cart.items = [];
    await cart.save();

    return NextResponse.json(
      { success: true, message: "Payment verified, order placed", order },
      { status: 201 },
    );
  } catch (error) {
    console.error("Payment verification error", error);
    return NextResponse.json(
      { success: false, message: "Something went wrong" },
      { status: 500 },
    );
  }
};