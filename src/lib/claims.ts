export type ClaimAction = "stamp_add" | "stamp_redeem" | "discount_redeem" | "points_boost";

type CreateClaimRequestInput = {
  actionType: ClaimAction;
  businessSlug: string;
  payload?: Record<string, unknown>;
};

const apiBaseUrl = process.env.EXPO_PUBLIC_LOYLOOP_API_URL || "https://loy-loop.vercel.app";

export async function createClaimRequest({ actionType, businessSlug, payload = {} }: CreateClaimRequestInput) {
  const response = await fetch(`${apiBaseUrl.replace(/\/$/, "")}/api/claim-requests`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      actionType,
      businessSlug,
      payload,
    }),
  });

  const json = await response.json();

  if (!response.ok || !json.ok) {
    throw new Error(json.message || "No se pudo crear el QR.");
  }

  return {
    code: String(json.code),
    expiresAt: String(json.expiresAt),
  };
}
