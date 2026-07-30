import Ionicons from "@expo/vector-icons/Ionicons";
import { usePathname, useRouter } from "expo-router";
import type { ComponentProps } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

type IconName = ComponentProps<typeof Ionicons>["name"];

const tabs = [
  { label: "Inicio", href: "/", icon: "home-outline", activeIcon: "home" },
  { label: "Comercios", href: "/comercios", icon: "storefront-outline", activeIcon: "storefront" },
  { label: "Escanear", href: "/escanear", icon: "scan-outline", activeIcon: "scan" },
  { label: "Premios", href: "/recompensas", icon: "gift-outline", activeIcon: "gift" },
  { label: "Perfil", href: "/perfil", icon: "person-outline", activeIcon: "person" },
] as const satisfies ReadonlyArray<{ label: string; href: string; icon: IconName; activeIcon: IconName }>;

export function BottomTabs() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <View style={styles.container}>
      {tabs.map((tab) => {
        const active = tab.href === "/" ? pathname === "/" || pathname.startsWith("/comercio/") : pathname === tab.href;

        return (
          <Pressable
            key={tab.href}
            style={({ pressed }) => [styles.tab, active && styles.activeTab, pressed && styles.pressedTab]}
            onPress={() => router.replace(tab.href as never)}
          >
            <Ionicons name={active ? tab.activeIcon : tab.icon} color={active ? "#ffffff" : "#64748b"} size={24} />
            <Text numberOfLines={1} style={[styles.label, active && styles.activeLabel]}>{tab.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "#dbe4f0",
    backgroundColor: "#ffffff",
    height: 74,
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 6,
    paddingVertical: 7,
  },
  tab: {
    width: "20%",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    paddingVertical: 6,
    gap: 3,
  },
  activeTab: {
    backgroundColor: "#0d6efd",
  },
  label: {
    color: "#64748b",
    fontSize: 10,
    lineHeight: 13,
    fontWeight: "800",
    textAlign: "center",
  },
  activeLabel: {
    color: "#ffffff",
  },
  pressedTab: {
    opacity: 0.75,
  },
});
