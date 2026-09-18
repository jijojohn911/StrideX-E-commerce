import { ProductForm } from "@/component/admin/products/ProductForm";

export default function NewProductPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold">Add Product</h1>
        <p className="text-sm text-muted-foreground">
          Create a new StrideX product
        </p>
      </div>
      <ProductForm mode="create" />
    </div>
  );
}
