"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { BrandLogo } from "@/shared/components/layout/brand-logo";
import { Button } from "@/shared/components/ui/button";
import { NAV_ITEMS } from "@/shared/constants/navigation";
import { siteConfig } from "@/config/site";
import { createClient } from "@/shared/lib/supabase/client";
import { cn } from "@/shared/lib/utils";

function NavLinks({
  pathname,
  onNavigate,
}: {
  pathname: string;
  onNavigate?: () => void;
}) {
  return (
    <nav className="flex-1 space-y-1 p-3">
      {NAV_ITEMS.map((item) => {
        const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
        return (
          <Link
            key={item.href}
            href={item.href}
            prefetch
            onClick={onNavigate}
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
  );
}

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!mobileOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mobileOpen]);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop sidebar */}
      <aside className="hidden w-64 flex-col bg-primary text-primary-foreground md:flex">
        <div className="border-b border-white/10 px-4 py-5">
          <BrandLogo size="sm" className="mx-auto h-20 w-20" />
          <p className="mt-3 text-center text-[11px] uppercase tracking-[0.18em] text-white/55">
            Panel interno
          </p>
        </div>
        <NavLinks pathname={pathname} />
        <div className="border-t border-white/10 p-4 text-[11px] text-white/45">
          {siteConfig.name}
        </div>
      </aside>

      {/* Mobile drawer */}
      {mobileOpen ? (
        <div className="fixed inset-0 z-50 md:hidden">
          <button
            type="button"
            aria-label="Cerrar menú"
            className="absolute inset-0 bg-black/50"
            onClick={() => setMobileOpen(false)}
          />
          <aside
            className="absolute inset-y-0 left-0 flex w-[min(18rem,85vw)] flex-col bg-primary text-primary-foreground shadow-xl"
            role="dialog"
            aria-modal="true"
            aria-label="Menú de navegación"
          >
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
              <div className="flex items-center gap-3">
                <BrandLogo size="sm" className="h-12 w-12" />
                <p className="text-[11px] uppercase tracking-[0.18em] text-white/55">
                  Menú
                </p>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-10 w-10 p-0 text-white hover:bg-white/10 hover:text-white"
                onClick={() => setMobileOpen(false)}
                aria-label="Cerrar"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            <NavLinks pathname={pathname} onNavigate={() => setMobileOpen(false)} />
            <div className="border-t border-white/10 p-4 text-[11px] text-white/45">
              {siteConfig.name}
            </div>
          </aside>
        </div>
      ) : null}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-14 items-center justify-between gap-3 border-b border-border/80 bg-card px-3 md:px-6">
          <div className="flex items-center gap-2 md:hidden">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-10 w-10 p-0"
              onClick={() => setMobileOpen(true)}
              aria-label="Abrir menú"
              aria-expanded={mobileOpen}
            >
              <Menu className="h-5 w-5" />
            </Button>
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
