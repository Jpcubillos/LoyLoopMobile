import { Link, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { BottomTabs } from "@/components/BottomTabs";
import { getBusinessImage } from "@/lib/business-images";
import { getBusinesses, type BusinessSummary } from "@/lib/loyloop-data";

export default function HomeScreen() {
  const router = useRouter();
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
          <Text style={styles.eyebrow}>Hola</Text>
          <Pressable style={styles.loginButton} onPress={() => router.push("/login")}>
            <Text style={styles.loginText}>Entrar</Text>
          </Pressable>
          <Text style={styles.title}>Tus comercios</Text>
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
              <Image source={getBusinessImage(business.slug)} style={styles.businessImage} />
              <View style={styles.businessInfo}>
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
    padding: 20,
    paddingBottom: 110,
    gap: 12,
  },
  header: {
    position: "relative",
    minHeight: 64,
  },
  eyebrow: {
    color: "#64748b",
    fontSize: 14,
    fontWeight: "800",
  },
  title: {
    marginTop: 6,
    color: "#071225",
    fontSize: 30,
    fontWeight: "900",
  },
  loginButton: {
    position: "absolute",
    top: 0,
    right: 0,
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
    gap: 16,
  },
  businessImage: {
    width: 58,
    height: 58,
    borderRadius: 12,
    backgroundColor: "#e2e8f0",
  },
  businessInfo: {
    flex: 1,
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
