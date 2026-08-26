import { z } from "zod";

export const openCashSessionSchema = z.object({
  openingAmount: z.coerce
    .number({ invalid_type_error: "Monto inválido" })
    .min(0, "El monto de apertura debe ser ≥ 0"),
});

export const closeCashSessionSchema = z.object({
  countedAmount: z.coerce
    .number({ invalid_type_error: "Monto inválido" })
    .min(0, "El efectivo contado debe ser ≥ 0"),
  notes: z
    .string()
    .trim()
    .max(500, "Máximo 500 caracteres")
    .optional()
    .nullable()
    .transform((value) => (value && value.length > 0 ? value : null)),
});

export type OpenCashSessionFormInput = z.infer<typeof openCashSessionSchema>;
export type CloseCashSessionFormInput = z.infer<typeof closeCashSessionSchema>;
