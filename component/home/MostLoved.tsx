import Link from "next/link";
import { ArrowRight } from "lucide-react";
import ProductGrid from "@/component/products/ProductGrid";
import { ProductCardData } from "@/component/products/ProductCard";
import Product from "@/models/Product";
import { connectDB } from "@/lib/mongodb";

async function getMostLoved(): Promise<ProductCardData[]> {
  try {
    await connectDB();

    const products = await Product.find({ isActive: true, featured: true })
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    return products.map((p: any) => ({
      id: String(p._id),
      name: p.title,
      price: p.discountPrice ?? p.price,
      image: p.images?.[0],
      href: `/products/${p.slug}`,
    }));
  } catch (error) {
    console.error("Failed to load most loved:", error);
    return [];
  }
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

        {products.length === 0 ? (
          <p className="py-10 text-sm text-(--color-stone)">Popular picks coming soon.</p>
        ) : (
          <ProductGrid products={products} />
        )}
      </div>
    </section>
  );
}