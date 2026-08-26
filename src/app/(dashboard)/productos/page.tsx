import { ProductsPage } from "@/modules/products/presentation/products-page";

export default function Page({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  return <ProductsPage searchParams={searchParams} />;
}
