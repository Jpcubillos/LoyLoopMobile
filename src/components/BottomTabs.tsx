import { Link, usePathname } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

const tabs = [
  { label: "Inicio", href: "/" },
  { label: "Comercios", href: "/comercios" },
  { label: "Escanear", href: "/escanear" },
  { label: "Recompensas", href: "/recompensas" },
  { label: "Perfil", href: "/perfil" },
];

export function BottomTabs() {
  const pathname = usePathname();

  return (
    <View style={styles.container}>
      {tabs.map((tab) => {
        const active = pathname === tab.href;

        return (
          <Link key={tab.href} href={tab.href as never} style={[styles.tab, active && styles.activeTab]}>
            <Text style={[styles.label, active && styles.activeLabel]}>{tab.label}</Text>
          </Link>
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
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  tab: {
    flex: 1,
    borderRadius: 10,
    paddingVertical: 10,
  },
  activeTab: {
    backgroundColor: "#0d6efd",
  },
  label: {
    color: "#64748b",
    fontSize: 11,
    fontWeight: "800",
    textAlign: "center",
  },
  activeLabel: {
    color: "#ffffff",
  },
});
