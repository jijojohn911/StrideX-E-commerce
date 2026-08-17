"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

export default function BrandStory() {
  return (
    <section className="section-y bg-[var(--color-ivory)]">
      <div className="container-stridex">
        <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20">

          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{
              duration: 0.8,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="relative overflow-hidden rounded-3xl "
          >
            <div className="relative aspect-[4/3]">
              <Image
                src="/images/premium-shoe.png"
                alt="StrideX footwear philosophy"
                fill
                sizes="(max-width: 1024px) 100vw, 55vw"
                className="object-cover transition-transform duration-700 ease-out hover:scale-105"
              />
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{
              duration: 0.8,
              delay: 0.1,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            <p className="eyebrow mb-5 text-[var(--color-champagne)]">
              The StrideX Philosophy
            </p>

            <h2 className="display-headline text-display-lg text-[var(--color-ink)]">
              MOVE
              <br />
              WITH INTENT.
            </h2>

            <p className="mt-7 max-w-md text-base leading-7 text-[var(--color-stone)]">
              StrideX was created around a simple idea — movement should feel
              effortless. We combine considered design, premium materials, and
              everyday performance to create footwear made for wherever you go.
            </p>

            <Link
              href="/about"
              className="group mt-8 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-ink)]"
            >
              Our Story

              <ArrowUpRight
                size={16}
                strokeWidth={1.5}
                className="transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1"
              />
            </Link>
          </motion.div>

        </div>
      </div>
    </section>
  );
}