"use client";

import { useEffect, useState } from "react";
import ProductCard, { ProductCardData } from "./ProductCard";


interface ApiProduct {
  _id: string;
  title: string;
  price: number;
  discountPrice?: number;
  images: string[];
  slug: string;
}

interface ProductListingProps {
  gender?: "men" | "women";
  eyebrow: string;
  title: string;
  description: string;
}

export default function ProductListing({
  gender,
  eyebrow,
  title,
  description,
}: ProductListingProps) {
  const [products, setProducts] = useState<ProductCardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const query = gender ? `?gender=${gender}` : "";
        const response = await fetch(`/api/products${query}`);

        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        const data = await response.json();

        const formattedProducts = data.products.map((product: ApiProduct) => ({
          id: product._id,
          name: product.title,
          price: product.discountPrice ?? product.price,
          image: product.images[0],
          href: `/products/${product.slug}`,
        }));

        setProducts(formattedProducts);
      } catch (error) {
        console.error(error);
        setError("Failed to load products. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [gender]);

  return (
    <div className="bg-ivory">
      <section className="section-y">
        <div className="container-stridex">
          <div className="mb-10">
            <p className="eyebrow mb-3 text-champagne">{eyebrow}</p>
            <h1 className="display-headline text-display-lg text-ink">
              {title}
            </h1>

            <p className="mt-4 max-w-md text-sm leading-6 text-stone">
              {description}
            </p>
          </div>
          {!loading && error && (
            <p className="py-12 text-sm text-red-500">{error}</p>
          )}

          {!loading && !error && products.length === 0 && (
            <p className="py-12 text-sm text-stone">No products available.</p>
          )}

          {!loading && products.length > 0 && (
            <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4 md:gap-x-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
