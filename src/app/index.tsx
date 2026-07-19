import { Link } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { getBusinesses, type BusinessSummary } from "@/lib/loyloop-data";

export default function HomeScreen() {
  const [businesses, setBusinesses] = useState<BusinessSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getBusinesses()
      .then(setBusinesses)
      .finally(() => setLoading(false));
  }, []);

  const totalPoints = businesses.reduce((sum, business) => sum + business.points, 0);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <View>
            <Text style={styles.eyebrow}>Hola</Text>
            <Text style={styles.title}>Tus comercios</Text>
          </View>
          <Link href="/login" asChild>
            <Pressable style={styles.loginButton}>
              <Text style={styles.loginText}>Entrar</Text>
            </Pressable>
          </Link>
        </View>

        <View style={styles.hero}>
          <Text style={styles.heroTitle}>{totalPoints} puntos</Text>
          <Text style={styles.heroText}>Recompensas, sellos y creditos en comercios locales.</Text>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Registrados</Text>
          <Link href="/comercios">
            <Text style={styles.linkText}>Ver todos</Text>
          </Link>
        </View>

        {loading ? <ActivityIndicator color="#0d6efd" /> : null}

        {businesses.map((business) => (
          <Link key={business.id} href={`/comercio/${business.slug}`} asChild>
            <Pressable style={styles.businessCard}>
              <View>
                <Text style={styles.businessName}>{business.name}</Text>
                <Text style={styles.businessMeta}>{business.category}</Text>
              </View>
              <View style={styles.pointsPill}>
                <Text style={styles.pointsText}>{business.points} pts</Text>
                <Text style={styles.creditText}>{business.credit}</Text>
              </View>
            </Pressable>
          </Link>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  content: {
    padding: 20,
    paddingBottom: 110,
    gap: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  eyebrow: {
    color: "#64748b",
    fontSize: 14,
    fontWeight: "800",
  },
  title: {
    color: "#071225",
    fontSize: 30,
    fontWeight: "900",
  },
  loginButton: {
    borderRadius: 12,
    backgroundColor: "#0d6efd",
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  loginText: {
    color: "#ffffff",
    fontWeight: "900",
  },
  hero: {
    borderRadius: 18,
    backgroundColor: "#0d6efd",
    padding: 18,
  },
  heroTitle: {
    color: "#ffffff",
    fontSize: 28,
    fontWeight: "900",
  },
  heroText: {
    marginTop: 6,
    color: "#dbeafe",
    fontSize: 15,
    lineHeight: 22,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sectionTitle: {
    color: "#071225",
    fontSize: 18,
    fontWeight: "900",
  },
  linkText: {
    color: "#0d6efd",
    fontWeight: "900",
  },
  businessCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#dbe4f0",
    backgroundColor: "#ffffff",
    padding: 16,
  },
  businessName: {
    color: "#071225",
    fontSize: 16,
    fontWeight: "900",
  },
  businessMeta: {
    marginTop: 3,
    color: "#64748b",
    fontSize: 14,
  },
  pointsPill: {
    alignItems: "flex-end",
  },
  pointsText: {
    color: "#0d6efd",
    fontWeight: "900",
  },
  creditText: {
    color: "#047857",
    fontSize: 12,
    fontWeight: "800",
  },
});
