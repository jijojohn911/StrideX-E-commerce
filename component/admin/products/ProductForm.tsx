"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { X, Plus, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductFormValues {
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

const emptyValues: ProductFormValues = {
  title: "",
  description: "",
  brand: "",
  category: "",
  gender: "unisex",
  price: 0,
  discountPrice: undefined,
  images: [],
  sizes: [],
  colors: [],
  stock: 0,
  featured: false,
  slug: "",
};

function slugify(text: string) {
  return text.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
}

export function ProductForm({
  mode,
  initialValues,
}: {
  mode: "create" | "edit";
  initialValues?: Partial<ProductFormValues> & { slug: string };
}) {
  const router = useRouter();
  const [values, setValues] = useState<ProductFormValues>({ ...emptyValues, ...initialValues });
  const [slugEdited, setSlugEdited] = useState(mode === "edit");
  const [sizeInput, setSizeInput] = useState("");
  const [colorInput, setColorInput] = useState("");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const setField = <K extends keyof ProductFormValues>(key: K, value: ProductFormValues[K]) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleTitleChange = (title: string) => {
    setField("title", title);
    if (!slugEdited) setField("slug", slugify(title));
  };

  const addTag = (input: string, setInput: (v: string) => void, field: "sizes" | "colors") => {
    const trimmed = input.trim();
    if (!trimmed) return;
    if (!values[field].includes(trimmed)) setField(field, [...values[field], trimmed]);
    setInput("");
  };

  const removeTag = (field: "sizes" | "colors", tag: string) => {
    setField(field, values[field].filter((t) => t !== tag));
  };

  const handleImageUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    setError("");
    try {
      const uploaded: string[] = [];
      for (const file of Array.from(files)) {
        const formData = new FormData();
        formData.append("file", file);
        const res = await fetch("/api/upload", { method: "POST", body: formData });
        const data = await res.json();
        if (!res.ok || !data.success) throw new Error(data.message || "Upload failed");
        uploaded.push(data.result.secure_url);
      }
      setField("images", [...values.images, ...uploaded]);
    } catch (err) {
      console.error(err);
      setError("Image upload failed. Try again.");
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (url: string) => {
    setField("images", values.images.filter((i) => i !== url));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (values.images.length === 0) return setError("At least one image is required");
    if (values.sizes.length === 0) return setError("At least one size is required");
    if (values.colors.length === 0) return setError("At least one color is required");

    setSaving(true);
    try {
      const payload = {
        ...values,
        category: values.category.toLowerCase(),
        discountPrice: values.discountPrice || undefined,
      };

      const url = mode === "create" ? "/api/products" : `/api/products/${initialValues?.slug}`;
      const method = mode === "create" ? "POST" : "PUT";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.message || "Something went wrong");
        return;
      }

      router.push("/admin/products");
      router.refresh();
    } catch (err) {
      console.error(err);
      setError("Network error. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-md border border-destructive/30 bg-destructive-soft px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <section className="rounded-lg border border-border bg-card p-5 shadow-[var(--shadow-subtle)]">
        <h2 className="mb-4 text-sm font-semibold">Basic Info</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Title</label>
            <input
              value={values.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              required minLength={3} maxLength={50}
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-champagne"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Slug</label>
            <input
              value={values.slug}
              onChange={(e) => { setSlugEdited(true); setField("slug", slugify(e.target.value)); }}
              required
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-champagne"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Description</label>
            <textarea
              value={values.description}
              onChange={(e) => setField("description", e.target.value)}
              required minLength={3} maxLength={1000} rows={4}
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-champagne"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Brand</label>
            <input
              value={values.brand}
              onChange={(e) => setField("brand", e.target.value)}
              required minLength={3} maxLength={50}
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-champagne"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Category</label>
            <input
              value={values.category}
              onChange={(e) => setField("category", e.target.value)}
              required
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-champagne"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Gender</label>
            <select
              value={values.gender}
              onChange={(e) => setField("gender", e.target.value as ProductFormValues["gender"])}
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-champagne"
            >
              <option value="men">Men</option>
              <option value="women">Women</option>
              <option value="unisex">Unisex</option>
            </select>
          </div>
          <div className="flex items-center gap-2 pt-6">
            <input
              id="featured" type="checkbox"
              checked={values.featured}
              onChange={(e) => setField("featured", e.target.checked)}
              className="h-4 w-4 rounded border-border"
            />
            <label htmlFor="featured" className="text-sm">Featured product</label>
          </div>
        </div>
      </section>

      <section className="rounded-lg border border-border bg-card p-5 shadow-[var(--shadow-subtle)]">
        <h2 className="mb-4 text-sm font-semibold">Pricing & Stock</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Price (₹)</label>
            <input
              type="number" min={0} value={values.price}
              onChange={(e) => setField("price", Number(e.target.value))}
              required
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-champagne"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Discount Price (₹)</label>
            <input
              type="number" min={0} value={values.discountPrice ?? ""}
              onChange={(e) => setField("discountPrice", e.target.value ? Number(e.target.value) : undefined)}
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-champagne"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Stock</label>
            <input
              type="number" min={0} value={values.stock}
              onChange={(e) => setField("stock", Number(e.target.value))}
              required
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-champagne"
            />
          </div>
        </div>
      </section>

      <section className="rounded-lg border border-border bg-card p-5 shadow-[var(--shadow-subtle)]">
        <h2 className="mb-4 text-sm font-semibold">Sizes & Colors</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Sizes</label>
            <div className="flex gap-2">
              <input
                value={sizeInput}
                onChange={(e) => setSizeInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTag(sizeInput, setSizeInput, "sizes"); } }}
                placeholder="e.g. UK 8"
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-champagne"
              />
              <button type="button" onClick={() => addTag(sizeInput, setSizeInput, "sizes")} className="shrink-0 rounded-md border border-border px-3 text-sm hover:bg-secondary">
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {values.sizes.map((size) => (
                <span key={size} className="inline-flex items-center gap-1 rounded-full bg-secondary px-2.5 py-1 text-xs">
                  {size}
                  <button type="button" onClick={() => removeTag("sizes", size)}><X className="h-3 w-3" /></button>
                </span>
              ))}
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Colors</label>
            <div className="flex gap-2">
              <input
                value={colorInput}
                onChange={(e) => setColorInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTag(colorInput, setColorInput, "colors"); } }}
                placeholder="e.g. Black"
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-champagne"
              />
              <button type="button" onClick={() => addTag(colorInput, setColorInput, "colors")} className="shrink-0 rounded-md border border-border px-3 text-sm hover:bg-secondary">
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {values.colors.map((color) => (
                <span key={color} className="inline-flex items-center gap-1 rounded-full bg-secondary px-2.5 py-1 text-xs">
                  {color}
                  <button type="button" onClick={() => removeTag("colors", color)}><X className="h-3 w-3" /></button>
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-lg border border-border bg-card p-5 shadow-[var(--shadow-subtle)]">
        <h2 className="mb-4 text-sm font-semibold">Images</h2>
        <div className="flex flex-wrap gap-3">
          {values.images.map((url) => (
            <div key={url} className="relative h-24 w-24 overflow-hidden rounded-md border border-border">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt="" className="h-full w-full object-cover" />
              <button type="button" onClick={() => removeImage(url)} className="absolute right-1 top-1 grid h-5 w-5 place-items-center rounded-full bg-black/60 text-white">
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
          <label className="grid h-24 w-24 cursor-pointer place-items-center rounded-md border border-dashed border-border text-xs text-muted-foreground hover:bg-secondary">
            {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Add image"}
            <input type="file" accept="image/*" multiple className="hidden" onChange={(e) => handleImageUpload(e.target.files)} disabled={uploading} />
          </label>
        </div>
      </section>

      <div className="flex justify-end gap-3">
        <button type="button" onClick={() => router.push("/admin/products")} className="rounded-md border border-border px-4 py-2 text-sm hover:bg-secondary">
          Cancel
        </button>
        <button
          type="submit" disabled={saving || uploading}
          className={cn(
            "rounded-md bg-ink px-5 py-2 text-sm font-medium text-ivory transition-colors hover:bg-champagne hover:text-ink",
            (saving || uploading) && "cursor-not-allowed opacity-50",
          )}
        >
          {saving ? "Saving..." : mode === "create" ? "Create Product" : "Save Changes"}
        </button>
      </div>
    </form>
  );
}