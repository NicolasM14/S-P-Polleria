import type { ProductRepository, UpdateProductInput } from "../domain/product.repository";
import {
  assertComboComponents,
  assertValidMinStock,
  assertValidName,
  assertValidPrice,
  ProductDomainError,
} from "../domain/product.rules";

export async function updateProductUseCase(repo: ProductRepository, input: UpdateProductInput) {
  const existing = await repo.findById(input.id);
  if (!existing) {
    throw new ProductDomainError("Producto no encontrado.");
  }

  assertValidName(input.name);
  assertValidPrice(input.price);
  assertValidMinStock(input.minStock, existing.saleUnit);

  if (existing.kind === "combo") {
    const components = input.components ?? existing.components.map((c) => ({
      componentId: c.componentId,
      quantity: c.quantity,
    }));
    const simples = await repo.listSimpleProducts(false);
    const meta = new Map(
      simples.map((p) => [p.id, { kind: p.kind, saleUnit: p.saleUnit }] as const)
    );
    assertComboComponents("combo", components, meta);
    return repo.update({ ...input, name: input.name.trim(), components });
  }

  return repo.update({
    ...input,
    name: input.name.trim(),
    components: [],
  });
}
