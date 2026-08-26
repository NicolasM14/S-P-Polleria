import { z } from "zod";

export const createExpenseSchema = z
  .object({
    categoryId: z.string().uuid("Categoría inválida"),
    amount: z.coerce
      .number({ invalid_type_error: "Monto inválido" })
      .positive("El monto debe ser mayor a 0"),
    description: z
      .string()
      .trim()
      .max(500, "Máximo 500 caracteres")
      .optional()
      .nullable()
      .transform((value) => value ?? ""),
    fromCash: z.boolean().default(true),
    occurredAt: z
      .string()
      .nullable()
      .optional()
      .refine((value) => {
        if (value == null || value.trim() === "") return true;
        return !Number.isNaN(Date.parse(value));
      }, "Fecha inválida"),
  })
  .superRefine((data, ctx) => {
    if (data.occurredAt == null || data.occurredAt.trim() === "") return;
    const date = new Date(data.occurredAt);
    if (date.getTime() > Date.now() + 60_000) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "La fecha no puede ser futura.",
        path: ["occurredAt"],
      });
    }
  });

export type CreateExpenseFormInput = z.infer<typeof createExpenseSchema>;
