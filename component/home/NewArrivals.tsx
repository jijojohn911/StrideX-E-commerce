"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

import ProductCard, {
  ProductCardData,
} from "@/component/products/ProductCard";

interface ApiProduct {
  _id: string;
  title: string;
  price: number;
  images: string[];
  slug: string;
  discountPrice?:number;
}

export default function NewArrivals() {
  const [products, setProducts] = useState<ProductCardData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNewArrivals = async () => {
      try {
const response = await fetch("/api/products?limit=4");

        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }

        const data = await response.json();

     const latestProducts = data.products.map((product: ApiProduct) => ({
  id: product._id,
  name: product.title,
  price: product.discountPrice ?? product.price,
  image: product.images[0],
  href: `/products/${product.slug}`,
}));
        setProducts(latestProducts);
      } catch (error) {
        console.error("Failed to load new arrivals:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNewArrivals();
  }, []);

  return (
    <section className="section-y bg-ink/85">
      <div className="container-stridex">

        {/* Section heading */}
        <div className="mb-10 flex items-end justify-between gap-6">
          <div>
            <p className="eyebrow mb-3 text-(--color-champagne)">
              Just In
            </p>

            <h2 className="display-headline text-display-lg text-(--color-ivory)">
              New Arrivals
            </h2>

            <p className="mt-4 max-w-md text-sm leading-6 text-(--color-stone-light)">
              The latest silhouettes from StrideX.
            </p>
          </div>

          <Link
            href="/products"
            className="group hidden items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-(--color-ivory) transition-colors duration-300 hover:text-(--color-champagne) sm:flex"
          >
            View All
            <ArrowRight
              size={16}
              strokeWidth={1.5}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </Link>
        </div>

        {/* Loading */}
        {loading && (
          <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4 md:gap-x-6">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
               className="relative aspect-square overflow-hidden bg-(--color-stone-light)"
              />
            ))}
          </div>
        )}

        {/* Products */}
        {!loading && products.length > 0 && (
          <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4 md:gap-x-6">
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.15 }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.08,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && products.length === 0 && (
          <p className="py-10 text-sm text-(--color-stone-light)">
            New arrivals coming soon.
          </p>
        )}

        {/* Mobile CTA */}
        <Link
          href="/products"
          className="group mt-8 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-(--color-ivory) sm:hidden"
        >
          View All
          <ArrowRight
            size={16}
            strokeWidth={1.5}
            className="transition-transform duration-300 group-hover:translate-x-1"
          />
        </Link>
      </div>
    </section>
  );
}