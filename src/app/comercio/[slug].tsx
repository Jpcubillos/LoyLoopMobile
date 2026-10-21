import { useLocalSearchParams, router } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Image } from "expo-image";
import { ScrollView, Share, View } from "react-native";
import { CommerceHero } from "@/components/CommerceHero";
import { CommerceLogo } from "@/components/CommerceCard";
import { Locations } from "@/components/CommerceControls";
import { MembershipProgressCard } from "@/components/MembershipProgressCard";
import {
  MissionCard,
  PromotionCard,
  RewardCard,
} from "@/components/RewardCard";
import { ClaimInput, QRClaimCard } from "@/components/QRClaimCard";
import {
  Button,
  Feedback,
  Icon,
  IconButton,
  Pill,
  Screen,
  SectionHeader,
  Sheet,
  Txt,
  ui,
} from "@/components/ui/loyloop";
import { artwork, palette as c } from "@/constants/loyloop";
import { useResource } from "@/hooks/use-resource";
import { getBusinessDetail, joinBusiness } from "@/lib/loyloop-data";
import { PremiumIcon } from "@/components/PremiumIcon";
export default function ComercioDetalleScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const load = useCallback(() => getBusinessDetail(slug), [slug]);
  const { data: detail, loading, error, reload } = useResource(load);
  const [joining, setJoining] = useState(false);
  const [actionError, setActionError] = useState("");
  const [locations, setLocations] = useState(false);
  const [favorite, setFavorite] = useState(false);
  const [claim, setClaim] = useState<ClaimInput | null>(null);
  useEffect(() => {
    AsyncStorage.getItem(`loyloop.favorite.${slug}`).then((value) =>
      setFavorite(value === "true"),
    );
  }, [slug]);
  async function join() {
    if (!detail) return;
    setJoining(true);
    setActionError("");
    try {
      await joinBusiness(detail);
      await reload();
    } catch (err) {
      setActionError(
        err instanceof Error ? err.message : "No pudimos unirte al comercio.",
      );
    } finally {
      setJoining(false);
    }
  }
  function showQr() {
    if (detail)
      setClaim({
        title: "Acumular un sello",
        businessName: detail.name,
        businessSlug: detail.slug,
        action: "stamp_add",
      });
  }
  return (
    <Screen tabs={false} padding={0}>
      {detail ? (
        <>
          <View>
            {detail.slug === "cafe-central" ? (
              <CommerceHero />
            ) : (
              <Image
                source={
                  detail.logoUrl ? { uri: detail.logoUrl } : artwork.restaurant
                }
                contentFit="cover"
                style={{ height: 280 }}
              />
            )}
            <View
              style={[
                ui.row,
                {
                  position: "absolute",
                  left: 16,
                  right: 16,
                  top: 16,
                  justifyContent: "space-between",
                },
              ]}
            >
              <IconButton
                name="chevron-back"
                label="Volver"
                onPress={() =>
                  router.canGoBack()
                    ? router.back()
                    : router.replace("/comercios")
                }
              />
              <View style={ui.row}>
                <IconButton
                  name="share-social-outline"
                  label="Compartir comercio"
                  onPress={() => {
                    Share.share({
                      message: `Descubre ${detail.name} en LoyLoop: https://loy-loop.vercel.app/comercio/${detail.slug}`,
                    }).catch(() => setActionError("No se pudo compartir."));
                  }}
                />
                <IconButton
                  name={favorite ? "heart" : "heart-outline"}
                  label={
                    favorite ? "Quitar de favoritos" : "Añadir a favoritos"
                  }
                  color={c.cta}
                  onPress={() => {
                    const value = !favorite;
                    setFavorite(value);
                    void AsyncStorage.setItem(
                      `loyloop.favorite.${slug}`,
                      String(value),
                    );
                  }}
                />
              </View>
            </View>
          </View>
          <View
            style={{
              marginTop: -40,
              backgroundColor: "#fff",
              borderTopLeftRadius: 28,
              borderTopRightRadius: 28,
              padding: 20,
              gap: 22,
            }}
          >
            <View
              style={{
                marginTop: -58,
                alignSelf: "flex-start",
                padding: 8,
                borderRadius: 19,
                backgroundColor: "#fff",
                borderWidth: 1,
                borderColor: c.border,
              }}
            >
              <CommerceLogo business={detail} size={76} />
            </View>
            <View style={{ gap: 7 }}>
              <View style={[ui.row, { flexWrap: "wrap" }]}>
                <Txt size={25} weight="bold" style={{ flex: 1 }}>
                  {detail.name}
                </Txt>
                <Pill
                  text={detail.isMember ? "Miembro activo" : "Aún no inscrito"}
                  tone={detail.isMember ? "green" : "gray"}
                  icon={detail.isMember ? "ribbon-outline" : "person-outline"}
                />
              </View>
              <Txt size={13} color={c.muted}>
                {detail.category} · {detail.locations.length}{" "}
                {detail.locations.length === 1 ? "sede" : "sedes"}
                {detail.rating ? ` · ★ ${detail.rating}` : ""}
              </Txt>
            </View>
            {detail.isMember ? (
              <>
                <MembershipProgressCard business={detail} />
                <View style={ui.row}>
                  <Button
                    title="Mostrar QR"
                    icon="qr-code-outline"
                    onPress={showQr}
                    style={{ flex: 1 }}
                  />
                  <Button
                    title="Ver ubicaciones"
                    variant="secondary"
                    icon="location-outline"
                    onPress={() => setLocations(true)}
                    style={{ flex: 1 }}
                  />
                </View>
              </>
            ) : (
              <View
                style={[
                  ui.card,
                  {
                    backgroundColor: "#FFF7F8",
                    borderColor: "#FFD0D6",
                    gap: 16,
                  },
                ]}
              >
                <View style={ui.row}>
                  <PremiumIcon kind="gift" size={52} />
                  <View style={{ flex: 1, gap: 4 }}>
                    <Txt weight="bold" size={19}>
                      Únete a {detail.name}
                    </Txt>
                    <Txt color={c.muted} size={13}>
                      Desbloquea beneficios, acumula fidelidad y recibe
                      recompensas exclusivas.
                    </Txt>
                  </View>
                </View>
                <Button
                  title="Unirme al comercio"
                  loading={joining}
                  onPress={join}
                />
                <Button
                  title="Ver ubicaciones"
                  icon="location-outline"
                  variant="secondary"
                  onPress={() => setLocations(true)}
                />
              </View>
            )}
            <Feedback error={actionError} />
            {actionError.includes("Inicia sesión") && (
              <Button
                title="Iniciar sesión"
                onPress={() => router.push("/login")}
              />
            )}
            <View style={{ gap: 16 }}>
              <SectionHeader
                title={
                  detail.isMember
                    ? "Beneficios disponibles"
                    : "Beneficios que podrías obtener"
                }
              />
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ gap: 10 }}
              >
                {detail.rewards
                  .filter((o) => (detail.isMember ? o.available : true))
                  .map((o) => (
                    <RewardCard key={o.id} offer={o} variant="compact" />
                  ))}
              </ScrollView>
              {detail.isMember && !detail.rewards.some((o) => o.available) && (
                <Txt color={c.muted} size={12}>
                  Participa para desbloquear tu próximo beneficio.
                </Txt>
              )}
            </View>
            <View style={{ gap: 12 }}>
              <SectionHeader title="Recompensas" />
              {detail.rewards
                .filter((o) => o.kind === "reward" && !o.available)
                .map((o) => (
                  <RewardCard key={o.id} offer={o} />
                ))}
            </View>
            <View style={{ gap: 14 }}>
              <SectionHeader title="Promociones" />
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ gap: 10 }}
              >
                {detail.campaigns.map((o) => (
                  <PromotionCard key={o.id} offer={o} />
                ))}
              </ScrollView>
            </View>
            <View style={{ gap: 10 }}>
              <SectionHeader title="Misiones activas" />
              {detail.missions.map((o) => (
                <MissionCard key={o.id} offer={o} />
              ))}
            </View>
            <SectionHeader title="Ubicaciones" />
            <Locations locations={detail.locations} />
            <View
              style={[
                ui.card,
                ui.row,
                { backgroundColor: "#FFF8F9", borderWidth: 0 },
              ]}
            >
              <Icon name="storefront-outline" />
              <View style={{ flex: 1, gap: 4 }}>
                <Txt weight="semibold">Sobre este comercio</Txt>
                <Txt size={12} color={c.muted}>
                  {detail.description}
                </Txt>
              </View>
            </View>
            <Button
              title={
                detail.isMember
                  ? "Mostrar QR para acumular"
                  : "Unirme al comercio"
              }
              icon={detail.isMember ? "qr-code-outline" : "add-outline"}
              loading={joining}
              onPress={detail.isMember ? showQr : join}
            />
          </View>
        </>
      ) : (
        <View style={{ padding: 24 }}>
          <Button
            title="Volver a comercios"
            variant="ghost"
            onPress={() => router.replace("/comercios")}
          />
          <Feedback loading={loading} error={error} retry={reload} />
        </View>
      )}
      <Sheet
        visible={locations}
        title="Ubicaciones"
        onClose={() => setLocations(false)}
      >
        <Locations locations={detail?.locations ?? []} />
      </Sheet>
      <QRClaimCard
        input={claim}
        onClose={() => setClaim(null)}
        onApproved={reload}
      />
    </Screen>
  );
}
