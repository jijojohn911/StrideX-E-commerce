"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import ProductCard, { ProductCardData } from "@/component/products/ProductCard";

const MOST_LOVED: ProductCardData[] = [
  { id: "1", name: "Air Zip 270", price: 4200, image: "/images/products/air-zip-270.png", href: "/products/air-zip-270" },
  { id: "2", name: "Stride OG 002", price: 4600, image: "/images/products/stride-og-002.png", href: "/products/stride-og-002" },
  { id: "3", name: "New Chek 550", price: 3900, image: "/images/products/new-chek-550.png", href: "/products/new-chek-550" },
  { id: "4", name: "Retro Jump 1", price: 5750, image: "/images/products/retro-jump-1.png", href: "/products/retro-jump-1" },
  { id: "5", name: "Signature Runner", price: 4550, image: "/images/products/signature-runner.png", href: "/products/signature-runner" },
];

export default function MostLoved() {
  return (
    <section className="section-y bg-[var(--color-ivory)]">
      <div className="container-stridex">
        <div className="mb-8 flex items-end justify-between gap-6 md:mb-10">
          <div>
            <p className="eyebrow mb-3 text-[var(--color-champagne)]">Popular Picks</p>
            <h2 className="display-headline text-display-lg text-[var(--color-ink)]">Most Loved</h2>
          </div>

          <Link
            href="/shop"
            className="group hidden items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-ink)] transition-colors duration-300 hover:text-[var(--color-champagne)] sm:flex"
          >
            View All
            <ArrowRight size={16} strokeWidth={1.5} className="transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 lg:grid-cols-5">
          {MOST_LOVED.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 0.6, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>

       
      </div>
    </section>
  );
}