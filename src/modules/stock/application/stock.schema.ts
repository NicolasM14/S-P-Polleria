import { z } from "zod";

import { STOCK_ADJUST_REASON_VALUES } from "../domain/adjust-reasons";

export const adjustStockSchema = z
  .object({
    productId: z.string().uuid("Producto inválido"),
    quantity: z.coerce
      .number({ invalid_type_error: "Cantidad inválida" })
      .refine((value) => value !== 0, "La cantidad no puede ser 0"),
    reason: z.enum(STOCK_ADJUST_REASON_VALUES, {
      required_error: "Elegí un motivo",
      invalid_type_error: "Motivo inválido",
    }),
    otherDetail: z.string().trim().max(200).optional().default(""),
  })
  .superRefine((data, ctx) => {
    if (data.reason === "other" && !data.otherDetail.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Indicá el detalle del motivo",
        path: ["otherDetail"],
      });
    }
  })
  .transform((data) => ({
    productId: data.productId,
    quantity: data.quantity,
    notes: data.reason === "other" ? data.otherDetail.trim() : data.reason,
  }));

export type AdjustStockFormInput = z.input<typeof adjustStockSchema>;
export type AdjustStockParsed = z.output<typeof adjustStockSchema>;
