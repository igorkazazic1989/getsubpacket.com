import "server-only";
import { createClient } from "@supabase/supabase-js";

export const BUCKET = "documents";

// Service-role client. Only use on the server, after you have checked who is allowed to do what.
export function createAdminClient() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
