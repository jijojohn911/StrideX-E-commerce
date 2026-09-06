"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

interface OrderItem {
  product: string;
  title: string;
  size?: string;
  color?: string;
  quantity: number;
  price: number;
}

interface ShippingAddress {
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
}

interface OrderData {
  _id: string;
  orderNumber: string;
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  subtotal: number;
  shippingFee: number;
  totalAmount: number;
  payment: { method: "cod" | "razorpay"; status: string };
  orderStatus: string;
  createdAt: string;
}

const OrderConfirmationPage = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const router = useRouter();

  const [order, setOrder] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadOrder() {
    try {
     const res = await fetch(`/api/orders/${orderId}`); 

      if (res.status === 401) {
        router.push("/login");
        return;
      }

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "order Not found");
        return;
      }
      setOrder(data.order);
    } catch (error) {
      console.error(error);
      setError("Failed to load order");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadOrder();
  }, [orderId]);

 if (loading) {
  return (
    <div className="min-h-screen bg-ivory flex justify-center items-center">
      <div className="motion-safe-spinner animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-ink" />
    </div>
  );
}
  if (error || !order) {
    return (
      <div className="min-h-screen bg-ivory flex flex-col items-center justify-center px-6 text-center">
        <h1 className="font-display text-display-md text-ink mb-4">
          Order Not Found
        </h1>
        <p className="text-stone text-body mb-8">{error}</p>
        <Link href="/" className="btn btn-primary">
          Back to Home
        </Link>
      </div>
    );
  }
  const orderData = new Date(order.createdAt).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  return (
 <div className="min-h-screen bg-ivory">
      <div className="container-stridex section-y">
        {/* Success header */}
        <div className="text-center mb-12">
          <p className="eyebrow text-champagne mb-3">Order Confirmed</p>
          <h1 className="font-display text-display-md text-ink mb-4">
            Thank you, {order.shippingAddress.fullName.split(" ")[0]}
          </h1>
          <p className="text-body text-stone">
            Your order{" "}
            <span className="text-ink font-semibold">#{order.orderNumber}</span>{" "}
            has been palced sucessfully.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-5xl mx-auto">
          {/* Left: items + address */}
          <div className="md:col-span-2 space-y-10">
            <section>
              <h2 className="eyebrow text-ink mb-4">Items</h2>
              <div className="space-y-3">
                {order.items.map((item, index) => (
                  <div
                    key={`${item.product}-${item.size}-${item.color}-${index}`}
                    className="flex justify-between border border-stone-light rounded-md px-4 py-3 bg-white text-body text-ink"
                  >
                    <span>
                      {item.title} x {item.quantity}
                      {item.size ? ` · ${item.size}` : ""}
                      {item.color ? ` · ${item.color}` : ""}
                    </span>
                    <span>₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>
            </section>

            <hr className="hairline" />

            <section>
              <h2 className="eyebrow text-ink mb-4 "> Shipping Address</h2>
              <div className="border border-stone-light rounded-md px-4 py-3 bg-white text-body text-ink">
                <p className="font-semibold">
                  {order.shippingAddress.fullName} ·{" "}
                  {order.shippingAddress.phone}
                </p>
                <p className="text-stone text-caption mt-1">
                  {order.shippingAddress.addressLine1}
                  {order.shippingAddress.addressLine2
                    ? `, ${order.shippingAddress.addressLine2}`
                    : ""}
                  , {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                  - {order.shippingAddress.pincode},{" "}
                  {order.shippingAddress.country}
                </p>
              </div>
            </section>

            <section>
              <h2 className="eyebrow text-ink mb-4">payment</h2>
              <div className="flex justify-between border border-stone-light rounded-md px-4 py-3 bg-white text-body text-ink">
                <span>
                  {order.payment.method === "cod"
                    ? "Cash on Delivery"
                    : "Razorpay"}
                </span>
                <span className="capitalize  text-stone">
                  {order.payment.status}
                </span>
              </div>
            </section>
          </div>

          {/* Right: summary */}
          <div className="bg-white border border-stone-light rounded-lg p-6 h-fit ">
            <h2 className="eyebrow text-ink mb-4">Order Summary</h2>
            <div className="space-y-2 text-caption text-stone">
              <div className="flex justify-between">
                <span>Order Date</span>
                <span className="text-ink">{orderData}</span>
                </div>
                <div className="flex justify-between">
                <span>Status</span>
                <span className="text-ink capitalize">
                  {order.orderStatus}
                </span>

              </div>
              <hr  className="hairline my-3"/>

              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{order.subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>
                  {order.shippingFee === 0 ? "Free":`₹${order.shippingFee}`}
                </span>
              </div>
              <hr  className="hairline my-2"/>
              <div className="flex justify-between font-semibold text-body text-ink">
                <span>Total</span>
                <span>₹{order.totalAmount}</span>
              </div>
            </div>

            <Link
            href="/" 
            className="btn btn-primary w-full mt-6 text-center">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;
