import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { Database } from "@/types/supabase";

type UserRole = Database["public"]["Enums"]["user_role"];

const PUBLIC_ROUTES = ["/", "/features", "/pricing", "/about", "/contact"];
const AUTH_ROUTES = ["/login", "/signup", "/onboarding"];
const ADMIN_ROUTES = ["/admin"];

export async function middleware(request: NextRequest) {
  // Guard: if env vars are missing, allow the request through so pages can
  // render their own error UI rather than crashing at the middleware layer.
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    return NextResponse.next({ request });
  }

  let supabaseResponse = NextResponse.next({ request });
  const { pathname } = request.nextUrl;

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options as Parameters<typeof supabaseResponse.cookies.set>[2])
          );
        },
      },
    }
  );

  // Wrap in try-catch so a Supabase outage / paused project never causes a
  // middleware 500 that takes down every route on the site.
  let user: { id: string } | null = null;
  try {
    const { data } = await supabase.auth.getUser();
    user = data.user;
  } catch {
    // Supabase unreachable — treat as unauthenticated and continue
    return supabaseResponse;
  }

  const isPublic = PUBLIC_ROUTES.some((r) => pathname === r || pathname.startsWith("/api/"));
  const isAuthRoute = AUTH_ROUTES.some((r) => pathname.startsWith(r));

  // Redirect unauthenticated users away from protected routes
  if (!user && !isPublic && !isAuthRoute) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect authenticated users away from auth routes
  if (user && isAuthRoute) {
    try {
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .returns<{ role: UserRole | null }[]>()
        .maybeSingle();

      if (profile?.role === "super_admin") {
        return NextResponse.redirect(new URL("/admin", request.url));
      }
    } catch {
      // profile lookup failed — fall through to default redirect
    }
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Block non-super-admins from admin routes
  if (user && ADMIN_ROUTES.some((r) => pathname.startsWith(r))) {
    try {
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .returns<{ role: UserRole | null }[]>()
        .maybeSingle();

      if (!profile || profile.role !== "super_admin") {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
    } catch {
      // profile lookup failed — redirect to dashboard to be safe
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
