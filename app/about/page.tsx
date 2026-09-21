import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/component/layout/Navbar";
import Footer from "@/component/layout/Footer";

export const metadata: Metadata = {
  title: "Our Story | StrideX",
  description:
    "StrideX designs premium footwear for everyday movement. Learn about our story and what we believe in.",
};

const values = [
  {
    title: "Built to Perform",
    text: "Every pair is shaped around comfort, grip and support, so it keeps up with you from the first step to the last mile.",
  },
  {
    title: "Designed with Care",
    text: "Clean lines, honest materials and details that last. We would rather make fewer things well than many things quickly.",
  },
  {
    title: "Made for Every Day",
    text: "Premium does not have to mean precious. Our shoes are made to be worn, on the road, at work and everywhere in between.",
  },
];

export default function AboutPage() {
  return (
    <>
      <Navbar cartCount={0} />

      <main className="pb-28 pt-40 text-(--color-ink)">
        <div className="container-stridex">
          {/* Hero */}
          <section className="max-w-3xl">
            <p className="eyebrow mb-5 text-(--color-champagne)">Our Story</p>
            <h1 className="font-display text-5xl leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
              Move Different.
            </h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-(--color-stone)">
              StrideX is premium footwear designed for everyday movement.
              Performance you can feel, design you will want to be seen in.
            </p>
          </section>

          {/* Story */}
          <section className="mt-24 grid gap-10 border-t border-black/10 pt-16 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
            <h2 className="font-display text-3xl tracking-tight sm:text-4xl">
              Where it started
            </h2>
            <div className="space-y-5 text-base leading-7 text-(--color-stone)">
              <p>
                StrideX began with a simple frustration: shoes were either
                built for performance or designed to look good, rarely both. We
                wanted one pair that could handle a morning run, a long day on
                your feet and an evening out.
              </p>
              <p>
                So we started from the ground up. We focused on cushioning that
                feels right, materials that hold up, and silhouettes that stay
                relevant season after season.
              </p>
              <p>
                Today, StrideX brings together our Performance, Lifestyle and
                Signature collections, each made with the same idea in mind:
                footwear that moves the way you do.
              </p>
            </div>
          </section>

          {/* Values */}
          <section className="mt-24">
            <p className="eyebrow mb-5 text-(--color-champagne)">
              What we believe
            </p>
            <div className="grid gap-6 md:grid-cols-3">
              {values.map((item, index) => (
                <div
                  key={item.title}
                  className="rounded-lg border border-black/10 p-8 transition-colors duration-300 hover:border-black/30"
                >
                  <span className="font-display text-3xl text-(--color-champagne)">
                    0{index + 1}
                  </span>
                  <h3 className="mt-6 font-display text-2xl tracking-tight">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-(--color-stone)">
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* CTA */}
          <section className="mt-24 rounded-lg bg-(--color-ink) px-8 py-16 text-center text-(--color-ivory) sm:px-16">
            <h2 className="font-display text-3xl tracking-tight sm:text-4xl">
              Find your next pair
            </h2>
            <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-(--color-stone-light)">
              Explore the collections and see what moves you.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link
                href="/products"
                className="rounded-md bg-(--color-ivory) px-6 py-3 text-sm font-medium text-(--color-ink) transition-opacity hover:opacity-90"
              >
                Shop All
              </Link>
              <Link
                href="/collection/lifestyle"
                className="rounded-md border border-white/25 px-6 py-3 text-sm transition-colors hover:bg-white/10"
              >
                View Collections
              </Link>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
}