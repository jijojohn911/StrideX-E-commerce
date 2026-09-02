import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { getAuthUser, JwtPayload } from "@/lib/auth";
import Cart, { ICart } from "@/models/Cart";
import Order from "@/models/Order";
import Address from "@/models/Address";
import Product,{IProduct} from "@/models/Product";


// POST — create an order from the user's cart
export const POST = async (req: NextRequest) => {
  try {
    await connectDB();

    const user: JwtPayload | null = await getAuthUser(req);

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { addressId, paymentMethod } = body;

    if (!addressId) {
      return NextResponse.json(
        { success: false, message: "Shipping address is required" },
        { status: 400 }
      );
    }

    if (!paymentMethod || !["cod", "razorpay"].includes(paymentMethod)) {
      return NextResponse.json(
        { success: false, message: "Valid payment method is required" },
        { status: 400 }
      );
    }

    // Get the address 
    const address = await Address.findOne({
      _id: addressId,
      user: user.userId,
    });

    if (!address) {
      return NextResponse.json(
        { success: false, message: "Address not found" },
        { status: 404 }
      );
    }

    //  Get the cart, populated with product details
    const cart: ICart | null = await Cart.findOne({
      user: user.userId,
    }).populate("items.product");

    if (!cart || cart.items.length === 0) {
      return NextResponse.json(
        { success: false, message: "Your cart is empty" },
        { status: 400 }
      );
    }

    //  Validate stock and build order items
    const orderItems = [];
    let subtotal = 0;

    for (const item of cart.items) {
      // populate() makes item.product the full Product doc here
const product = item.product as unknown as IProduct;

      if (!product || !product.isActive) {
        return NextResponse.json(
          {
            success: false,
            message: `"${product?.title ?? "A product"}" is no longer available`,
          },
          { status: 400 }
        );
      }

      if (product.stock < item.quantity) {
        return NextResponse.json(
          {
            success: false,
            message: `Not enough stock for "${product.title}"`,
          },
          { status: 400 }
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

    //  Shipping + total
    const shippingFee = subtotal >= 999 ? 0 : 79; 
    const totalAmount = subtotal + shippingFee;

    //  Generate a unique order number
    const orderNumber = `SX${Date.now()}${Math.floor(Math.random() * 1000)}`;

    //  Create the order
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
        method: paymentMethod,
        status: paymentMethod === "cod" ? "pending" : "pending",
      },
      orderStatus: "pending",
    });

    //  Decrement stock for each product
    for (const item of cart.items) {
      const product = item.product as unknown as IProduct;
      await Product.findByIdAndUpdate(product._id, {
        $inc: { stock: -item.quantity },
      });
    }

    //  Clear the cart
    cart.items = [];
    await cart.save();

    return NextResponse.json(
      { success: true, message: "Order placed successfully", order },
      { status: 201 }
    );
  } catch (error) {
    console.error("Order POST error:", error);
    return NextResponse.json(
      { success: false, message: "Something went wrong" },
      { status: 500 }
    );
  }
};

// GET — list the logged-in user's orders
export const GET = async (req: NextRequest) => {
  try {
    await connectDB();

    const user: JwtPayload | null = await getAuthUser(req);

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const orders = await Order.find({ user: user.userId }).sort({
      createdAt: -1,
    });

    return NextResponse.json({ success: true, orders });
  } catch (error) {
    console.error("Order GET error:", error);
    return NextResponse.json(
      { success: false, message: "Something went wrong" },
      { status: 500 }
    );
  }
};