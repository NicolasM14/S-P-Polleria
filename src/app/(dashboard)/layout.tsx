import { DashboardShell } from "@/shared/components/layout/dashboard-shell";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <DashboardShell>{children}</DashboardShell>;
}
