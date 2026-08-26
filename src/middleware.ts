import { type NextRequest } from "next/server";

import { createMiddlewareClient } from "@/shared/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  const { supabase, response } = createMiddlewareClient(request);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;
  const isLoginRoute = pathname === "/login";

  if (!user && !isLoginRoute) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return Response.redirect(url);
  }

  if (user && isLoginRoute) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return Response.redirect(url);
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
