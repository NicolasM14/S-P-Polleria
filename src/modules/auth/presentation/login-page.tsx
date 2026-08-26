import { LoginForm } from "@/modules/auth/presentation/login-form";
import { BrandLogo } from "@/shared/components/layout/brand-logo";

export function LoginPage() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-primary p-4">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(227,27,35,0.28),_transparent_55%),radial-gradient(ellipse_at_bottom,_rgba(255,255,255,0.08),_transparent_50%)]"
      />
      <div className="relative z-10 mb-6 flex flex-col items-center text-center">
        <BrandLogo size="lg" />
        <p className="mt-3 text-xs font-semibold uppercase tracking-[0.28em] text-white/60">
          Gestión interna
        </p>
      </div>
      <div className="relative z-10 w-full max-w-md">
        <LoginForm />
      </div>
    </div>
  );
}
