import { z } from "zod";

import { PAYMENT_METHODS } from "@/shared/constants/payment-methods";

import { MONEY_EPSILON } from "../domain/sale";
import { roundMoney } from "../domain/sale.rules";

const saleItemSchema = z.object({
  productId: z.string().uuid("Producto inválido"),
  quantity: z.coerce.number().positive("La cantidad debe ser mayor a 0"),
  unitPrice: z.coerce.number().min(0, "El precio unitario debe ser ≥ 0"),
});

const salePaymentSchema = z.object({
  method: z.enum(PAYMENT_METHODS),
  amount: z.coerce.number().positive("El monto del pago debe ser mayor a 0"),
});

export const createSaleSchema = z
  .object({
    items: z.array(saleItemSchema).min(1, "Agregá al menos un ítem"),
    payments: z.array(salePaymentSchema).min(1, "Agregá al menos un pago"),
    discount: z.coerce.number().min(0, "El descuento debe ser ≥ 0").default(0),
    notes: z.string().trim().max(500).nullable().optional(),
    soldAt: z
      .string()
      .nullable()
      .optional()
      .refine((value) => {
        if (value == null || value.trim() === "") return true;
        return !Number.isNaN(Date.parse(value));
      }, "Fecha inválida"),
  })
  .superRefine((data, ctx) => {
    const subtotal = roundMoney(
      data.items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0)
    );
    if (data.discount > subtotal) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "El descuento no puede superar el subtotal.",
        path: ["discount"],
      });
    }
    const total = roundMoney(subtotal - data.discount);
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

export const voidSaleSchema = z.object({
  saleId: z.string().uuid("Venta inválida"),
});

export type CreateSaleFormInput = z.infer<typeof createSaleSchema>;
