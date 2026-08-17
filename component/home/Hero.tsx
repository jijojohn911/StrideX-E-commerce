"use client";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import "@/app/globals.css";

const Hero = () => {
  return (
    <section className="relative min-h-[calc(100svh-76px)] overflow-hidden bg-[var(--color-ivory)] text-[var(--color-ink)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_45%,rgba(195,160,107,0.08),transparent_45%)]" />
      <div className="container-stridex relative z-10 flex min-h-[calc(100svh-76px)] items-center">
        <div className="grid w-full items-center gap-10 py-16 lg:grid-cols-[0.85fr_1.15fr] lg:gap-4 lg:py-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-20"
          >
            <p className="eyebrow mb-6 text-(--color-champagne)">
              Premium Footwear, Exceptional You
            </p>

            <h1 className="display-headline  text-display-lg text-(--color-ink) flex flex-col">
              Elevate
              <span className="block">Every Step</span>
            </h1>

            <p className="flex flex-col mt-7 max-w-md text-sm leading-6 text-(--color-stone) sm:text-base">
              Expertly crafted sneakers that blend
              <span className="block">innovation, comfort and timeless style.</span>
            </p>

            <div className="mt-9 mb-5 flex flex-col items-start gap-4 sm:mb-0 sm:flex-row sm:items-center">
              <Link
                href="/collections"
                className="btn group bg-[var(--color-ink)] text-[var(--color-ivory)] hover:bg-[var(--color-champagne)] hover:text-[var(--color-ink)]"
              >
                Shop Collection
                <ArrowRight size={16} strokeWidth={1.5} className="transition-transform duration-300 group-hover:translate-x-1" />
              </Link>

              <Link
                href="/new-arrivals"
                className="btn btn-outline group border-[var(--color-ink)] text-[var(--color-ink)] hover:border-(--color-champagne) hover:text-(--color-champagne)"
              >
                Explore New Arrivals
                <ArrowRight size={16} strokeWidth={1.5} />
              </Link>
            </div>
          </motion.div>

 <motion.div
  initial={{ opacity: 0, scale: 0.92, x: 30 }}
  animate={{ opacity: 1, scale: 1, x: 0 }}
  transition={{ duration: 2, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
  className="relative flex items-center justify-center mt-10 lg:mt-0"
>
 
  
  <div className="absolute h-32 w-32 rounded-full bg-(--color-champagne)/20 blur-3xl translate-y-16" />

  <Image
    src="/images/shoe-new.png"
    alt="StrideX premium signature sneaker"
    width={1000}
    height={750}
    priority
    className="relative top-5 sm:h-[480px] sm:w-[510px] rounded-full drop-shadow-[0_35px_25px_rgba(0,0,0,0.5)]"
  />

  
</motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

