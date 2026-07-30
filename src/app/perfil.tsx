import { Link, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { BottomTabs } from "@/components/BottomTabs";
import { getCurrentSession, signOut } from "@/lib/auth";

export default function PerfilScreen() {
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    getCurrentSession()
      .then((session) => setEmail(session?.user.email ?? null))
      .catch(() => setEmail(null));
  }, []);

  async function handleSignOut() {
    await signOut();
    router.replace("/login");
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.content}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{email?.slice(0, 2).toUpperCase() ?? "LL"}</Text>
        </View>
        <Text style={styles.title}>Perfil</Text>
        <Text style={styles.subtitle}>{email ?? "Aun no has iniciado sesion"}</Text>

        <View style={styles.summary}>
          <View style={styles.metric}>
            <Text style={styles.metricValue}>3</Text>
            <Text style={styles.metricLabel}>comercios</Text>
          </View>
          <View style={styles.metric}>
            <Text style={styles.metricValue}>245</Text>
            <Text style={styles.metricLabel}>puntos</Text>
          </View>
          <View style={styles.metric}>
            <Text style={styles.metricValue}>4</Text>
            <Text style={styles.metricLabel}>premios</Text>
          </View>
        </View>

        {email ? (
          <Pressable style={styles.button} onPress={handleSignOut}>
            <Text style={styles.buttonText}>Cerrar sesion</Text>
          </Pressable>
        ) : (
          <Link href="/login" asChild>
            <Pressable style={styles.button}>
              <Text style={styles.buttonText}>Entrar</Text>
            </Pressable>
          </Link>
        )}
      </View>
      <BottomTabs />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  content: {
    flex: 1,
    padding: 20,
    paddingBottom: 110,
    gap: 14,
  },
  avatar: {
    width: 68,
    height: 68,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 34,
    backgroundColor: "#dbeafe",
  },
  avatarText: {
    color: "#0d6efd",
    fontSize: 20,
    fontWeight: "900",
  },
  title: {
    color: "#071225",
    fontSize: 30,
    fontWeight: "900",
  },
  subtitle: {
    color: "#64748b",
    fontSize: 15,
  },
  summary: {
    flexDirection: "row",
    gap: 10,
  },
  metric: {
    flex: 1,
    borderRadius: 14,
    backgroundColor: "#ffffff",
    padding: 14,
  },
  metricValue: {
    color: "#071225",
    fontSize: 22,
    fontWeight: "900",
    textAlign: "center",
  },
  metricLabel: {
    color: "#64748b",
    fontSize: 12,
    fontWeight: "800",
    textAlign: "center",
  },
  button: {
    marginTop: 10,
    borderRadius: 12,
    backgroundColor: "#0d6efd",
    paddingVertical: 14,
  },
  buttonText: {
    color: "#ffffff",
    fontWeight: "900",
    textAlign: "center",
  },
});
