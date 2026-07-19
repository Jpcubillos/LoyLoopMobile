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
};

export type RewardSummary = {
  id: string;
  businessName: string;
  title: string;
  description: string;
  meta: string;
};

export type BusinessDetail = BusinessSummary & {
  currentStamps: number;
  requiredStamps: number;
  rewards: RewardSummary[];
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
  },
];

export const fallbackRewards: RewardSummary[] = [
  {
    id: "reward-stamps",
    businessName: "Cafe Central",
    title: "Cafe gratis con 10 sellos",
    description: "Completa 10 compras registradas y reclama en caja.",
    meta: "6/10 sellos",
  },
  {
    id: "reward-discount",
    businessName: "Cafe Central",
    title: "15% de descuento",
    description: "Disponible en tu proxima visita.",
    meta: "200 puntos",
  },
  {
    id: "reward-credit",
    businessName: "Cafe Central",
    title: "$5.000 de credito",
    description: "Credito promocional para tu compra.",
    meta: "$5.000",
  },
];

function formatCredit(cents?: number | null) {
  if (!cents) return "$0";
  return `$${Math.round(cents / 100).toLocaleString("es-CO")}`;
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
  }));
}

export async function getBusinessDetail(slug: string): Promise<BusinessDetail> {
  const businesses = await getBusinesses();
  const business = businesses.find((item) => item.slug === slug) ?? businesses[0] ?? fallbackBusinesses[0];
  const rewards = await getRewards();

  return {
    ...business,
    currentStamps: business.slug === "cafe-central" ? 6 : 0,
    requiredStamps: 10,
    rewards: rewards.filter((reward) => reward.businessName === business.name || business.slug === "cafe-central"),
    missions: [
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
    ],
  };
}
