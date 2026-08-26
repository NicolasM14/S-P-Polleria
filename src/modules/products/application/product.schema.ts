import { z } from "zod";

const quantitySchema = z.coerce.number().positive("La cantidad debe ser mayor a 0");

export const productComponentSchema = z.object({
  componentId: z.string().uuid("Componente inválido"),
  quantity: quantitySchema,
});

export const createProductSchema = z
  .object({
    name: z.string().trim().min(1, "El nombre es obligatorio").max(120),
    kind: z.enum(["simple", "combo"]),
    saleUnit: z.enum(["kg", "unit"]),
    price: z.coerce.number().min(0, "El precio debe ser ≥ 0"),
    minStock: z.coerce.number().min(0, "Stock mínimo ≥ 0").default(0),
    initialStock: z.coerce.number().min(0, "Stock inicial ≥ 0").default(0),
    categoryId: z.string().uuid().nullable().optional(),
    isActive: z.boolean().default(true),
    components: z.array(productComponentSchema).default([]),
  })
  .superRefine((data, ctx) => {
    if (data.kind === "combo" && data.components.length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Un combo necesita al menos un componente",
        path: ["components"],
      });
    }
    if (data.kind === "simple" && data.components.length > 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Un producto simple no lleva componentes",
        path: ["components"],
      });
    }
    if (data.kind === "combo" && data.initialStock > 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Los combos no tienen stock propio",
        path: ["initialStock"],
      });
    }
    if (data.saleUnit === "unit" && !Number.isInteger(data.minStock)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Stock mínimo entero para unidad",
        path: ["minStock"],
      });
    }
    if (data.saleUnit === "unit" && !Number.isInteger(data.initialStock)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Stock inicial entero para unidad",
        path: ["initialStock"],
      });
    }
  });

export const updateProductSchema = z
  .object({
    id: z.string().uuid(),
    name: z.string().trim().min(1, "El nombre es obligatorio").max(120),
    price: z.coerce.number().min(0, "El precio debe ser ≥ 0"),
    minStock: z.coerce.number().min(0).default(0),
    categoryId: z.string().uuid().nullable().optional(),
    isActive: z.boolean(),
    components: z.array(productComponentSchema).optional(),
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
  kind: z.enum(["all", "simple", "combo"]).optional(),
  active: z.enum(["all", "active", "inactive"]).optional(),
});

export type CreateProductFormInput = z.infer<typeof createProductSchema>;
export type UpdateProductFormInput = z.infer<typeof updateProductSchema>;
export type CreateCategoryFormInput = z.infer<typeof createCategorySchema>;
