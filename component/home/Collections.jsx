"use client";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const COLLECTIONS = [
  {
    title: "LIFE STYLE",
    description: "Everyday style. Maximum comfort.",
    image: "/images/Lifestyle_shoe.png",
    href: "/collection/lifestyle",
  },
  {
    title: "PERFORMANCE",
    description: "Built for speed. Made for intensity",
    image: "/images/performance-shoe.png",
    href: "/collection/performance",
  },
  {
    title: "SIGNATURE",
    description: "Premium design. Timeless appeal",
    image: "/images/premium-shoe.png",
    href: "/collection/premium",
  },
];

const Collections = () => {
  return (
    <section className="section-y bg-(--color-stone-light)">
      <div className="container-stridex">
        <div className="flex items-end mb-8 justify-between gap-6 md:mb-10">
          <div>
            <p className="eyebrow mb-3 text-(--color-champagne)">
              StrideX Collection
            </p>
            <h2 className="display-headline text-display-lg text-(--color-ink)">
              Find Your Perfect Pair
            </h2>
          </div>

          <Link
            href="/collections"
            className="group hidden items-center gap-2 text-xs font-semibold uppercase tracking-tight text-(--color-ink) transition-colors duration-300 hover:text-(--color-champagne) sm:flex"
          >
            View All Collections
            <ArrowRight
              size={16}
              strokeWidth={1.5}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {COLLECTIONS.map((collection, index) => (
            <motion.div
              key={collection.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{
                duration: 0.7,
                delay: index * 0.08,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              <Link href={collection.href} className="group block">
                <div className="relative aspect-4/3 overflow-hidden rounded-lg bg-(--color-stone-light)">
                  <motion.div
                    whileHover={{ scale: 1.06 }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className="relative h-full w-full"
                  >
                    <Image
                      src={collection.image}
                      alt={`${collection.title} collection`}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover"
                    />
                  </motion.div>
                </div>

                {/* Text below the card, on the page background */}
                <div className="mt-4">
                  <p className="display-headline text-2xl text-(--color-ink)">
                    {collection.title}
                  </p>
                  <p className="mt-1 text-sm leading-5 text-(--color-stone)">
                    {collection.description}
                  </p>
                  <div className="mt-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-(--color-ink)">
                    Shop Now
                    <ArrowRight
                      size={15}
                      strokeWidth={1.5}
                      className="transition-transform duration-300 group-hover:translate-x-1"
                    />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Collections;
