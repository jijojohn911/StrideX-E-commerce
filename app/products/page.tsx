"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import ProductCard, { ProductCardData } from "@/component/products/ProductCard";
import Navbar from "@/component/layout/Navbar";
import Footer from "@/component/layout/Footer";

interface ApiProduct {
  _id: string;
  title: string;
  price: number;
  discountPrice?: number;
  images: string[];
  slug: string;
  gender?: string;
}

type ListedProduct = ProductCardData & { gender: string };

const GENDER_HEADINGS: Record<string, string> = {
  men: "Men's Footwear",
  women: "Women's Footwear",
};

function ProductsList() {
  const searchParams = useSearchParams();
  const genderParam = (searchParams.get("gender") ?? "").toLowerCase();

  const [products, setProducts] = useState<ListedProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/products");
        if (!response.ok) throw new Error("Failed to fetch products");

        const data = await response.json();

        const formatted: ListedProduct[] = (data.products ?? []).map(
          (product: ApiProduct) => {
            const hasDiscount =
              !!product.discountPrice &&
              product.discountPrice > 0 &&
              product.discountPrice < product.price;

            return {
              id: product._id,
              name: product.title,
              price: hasDiscount ? product.discountPrice! : product.price,
              originalPrice: hasDiscount ? product.price : undefined,
              image: product.images?.[0] ?? "",
              href: `/products/${product.slug}`,
              gender: (product.gender ?? "unisex").toLowerCase(),
            };
          },
        );

        setProducts(formatted);
      } catch (err) {
        console.error(err);
        setError("Failed to load products. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // men / women select cheythaal unisex products-um kaanikkum
  const visibleProducts = useMemo(() => {
    if (genderParam !== "men" && genderParam !== "women") return products;
    return products.filter(
      (p) => p.gender === genderParam || p.gender === "unisex",
    );
  }, [products, genderParam]);

  const heading = GENDER_HEADINGS[genderParam] ?? "All Products";

  return (
    <>
      <Navbar cartCount={0} />

      <div className="bg-ivory">
        <section className="section-y">
          <div className="container-stridex">
            <div className="mb-10">
              <p className="eyebrow mb-3 text-champagne">StrideX Collection</p>

              <h1 className="display-headline text-display-lg text-ink">
                {heading}
              </h1>

              <p className="mt-4 max-w-md text-sm leading-6 text-stone">
                Explore the latest footwear designed for everyday movement
              </p>
            </div>

            {loading && (
              <p className="py-12 text-sm text-stone">Loading products...</p>
            )}

            {!loading && error && (
              <p className="py-12 text-sm text-red-500">{error}</p>
            )}

            {!loading && !error && visibleProducts.length === 0 && (
              <p className="py-12 text-sm text-stone">
                No products available.
              </p>
            )}

            {!loading && !error && visibleProducts.length > 0 && (
              <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4 md:gap-x-6">
                {visibleProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </section>
      </div>

      <Footer />
    </>
  );
}

// useSearchParams-inu Suspense venam, illenkil npm run build fail aakum
const ProductPage = () => {
  return (
    <Suspense fallback={null}>
      <ProductsList />
    </Suspense>
  );
};

export default ProductPage;