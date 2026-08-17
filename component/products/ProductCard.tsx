"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

export interface ProductCardData {
  id: string;
  name: string;
  price: number;
  image: string;
  href: string;
}

export default function ProductCard({ product }: { product: ProductCardData }) {
  const [isWishlisted, setIsWishlisted] = useState(false);

  return (
    <div className="group">
      <Link href={product.href} className="block">
        <div className="relative aspect-square overflow-hidden rounded-4xl bg-(--color-stone-light)">
          <motion.div
            whileHover={{ scale: 1.06 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="relative h-full w-full"
          >
            <Image
              src={product.image}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 50vw, 20vw"
              className="object-contain  p-6"
            />
          </motion.div>

          {/* Wishlist toggle */}
          <button
            type="button"
            aria-label="Add to wishlist"
            onClick={(e) => {
              e.preventDefault();
              setIsWishlisted((prev) => !prev);
            }}
            className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-(--color-ivory) text-(--color-ink) transition-colors duration-300 hover:text-(--color-champagne)"
          >
            <Heart
              size={15}
              strokeWidth={1.5}
              fill={isWishlisted ? "currentColor" : "none"}
              className={isWishlisted ? "text-(--color-champagne)" : ""}
            />
          </button>
        </div>
      </Link>

      <div className="mt-4 flex items-start justify-between gap-2">
        <div>
          <Link href={product.href}>
            <p className="text-sm font-medium text-(--color-ink)">{product.name}</p>
          </Link>
          <p className="mt-1 text-sm text-(--color-stone)">
            ₹{product.price.toLocaleString("en-IN")}
          </p>
        </div>

        <button
          type="button"
          aria-label={`Add ${product.name} to bag`}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-(--color-stone-light) text-(--color-ink) transition-colors duration-300 hover:border-(--color-champagne) hover:text-(--color-champagne)"
        >
          <ShoppingBag size={14} strokeWidth={1.5} />
        </button>
      </div>
    </div>
  );
}