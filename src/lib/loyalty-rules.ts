export type OfferKind = "benefit" | "reward" | "promotion" | "mission";
export function canClaimOffer(
  offer: {
    kind: OfferKind;
    requiredPoints?: number;
    requiredStamps?: number;
    startsAt?: string;
    endsAt?: string;
  },
  member: { isMember: boolean; points: number; stamps: number },
  now = Date.now(),
) {
  if (!member.isMember || offer.kind === "mission") return false;
  if (offer.startsAt && Date.parse(offer.startsAt) > now) return false;
  if (offer.endsAt && Date.parse(offer.endsAt) <= now) return false;
  return (
    member.points >= (offer.requiredPoints ?? 0) &&
    member.stamps >= (offer.requiredStamps ?? 0)
  );
}
export function parseCommerceQr(raw: string): string | null {
  const value = raw.trim();
  const slug = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
  if (slug.test(value)) return value;
  try {
    const url = new URL(value);
    if (url.protocol === "loyloop:" || url.protocol === "loyloopmobile:") {
      const match = `${url.hostname}${url.pathname}`.match(
        /^(?:comercio|join)\/([a-z0-9-]+)\/?$/,
      );
      return match && slug.test(match[1]) ? match[1] : null;
    }
    if (
      url.protocol !== "https:" ||
      !["loy-loop.vercel.app", "loyloop.app", "www.loyloop.app"].includes(
        url.hostname,
      )
    )
      return null;
    const match = url.pathname.match(
      /^\/(?:comercio|join|c)\/([a-z0-9-]+)\/?$/,
    );
    return match && slug.test(match[1]) ? match[1] : null;
  } catch {
    return null;
  }
}
export function getClaimState(
  status: string,
  expiresAt: string,
  now = Date.now(),
) {
  if (status === "approved" || status === "rejected") return status;
  if (
    status === "expired" ||
    !Number.isFinite(Date.parse(expiresAt)) ||
    Date.parse(expiresAt) <= now
  )
    return "expired";
  return "pending";
}
