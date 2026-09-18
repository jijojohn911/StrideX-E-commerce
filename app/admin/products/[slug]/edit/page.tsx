"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ProductForm } from "@/component/admin/products/ProductForm";

interface ProductInitialValues {
  title: string;
  description: string;
  brand: string;
  category: string;
  gender: "men" | "women" | "unisex";
  price: number;
  discountPrice?: number;
  images: string[];
  sizes: string[];
  colors: string[];
  stock: number;
  featured: boolean;
  slug: string;
}

export default function EditProductPage() {
  const params = useParams<{ slug: string }>();
  const [initialValues, setInitialValues] = useState<ProductInitialValues | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/products/${params.slug}`);
        const data = await res.json();
        if (!res.ok || !data.success) {
          setError(data.message || "Product not found");
          return;
        }
        setInitialValues(data.product);
      } catch (err) {
        console.error(err);
        setError("Network error");
      }
    }
    load();
  }, [params.slug]);

  if (error) return <p className="px-1 py-6 text-sm text-destructive">{error}</p>;
  if (!initialValues) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-ink" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold">Edit Product</h1>
        <p className="text-sm text-muted-foreground">{initialValues.title}</p>
      </div>
      <ProductForm mode="edit" initialValues={initialValues} />
    </div>
  );
}