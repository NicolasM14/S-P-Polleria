import type { SupabaseClient } from "@supabase/supabase-js";

import type { CreateSaleInput, Sale, SaleWithDetails } from "../domain/sale";
import type { SaleRepository } from "../domain/sale.repository";
import { SaleDomainError } from "../domain/sale.rules";
import {
  mapSaleItemRow,
  mapSalePaymentRow,
  mapSaleRow,
  mapSaleWithDetails,
} from "./sale.mapper";
import { mapSupabaseBusinessError } from "@/shared/lib/supabase/map-business-error";

export function createSupabaseSaleRepository(client: SupabaseClient): SaleRepository {
  return {
    async list(): Promise<Sale[]> {
      const { data, error } = await client
        .from("sales")
        .select("*")
        .order("sold_at", { ascending: false })
        .limit(100);
      if (error) throw new SaleDomainError(error.message);
      return (data ?? []).map(mapSaleRow);
    },

    async findById(id: string): Promise<SaleWithDetails | null> {
      const { data, error } = await client.from("sales").select("*").eq("id", id).maybeSingle();
      if (error) throw new SaleDomainError(error.message);
      if (!data) return null;

      const [itemsResult, paymentsResult] = await Promise.all([
        client.from("sale_items").select("*").eq("sale_id", id),
        client.from("sale_payments").select("*").eq("sale_id", id),
      ]);
      if (itemsResult.error) throw new SaleDomainError(itemsResult.error.message);
      if (paymentsResult.error) throw new SaleDomainError(paymentsResult.error.message);

      return mapSaleWithDetails(
        data,
        (itemsResult.data ?? []).map(mapSaleItemRow),
        (paymentsResult.data ?? []).map(mapSalePaymentRow)
      );
    },

    async create(input: CreateSaleInput): Promise<string> {
      const { data, error } = await client.rpc("create_sale", {
        p_items: input.items.map((item) => ({
          product_id: item.productId,
          quantity: item.quantity,
          unit_price: item.unitPrice,
        })),
        p_payments: input.payments.map((payment) => ({
          method: payment.method,
          amount: payment.amount,
        })),
        p_discount: input.discount ?? 0,
        p_notes: input.notes ?? null,
        p_sold_at: input.soldAt ?? new Date().toISOString(),
      });

      if (error) throw new SaleDomainError(mapSupabaseBusinessError(error.message));
      if (!data) throw new SaleDomainError("No se recibió el id de la venta.");
      return data as string;
    },

    async voidSale(saleId: string): Promise<string> {
      const { data, error } = await client.rpc("void_sale", {
        p_sale_id: saleId,
      });
      if (error) throw new SaleDomainError(mapSupabaseBusinessError(error.message));
      if (!data) throw new SaleDomainError("No se pudo anular la venta.");
      return data as string;
    },
  };
}
