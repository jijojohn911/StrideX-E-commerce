"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Address {
  _id: string;
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  type?: string;
  isDefault?: boolean;
}

interface CartItem {
  _id: string;
  product: {
    _id: string;
    title: string;
    price: number;
    discountPrice?: number;
    images?: string[];
  };
  quantity: number;
  size?: string;
  color?: string;
}

interface Cart {
  items: CartItem[];
}

export default function CheckoutPage() {
  const router = useRouter();

  const [cart, setCart] = useState<Cart | null>(null);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "razorpay">("cod");

  const [loading, setLoading] = useState(true);
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState("");

  const [showAddForm, setShowAddForm] = useState(false);
  const [addingAddress, setAddingAddress] = useState(false);
  const [newAddress, setNewAddress] = useState({
    fullName: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    pincode: "",
    country: "India",
  });

  async function loadCheckoutData() {
    try {
      const [cartRes, addressRes] = await Promise.all([
        fetch("/api/cart"),
        fetch("/api/addresses"),
      ]);

      if (cartRes.status === 401 || addressRes.status === 401) {
        router.push("/login");
        return;
      }

      const cartData = await cartRes.json();
      const addressData = await addressRes.json();

      const cartObj: Cart | null = cartData.cart ?? null;
      if (!cartObj || cartObj.items.length === 0) {
        router.push("/cart");
        return;
      }

      setCart(cartObj);

      const addrList: Address[] = addressData.addresses ?? [];
      setAddresses(addrList);

      const defaultAddr = addrList.find((a) => a.isDefault) ?? addrList[0];
      if (defaultAddr) setSelectedAddressId(defaultAddr._id);
      if (addrList.length === 0) setShowAddForm(true);
    } catch (error) {
      console.error(error)
      setError("Failed to load checkout details");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadCheckoutData();
  }, []);

  function handleNewAddressChange(e: React.ChangeEvent<HTMLInputElement>) {
    setNewAddress({ ...newAddress, [e.target.name]: e.target.value });
  }

  async function handleAddAddress(e: React.FormEvent) {
    e.preventDefault();
    setAddingAddress(true);
    setError("");

    try {
      const res = await fetch("/api/addresses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newAddress),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Failed to save address");
        setAddingAddress(false);
        return;
      }

      const saved: Address = data.address;
      setAddresses((prev) => [...prev, saved]);
      setSelectedAddressId(saved._id);
      setShowAddForm(false);
      setNewAddress({
        fullName: "",
        phone: "",
        addressLine1: "",
        addressLine2: "",
        city: "",
        state: "",
        pincode: "",
        country: "India",
      });
    } catch (err) {
      console.error(err)
      setError("Something went wrong while saving address");
    } finally {
      setAddingAddress(false);
    }
  }

  async function handlePlaceOrder() {
    setError("");

    if (!selectedAddressId) {
      setError("Please select or add a shipping address");
      return;
    }

    setPlacing(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          addressId: selectedAddressId,
          paymentMethod,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Failed to place order");
        setPlacing(false);
        return;
      }

      router.push(`/order/${data.order._id}`);
    } catch (err) {
        console.error(err)
      setError("Something went wrong. Please try again.");
      setPlacing(false);
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="motion-safe-spinner animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-ink" />
      </div>
    );
  }
  if (!cart) return null;

  const subtotal = cart.items.reduce((sum, item) => {
    const price = item.product.discountPrice ?? item.product.price;
    return sum + price * item.quantity;
  }, 0);
  const shippingFee = subtotal >= 999 ? 0 : 79;
  const total = subtotal + shippingFee;

  return (
    <div className="min-h-screen bg-ivory">
      <div className="container-stridex section-y">
        <p className="eyebrow text-champagne mb-3">Order</p>
        <h1 className="font-display text-display-md text-ink mb-10">
          Checkout
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Left column */}
          <div className="md:col-span-2 space-y-10">
            {/* Address selection */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="eyebrow text-ink">Shipping Address</h2>
                {addresses.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setShowAddForm((s) => !s)}
                    className="text-caption text-champagne hover:underline"
                  >
                    {showAddForm ? "Cancel" : "+ Add New Address"}
                  </button>
                )}
              </div>

              {addresses.length > 0 && (
                <div className="space-y-3 mb-4">
                  {addresses.map((addr) => (
                    <label
                      key={addr._id}
                      className={`block border rounded-md px-4 py-3 bg-white cursor-pointer transition-colors duration-300 ${
                        selectedAddressId === addr._id
                          ? "border-ink"
                          : "border-stone-light"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <input
                          type="radio"
                          name="address"
                          value={addr._id}
                          checked={selectedAddressId === addr._id}
                          onChange={() => setSelectedAddressId(addr._id)}
                          className="mt-1 accent-ink"
                        />
                        <div className="text-body text-ink">
                          <p className="font-semibold">
                            {addr.fullName} · {addr.phone}
                          </p>
                          <p className="text-stone text-caption mt-1">
                            {addr.addressLine1}
                            {addr.addressLine2
                              ? `, ${addr.addressLine2}`
                              : ""}, {addr.city}, {addr.state} - {addr.pincode},{" "}
                            {addr.country}
                          </p>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              )}

              {showAddForm && (
                <form
                  onSubmit={handleAddAddress}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-4 border border-stone-light rounded-md p-4 bg-white"
                >
                  <input
                    name="fullName"
                    placeholder="Full Name"
                    required
                    value={newAddress.fullName}
                    onChange={handleNewAddressChange}
                    className="border border-stone-light rounded-md px-4 py-3 text-body focus:outline-none focus-visible:outline-2 focus-visible:outline-champagne"
                  />
                  <input
                    name="phone"
                    placeholder="Phone Number"
                    required
                    value={newAddress.phone}
                    onChange={handleNewAddressChange}
                    className="border border-stone-light rounded-md px-4 py-3 text-body"
                  />
                  <input
                    name="addressLine1"
                    placeholder="Address Line 1"
                    required
                    value={newAddress.addressLine1}
                    onChange={handleNewAddressChange}
                    className="border border-stone-light rounded-md px-4 py-3 text-body sm:col-span-2"
                  />
                  <input
                    name="addressLine2"
                    placeholder="Address Line 2 (optional)"
                    value={newAddress.addressLine2}
                    onChange={handleNewAddressChange}
                    className="border border-stone-light rounded-md px-4 py-3 text-body sm:col-span-2"
                  />
                  <input
                    name="city"
                    placeholder="City"
                    required
                    value={newAddress.city}
                    onChange={handleNewAddressChange}
                    className="border border-stone-light rounded-md px-4 py-3 text-body"
                  />
                  <input
                    name="state"
                    placeholder="State"
                    required
                    value={newAddress.state}
                    onChange={handleNewAddressChange}
                    className="border border-stone-light rounded-md px-4 py-3 text-body"
                  />
                  <input
                    name="pincode"
                    placeholder="Pincode"
                    required
                    value={newAddress.pincode}
                    onChange={handleNewAddressChange}
                    className="border border-stone-light rounded-md px-4 py-3 text-body"
                  />
                  <input
                    name="country"
                    placeholder="Country"
                    required
                    value={newAddress.country}
                    onChange={handleNewAddressChange}
                    className="border border-stone-light rounded-md px-4 py-3 text-body"
                  />
                  <button
                    type="submit"
                    disabled={addingAddress}
                    className="btn btn-primary sm:col-span-2 disabled:opacity-60"
                  >
                    {addingAddress ? "Saving..." : "Save Address"}
                  </button>
                </form>
              )}
            </section>

            <hr className="hairline" />

            {/* Payment method */}
            <section>
              <h2 className="eyebrow text-ink mb-4">Payment Method</h2>
              <div className="space-y-3">
                <label className="flex items-center gap-3 border border-stone-light rounded-md px-4 py-3 bg-white cursor-pointer text-body">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={paymentMethod === "cod"}
                    onChange={() => setPaymentMethod("cod")}
                    className="accent-ink"
                  />
                  Cash on Delivery
                </label>
                <label className="flex items-center gap-3 border border-stone-light rounded-md px-4 py-3 bg-white cursor-pointer text-body">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="razorpay"
                    checked={paymentMethod === "razorpay"}
                    onChange={() => setPaymentMethod("razorpay")}
                    className="accent-ink"
                  />
                  Pay Online (Razorpay)
                </label>
              </div>
            </section>

            {error && <p className="text-red-600 text-caption">{error}</p>}

            <button
              type="button"
              onClick={handlePlaceOrder}
              disabled={placing}
              className="btn btn-primary w-full disabled:opacity-60"
            >
              {placing ? "Placing Order..." : "Place Order"}
            </button>
          </div>

          {/* Right: Order Summary */}
          <div className="bg-white border border-stone-light rounded-lg p-6 h-fit">
            <h2 className="eyebrow text-ink mb-4">Order Summary</h2>
            <div className="space-y-3 mb-4">
              {cart.items.map((item) => {
                const price = item.product.discountPrice ?? item.product.price;
                return (
                  <div
                    key={`${item.product._id}-${item.size}-${item.color}`}
                    className="flex justify-between text-caption text-ink"
                  >
                    <span>
                      {item.product.title} × {item.quantity}
                      {item.size ? ` · ${item.size}` : ""}
                    </span>
                    <span>₹{price * item.quantity}</span>
                  </div>
                );
              })}
            </div>
            <hr className="hairline mb-4" />
            <div className="space-y-2 text-caption text-stone">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>{shippingFee === 0 ? "Free" : `₹${shippingFee}`}</span>
              </div>
              <hr className="hairline my-2" />
              <div className="flex justify-between font-semibold text-body text-ink">
                <span>Total</span>
                <span>₹{total}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
