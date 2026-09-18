"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { AdminCard } from "@/component/admin/AdminCard";

interface AdminProduct {
  _id: string;
  title: string;
  brand: string;
  category: string;
  price: number;
  discountPrice?: number;
  stock: number;
  images: string[];
  slug: string;
  isActive: boolean;
}

const inr = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 });

export default function AdminProductsPage() {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [busySlug, setBusySlug] = useState<string | null>(null);

  const load = useCallback(async (q: string) => {
    setLoading(true);
    try {
      const url = q
        ? `/api/admin/products?search=${encodeURIComponent(q)}`
        : "/api/admin/products";
      const res = await fetch(url, { credentials: "include" });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.message || "Failed to load products");
        return;
      }
      setProducts(data.products);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => load(search), 350);
    return () => clearTimeout(timer);
  }, [search, load]);

  const handleDelete = (slug: string, title: string) => {
    toast("Delete this product?", {
      description: `"${title}" will be hidden from the store.`,
      action: {
        label: "Delete",
        onClick: async () => {
          setBusySlug(slug);
          try {
            const res = await fetch(`/api/products/${slug}`, { method: "DELETE", credentials: "include" });
            const data = await res.json();
            if (!res.ok || !data.success) {
              toast.error(data.message || "Failed to delete product");
              return;
            }
            toast.success("Product deleted");
            load(search);
          } catch (err) {
            console.error(err);
            toast.error("Network error");
          } finally {
            setBusySlug(null);
          }
        },
      },
      cancel: { label: "Cancel", onClick: () => {} },
    });
  };

  const handleRestore = async (slug: string) => {
    setBusySlug(slug);
    try {
      const res = await fetch(`/api/products/${slug}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: true }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        toast.error(data.message || "Failed to restore product");
        return;
      }
      toast.success("Product restored");
      load(search);
    } catch (err) {
      console.error(err);
      toast.error("Network error");
    } finally {
      setBusySlug(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold">Products</h1>
          <p className="text-sm text-muted-foreground">Manage the StrideX catalog</p>
        </div>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-2 rounded-md bg-ink px-4 py-2 text-sm font-medium text-ivory transition-colors hover:bg-champagne hover:text-ink"
        >
          <Plus className="h-4 w-4" />
          Add Product
        </Link>
      </div>

      <AdminCard
        title="All Products"
        description={`${products.length} product${products.length === 1 ? "" : "s"}`}
        bodyClassName="p-0"
        action={
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            className="w-56 rounded-md border border-border bg-background px-3 py-1.5 text-xs outline-none focus:border-champagne"
          />
        }
      >
        {error && <p className="px-5 py-4 text-sm text-destructive">{error}</p>}
        {!error && loading && (
          <p className="px-5 py-6 text-center text-xs text-muted-foreground">Loading...</p>
        )}

        {!error && !loading && (
          <div className="w-full overflow-x-auto">
            <table className="w-full min-w-190 text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs uppercase tracking-widest text-muted-foreground">
                  <th scope="col" className="px-5 py-3 font-medium">Product</th>
                  <th scope="col" className="px-5 py-3 font-medium">Brand</th>
                  <th scope="col" className="px-5 py-3 font-medium">Category</th>
                  <th scope="col" className="px-5 py-3 font-medium">Price</th>
                  <th scope="col" className="px-5 py-3 font-medium">Stock</th>
                  <th scope="col" className="px-5 py-3 font-medium">Status</th>
                  <th scope="col" className="px-5 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-5 py-6 text-center text-xs text-muted-foreground">
                      No products found
                    </td>
                  </tr>
                )}
                {products.map((product) => (
                  <tr key={product._id} className="border-b border-border last:border-0 hover:bg-secondary/50">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 shrink-0 overflow-hidden rounded-md border border-border bg-secondary">
                          {product.images[0] && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={product.images[0]} alt="" className="h-full w-full object-cover" />
                          )}
                        </div>
                        <span className="max-w-55 truncate font-medium">{product.title}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-muted-foreground">{product.brand}</td>
                    <td className="px-5 py-3 capitalize text-muted-foreground">{product.category}</td>
                    <td className="px-5 py-3">
                      {product.discountPrice ? (
                        <span>
                          <span className="font-medium">₹{inr.format(product.discountPrice)}</span>{" "}
                          <span className="text-xs text-muted-foreground line-through">
                            ₹{inr.format(product.price)}
                          </span>
                        </span>
                      ) : (
                        <span className="font-medium">₹{inr.format(product.price)}</span>
                      )}
                    </td>
                    <td className="px-5 py-3">{product.stock}</td>
                    <td className="px-5 py-3">
                      <span
                        className={
                          product.isActive
                            ? "inline-flex items-center rounded-full bg-success-soft px-2 py-0.5 text-xs font-medium text-success"
                            : "inline-flex items-center rounded-full bg-destructive-soft px-2 py-0.5 text-xs font-medium text-destructive"
                        }
                      >
                        {product.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex justify-end gap-2">
                        <Link
                          href={`/admin/products/${product.slug}/edit`}
                          className="grid h-8 w-8 place-items-center rounded-md border border-border hover:bg-secondary"
                          aria-label={`Edit ${product.title}`}
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </Link>
                        {product.isActive ? (
                          <button
                            type="button"
                            onClick={() => handleDelete(product.slug, product.title)}
                            disabled={busySlug === product.slug}
                            className="grid h-8 w-8 place-items-center rounded-md border border-border text-destructive hover:bg-destructive-soft disabled:opacity-50"
                            aria-label={`Delete ${product.title}`}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleRestore(product.slug)}
                            disabled={busySlug === product.slug}
                            className="grid h-8 w-8 place-items-center rounded-md border border-border text-success hover:bg-success-soft disabled:opacity-50"
                            aria-label={`Restore ${product.title}`}
                          >
                            <RotateCcw className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </AdminCard>
    </div>
  );
}