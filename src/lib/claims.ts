import { supabase } from "@/lib/supabase";

export type ClaimAction = "stamp_add" | "stamp_redeem" | "discount_redeem" | "points_boost";

type CreateClaimRequestInput = {
  actionType: ClaimAction;
  businessSlug: string;
  payload?: Record<string, unknown>;
};

const apiBaseUrl = process.env.EXPO_PUBLIC_LOYLOOP_API_URL || "https://loy-loop.vercel.app";

export async function createClaimRequest({ actionType, businessSlug, payload = {} }: CreateClaimRequestInput) {
  let response: Response;
  const { data: sessionData } = await supabase.auth.getSession();
  const customerEmail = sessionData.session?.user.email?.trim().toLowerCase();

  if (!customerEmail) {
    throw new Error("Inicia sesion para generar este QR.");
  }

  try {
    response = await fetch(`${apiBaseUrl.replace(/\/$/, "")}/api/claim-requests`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        actionType,
        businessSlug,
        customerEmail,
        payload,
      }),
    });
  } catch {
    throw new Error("No se pudo conectar con el servidor de LoyLoop.");
  }

  const json = await response.json().catch(() => ({
    ok: false,
    message: "El servidor respondio con un formato inesperado.",
  }));

  if (!response.ok || !json.ok) {
    throw new Error(json.message || "No se pudo crear el QR.");
  }

  return {
    code: String(json.code),
    expiresAt: String(json.expiresAt),
  };
}
