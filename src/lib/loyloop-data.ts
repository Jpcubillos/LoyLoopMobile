import { isSupabaseConfigured, supabase } from "@/lib/supabase";

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
  pointsToVip: number;
};

export type RewardSummary = {
  id: string;
  businessName: string;
  title: string;
  description: string;
  meta: string;
  type: "discount" | "points" | "credit" | "product";
};

export type BusinessDetail = BusinessSummary & {
  currentStamps: number;
  requiredStamps: number;
  rewards: RewardSummary[];
  campaigns: Array<{
    id: string;
    title: string;
    description: string;
    action: "discount_redeem" | "points_boost";
    meta: string;
    payload: Record<string, unknown>;
  }>;
  missions: Array<{
    id: string;
    title: string;
    description: string;
    points: number;
  }>;
};

export const fallbackBusinesses: BusinessSummary[] = [
  {
    id: "demo-cafe",
    slug: "cafe-central",
    name: "Cafe Central",
    category: "Cafeteria",
    description: "Cafe de barrio con recompensas, sellos y pagos MiniPay.",
    address: "Cra. 7 #45-12, Bogota",
    points: 120,
    credit: "$5.000",
    tier: "Cliente frecuente",
    pointsToVip: 80,
  },
  {
    id: "demo-barber",
    slug: "barberia-norte",
    name: "Barberia Norte",
    category: "Barberia",
    description: "Cortes, barba y membresias para clientes frecuentes.",
    address: "Calle 80 #12-30, Bogota",
    points: 80,
    credit: "15% off",
    tier: "Activo",
    pointsToVip: 120,
  },
  {
    id: "demo-wash",
    slug: "green-wash",
    name: "Green Wash",
    category: "Lavadero",
    description: "Lavado de carros y motos con puntos dobles.",
    address: "Av. 19 #104-22, Bogota",
    points: 45,
    credit: "2x puntos",
    tier: "Nuevo",
    pointsToVip: 155,
  },
];

export const fallbackRewards: RewardSummary[] = [
  {
    id: "reward-stamps",
    businessName: "Cafe Central",
    title: "Cafe gratis con 10 sellos",
    description: "Completa 10 compras registradas y reclama en caja.",
    meta: "6/10 sellos",
    type: "product",
  },
  {
    id: "reward-discount",
    businessName: "Cafe Central",
    title: "15% de descuento",
    description: "Disponible en tu proxima visita.",
    meta: "200 puntos",
    type: "discount",
  },
  {
    id: "reward-credit",
    businessName: "Cafe Central",
    title: "$5.000 de credito",
    description: "Credito promocional para tu compra.",
    meta: "$5.000",
    type: "credit",
  },
];

const businessRewards: Record<string, RewardSummary[]> = {
  "cafe-central": fallbackRewards,
  "barberia-norte": [
    {
      id: "barber-cut-discount",
      businessName: "Barberia Norte",
      title: "Corte con 15% de descuento",
      description: "Disponible en tu proxima visita entre semana.",
      meta: "80 puntos",
      type: "discount",
    },
    {
      id: "barber-beard-free",
      businessName: "Barberia Norte",
      title: "Barba gratis con 8 visitas",
      description: "Completa tu tarjeta y redime el servicio en caja.",
      meta: "4/8 sellos",
      type: "product",
    },
  ],
  "green-wash": [
    {
      id: "wash-premium",
      businessName: "Green Wash",
      title: "Upgrade a lavado premium",
      description: "Redime un upgrade cuando completes tus visitas.",
      meta: "5/10 sellos",
      type: "product",
    },
    {
      id: "wash-credit",
      businessName: "Green Wash",
      title: "$7.000 de credito",
      description: "Credito para tu proximo lavado.",
      meta: "$7.000",
      type: "credit",
    },
  ],
};

function formatCredit(cents?: number | null) {
  if (!cents) return "$0";
  return `$${Math.round(cents / 100).toLocaleString("es-CO")}`;
}

async function getCurrentCustomerId() {
  const { data: sessionData } = await supabase.auth.getSession();
  const email = sessionData.session?.user.email ?? "juan@loyloop.app";

  const { data } = await supabase
    .from("customer_profiles")
    .select("id")
    .eq("email", email)
    .maybeSingle();

  return data?.id ?? null;
}

export async function getBusinesses(): Promise<BusinessSummary[]> {
  if (!isSupabaseConfigured) return fallbackBusinesses;

  const { data, error } = await supabase
    .from("businesses")
    .select("id, slug, name, category, description, address")
    .order("created_at", { ascending: true });

  if (error || !data?.length) return fallbackBusinesses;

  return data.map((business, index) => ({
    id: business.id,
    slug: business.slug,
    name: business.name,
    category: business.category,
    description: business.description ?? "Comercio con beneficios LoyLoop.",
    address: business.address ?? "Sin direccion",
    points: fallbackBusinesses[index]?.points ?? 0,
    credit: fallbackBusinesses[index]?.credit ?? "$0",
    tier: fallbackBusinesses[index]?.tier ?? "Nuevo",
    pointsToVip: fallbackBusinesses[index]?.pointsToVip ?? 150,
  }));
}

export async function getRewards(): Promise<RewardSummary[]> {
  if (!isSupabaseConfigured) return fallbackRewards;

  const { data, error } = await supabase
    .from("rewards")
    .select("id, name, description, points_required, credit_amount_cents, businesses(name)")
    .eq("active", true)
    .order("created_at", { ascending: false });

  if (error || !data?.length) return fallbackRewards;

  return data.map((reward: any) => ({
    id: reward.id,
    businessName: reward.businesses?.name ?? "Comercio",
    title: reward.name,
    description: reward.description ?? "Beneficio disponible.",
    meta: reward.points_required
      ? `${reward.points_required} puntos`
      : reward.credit_amount_cents
        ? formatCredit(reward.credit_amount_cents)
        : "Disponible",
    type: reward.type ?? "product",
  }));
}

export async function getBusinessDetail(slug: string): Promise<BusinessDetail> {
  const businesses = await getBusinesses();
  const business = businesses.find((item) => item.slug === slug) ?? businesses[0] ?? fallbackBusinesses[0];
  const rewards = await getRewards();
  const fallbackByBusiness = businessRewards[business.slug] ?? businessRewards["cafe-central"];
  const rewardsForBusiness = isSupabaseConfigured
    ? rewards.filter((reward) => reward.businessName === business.name)
    : fallbackByBusiness;

  if (!isSupabaseConfigured || business.id.startsWith("demo-")) {
    return {
      ...business,
      currentStamps: business.slug === "barberia-norte" ? 4 : business.slug === "green-wash" ? 5 : 6,
      requiredStamps: business.slug === "barberia-norte" ? 8 : 10,
      rewards: rewardsForBusiness.length ? rewardsForBusiness : fallbackByBusiness,
      campaigns: getFallbackCampaigns(business.slug),
      missions: getFallbackMissions(business.slug),
    };
  }

  const customerId = await getCurrentCustomerId();

  const [{ data: membership }, { data: stampCard }, { data: campaigns }, { data: missions }] = await Promise.all([
    customerId
      ? supabase
          .from("business_memberships")
          .select("points_balance, credit_balance_cents, tier")
          .eq("business_id", business.id)
          .eq("customer_id", customerId)
          .maybeSingle()
      : Promise.resolve({ data: null }),
    customerId
      ? supabase
          .from("stamp_cards")
          .select("current_stamps, required_stamps")
          .eq("business_id", business.id)
          .eq("customer_id", customerId)
          .eq("active", true)
          .maybeSingle()
      : Promise.resolve({ data: null }),
    supabase
      .from("campaigns")
      .select("id, name, type, description, discount_percent, reward_points")
      .eq("business_id", business.id)
      .eq("active", true)
      .in("status", ["active", "scheduled"])
      .order("created_at", { ascending: false }),
    supabase
      .from("missions")
      .select("id, name, description, reward_points")
      .eq("business_id", business.id)
      .eq("active", true)
      .order("created_at", { ascending: false }),
  ]);

  return {
    ...business,
    points: membership?.points_balance ?? business.points,
    credit: membership?.credit_balance_cents ? formatCredit(membership.credit_balance_cents) : business.credit,
    tier: membership?.tier ?? business.tier,
    currentStamps: stampCard?.current_stamps ?? 0,
    requiredStamps: stampCard?.required_stamps ?? 10,
    rewards: rewardsForBusiness.length ? rewardsForBusiness : fallbackByBusiness,
    campaigns: campaigns?.length
      ? campaigns.map((campaign: any) => ({
          id: campaign.id,
          title: campaign.name,
          description: campaign.description ?? "Campana disponible.",
          action: campaign.type,
          meta: campaign.type === "points_boost" ? `+${campaign.reward_points ?? 0} pts` : `${campaign.discount_percent ?? 0}%`,
          payload: {
            campaignId: campaign.id,
            campaignName: campaign.name,
            discountPercent: campaign.discount_percent,
            rewardPoints: campaign.reward_points,
          },
        }))
      : getFallbackCampaigns(business.slug),
    missions: missions?.length
      ? missions.map((mission: any) => ({
          id: mission.id,
          title: mission.name,
          description: mission.description ?? "Mision activa.",
          points: mission.reward_points ?? 0,
        }))
      : getFallbackMissions(business.slug),
  };
}

function getFallbackCampaigns(slug: string): BusinessDetail["campaigns"] {
  if (slug === "barberia-norte") {
    return [
      {
        id: "campaign-barber-week",
        title: "Martes de barba",
        description: "Pide corte y recibe barba al 50%.",
        action: "discount_redeem",
        meta: "50%",
        payload: { campaignName: "Martes de barba", discountPercent: 50 },
      },
      {
        id: "campaign-barber-points",
        title: "Puntos dobles en la manana",
        description: "Valido antes de las 11 a.m.",
        action: "points_boost",
        meta: "+30 pts",
        payload: { campaignName: "Puntos dobles en la manana", rewardPoints: 30 },
      },
    ];
  }

  if (slug === "green-wash") {
    return [
      {
        id: "campaign-wash-rain",
        title: "Lavado express",
        description: "Beneficio especial en horas valle.",
        action: "discount_redeem",
        meta: "20%",
        payload: { campaignName: "Lavado express", discountPercent: 20 },
      },
      {
        id: "campaign-wash-points",
        title: "Puntos dobles para motos",
        description: "Disponible hoy hasta las 5 p.m.",
        action: "points_boost",
        meta: "+25 pts",
        payload: { campaignName: "Puntos dobles para motos", rewardPoints: 25 },
      },
    ];
  }

  return [
    {
      id: "campaign-discount",
      title: "15% de descuento",
      description: "Disponible en tu proxima visita.",
      action: "discount_redeem",
      meta: "Descuento",
      payload: { campaignName: "15% de descuento", discountPercent: 15 },
    },
    {
      id: "campaign-points",
      title: "Puntos dobles",
      description: "Hoy de 3 p.m. a 5 p.m.",
      action: "points_boost",
      meta: "+20 pts",
      payload: { campaignName: "Puntos dobles", rewardPoints: 20 },
    },
  ];
}

function getFallbackMissions(slug: string): BusinessDetail["missions"] {
  if (slug === "barberia-norte") {
    return [
      {
        id: "mission-barber-frequency",
        title: "Agenda 2 cortes este mes",
        description: "Lleva 1 de 2 visitas registradas.",
        points: 60,
      },
      {
        id: "mission-barber-review",
        title: "Recomienda tu barbero",
        description: "Comparte tu experiencia y suma puntos.",
        points: 35,
      },
    ];
  }

  if (slug === "green-wash") {
    return [
      {
        id: "mission-wash-frequency",
        title: "Lava 2 veces este mes",
        description: "Completa visitas en horas valle.",
        points: 45,
      },
      {
        id: "mission-wash-minipay",
        title: "Paga con MiniPay",
        description: "Usa MiniPay en tu proximo lavado.",
        points: 30,
      },
    ];
  }

  return [
    {
      id: "mission-frequency",
      title: "Compra 2 veces esta semana",
      description: "Completa tus visitas antes del domingo.",
      points: 50,
    },
    {
      id: "mission-minipay",
      title: "Paga con MiniPay",
      description: "Usa MiniPay en tu proxima compra.",
      points: 30,
    },
  ];
}
