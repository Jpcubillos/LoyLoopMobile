import { supabase } from "@/lib/supabase";
export async function readClaimStatus(code: string) {
  const { data, error } = await supabase
    .from("claim_requests")
    .select("status, expires_at")
    .eq("code", code)
    .maybeSingle();
  if (error) throw error;
  if (!data)
    throw new Error(
      "Aún no podemos consultar la validación. Intenta nuevamente.",
    );
  return { status: String(data.status), expiresAt: String(data.expires_at) };
}
