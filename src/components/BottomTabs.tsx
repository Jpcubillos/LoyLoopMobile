import Ionicons from "@expo/vector-icons/Ionicons";
import { usePathname, useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { fonts, palette as c } from "@/constants/loyloop";
import { IconMedallion } from "@/components/PremiumIcon";
const tabs = [
  { label: "Inicio", href: "/", icon: "home-outline", activeIcon: "home" },
  {
    label: "Comercios",
    href: "/comercios",
    icon: "storefront-outline",
    activeIcon: "storefront",
  },
  {
    label: "Escanear QR de un comercio",
    href: "/escanear",
    icon: "qr-code-outline",
    activeIcon: "qr-code",
  },
  {
    label: "Beneficios",
    href: "/recompensas",
    icon: "gift-outline",
    activeIcon: "gift",
  },
  {
    label: "Perfil",
    href: "/perfil",
    icon: "person-outline",
    activeIcon: "person",
  },
] as const;
export function BottomTabs() {
  const pathname = usePathname();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  return (
    <View
      style={{
        backgroundColor: "#fff",
        borderTopWidth: 1,
        borderTopColor: c.border,
        paddingTop: 8,
        paddingBottom: Math.max(9, insets.bottom),
        paddingHorizontal: 8,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      {tabs.map((tab, i) => {
        const active = pathname === tab.href;
        const qr = i === 2;
        return (
          <Pressable
            key={tab.href}
            accessibilityRole={qr ? "button" : "tab"}
            accessibilityLabel={tab.label}
            accessibilityState={{ selected: !qr && active }}
            onPress={() =>
              qr ? router.push("/escanear") : router.replace(tab.href)
            }
            style={({ pressed }) => ({
              flex: qr ? undefined : 1,
              width: qr ? 56 : undefined,
              height: 56,
              marginHorizontal: 3,
              borderRadius: qr ? 28 : 15,
              alignItems: "center",
              justifyContent: "center",
              gap: 5,
              backgroundColor: qr ? c.primary : active ? c.soft : "#fff",
              opacity: pressed ? 0.7 : 1,
              ...(qr
                ? {
                    shadowColor: c.primary,
                    shadowOpacity: 0.3,
                    shadowOffset: { width: 0, height: 4 },
                    shadowRadius: 8,
                    elevation: 4,
                  }
                : {}),
            })}
          >
            {active && !qr ? (
              <IconMedallion name={tab.activeIcon} size={29} />
            ) : (
              <Ionicons
                name={tab.icon}
                size={qr ? 25 : 21}
                color={qr ? "#fff" : "#8B93A7"}
              />
            )}
            {!qr && (
              <Text
                style={{
                  fontFamily: active ? fonts.semibold : fonts.medium,
                  fontSize: 9,
                  color: active ? c.cta : "#7A7D8E",
                }}
              >
                {tab.label}
              </Text>
            )}
          </Pressable>
        );
      })}
    </View>
  );
}
