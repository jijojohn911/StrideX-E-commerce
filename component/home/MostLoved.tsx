import Link from "next/link";
import { ArrowRight } from "lucide-react";
import ProductGrid from "@/component/products/ProductGrid";
import { ProductCardData } from "@/component/products/ProductCard";

interface ApiProduct {
  _id: string;
  title: string;
  price: number;
  discountPrice?: number;
  images: string[];
  slug: string;
}

async function getMostLoved(): Promise<ProductCardData[]> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/products?featured=true&limit=5`,
    { cache: "no-store" },
  );
  const data = await res.json();

  return data.products.map((p: ApiProduct) => ({
    id: p._id,
    name: p.title,
    price: p.discountPrice ?? p.price,
    image: p.images[0],
    href: `/products/${p.slug}`,
  }));
}

export default async function MostLoved() {
  const products = await getMostLoved();

  return (
    <section className="section-y bg-(--color-ivory)">
      <div className="container-stridex">
        <div className="mb-8 flex items-end justify-between gap-6 md:mb-10">
          <div>
            <p className="eyebrow mb-3 text-(--color-champagne)">Popular Picks</p>
            <h2 className="display-headline text-display-lg text-(--color-ink)">Most Loved</h2>
          </div>

          <Link
            href="/products"
            className="group hidden items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-(--color-ink) transition-colors duration-300 hover:text-(--color-champagne) sm:flex"
          >
            View All
            <ArrowRight size={16} strokeWidth={1.5} className="transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>

        <ProductGrid products={products} />
      </div>
    </section>
  );
}