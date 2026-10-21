import Ionicons from "@expo/vector-icons/Ionicons";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { View } from "react-native";
import type { IconName } from "@/components/ui/loyloop";

const illustrations = {
  commerce: require("../../assets/figma/746ee.png"),
  gift: require("../../assets/figma/8775b.png"),
  mission: require("../../assets/figma/5546e.png"),
  success: require("../../assets/figma/22f24.png"),
  level: require("../../assets/figma/0b54a.png"),
} as const;

export function PremiumIcon({
  kind,
  size = 52,
}: {
  kind: keyof typeof illustrations;
  size?: number;
}) {
  return (
    <Image
      source={illustrations[kind]}
      contentFit="contain"
      style={{ width: size, height: size }}
    />
  );
}

export function IconMedallion({
  name,
  size = 42,
  tone = "coral",
}: {
  name: IconName;
  size?: number;
  tone?: "coral" | "gold" | "violet";
}) {
  const colors =
    tone === "gold"
      ? (["#FFF8DF", "#F8E6AF"] as const)
      : tone === "violet"
        ? (["#F6EEFF", "#EAD9FF"] as const)
        : (["#FFF1EC", "#FFDDE2"] as const);
  const color =
    tone === "gold" ? "#AD7622" : tone === "violet" ? "#8C4EB8" : "#E94E63";
  return (
    <LinearGradient
      colors={colors}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{
        width: size,
        height: size,
        borderRadius: Math.round(size * 0.34),
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1,
        borderColor: "#FFFFFFCC",
      }}
    >
      <View
        style={{
          position: "absolute",
          top: 3,
          left: 6,
          width: size * 0.43,
          height: size * 0.16,
          borderRadius: size,
          backgroundColor: "#FFFFFF99",
        }}
      />
      <Ionicons name={name} size={Math.round(size * 0.52)} color={color} />
    </LinearGradient>
  );
}
