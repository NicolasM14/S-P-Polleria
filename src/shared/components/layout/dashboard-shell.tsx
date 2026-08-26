"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { BrandLogo } from "@/shared/components/layout/brand-logo";
import { Button } from "@/shared/components/ui/button";
import { NAV_ITEMS } from "@/shared/constants/navigation";
import { siteConfig } from "@/config/site";
import { createClient } from "@/shared/lib/supabase/client";
import { cn } from "@/shared/lib/utils";

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="hidden w-64 flex-col bg-primary text-primary-foreground md:flex">
        <div className="border-b border-white/10 px-4 py-5">
          <BrandLogo size="sm" className="mx-auto h-20 w-20" />
          <p className="mt-3 text-center text-[11px] uppercase tracking-[0.18em] text-white/55">
            Panel interno
          </p>
        </div>
        <nav className="flex-1 space-y-1 p-3">
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                prefetch
                className={cn(
                  "block rounded-md px-3 py-2.5 text-sm transition-colors",
                  active
                    ? "bg-accent font-medium text-accent-foreground shadow-sm"
                    : "text-white/85 hover:bg-white/10 hover:text-white"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-white/10 p-4 text-[11px] text-white/45">
          {siteConfig.name}
        </div>
      </aside>

      <div className="flex flex-1 flex-col">
        <header className="flex h-14 items-center justify-between border-b border-border/80 bg-card px-4 md:px-6">
          <div className="md:hidden">
            <BrandLogo size="sm" className="h-11 w-11" />
          </div>
          <div className="hidden md:block" />
          <Button variant="outline" size="sm" onClick={handleLogout}>
            Salir
          </Button>
        </header>
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
