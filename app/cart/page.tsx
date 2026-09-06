"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Minus, Plus, X, ShoppingBag, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

// Types — mirrors the populated Cart API response

interface Product {
  _id: string;
  title: string;
  price: number;
  discountPrice?: number;
  slug: string;
  images?: string[];
  stock: number;
}

interface CartItem {
  product: Product | null;
  size: string;
  color: string;
  quantity: number;
}

interface CartData {
  items: CartItem[];
}

interface ApiResponse {
  success: boolean;
  message?: string;
  cart?: CartData;
}

// Identifies one line so we can key loading state / list items
const itemKey = (item: CartItem) =>
  `${item.product?._id ?? "unknown"}-${item.size}-${item.color}`;

// Returns the price that should actually be charged for a product
const getEffectivePrice = (product: Product) =>
  product.discountPrice ?? product.price;

const SHIPPING_LABEL = "Calculated at checkout";

export default function CartPage() {
  const router = useRouter();
  const [cart, setCart] = useState<CartData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [pendingKey, setPendingKey] = useState<string | null>(null);

  const fetchCart = useCallback(async () => {
    try {
      const res = await fetch("/api/cart", { method: "GET" });
      const data: ApiResponse = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to load your cart");
      }

      setCart(data.cart ?? { items: [] });
      setError(null);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong loading your cart",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  const retryFetch = () => {
    setIsLoading(true);
    setError(null);
    fetchCart();
  };

  useEffect(() => {
  let cancelled = false;

  const loadCart = async () => {
    try {
      const res = await fetch("/api/cart", {
        method: "GET",
        credentials: "include",
      });

      // 🔴 Not logged in
      if (res.status === 401) {
        router.replace("/login");
        return;
      }

      const data: ApiResponse = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to load cart");
      }

      if (!cancelled) {
        setCart(data.cart ?? { items: [] });
        setError(null);
      }
    } catch (err) {
      if (!cancelled) {
        setError(
          err instanceof Error
            ? err.message
            : "Something went wrong loading your cart"
        );
      }
    } finally {
      if (!cancelled) {
        setIsLoading(false);
      }
    }
  };

  loadCart();

  return () => {
    cancelled = true;
  };
}, [router]);


  //  update quantity 
  const updateQuantity = async (item: CartItem, nextQuantity: number) => {
    if (!item.product) return;
    if (nextQuantity < 1) return;

    const key = itemKey(item);
    setPendingKey(key);
    setActionError(null);

    try {
      const res = await fetch("/api/cart", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: item.product._id,
          size: item.size,
          color: item.color,
          quantity: nextQuantity,
        }),
      });

      const data: ApiResponse = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Couldn't update quantity");
      }

      setCart(data.cart ?? { items: [] });
    } catch (err) {
      setActionError(
        err instanceof Error ? err.message : "Couldn't update quantity",
      );
    } finally {
      setPendingKey(null);
    }
  };

  // ---------- remove item ----------
  const removeItem = async (item: CartItem) => {
    if (!item.product) return;

    const key = itemKey(item);
    setPendingKey(key);
    setActionError(null);

    try {
      const params = new URLSearchParams({
        productId: item.product._id,
        size: item.size,
        color: item.color,
      });

      const res = await fetch(`/api/cart?${params.toString()}`, {
        method: "DELETE",
      });

      const data: ApiResponse = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Couldn't remove item");
      }

      setCart(data.cart ?? { items: [] });
    } catch (err) {
      setActionError(
        err instanceof Error ? err.message : "Couldn't remove item",
      );
    } finally {
      setPendingKey(null);
    }
  };

  // ---------- derived totals ----------
  const items = cart?.items ?? [];
  const validItems = items.filter((item) => item.product !== null);

  const subtotal = validItems.reduce(
    (sum, item) =>
      sum + getEffectivePrice(item.product as Product) * item.quantity,
    0,
  );

  const formatPrice = (value: number) => `₹${value.toLocaleString("en-IN")}`;

  // Loading state

  if (isLoading) {
    return (
      <section className="min-h-[calc(100svh-76px)] bg-(--color-ivory)">
        <div className="container-stridex py-16 lg:py-20">
          <div className="mb-12 h-10 w-48 animate-pulse rounded bg-stone/20" />

          <div className="grid gap-12 lg:grid-cols-[1.6fr_1fr]">
            <div className="space-y-6">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="flex gap-5 border-b border-stone/20 pb-6"
                >
                  <div className="h-28 w-28 shrink-0 animate-pulse rounded bg-stone/20 sm:h-32 sm:w-32" />
                  <div className="flex-1 space-y-3 py-1">
                    <div className="h-4 w-2/3 animate-pulse rounded bg-stone/20" />
                    <div className="h-3 w-1/3 animate-pulse rounded bg-stone/20" />
                    <div className="h-3 w-1/4 animate-pulse rounded bg-stone/20" />
                  </div>
                </div>
              ))}
            </div>
            <div className="h-64 animate-pulse rounded bg-stone/20" />
          </div>
        </div>
      </section>
    );
  }

  // Error state (fetch failed)

  if (error) {
    return (
      <section className="flex min-h-[calc(100svh-76px)] items-center justify-center bg-(--color-ivory)">
        <div className="text-center">
          <p className="eyebrow mb-3 text-(--color-champagne)">
            Something went wrong
          </p>
          <h1 className="mb-6 text-2xl text-(--color-ink)">{error}</h1>
          <button
            onClick={retryFetch}
            className="btn btn-primary"
            type="button"
          >
            Try Again
          </button>
        </div>
      </section>
    );
  }

  // Empty cart

  if (validItems.length === 0) {
    return (
      <section className="flex min-h-[calc(100svh-76px)] items-center justify-center bg-(--color-ivory)">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto max-w-md px-6 text-center"
        >
          <div className="mx-auto mb-8 flex h-16 w-16 items-center justify-center rounded-full border border-(--color-stone)">
            <ShoppingBag
              size={24}
              strokeWidth={1.25}
              className="text-(--color-ink)"
            />
          </div>

          <p className="eyebrow mb-3 text-(--color-champagne)">Your Bag</p>
          <h1 className="display-headline mb-4 text-[clamp(2rem,4vw,2.75rem)] leading-[0.95] text-(--color-ink)">
            Empty for now.
          </h1>
          <p className="mb-9 text-sm leading-6 text-(--color-stone)">
            Nothing here yet. Explore the collection and find your next pair.
          </p>

          <Link href="/products" className="btn btn-primary group">
            Continue Shopping
            <ArrowRight
              size={16}
              strokeWidth={1.5}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </Link>
        </motion.div>
      </section>
    );
  }

  // Cart with items

  return (
    <section className="min-h-[calc(100svh-76px)] bg-ivory">
      <div className="container-stridex py-16 lg:py-20">
        <div className="mb-10 lg:mb-14">
          <p className="eyebrow mb-3 text-(--color-champagne)">
            {validItems.length} {validItems.length === 1 ? "Item" : "Items"}
          </p>
          <h1 className="display-headline text-[clamp(2rem,4vw,2.75rem)] leading-[0.95] text-(--color-ink)">
            Your Bag
          </h1>
        </div>

        {actionError && (
          <div className="mb-8 border border-champagne/40 bg-champagne/5 px-4 py-3 text-sm text-(--color-ink)">
            {actionError}
          </div>
        )}

        <div className="grid gap-12 lg:grid-cols-[1.6fr_1fr] lg:items-start">
          {/* ---------- Line items ---------- */}
          <ul className="divide-y divide-stone/20">
            <AnimatePresence initial={false}>
              {validItems.map((item) => {
                const product = item.product as Product;
                const key = itemKey(item);
                const isPending = pendingKey === key;
                const imageSrc = product.images?.[0];
                const unitPrice = getEffectivePrice(product);
                const hasDiscount =
                  product.discountPrice != null &&
                  product.discountPrice < product.price;

                return (
                  <motion.li
                    key={key}
                    layout
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    className="flex gap-5 py-7 first:pt-0 sm:gap-7"
                  >
                    {/* Image */}
                    <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded bg-stone/10 sm:h-32 sm:w-32">
                      {imageSrc ? (
                        <Image
                          src={imageSrc}
                          alt={product.title}
                          fill
                          sizes="128px"
                          className="object-contain p-3"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-(--color-stone)">
                          <ShoppingBag size={22} strokeWidth={1.25} />
                        </div>
                      )}
                    </div>

                    {/* Details */}
                    <div className="flex flex-1 flex-col justify-between">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h2 className="text-sm font-medium text-(--color-ink) sm:text-base">
                            {product.title}
                          </h2>
                          <p className="mt-1 text-xs text-(--color-stone) sm:text-sm">
                            Size {item.size} · {item.color}
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => removeItem(item)}
                          disabled={isPending}
                          aria-label="Remove item"
                          className="shrink-0 text-(--color-stone) transition-colors duration-300 hover:text-(--color-ink) disabled:opacity-40"
                        >
                          <X size={16} strokeWidth={1.5} />
                        </button>
                      </div>

                      <div className="mt-4 flex items-end justify-between gap-4">
                        {/* Quantity stepper */}
                        <div className="flex items-center border border-(--color-stone)">
                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(item, item.quantity - 1)
                            }
                            disabled={isPending || item.quantity <= 1}
                            aria-label="Decrease quantity"
                            className="flex h-9 w-9 items-center justify-center text-(--color-ink) transition-colors duration-300 hover:bg-stone/10 disabled:opacity-30"
                          >
                            <Minus size={13} strokeWidth={1.5} />
                          </button>

                          <span className="w-8 text-center text-sm text-(--color-ink)">
                            {item.quantity}
                          </span>

                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(item, item.quantity + 1)
                            }
                            disabled={
                              isPending || item.quantity >= product.stock
                            }
                            aria-label="Increase quantity"
                            className="flex h-9 w-9 items-center justify-center text-(--color-ink) transition-colors duration-300 hover:bg-stone/10 disabled:opacity-30"
                          >
                            <Plus size={13} strokeWidth={1.5} />
                          </button>
                        </div>

                        <div className="text-right">
                          <p className="text-sm font-medium text-(--color-ink) sm:text-base">
                            {formatPrice(unitPrice * item.quantity)}
                          </p>
                          {hasDiscount && (
                            <p className="text-xs text-(--color-stone) line-through">
                              {formatPrice(product.price * item.quantity)}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.li>
                );
              })}
            </AnimatePresence>
          </ul>

          {/* ---------- Order summary ---------- */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="border border-stone/30 p-7 lg:sticky lg:top-24"
          >
            <p className="eyebrow mb-6 text-(--color-champagne)">
              Order Summary
            </p>

            <div className="space-y-4 text-sm">
              <div className="flex items-center justify-between text-(--color-ink)">
                <span className="text-(--color-stone)">Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex items-center justify-between text-(--color-ink)">
                <span className="text-(--color-stone)">Shipping</span>
                <span className="text-(--color-stone)">
                  {SHIPPING_LABEL}
                </span>
              </div>
            </div>

            <div className="my-6 h-px bg-stone/20" />

            <div className="mb-8 flex items-center justify-between text-(--color-ink)">
              <span className="text-sm">Total</span>
              <span className="text-lg font-medium">
                {formatPrice(subtotal)}
              </span>
            </div>

            <Link
              href="/checkout"
              className="btn btn-primary group w-full justify-center"
            >
              Proceed to Checkout
              <ArrowRight
                size={16}
                strokeWidth={1.5}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
