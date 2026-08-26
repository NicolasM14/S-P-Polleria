import { ReportsPage } from "@/modules/reports/presentation/reports-page";

export default function Page({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  return <ReportsPage searchParams={searchParams} />;
}
