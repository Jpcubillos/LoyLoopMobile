import { Image } from "expo-image";
import { router } from "expo-router";
import { ScrollView, View } from "react-native";
import { useState } from "react";
import { CommerceCard } from "@/components/CommerceCard";
import { LevelBenefitCard } from "@/components/LevelBenefitCard";
import { ScanQrCta } from "@/components/ScanQrCta";
import {
  BrandCard,
  Button,
  Empty,
  Feedback,
  Icon,
  IconButton,
  Screen,
  SectionHeader,
  Sheet,
  Txt,
  ui,
} from "@/components/ui/loyloop";
import { artwork, palette as c } from "@/constants/loyloop";
import { useResource } from "@/hooks/use-resource";
import { getBusinesses, getUserProfile } from "@/lib/loyloop-data";
const load = async () => ({
  businesses: await getBusinesses(),
  profile: await getUserProfile(),
});
export default function HomeScreen() {
  const { data, loading, error, reload } = useResource(load);
  const [notice, setNotice] = useState(false);
  const businesses = data?.businesses ?? [];
  const explore = () =>
    router.push({ pathname: "/comercios", params: { tab: "explorar" } });
  const recommended = [...businesses]
    .filter((b) => !b.sponsored)
    .sort((a, b) => Number(a.isMember) - Number(b.isMember))
    .slice(0, 3);
  const featured = [
    ...businesses.filter((b) => b.sponsored),
    ...businesses.filter((b) => !b.sponsored),
  ].slice(0, 4);
  const trending = businesses.slice(0, 4);
  const benefitBusinesses = businesses.filter((b) => !!b.credit).slice(0, 2);
  return (
    <Screen background={c.canvas} padding={18}>
      <View
        style={[ui.row, { justifyContent: "space-between", marginBottom: 8 }]}
      >
        <View style={{ flex: 1 }}>
          <Txt size={22} weight="bold">
            ¡Hola, {data?.profile.name.split(" ")[0] ?? "Explorador"}!
          </Txt>
          <Txt size={11} color={c.muted}>
            Qué bueno verte de nuevo
          </Txt>
        </View>
        <IconButton
          name="notifications-outline"
          label="Novedades"
          onPress={() => setNotice(true)}
        />
      </View>
      <Feedback loading={loading && !data} error={error} retry={reload} />
      {!!recommended.length && (
        <BrandCard style={{ gap: 14, padding: 20 }}>
          <View style={[ui.row, { minHeight: 84 }]}>
            <Txt
              color="#fff"
              size={26}
              weight="bold"
              style={{ flex: 1, lineHeight: 31 }}
            >
              Recomendados{"\n"}para ti
            </Txt>
            <Image
              source={artwork.discover}
              contentFit="contain"
              style={{ width: 88, height: 85 }}
            />
          </View>
          <View style={{ gap: 4 }}>
            {recommended.map((b) => (
              <CommerceCard key={b.id} business={b} variant="compact" />
            ))}
          </View>
          <Button
            title="Descubrir más comercios   →"
            onPress={explore}
            style={{
              backgroundColor: "#FFFFFF20",
              borderWidth: 1,
              borderColor: "#FFFFFF66",
            }}
          />
          <View style={[ui.row, { justifyContent: "center" }]}>
            <Icon name="sparkles-outline" color="#fff" size={15} />
            <Txt color="#fff" size={10}>
              Nuevos lugares para disfrutar
            </Txt>
          </View>
        </BrandCard>
      )}
      <ScanQrCta onPress={() => router.push("/escanear")} />
      <View style={{ gap: 14 }}>
        <SectionHeader title="Beneficios de tu nivel LoyLoop" compact />
        {data?.profile && (
          <LevelBenefitCard profile={data.profile} variant="home" />
        )}
      </View>
      <View style={{ gap: 16 }}>
        <SectionHeader
          title="Tus comercios"
          compact
          action="Ver todos →"
          onPress={() => router.push("/comercios")}
        />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 12 }}
        >
          {businesses
            .filter((b) => b.isMember)
            .map((b) => (
              <CommerceCard key={b.id} business={b} variant="bubble" />
            ))}
        </ScrollView>
        {!loading && !businesses.some((b) => b.isMember) && (
          <Empty
            title="Tu próximo lugar favorito te espera"
            description="Explora comercios y únete para empezar a disfrutar sus beneficios."
          />
        )}
      </View>
      {!!featured.length && (
        <View style={{ gap: 15 }}>
          <SectionHeader
            title="Destacados"
            compact
            action="Ver todos →"
            onPress={explore}
          />
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 10, paddingBottom: 12 }}
          >
            {featured.map((b) => (
              <CommerceCard key={b.id} business={b} variant="featured" />
            ))}
          </ScrollView>
        </View>
      )}
      <View style={{ gap: 15 }}>
        <SectionHeader
          title="En tendencia"
          compact
          action="Ver todos"
          onPress={explore}
        />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 8 }}
        >
          {trending.map((b) => (
            <CommerceCard key={b.id} business={b} variant="trending" />
          ))}
        </ScrollView>
      </View>
      {!!benefitBusinesses.length && (
        <View style={{ gap: 14 }}>
          <SectionHeader
            title="Más beneficios"
            compact
            action="Ver todo →"
            onPress={() => router.push("/recompensas")}
          />
          {benefitBusinesses.map((b) => (
            <CommerceCard key={b.id} business={b} variant="benefit" />
          ))}
        </View>
      )}
      <Sheet
        visible={notice}
        title="Novedades"
        onClose={() => setNotice(false)}
      >
        <Empty
          title="Todo al día"
          description="Aquí encontrarás las novedades de tus comercios y de LoyLoop."
        />
      </Sheet>
    </Screen>
  );
}
