import type { SupabaseClient } from "@supabase/supabase-js";

import type { CreatePurchaseInput, Purchase, PurchaseWithDetails } from "../domain/purchase";
import type { PurchaseRepository } from "../domain/purchase.repository";
import { PurchaseDomainError } from "../domain/purchase.rules";
import {
  mapPurchaseItemRow,
  mapPurchasePaymentRow,
  mapPurchaseRow,
  mapPurchaseWithDetails,
} from "./purchase.mapper";
import { mapSupabaseBusinessError } from "@/shared/lib/supabase/map-business-error";

export function createSupabasePurchaseRepository(client: SupabaseClient): PurchaseRepository {
  return {
    async list(): Promise<Purchase[]> {
      const { data, error } = await client
        .from("purchases")
        .select("*")
        .order("purchased_at", { ascending: false })
        .limit(100);
      if (error) throw new PurchaseDomainError(error.message);
      return (data ?? []).map(mapPurchaseRow);
    },

    async findById(id: string): Promise<PurchaseWithDetails | null> {
      const { data, error } = await client.from("purchases").select("*").eq("id", id).maybeSingle();
      if (error) throw new PurchaseDomainError(error.message);
      if (!data) return null;

      const [itemsResult, paymentsResult] = await Promise.all([
        client.from("purchase_items").select("*").eq("purchase_id", id),
        client.from("purchase_payments").select("*").eq("purchase_id", id),
      ]);
      if (itemsResult.error) throw new PurchaseDomainError(itemsResult.error.message);
      if (paymentsResult.error) throw new PurchaseDomainError(paymentsResult.error.message);

      return mapPurchaseWithDetails(
        data,
        (itemsResult.data ?? []).map(mapPurchaseItemRow),
        (paymentsResult.data ?? []).map(mapPurchasePaymentRow)
      );
    },

    async create(input: CreatePurchaseInput): Promise<string> {
      const { data, error } = await client.rpc("create_purchase", {
        p_items: input.items.map((item) => ({
          product_id: item.productId,
          quantity: item.quantity,
          unit_cost: item.unitCost,
        })),
        p_payments: input.payments.map((payment) => ({
          method: payment.method,
          amount: payment.amount,
        })),
        p_notes: input.notes ?? null,
        p_purchased_at: input.purchasedAt ?? new Date().toISOString(),
      });

      if (error) throw new PurchaseDomainError(mapSupabaseBusinessError(error.message));
      if (!data) throw new PurchaseDomainError("No se recibió el id de la compra.");
      return data as string;
    },
  };
}
