import { Image } from "expo-image";
import { router } from "expo-router";
import { Image as NativeImage, Pressable, View } from "react-native";
import { artwork, palette as c } from "@/constants/loyloop";
import type { Offer } from "@/lib/loyloop-data";
import { CommerceLogo } from "@/components/CommerceCard";
import { Icon, Pill, Progress, Txt, ui } from "@/components/ui/loyloop";
export function openOffer(offer: Offer) {
  router.push({
    pathname: "/beneficio",
    params: { slug: offer.businessSlug, id: offer.id },
  });
}
export function RewardCard({
  offer,
  variant = "standard",
}: {
  offer: Offer;
  variant?: "compact" | "standard" | "featured";
}) {
  const status = !offer.isMember
    ? "Solo para miembros"
    : offer.available
      ? "Disponible para usar"
      : offer.meta;
  if (variant === "featured")
    return (
      <Pressable
        accessibilityRole="button"
        onPress={() => openOffer(offer)}
        style={[ui.card, { width: 248, padding: 0, overflow: "hidden" }]}
      >
        <View>
          <Image
            source={artwork.restaurant}
            contentFit="cover"
            style={{ height: 152 }}
          />
          <View
            style={{
              position: "absolute",
              top: 12,
              left: 12,
              right: 12,
              backgroundColor: "#FA4059",
              borderRadius: 12,
              padding: 10,
            }}
          >
            <Txt color="#fff" weight="semibold" style={{ textAlign: "center" }}>
              {offer.title}
            </Txt>
          </View>
        </View>
        <View style={{ padding: 14, gap: 12 }}>
          <View style={ui.row}>
            <CommerceLogo
              business={{ slug: offer.businessSlug, name: offer.businessName }}
              size={46}
            />
            <View style={{ flex: 1 }}>
              <Txt weight="semibold">{offer.businessName}</Txt>
              <Txt color={c.muted} size={11}>
                {offer.kind === "promotion"
                  ? "Promoción"
                  : offer.kind === "reward"
                    ? "Recompensa"
                    : "Beneficio"}
              </Txt>
            </View>
            <Icon name="chevron-forward" size={18} />
          </View>
          <View
            style={{
              backgroundColor: c.soft,
              borderRadius: 12,
              padding: 10,
              gap: 3,
            }}
          >
            <Txt size={12} color={c.cta} weight="medium">
              {status}
            </Txt>
            <Txt size={10} color={c.muted}>
              {offer.meta}
            </Txt>
          </View>
        </View>
      </Pressable>
    );
  return (
    <Pressable
      accessibilityRole="button"
      onPress={() => openOffer(offer)}
      style={[
        ui.card,
        ui.row,
        { gap: 12, padding: 12 },
        variant === "compact" && { width: 230 },
      ]}
    >
      <CommerceLogo
        business={{ slug: offer.businessSlug, name: offer.businessName }}
        size={58}
      />
      <View style={{ flex: 1, gap: 5 }}>
        <Txt weight="semibold" size={14}>
          {offer.title}
        </Txt>
        <Txt size={11} color={c.muted}>
          {variant === "compact" ? offer.meta : offer.businessName}
        </Txt>
        <Txt size={10} color={offer.available ? "#008957" : c.cta}>
          {status}
        </Txt>
      </View>
      <Icon
        name={!offer.isMember ? "lock-closed-outline" : "chevron-forward"}
        size={17}
      />
    </Pressable>
  );
}
export function PromotionCard({
  offer,
  variant = "vertical",
}: {
  offer: Offer;
  variant?: "compact" | "vertical" | "horizontal";
}) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={() => openOffer(offer)}
      style={[
        ui.card,
        {
          width: variant === "vertical" ? 164 : 260,
          padding: 12,
          gap: 10,
          backgroundColor: variant === "compact" ? "#FFF6F1" : "#fff",
        },
      ]}
    >
      <Pill text={offer.meta} icon="time-outline" />
      <CommerceLogo
        business={{ slug: offer.businessSlug, name: offer.businessName }}
        size={variant === "vertical" ? 90 : 50}
      />
      <Txt weight="bold" size={14}>
        {offer.title}
      </Txt>
      <Txt size={11} color={c.muted} numberOfLines={2}>
        {offer.description}
      </Txt>
      <View
        style={[
          ui.row,
          {
            backgroundColor: c.cta,
            borderRadius: 12,
            padding: 10,
            justifyContent: "space-between",
          },
        ]}
      >
        <Txt color="#fff" weight="semibold" size={11}>
          Ver promoción
        </Txt>
        <Icon name="arrow-forward" color="#fff" size={15} />
      </View>
    </Pressable>
  );
}
export function MissionCard({ offer }: { offer: Offer }) {
  const progress = Math.max(0, offer.progress ?? 0);
  const goal = Math.max(1, offer.goal ?? 1);
  return (
    <Pressable
      accessibilityRole="button"
      onPress={() => openOffer(offer)}
      style={[
        ui.card,
        ui.row,
        {
          minHeight: 84,
          gap: 10,
          paddingHorizontal: 10,
          paddingVertical: 12,
          borderRadius: 16,
          borderColor: "#E2E8F0",
          shadowColor: c.primary,
          shadowOpacity: 0.2,
          shadowRadius: 7,
          shadowOffset: { width: 0, height: 4 },
        },
      ]}
    >
      <NativeImage
        source={require("../../assets/figma/5546e.png")}
        resizeMode="contain"
        style={{ width: 53, height: 52 }}
      />
      <View style={{ flex: 1, minWidth: 0, gap: 8 }}>
        <Txt weight="semibold" size={12} numberOfLines={2} color="#15121C">
          {offer.title}
        </Txt>
        <View style={[ui.row, { gap: 8 }]}>
          <View style={{ flex: 1, minWidth: 28 }}>
            <Progress value={progress / goal} />
          </View>
          <Txt size={13} weight="semibold" color="#756F7C">
            {progress} / {goal}
          </Txt>
        </View>
      </View>
      <View
        style={{
          paddingHorizontal: 7,
          height: 29,
          justifyContent: "center",
          borderRadius: 15,
          backgroundColor: "#FFF0F0",
        }}
      >
        <Txt weight="semibold" size={11} color={c.primary}>
          {offer.points ? `+${offer.points} pts` : offer.meta}
        </Txt>
      </View>
      <Icon name="chevron-forward" size={20} color="#66759F" />
    </Pressable>
  );
}
