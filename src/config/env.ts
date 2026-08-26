import { z } from "zod";

function resolveSupabaseKey(): string | undefined {
  return (
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  );
}

export function getSupabasePublicKey(): string {
  const key = resolveSupabaseKey();
  if (!key) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_ANON_KEY or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY");
  }
  return key;
}

const envSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
});

export type Env = z.infer<typeof envSchema>;

export function getEnv(): Env {
  const parsed = envSchema.safeParse({
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: resolveSupabaseKey(),
  });

  if (!parsed.success) {
    throw new Error(
      `Invalid environment variables: ${parsed.error.flatten().fieldErrors}`
    );
  }

  return parsed.data;
}

/** Safe for client — only NEXT_PUBLIC_* vars */
export function getPublicEnv() {
  return {
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
    supabaseAnonKey: resolveSupabaseKey() ?? "",
  };
}
