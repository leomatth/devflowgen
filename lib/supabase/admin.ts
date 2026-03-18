import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.warn("SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is not configured.");
}

export const supabaseAdmin = createClient(
  supabaseUrl || "https://example.supabase.co",
  supabaseServiceRoleKey || "service_role_placeholder",
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  },
);
