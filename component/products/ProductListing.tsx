"use client";

import { useEffect, useState } from "react";
import ProductCard, { ProductCardData } from "./ProductCard";

interface ApiProduct {
  _id: string;
  title: string;
  price: number;
  discountPrice?: number;
  images: string[];
  slug: string;
}

interface ProductListingProps {
  gender?: "men" | "women";
  eyebrow: string;
  title: string;
  description: string;
}

const AVAILABLE_SIZES = ["6", "7", "8", "9", "10", "11"];

export default function ProductListing({
  gender,
  eyebrow,
  title,
  description,
}: ProductListingProps) {
  const [products, setProducts] = useState<ProductCardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [sort, setSort] = useState("newest");
  const [sizeFilter, setSizeFilter] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (gender) params.set("gender", gender);
        if (sizeFilter) params.set("size", sizeFilter);
        if (sort) params.set("sort", sort);

        const response = await fetch(`/api/products?${params.toString()}`);

        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        const data = await response.json();

        const formattedProducts = data.products.map((product: ApiProduct) => ({
          id: product._id,
          name: product.title,
          price: product.discountPrice ?? product.price,
          image: product.images[0],
          href: `/products/${product.slug}`,
        }));

        setProducts(formattedProducts);
      } catch (error) {
        console.error(error);
        setError("Failed to load products. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [gender, sort, sizeFilter]);

  return (
    <div className="bg-ivory">
      <section className="section-y">
        <div className="container-stridex">
          <div className="mb-10">
            <p className="eyebrow mb-3 text-champagne">{eyebrow}</p>
            <h1 className="display-headline text-display-lg text-ink">
              {title}
            </h1>
            <p className="mt-4 max-w-md text-sm leading-6 text-stone">
              {description}
            </p>
          </div>

          {/* Filter/Sort bar */}
          <div className="mb-8 flex flex-wrap items-center gap-4 border-b border-stone-light pb-6">
            {/* Sort */}
            <div className="flex items-center gap-2">
              <label htmlFor="sort" className="text-caption text-stone">
                Sort by
              </label>
              <select
                id="sort"
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="border border-stone-light rounded-md px-3 py-2 text-caption text-ink bg-white"
              >
                <option value="newest">Newest</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
              </select>
            </div>

            {/* Size filter */}
            <div className="flex items-center gap-2">
              <span className="text-caption text-stone">Size</span>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setSizeFilter("")}
                  className={`h-8 px-3 rounded-full border text-caption transition-colors duration-300 ${
                    sizeFilter === ""
                      ? "border-ink bg-ink text-ivory"
                      : "border-stone-light text-ink hover:border-ink"
                  }`}
                >
                  All
                </button>
                {AVAILABLE_SIZES.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSizeFilter(s)}
                    className={`h-8 w-8 rounded-full border text-caption transition-colors duration-300 ${
                      sizeFilter === s
                        ? "border-ink bg-ink text-ivory"
                        : "border-stone-light text-ink hover:border-ink"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {!loading && error && (
            <p className="py-12 text-sm text-red-500">{error}</p>
          )}

          {!loading && !error && products.length === 0 && (
            <p className="py-12 text-sm text-stone">No products available.</p>
          )}

          {!loading && products.length > 0 && (
            <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4 md:gap-x-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}