import { z } from "zod";

import { PAYMENT_METHODS } from "@/shared/constants/payment-methods";

import { MONEY_EPSILON } from "../domain/purchase";
import { roundMoney } from "../domain/purchase.rules";

const purchaseItemSchema = z.object({
  productId: z.string().uuid("Producto inválido"),
  quantity: z.coerce.number().positive("La cantidad debe ser mayor a 0"),
  unitCost: z.coerce.number().min(0, "El costo unitario debe ser ≥ 0"),
});

const purchasePaymentSchema = z.object({
  method: z.enum(PAYMENT_METHODS),
  amount: z.coerce.number().positive("El monto del pago debe ser mayor a 0"),
});

export const createPurchaseSchema = z
  .object({
    items: z.array(purchaseItemSchema).min(1, "Agregá al menos un ítem"),
    payments: z.array(purchasePaymentSchema).min(1, "Agregá al menos un pago"),
    notes: z.string().trim().max(500).nullable().optional(),
    purchasedAt: z
      .string()
      .nullable()
      .optional()
      .refine((value) => {
        if (value == null || value.trim() === "") return true;
        return !Number.isNaN(Date.parse(value));
      }, "Fecha inválida"),
  })
  .superRefine((data, ctx) => {
    const total = roundMoney(
      data.items.reduce((sum, item) => sum + item.quantity * item.unitCost, 0)
    );
    const paymentsSum = roundMoney(
      data.payments.reduce((sum, payment) => sum + payment.amount, 0)
    );
    if (Math.abs(total - paymentsSum) > MONEY_EPSILON) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `La suma de pagos (${paymentsSum}) debe igualar el total (${total}).`,
        path: ["payments"],
      });
    }
  });

export type CreatePurchaseFormInput = z.infer<typeof createPurchaseSchema>;
