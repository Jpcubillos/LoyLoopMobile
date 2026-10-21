import AsyncStorage from "@react-native-async-storage/async-storage";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";
import { canClaimOffer, type OfferKind } from "@/lib/loyalty-rules";
import type { ClaimAction } from "@/lib/claims";

export const isDemo =
  !isSupabaseConfigured || process.env.EXPO_PUBLIC_DEMO_MODE === "true";
export type BusinessSummary = {
  id: string;
  slug: string;
  name: string;
  category: string;
  description: string;
  address: string;
  points: number;
  credit: string;
  tier: string;
  pointsToVip: number | null;
  isMember: boolean;
  rating?: number;
  distance?: number;
  sponsored?: boolean;
  logoUrl?: string;
  customerSegment?: "inactive" | "at_risk" | "active" | "vip";
};
export type Offer = {
  id: string;
  businessSlug: string;
  businessName: string;
  title: string;
  description: string;
  kind: OfferKind;
  meta: string;
  available: boolean;
  isMember: boolean;
  requiredPoints?: number;
  requiredStamps?: number;
  progress?: number;
  goal?: number;
  points?: number;
  startsAt?: string;
  endsAt?: string;
  action?: ClaimAction;
  payload?: Record<string, unknown>;
  eligibleForAudience?: boolean;
};
export type RewardSummary = Offer;
export type BusinessDetail = BusinessSummary & {
  currentStamps: number;
  requiredStamps: number;
  stampReward: string;
  rewards: Offer[];
  campaigns: Offer[];
  missions: Offer[];
  locations: {
    id: string;
    name: string;
    address: string;
    hours?: string;
    distance?: number;
  }[];
};
export type UserProfile = {
  name: string;
  email: string;
  phone: string;
  birthDate: string;
  avatar: string;
  joinedAt: string;
  xp: number;
  level: string;
  nextLevel: string;
  nextXp: number;
  badges: string[];
  globalBenefits: string[];
  authenticated: boolean;
};
export const fallbackBusinesses: BusinessSummary[] = [
  {
    id: "demo-cafe",
    slug: "cafe-central",
    name: "Café Central",
    category: "Cafés",
    description:
      "Café de especialidad, postres y recompensas para clientes frecuentes.",
    address: "Cra. 7 #45-12, Bogotá",
    points: 180,
    credit: "Café gratis",
    tier: "Frecuente",
    pointsToVip: 70,
    isMember: true,
    rating: 4.8,
    distance: 1.2,
  },
  {
    id: "demo-burger",
    slug: "burger-house",
    name: "Burger House",
    category: "Restaurantes",
    description: "Hamburguesas artesanales y momentos para compartir.",
    address: "Calle 85 #12-30, Bogotá",
    points: 0,
    credit: "2x puntos hoy",
    tier: "Miembro",
    pointsToVip: 100,
    isMember: false,
    rating: 4.8,
    distance: 0.8,
  },
  {
    id: "demo-ice",
    slug: "heladeria-dulce",
    name: "Heladería Dulce",
    category: "Postres",
    description: "Un antojo artesanal para alegrar tu día.",
    address: "Calle 70 #9-20, Bogotá",
    points: 0,
    credit: "15% de descuento",
    tier: "Miembro",
    pointsToVip: 100,
    isMember: false,
    rating: 4.9,
    distance: 1.5,
  },
  {
    id: "demo-barber",
    slug: "barberia-norte",
    name: "Barbería Norte",
    category: "Belleza",
    description: "Tu estilo, con beneficios en cada visita.",
    address: "Calle 80 #12-30, Bogotá",
    points: 320,
    credit: "15% de descuento",
    tier: "Distinguido",
    pointsToVip: 180,
    isMember: true,
    rating: 4.9,
    distance: 2.4,
  },
  {
    id: "demo-nispero",
    slug: "nispero-food",
    name: "Níspero Food",
    category: "Restaurantes",
    description: "Sabores colombianos en un lugar para volver.",
    address: "Carrera 13 #82-40, Bogotá",
    points: 0,
    credit: "20% de descuento",
    tier: "Miembro",
    pointsToVip: 100,
    isMember: false,
    rating: 4.8,
    distance: 0.5,
    sponsored: true,
  },
  {
    id: "demo-wash",
    slug: "green-wash",
    name: "Green Wash",
    category: "Servicios",
    description: "Cuida tu vehículo y disfruta más beneficios.",
    address: "Av. 19 #104-22, Bogotá",
    points: 45,
    credit: "2x puntos",
    tier: "Miembro",
    pointsToVip: 55,
    isMember: true,
    rating: 4.7,
    distance: 3.2,
  },
];
export function nextCommerceTier(points: number) {
  return points < 100 ? "Frecuente" : points < 250 ? "Distinguido" : "VIP";
}
async function customerId(create = false) {
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();
  if (error) throw error;
  if (!session?.user.email) return null;
  const email = session.user.email.toLowerCase();
  const { data, error: lookupError } = await supabase
    .from("customer_profiles")
    .select("id")
    .eq("email", email)
    .maybeSingle();
  if (lookupError) throw lookupError;
  if (data) return data.id as string;
  if (!create) return null;
  const result = await supabase
    .from("customer_profiles")
    .insert({
      email,
      full_name: session.user.user_metadata.full_name || email.split("@")[0],
    })
    .select("id")
    .single();
  if (result.error) throw result.error;
  return result.data.id as string;
}
export async function getBusinesses(): Promise<BusinessSummary[]> {
  if (isDemo) {
    const joined: string[] = JSON.parse(
      (await AsyncStorage.getItem("loyloop.demo.memberships")) || "[]",
    );
    return fallbackBusinesses.map((b) => ({
      ...b,
      isMember: b.isMember || joined.includes(b.slug),
    }));
  }
  const [catalog, id] = await Promise.all([
    supabase
      .from("businesses")
      .select(
        "id, slug, name, category, description, address, logo_url, vip_purchase_threshold, at_risk_days, inactive_days",
      )
      .order("created_at", { ascending: false }),
    customerId(),
  ]);
  if (catalog.error) throw catalog.error;
  const businessIds = (catalog.data ?? []).map((business) => business.id);
  const [memberships, activity, rewards, campaigns] = await Promise.all([
    id && businessIds.length
      ? supabase
          .from("business_memberships")
          .select("business_id, points_balance, tier")
          .eq("customer_id", id)
      : Promise.resolve({ data: [], error: null }),
    id && businessIds.length
      ? supabase
          .from("loyalty_events")
          .select("business_id, event_type, created_at")
          .eq("customer_id", id)
          .in("business_id", businessIds)
          .in("event_type", ["purchase", "stamp", "minipay_payment"])
          .order("created_at", { ascending: false })
      : Promise.resolve({ data: [], error: null }),
    businessIds.length
      ? supabase
          .from("rewards")
          .select("business_id, name, created_at")
          .in("business_id", businessIds)
          .eq("active", true)
          .order("created_at", { ascending: false })
      : Promise.resolve({ data: [], error: null }),
    businessIds.length
      ? supabase
          .from("campaigns")
          .select("business_id, name, starts_at, ends_at, created_at")
          .in("business_id", businessIds)
          .eq("active", true)
          .eq("status", "active")
          .order("created_at", { ascending: false })
      : Promise.resolve({ data: [], error: null }),
  ]);
  if (memberships.error) throw memberships.error;
  if (activity.error) throw activity.error;
  return (catalog.data ?? []).map((b) => {
    const preview = fallbackBusinesses.find((item) => item.slug === b.slug);
    const now = Date.now();
    const campaign = campaigns.data?.find(
      (item) =>
        item.business_id === b.id &&
        (!item.starts_at || Date.parse(item.starts_at) <= now) &&
        (!item.ends_at || Date.parse(item.ends_at) > now),
    );
    const reward = rewards.data?.find((item) => item.business_id === b.id);
    const membership = memberships.data?.find((m) => m.business_id === b.id);
    const points = membership?.points_balance ?? 0;
    const visits = (activity.data ?? []).filter(
      (event) => event.business_id === b.id,
    );
    const daysSinceVisit = visits[0]?.created_at
      ? Math.floor((Date.now() - Date.parse(visits[0].created_at)) / 86_400_000)
      : Number.POSITIVE_INFINITY;
    const customerSegment: BusinessSummary["customerSegment"] =
      daysSinceVisit >= (b.inactive_days ?? 180)
        ? "inactive"
        : daysSinceVisit >= (b.at_risk_days ?? 90)
          ? "at_risk"
          : visits.length >= (b.vip_purchase_threshold ?? 30)
            ? "vip"
            : "active";
    return {
      ...b,
      description: b.description || "",
      address: b.address || "",
      logoUrl: b.logo_url,
      points,
      credit: campaign?.name || reward?.name || "",
      rating: preview?.rating,
      distance: preview?.distance,
      tier: membership?.tier || "Miembro",
      pointsToVip: null,
      isMember: !!membership,
      customerSegment,
    };
  });
}
export async function joinBusiness(business: BusinessSummary) {
  if (isDemo) {
    const joined: string[] = JSON.parse(
      (await AsyncStorage.getItem("loyloop.demo.memberships")) || "[]",
    );
    await AsyncStorage.setItem(
      "loyloop.demo.memberships",
      JSON.stringify([...new Set([...joined, business.slug])]),
    );
    return;
  }
  const id = await customerId(true);
  if (!id) throw new Error("Inicia sesión para unirte a este comercio.");
  const { error } = await supabase.from("business_memberships").upsert(
    {
      customer_id: id,
      business_id: business.id,
      points_balance: 0,
      credit_balance_cents: 0,
      tier: "Miembro",
    },
    { onConflict: "business_id,customer_id", ignoreDuplicates: true },
  );
  if (error) throw error;
}
function demoDetail(b: BusinessSummary): BusinessDetail {
  const currentStamps = b.isMember ? (b.slug === "cafe-central" ? 7 : 4) : 0;
  const base = {
    businessSlug: b.slug,
    businessName: b.name,
    isMember: b.isMember,
  };
  const offers: Offer[] = [
    {
      ...base,
      id: `${b.slug}-welcome`,
      kind: "benefit",
      title: "15% de descuento",
      description: "Disfruta un beneficio especial en tu próxima visita.",
      meta: "Disponible para miembros",
      available: b.isMember,
      action: "discount_redeem",
      payload: { campaignName: "15% de descuento", discountPercent: 15 },
    },
    {
      ...base,
      id: `${b.slug}-stamps`,
      kind: "reward",
      title:
        b.slug === "cafe-central" ? "Café gratis" : "Una visita con recompensa",
      description: "Completa tu tarjeta de sellos y disfruta tu recompensa.",
      meta: `${currentStamps} / 10 sellos`,
      requiredStamps: 10,
      progress: currentStamps,
      goal: 10,
      available: currentStamps >= 10,
      action: "stamp_redeem",
    },
    {
      ...base,
      id: `${b.slug}-level`,
      kind: "reward",
      title: "Beneficio Distinguido",
      description:
        "Un 20% de descuento por tu fidelidad. Tus puntos no se gastan.",
      meta: "Al alcanzar 250 pts de fidelidad",
      requiredPoints: 250,
      available: b.isMember && b.points >= 250,
      action: "discount_redeem",
      payload: { campaignName: "Beneficio Distinguido", discountPercent: 20 },
    },
  ];
  return {
    ...b,
    currentStamps,
    requiredStamps: 10,
    stampReward: offers[1].title,
    rewards: offers,
    campaigns: [
      {
        ...base,
        id: `${b.slug}-double`,
        kind: "promotion",
        title: "2x puntos hoy",
        description:
          "Gana el doble de puntos en tus compras. Consulta las condiciones en el comercio.",
        meta: "Hoy",
        available: b.isMember,
        action: "points_boost",
        payload: { campaignName: "2x puntos hoy", rewardPoints: 20 },
      },
    ],
    missions: [
      {
        ...base,
        id: `${b.slug}-visits`,
        kind: "mission",
        title: "Compra 2 veces esta semana",
        description:
          "Registra tus compras en el comercio para completar esta misión.",
        meta: "+50 pts de fidelidad",
        available: false,
        points: 50,
        progress: b.isMember ? 1 : 0,
        goal: 2,
      },
      {
        ...base,
        id: `${b.slug}-branch`,
        kind: "mission",
        title: "Visita una sede nueva",
        description: "Conoce otro lugar de tu comercio favorito.",
        meta: "+75 pts de fidelidad",
        available: false,
        points: 75,
        progress: 0,
        goal: 1,
      },
    ],
    locations: [
      {
        id: "main",
        name: "Sede principal",
        address: b.address,
        hours: "7:00 – 21:00",
        distance: b.distance,
      },
    ],
  };
}
export async function getBusinessDetail(slug: string): Promise<BusinessDetail> {
  const business = (await getBusinesses()).find((b) => b.slug === slug);
  if (!business) throw new Error("No encontramos este comercio.");
  if (isDemo) return demoDetail(business);
  const id = await customerId();
  const [stamps, rewards, campaigns, missions, progress] = await Promise.all([
    id
      ? supabase
          .from("stamp_cards")
          .select("*")
          .eq("business_id", business.id)
          .eq("customer_id", id)
          .eq("active", true)
          .eq("reward_name", "Cafe gratis con 10 sellos")
          .limit(1)
          .maybeSingle()
      : Promise.resolve({ data: null, error: null }),
    supabase
      .from("rewards")
      .select("*")
      .eq("business_id", business.id)
      .eq("active", true),
    supabase
      .from("campaigns")
      .select("*")
      .eq("business_id", business.id)
      .eq("active", true)
      .in("status", ["active", "scheduled"]),
    supabase
      .from("missions")
      .select("*")
      .eq("business_id", business.id)
      .eq("active", true),
    id
      ? supabase.from("customer_missions").select("*").eq("customer_id", id)
      : Promise.resolve({ data: [], error: null }),
  ]);
  for (const result of [stamps, rewards, campaigns, missions, progress])
    if (result.error) throw result.error;
  const base = {
    businessSlug: slug,
    businessName: business.name,
    isMember: business.isMember,
  };
  const member = {
    isMember: business.isMember,
    points: business.points,
    stamps: stamps.data?.current_stamps ?? 0,
  };
  const matchesAudience = (segment?: string | null) =>
    !segment || segment === (business.customerSegment ?? "inactive");
  const isCurrent = (startsAt?: string | null, endsAt?: string | null) => {
    const now = Date.now();
    const start = startsAt ? Date.parse(startsAt) : Number.NEGATIVE_INFINITY;
    const end = endsAt ? Date.parse(endsAt) : Number.POSITIVE_INFINITY;
    return start <= now && end > now;
  };
  const rewardOffers: Offer[] = (rewards.data ?? []).map((r) => {
    const stampReward = r.name === "Cafe gratis con 10 sellos";
    const requiredStamps = stampReward
      ? (stamps.data?.required_stamps ?? 10)
      : 0;
    const candidate = {
      kind:
        r.points_required || stampReward
          ? ("reward" as const)
          : ("benefit" as const),
      requiredPoints: r.points_required ?? 0,
      requiredStamps,
    };
    const action: ClaimAction | undefined = stampReward
      ? "stamp_redeem"
      : r.type === "discount"
        ? "discount_redeem"
        : undefined;
    const audienceEligible = matchesAudience(r.audience_segment);
    const available =
      business.isMember && audienceEligible && canClaimOffer(candidate, member);
    return {
      ...base,
      ...candidate,
      id: r.id,
      title: r.name,
      description: r.description || "",
      available,
      eligibleForAudience: audienceEligible,
      meta: requiredStamps
        ? `${member.stamps} / ${requiredStamps} sellos`
        : r.points_required
          ? `Nivel: ${r.points_required} pts de fidelidad`
          : audienceEligible
            ? "Disponible para miembros"
            : `Disponible para clientes ${r.audience_segment === "vip" ? "VIP" : r.audience_segment === "at_risk" ? "en riesgo" : "inactivos"}`,
      action: business.isMember && audienceEligible ? action : undefined,
      payload: { rewardId: r.id, campaignName: r.name },
    };
  });
  return {
    ...business,
    currentStamps: member.stamps,
    requiredStamps: stamps.data?.required_stamps ?? 10,
    stampReward: stamps.data?.reward_name || "Recompensa del comercio",
    rewards: rewardOffers,
    campaigns: (campaigns.data ?? [])
      .filter(
        (c) =>
          ["active", "scheduled"].includes(c.status) &&
          isCurrent(c.starts_at, c.ends_at),
      )
      .map((c) => {
        const audienceEligible = matchesAudience(c.audience_segment);
        const candidate = {
          kind: "promotion" as const,
          startsAt: c.starts_at || undefined,
          endsAt: c.ends_at || undefined,
        };
        return {
          ...base,
          ...candidate,
          id: c.id,
          title: c.name,
          description: c.description || "",
          available:
            business.isMember &&
            audienceEligible &&
            canClaimOffer(candidate, member),
          action: business.isMember && audienceEligible ? c.type : undefined,
          eligibleForAudience: audienceEligible,
          meta: !audienceEligible
            ? "Exclusivo para otros clientes"
            : c.ends_at
              ? `Hasta ${new Date(c.ends_at).toLocaleDateString("es-CO")}`
              : "Consulta vigencia en el comercio",
          payload: {
            campaignId: c.id,
            campaignName: c.name,
            discountPercent: c.discount_percent,
            rewardPoints: c.reward_points,
          },
        };
      }),
    missions: (missions.data ?? [])
      .filter((m) => isCurrent(m.starts_at, m.ends_at))
      .map((m) => {
        const audienceEligible = matchesAudience(m.audience_segment);
        return {
          ...base,
          id: m.id,
          kind: "mission",
          title: m.name,
          description: m.description || "",
          meta: !business.isMember
            ? `Únete para participar · +${m.reward_points} pts`
            : audienceEligible
              ? `+${m.reward_points} pts de fidelidad`
              : "Misión para otro segmento de clientes",
          available: false,
          eligibleForAudience: audienceEligible,
          points:
            business.isMember && audienceEligible ? m.reward_points : undefined,
          goal: m.goal,
          progress:
            business.isMember && audienceEligible
              ? (progress.data?.find((p) => p.mission_id === m.id)?.progress ??
                0)
              : 0,
        };
      }),
    locations: business.address
      ? [{ id: business.id, name: "Sede principal", address: business.address }]
      : [],
  };
}
export async function getRewards(): Promise<Offer[]> {
  const businesses = await getBusinesses();
  const details = await Promise.all(
    businesses.filter((b) => b.isMember).map((b) => getBusinessDetail(b.slug)),
  );
  return details
    .flatMap((d) => [...d.rewards, ...d.campaigns, ...d.missions])
    .filter((offer) => offer.eligibleForAudience !== false);
}
export async function getOffer(slug: string, id: string) {
  const detail = await getBusinessDetail(slug);
  const offer = [
    ...detail.rewards,
    ...detail.campaigns,
    ...detail.missions,
  ].find((o) => o.id === id);
  if (!offer) throw new Error("Este beneficio ya no está disponible.");
  return { detail, offer };
}
export async function getUserProfile(): Promise<UserProfile> {
  if (isDemo) {
    const saved = JSON.parse(
      (await AsyncStorage.getItem("loyloop.demo.profile")) || "{}",
    );
    return {
      name: "Santiago Flórez",
      email: "santiago@ejemplo.com",
      phone: "+57 300 123 4567",
      birthDate: "2000-05-19",
      avatar: "",
      joinedAt: "2024-09-01",
      xp: 2450,
      level: "Oro",
      nextLevel: "Platino",
      nextXp: 3230,
      badges: ["Explorador", "Cliente frecuente", "Primer sello"],
      globalBenefits: [
        "Café gratis en comercios seleccionados",
        "2x puntos en restaurantes",
        "Descuentos exclusivos",
        "Acceso anticipado a nuevas promociones",
        "Beneficios premium y experiencias especiales",
      ],
      authenticated: false,
      ...saved,
    };
  }
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();
  if (error) throw error;
  const user = session?.user;
  const meta = user?.user_metadata ?? {};
  // Only server-managed metadata may award platform progress.
  const global = user?.app_metadata?.loylevel ?? {};
  return {
    name: meta.full_name || user?.email?.split("@")[0] || "Explorador",
    email: user?.email || "",
    phone: meta.phone || "",
    birthDate: meta.birth_date || "",
    avatar: meta.avatar_url || "",
    joinedAt: user?.created_at || "",
    xp: typeof global.xp === "number" ? Math.max(0, global.xp) : 0,
    level: typeof global.level === "string" ? global.level : "Bronce",
    nextLevel:
      typeof global.nextLevel === "string" ? global.nextLevel : "Plata",
    nextXp:
      typeof global.nextXp === "number" ? Math.max(1, global.nextXp) : 1000,
    badges: Array.isArray(global.badges)
      ? global.badges.filter((v: unknown) => typeof v === "string")
      : [],
    globalBenefits: Array.isArray(global.benefits)
      ? global.benefits.filter((v: unknown) => typeof v === "string")
      : [],
    authenticated: !!user,
  };
}
