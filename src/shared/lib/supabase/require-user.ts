import type { SupabaseClient } from "@supabase/supabase-js";

import { createClient } from "@/shared/lib/supabase/server";

export async function requireSupabaseUser(): Promise<{
  client: SupabaseClient;
  userId: string;
}> {
  const client = await createClient();
  const {
    data: { user },
  } = await client.auth.getUser();
  if (!user) {
    throw new Error("No autenticado.");
  }
  return { client, userId: user.id };
}
