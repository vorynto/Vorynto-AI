import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/types/supabase";

export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

/**
 * Escape-hatch for the PostgREST v14 TypeScript bug where
 * .insert() / .update() argument types collapse to `never`.
 * Only use for mutations — reads should use the typed createClient().
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function mutationClient(): { from: (table: string) => any } {
  return createClient() as unknown as { from: (table: string) => any };
}
