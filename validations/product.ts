import { z } from "zod";

const baseProductSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Title must be at least 3 characters")
    .max(50, "Title cannot exceed 50 characters"),

  description: z
    .string()
    .trim()
    .min(3, "Description must be at least 3 characters")
    .max(100, "Description cannot exceed 100 characters"),

  price: z
    .number()
    .min(0, "Price cannot be negative"),

  discountPrice: z
    .number()
    .min(0, "Discount price cannot be negative")
    .optional(),

  brand: z
    .string()
    .trim()
    .min(3, "Brand must be at least 3 characters")
    .max(50, "Brand cannot exceed 50 characters"),

  category: z
    .string()
    .trim()
    .min(3, "Category is required"),

  gender: z.enum(["men", "women", "unisex"]),

  images: z
    .array(z.string().url("Invalid image URL"))
    .min(1, "At least one product image is required"),

  sizes: z
    .array(z.string())
    .min(1, "At least one size is required"),

  colors: z
    .array(z.string())
    .min(1, "At least one color is required"),

  stock: z
    .number()
    .int()
    .min(0, "Stock cannot be negative"),

  featured: z
    .boolean()
    .optional()
    .default(false),

  slug: z
    .string()
    .trim()
    .min(3, "Slug is required")
    .max(100),

  isActive: z
    .boolean()
    .optional()
    .default(true),
});

export const createProductSchema = baseProductSchema.refine(
  (data) =>
    data.discountPrice == null || data.discountPrice < data.price,
  {
    message: "Discount price must be less than regular price",
    path: ["discountPrice"],
  }
);

export const updateProductSchema = baseProductSchema.partial();