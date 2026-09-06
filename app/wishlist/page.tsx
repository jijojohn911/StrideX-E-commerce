"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Heart } from "lucide-react";
import { toast } from "sonner";

interface WishlistProduct {
  _id: string;
  title: string;
  slug: string;
  price: number;
  discountPrice?: number;
  images?: string[];
}
const WishlistPage = () => {
  const router = useRouter();

  const [products, setProducts] = useState<WishlistProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadWishlist() {
    try {
      const res = await fetch("/api/wishlist");

      if (res.status === 401) {
        router.push("/login");
        return;
      }

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Failed to load wishlist");
        return;
      }

      setProducts(data.products ?? []);
    } catch (error) {
      console.error("Something went wrong", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps, react-hooks/set-state-in-effect
    loadWishlist();
  }, []);

  async function handleRemove(productId: string) {
    const previous = products;

    setProducts((prev) => prev.filter((p) => p._id !== productId));

    try {
      const res = await fetch("/api/wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setProducts(previous);
        toast.error(data.message || "Failed to remove item");
        return;
      }

      toast.success("Removed from wishlist");
    } catch (error) {
      console.error(error);
      setProducts(previous);
      toast.error("Something went wrong");
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="motion-safe-spinner animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-ink" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ivory">
      <div className="container-stridex section-y">
        <p className="eyebrow text-champagne mb-3">Saved</p>
        <h1 className="font-display text-display-md text-ink mb-10">
          Your Wishlist
        </h1>

        {!error && products.length === 0 && (
          <div className="text-center py-20">
            <p className="text-body text-stone mb-6">
              You haven&apos;t saved anything yet.
            </p>
            <Link href="/" className="btn btn-primary">
              Start Shopping
            </Link>
          </div>
        )}

        <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 lg:grid-cols-5">
          {products.map((product) => {
            const price = product.discountPrice ?? product.price;
            return (
              <div key={product._id} className="group">
                <Link href={`/products/${product.slug}`} className="block">
                  <div className="relative aspect-square overflow-hidden rounded-4xl bg-stone-light">
                    <Image
                      src={
                        product.images?.[0] ?? "/images/hero-signature-shoe.png"
                      }
                      alt={product.title}
                      fill
                      sizes="(max-width: 768px) 50vw, 20vw"
                      className="object-cover p-6"
                    />

                    <button
                      type="button"
                      aria-label="Remove from wishlist"
                      onClick={(e) => {
                        e.preventDefault();
                        handleRemove(product._id);
                      }}
                      className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-ivory text-ink hover:text-champagne transition-colors duration-300"
                    >
                      <Heart size={15} strokeWidth={1.5} fill="currentColor" />
                    </button>
                  </div>
                </Link>

                <div className="mt-4">
                  <Link href={`/products/${product.slug}`}>
                    <p className="text-sm font-medium text-ink">
                      {product.title}
                    </p>
                  </Link>
                  <p className="mt-1 text-sm text-stone">
                    ₹{price.toLocaleString("en-IN")}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default WishlistPage;
