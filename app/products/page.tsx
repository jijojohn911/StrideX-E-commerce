"use client";

import { useEffect, useState } from "react";
import ProductCard, { ProductCardData } from "@/component/products/ProductCard";

interface ApiProduct {
  _id: string;
  title: string;
  price: number;
  images: string[];
  slug: string;
}

const ProductPage = () => {
  const [products, setProducts] = useState<ProductCardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/products");

        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        const data = await response.json();

        const formattedProducts = data.products.map((product: ApiProduct) => ({
          id: product._id,
          name: product.title,
          price: product.price,
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
  }, []);

  return (
    <div className="bg-ivory">
      <section className="section-y">
        <div className="container-stridex">
          <div className="mb-10">
            <p className="eyebrow mb-3 text-champagne">StrideX Collection</p>

            <h1 className="display-headline text-display-lg text-ink">
              All Products
            </h1>

            <p className="mt-4 max-w-md text-sm leading-6 text-stone ">
              Explore the latest footwear designed for everyday movement
            </p>
          </div>

          {!loading && error && (
            <p className="py-12 text-sm text-red-500">{error}</p>
          )}

          {!loading && !error && products.length === 0 && (
            <p className="py-12 text-sm text-stone">No products available.</p>
          )}

          {/* products */}

          {!loading && products.length > 0 && (
            <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4 md:gap-x-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          {/* empty loading*/}
          {!loading && products.length === 0 && (
            <p className="py-12 text-sm text-stone">No products Available</p>
          )}
        </div>
      </section>
    </div>
  );
};

export default ProductPage;
