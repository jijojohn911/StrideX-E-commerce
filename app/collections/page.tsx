import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const COLLECTIONS = [
  {
    title: "LIFE STYLE",
    description: "Everyday style. Maximum comfort",
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

export default function CollectionsPage() {
  return (
    <div className="bg-ivory">
      <section className="section-y">
        <div className="container-stridex">
          <p className="eyebrow mb-3 text-champagne">StrideX</p>
          <h1 className="display-headline text-display-lg text-ink mb-10">
            All Collections
          </h1>

          <div className="grid gap-6 md:grid-cols-3">
            {COLLECTIONS.map((collection) => (
              <Link
                key={collection.title}
                href={collection.href}
                className="group block"
              >
                <div className="relative aspect-4/3 overflow-hidden rounded-lg bg-stone-light">
                  <Image
                    src={collection.image}
                    alt={`${collection.title} collection`}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>

                <div className="mt-4">
                  <p className="display-headline text-2xl text-ink">
                    {collection.title}
                  </p>
                  <p className="mt-1 text-sm leading-5 text-stone">
                    {collection.description}
                  </p>
                  <div className="mt-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-ink">
                    Shop Now
                    <ArrowRight size={15} strokeWidth={1.5} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}