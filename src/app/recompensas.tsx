import { Image } from "expo-image";
import { useState } from "react";
import { ScrollView, View } from "react-native";
import {
  MissionCard,
  PromotionCard,
  RewardCard,
} from "@/components/RewardCard";
import { LevelBenefitCard } from "@/components/LevelBenefitCard";
import { SortOrder, SortTrigger } from "@/components/CommerceControls";
import {
  BrandCard,
  Empty,
  Feedback,
  Header,
  Screen,
  SectionHeader,
  Tabs,
  Txt,
  ui,
} from "@/components/ui/loyloop";
import { artwork } from "@/constants/loyloop";
import { useResource } from "@/hooks/use-resource";
import { getRewards, getUserProfile } from "@/lib/loyloop-data";
const load = async () => ({
  offers: await getRewards(),
  profile: await getUserProfile(),
});
const tabs = ["Todos", "Recompensas", "Promociones", "Misiones"] as const;
export default function BeneficiosScreen() {
  const [tab, setTab] = useState<(typeof tabs)[number]>("Todos");
  const [sort, setSort] = useState<SortOrder>("Disponibles primero");
  const { data, error, loading, reload } = useResource(load);
  const offers = (data?.offers ?? [])
    .slice()
    .sort((a, b) =>
      sort === "Nombre"
        ? a.title.localeCompare(b.title)
        : Number(b.available) - Number(a.available),
    );
  const available = offers.filter((o) => o.available && o.kind !== "promotion");
  const rewards = offers.filter(
    (o) => o.kind === "reward" || o.kind === "benefit",
  );
  const promotions = offers.filter((o) => o.kind === "promotion");
  const missions = offers.filter((o) => o.kind === "mission");
  return (
    <Screen>
      <Header
        title="Beneficios"
        subtitle="Todo lo que tienes para ganar y disfrutar"
      />
      {data && (
        <BrandCard style={{ padding: 16 }}>
          <View style={ui.row}>
            <View style={{ flex: 1, gap: 8 }}>
              <Txt weight="semibold" size={17} color="#fff">
                Hola, {data.profile.name.split(" ")[0]} 👋
              </Txt>
              <Txt size={11} color="#FFFFFFDD">
                Aquí están tus beneficios
              </Txt>
              <View style={[ui.row, { gap: 20, marginTop: 8 }]}>
                <Txt color="#fff" size={13} weight="semibold">
                  {available.length}
                  {"\n"}disponibles
                </Txt>
                <Txt color="#fff" size={13} weight="semibold">
                  {rewards.filter((o) => !o.available).length}
                  {"\n"}por desbloquear
                </Txt>
              </View>
            </View>
            <Image
              source={artwork.gift}
              contentFit="contain"
              style={{ width: 104, height: 130 }}
            />
          </View>
        </BrandCard>
      )}
      <Tabs items={tabs} value={tab} onChange={setTab} />
      <SortTrigger
        value={sort}
        onChange={setSort}
        options={["Disponibles primero", "Nombre"]}
      />
      <Feedback loading={loading && !data} error={error} retry={reload} />
      {tab === "Todos" && (
        <>
          <SectionHeader
            title="Beneficios disponibles"
            action="Ver todos"
            onPress={() => setTab("Recompensas")}
          />
          {available.length ? (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: 12 }}
            >
              {available.map((o) => (
                <RewardCard key={o.id} offer={o} variant="featured" />
              ))}
            </ScrollView>
          ) : (
            <Empty
              title="Tu siguiente beneficio está cerca"
              description="Participa en tus comercios para desbloquear recompensas."
            />
          )}
          {data && <LevelBenefitCard profile={data.profile} />}
        </>
      )}
      {(tab === "Todos" || tab === "Misiones") && (
        <View style={{ gap: 12 }}>
          <SectionHeader
            title="Misiones en curso"
            action={tab === "Todos" ? "Ver todas" : undefined}
            onPress={() => setTab("Misiones")}
          />
          {(tab === "Todos" ? missions.slice(0, 2) : missions).map((o) => (
            <MissionCard key={o.id} offer={o} />
          ))}
          {!missions.length && (
            <Empty
              title="Aún no tienes misiones"
              description="Las misiones de tus comercios aparecerán aquí."
            />
          )}
        </View>
      )}
      {(tab === "Todos" || tab === "Promociones") && (
        <View style={{ gap: 12 }}>
          <SectionHeader
            title="Promociones"
            action={tab === "Todos" ? "Ver todas" : undefined}
            onPress={() => setTab("Promociones")}
          />
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 12 }}
          >
            {promotions.map((o) => (
              <PromotionCard
                key={o.id}
                offer={o}
                variant={tab === "Todos" ? "compact" : "vertical"}
              />
            ))}
          </ScrollView>
          {!promotions.length && (
            <Empty
              title="Nuevas oportunidades pronto"
              description="Aquí verás las promociones de tus comercios."
            />
          )}
        </View>
      )}
      {tab === "Recompensas" && (
        <View style={{ gap: 12 }}>
          <SectionHeader title="Tus beneficios y recompensas" />
          {rewards.map((o) => (
            <RewardCard key={o.id} offer={o} />
          ))}
          {!rewards.length && (
            <Empty
              title="Descubre lo que puedes ganar"
              description="Únete a comercios para empezar a progresar."
            />
          )}
        </View>
      )}
    </Screen>
  );
}
