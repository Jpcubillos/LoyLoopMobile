import { Image } from "expo-image";
import { Pressable, View } from "react-native";
import { Txt } from "@/components/ui/loyloop";

export function ScanQrCta({ onPress }: { onPress: () => void }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Escanear QR del comercio"
      accessibilityHint="Escanea el código del comercio para unirte y disfrutar sus beneficios"
      onPress={onPress}
      style={({ pressed }) => ({
        minHeight: 60,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: "#FF6B6B",
        backgroundColor: "#FFF7F8",
        flexDirection: "row",
        alignItems: "center",
        paddingLeft: 20,
        paddingRight: 15,
        gap: 10,
        shadowColor: "#0A142E",
        shadowOpacity: 0.14,
        shadowOffset: { width: 0, height: 6 },
        shadowRadius: 19,
        elevation: 4,
        opacity: pressed ? 0.8 : 1,
      })}
    >
      <Image
        source={require("../../assets/figma/qr-scan-cta.png")}
        contentFit="contain"
        style={{ width: 31, height: 31 }}
      />
      <View style={{ flex: 1, gap: 2 }}>
        <Txt size={13.5} weight="semibold" color="#0F172A" numberOfLines={1}>
          Escanear QR del comercio
        </Txt>
        <Txt size={9.5} weight="medium" color="#756F7C" numberOfLines={1}>
          Escanea su QR y empieza a disfrutar sus beneficios
        </Txt>
      </View>
      <Image
        source={require("../../assets/figma/qr-scan-chevron.png")}
        contentFit="contain"
        style={{ width: 18, height: 18 }}
      />
    </Pressable>
  );
}
