const SUPABASE_KEY_PREFIX_PLACEHOLDER = "COLE_A_PUBLISHABLE_KEY";

function normalizePublishableKey(rawKey: string | undefined) {
  const value = rawKey?.trim();

  if (!value) {
    return undefined;
  }

  if (value.startsWith(SUPABASE_KEY_PREFIX_PLACEHOLDER)) {
    const publishableKey = value
      .split(/\s+/)
      .find((part) => part.startsWith("sb_publishable_") || part.startsWith("eyJ"));

    return publishableKey ?? value.replace(SUPABASE_KEY_PREFIX_PLACEHOLDER, "").trim();
  }

  return value;
}

export function getSupabaseConfig() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const supabaseAnonKey = normalizePublishableKey(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      "Configure NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY no arquivo .env.local.",
    );
  }

  return { supabaseUrl, supabaseAnonKey };
}
