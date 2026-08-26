import { z } from "zod";

export const createProductSchema = z
  .object({
    name: z.string().trim().min(1, "El nombre es obligatorio").max(120),
    kind: z.literal("simple").default("simple"),
    saleUnit: z.literal("kg").default("kg"),
    price: z.coerce.number().min(0, "El precio debe ser ≥ 0"),
    minStock: z.coerce.number().min(0, "Stock mínimo ≥ 0").default(0),
    initialStock: z.coerce.number().min(0).default(0),
    categoryId: z.string().uuid().nullable().optional(),
    isActive: z.boolean().default(true),
  });

export const updateProductSchema = z.object({
  id: z.string().uuid(),
  name: z.string().trim().min(1, "El nombre es obligatorio").max(120),
  price: z.coerce.number().min(0, "El precio debe ser ≥ 0"),
  minStock: z.coerce.number().min(0).default(0),
  categoryId: z.string().uuid().nullable().optional(),
  isActive: z.boolean(),
});

export const setProductActiveSchema = z.object({
  id: z.string().uuid(),
  isActive: z.boolean(),
});

export const createCategorySchema = z.object({
  name: z.string().trim().min(1, "El nombre es obligatorio").max(80),
});

export const productListFiltersSchema = z.object({
  search: z.string().optional(),
  kind: z.enum(["all", "simple"]).optional(),
  active: z.enum(["all", "active", "inactive"]).optional(),
});

export type CreateProductFormInput = z.infer<typeof createProductSchema>;
export type UpdateProductFormInput = z.infer<typeof updateProductSchema>;
export type CreateCategoryFormInput = z.infer<typeof createCategorySchema>;
