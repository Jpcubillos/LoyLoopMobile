import { LinearGradient } from "expo-linear-gradient";
import { Image } from "expo-image";
import { router } from "expo-router";
import { useState } from "react";
import { Pressable, View } from "react-native";
import type { UserProfile } from "@/lib/loyloop-data";
import { Icon, Txt } from "@/components/ui/loyloop";
import { palette as c } from "@/constants/loyloop";

const levelDetails = [
  {
    match: /café gratis/i,
    title: "Café gratis",
    subtitle: "En comercios seleccionados",
    icon: require("../../assets/figma/c048f.png"),
    width: 24,
    height: 24,
  },
  {
    match: /2x puntos/i,
    title: "2x puntos",
    subtitle: "En restaurantes",
    icon: require("../../assets/figma/bdb54.png"),
    width: 22.2222,
    height: 22.2222,
  },
  {
    match: /descuentos exclusivos/i,
    title: "Descuentos exclusivos",
    subtitle: "En productos y servicios",
    icon: require("../../assets/figma/2253d.png"),
    width: 24,
    height: 24,
  },
  {
    match: /acceso anticipado/i,
    title: "Acceso anticipado",
    subtitle: "A nuevas promociones",
    icon: require("../../assets/figma/b6236.png"),
    width: 27,
    height: 27,
  },
  {
    match: /beneficios premium/i,
    title: "Beneficios premium",
    subtitle: "Experiencias especiales y eventos",
    icon: require("../../assets/figma/00421.png"),
    width: 19.1892,
    height: 18.9767,
  },
];

const homeBenefitIcons = [
  require("../../assets/figma/bef09.png"),
  require("../../assets/figma/b0be8.png"),
  require("../../assets/figma/db690.png"),
];

export function LevelBenefitCard({
  profile,
  variant = "expanded",
}: {
  profile: UserProfile;
  variant?: "home" | "expanded";
}) {
  const [expanded, setExpanded] = useState(true);
  const benefits = profile.globalBenefits.map((benefit) => {
    const detail = levelDetails.find((item) => item.match.test(benefit));
    return {
      key: benefit,
      title: detail?.title || benefit,
      subtitle: detail?.subtitle || "Beneficio de tu nivel LoyLoop",
      icon: detail?.icon || require("../../assets/figma/c048f.png"),
      width: detail?.width || 24,
      height: detail?.height || 24,
    };
  });
  const hasAssignedBenefits = benefits.length > 0;
  const visibleBenefits = hasAssignedBenefits
    ? benefits
    : levelDetails.map((item) => ({ ...item, key: item.title }));
  const openLevel = () =>
    router.push({ pathname: "/perfil", params: { panel: "nivel" } });

  if (variant === "home") {
    return (
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Ver todos tus beneficios"
        onPress={() => router.push("/recompensas")}
        style={{
          borderRadius: 20,
          overflow: "hidden",
          backgroundColor: "#fff",
        }}
      >
        <LinearGradient
          colors={["#FFD6C5", "#FF8C9E", "#F57ABA"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{
            height: 60,
            paddingLeft: 16,
            paddingRight: 14,
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
          }}
        >
          <Image
            source={require("../../assets/figma/2a4d6.png")}
            contentFit="contain"
            style={{ width: 34, height: 34 }}
          />
          <View style={{ flex: 1 }}>
            <Txt size={16} weight="semibold" color="#15121C">
              Tus beneficios
            </Txt>
            <Txt size={12} color="#756F7C">
              Eres nivel {profile.level}
            </Txt>
          </View>
          <View
            style={{
              width: 34,
              height: 34,
              borderRadius: 17,
              backgroundColor: "#fff",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Image
              source={require("../../assets/figma/0e63c.png")}
              contentFit="contain"
              style={{ width: 16, height: 16 }}
            />
          </View>
        </LinearGradient>
        <View style={{ paddingHorizontal: 16, paddingVertical: 10, gap: 8 }}>
          <View style={{ minHeight: 72, gap: 4 }}>
            {profile.globalBenefits.slice(0, 3).map((benefit, index) => (
              <View
                key={`${benefit}-${index}`}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 10,
                  minHeight: 20,
                }}
              >
                <Image
                  source={homeBenefitIcons[index]}
                  contentFit="contain"
                  style={{ width: 18, height: 18 }}
                />
                <Txt
                  size={12}
                  color="#15121C"
                  numberOfLines={1}
                  style={{ flex: 1 }}
                >
                  {benefit}
                </Txt>
              </View>
            ))}
            {!hasAssignedBenefits && (
              <Txt size={11} color="#756F7C" style={{ lineHeight: 17 }}>
                Tu nivel aún no tiene beneficios globales asignados. Descubre las
                ventajas disponibles en tus comercios.
              </Txt>
            )}
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Txt size={12.5} weight="semibold" color={c.primary}>
              Ver todos tus beneficios
            </Txt>
            <Image
              source={require("../../assets/figma/86ecb.png")}
              contentFit="contain"
              style={{ width: 18, height: 18 }}
            />
          </View>
        </View>
      </Pressable>
    );
  }

  return (
    <View
      style={{
        borderRadius: 18,
        borderWidth: 2,
        borderColor: "#FFFFFF",
        backgroundColor: "#FFFAF0",
        padding: 2,
        paddingBottom: expanded ? 12 : 2,
        gap: expanded ? 10 : 0,
        shadowColor: "#80622F",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 14,
        elevation: 2,
      }}
    >
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${expanded ? "Ocultar" : "Mostrar"} beneficios de nivel ${profile.level}`}
        accessibilityState={{ expanded }}
        onPress={() => setExpanded((value) => !value)}
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 12,
          minHeight: 82,
          paddingLeft: "22%",
          paddingRight: 12,
          paddingVertical: 12,
          borderRadius: 14,
          overflow: "hidden",
          backgroundColor: "#FAECCD",
        }}
      >
        <Image
          source={require("../../assets/images/level-gold-banner.png")}
          contentFit="cover"
          accessible={false}
          pointerEvents="none"
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
          }}
        />
        <View style={{ flex: 1, gap: 1 }}>
          <Txt size={17} weight="bold" color="#15121C">
            {profile.level}
          </Txt>
          <Txt size={10} color="#756F7C" numberOfLines={2}>
            Descuentos exclusivos, más puntos y mucho más.
          </Txt>
        </View>
        <View
          style={{
            width: 28,
            height: 28,
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 14,
            backgroundColor: "#fff",
          }}
        >
          <Icon
            name={expanded ? "chevron-up" : "chevron-down"}
            size={17}
            color={c.primary}
          />
        </View>
      </Pressable>
      {expanded && (
        <>
          <View
            style={{
              minHeight: 48,
              marginHorizontal: 8,
              justifyContent: "center",
              paddingHorizontal: 19,
              borderRadius: 12,
              backgroundColor: "#fff",
            }}
          >
            <Txt size={10} color="#15121C">
              {hasAssignedBenefits
                ? `Disfruta de todos los beneficios de nivel ${profile.level} en nuestros comercios aliados.`
                : `Tu nivel ${profile.level} aún no tiene beneficios globales asignados. Conoce ejemplos de lo que puedes encontrar al progresar.`}
            </Txt>
          </View>
          <View style={{ gap: 4, marginHorizontal: 8 }}>
            {visibleBenefits.map((benefit) => (
              <Pressable
                key={benefit.key}
                accessibilityRole="button"
                accessibilityLabel={`${benefit.title}. ${hasAssignedBenefits ? benefit.subtitle : "Ejemplo, aún no disponible"}`}
                accessibilityState={{ disabled: !hasAssignedBenefits }}
                disabled={!hasAssignedBenefits}
                onPress={openLevel}
                style={{
                  minHeight: 45,
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 12,
                  paddingHorizontal: 12,
                  borderRadius: 12,
                  backgroundColor: "#fff",
                }}
              >
                <View
                  style={{
                    width: 24,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Image
                    source={benefit.icon}
                    contentFit="contain"
                    style={{ width: benefit.width, height: benefit.height }}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Txt
                    size={11}
                    weight="semibold"
                    color="#15121C"
                    numberOfLines={1}
                  >
                    {benefit.title}
                  </Txt>
                  <Txt size={9} color="#756F7C" numberOfLines={1}>
                    {hasAssignedBenefits ? benefit.subtitle : "Ejemplo · aún no disponible"}
                  </Txt>
                </View>
                <Icon
                  name={hasAssignedBenefits ? "chevron-forward" : "lock-closed-outline"}
                  size={17}
                  color={hasAssignedBenefits ? c.primary : "#9DA3B0"}
                />
              </Pressable>
            ))}
          </View>
        </>
      )}
    </View>
  );
}
