import { Image } from "expo-image";
import { router } from "expo-router";
import { Pressable, View } from "react-native";
import { getBusinessImage } from "@/lib/business-images";
import type { BusinessSummary } from "@/lib/loyloop-data";
import { artwork, palette as c } from "@/constants/loyloop";
import { Icon, Pill, Txt, ui } from "@/components/ui/loyloop";
import { PremiumIcon } from "@/components/PremiumIcon";
import { LinearGradient } from "expo-linear-gradient";

function CommerceCover({
  business,
  featured,
}: {
  business: BusinessSummary;
  featured: boolean;
}) {
  const height = featured ? 120 : 80;
  if (business.slug === "nispero-food" || business.slug === "cafe-central")
    return (
      <View style={{ width: "100%", height, overflow: "hidden" }}>
        <Image
          source={artwork.restaurant}
          contentFit="cover"
          style={{
            position: "absolute",
            width: featured ? 380 : 266,
            height: featured ? 251 : 176,
            left: featured ? -123 : -86,
            top: featured ? -34 : -27,
          }}
        />
      </View>
    );
  const source = business.logoUrl
    ? { uri: business.logoUrl }
    : getBusinessImage(business.slug);
  return (
    <LinearGradient
      colors={["#FFF4E9", "#FFE1E6", "#F9B8C5"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{
        width: "100%",
        height,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {source ? (
        <Image
          source={source}
          contentFit="contain"
          style={{
            width: featured ? 90 : 62,
            height: featured ? 90 : 62,
            borderRadius: 16,
          }}
        />
      ) : (
        <PremiumIcon kind="commerce" size={featured ? 76 : 56} />
      )}
    </LinearGradient>
  );
}
export function CommerceLogo({
  business,
  size = 58,
}: {
  business: Pick<BusinessSummary, "slug" | "name" | "logoUrl">;
  size?: number;
}) {
  const source = business.logoUrl
    ? { uri: business.logoUrl }
    : getBusinessImage(business.slug);
  return (
    <View
      style={{
        width: size,
        height: size,
        backgroundColor: "#FFF5F1",
        borderRadius: size > 60 ? 17 : size / 2,
        overflow: "hidden",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {source ? (
        <Image
          source={source}
          contentFit="contain"
          style={{ width: size, height: size }}
        />
      ) : (
        <PremiumIcon kind="commerce" size={size * 0.78} />
      )}
    </View>
  );
}
export function CommerceCard({
  business,
  variant = "medium",
}: {
  business: BusinessSummary;
  variant?:
    "compact" | "medium" | "featured" | "bubble" | "trending" | "benefit";
}) {
  const open = () => router.push(`/comercio/${business.slug}`);
  const meta = `${business.category}${business.distance != null ? ` | ${business.distance} Km` : business.address ? ` | ${business.address}` : ""}`;
  const cardLabel = business.credit || "Explorar comercio";
  const cardIcon = business.credit ? "gift-outline" : "storefront-outline";
  if (variant === "trending" || variant === "featured") {
    const featured = variant === "featured";
    return (
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Ver ${business.name}`}
        onPress={open}
        style={{
          width: featured ? 217 : 152,
          height: featured ? 210 : 159,
          borderRadius: featured ? 22 : 17,
          backgroundColor: featured ? "#fff" : "#FAFAFA",
          borderWidth: 1,
          borderColor: featured ? "#E2E8F0" : "#E2E2E2",
          overflow: "hidden",
          shadowColor: c.primary,
          shadowOpacity: featured ? 0.25 : 0,
          shadowRadius: 10,
          shadowOffset: { width: 0, height: 4 },
          elevation: featured ? 3 : 0,
        }}
      >
        <CommerceCover business={business} featured={featured} />
        <View
          style={{
            paddingHorizontal: featured ? 15 : 12,
            paddingTop: featured ? 6 : 4,
            gap: featured ? 4 : 2,
          }}
        >
          <Txt
            numberOfLines={1}
            weight="semibold"
            size={featured ? 12 : 11}
            color="#15121C"
          >
            {business.name}
          </Txt>
          <View style={[ui.row, { gap: 5, flexWrap: "nowrap" }]}>
            <Txt
              numberOfLines={1}
              size={featured ? 10 : 9}
              color="#756F7C"
              style={{ flexShrink: 1 }}
            >
              {meta}
            </Txt>
            {business.rating != null && (
              <View style={[ui.row, { gap: 3 }]}>
                <Image
                  source={require("../../assets/figma/b0be8.png")}
                  contentFit="contain"
                  style={{
                    width: featured ? 10 : 8,
                    height: featured ? 10 : 8,
                  }}
                />
                <Txt size={featured ? 10 : 9} color="#756F7C">
                  {business.rating.toFixed(1)}
                </Txt>
              </View>
            )}
          </View>
          {featured ? (
            <View
              style={{
                height: 30,
                borderRadius: 15,
                backgroundColor: "#E85757",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: 5,
                marginTop: 4,
              }}
            >
              <Txt color="#fff" size={9.5} weight="semibold">
                {business.credit ? "Ver beneficio" : "Ver comercio"}
              </Txt>
              <Icon name="arrow-forward" size={14} color="#fff" />
            </View>
          ) : (
            <View
              style={{
                alignSelf: "flex-start",
                height: 19,
                borderRadius: 9,
                borderWidth: 0.5,
                borderColor: c.primary,
                backgroundColor: c.soft,
                flexDirection: "row",
                alignItems: "center",
                gap: 4,
                paddingHorizontal: 8,
                marginTop: 2,
              }}
            >
              <Icon name={cardIcon} size={9} color="#E85757" />
              <Txt color="#E85757" size={7} weight="bold" numberOfLines={1}>
                {cardLabel}
              </Txt>
            </View>
          )}
        </View>
      </Pressable>
    );
  }
  if (variant === "benefit")
    return (
      <Pressable
        accessibilityRole="button"
        onPress={open}
        style={{
          height: 104,
          backgroundColor: "#fff",
          borderWidth: 1,
          borderColor: "#E2E8F0",
          borderRadius: 20,
          paddingHorizontal: 14,
          flexDirection: "row",
          alignItems: "center",
          gap: 15,
        }}
      >
        <CommerceLogo business={business} size={60} />
        <View style={{ flex: 1, gap: 2 }}>
          <Txt size={16} weight="semibold" numberOfLines={1} color="#15121C">
            {business.name}
          </Txt>
          <Txt size={12} color="#756F7C" numberOfLines={1}>
            {business.category}
          </Txt>
          <View style={[ui.row, { gap: 3 }]}>
            {business.distance != null ? (
              <Txt size={11} color="#756F7C">
                {business.distance} Km |
              </Txt>
            ) : business.address ? (
              <Txt
                size={11}
                color="#756F7C"
                numberOfLines={1}
                style={{ flexShrink: 1 }}
              >
                {business.address}
              </Txt>
            ) : null}
            {business.rating != null && (
              <>
                <Image
                  source={require("../../assets/figma/b0be8.png")}
                  contentFit="contain"
                  style={{ width: 10, height: 10 }}
                />
                <Txt size={11} color="#756F7C">
                  {business.rating.toFixed(1)}
                </Txt>
              </>
            )}
          </View>
          <View
            style={{
              alignSelf: "flex-start",
              borderWidth: 0.5,
              borderColor: c.primary,
              borderRadius: 9,
              backgroundColor: c.soft,
              paddingHorizontal: 9,
              paddingVertical: 2,
              flexDirection: "row",
              alignItems: "center",
              gap: 4,
            }}
          >
            <Icon name={cardIcon} color={c.cta} size={10} />
            <Txt color={c.cta} size={8} weight="semibold">
              {cardLabel}
            </Txt>
          </View>
        </View>
        <Icon name="chevron-forward" size={20} color={c.cta} />
      </Pressable>
    );
  if (variant === "bubble")
    return (
      <Pressable
        accessibilityRole="button"
        onPress={open}
        style={{ width: 80, alignItems: "center", gap: 8 }}
      >
        <CommerceLogo business={business} size={60} />
        <Txt size={11} weight="medium" numberOfLines={1}>
          {business.name}
        </Txt>
      </Pressable>
    );
  if (variant === "compact")
    return (
      <Pressable
        accessibilityRole="button"
        onPress={open}
        style={{
          height: 64,
          backgroundColor: "#fff",
          borderRadius: 14,
          paddingHorizontal: 10,
          flexDirection: "row",
          alignItems: "center",
          gap: 10,
        }}
      >
        <CommerceLogo business={business} size={60} />
        <View style={{ flex: 1, gap: 1 }}>
          <Txt size={15} weight="semibold" numberOfLines={1} color="#15121C">
            {business.name}
          </Txt>
          <Txt size={12} numberOfLines={1} color={c.cta}>
            {business.credit || business.category}
          </Txt>
        </View>
        <Icon name="chevron-forward" size={20} color={c.cta} />
      </Pressable>
    );
  return (
    <Pressable
      accessibilityRole="button"
      onPress={open}
      style={[
        ui.card,
        ui.row,
        {
          padding: 12,
          gap: 14,
          borderRadius: 20,
          minHeight: 102,
        },
      ]}
    >
      <CommerceLogo business={business} size={76} />
      <View style={{ flex: 1, gap: 4 }}>
        <Txt size={14} weight="semibold">
          {business.name}
        </Txt>
        <Txt size={11} color={c.muted}>
          {business.category}
          {business.distance != null ? ` · ${business.distance} km` : ""}
          {business.rating != null ? `  ★ ${business.rating}` : ""}
        </Txt>
        {!!business.credit && (
          <Pill text={business.credit} icon="gift-outline" />
        )}
        {!business.credit && business.isMember && (
          <Pill text={`${business.tier} · ${business.points} pts`} />
        )}
      </View>
      <Icon name="chevron-forward" size={18} />
    </Pressable>
  );
}
